import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowDown, ArrowRight, BookOpen } from 'lucide-react';
import { publicApi } from '../services/api';
import type { Product, Collection, BlogPost } from '../types';
import { FALLBACK_BLOGS, FALLBACK_COLLECTIONS, FALLBACK_PRODUCTS } from '../data/fallbackData';
import { resolve3DPreview, resolveImageUrl, handleImageFallback } from '../utils/mediaResolver';
import { useLanguage } from '../contexts/LanguageContext';
import { HeritageParticles } from '../components/effects/HeritageParticles';
import { TimeTravelComparison } from '../components/heritage/TimeTravelComparison';
import { ExplodedJoineryViewer } from '../components/heritage/ExplodedJoineryViewer';
import { HeritageModelCarousel } from '../components/heritage/HeritageModelCarousel';

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

export const HomePage: React.FC = () => {
  const { language, t, localizeCollection, localizeBlog } = useLanguage();
  const mainRef = useRef<HTMLElement>(null);
  const initialHero = FALLBACK_PRODUCTS.find((product) => product.isHeroRelease) || FALLBACK_PRODUCTS[0];
  const [heroProduct, setHeroProduct] = useState<Product | null>(initialHero || null);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>(
    FALLBACK_PRODUCTS.filter((product) => !product.isHeroRelease)
  );
  const [collections, setCollections] = useState<Collection[]>(FALLBACK_COLLECTIONS);
  const [blogs, setBlogs] = useState<BlogPost[]>(FALLBACK_BLOGS);
  const [heroVideoReady, setHeroVideoReady] = useState(false);
  const heroVideoRef = useRef<HTMLVideoElement>(null);
  const prefersReducedMotion = useReducedMotionPreference();
  useHomeScrollReveal(mainRef, prefersReducedMotion);

  // Present ALL available models in the catalog (no artificial 3-card cutoff)
  const storyProducts = useMemo(() => {
    const combined = [...(heroProduct ? [heroProduct] : []), ...featuredProducts];
    const unique = [...new Map(combined.map((product) => [product.id, product])).values()];
    // Ensure all catalog fallback products are incorporated
    FALLBACK_PRODUCTS.forEach((fbProd) => {
      if (!unique.some((p) => p.id === fbProd.id || p.slug === fbProd.slug)) {
        unique.push(fbProd);
      }
    });
    return unique;
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
  }, [language]);

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
      <section id="hero" className="home-hero relative isolate flex h-[calc(100svh-64px)] sm:h-[calc(100dvh-72px)] md:h-[calc(100dvh-80px)] min-h-[540px] max-h-[820px] overflow-hidden bg-forest-dark text-paper items-center">
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

        <div className="relative z-10 mx-auto flex w-full max-w-[1440px] items-center px-5 py-4 sm:px-8 sm:py-6 lg:px-16">
          <div className="max-w-[880px] animate-fade-up">
            <h1 className="font-serif text-[clamp(2.75rem,5.8vw,5.5rem)] font-normal leading-[1.18] tracking-normal text-paper">
              <span className="block">{t('home.heroTitleLine1', 'Văn Minh')}</span>
              <span className="heritage-gold-foil font-normal italic pb-1">{t('home.heroTitleLine2', 'Di Sản Việt')}</span>
            </h1>
            <p className="mt-4 sm:mt-5 max-w-[700px] text-lg leading-8 text-white/90 sm:text-xl sm:leading-9">
              {t('home.heroSubtitle', 'Hành trình số hóa bảo tàng, di tích và ký ức văn hóa Việt Nam qua các câu chuyện lịch sử')}
            </p>
            <div className="mt-6 sm:mt-7 flex flex-wrap items-center gap-3">
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
            <div className="mt-7 sm:mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-white/25 pt-3.5 sm:pt-4 text-xs tracking-wide text-white/75">
              <span>{t('home.heroBadge1', 'Mô hình kiến trúc')}</span>
              <span className="h-1 w-1 bg-brass" />
              <span>{t('home.heroBadge2', 'Câu chuyện di sản')}</span>
              <span className="h-1 w-1 bg-brass" />
              <span>{t('home.heroBadge3', 'Trải nghiệm 3D')}</span>
            </div>
          </div>
        </div>
        <a href="#hanh-trinh-di-san" className="absolute bottom-3 sm:bottom-4 left-5 z-10 inline-flex items-center gap-2 text-xs tracking-wide text-white/80 transition-colors hover:text-white sm:left-8 lg:left-16">
          {t('home.scrollDown', 'Cuộn để khám phá')} <ArrowDown size={14} strokeWidth={1.5} />
        </a>
      </section>

      <HeritageModelCarousel products={storyProducts} />

      {/* Feature 1: Time-Travel 1900 <-> 2026 Comparison Showcase */}
      <TimeTravelComparison />

      <section id="bo-suu-tap" className="mx-auto max-w-[1440px] px-5 py-16 sm:px-8 sm:py-20 lg:px-16 lg:py-24">
        <div data-home-reveal className="mb-8 flex flex-wrap items-end justify-between gap-4 border-b border-paper-border pb-5 sm:mb-10">
          <div>
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-brass-dark">{t('home.collectionEyebrow', 'Chọn theo câu chuyện bạn yêu thích')}</p>
            <h2 className="font-serif text-3xl font-bold text-forest sm:text-4xl">{t('home.collectionHeading', 'Bộ sưu tập di sản')}</h2>
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
                    <h3 className="font-serif text-2xl font-bold text-forest transition-colors group-hover:text-brass-dark leading-snug">{collection.name}</h3>
                    <p className="mt-1.5 line-clamp-2 text-sm leading-6 text-charcoal/85">{collection.description}</p>
                  </div>
                  <ArrowRight size={17} strokeWidth={2} className="mt-1 shrink-0 text-forest transition-transform group-hover:translate-x-1 group-hover:text-brass" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Feature 8: Scrub-to-Explode Joinery Experience */}
      <ExplodedJoineryViewer />

      <section className="border-y-2 border-brass/40 bg-forest text-paper">
        <div className="mx-auto grid max-w-[1440px] gap-8 px-5 py-16 sm:px-8 md:grid-cols-[0.8fr_1.2fr] lg:px-16">
          <div data-home-reveal>
            <p className="text-xs font-sans font-semibold uppercase tracking-wider text-brass">
              {t('home.blogEyebrow', 'Ghi chép về di sản')}
            </p>
            <h2 className="mt-3 font-serif text-3xl font-bold text-paper sm:text-4xl">
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
                  <p className="font-sans text-xs font-semibold uppercase tracking-wider text-brass">{blog.category} · 0{index + 1}</p>
                  <h3 className="mt-3 font-serif text-2xl leading-snug text-paper">
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
