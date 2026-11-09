import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Box,
  Eye,
  Maximize2,
  Pause,
  Play,
  RotateCcw,
  Sparkles,
  Target,
  X,
  ZoomIn,
} from 'lucide-react';
import type { Product } from '../../types';
import {
  handleImageFallback,
  resolve3DModelUrl,
  resolve3DPreview,
  resolveImageUrl,
  VIETTORIA_IMAGES,
} from '../../utils/mediaResolver';
import { useLanguage } from '../../contexts/LanguageContext';
import {
  getHotspotsForProduct,
  type ArchitecturalHotspot,
} from '../../data/architecturalHotspots';

interface ArchitecturalViewerProps {
  product: Product;
}

export const ArchitecturalViewer: React.FC<ArchitecturalViewerProps> = ({ product }) => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'3d' | 'photos'>('3d');
  const [isPhotoZoomOpen, setIsPhotoZoomOpen] = useState(false);
  const [viewerAvailable, setViewerAvailable] = useState(() =>
    typeof window !== 'undefined' && Boolean(window.customElements?.get('model-viewer')),
  );
  const [modelLoaded, setModelLoaded] = useState(false);
  const [modelFailed, setModelFailed] = useState(false);
  const [previewFailed, setPreviewFailed] = useState(false);
  const [previewPlaying, setPreviewPlaying] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(() =>
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );
  const [autoRotate, setAutoRotate] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showHotspots, setShowHotspots] = useState(false);
  const [activeHotspotId, setActiveHotspotId] = useState<string | null>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const modelViewerRef = useRef<HTMLElement | null>(null);

  const hotspots = useMemo(() => {
    return getHotspotsForProduct(product.slug || product.code || product.id);
  }, [product.slug, product.code, product.id]);

  const activeHotspot = useMemo(() => {
    return hotspots.find((h) => h.id === activeHotspotId) || null;
  }, [hotspots, activeHotspotId]);

  // Khi người dùng phóng to hoặc vào chế độ toàn màn hình: Tự động kích hoạt điểm khảo cứu cấu kiện
  useEffect(() => {
    if (isFullscreen) {
      setShowHotspots(true);
    }
  }, [isFullscreen]);

  // Tự động kích hoạt các điểm khảo cứu cấu kiện khi người dùng cuộn/phóng to mô hình
  useEffect(() => {
    const modelViewer = modelViewerRef.current;
    if (!modelViewer || !modelLoaded) return;

    let initialRadius: number | null = null;
    const handleCameraChange = () => {
      // @ts-expect-error model-viewer method
      const orbit = modelViewer.getCameraOrbit?.();
      if (!orbit || typeof orbit.radius !== 'number') return;
      if (initialRadius === null) {
        initialRadius = orbit.radius;
      } else if (orbit.radius < initialRadius * 0.9) {
        setShowHotspots(true);
      }
    };

    modelViewer.addEventListener('camera-change', handleCameraChange);
    return () => {
      modelViewer.removeEventListener('camera-change', handleCameraChange);
    };
  }, [modelLoaded]);

  const handleSelectHotspot = (hs: ArchitecturalHotspot) => {
    if (activeHotspotId === hs.id) {
      setActiveHotspotId(null);
      return;
    }
    setActiveHotspotId(hs.id);
    if (modelViewerRef.current && hs.orbit && hs.target) {
      // @ts-expect-error model-viewer properties
      modelViewerRef.current.cameraOrbit = hs.orbit;
      // @ts-expect-error model-viewer properties
      modelViewerRef.current.cameraTarget = hs.target;
    }
  };

  const handleResetCamera = () => {
    setActiveHotspotId(null);
    if (modelViewerRef.current) {
      // @ts-expect-error model-viewer properties
      modelViewerRef.current.cameraOrbit = '0deg 75deg 105%';
      // @ts-expect-error model-viewer properties
      modelViewerRef.current.cameraTarget = 'auto auto auto';
    }
  };

  const preview = resolve3DPreview(product.slug);
  const modelUrl = resolve3DModelUrl(product.model3dUrl || product.slug);
  const posterUrl = preview?.poster || resolveImageUrl(product.heroImage, VIETTORIA_IMAGES.productHighlight);
  const turntableUrl = preview?.turntable;

  const thumbnailPhoto = useMemo(() => ({
    label: product.name,
    src: resolveImageUrl(product.heroImage, VIETTORIA_IMAGES.productHighlight),
  }), [product.heroImage, product.name]);

  useEffect(() => {
    if (window.customElements.get('model-viewer')) {
      setViewerAvailable(true);
      return;
    }

    let mounted = true;
    const fallbackTimer = window.setTimeout(() => {
      if (mounted) setViewerAvailable(false);
    }, 5000);

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
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updatePreference = (event: MediaQueryListEvent) => setReducedMotion(event.matches);
    preference.addEventListener('change', updatePreference);
    return () => preference.removeEventListener('change', updatePreference);
  }, []);

  useEffect(() => {
    setModelLoaded(false);
    setModelFailed(false);
    setPreviewFailed(false);
    setPreviewPlaying(false);
  }, [modelUrl, product.id]);

  useEffect(() => {
    const modelViewer = modelViewerRef.current;
    if (!viewerAvailable || !modelViewer) return;

    const handleLoad = () => {
      setModelLoaded(true);
      setModelFailed(false);
    };
    const handleError = () => setModelFailed(true);

    modelViewer.addEventListener('load', handleLoad);
    modelViewer.addEventListener('error', handleError);
    return () => {
      modelViewer.removeEventListener('load', handleLoad);
      modelViewer.removeEventListener('error', handleError);
    };
  }, [modelUrl, product.id, viewerAvailable]);

  useEffect(() => {
    if (!viewerAvailable || modelLoaded || modelFailed) return;
    const loadTimeout = window.setTimeout(() => setModelFailed(true), 20000);
    return () => window.clearTimeout(loadTimeout);
  }, [modelFailed, modelLoaded, modelUrl, viewerAvailable]);

  useEffect(() => {
    const updateFullscreenState = () => {
      setIsFullscreen(document.fullscreenElement === viewportRef.current);
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsPhotoZoomOpen(false);
    };

    document.addEventListener('fullscreenchange', updateFullscreenState);
    if (isPhotoZoomOpen) window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('fullscreenchange', updateFullscreenState);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isPhotoZoomOpen]);

  const toggleFullscreen = async () => {
    if (!viewportRef.current) return;
    if (document.fullscreenElement === viewportRef.current) {
      await document.exitFullscreen?.();
      return;
    }
    await viewportRef.current.requestFullscreen?.();
  };

  const showTurntable = Boolean(turntableUrl && previewPlaying && !previewFailed && !modelLoaded);
  const isAutoRotating = autoRotate && !reducedMotion;
  const stageLabel = modelLoaded
    ? t('home.dragToRotate', 'Mô hình 3D · kéo để xoay')
    : showTurntable
      ? t('home.previewVideo', 'Video xem trước')
      : modelFailed || !viewerAvailable
        ? t('home.previewPhoto', 'Ảnh xem trước')
        : t('product.loading3d', 'Đang tải mô hình 3D');

  return (
    <div className="architectural-viewer-shell relative overflow-hidden border border-paper-border bg-paper-card shadow-sm">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-paper-border bg-header p-3.5 sm:p-4">
        <div className="flex items-center gap-1.5" role="group" aria-label={t('product.tab3d', 'Chế độ xem sản phẩm')}>
          <button
            type="button"
            aria-pressed={activeTab === '3d'}
            onClick={() => setActiveTab('3d')}
            className={`inline-flex min-h-9 items-center gap-2 border px-3 text-xs font-sans uppercase tracking-wider font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-brass ${activeTab === '3d' ? 'border-forest bg-forest text-paper' : 'border-paper-border bg-paper text-forest hover:border-brass hover:bg-paper-warm'}`}
          >
            <Box className="h-3.5 w-3.5" />
            {t('product.tab3d', 'Mô hình 3D')}
          </button>
          <button
            type="button"
            aria-pressed={activeTab === 'photos'}
            onClick={() => setActiveTab('photos')}
            className={`inline-flex min-h-9 items-center gap-2 border px-3 text-xs font-sans uppercase tracking-wider font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-brass ${activeTab === 'photos' ? 'border-forest bg-forest text-paper' : 'border-paper-border bg-paper text-forest hover:border-brass hover:bg-paper-warm'}`}
          >
            <Eye className="h-3.5 w-3.5" />
            {t('product.tabPhotos', 'Ảnh thực địa')}
          </button>
        </div>

        {/* Nút bật/tắt điểm khảo cứu cấu kiện kiến trúc */}
        {activeTab === '3d' && (
          <button
            type="button"
            onClick={() => {
              setShowHotspots((current) => !current);
              if (showHotspots) setActiveHotspotId(null);
            }}
            aria-pressed={showHotspots}
            title={showHotspots ? t('hotspots.toggleActive', 'Ẩn điểm chi tiết') : t('hotspots.toggleInactive', 'Hiện điểm chi tiết')}
            className={`inline-flex min-h-9 items-center gap-1.5 border px-3 text-xs font-sans uppercase tracking-wider font-semibold transition-all ${
              showHotspots
                ? 'border-brass bg-brass text-forest shadow-xs'
                : 'border-paper-border bg-paper-warm text-brown-dark hover:border-brass hover:text-forest'
            }`}
          >
            <Target className="h-3.5 w-3.5" />
            <span>{t('hotspots.toggleTitle', 'Khảo cứu cấu kiện')}</span>
            <span className={`px-1.5 py-0.2 font-cinzel text-[10px] font-bold ${showHotspots ? 'bg-forest text-brass' : 'bg-paper text-charcoal'}`}>
              {hotspots.length}
            </span>
          </button>
        )}
      </header>

      {activeTab === '3d' ? (
        <div
          ref={viewportRef}
          className={`architectural-3d-stage group relative isolate aspect-[4/3] overflow-hidden sm:aspect-[16/10] ${isFullscreen ? 'architectural-3d-stage-fullscreen' : ''}`}
        >
          {/* Ambient Museum Pedestal Spotlight */}
          <div className="heritage-pedestal-light pointer-events-none absolute inset-0 z-[2]" aria-hidden="true" />

          <img
            src={posterUrl}
            alt=""
            aria-hidden="true"
            onError={(event) => handleImageFallback(event, VIETTORIA_IMAGES.productHighlight)}
            className={`pointer-events-none absolute inset-0 h-full w-full object-contain mix-blend-multiply transition-opacity duration-700 ease-out ${modelLoaded || showTurntable ? 'opacity-0' : 'opacity-100'}`}
          />

          {showTurntable && (
            <video
              key={`${product.id}-turntable`}
              src={turntableUrl}
              poster={posterUrl}
              autoPlay
              muted
              playsInline
              preload="metadata"
              aria-hidden="true"
              onEnded={() => setPreviewPlaying(false)}
              onError={() => { setPreviewFailed(true); setPreviewPlaying(false); }}
              className="pointer-events-none absolute inset-0 h-full w-full object-contain mix-blend-multiply transition-opacity duration-700 ease-out"
            />
          )}

          {viewerAvailable && !modelFailed && (
            <model-viewer
              key={`${product.id}-${modelUrl}`}
              src={modelUrl}
              poster={posterUrl}
              alt={`Mô hình 3D ${product.name}`}
              camera-controls
              auto-rotate={isAutoRotating ? '' : undefined}
              rotation-per-second="8deg"
              shadow-intensity="0.75"
              exposure="1"
              loading="eager"
              reveal="auto"
              interaction-prompt="none"
              ref={modelViewerRef}
              style={{ width: '100%', height: '100%', backgroundColor: 'var(--heritage-paper-card)', touchAction: 'pan-y' }}
              className={`architectural-model-viewer absolute inset-0 h-full w-full transition-opacity duration-700 ease-out ${modelLoaded ? 'opacity-100' : 'opacity-0'}`}
            >
              {showHotspots && modelLoaded && hotspots.map((hs, index) => (
                <button
                  key={hs.id}
                  slot={`hotspot-${hs.id}`}
                  data-position={hs.position}
                  data-normal={hs.normal}
                  data-orbit={hs.orbit}
                  data-target={hs.target}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectHotspot(hs);
                  }}
                  className={`heritage-hotspot-node ${activeHotspotId === hs.id ? 'is-active' : ''}`}
                  aria-label={hs.title}
                  title={`${hs.category}: ${hs.title}`}
                  type="button"
                >
                  <span className="heritage-hotspot-ping" />
                  <span className="font-cinzel text-[10px] font-bold leading-none select-none">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </button>
              ))}
            </model-viewer>
          )}

          {/* Biển khảo cứu cấu kiện chi tiết */}
          {showHotspots && activeHotspot && (
            <div className="absolute left-3 top-14 sm:left-4 sm:top-16 z-30 max-w-sm w-[calc(100%-1.5rem)] sm:w-88 border border-brass/60 bg-forest/95 p-3.5 sm:p-4 text-paper shadow-2xl backdrop-blur-md animate-fade-up">
              <div className="flex items-start justify-between gap-3 border-b border-brass/30 pb-2">
                <div>
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="h-3 w-3 text-brass" />
                    <span className="font-cinzel text-[10px] uppercase tracking-widest text-brass font-bold">
                      {activeHotspot.category}
                    </span>
                  </div>
                  <h4 className="mt-1 font-display text-base font-bold text-paper">
                    {activeHotspot.title}
                  </h4>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveHotspotId(null)}
                  className="p-1 text-paper/60 hover:text-paper transition-colors"
                  aria-label={t('hotspots.close', 'Đóng chi tiết')}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <p className="mt-2.5 font-sans text-xs text-paper/90 leading-relaxed">
                {activeHotspot.detail}
              </p>

              <div className="mt-3.5 flex items-center justify-between gap-2 border-t border-paper/15 pt-2.5">
                <button
                  type="button"
                  onClick={() => handleSelectHotspot(activeHotspot)}
                  className="inline-flex items-center gap-1.5 border border-brass/50 bg-brass/20 px-2.5 py-1 text-[11px] font-sans text-brass-light hover:bg-brass hover:text-forest transition-colors font-medium"
                >
                  <Target className="h-3 w-3" />
                  {t('hotspots.focusCamera', 'Tập trung góc nhìn')}
                </button>
                <button
                  type="button"
                  onClick={handleResetCamera}
                  className="inline-flex items-center gap-1.5 border border-paper/20 bg-paper/5 px-2 py-1 text-[11px] font-sans text-paper/75 hover:text-paper hover:border-paper/40 transition-colors"
                >
                  <RotateCcw className="h-3 w-3" />
                  {t('hotspots.resetCamera', 'Góc nhìn toàn cảnh')}
                </button>
              </div>
            </div>
          )}

          <div className="absolute left-3 top-3 z-10 flex items-center gap-2 border border-brass/30 bg-paper-card/95 px-3 py-2 text-xs font-cinzel uppercase tracking-[0.15em] text-brown-dark font-bold shadow-sm backdrop-blur-sm sm:left-4 sm:top-4">
            <span className={`h-1.5 w-1.5 bg-brown ${!modelLoaded && !modelFailed && viewerAvailable ? 'animate-pulse' : ''}`} />
            <span role="status" aria-live="polite">{stageLabel}</span>
          </div>

          <div className="absolute right-3 top-3 z-10 flex items-center gap-1.5 sm:right-4 sm:top-4">
            {turntableUrl && !reducedMotion && !previewFailed && !modelLoaded && (
              <button
                type="button"
                onClick={() => setPreviewPlaying((playing) => !playing)}
                aria-label={previewPlaying ? 'Dừng video xem trước mô hình' : 'Phát video xem trước mô hình'}
                aria-pressed={previewPlaying}
                title={previewPlaying ? 'Dừng video xem trước' : 'Phát video xem trước'}
                className="flex h-9 items-center gap-1.5 border border-paper-border bg-paper/90 px-2.5 text-xs font-sans uppercase tracking-wider text-brown-dark shadow-sm backdrop-blur-sm transition-colors hover:border-brass hover:text-forest focus-visible:outline focus-visible:outline-2 focus-visible:outline-brass font-medium"
              >
                {previewPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
                {previewPlaying ? 'Dừng' : 'Video mẫu'}
              </button>
            )}
            <button
              type="button"
              onClick={() => setAutoRotate((current) => !current)}
              disabled={!modelLoaded || reducedMotion}
              aria-label={reducedMotion ? 'Tự xoay đang tắt theo cài đặt chuyển động' : isAutoRotating ? 'Tắt tự xoay mô hình' : 'Bật tự xoay mô hình'}
              aria-pressed={isAutoRotating}
              title={reducedMotion ? 'Tự xoay đang tắt theo cài đặt giảm chuyển động' : isAutoRotating ? 'Tắt tự xoay' : 'Bật tự xoay'}
              className="flex h-9 w-9 items-center justify-center border border-paper-border bg-paper/90 text-brown-dark shadow-sm backdrop-blur-sm transition-colors hover:border-brass hover:text-forest focus-visible:outline focus-visible:outline-2 focus-visible:outline-brass disabled:cursor-wait disabled:opacity-45"
            >
              {isAutoRotating ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </button>
            <button
              type="button"
              onClick={() => void toggleFullscreen()}
              aria-label={isFullscreen ? 'Thoát toàn màn hình' : 'Xem mô hình toàn màn hình'}
              title={isFullscreen ? 'Thoát toàn màn hình' : 'Toàn màn hình'}
              className="flex h-9 w-9 items-center justify-center border border-paper-border bg-paper/90 text-brown-dark shadow-sm backdrop-blur-sm transition-colors hover:border-brass hover:text-forest focus-visible:outline focus-visible:outline-2 focus-visible:outline-brass"
            >
              {isFullscreen ? <X className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </button>
          </div>

          {!modelLoaded && !modelFailed && viewerAvailable && !previewPlaying && (
            <div className="pointer-events-none absolute inset-x-0 top-[4.2rem] z-[5] flex justify-center px-4">
              <div className="flex items-center gap-2 border border-brass/30 bg-paper-card/95 px-3 py-2 text-xs text-forest shadow-sm backdrop-blur-sm">
                <span className="h-1.5 w-1.5 bg-brass" aria-hidden="true" />
                <span className="font-sans font-medium">Đang mở mô hình 3D…</span>
              </div>
            </div>
          )}

          {/* Dải điều hướng điểm khảo cứu (Hotspot Ribbon) hoặc Thanh tên tác phẩm chuẩn */}
          {showHotspots && modelLoaded && hotspots.length > 0 ? (
            <div className="pointer-events-auto absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-forest/95 via-forest/80 to-transparent px-3 pb-3 pt-12 sm:px-5 sm:pb-4">
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between gap-3 text-paper">
                  <div className="flex items-center gap-2">
                    <Target className="h-3.5 w-3.5 text-brass" />
                    <span className="font-cinzel text-[11px] font-bold uppercase tracking-wider text-brass">
                      {t('hotspots.toggleTitle', 'Khảo cứu cấu kiện')}
                    </span>
                    <span className="text-[11px] text-paper/70 font-sans">
                      ({hotspots.length} {t('hotspots.pointsCount', 'điểm khảo cứu')})
                    </span>
                  </div>
                  {activeHotspotId && (
                    <button
                      type="button"
                      onClick={handleResetCamera}
                      className="inline-flex items-center gap-1 text-[11px] font-sans text-paper/70 hover:text-brass transition-colors"
                    >
                      <RotateCcw className="h-3 w-3" />
                      <span>{t('hotspots.resetCamera', 'Góc nhìn toàn cảnh')}</span>
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
                  {hotspots.map((hs, index) => {
                    const isSelected = activeHotspotId === hs.id;
                    return (
                      <button
                        key={hs.id}
                        type="button"
                        onClick={() => handleSelectHotspot(hs)}
                        className={`inline-flex shrink-0 items-center gap-1.5 border px-2.5 py-1 text-xs font-sans transition-all ${
                          isSelected
                            ? 'border-brass bg-brass text-forest font-bold shadow-xs'
                            : 'border-brass/35 bg-forest/85 text-paper/85 hover:border-brass hover:text-paper hover:bg-forest'
                        }`}
                      >
                        <span className={`font-cinzel text-[10px] font-bold ${isSelected ? 'text-forest' : 'text-brass'}`}>
                          {String(index + 1).padStart(2, '0')}
                        </span>
                        <span className="truncate max-w-[130px] sm:max-w-[180px]">
                          {hs.title}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex items-end justify-between gap-4 bg-gradient-to-t from-forest/80 via-forest/25 to-transparent px-4 pb-4 pt-16 text-paper sm:px-6 sm:pb-5">
              <div>
                <p className="font-display text-lg sm:text-xl">{product.name}</p>
                <p className="mt-1 text-[10px] text-paper/75 sm:text-xs">{modelLoaded ? 'Kéo mô hình để xoay · cuộn để thu phóng' : stageLabel}</p>
              </div>
              {thumbnailPhoto.src && (
                <button
                  type="button"
                  onClick={() => setActiveTab('photos')}
                  className="pointer-events-auto inline-flex shrink-0 items-center gap-2 border border-paper/35 bg-forest/65 px-3 py-2 text-xs font-sans uppercase tracking-wider text-paper backdrop-blur-sm transition-colors hover:border-brass hover:text-brass-light focus-visible:outline focus-visible:outline-2 focus-visible:outline-brass font-medium"
                >
                  <ZoomIn className="h-3.5 w-3.5" />
                  Xem ảnh
                </button>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="relative aspect-[16/10] overflow-hidden bg-paper">
          {thumbnailPhoto && (
            <button
              type="button"
              onClick={() => setIsPhotoZoomOpen(true)}
              className="group relative flex h-full w-full cursor-zoom-in items-center justify-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-brass"
              aria-label={`Phóng to ảnh ${product.name}`}
            >
              <img
                src={thumbnailPhoto.src}
                alt={`${product.name} · ${t('product.tabPhotos', 'Ảnh thực địa')}`}
                onError={(event) => handleImageFallback(event, VIETTORIA_IMAGES.productHighlight)}
                className="h-full w-full object-contain transition-transform duration-700 ease-out group-hover:scale-[1.025]"
              />
              <span className="pointer-events-none absolute bottom-4 left-4 inline-flex items-center gap-2 border border-paper/20 bg-forest/80 px-3 py-2 text-xs font-sans uppercase tracking-wider text-paper opacity-0 shadow-sm backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100 font-medium">
                <ZoomIn className="h-3.5 w-3.5 text-brass-light" />
                Phóng to ảnh
              </span>
            </button>
          )}
        </div>
      )}

      {isPhotoZoomOpen && thumbnailPhoto && (
        <div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-forest-dark/95 p-4 backdrop-blur-sm sm:p-8"
          onClick={() => setIsPhotoZoomOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label={`Ảnh sản phẩm ${product.name}`}
        >
          <button
            type="button"
            onClick={() => setIsPhotoZoomOpen(false)}
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center border border-brass/45 bg-forest text-paper transition-colors hover:bg-forest-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-brass sm:right-7 sm:top-7"
            aria-label="Đóng ảnh phóng to"
          >
            <X className="h-5 w-5" />
          </button>
          <img
            src={thumbnailPhoto.src}
            alt={`${product.name} · ${thumbnailPhoto.label}`}
            onError={(event) => handleImageFallback(event, VIETTORIA_IMAGES.productHighlight)}
            onClick={(event) => event.stopPropagation()}
            className="max-h-[82vh] max-w-full border border-brass/50 object-contain shadow-2xl"
          />
          <p className="mt-3 text-center font-sans text-xs uppercase tracking-wider text-paper/75">{product.name}</p>
        </div>
      )}
    </div>
  );
};

export default ArchitecturalViewer;
