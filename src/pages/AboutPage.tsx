import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Headphones,
  Layers, 
  ShieldCheck, 
  Compass,
  Camera,
  ArrowRight
} from 'lucide-react';
import { VIETTORIA_IMAGES, handleImageFallback } from '../utils/mediaResolver';
import { useLanguage } from '../contexts/LanguageContext';

export const AboutPage: React.FC = () => {
  const { t } = useLanguage();

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
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-paper-border pb-4">
            <div className="space-y-2">
              <span className="text-xs font-cinzel uppercase tracking-widest text-brass font-bold flex items-center gap-2">
                <Camera className="w-4 h-4 text-brass" />
                <span>{t('aboutPage.workshopEyebrow')}</span>
              </span>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-forest">
                {t('aboutPage.workshopTitle')}
              </h2>
            </div>
            <p className="text-xs font-cinzel text-charcoal-muted uppercase tracking-wider font-semibold">
              {t('aboutPage.workshopArchive')}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-paper-warm border border-paper-border p-3 space-y-3 corner-frame group shadow-xs hover:border-brass/60 transition-colors">
              <div className="aspect-[16/10] overflow-hidden bg-paper-card border border-paper-border">
                <img
                  src={VIETTORIA_IMAGES.productHighlight}
                  alt={t('aboutPage.workshopCard1Title')}
                  onError={(e) => handleImageFallback(e)}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="px-1">
                <p className="font-display font-bold text-base text-forest">{t('aboutPage.workshopCard1Title')}</p>
                <p className="text-sm font-sans text-charcoal/75 font-normal leading-relaxed mt-1">{t('aboutPage.workshopCard1Desc')}</p>
              </div>
            </div>

            <div className="bg-paper-warm border border-paper-border p-3 space-y-3 corner-frame group shadow-xs hover:border-brass/60 transition-colors">
              <div className="aspect-[16/10] overflow-hidden bg-paper-card border border-paper-border">
                <img
                  src={VIETTORIA_IMAGES.certificateCard}
                  alt={t('aboutPage.workshopCard2Title')}
                  onError={(e) => handleImageFallback(e)}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="px-1">
                <p className="font-display font-bold text-base text-forest">{t('aboutPage.workshopCard2Title')}</p>
                <p className="text-sm font-sans text-charcoal/75 font-normal leading-relaxed mt-1">{t('aboutPage.workshopCard2Desc')}</p>
              </div>
            </div>

            <div className="bg-paper-warm border border-paper-border p-3 space-y-3 corner-frame group shadow-xs hover:border-brass/60 transition-colors">
              <div className="aspect-[16/10] overflow-hidden bg-paper-card border border-paper-border">
                <img
                  src={VIETTORIA_IMAGES.monumentDetail1}
                  alt={t('aboutPage.workshopCard3Title')}
                  onError={(e) => handleImageFallback(e)}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="px-1">
                <p className="font-display font-bold text-base text-forest">{t('aboutPage.workshopCard3Title')}</p>
                <p className="text-sm font-sans text-charcoal/75 font-normal leading-relaxed mt-1">{t('aboutPage.workshopCard3Desc')}</p>
              </div>
            </div>
          </div>
        </section>

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
