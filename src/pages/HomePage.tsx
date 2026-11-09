import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowDown, ArrowRight, BookOpen, Pause, Play } from 'lucide-react';
import { publicApi } from '../services/api';
import type { Product, Collection, BlogPost } from '../types';
import { FALLBACK_BLOGS, FALLBACK_COLLECTIONS, FALLBACK_PRODUCTS } from '../data/fallbackData';
import { resolve3DModelUrl, resolve3DPreview, resolveImageUrl, handleImageFallback } from '../utils/mediaResolver';
import { useLanguage } from '../contexts/LanguageContext';
import { HeritageParticles } from '../components/effects/HeritageParticles';
import { TiltCard } from '../components/effects/TiltCard';

const imageFor = (path?: string | null, slug?: string) =>
  resolveImageUrl(path || (slug ? resolve3DPreview(slug)?.poster : undefined));

const useReducedMotionPreference = () => {
  const [reducedMotion, setReducedMotion] = useState(() =>
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updatePreference = (event: MediaQueryListEvent) => setReducedMotion(event.matches);
    setReducedMotion(preference.matches);
    preference.addEventListener('change', updatePreference);
    return () => preference.removeEventListener('change', updatePreference);
  }, []);

  return reducedMotion;
};

const useHomeScrollReveal = (containerRef: React.RefObject<HTMLElement | null>, reducedMotion: boolean) => {
  useEffect(() => {
    const container = containerRef.current;
    if (!container || reducedMotion || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -48px 0px', threshold: 0.12 });

    const observeTargets = () => {
      container.querySelectorAll<HTMLElement>('[data-home-reveal]:not(.is-visible)')
        .forEach((target) => observer.observe(target));
    };

    container.classList.add('home-reveal-ready');
    observeTargets();

    const mutations = new MutationObserver(observeTargets);
    mutations.observe(container, { childList: true, subtree: true });

    return () => {
      mutations.disconnect();
      observer.disconnect();
      container.classList.remove('home-reveal-ready');
    };
  }, [containerRef, reducedMotion]);
};

const InteractiveModelStage: React.FC<{ product: Product; reducedMotion: boolean; }> = ({ product, reducedMotion }) => {
  const { t } = useLanguage();
  const [viewerAvailable, setViewerAvailable] = useState(() =>
    typeof window !== 'undefined' && Boolean(window.customElements?.get('model-viewer')),
  );
  const [loadedModelKey, setLoadedModelKey] = useState<string | null>(null);
  const [failedModelKey, setFailedModelKey] = useState<string | null>(null);
  const [previewPlaying, setPreviewPlaying] = useState(false);
  const modelViewerRef = useRef<HTMLElement | null>(null);
  const preview = resolve3DPreview(product.slug);
  const poster = preview?.poster || imageFor(product.heroImage);
  const modelUrl = resolve3DModelUrl(product.model3dUrl || product.slug);
  const modelKey = `${product.id}:${modelUrl}`;
  const modelLoaded = loadedModelKey === modelKey;
  const modelFailed = failedModelKey === modelKey;
  const turntable = preview?.turntable;

  useEffect(() => {
    if (window.customElements.get('model-viewer')) {
      setViewerAvailable(true);
      return;
    }

    let mounted = true;
    const fallbackTimer = window.setTimeout(() => {
      if (mounted) setViewerAvailable(false);
    }, 4000);

    void window.customElements.whenDefined('model-viewer').then(() => {
      if (!mounted) return;
      window.clearTimeout(fallbackTimer);
      setViewerAvailable(true);
    });

    return () => {
      mounted = false;
      window.clearTimeout(fallbackTimer);
    };
  }, []);

  useEffect(() => {
    setPreviewPlaying(false);
  }, [modelKey]);

  useEffect(() => {
    const modelViewer = modelViewerRef.current;
    if (!viewerAvailable || !modelViewer) return;

    const handleLoad = () => {
      setLoadedModelKey(modelKey);
      setFailedModelKey(null);
    };
    const handleError = () => setFailedModelKey(modelKey);

    modelViewer.addEventListener('load', handleLoad);
    modelViewer.addEventListener('error', handleError);
    return () => {
      modelViewer.removeEventListener('load', handleLoad);
      modelViewer.removeEventListener('error', handleError);
    };
  }, [modelKey, viewerAvailable]);

  useEffect(() => {
    if (!viewerAvailable || modelLoaded || modelFailed) return;
    const loadTimeout = window.setTimeout(() => setFailedModelKey(modelKey), 20000);
    return () => window.clearTimeout(loadTimeout);
  }, [modelFailed, modelKey, modelLoaded, viewerAvailable]);
  const useTurntableFallback = previewPlaying && Boolean(turntable) && !modelLoaded;

  return (
    <>
      <img
        src={poster}
        alt={`Hình ảnh mô hình ${product.name}`}
        loading="lazy"
        className={`absolute inset-0 h-full w-full object-contain transition-opacity duration-700 ${modelLoaded ? 'opacity-0' : 'opacity-100'}`}
        onError={(event) => handleImageFallback(event, resolveImageUrl(product.heroImage))}
      />
      {useTurntableFallback && (
        <video
          key={`${product.slug}-preview`}
          src={turntable}
          poster={poster}
          autoPlay
          muted
          playsInline
          preload="metadata"
          aria-hidden="true"
          onEnded={() => setPreviewPlaying(false)}
          onError={() => setPreviewPlaying(false)}
          className={`absolute inset-0 h-full w-full object-contain transition-opacity duration-700 ${modelLoaded ? 'opacity-0' : 'opacity-100'}`}
        />
      )}
      {viewerAvailable && !modelFailed && (
        <model-viewer
          key={`${product.slug}-model`}
          src={modelUrl}
          alt={`Mô hình 3D có thể xoay của ${product.name}`}
          camera-controls
          shadow-intensity="0.75"
          exposure="1"
          interaction-prompt="none"
          loading="lazy"
          reveal="auto"
          ref={modelViewerRef}
          style={{ width: '100%', height: '100%', backgroundColor: 'var(--heritage-paper-card)', touchAction: 'pan-y' }}
          className={`home-model-viewer absolute inset-0 h-full w-full transition-opacity duration-700 ${modelLoaded ? 'opacity-100' : 'opacity-0'}`}
        />
      )}
      <div className="pointer-events-none absolute left-4 top-4 z-10 bg-header/90 px-3 py-1.5 text-[11px] text-brown-dark">
        {modelLoaded
          ? t('home.dragToRotate', 'Mô hình 3D · Kéo để xoay')
          : previewPlaying
            ? t('home.previewVideo', 'Video xem trước')
            : modelFailed || !viewerAvailable
              ? t('home.previewPhoto', 'Ảnh xem trước')
              : t('home.loadingModel', 'Đang tải mô hình 3D…')}
      </div>
      {turntable && !reducedMotion && !modelLoaded && (
        <button
          type="button"
          onClick={() => setPreviewPlaying((playing) => !playing)}
          aria-label={previewPlaying ? t('home.stopVideo', 'Dừng video xem trước mô hình') : t('home.playVideo', 'Phát video xem trước mô hình')}
          aria-pressed={previewPlaying}
          className="absolute right-4 top-4 z-10 inline-flex min-h-8 items-center gap-2 border border-paper-border bg-header/95 px-3 text-xs font-sans uppercase tracking-[0.08em] text-brown-dark font-medium transition-colors hover:border-brass hover:text-forest focus-visible:outline focus-visible:outline-2 focus-visible:outline-brass"
        >
          {previewPlaying ? <Pause size={13} /> : <Play size={13} />}
          {previewPlaying ? t('home.stopVideo', 'Dừng video') : t('home.playVideo', 'Xem chuyển động')}
        </button>
      )}
    </>
  );
};

const ScrollyHeritage: React.FC<{ products: Product[]; }> = ({ products }) => {
  const { t, localizeProduct } = useLanguage();
  const reducedMotion = useReducedMotionPreference();
  const [activeMobileIndex, setActiveMobileIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  if (products.length === 0) return null;

  const scrollToCard = (index: number) => {
    setActiveMobileIndex(index);
    if (!scrollContainerRef.current) return;
    const cards = scrollContainerRef.current.children;
    if (cards[index]) {
      (cards[index] as HTMLElement).scrollIntoView({
        behavior: reducedMotion ? 'auto' : 'smooth',
        inline: 'center',
        block: 'nearest',
      });
    }
  };

  return (
    <section id="hanh-trinh-di-san" className="home-story-section border-y border-paper-border bg-header">
      <div className="mx-auto max-w-[1440px] px-5 py-14 sm:px-8 sm:py-20 lg:px-16 lg:py-24">
        {/* Header Section */}
        <div data-home-reveal className="mb-8 flex flex-col justify-between gap-5 sm:mb-10 lg:flex-row lg:items-end">
          <div className="max-w-2xl">
            <p className="mb-2.5 font-cinzel text-xs font-bold uppercase tracking-[0.2em] text-brass">
              {t('home.scrollyEyebrow', 'Một vòng qua di sản Việt')}
            </p>
            <h2 className="font-display text-3xl font-bold leading-tight text-forest sm:text-4xl lg:text-5xl">
              {t('home.scrollyHeading', 'Mỗi công trình, một câu chuyện')}
            </h2>
            <p className="mt-3.5 max-w-xl text-sm leading-relaxed text-charcoal-muted sm:text-base">
              {t('home.scrollyDesc', 'Chiêm ngưỡng các mô hình 3D số hóa và khám phá câu chuyện lịch sử phía sau từng dấu ấn kiến trúc văn hiến.')}
            </p>
          </div>

          {/* Quick Monument Navigation Pills */}
          <nav className="flex flex-wrap items-center gap-2" aria-label={t('home.selectMonument', 'Chọn công trình đang xem')}>
            {products.map((rawProduct, index) => {
              const product = localizeProduct(rawProduct);
              return (
                <button
                  key={product.id}
                  type="button"
                  onClick={() => scrollToCard(index)}
                  aria-pressed={activeMobileIndex === index}
                  className={`inline-flex items-center gap-1.5 border px-3 py-1.5 text-xs font-sans transition-all ${
                    activeMobileIndex === index
                      ? 'border-forest bg-forest text-brass font-bold shadow-xs'
                      : 'border-paper-border bg-paper text-forest hover:border-brass hover:text-forest hover:bg-paper-warm font-medium'
                  }`}
                >
                  <span className={`font-cinzel text-[10px] font-bold ${activeMobileIndex === index ? 'text-brass-light' : 'text-brass'}`}>
                    0{index + 1}
                  </span>
                  <span>{product.name}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Horizontal Model Cards: Grid on Desktop, Swipe Track on Mobile */}
        <div
          ref={scrollContainerRef}
          className="flex overflow-x-auto snap-x snap-mandatory gap-5 pb-4 no-scrollbar sm:gap-6 lg:grid lg:grid-cols-3 lg:gap-8 lg:overflow-visible lg:pb-0"
        >
          {products.map((rawProduct, index) => {
            const product = localizeProduct(rawProduct);
            return (
              <TiltCard
                key={product.id}
                className="min-w-[85vw] sm:min-w-[360px] lg:min-w-0 snap-center h-full"
                glareEffect={true}
                tiltAmount={1.8}
              >
                <article
                  id={`di-san-${product.slug}`}
                  data-home-reveal
                  className="home-story-card corner-frame group flex h-full flex-col border border-paper-border bg-paper-card shadow-xs transition-all duration-300 hover:border-brass/70 hover:shadow-xl"
                >
                {/* Card Plaque Top Bar - Imperial Forest Green & Brass */}
                <div className="flex items-center justify-between border-b border-brass/40 bg-forest px-4 py-2.5 text-xs text-paper">
                  <div className="flex items-center gap-2">
                    <span className="font-cinzel text-xs font-bold text-brass">0{index + 1}</span>
                    <span className="h-2.5 w-px bg-brass/40" />
                    <span className="truncate max-w-[150px] font-sans text-[11px] uppercase tracking-wider text-paper/90 font-medium">
                      {product.location}
                    </span>
                  </div>
                  <span className="font-cinzel text-[10px] uppercase tracking-widest text-brass-light font-bold">
                    {product.epoch}
                  </span>
                </div>

                {/* 3D Model Viewport */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-paper sm:aspect-[1.18/1]">
                  {/* Exhibition Pedestal Spotlight */}
                  <div className="heritage-pedestal-light pointer-events-none absolute inset-0 z-[1]" aria-hidden="true" />
                  
                  <InteractiveModelStage product={product} reducedMotion={reducedMotion} />

                  {/* Bottom Overlay with Monument Name and Index */}
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex items-end justify-between bg-gradient-to-t from-forest-dark/85 via-forest-dark/35 to-transparent px-4 pb-3 pt-12 text-paper-light">
                    <p className="font-display text-base sm:text-lg font-bold text-paper drop-shadow-xs">
                      {product.name}
                    </p>
                    <span className="font-cinzel text-[11px] font-bold text-white/90">
                      0{index + 1} / 0{products.length}
                    </span>
                  </div>
                </div>

                {/* Card Information Body */}
                <div className="flex flex-1 flex-col justify-between p-5 sm:p-6">
                  <div>
                    <h3 className="font-display text-xl sm:text-2xl font-bold leading-snug text-forest transition-colors group-hover:text-brass-dark">
                      <Link to={`/products/${product.slug}`}>
                        {product.name}
                      </Link>
                    </h3>
                    <p className="mt-1 font-display text-xs sm:text-sm italic text-brass-dark font-medium">
                      {product.subName}
                    </p>
                    <p className="mt-3.5 text-xs sm:text-sm leading-relaxed text-charcoal/85 line-clamp-3">
                      {product.shortDescription}
                    </p>
                  </div>

                  {/* Card Action Link */}
                  <div className="mt-6 flex items-center justify-between border-t border-paper-border pt-4">
                    <span className="font-cinzel text-[10px] font-bold uppercase tracking-wider text-charcoal-muted">
                      {product.epoch}
                    </span>
                    <Link
                      to={`/products/${product.slug}`}
                      className="inline-flex items-center gap-1.5 text-xs font-sans font-bold uppercase tracking-wider text-forest transition-colors hover:text-brass"
                    >
                      <span>{t('common.exploreMonument', 'Tìm hiểu công trình')}</span>
                      <ArrowRight size={13} strokeWidth={2} className="transition-transform group-hover:translate-x-1 text-brass" />
                    </Link>
                  </div>
                </div>
              </article>
            </TiltCard>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export const HomePage: React.FC = () => {
  const { t, localizeCollection, localizeBlog } = useLanguage();
  const mainRef = useRef<HTMLElement>(null);
  const initialHero = FALLBACK_PRODUCTS.find((product) => product.isHeroRelease) || FALLBACK_PRODUCTS[0];
  const [heroProduct, setHeroProduct] = useState<Product | null>(initialHero || null);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>(FALLBACK_PRODUCTS.filter((product) => !product.isHeroRelease).slice(0, 4));
  const [collections, setCollections] = useState<Collection[]>(FALLBACK_COLLECTIONS);
  const [blogs, setBlogs] = useState<BlogPost[]>(FALLBACK_BLOGS);
  const [heroVideoReady, setHeroVideoReady] = useState(false);
  const heroVideoRef = useRef<HTMLVideoElement>(null);
  const prefersReducedMotion = useReducedMotionPreference();
  useHomeScrollReveal(mainRef, prefersReducedMotion);

  const storyProducts = useMemo(() => {
    const products = [...(heroProduct ? [heroProduct] : []), ...featuredProducts];
    return [...new Map(products.map((product) => [product.id, product])).values()].slice(0, 3);
  }, [featuredProducts, heroProduct]);

  useEffect(() => {
    let mounted = true;
    publicApi.getFeatured().then((data) => {
      if (!mounted) return;
      setHeroProduct(data.heroProduct);
      setFeaturedProducts(data.featuredProducts || []);
      setCollections(data.collections);
      setBlogs(data.latestBlogs);
    });
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    const video = heroVideoRef.current;
    if (!video || prefersReducedMotion || typeof IntersectionObserver === 'undefined') return;

    let heroVisible = false;
    const updatePlayback = () => {
      if (heroVisible && !document.hidden) {
        void video.play().catch(() => undefined);
      } else {
        video.pause();
      }
    };
    const observer = new IntersectionObserver(([entry]) => {
      heroVisible = entry.isIntersecting;
      updatePlayback();
    }, { threshold: 0.05 });

    observer.observe(video);
    document.addEventListener('visibilitychange', updatePlayback);
    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', updatePlayback);
      video.pause();
    };
  }, [prefersReducedMotion]);

  return (
    <main ref={mainRef} className="bg-paper text-ink">
      <section id="hero" className="home-hero relative isolate flex min-h-[620px] overflow-hidden bg-forest-dark text-paper md:min-h-[calc(100svh-80px)]">
        <img
          src="/videos/hero-background-poster.webp"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover"
        />
        {!prefersReducedMotion && (
          <video
            ref={heroVideoRef}
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            poster="/videos/hero-background-poster.webp"
            aria-hidden="true"
            onLoadedData={() => setHeroVideoReady(true)}
            onCanPlay={() => setHeroVideoReady(true)}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${heroVideoReady ? 'opacity-100' : 'opacity-0'}`}
          >
            <source src="/videos/hero-background.webm" type="video/webm" />
            <source src="/videos/hero-background.mp4" type="video/mp4" />
          </video>
        )}
        <div className="home-hero-scrim absolute inset-0" aria-hidden="true" />
        <HeritageParticles className="absolute inset-0 pointer-events-none z-[3]" />
        <div className="home-hero-drum pointer-events-none absolute -right-[17vw] top-1/2 z-[1] h-[82vw] w-[82vw] max-h-[920px] max-w-[920px] -translate-y-1/2 sm:-right-[10vw] lg:right-[-5vw] lg:h-[64vw] lg:w-[64vw]" aria-hidden="true">
          <img src="/images/trong-dong.webp" alt="" className="home-dong-son home-dong-son-celestial h-full w-full object-contain opacity-35 mix-blend-screen" />
        </div>

        <div className="relative z-10 mx-auto flex w-full max-w-[1440px] items-center px-5 pb-24 pt-16 sm:px-8 lg:px-16">
          <div className="max-w-[880px] animate-fade-up py-10">
            <h1 className="font-display text-[clamp(2.75rem,5.8vw,5.5rem)] font-normal leading-[1.18] tracking-normal text-paper">
              <span className="block">{t('home.heroTitleLine1', 'Văn Minh')}</span>
              <span className="heritage-gold-foil font-normal italic pb-1">{t('home.heroTitleLine2', 'Di Sản Việt')}</span>
            </h1>
            <p className="mt-6 max-w-[700px] text-lg leading-8 text-white/90 sm:text-xl sm:leading-9">
              {t('home.heroSubtitle', 'Hành trình số hóa bảo tàng, di tích và ký ức văn hóa Việt Nam qua các câu chuyện lịch sử')}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link to="/collections" className="animate-gold-glint inline-flex min-h-12 items-center gap-3 bg-brass px-6 py-3 text-sm font-semibold text-forest transition-all hover:bg-brass-light shadow-[0_0_20px_rgba(184,138,68,0.25)] hover:shadow-[0_0_35px_rgba(184,138,68,0.5)]">
                {t('home.heroCtaCollection', 'Khám phá bộ sưu tập')} <ArrowRight size={16} strokeWidth={1.7} />
              </Link>
              <Link
                to="/about"
                className="group relative inline-flex min-h-12 items-center gap-2.5 border-2 border-brass bg-paper px-6 py-3 text-sm font-semibold text-forest shadow-[0_0_25px_rgba(184,138,68,0.35)] transition-all duration-300 hover:bg-white hover:border-brass-light hover:text-brown hover:shadow-[0_0_35px_rgba(184,138,68,0.6)] hover:-translate-y-0.5"
              >
                <BookOpen size={16} strokeWidth={1.8} className="text-brass transition-transform duration-300 group-hover:scale-110" />
                <span>{t('home.heroCtaStory', 'Câu chuyện Viettoria')}</span>
              </Link>
            </div>
            <div className="mt-11 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-white/25 pt-4 text-xs tracking-wide text-white/75">
              <span>{t('home.heroBadge1', 'Mô hình kiến trúc')}</span>
              <span className="h-1 w-1 bg-brass" />
              <span>{t('home.heroBadge2', 'Câu chuyện di sản')}</span>
              <span className="h-1 w-1 bg-brass" />
              <span>{t('home.heroBadge3', 'Trải nghiệm 3D')}</span>
            </div>
          </div>
        </div>
        <a href="#hanh-trinh-di-san" className="absolute bottom-6 left-5 z-10 inline-flex items-center gap-2 text-xs tracking-wide text-white/80 transition-colors hover:text-white sm:left-8 lg:left-16">
          {t('home.scrollDown', 'Cuộn để khám phá')} <ArrowDown size={14} strokeWidth={1.5} />
        </a>
      </section>

      <ScrollyHeritage products={storyProducts} />

      <section id="bo-suu-tap" className="mx-auto max-w-[1440px] px-5 py-16 sm:px-8 sm:py-20 lg:px-16 lg:py-24">
        <div data-home-reveal className="mb-8 flex flex-wrap items-end justify-between gap-4 border-b border-paper-border pb-5 sm:mb-10">
          <div>
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-brass-dark">{t('home.collectionEyebrow', 'Chọn theo câu chuyện bạn yêu thích')}</p>
            <h2 className="font-display text-3xl font-bold text-forest sm:text-4xl">{t('home.collectionHeading', 'Bộ sưu tập di sản')}</h2>
          </div>
          <Link to="/collections" className="inline-flex items-center gap-2 pb-1 text-sm font-bold text-forest hover:text-brass transition-colors">
            {t('common.viewAll', 'Xem tất cả')} <ArrowRight size={15} strokeWidth={2} />
          </Link>
        </div>

        <div className="grid gap-x-5 gap-y-9 sm:grid-cols-2 lg:grid-cols-3">
          {collections.map((rawCollection) => {
            const collection = localizeCollection(rawCollection);
            const representative = storyProducts.find((product) => product.collectionId === rawCollection.id);
            const poster = imageFor(representative?.heroImage || collection.heroImage, representative?.slug);
            return (
              <Link key={collection.id} to={`/collections/${collection.slug}`} data-home-reveal className="group block border-b border-paper-border pb-5">
                <div className="corner-frame relative mb-4 flex aspect-[1.32/0.9] items-center justify-center overflow-hidden border border-brass/30 bg-paper-card shadow-sm transition-all duration-300 group-hover:border-forest group-hover:shadow-xl">
                  <img
                    src={poster}
                    alt={collection.name}
                    loading="lazy"
                    onError={(event) => handleImageFallback(event, '/3D/chua-mot-cot-poster.webp')}
                    className="h-full w-full object-contain transition-transform duration-700 group-hover:scale-[1.035]"
                  />
                  <span className="absolute left-3 top-3 border border-brass/40 bg-forest px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.13em] text-brass">{collection.productsCount || 1} {t('common.monumentCount', 'tác phẩm')}</span>
                </div>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-display text-2xl font-bold text-forest transition-colors group-hover:text-brass-dark">{collection.name}</h3>
                    <p className="mt-1.5 line-clamp-2 text-sm leading-6 text-charcoal/85">{collection.description}</p>
                  </div>
                  <ArrowRight size={17} strokeWidth={2} className="mt-1 shrink-0 text-forest transition-transform group-hover:translate-x-1 group-hover:text-brass" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="border-y-2 border-brass/40 bg-forest text-paper">
        <div className="mx-auto grid max-w-[1440px] gap-8 px-5 py-16 sm:px-8 md:grid-cols-[0.8fr_1.2fr] lg:px-16">
          <div data-home-reveal>
            <p className="text-xs font-cinzel font-bold uppercase tracking-[0.2em] text-brass">
              {t('home.blogEyebrow', 'Ghi chép về di sản')}
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold text-paper sm:text-4xl">
              {t('home.blogHeading', 'Câu chuyện phía sau công trình')}
            </h2>
            <p className="mt-3 max-w-sm text-sm leading-6 text-paper/80 font-normal">
              {t('home.blogDesc', 'Đọc thêm về kiến trúc, con người và những dấu mốc làm nên từng di sản.')}
            </p>
            <Link to="/blogs" className="mt-6 inline-flex items-center gap-2 border border-brass bg-brass px-5 py-2.5 text-xs font-sans font-bold uppercase tracking-wider text-forest transition-all hover:bg-brass-light hover:shadow-lg">
              {t('home.readBlogCta', 'Đọc bài viết')} <ArrowRight size={14} strokeWidth={2} />
            </Link>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            {blogs.slice(0, 2).map((rawBlog, index) => {
              const blog = localizeBlog(rawBlog);
              return (
                <article key={blog.id} data-home-reveal className="group border-t border-brass/30 pt-4">
                  <p className="font-cinzel text-xs font-bold uppercase tracking-[0.14em] text-brass">{blog.category} · 0{index + 1}</p>
                  <h3 className="mt-3 font-display text-2xl leading-snug text-paper">
                    <Link to={`/blogs/${blog.slug}`} className="transition-colors group-hover:text-brass-light">{blog.title}</Link>
                  </h3>
                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-paper/75">{blog.excerpt}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
};

export default HomePage;
