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

export const PassportProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [stamps, setStamps] = useState<Record<string, StampedMonumentRecord>>({});
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

      return updated;
    });
  }, []);

  const clearStampAlert = useCallback(() => {}, []);

  const isMonumentStamped = useCallback((slug: string) => {
    return Boolean(stamps[slug]);
  }, [stamps]);

  return (
    <PassportContext.Provider
      value={{
        stamps,
        stampMonument,
        isMonumentStamped,
        totalStamped,
        totalAvailable: TOTAL_MONUMENTS,
        activeStampAlert: null,
        clearStampAlert,
        curatorRank,
        isPassportOpen,
        setIsPassportOpen,
      }}
    >
      {children}
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
