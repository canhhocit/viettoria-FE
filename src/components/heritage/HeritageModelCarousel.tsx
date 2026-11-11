import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  Compass
} from 'lucide-react';
import type { Product } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext';
import { TiltCard } from '../effects/TiltCard';
import { resolve3DModelUrl, resolve3DPreview, resolveImageUrl } from '../../utils/mediaResolver';

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
  loopIdx?: number;
  onInteractingChange?: (isInteracting: boolean) => void;
}> = ({ product, reducedMotion, loopIdx = 0, onInteractingChange }) => {
  const preview = resolve3DPreview(product.slug);
  const poster = preview?.poster || resolveImageUrl(product.heroImage);
  const modelUrl = resolve3DModelUrl(product.model3dUrl || product.slug);

  return (
    <div 
      className="relative aspect-[4/3] w-full overflow-hidden bg-paper sm:aspect-[1.18/1]"
      onPointerDown={() => onInteractingChange?.(true)}
      onPointerUp={() => onInteractingChange?.(false)}
      onPointerCancel={() => onInteractingChange?.(false)}
    >
      {/* Exhibition Pedestal Spotlight */}
      <div className="heritage-pedestal-light pointer-events-none absolute inset-0 z-[1]" aria-hidden="true" />

      {/* Realtime Interactive Auto-Rotating 3D Model Viewer */}
      <model-viewer
        key={`${product.slug}-carousel-${loopIdx}`}
        src={modelUrl}
        poster={poster}
        alt={`Mô hình 3D tự động xoay của ${product.name}`}
        camera-controls
        auto-rotate={!reducedMotion ? '' : undefined}
        rotation-per-second="12deg"
        shadow-intensity="1.2"
        shadow-softness="0.75"
        exposure="1.05"
        interaction-prompt="none"
        loading="eager"
        reveal="auto"
        style={{ width: '100%', height: '100%', backgroundColor: 'transparent', touchAction: 'pan-y' }}
        className="home-model-viewer absolute inset-0 h-full w-full"
      />

      {/* Bottom Overlay with Monument Name & Scale */}
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
  const animationFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);
  const resumeTimerRef = useRef<number | null>(null);

  const [isHovered, setIsHovered] = useState(false);
  const [is3DInteracting, setIs3DInteracting] = useState(false);
  const [isDraggingCards, setIsDraggingCards] = useState(false);

  // Mouse drag tracking refs
  const dragStartXRef = useRef<number>(0);
  const dragScrollLeftRef = useRef<number>(0);
  const isMouseDownRef = useRef<boolean>(false);

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

  // Seamless infinite wrap-around on scroll
  const handleScroll = useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el || products.length === 0) return;

    const singleWidth = el.scrollWidth / 3;
    if (singleWidth <= 0) return;

    // Seamless infinite circular loop boundaries
    if (el.scrollLeft >= 2 * singleWidth) {
      el.scrollLeft -= singleWidth;
    } else if (el.scrollLeft <= 0.2 * singleWidth) {
      el.scrollLeft += singleWidth;
    }
  }, [products.length]);

  // Continuous smooth auto-scroll loop (kệ cho nó tự quay)
  useEffect(() => {
    if (reducedMotion || products.length === 0) return;

    const shouldPause = isHovered || is3DInteracting || isDraggingCards;
    const speedPxPerSecond = 32; // Graceful, stately exhibition pace (0.5px/frame at 60fps)

    const step = (time: number) => {
      if (lastTimeRef.current === null) {
        lastTimeRef.current = time;
      }
      const deltaTime = (time - lastTimeRef.current) / 1000;
      lastTimeRef.current = time;

      const el = scrollContainerRef.current;
      if (el && !shouldPause) {
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
  }, [isHovered, is3DInteracting, isDraggingCards, reducedMotion, products.length]);

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
    }, 1500);
  }, []);

  // Smooth mouse drag on the cards track
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = scrollContainerRef.current;
    if (!el) return;
    dragStartXRef.current = e.clientX;
    dragScrollLeftRef.current = el.scrollLeft;
    isMouseDownRef.current = true;
    setIsDraggingCards(true);
    handleUserInteractionStart();

    const onMouseMove = (moveEvent: MouseEvent) => {
      if (!isMouseDownRef.current || !el) return;
      const walk = (moveEvent.clientX - dragStartXRef.current) * 1.2;
      el.scrollLeft = dragScrollLeftRef.current - walk;
    };

    const onMouseUp = () => {
      isMouseDownRef.current = false;
      setIsDraggingCards(false);
      handleUserInteractionEnd();
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  if (products.length === 0) return null;

  return (
    <section 
      id="hanh-trinh-di-san" 
      className="home-story-section border-y border-paper-border bg-header relative overflow-hidden py-14 sm:py-20 lg:py-24"
      aria-label={t('home.scrollyHeading', 'Mỗi công trình, một câu chuyện')}
    >
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-16">
        {/* Section Header: Clean, minimal, without numbered jump pills */}
        <div data-home-reveal className="mb-8 max-w-2xl sm:mb-10">
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
            {t('home.scrollyDesc', 'Chiêm ngưỡng các mô hình 3D số hóa và khám phá câu chuyện lịch sử phía sau từng dấu ấn kiến trúc văn hiến.')}
          </p>
        </div>

        {/* FULL SINGLE ROW CAROUSEL TRACK (Continuous infinite circular loop, clean & unobstructed) */}
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          onMouseDown={handleMouseDown}
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
                    {/* Card Plaque Top Bar: Clean location and epoch, NO ordinal numbers (bỏ hết số thứ tự) */}
                    <div className="flex items-center justify-between border-b border-brass/40 bg-forest px-4 py-2.5 text-xs text-paper">
                      <span className="truncate max-w-[200px] font-sans text-[11px] uppercase tracking-wider text-paper/90 font-medium">
                        {product.location}
                      </span>
                      <span className="font-sans text-[10px] uppercase tracking-wider text-brass-light font-semibold">
                        {product.epoch}
                      </span>
                    </div>

                    {/* 3D Model Viewport Stage */}
                    <CarouselInteractiveModelStage 
                      product={product} 
                      reducedMotion={reducedMotion}
                      loopIdx={loopIdx}
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
      </div>
    </section>
  );
};
