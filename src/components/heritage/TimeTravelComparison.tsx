import React, { useState, useRef, useCallback } from 'react';
import { Clock, History, Eye, Box } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import type { LanguageCode } from '../../locales';

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

const TIME_TRAVEL_LOCALES: Record<string, Partial<Record<LanguageCode, {
  name: string;
  epoch: string;
  pastLabel: string;
  presentLabel: string;
  historicalDesc: string;
  archivalSource: string;
}>>> = {
  'chua-mot-cot': {
    en: {
      name: 'One Pillar Pagoda (Dien Huu Pagoda)',
      epoch: 'Ly Dynasty · Founded 1049',
      pastLabel: 'Original glass plate April 1896 (Firmin-André Salles)',
      presentLabel: 'Present monument shaded by lotus',
      historicalDesc: 'Rare photograph captured in April 1896 by Firmin-André Salles showing the original One Pillar Pagoda with its single stone pillar and Ly-Tran ironwood brackets before the 1954 destruction. Directly juxtaposed with today\'s site and museum-grade replica.',
      archivalSource: 'French School of Asian Studies (EFEO Paris) & Salles Collection 1896',
    },
    fr: {
      name: 'Pagode au Pilier Unique (Chùa Một Cột)',
      epoch: 'Dynastie des Lý · Érigée en 1049',
      pastLabel: 'Plaque de verre originale avril 1896 (Firmin-André Salles)',
      presentLabel: 'Monument actuel bordé de lotus',
      historicalDesc: 'Cliché précieux d\'avril 1896 par Firmin-André Salles immortalisant la pagode originelle sur son pilier de pierre monolithique avant sa destruction de 1954. Mise en regard directe avec le monument contemporain.',
      archivalSource: 'Archives EFEO Paris & Collection Firmin-André Salles 1896',
    },
    zh: {
      name: '一柱寺（延佑寺）',
      epoch: '李朝 · 始建于1049年',
      pastLabel: '1896年4月原版玻璃底片（Firmin-André Salles摄）',
      presentLabel: '今日莲池掩映之遗迹',
      historicalDesc: '法国摄影师 Firmin-André Salles 于1896年4月拍摄的珍贵原照，忠实记录了1954年被毁前的一柱寺原始石柱与李陈时期铁木构架。与当今实地及高精博物馆复原模型无缝对比。',
      archivalSource: '法国远东学院（EFEO巴黎）档案馆与1896年萨勒藏品',
    },
    ko: {
      name: '일주사 (못꼿 사원)',
      epoch: '리 왕조 · 1049년 창건',
      pastLabel: '1896년 4월 원본 유리건판 (Firmin-André Salles)',
      presentLabel: '연꽃 향기 드리운 오늘날의 유적',
      historicalDesc: '1896년 4월 사진작가 Firmin-André Salles가 촬영한 희귀 사진으로, 1954년 폭파 전 리-쩐 왕조 시대의 원형 단일 석주와 림목 결구를 생생히 보여줍니다. 오늘날의 실제 유적 및 박물관급 3D 복원 모델과 직접 비교됩니다.',
      archivalSource: '프랑스 극동학원(EFEO 파리) 아카이브 및 1896 살레스 컬렉션',
    },
    ja: {
      name: '一柱寺（延祐寺）',
      epoch: '李朝 · 1049年創建',
      pastLabel: '1896年4月撮影のガラス乾板原版（Firmin-André Salles）',
      presentLabel: '蓮池に映える現在の遺構',
      historicalDesc: '1896年4月に写真家 Firmin-André Salles が撮影した貴重な古写真。1954年の爆破以前の李・陳朝時代の単一石柱と鉄木梁を捉えています。現代の復元遺構および博物館級3Dモデルと直接対比できます。',
      archivalSource: 'フランス極東学院（EFEOパリ）所蔵資料および1896年サール・コレクション',
    },
  },
  'ngo-mon-hue': {
    en: {
      name: 'Noon Gate (Hue Imperial Citadel)',
      epoch: 'Nguyen Dynasty · Minh Mang 1833',
      pastLabel: 'Indochina Postcard - Thanh Thai Era (1900)',
      presentLabel: 'Noon Gate & Five-Phoenix Pavilion Today',
      historicalDesc: 'Photograph of Ngo Mon Gate and Ngoai Kim Thuy canal taken in the early 20th century (~1900). Weathered Thanh Hoa granite foundation supporting the 100-pillar Five-Phoenix ironwood pavilion. Drag slider to see vibrant imperial yellow and cyan glazed tiles after national conservation.',
      archivalSource: 'Indochina Postcard Archives & Hue Monuments Conservation Centre',
    },
    fr: {
      name: 'Porte du Midi (Cité Impériale de Hué)',
      epoch: 'Dynastie des Nguyễn · Minh Mạng 1833',
      pastLabel: 'Carte postale Annam - Hué époque Thành Thái (1900)',
      presentLabel: 'Porte du Midi & Pavillon des Cinq Phénix actuels',
      historicalDesc: 'Vue de la Porte du Midi et du bassin Ngoại Kim Thủy vers 1900. L\'imposante base en granit de Thanh Hóa soutient le pavillon des Cinq Phénix aux 100 colonnes en bois de fer. Faites glisser pour apprécier l\'éclat des tuiles vernissées restaurées.',
      archivalSource: 'Fonds de Cartes Postales d\'Indochine & Centre de Conservation des Monuments de Hué',
    },
    zh: {
      name: '顺化午门（顺化皇城）',
      epoch: '阮朝 · 明命十四年（1833）',
      pastLabel: '成泰年间法属印度支那明信片（约1900年）',
      presentLabel: '今日午门与五凤楼气象',
      historicalDesc: '二十世纪初（约1900年）拍摄的午门与外金水池旧影。青苔斑驳的清化花岗岩基座巍峨托起百根铁木金柱构筑的五凤楼。滑动滑块饱览古建筑大修后黄琉璃与青琉璃瓦的璀璨华光。',
      archivalSource: '印度支那历史明信片文献馆与顺化古都遗迹保护中心',
    },
    ko: {
      name: '오문 (후에 황성 정문)',
      epoch: '응우옌 왕조 · 민망 1833',
      pastLabel: '탄타이 황제 시대 안남-후에 엽서 (1900년경)',
      presentLabel: '오늘날의 오문과 오봉루',
      historicalDesc: '20세기 초(약 1900년경) 촬영된 오문과 외금수지 옛 사진. 이끼 낀 타인호아 화강석 기단이 100개의 림목 기둥으로 지탱된 오봉루를 받치고 있습니다. 대대적인 복원 정비 후 찬란한 황실 유리기와의 빛깔을 확인해 보세요.',
      archivalSource: '인도차이나 엽서 기록보관소 및 후에 유적보존센터',
    },
    ja: {
      name: '午門（順化・フエ王宮）',
      epoch: '阮朝 · 明命1833年',
      pastLabel: '成泰帝時代アンナン・フエ古絵葉書（1900年頃）',
      presentLabel: '現在の午門と五鳳楼',
      historicalDesc: '20世紀初頭（1900年頃）に撮影された午門と外金水池。苔むしたタインホア産花崗岩の台座が、100本の鉄木柱からなる五鳳楼を支えています。修復を経て蘇った鮮やかな黄・青の瑠璃瓦の美しさをご体感ください。',
      archivalSource: '仏印絵葉書アーカイブおよびフエ遺跡保存センター',
    },
  },
  'cot-co-ha-noi': {
    en: {
      name: 'Hanoi Flag Tower (Ky Dai)',
      epoch: 'Nguyen Dynasty · Gia Long 1812',
      pastLabel: 'Late 19th Century Archival Photo of Ky Dai',
      presentLabel: 'Hanoi Flag Tower Monument Today',
      historicalDesc: 'Built in 1812 rising over 33m high. When colonial forces razed Hanoi Citadel in the late 19th century, the Flag Tower miraculously survived because it was repurposed as a military observation post. Its 3-tier brick structure has endured through two wars.',
      archivalSource: 'Vietnam Military History Museum & Thang Long Imperial Citadel Archives',
    },
    fr: {
      name: 'Tour du Drapeau de Hanoï (Kỳ Đài)',
      epoch: 'Dynastie des Nguyễn · Gia Long 1812',
      pastLabel: 'Photo d\'archive de la Kỳ Đài fin XIXe siècle',
      presentLabel: 'Vestige de la Tour du Drapeau aujourd\'hui',
      historicalDesc: 'Érigée en 1812 à plus de 33 m de hauteur. Lors du démantèlement de la citadelle de Hanoï à la fin du XIXe siècle, la tour fut miraculeusement épargnée pour servir de poste d\'observation militaire.',
      archivalSource: 'Musée d\'Histoire Militaire du Vietnam & Citadelle Impériale de Thăng Long',
    },
    zh: {
      name: '河内旗台（升龙旗台）',
      epoch: '阮朝 · 嘉隆十一年（1812）',
      pastLabel: '十九世纪末旗台历史原照档案',
      presentLabel: '当今河内旗台国家地标',
      historicalDesc: '始建于1812年，通高逾33米。十九世纪末法国殖民者拆除河内古城垣时，旗台因被用作军用瞭望哨而奇迹般完整保留至今。三层巨型青砖台基历经两场现代战火依旧巍然屹立。',
      archivalSource: '越南军事历史博物馆与升龙皇城历史档案库',
    },
    ko: {
      name: '하노이 깃대 (기대)',
      epoch: '응우옌 왕조 · 자롱 1812',
      pastLabel: '19세기 말 기대 기록 사진',
      presentLabel: '오늘날의 하노이 깃대 국가 유적',
      historicalDesc: '1812년 높이 33m 이상으로 축조되었습니다. 19세기 말 프랑스군이 하노이 성곽을 철거할 당시 군사 관측소로 전용되면서 기적적으로 온전히 보존되었습니다. 3단 벽돌 기단 구조는 두 차례의 전쟁을 겪고도 굳건히 서 있습니다.',
      archivalSource: '베트남 군사역사박물관 및 탕롱 황성 기록보관소',
    },
    ja: {
      name: 'ハノイ旗塔（旗台）',
      epoch: '阮朝 · 嘉隆1812年',
      pastLabel: '19世紀末の旗台記録古写真',
      presentLabel: '現在のハノイ旗塔国家史跡',
      historicalDesc: '1812年に造営され、高さ33mを超える記念碑的建築。19世紀末にハノイ城塞が解体された際も、軍事監視所として転用されたため奇跡的に無傷で残されました。3層の堅牢な煉瓦構造は、2つの戦争を生き延びて今に伝わります。',
      archivalSource: 'ベトナム軍事歴史博物館および昇龍皇城所蔵公文書',
    },
  },
};

