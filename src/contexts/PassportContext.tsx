import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

export interface StampedMonumentRecord {
  slug: string;
  title: string;
  epoch: string;
  stampedAt: string;
}

interface PassportContextType {
  stamps: Record<string, StampedMonumentRecord>;
  stampMonument: (slug: string, title: string, epoch: string) => void;
  isMonumentStamped: (slug: string) => boolean;
  totalStamped: number;
  totalAvailable: number;
  activeStampAlert: StampedMonumentRecord | null;
  clearStampAlert: () => void;
  curatorRank: { title: string; badge: string };
  isPassportOpen: boolean;
  setIsPassportOpen: (open: boolean) => void;
}

const STORAGE_KEY = 'viettoria_heritage_passport_records';

const TOTAL_MONUMENTS = 5;

const CANONICAL_MONUMENTS: Record<string, { title: string; epoch: string; location: string }> = {
  'chua-mot-cot': { title: 'Chùa Một Cột', epoch: 'Triều Lý · 1049', location: 'Hà Nội' },
  'khue-van-cac': { title: 'Khuê Văn Các', epoch: 'Triều Nguyễn · 1805', location: 'Hà Nội' },
  'ngo-mon-hue': { title: 'Ngọ Môn Huế', epoch: 'Triều Nguyễn · 1833', location: 'Thừa Thiên Huế' },
  'cot-co-ha-noi': { title: 'Cột Cờ Hà Nội', epoch: 'Triều Nguyễn · 1812', location: 'Hà Nội' },
  'ben-nha-rong': { title: 'Bến Nhà Rồng', epoch: 'Thế kỷ XIX · 1863', location: 'TP. Hồ Chí Minh' },
};

const PassportContext = createContext<PassportContextType | undefined>(undefined);

// Synthesize authentic wooden/jade imperial seal stamp acoustic impact
const playStampAudio = () => {
  try {
    if (typeof window === 'undefined') return;
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const now = ctx.currentTime;

    // Low-frequency wooden thud
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(120, now);
    osc.frequency.exponentialRampToValueAtTime(35, now + 0.12);

    gain.gain.setValueAtTime(0.8, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.2);

    // Subtle paper friction noise
    const bufferSize = ctx.sampleRate * 0.1;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.15;
    }
    const noise = ctx.createBufferSource();
    noise.buffer = noiseBuffer;
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(450, now);
    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.3, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(ctx.destination);

    noise.start(now);
    noise.stop(now + 0.1);
  } catch {
    // Audio synthesis failure safe fallback
  }
};

export const PassportProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [stamps, setStamps] = useState<Record<string, StampedMonumentRecord>>({});
  const [activeStampAlert, setActiveStampAlert] = useState<StampedMonumentRecord | null>(null);
  const [isPassportOpen, setIsPassportOpen] = useState(false);

  // Load from local storage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setStamps(JSON.parse(saved));
      }
    } catch {
      // ignore
    }
  }, []);

  const totalStamped = Object.keys(stamps).length;

  const curatorRank = React.useMemo(() => {
    if (totalStamped >= 5) {
      return { title: 'Thượng Thư Khảo Cổ Viện', badge: 'Bậc Tinh Hoa' };
    }
    if (totalStamped >= 3) {
      return { title: 'Giám Định Viên Di Sản', badge: 'Bậc Kỳ Cựu' };
    }
    if (totalStamped >= 1) {
      return { title: 'Ký Lục Khảo Cứu', badge: 'Bậc Khởi Khai' };
    }
    return { title: 'Khách Thưởng Ngoạn', badge: 'Sơ Nhập' };
  }, [totalStamped]);

  const stampMonument = useCallback((slug: string, title: string, epoch: string) => {
    if (!slug) return;
    setStamps((prev) => {
      if (prev[slug]) return prev; // Already stamped

      const newRecord: StampedMonumentRecord = {
        slug,
        title: title || CANONICAL_MONUMENTS[slug]?.title || slug,
        epoch: epoch || CANONICAL_MONUMENTS[slug]?.epoch || 'Di sản Việt',
        stampedAt: new Date().toLocaleDateString('vi-VN', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        }),
      };

      const updated = { ...prev, [slug]: newRecord };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // ignore
      }

      playStampAudio();
      setActiveStampAlert(newRecord);

      return updated;
    });
  }, []);

  const clearStampAlert = useCallback(() => {
    setActiveStampAlert(null);
  }, []);

  const isMonumentStamped = useCallback((slug: string) => {
    return Boolean(stamps[slug]);
  }, [stamps]);

  // Auto clear popup after 5 seconds
  useEffect(() => {
    if (!activeStampAlert) return;
    const timer = setTimeout(() => {
      setActiveStampAlert(null);
    }, 5000);
    return () => clearTimeout(timer);
  }, [activeStampAlert]);

  return (
    <PassportContext.Provider
      value={{
        stamps,
        stampMonument,
        isMonumentStamped,
        totalStamped,
        totalAvailable: TOTAL_MONUMENTS,
        activeStampAlert,
        clearStampAlert,
        curatorRank,
        isPassportOpen,
        setIsPassportOpen,
      }}
    >
      {children}

      {/* Vermilion Seal Stamping Alert Notification */}
      {activeStampAlert && (
        <div className="fixed bottom-6 right-6 z-[90] max-w-sm border-2 border-cinnabar bg-paper p-4 shadow-2xl rounded-[2px] animate-bounce-short">
          <div className="flex items-start gap-3.5">
            {/* Square Vermilion Seal Graphic */}
            <div className="relative flex h-14 w-14 shrink-0 items-center justify-center border-2 border-cinnabar bg-cinnabar/10 p-1 text-cinnabar rotate-[-3deg] shadow-inner">
              <div className="border border-cinnabar/60 w-full h-full flex flex-col items-center justify-center text-center p-0.5">
                <span className="font-cinzel text-[8px] font-bold tracking-widest leading-none">VIETTORIA</span>
                <span className="font-serif text-[10px] font-extrabold leading-tight text-cinnabar-dark">CHÂU PHÊ</span>
                <span className="font-cinzel text-[7px] tracking-tight">HOÀN TẤT</span>
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <p className="font-cinzel text-[10px] font-bold uppercase tracking-widest text-brass">
                Triện Son Đã Đóng
              </p>
              <h4 className="font-serif text-base font-bold text-forest truncate mt-0.5">
                {activeStampAlert.title}
              </h4>
              <p className="text-[11px] text-charcoal/80 mt-0.5">
                Đã chứng thực khảo cứu vào Hộ chiếu Di sản của bạn.
              </p>
              <button
                type="button"
                onClick={() => {
                  setActiveStampAlert(null);
                  setIsPassportOpen(true);
                }}
                className="mt-2 inline-flex items-center gap-1 font-sans text-xs font-bold uppercase tracking-wider text-forest hover:text-brass underline decoration-brass/60"
              >
                Mở Hộ Chiếu ({totalStamped}/{TOTAL_MONUMENTS}) →
              </button>
            </div>

            <button
              type="button"
              onClick={clearStampAlert}
              className="text-charcoal-muted hover:text-forest text-xs p-1"
              aria-label="Đóng thông báo"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </PassportContext.Provider>
  );
};

export const usePassport = (): PassportContextType => {
  const context = useContext(PassportContext);
  if (!context) {
    throw new Error('usePassport must be used within a PassportProvider');
  }
  return context;
};
