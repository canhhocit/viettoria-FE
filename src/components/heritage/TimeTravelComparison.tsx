import React, { useState, useRef, useCallback } from 'react';
import { Clock, History, Eye, Box } from 'lucide-react';
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
  pastImageSrc: string;
  presentRealImageSrc: string;
  present3DImageSrc: string;
}

const COMPARISON_DATA: TimeTravelItem[] = [
  {
    id: 'chua-mot-cot',
    name: 'Chùa Một Cột (Diên Hựu Tự)',
    epoch: 'Triều Lý · Khởi dựng 1049',
    pastYear: '1896',
    presentYear: '2026',
    pastLabel: 'Bản kính gốc tháng 4/1896 (Firmin-André Salles)',
    presentLabel: 'Di tích thực tế rợp bóng sen',
    historicalDesc:
      'Bức ảnh quý hiếm chụp tháng 4 năm 1896 bởi nhiếp ảnh gia Firmin-André Salles ghi lại Chùa Một Cột nguyên bản với trụ đá đơn và các thanh giằng gỗ lim thời Lý - Trần trước khi bị đặt mìn phá hủy năm 1954. Đối chiếu trực tiếp với di tích ngày nay và mô hình phục chế nguyên mẫu bảo tàng.',
    archivalSource: 'Lưu trữ Viện Viễn Đông Bác Cổ (EFEO Paris) & Sưu tập Firmin-André Salles 1896',
    pastImageSrc: '/images/historical/chua-mot-cot-1896.jpg',
    presentRealImageSrc: '/images/chua-mot-cot.webp',
    present3DImageSrc: '/3D/chua-mot-cot-poster.webp',
  },
  {
    id: 'ngo-mon-hue',
    name: 'Ngọ Môn (Hoàng Thành Huế)',
    epoch: 'Triều Nguyễn · Minh Mạng 1833',
    pastYear: '1900',
    presentYear: '2026',
    pastLabel: 'Bưu thiếp Annam - Hué thời Thành Thái (1900)',
    presentLabel: 'Ngọ Môn & Lầu Ngũ Phụng ngày nay',
    historicalDesc:
      'Hình ảnh Ngọ Môn và hồ Ngoại Kim Thủy chụp đầu thế kỷ XX (khoảng năm 1900). Khối đế đá hoa cương Thanh Hóa rêu phong nâng đỡ Lầu Ngũ Phụng 100 gian cột gỗ lim. Kéo thanh trượt để thấy màu ngói hoàng lưu ly và thanh lưu ly rực rỡ sau các đợt đại trùng tu bảo tồn.',
    archivalSource: 'Kho lưu trữ Bưu thiếp Đông Dương & Trung tâm Bảo tồn Di tích Cố đô Huế',
    pastImageSrc: '/images/historical/ngo-mon-hue-1900.jpg',
    presentRealImageSrc: '/images/thua-thien-hue.webp',
    present3DImageSrc: '/3D/ngo-mon-hue-poster.webp',
  },
  {
    id: 'cot-co-ha-noi',
    name: 'Cột Cờ Hà Nội (Kỳ Đài)',
    epoch: 'Triều Nguyễn · Gia Long 1812',
    pastYear: '1890',
    presentYear: '2026',
    pastLabel: 'Ảnh tư liệu Kỳ Đài cuối thế kỷ XIX',
    presentLabel: 'Di tích Cột cờ Hà Nội hôm nay',
    historicalDesc:
      'Cột cờ Hà Nội cao hơn 33m xây dựng năm 1812. Trong đợt người Pháp san phẳng thành Hà Nội cuối thế kỷ XIX để xây khu nhượng địa, Kỳ Đài là công trình kỳ tích còn nguyên vẹn nhờ được giữ lại làm đài quan sát quân sự. Kết cấu 3 tầng gạch vồ chân voi trường tồn qua hai cuộc chiến.',
    archivalSource: 'Lưu trữ Lịch sử Quân sự Việt Nam & Hoàng thành Thăng Long',
    pastImageSrc: '/images/historical/cot-co-ha-noi-xua.jpg',
    presentRealImageSrc: '/images/historical/cot-co-ha-noi-hien-tai.webp',
    present3DImageSrc: '/3D/cot-co-ha-noi-poster.webp',
  },
];

