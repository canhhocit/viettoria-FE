import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Box,
  Eye,
  Maximize2,
  Pause,
  Play,
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

interface ArchitecturalViewerProps {
  product: Product;
}

export const ArchitecturalViewer: React.FC<ArchitecturalViewerProps> = ({ product }) => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'3d' | 'photos'>('3d');
  const [selectedPhoto, setSelectedPhoto] = useState(0);
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
  const viewportRef = useRef<HTMLDivElement>(null);
  const modelViewerRef = useRef<HTMLElement | null>(null);

  const preview = resolve3DPreview(product.slug);
  const modelUrl = resolve3DModelUrl(product.model3dUrl || product.slug);
  const posterUrl = preview?.poster || resolveImageUrl(product.heroImage, VIETTORIA_IMAGES.productHighlight);
  const turntableUrl = preview?.turntable;

  const photos = useMemo(() => {
    const candidates = [product.heroImage, ...(product.galleryImages || [])]
      .filter((image): image is string => Boolean(image?.trim()));
    const uniqueImages = [...new Set(candidates)];
    return uniqueImages.map((image, index) => ({
      label: `Ảnh ${String(index + 1).padStart(2, '0')}`,
      src: resolveImageUrl(image, VIETTORIA_IMAGES.productHighlight),
    }));
  }, [product.galleryImages, product.heroImage]);
  const currentPhoto = photos[selectedPhoto] || photos[0];

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
    setSelectedPhoto(0);
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
            className={`inline-flex min-h-9 items-center gap-2 border px-3 text-xs font-sans uppercase tracking-wider font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-brass ${activeTab === '3d' ? 'border-forest bg-forest text-paper' : 'border-transparent bg-paper-warm text-brown-dark hover:border-paper-border'}`}
          >
            <Box className="h-3.5 w-3.5" />
            {t('product.tab3d', 'Mô hình 3D')}
          </button>
          <button
            type="button"
            aria-pressed={activeTab === 'photos'}
            onClick={() => setActiveTab('photos')}
            className={`inline-flex min-h-9 items-center gap-2 border px-3 text-xs font-sans uppercase tracking-wider font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-brass ${activeTab === 'photos' ? 'border-forest bg-forest text-paper' : 'border-transparent bg-paper-warm text-brown-dark hover:border-paper-border'}`}
          >
            <Eye className="h-3.5 w-3.5" />
            {t('product.tabPhotos', 'Ảnh thực địa')}
          </button>
        </div>

      </header>

      {activeTab === '3d' ? (
        <div
          ref={viewportRef}
          className={`architectural-3d-stage group relative isolate aspect-[4/3] overflow-hidden sm:aspect-[16/10] ${isFullscreen ? 'architectural-3d-stage-fullscreen' : ''}`}
        >
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
            // @ts-expect-error model-viewer is registered by the page-level module script.
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
            />
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

          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex items-end justify-between gap-4 bg-gradient-to-t from-forest/80 via-forest/25 to-transparent px-4 pb-4 pt-16 text-paper sm:px-6 sm:pb-5">
            <div>
              <p className="font-display text-lg sm:text-xl">{product.name}</p>
              <p className="mt-1 text-[10px] text-paper/75 sm:text-xs">{modelLoaded ? 'Kéo mô hình để xoay · cuộn để thu phóng' : stageLabel}</p>
            </div>
            {photos.length > 0 && (
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
        </div>
      ) : (
        <div className="relative aspect-[4/3] overflow-hidden bg-paper sm:aspect-[16/10]">
          {currentPhoto && (
            <button
              type="button"
              onClick={() => setIsPhotoZoomOpen(true)}
              className="group relative flex h-full w-full cursor-zoom-in items-center justify-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-brass"
              aria-label={`Phóng to ${currentPhoto.label} của ${product.name}`}
            >
              <img
                src={currentPhoto.src}
                alt={`${currentPhoto.label} · ${product.name}`}
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

      {photos.length > 1 && (
        <nav className="flex items-center gap-2 overflow-x-auto border-t border-paper-border bg-header p-3" aria-label="Chọn ảnh sản phẩm">
          {photos.map((photo, index) => (
            <button
              key={`${photo.src}-${index}`}
              type="button"
              onClick={() => { setSelectedPhoto(index); setActiveTab('photos'); }}
              aria-label={photo.label}
              aria-pressed={activeTab === 'photos' && selectedPhoto === index}
              className={`group relative h-14 w-20 shrink-0 overflow-hidden border bg-paper transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-brass sm:h-16 sm:w-24 ${activeTab === 'photos' && selectedPhoto === index ? 'border-brown' : 'border-paper-border hover:border-brass'}`}
            >
              <img
                src={photo.src}
                alt=""
                aria-hidden="true"
                onError={(event) => handleImageFallback(event, VIETTORIA_IMAGES.productHighlight)}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <span className="absolute inset-x-0 bottom-0 bg-forest/75 px-1 py-0.5 text-center font-sans text-[10px] uppercase tracking-wider text-paper font-medium">{photo.label}</span>
            </button>
          ))}
        </nav>
      )}

      {isPhotoZoomOpen && currentPhoto && (
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
            src={currentPhoto.src}
            alt={`${currentPhoto.label} · ${product.name}`}
            onError={(event) => handleImageFallback(event, VIETTORIA_IMAGES.productHighlight)}
            onClick={(event) => event.stopPropagation()}
            className="max-h-[82vh] max-w-full border border-brass/50 object-contain shadow-2xl"
          />
          <p className="mt-3 text-center font-sans text-xs uppercase tracking-wider text-paper/75">{product.name} · {currentPhoto.label}</p>
        </div>
      )}
    </div>
  );
};

export default ArchitecturalViewer;
