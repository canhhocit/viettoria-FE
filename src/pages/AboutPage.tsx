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

          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-forest leading-[1.3] sm:leading-[1.32]">
            <span className="block">{t('aboutPage.heroTitleLine1')}</span>
            <span className="block italic font-normal text-brass-dark mt-1.5 sm:mt-2.5">
              {t('aboutPage.heroTitleLine2')}
            </span>
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

          {/* 3-Card Curated Atelier Display: Clean, Unified, Bright Heritage Aesthetic */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {/* Card 1: Chùa Một Cột */}
            <div className="group bg-paper-warm border border-paper-border hover:border-brass/70 transition-all duration-300 rounded-[2px] shadow-xs hover:shadow-md flex flex-col justify-between overflow-hidden">
              <div 
                onClick={() => setPreviewData({
                  src: VIETTORIA_IMAGES.curatedChuaMotCot,
                  title: t('aboutPage.workshopCard1Title'),
                  desc: t('aboutPage.workshopCard1Desc'),
                  tag: t('aboutPage.workshopCard1Tag'),
                  specs: 'Gỗ lim nguyên khối & Đá xanh Thanh Hóa · Sơn then thủ công'
                })}
                className="relative aspect-[4/3] overflow-hidden bg-paper-card border-b border-paper-border cursor-pointer group/img"
                role="button"
                tabIndex={0}
                aria-label={`Phóng to ${t('aboutPage.workshopCard1Title')}`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    setPreviewData({
                      src: VIETTORIA_IMAGES.curatedChuaMotCot,
                      title: t('aboutPage.workshopCard1Title'),
                      desc: t('aboutPage.workshopCard1Desc'),
                      tag: t('aboutPage.workshopCard1Tag'),
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
                <div className="absolute inset-0 bg-forest/40 opacity-0 group-hover/img:opacity-100 transition-opacity duration-300 flex items-center justify-center text-paper">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-forest/85 backdrop-blur-xs border border-brass/50 text-xs font-mono uppercase tracking-wider text-paper shadow-sm">
                    <ZoomIn className="w-3.5 h-3.5 text-brass" />
                    <span>Xem chi tiết</span>
                  </span>
                </div>
              </div>

              <div className="p-5 sm:p-6 space-y-2">
                <span className="text-[11px] font-mono uppercase tracking-widest text-brass font-bold block">
                  {t('aboutPage.workshopCard1Tag')}
                </span>
                <h3 className="font-serif font-bold text-xl text-forest group-hover:text-brass-dark transition-colors">
                  {t('aboutPage.workshopCard1Title')}
                </h3>
                <p className="text-xs sm:text-sm font-sans text-charcoal/80 font-normal leading-relaxed">
                  {t('aboutPage.workshopCard1Desc')}
                </p>
              </div>
            </div>

            {/* Card 2: Khuê Văn Các */}
            <div className="group bg-paper-warm border border-paper-border hover:border-brass/70 transition-all duration-300 rounded-[2px] shadow-xs hover:shadow-md flex flex-col justify-between overflow-hidden">
              <div 
                onClick={() => setPreviewData({
                  src: VIETTORIA_IMAGES.curatedKhueVanCac,
                  title: t('aboutPage.workshopCard2Title'),
                  desc: t('aboutPage.workshopCard2Desc'),
                  tag: t('aboutPage.workshopCard2Tag'),
                  specs: 'Ghép mộng không keo · Khung sườn gỗ lim & Mái đao cong'
                })}
                className="relative aspect-[4/3] overflow-hidden bg-paper-card border-b border-paper-border cursor-pointer group/img"
                role="button"
                tabIndex={0}
                aria-label={`Phóng to ${t('aboutPage.workshopCard2Title')}`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    setPreviewData({
                      src: VIETTORIA_IMAGES.curatedKhueVanCac,
                      title: t('aboutPage.workshopCard2Title'),
                      desc: t('aboutPage.workshopCard2Desc'),
                      tag: t('aboutPage.workshopCard2Tag'),
                      specs: 'Ghép mộng không keo · Khung sườn gỗ lim & Mái đao cong'
                    });
                  }
                }}
              >
                <img
                  src={VIETTORIA_IMAGES.curatedKhueVanCac}
                  alt={t('aboutPage.workshopCard2Title')}
                  onError={(e) => handleImageFallback(e)}
                  className="w-full h-full object-cover object-center group-hover/img:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-forest/40 opacity-0 group-hover/img:opacity-100 transition-opacity duration-300 flex items-center justify-center text-paper">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-forest/85 backdrop-blur-xs border border-brass/50 text-xs font-mono uppercase tracking-wider text-paper shadow-sm">
                    <ZoomIn className="w-3.5 h-3.5 text-brass" />
                    <span>Xem chi tiết</span>
                  </span>
                </div>
              </div>

              <div className="p-5 sm:p-6 space-y-2">
                <span className="text-[11px] font-mono uppercase tracking-widest text-brass font-bold block">
                  {t('aboutPage.workshopCard2Tag')}
                </span>
                <h3 className="font-serif font-bold text-xl text-forest group-hover:text-brass-dark transition-colors">
                  {t('aboutPage.workshopCard2Title')}
                </h3>
                <p className="text-xs sm:text-sm font-sans text-charcoal/80 font-normal leading-relaxed">
                  {t('aboutPage.workshopCard2Desc')}
                </p>
              </div>
            </div>

            {/* Card 3: Ngọ Môn Huế */}
            <div className="group bg-paper-warm border border-paper-border hover:border-brass/70 transition-all duration-300 rounded-[2px] shadow-xs hover:shadow-md flex flex-col justify-between overflow-hidden">
              <div 
                onClick={() => setPreviewData({
                  src: VIETTORIA_IMAGES.curatedNgoMon,
                  title: t('aboutPage.workshopCard3Title'),
                  desc: t('aboutPage.workshopCard3Desc'),
                  tag: t('aboutPage.workshopCard3Tag'),
                  specs: 'Hộp mỹ thuật vân dó ép kim · Kèm thẻ chứng thực độc bản & Audio Guide'
                })}
                className="relative aspect-[4/3] overflow-hidden bg-paper-card border-b border-paper-border cursor-pointer group/img"
                role="button"
                tabIndex={0}
                aria-label={`Phóng to ${t('aboutPage.workshopCard3Title')}`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    setPreviewData({
                      src: VIETTORIA_IMAGES.curatedNgoMon,
                      title: t('aboutPage.workshopCard3Title'),
                      desc: t('aboutPage.workshopCard3Desc'),
                      tag: t('aboutPage.workshopCard3Tag'),
                      specs: 'Hộp mỹ thuật vân dó ép kim · Kèm thẻ chứng thực độc bản & Audio Guide'
                    });
                  }
                }}
              >
                <img
                  src={VIETTORIA_IMAGES.curatedNgoMon}
                  alt={t('aboutPage.workshopCard3Title')}
                  onError={(e) => handleImageFallback(e)}
                  className="w-full h-full object-cover object-center group-hover/img:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-forest/40 opacity-0 group-hover/img:opacity-100 transition-opacity duration-300 flex items-center justify-center text-paper">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-forest/85 backdrop-blur-xs border border-brass/50 text-xs font-mono uppercase tracking-wider text-paper shadow-sm">
                    <ZoomIn className="w-3.5 h-3.5 text-brass" />
                    <span>Xem chi tiết</span>
                  </span>
                </div>
              </div>

              <div className="p-5 sm:p-6 space-y-2">
                <span className="text-[11px] font-mono uppercase tracking-widest text-brass font-bold block">
                  {t('aboutPage.workshopCard3Tag')}
                </span>
                <h3 className="font-serif font-bold text-xl text-forest group-hover:text-brass-dark transition-colors">
                  {t('aboutPage.workshopCard3Title')}
                </h3>
                <p className="text-xs sm:text-sm font-sans text-charcoal/80 font-normal leading-relaxed">
                  {t('aboutPage.workshopCard3Desc')}
                </p>
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
