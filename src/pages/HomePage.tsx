import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowDown, ArrowRight, Pause, Play } from 'lucide-react';
import { publicApi } from '../services/api';
import type { Product, Collection, BlogPost } from '../types';
import { FALLBACK_BLOGS, FALLBACK_COLLECTIONS, FALLBACK_PRODUCTS } from '../data/fallbackData';
import { resolve3DModelUrl, resolve3DPreview, resolveImageUrl, handleImageFallback } from '../utils/mediaResolver';
import { useLanguage } from '../contexts/LanguageContext';

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
          loading="eager"
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
  const { t } = useLanguage();
  const reducedMotion = useReducedMotionPreference();
  const [activeIndex, setActiveIndex] = useState(0);
  const chapterRefs = useRef<Array<HTMLElement | null>>([]);
  const activeProduct = products[activeIndex] || products[0];

  useEffect(() => {
    const chapters = chapterRefs.current.filter((chapter): chapter is HTMLElement => chapter !== null);
    if (chapters.length === 0 || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver((entries) => {
      const closestChapter = entries
        .filter((entry) => entry.isIntersecting)
        .sort((first, second) => {
          const firstDistance = Math.abs(first.boundingClientRect.top + first.boundingClientRect.height / 2 - window.innerHeight / 2);
          const secondDistance = Math.abs(second.boundingClientRect.top + second.boundingClientRect.height / 2 - window.innerHeight / 2);
          return firstDistance - secondDistance;
        })[0];

      if (closestChapter) {
        setActiveIndex(Number(closestChapter.target.getAttribute('data-chapter-index')));
      }
    }, { rootMargin: '-40% 0px -40% 0px', threshold: 0 });

    chapters.forEach((chapter) => observer.observe(chapter));
    return () => observer.disconnect();
  }, [products]);

  if (products.length === 0 || !activeProduct) return null;

  const jumpToChapter = (index: number) => {
    chapterRefs.current[index]?.scrollIntoView({
      behavior: reducedMotion ? 'auto' : 'smooth',
      block: 'center',
    });
  };

  return (
    <section id="hanh-trinh-di-san" className="home-story-section border-y border-paper-border bg-header">
      <div className="mx-auto max-w-[1440px] px-5 py-16 sm:px-8 sm:py-20 lg:px-16 lg:py-24">
        <header data-home-reveal className="mb-9 max-w-2xl sm:mb-12">
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-brass-dark">{t('home.scrollyEyebrow', 'Một vòng qua di sản Việt')}</p>
          <h2 className="font-display text-3xl leading-tight text-ink sm:text-4xl lg:text-5xl">{t('home.scrollyHeading', 'Mỗi công trình, một câu chuyện')}</h2>
          <p className="mt-4 max-w-xl text-sm leading-7 text-charcoal-muted sm:text-base">
            {t('home.scrollyDesc', 'Cuộn trang để lần lượt ngắm các mô hình 3D và khám phá câu chuyện phía sau từng dấu ấn kiến trúc.')}
          </p>
        </header>

        <div className="grid items-start gap-7 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
          <div data-home-reveal className="home-story-stage sticky top-[76px] z-10 h-[min(62vw,390px)] min-h-[250px] overflow-hidden border border-paper-border bg-paper-card shadow-sm lg:top-24 lg:h-[min(68vh,650px)] lg:min-h-[480px]">
            <InteractiveModelStage product={activeProduct} reducedMotion={reducedMotion} />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between bg-gradient-to-t from-forest-dark/85 via-forest-dark/35 to-transparent px-5 pb-5 pt-16 text-paper-light sm:px-7 sm:pb-7">
              <div>
                <p className="mt-1 font-display text-xl sm:text-2xl">{activeProduct.name}</p>
              </div>
              <span className="font-cinzel text-xs tracking-[0.14em] text-white/90 font-bold">0{activeIndex + 1} / 0{products.length}</span>
            </div>
            <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-[2px] bg-white/25" aria-hidden="true">
              <div className="h-full bg-brass-light transition-[width] duration-700" style={{ width: `${((activeIndex + 1) / products.length) * 100}%` }} />
            </div>
          </div>

          <div className="home-story-chapters">
            {products.map((product, index) => (
              <article
                key={product.id}
                id={`di-san-${product.slug}`}
                data-chapter-index={index}
                ref={(element) => { chapterRefs.current[index] = element; }}
                className={`home-story-chapter flex min-h-[58vh] flex-col justify-center border-b border-paper-border py-10 transition-all duration-700 last:border-0 lg:min-h-[68vh] ${activeIndex === index ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-60'}`}
              >
                <div className="mb-5 flex items-center gap-3 text-[11px] uppercase tracking-[0.16em] text-brown">
                  <span className="font-cinzel font-bold text-xs">0{index + 1}</span>
                  <span className="h-px w-8 bg-paper-deep" />
                  <span>{product.location}</span>
                </div>
                <h3 className="font-display text-3xl leading-tight text-ink sm:text-4xl">{product.name}</h3>
                <p className="mt-2 font-display text-base italic text-brown">{product.subName}</p>
                <p className="mt-5 max-w-lg text-sm leading-7 text-charcoal-muted sm:text-base">{product.shortDescription}</p>
                <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-paper-border pt-4 text-xs text-charcoal-muted">
                  <span>{product.epoch}</span>
                  <Link to={`/products/${product.slug}`} className="inline-flex items-center gap-2 font-semibold text-brown transition-colors hover:text-terracotta">
                    {t('common.exploreMonument', 'Tìm hiểu công trình')} <ArrowRight size={14} strokeWidth={1.6} />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>

        <nav className="mt-7 flex flex-wrap gap-2 lg:ml-[calc(52.5%-1rem)]" aria-label={t('home.selectMonument', 'Chọn công trình đang xem')}>
          {products.map((product, index) => (
            <button
              key={product.id}
              type="button"
              onClick={() => jumpToChapter(index)}
              aria-pressed={activeIndex === index}
              className={`border px-3 py-2 text-xs transition-colors ${activeIndex === index ? 'border-brown bg-brown text-paper-light' : 'border-paper-border text-brown-dark hover:border-brown'}`}
            >
              0{index + 1} · {product.name}
            </button>
          ))}
        </nav>
      </div>
    </section>
  );
};

export const HomePage: React.FC = () => {
  const { t } = useLanguage();
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
            onLoadedMetadata={(event) => {
              if (event.currentTarget.currentTime < 1) event.currentTarget.currentTime = 1;
            }}
            onSeeked={() => setHeroVideoReady(true)}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${heroVideoReady ? 'opacity-100' : 'opacity-0'}`}
          >
            <source src="/videos/hero-background.webm" type="video/webm" />
          </video>
        )}
        <div className="home-hero-scrim absolute inset-0" aria-hidden="true" />
        <div className="home-hero-drum pointer-events-none absolute -right-[17vw] top-1/2 z-[1] h-[82vw] w-[82vw] max-h-[920px] max-w-[920px] -translate-y-1/2 sm:-right-[10vw] lg:right-[-5vw] lg:h-[64vw] lg:w-[64vw]" aria-hidden="true">
          <img src="/images/trong-dong.webp" alt="" className="home-dong-son h-full w-full object-contain opacity-25 mix-blend-screen" />
        </div>

        <div className="relative z-10 mx-auto flex w-full max-w-[1440px] items-center px-5 pb-24 pt-16 sm:px-8 lg:px-16">
          <div className="max-w-[760px] animate-fade-up py-10">
            <h1 className="font-display text-[clamp(3.25rem,8vw,7rem)] font-normal leading-[0.94] tracking-[-0.045em] text-paper">
              {t('home.heroTitleLine1', 'Văn Minh')}<br />
              <em className="font-normal text-brass-subtle">{t('home.heroTitleLine2', 'Di Sản Việt')}</em>
            </h1>
            <p className="mt-6 max-w-[700px] text-lg leading-8 text-white/90 sm:text-xl sm:leading-9">
              {t('home.heroSubtitle', 'Hành trình số hóa bảo tàng, di tích và ký ức văn hóa Việt Nam qua các câu chuyện lịch sử')}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link to="/collections" className="inline-flex min-h-12 items-center gap-3 bg-brass px-6 py-3 text-sm font-semibold text-forest transition-colors hover:bg-brass-light">
                {t('home.heroCtaCollection', 'Khám phá bộ sưu tập')} <ArrowRight size={16} strokeWidth={1.7} />
              </Link>
              <Link to="/about" className="inline-flex min-h-12 items-center gap-2 border border-white/45 px-5 py-3 text-sm text-paper transition-colors hover:border-brass-subtle hover:text-brass-subtle">
                {t('home.heroCtaStory', 'Câu chuyện Viettoria')}
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
            <h2 className="font-display text-3xl text-ink sm:text-4xl">{t('home.collectionHeading', 'Bộ sưu tập di sản')}</h2>
          </div>
          <Link to="/collections" className="inline-flex items-center gap-2 pb-1 text-sm font-semibold text-brown hover:text-terracotta">
            {t('common.viewAll', 'Xem tất cả')} <ArrowRight size={15} strokeWidth={1.6} />
          </Link>
        </div>

        <div className="grid gap-x-5 gap-y-9 sm:grid-cols-2 lg:grid-cols-3">
          {collections.map((collection) => {
            const representative = storyProducts.find((product) => product.collectionId === collection.id);
            const poster = imageFor(representative?.heroImage || collection.heroImage, representative?.slug);
            return (
              <Link key={collection.id} to={`/collections/${collection.slug}`} data-home-reveal className="group block border-b border-paper-border pb-5">
                <div className="relative mb-4 flex aspect-[1.32/0.9] items-center justify-center overflow-hidden border border-brass/25 bg-paper-card shadow-sm transition-all duration-300 group-hover:shadow-md">
                  <img
                    src={poster}
                    alt={collection.name}
                    loading="lazy"
                    onError={(event) => handleImageFallback(event, '/3D/chua-mot-cot-poster.webp')}
                    className="h-full w-full object-contain transition-transform duration-700 group-hover:scale-[1.035]"
                  />
                  <span className="absolute left-3 top-3 bg-header/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.13em] text-brown">{collection.productsCount || 1} {t('common.monumentCount', 'tác phẩm')}</span>
                </div>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-display text-2xl text-ink transition-colors group-hover:text-brown">{collection.name}</h3>
                    <p className="mt-1.5 line-clamp-2 text-sm leading-6 text-charcoal-muted">{collection.description}</p>
                  </div>
                  <ArrowRight size={17} strokeWidth={1.4} className="mt-1 shrink-0 text-brass-dark transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="border-y border-paper-border bg-paper-muted">
        <div className="mx-auto grid max-w-[1440px] gap-8 px-5 py-14 sm:px-8 md:grid-cols-[0.8fr_1.2fr] lg:px-16">
          <div data-home-reveal>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brass-dark">Ghi chép về di sản</p>
            <h2 className="mt-3 font-display text-3xl text-ink sm:text-4xl">Câu chuyện phía sau công trình</h2>
            <p className="mt-3 max-w-sm text-sm leading-6 text-charcoal-muted">Đọc thêm về kiến trúc, con người và những dấu mốc làm nên từng di sản.</p>
            <Link to="/blogs" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-brown hover:text-terracotta">Đọc bài viết <ArrowRight size={14} /></Link>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            {blogs.slice(0, 2).map((blog, index) => (
              <article key={blog.id} data-home-reveal className="border-t border-paper-border pt-4">
                <p className="text-[11px] uppercase tracking-[0.14em] text-brown">{blog.category} · 0{index + 1}</p>
                <h3 className="mt-3 font-display text-2xl leading-snug text-ink"><Link to={`/blogs/${blog.slug}`} className="transition-colors hover:text-brown">{blog.title}</Link></h3>
                <p className="mt-2 line-clamp-2 text-sm leading-6 text-charcoal-muted">{blog.excerpt}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default HomePage;
