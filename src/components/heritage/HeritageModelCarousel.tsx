import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  ChevronLeft, 
  ChevronRight, 
  Pause, 
  Play, 
  RotateCw,
  Compass
} from 'lucide-react';
import type { Product } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext';
import { TiltCard } from '../effects/TiltCard';
import { resolve3DModelUrl, resolve3DPreview, resolveImageUrl, handleImageFallback } from '../../utils/mediaResolver';

interface HeritageModelCarouselProps {
  products: Product[];
}

const useReducedMotion = (): boolean => {
  const [reduced, setReduced] = useState(() =>
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, []);

  return reduced;
};

const CarouselInteractiveModelStage: React.FC<{ 
  product: Product; 
  reducedMotion: boolean;
  onInteractingChange?: (isInteracting: boolean) => void;
}> = ({ product, reducedMotion, onInteractingChange }) => {
  const { t } = useLanguage();
  const [viewerAvailable, setViewerAvailable] = useState(() =>
    typeof window !== 'undefined' && Boolean(window.customElements?.get('model-viewer'))
  );
  const [loadedModelKey, setLoadedModelKey] = useState<string | null>(null);
  const [failedModelKey, setFailedModelKey] = useState<string | null>(null);
  const [previewPlaying, setPreviewPlaying] = useState(false);
  const modelViewerRef = useRef<HTMLElement | null>(null);

  const preview = resolve3DPreview(product.slug);
  const poster = preview?.poster || resolveImageUrl(product.heroImage);
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
    <div 
      className="relative aspect-[4/3] w-full overflow-hidden bg-paper sm:aspect-[1.18/1]"
      onPointerDown={() => onInteractingChange?.(true)}
      onPointerUp={() => onInteractingChange?.(false)}
      onPointerCancel={() => onInteractingChange?.(false)}
    >
      {/* Exhibition Pedestal Spotlight */}
      <div className="heritage-pedestal-light pointer-events-none absolute inset-0 z-[1]" aria-hidden="true" />

      {/* Raytraced High-Fidelity Poster */}
      <img
        src={poster}
        alt={`Mô hình ${product.name}`}
        loading="lazy"
        className={`absolute inset-0 h-full w-full object-contain transition-opacity duration-700 ${modelLoaded ? 'opacity-0' : 'opacity-100'}`}
        onError={(event) => handleImageFallback(event, resolveImageUrl(product.heroImage))}
      />

      {/* Turntable 360 Video Fallback */}
      {useTurntableFallback && (
        <video
          key={`${product.slug}-turntable`}
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

      {/* Realtime Interactive 3D Model Viewer */}
      {viewerAvailable && !modelFailed && (
        <model-viewer
          key={`${product.slug}-model`}
          src={modelUrl}
          alt={`Mô hình 3D tương tác của ${product.name}`}
          camera-controls
          auto-rotate={!reducedMotion ? '' : undefined}
          rotation-per-second="10deg"
          shadow-intensity="1.2"
          shadow-softness="0.75"
          exposure="1.05"
          interaction-prompt="none"
          loading="lazy"
          reveal="auto"
          ref={modelViewerRef}
          style={{ width: '100%', height: '100%', backgroundColor: 'transparent', touchAction: 'pan-y' }}
          className={`home-model-viewer absolute inset-0 h-full w-full transition-opacity duration-700 ${modelLoaded ? 'opacity-100' : 'opacity-0'}`}
        />
      )}

      {/* Top 3D Status Badge */}
      <div className="pointer-events-none absolute left-3 top-3 z-10 border border-brass/50 bg-[#121814]/90 px-2.5 py-1 text-[10px] font-sans font-semibold text-brass uppercase tracking-wider backdrop-blur-sm rounded-[1px] shadow-sm">
        {modelLoaded
          ? t('home.dragToRotate', 'Mô hình 3D · Kéo để xoay')
          : previewPlaying
            ? t('home.previewVideo', 'Video xoay 360°')
            : modelFailed || !viewerAvailable
              ? t('home.previewPhoto', 'Bản dựng bảo tàng')
              : t('home.loadingModel', 'Đang tải mô hình 3D…')}
      </div>

      {/* Turntable Video Toggle Button */}
      {turntable && !reducedMotion && !modelLoaded && (
        <button
          type="button"
          onClick={() => setPreviewPlaying((playing) => !playing)}
          aria-label={previewPlaying ? t('home.stopVideo', 'Dừng video xoay mô hình') : t('home.playVideo', 'Xem chuyển động xoay 360°')}
          aria-pressed={previewPlaying}
          className="absolute right-3 top-3 z-10 inline-flex min-h-7 items-center gap-1.5 border border-paper-border bg-header/95 px-2.5 py-1 text-[11px] font-sans uppercase tracking-wider text-forest font-semibold transition-colors hover:border-brass hover:text-brass-dark focus-visible:outline focus-visible:outline-1 focus-visible:outline-brass rounded-[1px] shadow-2xs"
        >
          {previewPlaying ? <Pause size={12} /> : <Play size={12} />}
          <span>{previewPlaying ? t('home.stopVideo', 'Dừng') : t('home.playVideo', 'Xoay 360°')}</span>
        </button>
      )}

      {/* Bottom Overlay with Monument Name */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex items-end justify-between bg-gradient-to-t from-forest-dark/85 via-forest-dark/35 to-transparent px-4 pb-3 pt-12 text-paper-light">
        <p className="font-serif text-base sm:text-lg font-bold text-paper drop-shadow-xs truncate max-w-[220px]">
          {product.name}
        </p>
        <span className="font-mono text-[10px] font-semibold text-brass-light shrink-0">
          {product.modelSpecs?.scale || 'TỶ LỆ 1:120'}
        </span>
      </div>
    </div>
  );
};

export const HeritageModelCarousel: React.FC<HeritageModelCarouselProps> = ({ products }) => {
  const { t, localizeProduct } = useLanguage();
  const reducedMotion = useReducedMotion();

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const sliderTrackRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);
  const resumeTimerRef = useRef<number | null>(null);

  const [isPaused, setIsPaused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [is3DInteracting, setIs3DInteracting] = useState(false);
  const [isDraggingSlider, setIsDraggingSlider] = useState(false);
  const [isDraggingCards, setIsDraggingCards] = useState(false);
  
  // Progress from 0 to 1 representing position within one complete set of products
  const [normalizedProgress, setNormalizedProgress] = useState(0);
  const [activeModelIndex, setActiveModelIndex] = useState(0);

  // We duplicate the product list into 3 identical sets to achieve a truly seamless infinite circular loop
  const loopProducts = useMemo(() => {
    if (products.length === 0) return [];
    return [...products, ...products, ...products];
  }, [products]);

  // Initialize scroll position to the start of the middle set (Set 1)
  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el || products.length === 0) return;

    const timer = window.setTimeout(() => {
      const singleWidth = el.scrollWidth / 3;
      if (singleWidth > 0 && el.scrollLeft === 0) {
        el.scrollLeft = singleWidth;
      }
    }, 100);

    return () => window.clearTimeout(timer);
  }, [products.length]);

  // Update progress and active index from scroll position
  const handleScroll = useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el || products.length === 0) return;

    const singleWidth = el.scrollWidth / 3;
    if (singleWidth <= 0) return;

    // Seamless infinite wrap-around boundaries
    if (el.scrollLeft >= 2 * singleWidth) {
      el.scrollLeft -= singleWidth;
    } else if (el.scrollLeft <= 0.2 * singleWidth) {
      el.scrollLeft += singleWidth;
    }

    const currentOffset = el.scrollLeft % singleWidth;
    const progress = Math.max(0, Math.min(1, currentOffset / singleWidth));
    setNormalizedProgress(progress);

    const index = Math.min(
      products.length - 1,
      Math.floor(progress * products.length)
    );
    setActiveModelIndex(index);
  }, [products.length]);

  // Continuous smooth auto-scroll loop
  useEffect(() => {
    if (reducedMotion || products.length === 0) return;

    const shouldPause = isPaused || isHovered || is3DInteracting || isDraggingSlider || isDraggingCards;

    const speedPxPerSecond = 32; // Graceful, museum-exhibition pace (approx 0.5px/frame at 60fps)

    const step = (time: number) => {
      if (lastTimeRef.current === null) {
        lastTimeRef.current = time;
      }
      const deltaTime = (time - lastTimeRef.current) / 1000;
      lastTimeRef.current = time;

      const el = scrollContainerRef.current;
      if (el && !shouldPause) {
        // Move steadily from left to right (forward loop)
        el.scrollLeft += speedPxPerSecond * deltaTime;
      }

      animationFrameRef.current = requestAnimationFrame(step);
    };

    animationFrameRef.current = requestAnimationFrame(step);

    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      lastTimeRef.current = null;
    };
  }, [isPaused, isHovered, is3DInteracting, isDraggingSlider, isDraggingCards, reducedMotion, products.length]);

  // Pause on user action with gentle delayed resume
  const handleUserInteractionStart = useCallback(() => {
    if (resumeTimerRef.current !== null) {
      window.clearTimeout(resumeTimerRef.current);
      resumeTimerRef.current = null;
    }
  }, []);

  const handleUserInteractionEnd = useCallback(() => {
    if (resumeTimerRef.current !== null) {
      window.clearTimeout(resumeTimerRef.current);
    }
    resumeTimerRef.current = window.setTimeout(() => {
      setIsHovered(false);
      setIs3DInteracting(false);
      setIsDraggingCards(false);
      setIsDraggingSlider(false);
    }, 1600);
  }, []);

  // Scroll to a specific product by index
  const scrollToProductIndex = useCallback((targetIndex: number) => {
    const el = scrollContainerRef.current;
    if (!el || products.length === 0) return;

    const singleWidth = el.scrollWidth / 3;
    const cardWidthWithGap = singleWidth / products.length;
    const targetScrollLeft = singleWidth + targetIndex * cardWidthWithGap;

    el.scrollTo({
      left: targetScrollLeft,
      behavior: 'smooth',
    });
  }, [products.length]);

  // Directional step button (Left or Right arrow)
  const handleStepDirection = useCallback((direction: -1 | 1) => {
    const el = scrollContainerRef.current;
    if (!el || products.length === 0) return;

    const singleWidth = el.scrollWidth / 3;
    const cardStep = singleWidth / products.length;

    el.scrollBy({
      left: direction * cardStep,
      behavior: 'smooth',
    });
  }, [products.length]);

  // Slider dragging logic
  const handleSliderMove = useCallback((clientX: number) => {
    const track = sliderTrackRef.current;
    const el = scrollContainerRef.current;
    if (!track || !el || products.length === 0) return;

    const rect = track.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const singleWidth = el.scrollWidth / 3;

    el.scrollLeft = singleWidth + ratio * singleWidth;
  }, [products.length]);

  const handleSliderMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    handleUserInteractionStart();
    setIsDraggingSlider(true);
    handleSliderMove(e.clientX);

    const onMouseMove = (moveEvent: MouseEvent) => {
      handleSliderMove(moveEvent.clientX);
    };

    const onMouseUp = () => {
      setIsDraggingSlider(false);
      handleUserInteractionEnd();
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  const handleSliderTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!e.touches[0]) return;
    handleUserInteractionStart();
    setIsDraggingSlider(true);
    handleSliderMove(e.touches[0].clientX);

    const onTouchMove = (moveEvent: TouchEvent) => {
      if (moveEvent.touches[0]) {
        handleSliderMove(moveEvent.touches[0].clientX);
      }
    };

    const onTouchEnd = () => {
      setIsDraggingSlider(false);
      handleUserInteractionEnd();
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
    };

    window.addEventListener('touchmove', onTouchMove);
    window.addEventListener('touchend', onTouchEnd);
  };

  // Keyboard navigation on slider track
  const handleSliderKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      handleStepDirection(-1);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      handleStepDirection(1);
    } else if (e.key === 'Home') {
      e.preventDefault();
      scrollToProductIndex(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      scrollToProductIndex(products.length - 1);
    } else if (e.key === ' ') {
      e.preventDefault();
      setIsPaused((p) => !p);
    }
  };

  if (products.length === 0) return null;

  const activeProduct = localizeProduct(products[activeModelIndex] || products[0]);
  const thumbWidthPercent = Math.max(14, (1 / products.length) * 100);
  const thumbLeftPercent = normalizedProgress * (100 - thumbWidthPercent);

  return (
    <section 
      id="hanh-trinh-di-san" 
      className="home-story-section border-y border-paper-border bg-header relative overflow-hidden"
      aria-label={t('home.scrollyHeading', 'Mỗi công trình, một câu chuyện')}
    >
      <div className="mx-auto max-w-[1440px] px-5 py-14 sm:px-8 sm:py-20 lg:px-16 lg:py-24">
        {/* Section Header */}
        <div data-home-reveal className="mb-8 flex flex-col justify-between gap-5 sm:mb-10 lg:flex-row lg:items-end">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-brass mb-2">
              <Compass size={15} />
              <p className="font-sans text-xs font-semibold uppercase tracking-wider text-brass">
                {t('home.scrollyEyebrow', 'Một vòng qua di sản Việt · Triển lãm mô hình số hóa')}
              </p>
            </div>
            <h2 className="font-serif text-3xl font-bold leading-tight text-forest sm:text-4xl lg:text-5xl">
              {t('home.scrollyHeading', 'Mỗi công trình, một câu chuyện')}
            </h2>
            <p className="mt-3.5 max-w-xl text-sm leading-relaxed text-charcoal-muted sm:text-base">
              {t('home.scrollyDesc', 'Chiêm ngưỡng toàn bộ các mô hình 3D số hóa và khám phá câu chuyện lịch sử phía sau từng dấu ấn kiến trúc văn hiến.')}
            </p>
          </div>

          {/* Quick Monument Navigation Pills: Displays ALL models */}
          <nav 
            className="flex flex-wrap items-center gap-1.5 sm:gap-2" 
            aria-label={t('home.selectMonument', 'Chọn công trình đang xem')}
          >
            {products.map((rawProduct, index) => {
              const product = localizeProduct(rawProduct);
              const isSelected = activeModelIndex === index;
              return (
                <button
                  key={product.id}
                  type="button"
                  onClick={() => scrollToProductIndex(index)}
                  aria-pressed={isSelected}
                  className={`inline-flex items-center gap-1.5 border px-3 py-1.5 text-xs font-sans transition-all rounded-[2px] ${
                    isSelected
                      ? 'border-forest bg-forest text-brass font-bold shadow-xs'
                      : 'border-paper-border bg-paper text-forest hover:border-brass hover:text-forest hover:bg-paper-warm font-medium'
                  }`}
                >
                  <span className={`font-mono text-[10px] font-bold ${isSelected ? 'text-brass-light' : 'text-brass'}`}>
                    0{index + 1}
                  </span>
                  <span>{product.name.split(' (')[0]}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* FULL SINGLE ROW CAROUSEL TRACK (No wrapping, continuous infinite circular loop) */}
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          onMouseEnter={() => {
            handleUserInteractionStart();
            setIsHovered(true);
          }}
          onMouseLeave={() => {
            handleUserInteractionEnd();
          }}
          onTouchStart={() => {
            handleUserInteractionStart();
            setIsDraggingCards(true);
          }}
          onTouchEnd={() => {
            handleUserInteractionEnd();
          }}
          className="flex flex-row flex-nowrap overflow-x-auto gap-6 sm:gap-8 pb-4 no-scrollbar items-stretch cursor-grab active:cursor-grabbing select-none"
          style={{ scrollBehavior: 'auto' }}
        >
          {loopProducts.map((rawProduct, loopIdx) => {
            const product = localizeProduct(rawProduct);
            const originalIndex = loopIdx % products.length;
            const uniqueKey = `${product.id}-loop-${loopIdx}`;

            return (
              <div
                key={uniqueKey}
                className="w-[84vw] sm:w-[350px] md:w-[380px] lg:w-[400px] shrink-0 h-full"
              >
                <TiltCard
                  className="h-full"
                  glareEffect={true}
                  tiltAmount={1.6}
                >
                  <article
                    className="home-story-card corner-frame group flex h-full flex-col border border-paper-border bg-paper-card shadow-xs transition-all duration-300 hover:border-brass/70 hover:shadow-xl rounded-[2px]"
                  >
                    {/* Card Plaque Top Bar - Imperial Forest Green & Brass */}
                    <div className="flex items-center justify-between border-b border-brass/40 bg-forest px-4 py-2.5 text-xs text-paper">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-brass">0{originalIndex + 1}</span>
                        <span className="h-2.5 w-px bg-brass/40" />
                        <span className="truncate max-w-[160px] font-sans text-[11px] uppercase tracking-wider text-paper/90 font-medium">
                          {product.location}
                        </span>
                      </div>
                      <span className="font-sans text-[10px] uppercase tracking-wider text-brass-light font-semibold">
                        {product.epoch}
                      </span>
                    </div>

                    {/* 3D Model Viewport Stage */}
                    <CarouselInteractiveModelStage 
                      product={product} 
                      reducedMotion={reducedMotion}
                      onInteractingChange={(interacting) => {
                        if (interacting) handleUserInteractionStart();
                        else handleUserInteractionEnd();
                        setIs3DInteracting(interacting);
                      }}
                    />

                    {/* Card Information Body */}
                    <div className="flex flex-1 flex-col justify-between p-5 sm:p-6 bg-paper">
                      <div>
                        <h3 className="font-serif text-xl sm:text-2xl font-bold leading-snug text-forest transition-colors group-hover:text-brass-dark">
                          <Link to={`/products/${product.slug}`} className="hover:underline">
                            {product.name}
                          </Link>
                        </h3>
                        <p className="mt-1 font-serif text-xs sm:text-sm italic text-brass-dark font-medium">
                          {product.subName}
                        </p>
                        <p className="mt-3 text-xs sm:text-sm leading-relaxed text-charcoal/85 line-clamp-3">
                          {product.shortDescription}
                        </p>

                        {/* Specifications Micro-Badges */}
                        {product.modelSpecs && (
                          <div className="mt-3.5 flex flex-wrap gap-1.5 pt-2 border-t border-paper-border/60">
                            <span className="px-2 py-0.5 font-mono text-[10px] bg-paper-warm border border-paper-border text-forest font-semibold rounded-[1px]">
                              {product.modelSpecs.scale}
                            </span>
                            <span className="px-2 py-0.5 font-mono text-[10px] bg-paper-warm border border-paper-border text-charcoal-muted rounded-[1px]">
                              {product.modelSpecs.heightCm}cm · {product.modelSpecs.weightGrams}g
                            </span>
                            <span className="px-2 py-0.5 font-mono text-[10px] bg-paper-warm border border-paper-border text-brass-dark font-medium rounded-[1px]">
                              {product.modelSpecs.partsCount} {t('common.partsCount', 'chi tiết mộng')}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Card Action Link */}
                      <div className="mt-5 flex items-center justify-between border-t border-paper-border pt-3.5">
                        <span className="font-sans text-[10px] font-semibold uppercase tracking-wider text-charcoal-muted">
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
              </div>
            );
          })}
        </div>

        {/* TACTILE HERITAGE SLIDER TRACK & CONTROL BAR (Directly below the segment) */}
        <div className="mt-8 pt-5 border-t border-paper-border flex flex-col gap-3.5">
          {/* Controls Bar: Current Model Info, Counter, Navigation Arrows & Auto-scroll Toggle */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-mono font-bold uppercase tracking-wider bg-forest text-brass border border-brass/40 rounded-[2px] shadow-2xs">
                <RotateCw size={12} className={!isPaused && !isHovered && !is3DInteracting ? "animate-spin" : ""} style={{ animationDuration: '8s' }} />
                <span>{t('home.circularLoopBadge', 'VÒNG LẶP DI SẢN 360°')}</span>
              </span>
              <span className="font-serif text-sm font-bold text-forest hidden md:inline truncate max-w-[280px]">
                {activeProduct.name}
              </span>
            </div>

            {/* Stepper Buttons & Play/Pause */}
            <div className="flex items-center gap-2">
              {/* Play / Pause Auto-scroll Button */}
              <button
                type="button"
                onClick={() => setIsPaused((prev) => !prev)}
                aria-label={isPaused ? t('home.playAutoScroll', 'Bật tự động cuộn') : t('home.pauseAutoScroll', 'Tạm dừng tự động cuộn')}
                className="p-2 border border-paper-border bg-paper hover:border-brass hover:bg-paper-warm text-forest hover:text-brass-dark transition-all rounded-[2px] focus:outline-none focus:ring-1 focus:ring-brass"
                title={isPaused ? t('home.playAutoScroll', 'Bật tự động cuộn') : t('home.pauseAutoScroll', 'Tạm dừng tự động cuộn')}
              >
                {isPaused ? <Play size={14} className="text-brass-dark" /> : <Pause size={14} className="text-forest" />}
              </button>

              {/* Prev / Next Steppers */}
              <button
                type="button"
                onClick={() => handleStepDirection(-1)}
                aria-label={t('home.prevModel', 'Công trình trước')}
                className="p-2 border border-paper-border bg-paper hover:border-brass hover:bg-paper-warm text-forest transition-all rounded-[2px] focus:outline-none focus:ring-1 focus:ring-brass"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                type="button"
                onClick={() => handleStepDirection(1)}
                aria-label={t('home.nextModel', 'Công trình kế tiếp')}
                className="p-2 border border-paper-border bg-paper hover:border-brass hover:bg-paper-warm text-forest transition-all rounded-[2px] focus:outline-none focus:ring-1 focus:ring-brass"
              >
                <ChevronRight size={16} />
              </button>

              {/* Active Counter Display */}
              <div className="ml-1 px-3 py-1 font-mono text-xs font-bold text-forest bg-paper-warm border border-paper-border rounded-[2px] shadow-2xs">
                <span className="text-brass-dark">0{activeModelIndex + 1}</span>
                <span className="text-charcoal-muted/60 mx-1">/</span>
                <span>0{products.length}</span>
              </div>
            </div>
          </div>

          {/* Interactive Tactile Heritage Slider Track */}
          <div
            ref={sliderTrackRef}
            onMouseDown={handleSliderMouseDown}
            onTouchStart={handleSliderTouchStart}
            onKeyDown={handleSliderKeyDown}
            tabIndex={0}
            role="slider"
            aria-label={t('home.sliderAria', 'Thanh trượt duyệt danh sách toàn bộ mô hình di sản')}
            aria-valuemin={0}
            aria-valuemax={products.length - 1}
            aria-valuenow={activeModelIndex}
            className="relative h-3 sm:h-3.5 w-full bg-paper-warm border-2 border-brass/50 rounded-[2px] cursor-pointer select-none shadow-inner overflow-hidden focus:outline-none focus:ring-2 focus:ring-brass"
          >
            {/* Visual Tick Notches for each model in catalog */}
            <div className="absolute inset-0 flex justify-between px-3 pointer-events-none items-center opacity-40">
              {products.map((_, i) => (
                <div 
                  key={i} 
                  className={`w-1 h-1.5 rounded-full transition-colors ${
                    activeModelIndex === i ? 'bg-forest scale-125' : 'bg-brass-dark'
                  }`} 
                />
              ))}
            </div>

            {/* Tactile Brass Thumb Handle */}
            <div
              className="absolute top-0 bottom-0 bg-brass hover:bg-brass-light active:bg-brass-dark border-x-2 border-forest/40 shadow-md rounded-[1px] cursor-grab active:cursor-grabbing flex items-center justify-center transition-all duration-75"
              style={{
                left: `${thumbLeftPercent}%`,
                width: `${thumbWidthPercent}%`,
              }}
            >
              {/* Three Tactile Micro-Grips */}
              <div className="flex gap-0.5 pointer-events-none">
                <div className="w-0.5 h-2 bg-forest/50" />
                <div className="w-0.5 h-2 bg-forest/50" />
                <div className="w-0.5 h-2 bg-forest/50" />
              </div>
            </div>
          </div>

          {/* Bottom Guidance Caption */}
          <div className="flex items-center justify-between text-[11px] font-sans text-charcoal-muted pt-1">
            <span>{t('home.sliderDragHint', 'Kéo thanh trượt hoặc dùng phím mũi tên để duyệt 360°')}</span>
            <span className="font-mono text-[10px] text-brass uppercase font-semibold">
              {products.length} {t('home.modelsCount', 'mô hình kiến trúc')}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
