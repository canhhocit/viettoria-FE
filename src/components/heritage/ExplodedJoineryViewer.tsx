import React, { useState } from 'react';
import { Layers, Box, Info, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

interface ExplodedMonument {
  id: string;
  name: string;
  subtitle: string;
  epoch: string;
  diagramImage: string;
  model3dUrl: string;
  tiers: {
    letter: string;
    name: string;
    joineryType: string;
    technique: string;
    structuralRole: string;
    pinY: string; // approximate vertical % position on diagram
  }[];
}

const EXPLODED_MONUMENTS: ExplodedMonument[] = [
  {
    id: 'khue-van-cac',
    name: 'Khuê Văn Các (Văn Miếu)',
    subtitle: 'Gác Chuông Sao Khuê · Đỉnh Cao Mộng Gỗ Thời Nguyễn',
    epoch: 'Triều Nguyễn · Dựng năm 1805',
    diagramImage: '/viettoria_img/IMG_6369.PNG',
    model3dUrl: '/3D/khue-van-cac.glb',
    tiers: [
      {
        letter: 'C',
        name: 'Mái Chùa 2 Tầng Chồng Diêm',
        joineryType: 'Mộng then cài mui rùa & kẻ chuyền',
        technique: 'Hệ 8 mái với 8 đầu đao uốn cong thanh thoát lợp ngói ống cổ, xà gồ gỗ lim liên kết bằng mộng then kín khít.',
        structuralRole: 'Tạo độ nhẹ thanh thoát cho tầng trên, che chắn buồng gác sao Khuê trước gió bão Bắc Bộ.',
        pinY: '25%',
      },
      {
        letter: 'B',
        name: 'Thân Gác Lưới & Cửa Sổ Tròn',
        joineryType: 'Mộng đuôi én âm dương & ngàm then giằng',
        technique: 'Buồng gác vuông vắn với 4 cửa sổ tròn tượng trưng cho trời tỏa sáng (Khuê tinh tú chiếu), toàn bộ ván vách ăn mộng không dùng đinh.',
        structuralRole: 'Hấp thụ lực vặn xoắn khi có giông gió, phân bổ tải trọng xuống 4 cột đá bên dưới.',
        pinY: '50%',
      },
      {
        letter: 'A',
        name: 'Bệ Đế Đá & 4 Trụ Cột Vuông',
        joineryType: 'Mộng chân tảng kê tự do & lỗ mộng ngậm',
        technique: '4 cột gạch đá vuông chạm khắc hoa văn câu đối chữ Hán nâng đỡ toàn bộ gác gỗ bên trên.',
        structuralRole: 'Cách ly gỗ khỏi độ ẩm của đất và giếng Thiên Quang, nền móng vững chắc qua hơn 220 năm.',
        pinY: '80%',
      },
    ],
  },
  {
    id: 'chua-mot-cot',
    name: 'Chùa Một Cột (Diên Hựu Tự)',
    subtitle: 'Đài Sen Nghìn Năm · Trụ Đá Độc Nhất Vô Nhị',
    epoch: 'Triều Lý · Khởi dựng 1049',
    diagramImage: '/viettoria_img/IMG_6372.PNG',
    model3dUrl: '/3D/chua-mot-cot.glb',
    tiers: [
      {
        letter: 'C',
        name: 'Mái Chùa Mũi Hài Đao Cong',
        joineryType: 'Mộng ngậm đầu đao & kìm nóc cúc dây',
        technique: 'Bốn đao cong vút như cánh hoa sen đang nở, bờ nóc đắp đôi rồng chầu mặt nguyệt thời Lý.',
        structuralRole: 'Tạo đối trọng cân bằng cho buồng chùa trên không trung.',
        pinY: '38%',
      },
      {
        letter: 'B',
        name: 'Gác Lớp & Hệ Giằng Gỗ Lim',
        joineryType: 'Kèo chống nách & mộng sập chịu lực',
        technique: 'Tám thanh gỗ lim lớn choãi ra từ thân cột đá vươn lên đỡ sàn chùa tạo hình bông sen khổng lồ nhô lên mặt nước.',
        structuralRole: 'Chuyển toàn bộ tải trọng buồng thờ tập trung vào một tâm cột duy nhất.',
        pinY: '54%',
      },
      {
        letter: 'A',
        name: 'Bệ Đế & Cột Trụ Đá Nguyên Khối',
        joineryType: 'Khớp nối 2 thớt đá cối âm dương',
        technique: 'Cột đá đường kính 1.25m ghép từ 2 khối đá xanh khít khao cắm sâu xuống đáy hồ sen Linh Chiểu.',
        structuralRole: 'Trụ chống vĩnh cửu nâng đỡ toàn bộ công trình giữa mặt nước.',
        pinY: '78%',
      },
    ],
  },
  {
    id: 'ngo-mon-hue',
    name: 'Ngọ Môn (Hoàng Thành Huế)',
    subtitle: 'Lầu Ngũ Phụng · Cửa Chính Cung Điện Hoàng Gia',
    epoch: 'Triều Nguyễn · Minh Mạng 1833',
    diagramImage: '/viettoria_img/IMG_6368.PNG',
    model3dUrl: '/3D/ngo-mon-hue.glb',
    tiers: [
      {
        letter: 'D',
        name: 'Mái Chùa Kết Cấu Lầu Ngũ Phụng',
        joineryType: 'Ngói lưu ly âm dương & xà gồ then',
        technique: 'Chín bộ mái liên hoàn chia làm hai tầng, lợp ngói hoàng lưu ly (vua ngự) và thanh lưu ly (quan viên).',
        structuralRole: 'Mái nhẹ nhàng nhiều tầng thoát nước mưa miền Trung và cản gió bão.',
        pinY: '48%',
      },
      {
        letter: 'C',
        name: 'Gác Lớp & Khung Sườn 100 Cột',
        joineryType: 'Đấu củng cung đình & mộng ngậm xuyên tâm',
        technique: 'Hệ thống 100 cột gỗ lim sơn then đỏ thắm liên kết bằng xà ngang mộng thắt không có mối nối thừa.',
        structuralRole: 'Tạo khoảng không gian thông thoáng đón gió bốn phương làm nơi thiết triều đại lễ.',
        pinY: '60%',
      },
      {
        letter: 'B',
        name: 'Bệ Đế & Khung Sườn Sàn Gỗ',
        joineryType: 'Mộng giằng then cài sàn lầu',
        technique: 'Sàn gỗ lim bằng phẳng trải rộng theo hình chữ U bề thế ôm lấy sân trước.',
        structuralRole: 'Phân bổ trọng lực của lầu Ngũ Phụng xuống khối đế đá đồ sộ.',
        pinY: '68%',
      },
      {
        letter: 'A',
        name: 'Bệ Đế Đá Thanh & 5 Cửa Cổng',
        joineryType: 'Vòm cuốn đá gạch vồ Thang Long - Huế',
        technique: 'Xây bằng đá Thanh Hóa và gạch vồ, trổ 5 cửa cổng (Ngọ Môn ở giữa chỉ vua ngự, Tả Hữu Giáp Môn, Tả Hữu Dịch Môn).',
        structuralRole: 'Nền tảng pháo đài phòng thủ kiên cố qua hai thế kỷ.',
        pinY: '78%',
      },
    ],
  },
];

export const ExplodedJoineryViewer: React.FC = () => {
  const { t } = useLanguage();
  const [selectedMonumentId, setSelectedMonumentId] = useState<string>('khue-van-cac');
  const [activeTierIndex, setActiveTierIndex] = useState<number>(0);
  const [viewMode, setViewMode] = useState<'diagram' | '3d'>('diagram');

  const currentMonument =
    EXPLODED_MONUMENTS.find((m) => m.id === selectedMonumentId) || EXPLODED_MONUMENTS[0];
  const activeTier = currentMonument.tiers[activeTierIndex] || currentMonument.tiers[0];

  return (
    <section className="heritage-joinery-section border-b border-paper-border bg-paper py-16 sm:py-24">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-16">
        {/* Section Header */}
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end mb-10">
          <div className="max-w-2xl">
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
              Khám phá bản vẽ bóc tách kỹ thuật 3D chân thực: từng tầng mái, buồng gác và cột tảng đá được phân rã theo trục thẳng đứng, giải mã vì sao di sản gỗ Việt đứng vững nghìn năm trước bão giông.
            </p>
          </div>

          {/* Top Actions: Monument Selector & Mode Toggle */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            {/* Monument Selector Tabs */}
            <nav className="flex flex-wrap items-center gap-2" aria-label="Chọn công trình bóc tách">
              {EXPLODED_MONUMENTS.map((monument) => (
                <button
                  key={monument.id}
                  type="button"
                  onClick={() => {
                    setSelectedMonumentId(monument.id);
                    setActiveTierIndex(0);
                  }}
                  className={`border px-3 py-2 text-xs font-sans transition-all rounded-[2px] ${
                    selectedMonumentId === monument.id
                      ? 'border-forest bg-forest text-brass font-bold shadow-xs'
                      : 'border-paper-border bg-paper text-forest hover:border-brass hover:bg-paper-warm font-medium'
                  }`}
                >
                  <span>{monument.name.split(' (')[0]}</span>
                </button>
              ))}
            </nav>

            {/* View Mode Toggle: Exploded Diagram vs Interactive 3D */}
            <div className="inline-flex items-center border border-brass/50 bg-paper p-0.5 rounded-[2px]">
              <button
                type="button"
                onClick={() => setViewMode('diagram')}
                className={`px-2.5 py-1 text-xs font-sans font-medium flex items-center gap-1 transition-colors rounded-[1px] ${
                  viewMode === 'diagram' ? 'bg-forest text-brass font-bold' : 'text-charcoal hover:text-forest'
                }`}
              >
                <Layers size={12} />
                <span>Bản Vẽ Bóc Tách</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('3d')}
                className={`px-2.5 py-1 text-xs font-sans font-medium flex items-center gap-1 transition-colors rounded-[1px] ${
                  viewMode === '3d' ? 'bg-brass text-forest font-bold' : 'text-charcoal hover:text-forest'
                }`}
              >
                <Box size={12} />
                <span>Xoay 3D Thực Tế</span>
              </button>
            </div>
          </div>
        </div>

        {/* Master Joinery Interactive Stage */}
        <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] items-stretch">
          {/* Left: Exploded Stage Visualizer */}
          <div className="corner-frame border-2 border-brass/50 bg-paper-card p-4 sm:p-6 shadow-xl relative flex flex-col justify-between overflow-hidden">
            {/* Atelier Grid Texture */}
            <div className="absolute inset-0 bg-[radial-gradient(#B88A38_1px,transparent_1px)] [background-size:24px_24px] opacity-15 pointer-events-none" />

            {/* Mode 1: Authentic Exploded Blueprint Diagram */}
            {viewMode === 'diagram' ? (
              <div className="relative aspect-[3/4] sm:aspect-[4/3] w-full overflow-hidden bg-[#1B1814] border border-brass/40 shadow-inner flex items-center justify-center p-2 sm:p-4 rounded-[1px]">
                <img
                  src={currentMonument.diagramImage}
                  alt={`Bản vẽ bóc tách cấu kiện ${currentMonument.name}`}
                  className="h-full w-full object-contain"
                />

                {/* Target Beacon Overlay for Active Tier */}
                <div
                  className="pointer-events-none absolute left-1/2 -translate-x-1/2 flex items-center gap-2 border border-brass bg-forest/90 px-3 py-1.5 text-xs text-brass shadow-2xl backdrop-blur-sm transition-all duration-300 rounded-[2px]"
                  style={{ top: activeTier.pinY }}
                >
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center bg-brass text-forest text-[11px] font-bold rounded-full">
                    {activeTier.letter}
                  </span>
                  <span className="font-sans font-bold text-paper text-xs">
                    {activeTier.name}
                  </span>
                </div>
              </div>
            ) : (
              /* Mode 2: Live Interactive 3D Model Viewer */
              <div className="relative aspect-[3/4] sm:aspect-[4/3] w-full overflow-hidden bg-paper border border-brass/40 shadow-inner rounded-[1px]">
                <model-viewer
                  src={currentMonument.model3dUrl}
                  alt={`Mô hình 3D thực tế của ${currentMonument.name}`}
                  camera-controls
                  auto-rotate
                  rotation-per-second="10deg"
                  shadow-intensity="1.2"
                  exposure="1.05"
                  loading="eager"
                  style={{ width: '100%', height: '100%', backgroundColor: 'transparent' }}
                  className="h-full w-full"
                />
                <div className="pointer-events-none absolute left-3 top-3 border border-brass/40 bg-forest/90 px-2.5 py-1 text-[11px] font-cinzel text-brass font-bold rounded-[1px]">
                  MÔ HÌNH 3D THỜI GIAN THỰC · KÉO ĐỂ XOAY
                </div>
              </div>
            )}

            {/* Tiers Navigation Selector Pills */}
            <div className="mt-4 border-t border-paper-border pt-4">
              <span className="font-cinzel text-[10px] uppercase font-bold text-charcoal-muted block mb-2">
                Chọn Cấu Kiện Khảo Cứu:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {currentMonument.tiers.map((tier, idx) => (
                  <button
                    key={tier.letter}
                    type="button"
                    onClick={() => setActiveTierIndex(idx)}
                    className={`p-2 text-left text-xs rounded-[2px] border transition-all ${
                      activeTierIndex === idx
                        ? 'border-forest bg-forest text-paper font-semibold shadow-xs'
                        : 'border-paper-border bg-paper hover:border-brass text-forest'
                    }`}
                  >
                    <span className="font-cinzel text-[10px] text-brass font-bold block">
                      Tầng [{tier.letter}]
                    </span>
                    <span className="truncate block font-medium mt-0.5">{tier.name.split(' (')[0]}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Technical Joinery Dossier Card */}
          <div className="corner-frame border-2 border-brass/50 bg-paper p-6 sm:p-7 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 border-b border-paper-border pb-3">
                <Info size={16} className="text-brass" />
                <span className="font-cinzel text-xs font-bold uppercase tracking-widest text-brass">
                  Khảo Cứu Cấu Kiện · Tầng [{activeTier.letter}]
                </span>
              </div>

              <h3 className="mt-3 font-display text-2xl font-bold text-forest">
                {activeTier.name}
              </h3>
              <p className="mt-1 font-serif text-sm italic text-brass-dark">
                {currentMonument.subtitle}
              </p>

              <div className="mt-5 space-y-4">
                <div className="border border-paper-border bg-paper-warm p-3.5 rounded-[2px]">
                  <span className="font-cinzel text-[10px] uppercase font-bold text-brass block">
                    Phương Thức Khớp Mộng Cổ Truyền
                  </span>
                  <p className="font-serif text-base font-bold text-forest mt-0.5">
                    {activeTier.joineryType}
                  </p>
                </div>

                <div>
                  <span className="font-sans text-xs font-bold text-forest uppercase tracking-wider block">
                    Kỹ Thuật Ghép Nối Không Dùng Đinh:
                  </span>
                  <p className="mt-1 text-xs sm:text-sm text-charcoal/85 leading-relaxed font-normal">
                    {activeTier.technique}
                  </p>
                </div>

                <div className="border-t border-paper-border pt-3">
                  <span className="font-sans text-xs font-bold text-forest uppercase tracking-wider block">
                    Công Năng Chịu Lực & Địa Chấn:
                  </span>
                  <p className="mt-1 text-xs sm:text-sm text-charcoal/85 leading-relaxed font-normal">
                    {activeTier.structuralRole}
                  </p>
                </div>
              </div>
            </div>

            {/* Atelier Heritage Guarantee Note */}
            <div className="mt-6 border-t border-paper-border pt-4 bg-paper-warm/60 p-3 rounded-[2px] border border-paper-border">
              <div className="flex items-center gap-2 text-xs text-forest font-semibold">
                <CheckCircle2 size={14} className="text-brass" />
                <span>Bảo chứng tỷ lệ khảo cổ 1:120 của Viettoria Atelier</span>
              </div>
              <p className="text-[11px] text-charcoal-muted mt-1 font-normal">
                Mỗi cấu kiện được scan 3D bề mặt vi mô và đối chiếu với hồ sơ trùng tu của Viện Bảo tồn Di tích Quốc gia.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
