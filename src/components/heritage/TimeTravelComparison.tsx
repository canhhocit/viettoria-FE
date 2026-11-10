import React, { useState, useRef, useCallback } from 'react';
import { Clock, History } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

interface TimeTravelItem {
  id: string;
  name: string;
  epoch: string;
  pastYear: string;
  presentYear: string;
  pastLabel: string;
  presentLabel: string;
  historicalDesc: string;
  archivalSource: string;
  imageSrc: string;
}

const COMPARISON_DATA: TimeTravelItem[] = [
  {
    id: 'chua-mot-cot',
    name: 'Chùa Một Cột (Diên Hựu Tự)',
    epoch: 'Triều Lý · Khởi dựng 1049',
    pastYear: '1898',
    presentYear: '2026',
    pastLabel: 'Ảnh tư liệu EFEO 1898',
    presentLabel: 'Mô hình phục dựng Viettoria',
    historicalDesc:
      'Chùa Một Cột nguyên bản dựng trên trụ đá đơn giữa hồ sen Linh Chiểu thời Lý Thái Tông. Trải qua thăng trầm và biến cố bị giật sập năm 1954, công trình được phục dựng lại trên trụ bê tông đá. Viettoria đối sánh từng bản vẽ khảo cổ để tái hiện đúng tỷ lệ mái đao uốn cong thanh thoát.',
    archivalSource: 'Lưu trữ Viện Viễn Đông Bác Cổ (EFEO Paris) & Viettoria Atelier',
    imageSrc: '/viettoria_img/curated-chua-mot-cot.png',
  },
  {
    id: 'khue-van-cac',
    name: 'Khuê Văn Các (Văn Miếu)',
    epoch: 'Triều Nguyễn · Dựng năm 1805',
    pastYear: '1905',
    presentYear: '2026',
    pastLabel: 'Bản dập khảo tả 1905',
    presentLabel: 'Nguyên mẫu số hóa 2026',
    historicalDesc:
      'Gác sao Khuê soi bóng hồ Thiên Quang, đỉnh cao của tư duy kiến trúc gỗ truyền thống kết hợp biểu tượng văn hiến. Từng ô cửa tròn tượng trưng cho trời, vuông tượng trưng cho đất được phục chế chuẩn xác từng đường vát mộng gỗ.',
    archivalSource: 'Tư liệu Sở Toàn quyền Đông Dương & Trung tâm Bảo tồn Văn Miếu',
    imageSrc: '/viettoria_img/curated-khue-van-cac.png',
  },
  {
    id: 'ngo-mon-hue',
    name: 'Ngọ Môn (Hoàng Thành Huế)',
    epoch: 'Triều Nguyễn · Minh Mạng 1833',
    pastYear: '1920',
    presentYear: '2026',
    pastLabel: 'Ảnh nghi lễ Nam Giao 1920',
    presentLabel: 'Chế tác sơn son thếp vàng 2026',
    historicalDesc:
      'Cửa chính Nam của Hoàng thành Huế với tầng dưới xây bằng đá hoa cương Thanh Hóa, tầng trên là Lầu Ngũ Phụng mái lợp ngói hoàng lưu ly và thanh lưu ly lộng lẫy. Mô hình tái hiện cấu trúc cánh gà chữ U đặc trưng.',
    archivalSource: 'Trung tâm Bảo tồn Di tích Cố đô Huế & Viettoria Lưu Trữ',
    imageSrc: '/viettoria_img/curated-ngo-mon.png',
  },
];

