import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Compass, ShieldCheck, MapPin } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { getLocalizedProduct } from '../../utils/localizedEntities';

interface TimelineEvent {
  year: number;
  yearLabel: string;
  dynasty: string;
  dynastyShort: string;
  epoch: string;
  title: string;
  subTitle: string;
  slug: string;
  location: string;
  significance: string;
  image: string;
  code: string;
  scale: string;
}

const HERITAGE_TIMELINE: TimelineEvent[] = [
  {
    year: 1049,
    yearLabel: '1049',
    dynasty: 'Thời Lý (Kỷ Sửu)',
    dynastyShort: 'Thời Lý',
    epoch: 'Thế kỷ XI',
    title: 'Chùa Một Cột',
    subTitle: 'Liên Hoa Đài — Diên Hựu Tự',
    slug: 'chua-mot-cot',
    location: 'Ba Đình, Hà Nội',
    significance: 'Đài hoa sen nghìn năm ngự giữa lòng hồ Linh Chiểu, đỉnh cao triết lý Phật giáo Đại Việt với kết cấu trụ đá độc nhất vô nhị.',
    image: '/3D/chua-mot-cot-poster.webp',
    code: 'VT-HN-001',
    scale: '1:120',
  },
  {
    year: 1805,
    yearLabel: '1805',
    dynasty: 'Triều Nguyễn (Gia Long)',
    dynastyShort: 'Triều Nguyễn',
    epoch: 'Đầu thế kỷ XIX',
    title: 'Khuê Văn Các',
    subTitle: 'Gác Sao Khuê — Văn Miếu',
    slug: 'khue-van-cac',
    location: 'Văn Miếu, Hà Nội',
    significance: 'Gác sao Khuê tỏa rạng tinh hoa Nho học và truyền thống hiếu học Thăng Long với kết cấu Trời tròn Đất vuông chuẩn mực.',
    image: '/3D/khue-van-cac-poster.webp',
    code: 'VT-HN-002',
    scale: '1:120',
  },
  {
    year: 1812,
    yearLabel: '1812',
    dynasty: 'Triều Nguyễn (Gia Long)',
    dynastyShort: 'Triều Nguyễn',
    epoch: 'Đầu thế kỷ XIX',
    title: 'Cột Cờ Hà Nội',
    subTitle: 'Kỳ Đài Thăng Long',
    slug: 'cot-co-ha-noi',
    location: 'Hoàng Thành Thăng Long',
    significance: 'Kỳ đài sừng sững xây bằng gạch vồ nung kiên cố, chứng nhân lịch sử thăng trầm của kinh thành Thăng Long nghìn năm.',
    image: '/3D/cot-co-ha-noi-poster.webp',
    code: 'VT-HN-003',
    scale: '1:120',
  },
  {
    year: 1833,
    yearLabel: '1833',
    dynasty: 'Triều Nguyễn (Minh Mạng)',
    dynastyShort: 'Triều Nguyễn',
    epoch: 'Nửa đầu thế kỷ XIX',
    title: 'Ngọ Môn Huế',
    subTitle: 'Cổng Chính Hoàng Thành — Lầu Ngũ Phụng',
    slug: 'ngo-mon-hue',
    location: 'Kinh Thành Huế',
    significance: 'Đỉnh cao kiến trúc cung đình triều Nguyễn với lầu Ngũ Phụng tráng lệ ngự trên nền đài chữ U uy nghiêm bảo vệ Hoàng thành.',
    image: '/3D/ngo-mon-hue-poster.webp',
    code: 'VT-HUE-001',
    scale: '1:150',
  },
  {
    year: 1863,
    yearLabel: '1863',
    dynasty: 'Thời Cận Đại',
    dynastyShort: 'Thời Cận Đại',
    epoch: 'Nửa cuối thế kỷ XIX',
    title: 'Bến Nhà Rồng',
    subTitle: 'Thương Cảng Đông Dương',
    slug: 'ben-nha-rong',
    location: 'TP. Hồ Chí Minh',
    significance: 'Thương cảng lịch sử giao thoa kiến trúc phương Tây và văn hóa sông nước phương Nam, điểm khởi đầu hành trình cứu nước vĩ đại.',
    image: '/3D/ben-nha-rong-poster.webp',
    code: 'VT-SG-001',
    scale: '1:120',
  },
];

