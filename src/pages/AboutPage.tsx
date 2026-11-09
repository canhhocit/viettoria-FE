import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Headphones,
  Layers, 
  ShieldCheck, 
  Compass,
  Camera,
  ArrowRight,
  ZoomIn,
  X
} from 'lucide-react';
import { VIETTORIA_IMAGES, handleImageFallback } from '../utils/mediaResolver';
import { useLanguage } from '../contexts/LanguageContext';

interface PreviewModalData {
  src: string;
  title: string;
  desc: string;
  tag: string;
  specs: string;
}

export const AboutPage: React.FC = () => {
  const { t } = useLanguage();
  const [previewData, setPreviewData] = useState<PreviewModalData | null>(null);

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setPreviewData(null);
      }
    };
    if (previewData) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [previewData]);

  return (
    <div className="bg-paper min-h-screen py-12 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 sm:space-y-24">
        {/* Atelier Hero Section */}
        <section className="max-w-4xl space-y-6">
          <div className="flex items-center gap-2 text-brass text-xs font-mono uppercase tracking-widest font-semibold">
            <Compass className="w-4 h-4" />
            <span>{t('aboutPage.heroEyebrow')}</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl font-bold tracking-tight text-forest leading-[1.15]">
            {t('aboutPage.heroTitleLine1')}<br />
            <span className="italic font-normal text-brass-dark">{t('aboutPage.heroTitleLine2')}</span>
          </h1>

          <p className="font-serif text-xl sm:text-2xl italic text-charcoal/85 leading-relaxed font-normal border-l-2 border-brass pl-6">
            {t('aboutPage.quote')}
          </p>

          <p className="text-base sm:text-lg text-charcoal/80 font-normal leading-relaxed">
            {t('aboutPage.intro')}
          </p>
        </section>

        {/* Brand Meaning Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-paper-warm border border-paper-border corner-frame p-8 sm:p-12">
          <div className="space-y-4">
            <span className="text-xs font-mono uppercase tracking-widest text-brass font-bold">
              {t('aboutPage.brandMeaningEyebrow')}
            </span>
            <h2 className="font-serif text-3xl font-bold text-forest">
              {t('aboutPage.brandMeaningTitle')}
            </h2>
            <div className="space-y-3 text-sm text-charcoal/80 font-normal leading-relaxed">
              <p>
                <strong className="text-forest font-semibold">{t('aboutPage.vietLabel')}</strong>{' '}
                {t('aboutPage.vietDesc')}
              </p>
              <p>
                <strong className="text-forest font-semibold">{t('aboutPage.toriaLabel')}</strong>{' '}
                {t('aboutPage.toriaDesc')}
              </p>
            </div>
          </div>

          <div className="bg-forest text-paper p-8 border border-brass corner-frame space-y-4">
            <span className="text-xs font-mono text-brass uppercase tracking-widest block font-bold">
              {t('aboutPage.commitmentEyebrow')}
            </span>
            <p className="font-serif text-2xl font-bold text-paper">
              {t('aboutPage.commitmentTitle')}
            </p>
            <p className="text-sm text-paper/80 font-normal leading-6">
              {t('aboutPage.commitmentDesc')}
            </p>
          </div>
        </section>

        {/* 3 Core Production Pillars */}
        <section className="space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-mono uppercase tracking-widest text-brass font-semibold">
              {t('aboutPage.pillarsEyebrow')}
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-forest">
              {t('aboutPage.pillarsTitle')}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-paper p-8 border border-paper-border hover:border-brass transition-all corner-frame space-y-4">
              <div className="w-12 h-12 bg-forest text-brass flex items-center justify-center border border-brass">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-bold text-forest">
                {t('aboutPage.pillar1Title')}
              </h3>
              <p className="text-sm text-charcoal/80 font-normal leading-6">
                {t('aboutPage.pillar1Desc')}
              </p>
            </div>

            <div className="bg-paper p-8 border border-paper-border hover:border-brass transition-all corner-frame space-y-4">
              <div className="w-12 h-12 bg-forest text-brass flex items-center justify-center border border-brass">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-bold text-forest">
                {t('aboutPage.pillar2Title')}
              </h3>
              <p className="text-sm text-charcoal/80 font-normal leading-6">
                {t('aboutPage.pillar2Desc')}
              </p>
            </div>

            <div className="bg-paper p-8 border border-paper-border hover:border-brass transition-all corner-frame space-y-4">
              <div className="w-12 h-12 bg-forest text-brass flex items-center justify-center border border-brass">
                <Headphones className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-bold text-forest">
                {t('aboutPage.pillar3Title')}
              </h3>
              <p className="text-sm text-charcoal/80 font-normal leading-6">
                {t('aboutPage.pillar3Desc')}
              </p>
            </div>
          </div>
        </section>

        {/* Workshop & Real Model Atelier Showcase */}
        <section className="space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-paper-border pb-5">
            <div className="space-y-2">
              <span className="text-xs font-mono uppercase tracking-widest text-brass font-bold flex items-center gap-2">
                <Camera className="w-4 h-4 text-brass" />
                <span>{t('aboutPage.workshopEyebrow')}</span>
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-forest tracking-tight">
                {t('aboutPage.workshopTitle')}
              </h2>
            </div>
            <div className="flex items-center gap-2 text-charcoal-muted">
              <span className="text-brass text-sm select-none">◇</span>
              <p className="text-xs font-mono uppercase tracking-wider font-semibold">
                {t('aboutPage.workshopArchive')}
              </p>
            </div>
          </div>

          {/* 3-Card Curated Atelier Display: Warm Beige - Terracotta Lacquer - Warm Beige */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {/* Card 1: Chùa Một Cột - Warm Beige Curation */}
            <div className="group relative bg-paper-warm border border-paper-border hover:border-brass/70 transition-all duration-300 rounded-[2px] shadow-xs hover:shadow-md flex flex-col justify-between overflow-hidden">
              <div className="p-4 sm:p-5 space-y-4">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-brass font-bold tracking-widest uppercase">01 · HIỆN VẬT KHẢO CỨU</span>
                  <span className="px-2 py-0.5 border border-brass/30 bg-brass/10 text-forest text-[11px] font-medium tracking-wide">
                    TỶ LỆ 1:120
                  </span>
                </div>

                <div 
                  onClick={() => setPreviewData({
                    src: VIETTORIA_IMAGES.curatedChuaMotCot,
                    title: t('aboutPage.workshopCard1Title'),
                    desc: t('aboutPage.workshopCard1Desc'),
                    tag: 'Chùa Một Cột · Liên Hoa Đài (Năm 1049)',
                    specs: 'Gỗ lim nguyên khối & Đá xanh Thanh Hóa · Sơn then thủ công'
                  })}
                  className="relative aspect-[4/3] overflow-hidden bg-paper-card border border-paper-border cursor-pointer group/img"
                  role="button"
                  tabIndex={0}
                  aria-label={`Phóng to ${t('aboutPage.workshopCard1Title')}`}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      setPreviewData({
                        src: VIETTORIA_IMAGES.curatedChuaMotCot,
                        title: t('aboutPage.workshopCard1Title'),
                        desc: t('aboutPage.workshopCard1Desc'),
                        tag: 'Chùa Một Cột · Liên Hoa Đài (Năm 1049)',
                        specs: 'Gỗ lim nguyên khối & Đá xanh Thanh Hóa · Sơn then thủ công'
                      });
                    }
                  }}
                >
                  <img
                    src={VIETTORIA_IMAGES.curatedChuaMotCot}
                    alt={t('aboutPage.workshopCard1Title')}
                    onError={(e) => handleImageFallback(e)}
                    className="w-full h-full object-cover object-center group-hover/img:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-forest/70 via-transparent to-transparent opacity-0 group-hover/img:opacity-100 transition-opacity duration-300 flex items-end justify-between p-3 text-paper">
                    <span className="text-xs font-mono text-paper/90">Xem chi tiết hiện vật</span>
                    <ZoomIn className="w-4 h-4 text-brass-light" />
                  </div>
                  <div className="absolute top-2 left-2 px-2 py-0.5 bg-forest/85 backdrop-blur-xs text-paper text-[10px] font-mono tracking-wider border border-brass/40">
                    Chùa Một Cột
                  </div>
                </div>

                <div className="space-y-1.5 pt-1">
                  <h3 className="font-serif font-bold text-lg text-forest group-hover:text-brass-dark transition-colors">
                    {t('aboutPage.workshopCard1Title')}
                  </h3>
                  <p className="text-xs sm:text-sm font-sans text-charcoal/80 font-normal leading-relaxed">
                    {t('aboutPage.workshopCard1Desc')}
                  </p>
                </div>
              </div>

              <div className="px-4 py-2.5 bg-paper/60 border-t border-paper-border text-[11px] font-mono text-charcoal-muted flex items-center justify-between">
                <span>Vật liệu: Gỗ & Đá</span>
                <span className="text-brass font-medium">Sơn then thủ công</span>
              </div>
            </div>

            {/* Card 2: Cấu Kiện Mộng Khớp - Deep Imperial Terracotta Lacquer */}
            <div className="group relative bg-[#1B1614] text-paper border border-terracotta/50 hover:border-brass transition-all duration-300 rounded-[2px] shadow-sm hover:shadow-lg flex flex-col justify-between overflow-hidden">
              <div className="p-4 sm:p-5 space-y-4">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-terracotta-light font-bold tracking-widest uppercase">02 · BẢN VẼ BÓC TÁCH</span>
                  <span className="px-2 py-0.5 border border-terracotta/40 bg-terracotta/20 text-paper text-[11px] font-medium tracking-wide">
                    MỘNG ÂM DƯƠNG
                  </span>
                </div>

                <div 
                  onClick={() => setPreviewData({
                    src: VIETTORIA_IMAGES.curatedAssemblyMong,
                    title: t('aboutPage.workshopCard3Title'),
                    desc: t('aboutPage.workshopCard3Desc'),
                    tag: 'Khuê Văn Các · Kỹ thuật mộng mộc truyền thống',
                    specs: 'Ghép mộng không keo · Khung sườn gỗ lim & Mái đao cong'
                  })}
                  className="relative aspect-[4/3] overflow-hidden bg-[#853018] border border-terracotta/40 cursor-pointer group/img"
                  role="button"
                  tabIndex={0}
                  aria-label={`Phóng to ${t('aboutPage.workshopCard3Title')}`}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      setPreviewData({
                        src: VIETTORIA_IMAGES.curatedAssemblyMong,
                        title: t('aboutPage.workshopCard3Title'),
                        desc: t('aboutPage.workshopCard3Desc'),
                        tag: 'Khuê Văn Các · Kỹ thuật mộng mộc truyền thống',
                        specs: 'Ghép mộng không keo · Khung sườn gỗ lim & Mái đao cong'
                      });
                    }
                  }}
                >
                  <img
                    src={VIETTORIA_IMAGES.curatedAssemblyMong}
                    alt={t('aboutPage.workshopCard3Title')}
                    onError={(e) => handleImageFallback(e)}
                    className="w-full h-full object-cover object-center group-hover/img:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent opacity-0 group-hover/img:opacity-100 transition-opacity duration-300 flex items-end justify-between p-3 text-paper">
                    <span className="text-xs font-mono text-paper/90">Xem cấu trúc mộng</span>
                    <ZoomIn className="w-4 h-4 text-brass-light" />
                  </div>
                  <div className="absolute top-2 left-2 px-2 py-0.5 bg-black/70 backdrop-blur-xs text-brass-light text-[10px] font-mono tracking-wider border border-brass/40">
                    Khuê Văn Các
                  </div>
                </div>

                <div className="space-y-1.5 pt-1">
                  <h3 className="font-serif font-bold text-lg text-paper group-hover:text-brass-light transition-colors">
                    {t('aboutPage.workshopCard3Title')}
                  </h3>
                  <p className="text-xs sm:text-sm font-sans text-paper/80 font-normal leading-relaxed">
                    {t('aboutPage.workshopCard3Desc')}
                  </p>
                </div>
              </div>

              <div className="px-4 py-2.5 bg-black/45 border-t border-terracotta/30 text-[11px] font-mono text-paper/70 flex items-center justify-between">
                <span>Khớp nối: Âm dương</span>
                <span className="text-terracotta-light font-medium">Không dùng keo dán</span>
              </div>
            </div>

            {/* Card 3: Ngọ Môn & Bao Bì Độc Bản - Warm Beige Curation */}
            <div className="group relative bg-paper-warm border border-paper-border hover:border-brass/70 transition-all duration-300 rounded-[2px] shadow-xs hover:shadow-md flex flex-col justify-between overflow-hidden">
              <div className="p-4 sm:p-5 space-y-4">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-brass font-bold tracking-widest uppercase">03 · BẢO CHỨNG ĐỘC BẢN</span>
                  <span className="px-2 py-0.5 border border-brass/30 bg-brass/10 text-forest text-[11px] font-medium tracking-wide">
                    TEM QR ĐỊNH DANH
                  </span>
                </div>

                <div 
                  onClick={() => setPreviewData({
                    src: VIETTORIA_IMAGES.curatedNgoMon,
                    title: t('aboutPage.workshopCard2Title'),
                    desc: t('aboutPage.workshopCard2Desc'),
                    tag: 'Ngọ Môn Huế · Phiên bản giới hạn Hoàng Cung',
                    specs: 'Hộp mỹ thuật vân dó ép kim · Kèm thẻ chứng thực độc bản & Audio Guide'
                  })}
                  className="relative aspect-[4/3] overflow-hidden bg-paper-card border border-paper-border cursor-pointer group/img"
                  role="button"
                  tabIndex={0}
                  aria-label={`Phóng to ${t('aboutPage.workshopCard2Title')}`}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      setPreviewData({
                        src: VIETTORIA_IMAGES.curatedNgoMon,
                        title: t('aboutPage.workshopCard2Title'),
                        desc: t('aboutPage.workshopCard2Desc'),
                        tag: 'Ngọ Môn Huế · Phiên bản giới hạn Hoàng Cung',
                        specs: 'Hộp mỹ thuật vân dó ép kim · Kèm thẻ chứng thực độc bản & Audio Guide'
                      });
                    }
                  }}
                >
                  <img
                    src={VIETTORIA_IMAGES.curatedNgoMon}
                    alt={t('aboutPage.workshopCard2Title')}
                    onError={(e) => handleImageFallback(e)}
                    className="w-full h-full object-cover object-center group-hover/img:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-forest/70 via-transparent to-transparent opacity-0 group-hover/img:opacity-100 transition-opacity duration-300 flex items-end justify-between p-3 text-paper">
                    <span className="text-xs font-mono text-paper/90">Xem chi tiết hiện vật</span>
                    <ZoomIn className="w-4 h-4 text-brass-light" />
                  </div>
                  <div className="absolute top-2 left-2 px-2 py-0.5 bg-forest/85 backdrop-blur-xs text-paper text-[10px] font-mono tracking-wider border border-brass/40">
                    Ngọ Môn Huế
                  </div>
                </div>

                <div className="space-y-1.5 pt-1">
                  <h3 className="font-serif font-bold text-lg text-forest group-hover:text-brass-dark transition-colors">
                    {t('aboutPage.workshopCard2Title')}
                  </h3>
                  <p className="text-xs sm:text-sm font-sans text-charcoal/80 font-normal leading-relaxed">
                    {t('aboutPage.workshopCard2Desc')}
                  </p>
                </div>
              </div>

              <div className="px-4 py-2.5 bg-paper/60 border-t border-paper-border text-[11px] font-mono text-charcoal-muted flex items-center justify-between">
                <span>Hộp: Vân dó ép kim</span>
                <span className="text-brass font-medium">Tem số hiệu bảo chứng</span>
              </div>
            </div>
          </div>
        </section>

        {/* Museum Exhibition Lightbox Modal */}
        {previewData && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 sm:p-6 backdrop-blur-md animate-fade-in"
            onClick={() => setPreviewData(null)}
            role="dialog"
            aria-modal="true"
            aria-label={previewData.title}
          >
            <div 
              className="relative max-w-4xl w-full border border-brass/50 bg-[#121915] p-5 sm:p-7 shadow-2xl rounded-[2px] text-paper flex flex-col space-y-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between border-b border-brass/30 pb-3">
                <div className="space-y-0.5">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-brass block">
                    {previewData.tag}
                  </span>
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-paper">
                    {previewData.title}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setPreviewData(null)}
                  className="p-1.5 text-paper/70 hover:text-paper hover:bg-white/10 rounded transition-colors cursor-pointer"
                  aria-label="Đóng xem ảnh"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="relative max-h-[62vh] overflow-hidden bg-black/50 border border-white/10 flex items-center justify-center">
                <img
                  src={previewData.src}
                  alt={previewData.title}
                  className="max-h-[60vh] w-auto max-w-full object-contain"
                />
              </div>

              <div className="space-y-2 pt-1 font-sans">
                <p className="text-xs sm:text-sm text-paper/85 leading-relaxed">
                  {previewData.desc}
                </p>
                <div className="text-[11px] font-mono text-brass-light/80 border-t border-white/10 pt-2 flex items-center justify-between">
                  <span>Khảo cứu: {previewData.specs}</span>
                  <span className="text-brass">VIETTORIA ATELIER</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Customer-facing collection call to action */}
        <section className="bg-forest-dark text-paper border border-brass corner-frame p-8 sm:p-12 relative overflow-hidden">
          <div className="relative z-10 max-w-3xl space-y-6">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brass-subtle">{t('aboutPage.ctaEyebrow')}</p>

            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-paper">
              {t('aboutPage.ctaTitle')}
            </h2>

            <p className="text-sm sm:text-base text-paper/85 font-normal leading-relaxed">
              {t('aboutPage.ctaDesc')}
            </p>

            <Link to="/collections" className="inline-flex items-center gap-2 border-b border-brass/70 pb-1 text-sm font-semibold text-paper transition-colors hover:text-brass-subtle">
              {t('aboutPage.ctaButton')} <ArrowRight className="h-4 w-4" strokeWidth={1.6} />
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AboutPage;
