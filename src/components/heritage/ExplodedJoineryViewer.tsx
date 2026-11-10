import React, { useState } from 'react';
import { Layers, Play, Pause, RotateCcw, Info } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

interface JoineryTier {
  id: string;
  number: string;
  name: string;
  joineryName: string;
  technique: string;
  role: string;
  imageSrc: string;
}

const JOINERY_TIERS: JoineryTier[] = [
  {
    id: 'tier-roof',
    number: '01',
    name: 'Mái Ngói Mũi Hài & Đầu Đao',
    joineryName: 'Mộng then cài mui rùa',
    technique: 'Độ dốc thoải thoát nước mưa, ngói nung đất sét làng gốm Bát Tràng lợp so le vảy rồng.',
    role: 'Bảo vệ toàn bộ cấu kiện gỗ bên dưới khỏi mưa nắng nhiệt đới nghìn năm.',
    imageSrc: '/viettoria_img/curated-assembly-mong.png',
  },
  {
    id: 'tier-bracket',
    number: '02',
    name: 'Hệ Đấu Củng & Kẻ Chuyền',
    joineryName: 'Khớp củng âm dương',
    technique: 'Hệ thống con sơn, tay củng vươn ra đỡ mái đua xa mà không cần thêm cột phụ.',
    role: 'Hấp thụ dao động địa chấn, phân bổ hàng tấn ngói đá đều vào các đầu cột.',
    imageSrc: '/viettoria_img/curated-khue-van-cac.png',
  },
  {
    id: 'tier-body',
    number: '03',
    name: 'Thân Gác & Khung Cửa Bức Bàn',
    joineryName: 'Mộng đuôi én & then gài',
    technique: 'Các thanh xà ngang đục mộng ngậm chặt vào cột cái, không dùng một chiếc đinh sắt nào.',
    role: 'Tạo nên buồng thờ tôn nghiêm, chịu lực giằng ngang trước bão tố.',
    imageSrc: '/viettoria_img/curated-chua-mot-cot.png',
  },
  {
    id: 'tier-base',
    number: '04',
    name: 'Cột Quân Gỗ Lim & Chân Tảng Đá',
    joineryName: 'Chân tảng kê tự do',
    technique: 'Đá xanh nguyên khối đục cánh sen thời Lý. Đầu cột kê tự do trên đá không chôn chặt.',
    role: 'Cách ly gỗ khỏi ẩm đất, cho phép cả ngôi chùa tự cân bằng dịch chuyển khi rung chấn.',
    imageSrc: '/viettoria_img/curated-ngo-mon.png',
  },
];