export const HeritageTimeline: React.FC = () => {
  const { t, language } = useLanguage();
  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent>(HERITAGE_TIMELINE[0]);

  const getLocalizedEvent = (event: TimelineEvent) => {
    if (language === 'vi') return event;
    const p = getLocalizedProduct({
      id: event.slug,
      slug: event.slug,
      name: event.title,
      subName: event.subTitle,
      shortDescription: event.significance,
      location: event.location,
      epoch: event.dynasty,
    } as any, language);
    return {
      ...event,
      title: p.name || event.title,
      subTitle: p.subName || event.subTitle,
      significance: p.shortDescription || event.significance,
      location: p.location || event.location,
      dynasty: p.epoch || event.dynasty,
    };
  };

  const activeIndex = HERITAGE_TIMELINE.findIndex((e) => e.year === selectedEvent.year);
  const progressPercent = (activeIndex / (HERITAGE_TIMELINE.length - 1)) * 100;
  const currentEvent = getLocalizedEvent(selectedEvent);

  return (
    <div className="bg-forest-dark text-paper border-2 border-brass/40 corner-frame p-6 sm:p-10 lg:p-12 space-y-10 relative overflow-hidden shadow-2xl">
      {/* Background Ambience: Grain & Subtle Antique Radials */}
      <div className="heritage-grain absolute inset-0 opacity-15 pointer-events-none" />
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-brass/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-forest/40 rounded-full blur-3xl pointer-events-none" />

      {/* Header Section */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-paper/15 pb-8">
        <div className="space-y-2">
          <div className="flex items-center gap-2.5 text-brass text-xs font-sans uppercase tracking-[0.2em] font-bold">
            <Compass className="w-4 h-4 text-brass" />
            <span>{t('timeline.eyebrow')}</span>
          </div>
          <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-paper tracking-tight">
            {t('timeline.title')}
          </h3>
          <p className="text-paper/70 text-sm font-sans max-w-2xl">
            {t('collectionsPage.pageSubtitle')}
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0 self-start sm:self-auto">
          <span className="text-xs font-mono text-brass uppercase border border-brass/50 px-3.5 py-1.5 bg-forest/90 tracking-wider flex items-center gap-2 shadow-sm">
            <ShieldCheck className="w-3.5 h-3.5 text-brass" />
            <span>{t('timeline.badge')}</span>
          </span>
        </div>
      </div>

      {/* Interactive Horizontal Timeline Track */}
      <div className="relative z-10 overflow-x-auto pb-4 pt-4 scrollbar-thin scrollbar-thumb-brass/30">
        <div className="min-w-[760px] relative px-8 py-4">
          {/* Timeline background track line */}
          <div className="absolute top-10 left-12 right-12 h-0.5 bg-paper/20" />
          
          {/* Active Progress Line */}
          <div 
            className="absolute top-10 left-12 h-0.5 bg-gradient-to-r from-brass via-brass-light to-brass transition-all duration-500 ease-out shadow-[0_0_12px_rgba(212,175,55,0.6)]"
            style={{ width: `calc(${progressPercent}% * (100% - 6rem) / 100)` }}
          />

          <div className="relative flex justify-between">
            {HERITAGE_TIMELINE.map((item) => {
              const isSelected = item.year === selectedEvent.year;
              const locItem = getLocalizedEvent(item);
              return (
                <button
                  key={item.year}
                  onClick={() => setSelectedEvent(item)}
                  className="flex flex-col items-center group focus:outline-none transition-transform duration-300 relative"
                  style={{ width: '130px' }}
                >
                  {/* Point Marker: Imperial Seal Bevel Design */}
                  <div 
                    className={`w-14 h-14 flex flex-col items-center justify-center border-2 transition-all duration-300 z-10 ${
                      isSelected
                        ? 'bg-brass text-forest border-brass-light font-bold scale-110 shadow-[0_0_20px_rgba(212,175,55,0.5)] ring-2 ring-brass-light ring-offset-2 ring-offset-forest-dark'
                        : 'bg-forest text-paper/85 border-brass/40 group-hover:border-brass group-hover:text-brass group-hover:scale-105'
                    }`}
                  >
                    <span className="font-sans text-xs font-bold leading-none tracking-wider">
                      {item.yearLabel}
                    </span>
                    <span className={`text-[8px] font-mono uppercase mt-0.5 ${isSelected ? 'text-forest/80' : 'text-brass/70'}`}>
                      {t('timeline.yearPrefix')}
                    </span>
                  </div>

                  {/* Dynastic Tag */}
                  <span className={`text-xs font-sans mt-3 tracking-wider font-semibold transition-colors text-center ${
                    isSelected ? 'text-brass' : 'text-paper/60 group-hover:text-paper'
                  }`}>
                    {locItem.dynastyShort || locItem.dynasty}
                  </span>

                  {/* Title Preview */}
                  <span className={`text-xs font-serif mt-1 max-w-[120px] text-center leading-snug transition-colors ${
                    isSelected ? 'text-paper font-bold' : 'text-paper/85 group-hover:text-paper'
                  }`}>
                    {locItem.title}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Selected Period Spotlight Card (Museum-grade Artifact Dossier) */}
      <div className="relative z-10 p-6 sm:p-8 lg:p-10 bg-forest border-2 border-brass/40 corner-frame shadow-xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Artifact Preview Image Frame */}
          <div className="lg:col-span-5 relative group">
            <div className="aspect-[4/3] bg-forest-dark border border-brass/40 overflow-hidden relative corner-frame shadow-md">
              <img
                src={selectedEvent.image}
                alt={currentEvent.title}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-forest-dark/80 via-transparent to-transparent pointer-events-none" />
              
              {/* Museum Curator Stamp */}
              <div className="absolute top-3 left-3 bg-forest-dark/90 border border-brass/60 px-3 py-1 text-[11px] font-mono text-brass font-bold uppercase tracking-widest backdrop-blur-sm">
                {selectedEvent.code} • {t('product.specScale', 'TỶ LỆ')} {selectedEvent.scale}
              </div>

              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-paper/80 font-mono">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-brass" />
                  {currentEvent.location}
                </span>
                <span className="text-brass font-bold">{currentEvent.epoch}</span>
              </div>
            </div>
          </div>

          {/* Artifact Historical & Architectural Details */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex flex-wrap items-center gap-2.5 text-xs font-mono">
              <span className="px-3 py-1 bg-brass text-forest font-bold tracking-wider">
                {t('timeline.yearPrefix')} {selectedEvent.year}
              </span>
              <span className="text-brass border border-brass/40 px-2.5 py-0.5 bg-forest-dark">
                {currentEvent.dynasty}
              </span>
            </div>

            <div>
              <h4 className="font-serif text-3xl sm:text-4xl font-bold text-paper tracking-tight">
                {currentEvent.title}
              </h4>
              <p className="text-brass font-sans text-xs uppercase tracking-widest mt-1">
                {currentEvent.subTitle}
              </p>
            </div>

            <p className="text-sm sm:text-base text-paper/85 font-sans font-normal leading-relaxed">
              {currentEvent.significance}
            </p>

            <div className="pt-3 flex flex-wrap items-center gap-4 border-t border-paper/15">
              <Link
                to={`/products/${selectedEvent.slug}`}
                className="px-6 py-3 bg-brass text-forest hover:bg-brass-light transition-all font-sans text-xs uppercase tracking-widest font-bold flex items-center gap-2 shadow-lg hover:shadow-brass/20 hover:-translate-y-0.5 active:translate-y-0"
              >
                <span>{t('timeline.exploreBtn')}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeritageTimeline;