export const TimeTravelComparison: React.FC<{ defaultId?: string }> = ({ defaultId = 'chua-mot-cot' }) => {
  const { t } = useLanguage();
  const [selectedId, setSelectedId] = useState<string>(defaultId);
  const [sliderPosition, setSliderPosition] = useState<number>(50); // percentage 0 - 100
  const [presentMode, setPresentMode] = useState<'real' | '3d'>('real');
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

  const currentPresentImage = presentMode === '3d' ? activeItem.present3DImageSrc : activeItem.presentRealImageSrc;

  return (
    <section className="heritage-timetravel-section border-y border-paper-border bg-paper-warm py-16 sm:py-20">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-16">
        {/* Section Header */}
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end mb-10">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-brass">
              <History size={16} />
              <p className="font-cinzel text-xs font-bold uppercase tracking-[0.2em]">
                {t('timetravel.eyebrow', 'Khảo Cứu Xuyên Thế Kỷ · 1900 ↔ 2026')}
              </p>
            </div>
            <h2 className="mt-2 font-display text-3xl font-bold leading-tight text-forest sm:text-4xl">
              {t('timetravel.heading', 'Dấu Xưa & Diện Mạo Phục Dựng')}
            </h2>
            <p className="mt-2.5 text-sm sm:text-base leading-relaxed text-charcoal/85 font-normal">
              Đối sánh trực diện giữa <strong>ảnh tư liệu lịch sử hơn 100 năm trước (EFEO / tư liệu Pháp)</strong> với <strong>di tích thực tế & mô hình 3D hôm nay</strong>. Kéo thanh trượt để cảm nhận sự chuyển mình qua thăng trầm lịch sử.
            </p>
          </div>

          {/* Controls: Monument Selector & Present Mode Toggle */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
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
                  <span>{item.name.split(' (')[0]}</span>
                </button>
              ))}
            </nav>

            {/* View Mode Toggle: Real Photo vs 3D Model */}
            <div className="inline-flex items-center border border-brass/50 bg-paper p-0.5 rounded-[2px]">
              <button
                type="button"
                onClick={() => setPresentMode('real')}
                className={`px-2.5 py-1 text-xs font-sans font-medium flex items-center gap-1 transition-colors rounded-[1px] ${
                  presentMode === 'real' ? 'bg-forest text-brass font-bold' : 'text-charcoal hover:text-forest'
                }`}
              >
                <Eye size={12} />
                <span>Ảnh Thực Địa</span>
              </button>
              <button
                type="button"
                onClick={() => setPresentMode('3d')}
                className={`px-2.5 py-1 text-xs font-sans font-medium flex items-center gap-1 transition-colors rounded-[1px] ${
                  presentMode === '3d' ? 'bg-brass text-forest font-bold' : 'text-charcoal hover:text-forest'
                }`}
              >
                <Box size={12} />
                <span>Mô Hình 3D</span>
              </button>
            </div>
          </div>
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
            <div className="absolute inset-0 h-full w-full bg-[#F4EFE6] flex items-center justify-center">
              <img
                src={currentPresentImage}
                alt={`${activeItem.name} ${presentMode === '3d' ? 'Mô hình 3D' : 'Ảnh thực địa'} 2026`}
                className="h-full w-full object-cover"
              />
              {/* Right Tag */}
              <div className="pointer-events-none absolute bottom-4 right-4 z-10 border border-brass/60 bg-forest/90 px-3 py-1.5 text-xs text-paper backdrop-blur-sm rounded-[1px] shadow-md">
                <span className="font-cinzel text-[10px] font-bold text-brass uppercase tracking-wider block">
                  Hiện Tại · {activeItem.presentYear}
                </span>
                <span className="font-sans text-[11px] font-medium text-paper">
                  {presentMode === '3d' ? 'Mô hình 3D phục dựng số hóa' : activeItem.presentLabel}
                </span>
              </div>
            </div>

            {/* 2. Past / Archival Layer (Clipped / Left side) */}
            <div
              className="absolute inset-0 h-full overflow-hidden transition-none border-r border-brass/70"
              style={{ width: `${sliderPosition}%` }}
            >
              <div className="relative h-full w-full bg-[#1B1E1B] flex items-center justify-center">
                {/* Authentic Historical Archival Photo */}
                <img
                  src={activeItem.pastImageSrc}
                  alt={`${activeItem.name} ảnh tư liệu lịch sử ${activeItem.pastYear}`}
                  className="h-full w-full object-cover"
                />

                {/* EFEO Archival Watermark Seal */}
                <div className="pointer-events-none absolute top-4 left-4 z-10 flex items-center gap-1.5 border border-charcoal/50 bg-[#1B1E1B]/85 px-2.5 py-1 text-[10px] font-cinzel font-bold text-brass backdrop-blur-xs rounded-[1px]">
                  <Clock size={11} className="text-brass" />
                  <span>ẢNH GỐC LỊCH SỬ · NĂM {activeItem.pastYear}</span>
                </div>

                {/* Left Tag */}
                <div className="pointer-events-none absolute bottom-4 left-4 z-10 border border-charcoal/60 bg-[#142820]/90 px-3 py-1.5 text-xs text-paper backdrop-blur-sm rounded-[1px] shadow-md">
                  <span className="font-cinzel text-[10px] font-bold text-brass uppercase tracking-wider block">
                    Ký Ức · {activeItem.pastYear}
                  </span>
                  <span className="font-sans text-[11px] font-medium text-paper/95">
                    {activeItem.pastLabel}
                  </span>
                </div>
              </div>
            </div>

            {/* 3. Divider Line & Brass Knob */}
            <div
              className="pointer-events-none absolute inset-y-0 z-20 w-1 bg-brass shadow-2xl"
              style={{ left: `${sliderPosition}%` }}
            >
              {/* Antique Engraved Medallion Handle */}
              <div className="pointer-events-auto absolute top-1/2 -translate-x-1/2 -translate-y-1/2 flex h-11 w-11 sm:h-13 sm:w-13 items-center justify-center rounded-full border-2 border-brass bg-forest text-brass shadow-2xl hover:scale-110 transition-transform cursor-ew-resize">
                <span className="font-cinzel text-[9px] sm:text-[10px] font-bold tracking-tight text-center leading-tight">
                  {activeItem.pastYear}<br />◄►<br />2026
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
                Nguồn Tư Liệu Lưu Trữ:
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