export const ExplodedJoineryViewer: React.FC = () => {
  const { t } = useLanguage();
  const [explodeProgress, setExplodeProgress] = useState<number>(35); // 0 to 100%
  const [activeTierId, setActiveTierId] = useState<string>('tier-bracket');
  const [isPlayingAuto, setIsPlayingAuto] = useState<boolean>(false);

  // Auto demonstration scrubber animation
  React.useEffect(() => {
    if (!isPlayingAuto) return;
    let forward = true;
    const interval = window.setInterval(() => {
      setExplodeProgress((prev) => {
        if (prev >= 100) forward = false;
        if (prev <= 0) forward = true;
        return forward ? prev + 1.2 : prev - 1.2;
      });
    }, 40);

    return () => window.clearInterval(interval);
  }, [isPlayingAuto]);

  const activeTier = JOINERY_TIERS.find((tier) => tier.id === activeTierId) || JOINERY_TIERS[1];

  // Calculate vertical separation offsets
  const roofOffset = -(explodeProgress * 0.95); // Moves up
  const bracketOffset = -(explodeProgress * 0.35); // Moves slightly up
  const bodyOffset = explodeProgress * 0.15; // Centered
  const baseOffset = explodeProgress * 0.65; // Moves down

  return (
    <section className="heritage-joinery-section border-b border-paper-border bg-paper py-16 sm:py-24">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-16">
        {/* Section Header */}
        <div className="max-w-3xl mb-10">
          <div className="flex items-center gap-2 text-brass">
            <Layers size={16} />
            <p className="font-cinzel text-xs font-bold uppercase tracking-[0.2em]">
              {t('joinery.eyebrow', 'Bí Thuật Kiến Trúc Gỗ Việt · Không Dùng Đinh')}
            </p>
          </div>
          <h2 className="mt-2 font-display text-3xl font-bold leading-tight text-forest sm:text-4xl">
            {t('joinery.heading', 'Bóc Tách Cấu Kiện Mộng Khớp Âm Dương')}
          </h2>
          <p className="mt-3 text-sm sm:text-base leading-relaxed text-charcoal/85 font-normal">
            {t(
              'joinery.desc',
              'Kéo thanh trượt để chứng kiến hàng trăm cấu kiện mộng gỗ tự động tách rời theo phương thẳng đứng, hé lộ nghệ thuật ghép nối ngàn năm của các bậc tiền nhân.'
            )}
          </p>
        </div>

        {/* Master Joinery Interactive Stage */}
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] items-start">
          {/* Left: Exploded Stage Visualizer */}
          <div className="corner-frame border-2 border-brass/50 bg-paper-card p-4 sm:p-6 shadow-xl relative overflow-hidden">
            {/* Stage Backdrop Guidelines */}
            <div className="absolute inset-0 bg-[radial-gradient(#B88A38_1px,transparent_1px)] [background-size:24px_24px] opacity-15 pointer-events-none" />

            {/* Central Alignment Axis */}
            <div className="absolute left-1/2 top-4 bottom-4 w-px -translate-x-1/2 border-l border-dashed border-brass/40 pointer-events-none" />

            {/* Exploded Layers Display Area */}
            <div className="relative min-h-[420px] sm:min-h-[480px] flex flex-col items-center justify-center py-6">
              {/* Tier 1: Roof System */}
              <div
                style={{ transform: `translateY(${roofOffset}px)` }}
                onClick={() => setActiveTierId('tier-roof')}
                className={`relative w-64 sm:w-80 cursor-pointer transition-transform duration-100 p-2 border rounded-[2px] ${
                  activeTierId === 'tier-roof'
                    ? 'border-brass bg-forest text-paper shadow-xl'
                    : 'border-paper-border/80 bg-paper/90 text-forest hover:border-brass'
                }`}
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-cinzel font-bold text-brass">01 · MÁI NGÓI</span>
                  <span className="font-sans text-[10px] uppercase tracking-wider opacity-80">Mái Đao Cong</span>
                </div>
                <div className="mt-1 h-16 w-full overflow-hidden bg-forest/10 flex items-center justify-center">
                  <img
                    src={JOINERY_TIERS[0].imageSrc}
                    alt="Mái ngói"
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>

              {/* Connecting Dashed Vector */}
              <div
                style={{ height: `${Math.max(12, explodeProgress * 0.4)}px` }}
                className="w-px border-l-2 border-dotted border-brass/60 my-1 transition-all"
              />

              {/* Tier 2: Bracket System (Đấu Củng) */}
              <div
                style={{ transform: `translateY(${bracketOffset}px)` }}
                onClick={() => setActiveTierId('tier-bracket')}
                className={`relative w-60 sm:w-72 cursor-pointer transition-transform duration-100 p-2 border rounded-[2px] ${
                  activeTierId === 'tier-bracket'
                    ? 'border-brass bg-forest text-paper shadow-xl'
                    : 'border-paper-border/80 bg-paper/90 text-forest hover:border-brass'
                }`}
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-cinzel font-bold text-brass">02 · ĐẤU CỦNG</span>
                  <span className="font-sans text-[10px] uppercase tracking-wider opacity-80">Tay Củng Chuyển Lực</span>
                </div>
                <div className="mt-1 h-14 w-full overflow-hidden bg-forest/10 flex items-center justify-center">
                  <img
                    src={JOINERY_TIERS[1].imageSrc}
                    alt="Đấu củng"
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>

              {/* Connecting Dashed Vector */}
              <div
                style={{ height: `${Math.max(12, explodeProgress * 0.3)}px` }}
                className="w-px border-l-2 border-dotted border-brass/60 my-1 transition-all"
              />

              {/* Tier 3: Body Frame & Doors */}
              <div
                style={{ transform: `translateY(${bodyOffset}px)` }}
                onClick={() => setActiveTierId('tier-body')}
                className={`relative w-56 sm:w-68 cursor-pointer transition-transform duration-100 p-2 border rounded-[2px] ${
                  activeTierId === 'tier-body'
                    ? 'border-brass bg-forest text-paper shadow-xl'
                    : 'border-paper-border/80 bg-paper/90 text-forest hover:border-brass'
                }`}
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-cinzel font-bold text-brass">03 · THÂN GÁC</span>
                  <span className="font-sans text-[10px] uppercase tracking-wider opacity-80">Cửa Bức Bàn</span>
                </div>
                <div className="mt-1 h-14 w-full overflow-hidden bg-forest/10 flex items-center justify-center">
                  <img
                    src={JOINERY_TIERS[2].imageSrc}
                    alt="Thân gác"
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>

              {/* Connecting Dashed Vector */}
              <div
                style={{ height: `${Math.max(12, explodeProgress * 0.4)}px` }}
                className="w-px border-l-2 border-dotted border-brass/60 my-1 transition-all"
              />

              {/* Tier 4: Pillars & Stone Base */}
              <div
                style={{ transform: `translateY(${baseOffset}px)` }}
                onClick={() => setActiveTierId('tier-base')}
                className={`relative w-64 sm:w-80 cursor-pointer transition-transform duration-100 p-2 border rounded-[2px] ${
                  activeTierId === 'tier-base'
                    ? 'border-brass bg-forest text-paper shadow-xl'
                    : 'border-paper-border/80 bg-paper/90 text-forest hover:border-brass'
                }`}
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-cinzel font-bold text-brass">04 · CHÂN TẢNG ĐÁ</span>
                  <span className="font-sans text-[10px] uppercase tracking-wider opacity-80">Gỗ Lim & Đá Sen</span>
                </div>
                <div className="mt-1 h-14 w-full overflow-hidden bg-forest/10 flex items-center justify-center">
                  <img
                    src={JOINERY_TIERS[3].imageSrc}
                    alt="Chân tảng đá"
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Bottom Scrubber Control Panel */}
            <div className="mt-4 border-t border-paper-border pt-4">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-cinzel font-bold uppercase tracking-wider text-forest">
                  Độ Bóc Tách: {Math.round(explodeProgress)}%
                </span>
                <span className="text-charcoal-muted text-[11px]">
                  {explodeProgress < 20
                    ? 'Khít khao nguyên khối'
                    : explodeProgress > 75
                      ? 'Bóc tách hoàn toàn (Exploded View)'
                      : 'Đang tách khớp mộng'}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsPlayingAuto((p) => !p)}
                  className="flex h-9 w-9 shrink-0 items-center justify-center border border-brass bg-forest text-brass hover:bg-forest-dark transition-colors rounded-[2px]"
                  title={isPlayingAuto ? 'Tạm dừng tự động' : 'Tự động bóc tách'}
                >
                  {isPlayingAuto ? <Pause size={14} /> : <Play size={14} />}
                </button>

                <input
                  type="range"
                  min="0"
                  max="100"
                  value={explodeProgress}
                  onChange={(e) => {
                    setIsPlayingAuto(false);
                    setExplodeProgress(parseFloat(e.target.value));
                  }}
                  className="w-full accent-[#B88A38] cursor-pointer"
                  aria-label="Thanh trượt bóc tách cấu kiện mộng gỗ"
                />

                <button
                  type="button"
                  onClick={() => {
                    setIsPlayingAuto(false);
                    setExplodeProgress(0);
                  }}
                  className="flex h-9 w-9 shrink-0 items-center justify-center border border-paper-border bg-paper text-forest hover:border-brass transition-colors rounded-[2px]"
                  title="Đặt lại khít khao"
                >
                  <RotateCcw size={14} className="text-brass" />
                </button>
              </div>
            </div>
          </div>

          {/* Right: Technical Joinery Dossier Card */}
          <div className="corner-frame border-2 border-brass/50 bg-paper p-6 shadow-xl">
            <div className="flex items-center gap-2 border-b border-paper-border pb-3">
              <Info size={16} className="text-brass" />
              <span className="font-cinzel text-xs font-bold uppercase tracking-widest text-brass">
                Khảo Cứu Cấu Kiện · Tầng {activeTier.number}
              </span>
            </div>

            <h3 className="mt-3 font-display text-2xl font-bold text-forest">
              {activeTier.name}
            </h3>

            <div className="mt-3 space-y-3">
              <div className="border border-paper-border bg-paper-warm p-3 rounded-[2px]">
                <span className="font-cinzel text-[10px] uppercase font-bold text-brass block">
                  Phương Pháp Ghép Mộng
                </span>
                <p className="font-serif text-base font-bold text-forest mt-0.5">
                  {activeTier.joineryName}
                </p>
              </div>

              <div>
                <span className="font-sans text-xs font-semibold text-forest uppercase tracking-wider">
                  Kỹ Thuật Chế Tác:
                </span>
                <p className="mt-1 text-xs sm:text-sm text-charcoal/85 leading-relaxed font-normal">
                  {activeTier.technique}
                </p>
              </div>

              <div className="border-t border-paper-border pt-3">
                <span className="font-sans text-xs font-semibold text-forest uppercase tracking-wider">
                  Công Năng Chịu Lực & Di Sản:
                </span>
                <p className="mt-1 text-xs sm:text-sm text-charcoal/85 leading-relaxed font-normal">
                  {activeTier.role}
                </p>
              </div>
            </div>

            {/* Quick Switcher for 4 Tiers */}
            <div className="mt-6 border-t border-paper-border pt-4">
              <span className="font-cinzel text-[10px] uppercase font-bold text-charcoal-muted block mb-2">
                Chọn Cấu Kiện Xem Chi Tiết
              </span>
              <div className="grid grid-cols-2 gap-2">
                {JOINERY_TIERS.map((tier) => (
                  <button
                    key={tier.id}
                    type="button"
                    onClick={() => setActiveTierId(tier.id)}
                    className={`p-2 text-left text-xs rounded-[2px] border transition-all ${
                      activeTierId === tier.id
                        ? 'border-forest bg-forest text-paper font-semibold'
                        : 'border-paper-border bg-paper hover:border-brass text-forest'
                    }`}
                  >
                    <span className="font-cinzel text-[9px] text-brass block">{tier.number}</span>
                    <span className="truncate block">{tier.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