export const TimeTravelComparison: React.FC<{ defaultId?: string }> = ({ defaultId = 'chua-mot-cot' }) => {
  const { t } = useLanguage();
  const [selectedId, setSelectedId] = useState<string>(defaultId);
  const [sliderPosition, setSliderPosition] = useState<number>(50); // percentage 0 - 100
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const activeItem = COMPARISON_DATA.find((item) => item.id === selectedId) || COMPARISON_DATA[0];

  const updatePosition = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const offsetX = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (offsetX / rect.width) * 100));
    setSliderPosition(percentage);
  }, []);

  const handleMouseDown = () => setIsDragging(true);
  const handleMouseUp = () => setIsDragging(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    updatePosition(e.clientX);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches[0]) {
      updatePosition(e.touches[0].clientX);
    }
  };

  return (
    <section className="heritage-timetravel-section border-y border-paper-border bg-paper-warm py-16 sm:py-20">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-16">
        {/* Section Header */}
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end mb-10">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-brass">
              <History size={15} />
              <p className="font-cinzel text-xs font-bold uppercase tracking-[0.2em]">
                {t('timetravel.eyebrow', 'Khảo Cứu Xuyên Thế Kỷ · 1900 ↔ 2026')}
              </p>
            </div>
            <h2 className="mt-2 font-display text-3xl font-bold leading-tight text-forest sm:text-4xl">
              {t('timetravel.heading', 'Dấu Xưa & Diện Mạo Phục Dựng')}
            </h2>
            <p className="mt-2.5 text-sm sm:text-base leading-relaxed text-charcoal/85 font-normal">
              {t(
                'timetravel.desc',
                'Kéo thanh trượt để chứng kiến sự chuyển biến của thời gian: từ những thước ảnh tư liệu đen trắng thế kỷ XIX sang mô hình phục dựng chi tiết ngày nay.'
              )}
            </p>
          </div>

          {/* Monument Selector Tabs */}
          <nav className="flex flex-wrap items-center gap-2" aria-label="Chọn công trình so sánh">
            {COMPARISON_DATA.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setSelectedId(item.id)}
                className={`border px-3 py-2 text-xs font-sans transition-all rounded-[2px] ${
                  selectedId === item.id
                    ? 'border-forest bg-forest text-brass font-bold shadow-xs'
                    : 'border-paper-border bg-paper text-forest hover:border-brass hover:bg-paper-warm font-medium'
                }`}
              >
                <span>{item.name}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Interactive Comparison Slider Frame */}
        <div className="corner-frame border-2 border-brass/50 bg-paper p-3 sm:p-5 shadow-xl">
          <div
            ref={containerRef}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onMouseMove={handleMouseMove}
            onTouchMove={handleTouchMove}
            className="relative aspect-[16/10] sm:aspect-[21/10] w-full overflow-hidden select-none cursor-ew-resize bg-paper-card"
          >
            {/* 1. Present / Restored Layer (Underneath / Right side) */}
            <div className="absolute inset-0 h-full w-full">
              <img
                src={activeItem.imageSrc}
                alt={`${activeItem.name} phục dựng 2026`}
                className="h-full w-full object-contain p-4 sm:p-8"
              />
              {/* Right Tag */}
              <div className="pointer-events-none absolute bottom-4 right-4 z-10 border border-brass/60 bg-forest/90 px-3 py-1.5 text-xs text-paper backdrop-blur-sm rounded-[1px]">
                <span className="font-cinzel text-[10px] font-bold text-brass uppercase tracking-wider block">
                  Hiện Tại · {activeItem.presentYear}
                </span>
                <span className="font-sans text-[11px] font-medium text-paper">
                  {activeItem.presentLabel}
                </span>
              </div>
            </div>

            {/* 2. Past / Archival Layer (Clipped / Left side) */}
            <div
              className="absolute inset-0 h-full overflow-hidden transition-none"
              style={{ width: `${sliderPosition}%` }}
            >
              <div className="relative h-full w-full bg-[#EAE2D2]">
                {/* Archival sepia/grain photo effect */}
                <img
                  src={activeItem.imageSrc}
                  alt={`${activeItem.name} ảnh tư liệu ${activeItem.pastYear}`}
                  className="h-full w-full object-contain p-4 sm:p-8 filter grayscale contrast-125 sepia-[0.45] brightness-95"
                />

                {/* EFEO Archival Watermark Seal */}
                <div className="pointer-events-none absolute top-4 left-4 z-10 flex items-center gap-1.5 border border-charcoal/40 bg-paper/85 px-2.5 py-1 text-[10px] font-cinzel font-bold text-charcoal backdrop-blur-xs">
                  <Clock size={11} className="text-brass-dark" />
                  <span>EFEO ARCHIVE · {activeItem.pastYear}</span>
                </div>

                {/* Left Tag */}
                <div className="pointer-events-none absolute bottom-4 left-4 z-10 border border-charcoal/60 bg-[#2A231C]/90 px-3 py-1.5 text-xs text-paper backdrop-blur-sm rounded-[1px]">
                  <span className="font-cinzel text-[10px] font-bold text-brass-subtle uppercase tracking-wider block">
                    Ký Ức · {activeItem.pastYear}
                  </span>
                  <span className="font-sans text-[11px] font-medium text-paper/90">
                    {activeItem.pastLabel}
                  </span>
                </div>
              </div>
            </div>

            {/* 3. Divider Line & Brass Knob */}
            <div
              className="pointer-events-none absolute inset-y-0 z-20 w-1 bg-brass shadow-lg"
              style={{ left: `${sliderPosition}%` }}
            >
              {/* Antique Engraved Medallion Handle */}
              <div className="pointer-events-auto absolute top-1/2 -translate-x-1/2 -translate-y-1/2 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full border-2 border-brass bg-forest text-brass shadow-2xl hover:scale-110 transition-transform">
                <span className="font-cinzel text-[9px] sm:text-[10px] font-bold tracking-tighter">
                  1900◄►2026
                </span>
              </div>
            </div>
          </div>

          {/* Historical Commentary Note */}
          <div className="mt-5 border-t border-paper-border pt-4 sm:flex sm:items-center sm:justify-between sm:gap-6">
            <div className="max-w-3xl">
              <span className="font-cinzel text-[10px] font-bold uppercase tracking-widest text-brass block">
                {activeItem.epoch}
              </span>
              <p className="mt-1 text-xs sm:text-sm text-charcoal/85 font-normal leading-relaxed">
                {activeItem.historicalDesc}
              </p>
            </div>
            <div className="mt-3 sm:mt-0 text-left sm:text-right shrink-0">
              <span className="font-mono text-[10px] text-charcoal-muted uppercase block">
                Nguồn Tư Liệu:
              </span>
              <span className="font-sans text-[11px] font-medium text-forest">
                {activeItem.archivalSource}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