export const TimeTravelComparison: React.FC<{ defaultId?: string }> = ({ defaultId = 'chua-mot-cot' }) => {
  const { t, language } = useLanguage();
  const [selectedId, setSelectedId] = useState<string>(defaultId);
  const [sliderPosition, setSliderPosition] = useState<number>(50); // percentage 0 - 100
  const [presentMode, setPresentMode] = useState<'real' | '3d'>('real');
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const rawItem = COMPARISON_DATA.find((item) => item.id === selectedId) || COMPARISON_DATA[0];
  const itemLoc = TIME_TRAVEL_LOCALES[rawItem.id]?.[language];

  const activeItem = {
    ...rawItem,
    name: itemLoc?.name || rawItem.name,
    epoch: itemLoc?.epoch || rawItem.epoch,
    pastLabel: itemLoc?.pastLabel || rawItem.pastLabel,
    presentLabel: itemLoc?.presentLabel || rawItem.presentLabel,
    historicalDesc: itemLoc?.historicalDesc || rawItem.historicalDesc,
    archivalSource: itemLoc?.archivalSource || rawItem.archivalSource,
  };

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
              <p className="font-sans text-xs font-semibold uppercase tracking-wider text-brass">
                {t('timetravel.eyebrow', 'Khảo Cứu Xuyên Thế Kỷ · 1900 ↔ 2026')}
              </p>
            </div>
            <h2 className="mt-2 font-serif text-3xl font-bold leading-tight text-forest sm:text-4xl">
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
                <span className="font-sans text-[10px] font-semibold text-brass uppercase tracking-wider block">
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
                <div className="pointer-events-none absolute top-4 left-4 z-10 flex items-center gap-1.5 border border-charcoal/50 bg-[#1B1E1B]/85 px-2.5 py-1 text-[10px] font-sans font-semibold text-brass backdrop-blur-xs rounded-[1px]">
                  <Clock size={11} className="text-brass" />
                  <span>ẢNH GỐC LỊCH SỬ · NĂM {activeItem.pastYear}</span>
                </div>

                {/* Left Tag */}
                <div className="pointer-events-none absolute bottom-4 left-4 z-10 border border-charcoal/60 bg-[#142820]/90 px-3 py-1.5 text-xs text-paper backdrop-blur-sm rounded-[1px] shadow-md">
                  <span className="font-sans text-[10px] font-semibold text-brass uppercase tracking-wider block">
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
                <span className="font-mono text-[9px] sm:text-[10px] font-bold tracking-tight text-center leading-tight">
                  {activeItem.pastYear}<br />◄►<br />2026
                </span>
              </div>
            </div>
          </div>

          {/* Historical Commentary Note */}
          <div className="mt-5 border-t border-paper-border pt-4 sm:flex sm:items-center sm:justify-between sm:gap-6">
            <div className="max-w-3xl">
              <span className="font-sans text-[10px] font-semibold uppercase tracking-wider text-brass block">
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
