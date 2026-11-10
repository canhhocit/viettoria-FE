import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Box,
  ChevronLeft,
  ChevronRight,
  Eye,
  Maximize2,
  Moon,
  Pause,
  Play,
  RotateCcw,
  Stamp,
  Sun,
  Sunrise,
  Sunset,
  Target,
  X,
  ZoomIn,
  ZoomOut,
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
import { usePassport } from '../../contexts/PassportContext';
import {
  getHotspotsForProduct,
  type ArchitecturalHotspot,
} from '../../data/architecturalHotspots';
import { ARLaunchModal } from '../heritage/ARLaunchModal';
import { PostcardGeneratorModal } from '../heritage/PostcardGeneratorModal';
import { CuratorLoupe } from '../heritage/CuratorLoupe';

interface ArchitecturalViewerProps {
  product: Product;
}

type LightingPreset = 'dawn' | 'noon' | 'dusk' | 'night';

export const ArchitecturalViewer: React.FC<ArchitecturalViewerProps> = ({ product }) => {
  const { t, localizeHotspot } = useLanguage();
  const { stampMonument } = usePassport();
  const [activeTab, setActiveTab] = useState<'3d' | 'photos'>('3d');
  const [isPhotoZoomOpen, setIsPhotoZoomOpen] = useState(false);
  const [viewerAvailable, setViewerAvailable] = useState(() =>
    typeof window !== 'undefined' && Boolean(window.customElements?.get('model-viewer')),
  );
  const [lightingMode, setLightingMode] = useState<LightingPreset>('noon');
  const [isARModalOpen, setIsARModalOpen] = useState(false);
  const [isPostcardOpen, setIsPostcardOpen] = useState(false);
  const [postcardSnapshot, setPostcardSnapshot] = useState<string | null>(null);
  const [modelLoaded, setModelLoaded] = useState(false);
  const [modelFailed, setModelFailed] = useState(false);
  const [previewFailed, setPreviewFailed] = useState(false);
  const [previewPlaying, setPreviewPlaying] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(() =>
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );
  const [autoRotate, setAutoRotate] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showHotspots, setShowHotspots] = useState(true);
  const [activeHotspotId, setActiveHotspotId] = useState<string | null>(null);
  const [isTourActive, setIsTourActive] = useState(false);
  const [isChronicleOpen, setIsChronicleOpen] = useState(false);
  const [tourTimerProgress, setTourTimerProgress] = useState(0);
  const TOUR_DURATION_MS = 6000;

  const viewportRef = useRef<HTMLDivElement>(null);
  const modelViewerRef = useRef<HTMLElement | null>(null);

  // Auto-stamp monument in Heritage Passport after user engages with 3D model
  useEffect(() => {
    if (!modelLoaded) return;
    const timer = window.setTimeout(() => {
      stampMonument(product.slug, product.name, product.epoch);
    }, 12000);
    return () => window.clearTimeout(timer);
  }, [modelLoaded, product.slug, product.name, product.epoch, stampMonument]);

  const lightingSettings = useMemo(() => {
    switch (lightingMode) {
      case 'dawn':
        return {
          exposure: '1.18',
          shadowIntensity: '0.85',
          bgClass: 'bg-gradient-to-b from-[#F7EFE2] via-[#EFE5D2] to-[#FAF7F0]',
        };
      case 'dusk':
        return {
          exposure: '0.90',
          shadowIntensity: '0.95',
          bgClass: 'bg-gradient-to-b from-[#EAD0B3] via-[#D8B998] to-[#142820]',
        };
      case 'night':
        return {
          exposure: '0.65',
          shadowIntensity: '0.60',
          bgClass: 'bg-gradient-to-b from-[#0D1C16] via-[#142820] to-[#07110D]',
        };
      case 'noon':
      default:
        return {
          exposure: '1.05',
          shadowIntensity: '1.25',
          bgClass: 'bg-paper-card',
        };
    }
  }, [lightingMode]);

  const handleOpenPostcard = async () => {
    const mv = modelViewerRef.current as unknown as { toBlob?: (options: { idealAspect: boolean }) => Promise<Blob> };
    if (mv && typeof mv.toBlob === 'function') {
      try {
        const blob = await mv.toBlob({ idealAspect: true });
        const url = URL.createObjectURL(blob);
        setPostcardSnapshot(url);
      } catch {
        setPostcardSnapshot(null);
      }
    }
    setIsPostcardOpen(true);
  };

  const handleOpenAR = () => {
    const mv = modelViewerRef.current as unknown as { canActivateAR?: boolean; activateAR?: () => void };
    if (mv && mv.canActivateAR && typeof mv.activateAR === 'function') {
      try {
        mv.activateAR();
        return;
      } catch {
        // fallback
      }
    }
    setIsARModalOpen(true);
  };

  const handleZoom = (direction: 'in' | 'out') => {
    const modelViewer = modelViewerRef.current;
    if (!modelViewer) return;
    try {
      // @ts-expect-error model-viewer method
      const orbit = modelViewer.getCameraOrbit?.();
      if (orbit && typeof orbit.radius === 'number') {
        const factor = direction === 'in' ? 0.82 : 1.22;
        const newRadius = Math.max(0.6, Math.min(6, orbit.radius * factor));
        // @ts-expect-error model-viewer properties
        modelViewer.cameraOrbit = `${orbit.theta}rad ${orbit.phi}rad ${newRadius}m`;
      }
    } catch (err) {
      console.warn('Zoom error', err);
    }
  };

  const hotspots = useMemo(() => {
    const raw = getHotspotsForProduct(product.slug || product.code || product.id);
    return raw.map((h) => localizeHotspot(h));
  }, [product.slug, product.code, product.id, localizeHotspot]);

  const activeHotspot = useMemo(() => {
    return hotspots.find((h) => h.id === activeHotspotId) || null;
  }, [hotspots, activeHotspotId]);

  const currentHotspotIndex = useMemo(() => {
    return hotspots.findIndex((h) => h.id === activeHotspotId);
  }, [hotspots, activeHotspotId]);

  const goToHotspotByIndex = (index: number) => {
    if (index < 0 || index >= hotspots.length) return;
    const target = hotspots[index];
    setActiveHotspotId(target.id);
    setShowHotspots(true);
    if (modelViewerRef.current && target.orbit && target.target) {
      // @ts-expect-error model-viewer properties
      modelViewerRef.current.cameraOrbit = target.orbit;
      // @ts-expect-error model-viewer properties
      modelViewerRef.current.cameraTarget = target.target;
    }
  };

  const handleNextHotspot = () => {
    if (hotspots.length === 0) return;
    const nextIdx = currentHotspotIndex === -1 ? 0 : (currentHotspotIndex + 1) % hotspots.length;
    goToHotspotByIndex(nextIdx);
  };

  const handlePrevHotspot = () => {
    if (hotspots.length === 0) return;
    const prevIdx = currentHotspotIndex === -1 ? hotspots.length - 1 : (currentHotspotIndex - 1 + hotspots.length) % hotspots.length;
    goToHotspotByIndex(prevIdx);
  };

  const toggleTour = () => {
    setIsTourActive((prev) => {
      const next = !prev;
      if (next) {
        setShowHotspots(true);
        if (currentHotspotIndex === -1) {
          goToHotspotByIndex(0);
        }
      }
      return next;
    });
  };

  // Auto Tour Timer effect
  useEffect(() => {
    if (!isTourActive || hotspots.length === 0) {
      setTourTimerProgress(0);
      return;
    }

    setTourTimerProgress(0);
    const intervalMs = 60;
    const stepIncrement = (intervalMs / TOUR_DURATION_MS) * 100;

    const timer = window.setInterval(() => {
      setTourTimerProgress((prev) => {
        if (prev + stepIncrement >= 100) {
          window.clearInterval(timer);
          const nextIdx = (currentHotspotIndex === -1 ? 0 : currentHotspotIndex + 1) % hotspots.length;
          goToHotspotByIndex(nextIdx);
          return 0;
        }
        return prev + stepIncrement;
      });
    }, intervalMs);

    return () => {
      window.clearInterval(timer);
    };
  }, [isTourActive, currentHotspotIndex, hotspots]);

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
      setIsTourActive(false);
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
    setIsTourActive(false);
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

        {/* Nút bật/tắt điểm khảo cứu cấu kiện kiến trúc & Tour tự động */}
        {activeTab === '3d' && hotspots.length > 0 && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleTour}
              aria-pressed={isTourActive}
              title={isTourActive ? t('hotspots.pauseTour', 'Tạm dừng tour') : t('hotspots.startTour', 'Bắt đầu tour tự động')}
              className={`inline-flex min-h-9 items-center gap-1.5 border px-3 text-xs font-sans uppercase tracking-wider font-semibold transition-all ${
                isTourActive
                  ? 'border-brass bg-brass text-forest shadow-xs'
                  : 'border-paper-border bg-paper-warm text-brown-dark hover:border-brass hover:text-forest'
              }`}
            >
              {isTourActive ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5 text-brass" />}
              <span>{isTourActive ? t('hotspots.pauseTour', 'Tạm dừng') : t('hotspots.startTour', 'Tour tự động')}</span>
              {isTourActive && (
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-forest opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-forest"></span>
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                setShowHotspots((current) => !current);
                if (showHotspots) {
                  setActiveHotspotId(null);
                  setIsTourActive(false);
                }
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
              <span className="hidden sm:inline">{t('hotspots.toggleTitle', 'Khảo cứu cấu kiện')}</span>
              <span className="sm:hidden">{t('hotspots.toggleTitle', 'Cấu kiện')}</span>
              <span className={`px-1.5 py-0.2 font-cinzel text-[10px] font-bold ${showHotspots ? 'bg-forest text-brass' : 'bg-paper text-charcoal'}`}>
                {hotspots.length}
              </span>
            </button>
          </div>
        )}
      </header>

      {activeTab === '3d' ? (
        <div
          ref={viewportRef}
          className={`architectural-3d-stage heritage-3d-dark-stage group relative isolate aspect-[4/3] overflow-hidden sm:aspect-[16/10] ${lightingSettings.bgClass} ${isFullscreen ? 'architectural-3d-stage-fullscreen' : ''} transition-colors duration-500`}
        >
          {/* Ambient Museum Pedestal Spotlight & Glow */}
          <div className="heritage-3d-stage-glow pointer-events-none" aria-hidden="true" />
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
              shadow-intensity={lightingSettings.shadowIntensity}
              shadow-softness="0.75"
              exposure={lightingSettings.exposure}
              ar
              ar-modes="webxr scene-viewer quick-look"
              ar-scale="auto"
              quick-look-browsers="safari chrome"
              loading="eager"
              reveal="auto"
              interaction-prompt="none"
              ref={modelViewerRef}
              style={{ width: '100%', height: '100%', backgroundColor: 'transparent', touchAction: 'pan-y' }}
              className={`architectural-model-viewer absolute inset-0 h-full w-full transition-opacity duration-700 ease-out ${modelLoaded ? 'opacity-100' : 'opacity-0'}`}
            >
              {/* Simultaneous Floating Architectural Annotations with Dashed Leader Lines */}
              {showHotspots && modelLoaded && hotspots.map((hs) => {
                const dx = hs.dx ?? 140;
                const dy = hs.dy ?? 0;
                const isRight = dx >= 0;
                const elbowOffset = isRight ? -24 : 24;
                const jointX = dx + elbowOffset;
                const jointY = dy;
                const pathD = `M 0 0 L ${jointX} ${jointY} L ${dx} ${dy}`;

                return (
                  <div
                    key={hs.id}
                    slot={`hotspot-${hs.id}`}
                    data-position={hs.position}
                    data-normal={hs.normal}
                    data-orbit={hs.orbit}
                    data-target={hs.target}
                    className={`heritage-annotation-slot ${activeHotspotId === hs.id ? 'is-active' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectHotspot(hs);
                    }}
                  >
                    {/* 1. Target Beacon on the model surface (Concentric Rings) */}
                    <div
                      className="heritage-anchor-beacon"
                      title={`${hs.category || ''}: ${hs.title}`}
                      aria-label={hs.title}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.stopPropagation();
                          handleSelectHotspot(hs);
                        }
                      }}
                    >
                      <span className="heritage-anchor-pulse" />
                      <span className="heritage-anchor-ring" />
                      <span className="heritage-anchor-core" />
                    </div>

                    {/* 2. SVG Dashed Golden Leader Line */}
                    <svg className="heritage-leader-svg" aria-hidden="true">
                      <path d={pathD} className="heritage-leader-path" />
                      <circle cx={jointX} cy={jointY} r="3" className="heritage-leader-joint" />
                    </svg>

                    {/* 3. Floating Callout Card */}
                    <div
                      className="heritage-callout-card"
                      style={{
                        left: `${dx}px`,
                        top: `${dy}px`,
                        transform: isRight ? 'translate(0, -50%)' : 'translate(-100%, -50%)',
                      }}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.stopPropagation();
                          handleSelectHotspot(hs);
                        }
                      }}
                    >
                      <div className="heritage-callout-header">
                        <span className="heritage-callout-diamond">◇</span>
                        <span className="heritage-callout-title">
                          {hs.shortTitle || hs.title}
                        </span>
                      </div>
                      <p className="heritage-callout-desc">
                        {hs.shortDesc || hs.detail}
                      </p>
                    </div>
                  </div>
                );
              })}
            </model-viewer>
          )}

          {/* Tour Active Stepper Indicator at Top Center */}
          {isTourActive && activeHotspot && (
            <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 border border-brass/45 bg-[#121915]/95 px-3 py-1.5 text-xs text-paper backdrop-blur-md rounded-full shadow-2xl animate-fade-down">
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={handlePrevHotspot}
                  className="p-1 hover:text-brass text-paper/70 transition-colors cursor-pointer"
                  aria-label={t('hotspots.prev', 'Trước')}
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                </button>
                <span className="font-cinzel text-[10px] font-bold text-brass px-1">
                  {String(currentHotspotIndex + 1).padStart(2, '0')}/{String(hotspots.length).padStart(2, '0')}
                </span>
                <button
                  type="button"
                  onClick={handleNextHotspot}
                  className="p-1 hover:text-brass text-paper/70 transition-colors cursor-pointer"
                  aria-label={t('hotspots.next', 'Sau')}
                >
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
              <span className="text-paper/40">|</span>
              <span className="font-sans text-xs text-paper/90 truncate max-w-[160px] sm:max-w-[220px]">
                {activeHotspot.title}
              </span>
              <div className="w-10 sm:w-14 h-1 bg-paper/20 rounded-full overflow-hidden shrink-0">
                <div
                  className="h-full bg-brass transition-all duration-75 ease-linear"
                  style={{ width: `${tourTimerProgress}%` }}
                />
              </div>
              <button
                type="button"
                onClick={() => setIsTourActive(false)}
                className="p-1 hover:text-brass text-paper/70 transition-colors ml-1 cursor-pointer"
                aria-label={t('hotspots.close', 'Dừng')}
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          )}

          {/* Stage Loading Status */}
          <div className="absolute left-3 top-3 z-10 flex items-center gap-2 border border-brass/40 bg-[#121814]/90 px-3 py-1.5 text-xs font-cinzel uppercase tracking-[0.15em] text-paper font-bold shadow-sm backdrop-blur-sm sm:left-4 sm:top-4">
            <span className={`h-1.5 w-1.5 bg-brass ${!modelLoaded && !modelFailed && viewerAvailable ? 'animate-pulse' : ''}`} />
            <span role="status" aria-live="polite">{stageLabel}</span>
          </div>

          {/* 4 Time-of-Day Lighting Mode Presets */}
          {modelLoaded && (
            <div className="absolute left-3 top-11 sm:top-3 sm:left-44 z-10 flex items-center border border-brass/40 bg-[#121814]/90 p-0.5 text-xs text-paper shadow-sm backdrop-blur-sm rounded-[2px]">
              <button
                type="button"
                onClick={() => setLightingMode('dawn')}
                title="Sớm Mai: Nắng dịu vàng sương"
                className={`px-2 py-1 flex items-center gap-1 font-cinzel text-[10px] uppercase font-bold transition-colors ${
                  lightingMode === 'dawn' ? 'bg-brass text-forest' : 'text-paper/80 hover:text-brass'
                }`}
              >
                <Sunrise size={11} />
                <span className="hidden md:inline">Sớm Mai</span>
              </button>
              <button
                type="button"
                onClick={() => setLightingMode('noon')}
                title="Chính Ngọ: Ánh sáng rõ nét"
                className={`px-2 py-1 flex items-center gap-1 font-cinzel text-[10px] uppercase font-bold transition-colors ${
                  lightingMode === 'noon' ? 'bg-brass text-forest' : 'text-paper/80 hover:text-brass'
                }`}
              >
                <Sun size={11} />
                <span className="hidden md:inline">Chính Ngọ</span>
              </button>
              <button
                type="button"
                onClick={() => setLightingMode('dusk')}
                title="Hoàng Hôn: Ráng chiều hổ phách"
                className={`px-2 py-1 flex items-center gap-1 font-cinzel text-[10px] uppercase font-bold transition-colors ${
                  lightingMode === 'dusk' ? 'bg-brass text-forest' : 'text-paper/80 hover:text-brass'
                }`}
              >
                <Sunset size={11} />
                <span className="hidden md:inline">Hoàng Hôn</span>
              </button>
              <button
                type="button"
                onClick={() => setLightingMode('night')}
                title="Dạ Nguyệt: Ánh trăng huyền ảo"
                className={`px-2 py-1 flex items-center gap-1 font-cinzel text-[10px] uppercase font-bold transition-colors ${
                  lightingMode === 'night' ? 'bg-brass text-forest' : 'text-paper/80 hover:text-brass'
                }`}
              >
                <Moon size={11} />
                <span className="hidden md:inline">Dạ Nguyệt</span>
              </button>
            </div>
          )}

          {/* Top-Right Stage Controls (From User Reference: ↺ Đặt lại góc nhìn & ✕ Thoát) */}
          <div className="absolute right-3 top-3 z-20 flex items-center gap-2 sm:right-4 sm:top-4">
            {turntableUrl && !reducedMotion && !previewFailed && !modelLoaded && (
              <button
                type="button"
                onClick={() => setPreviewPlaying((playing) => !playing)}
                aria-label={previewPlaying ? 'Dừng video xem trước mô hình' : 'Phát video xem trước mô hình'}
                aria-pressed={previewPlaying}
                title={previewPlaying ? 'Dừng video xem trước' : 'Phát video xem trước'}
                className="flex h-8 sm:h-9 items-center gap-1.5 border border-paper-border/30 bg-[#121814]/85 px-2.5 text-xs font-sans text-paper shadow-md backdrop-blur-sm transition-colors hover:border-brass hover:text-brass font-medium"
              >
                {previewPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
                {previewPlaying ? t('product.playingSampleVideo', 'Dừng') : t('product.sampleVideo', 'Video mẫu')}
              </button>
            )}

            <button
              type="button"
              onClick={handleResetCamera}
              title={t('hotspots.resetCamera', 'Đặt lại góc nhìn')}
              className="flex h-8 sm:h-9 items-center gap-1.5 border border-paper-border/30 bg-[#121814]/85 px-2.5 sm:px-3 text-xs font-sans text-paper shadow-md backdrop-blur-sm transition-colors hover:border-brass hover:text-brass font-medium cursor-pointer"
            >
              <RotateCcw className="h-3.5 w-3.5 text-brass" />
              <span className="text-[11px] sm:text-xs tracking-wide">
                {t('hotspots.resetCamera', 'Đặt lại góc nhìn')}
              </span>
            </button>

            <button
              type="button"
              onClick={() => void toggleFullscreen()}
              aria-label={isFullscreen ? 'Thoát toàn màn hình' : 'Xem mô hình toàn màn hình'}
              title={isFullscreen ? 'Thoát toàn màn hình' : 'Toàn màn hình'}
              className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center border border-paper-border/30 bg-[#121814]/85 text-paper shadow-md backdrop-blur-sm transition-colors hover:border-brass hover:text-brass cursor-pointer"
            >
              {isFullscreen ? <X className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </button>
          </div>

          {!modelLoaded && !modelFailed && viewerAvailable && !previewPlaying && (
            <div className="pointer-events-none absolute inset-x-0 top-[4.2rem] z-[5] flex justify-center px-4">
              <div className="flex items-center gap-2 border border-brass/30 bg-[#121814]/90 px-3 py-2 text-xs text-brass shadow-sm backdrop-blur-sm">
                <span className="h-1.5 w-1.5 bg-brass" aria-hidden="true" />
                <span className="font-sans font-medium">{t('product.loading3d', 'Đang nạp mô hình 3D...')}</span>
              </div>
            </div>
          )}

          {/* Bottom Floating Pill Bar (From User Reference: ✦ ĐIỂN TÍCH LỊCH SỬ | ✦ ẨN CHI TIẾT | ◇ XOAY 3D) */}
          {modelLoaded && (
            <div className="pointer-events-none absolute inset-x-0 bottom-4 z-20 flex justify-center px-3">
              <div className="pointer-events-auto heritage-viewer-pillbar">
                <button
                  type="button"
                  onClick={() => setIsChronicleOpen(true)}
                  className="heritage-pill-btn"
                  title={t('hotspots.historicalChronicle', 'Điển tích lịch sử')}
                >
                  <span className="text-brass">✦</span>
                  <span>{t('hotspots.historicalChronicle', 'ĐIỂN TÍCH LỊCH SỬ')}</span>
                </button>

                <span className="heritage-pill-divider" aria-hidden="true" />

                <button
                  type="button"
                  onClick={() => {
                    setShowHotspots((prev) => !prev);
                    if (showHotspots) {
                      setActiveHotspotId(null);
                      setIsTourActive(false);
                    }
                  }}
                  className="heritage-pill-btn"
                  title={showHotspots ? t('hotspots.hideDetails', 'Ẩn chi tiết') : t('hotspots.showDetails', 'Hiện chi tiết')}
                >
                  <span className="text-brass">✦</span>
                  <span>
                    {showHotspots
                      ? t('hotspots.hideDetails', 'ẨN CHI TIẾT')
                      : t('hotspots.showDetails', 'HIỆN CHI TIẾT')}
                  </span>
                </button>

                <span className="heritage-pill-divider" aria-hidden="true" />

                <button
                  type="button"
                  onClick={() => setAutoRotate((prev) => !prev)}
                  disabled={reducedMotion}
                  className="heritage-pill-btn"
                  title={isAutoRotating ? t('hotspots.stopRotate', 'Dừng xoay') : t('hotspots.rotate3d', 'Xoay 3D')}
                >
                  <span className="text-brass">◇</span>
                  <span>
                    {isAutoRotating
                      ? t('hotspots.stopRotate', 'DỪNG XOAY')
                      : t('hotspots.rotate3d', 'XOAY 3D')}
                  </span>
                </button>

                <span className="heritage-pill-divider" aria-hidden="true" />

                <button
                  type="button"
                  onClick={handleOpenAR}
                  className="heritage-pill-btn"
                  title={t('ar.launch', 'Đặt mô hình vào không gian thực (AR)')}
                >
                  <Box className="h-3.5 w-3.5 text-brass" />
                  <span>XEM AR</span>
                </button>

                <span className="heritage-pill-divider" aria-hidden="true" />

                <button
                  type="button"
                  onClick={handleOpenPostcard}
                  className="heritage-pill-btn"
                  title={t('postcard.btn', 'In bưu thiếp ký ức giấy dó')}
                >
                  <Stamp className="h-3.5 w-3.5 text-brass" />
                  <span>BƯU THIẾP</span>
                </button>
              </div>
            </div>
          )}

          {/* Bottom-Right Zoom Controls (From User Reference: ⊕ ZoomIn / ⊖ ZoomOut) */}
          {modelLoaded && (
            <div className="heritage-zoom-controls">
              <button
                type="button"
                onClick={() => handleZoom('in')}
                aria-label={t('hotspots.zoomIn', 'Phóng to')}
                title={t('hotspots.zoomIn', 'Phóng to')}
                className="heritage-zoom-btn"
              >
                <ZoomIn className="h-4 w-4 text-brass" />
              </button>
              <button
                type="button"
                onClick={() => handleZoom('out')}
                aria-label={t('hotspots.zoomOut', 'Thu nhỏ')}
                title={t('hotspots.zoomOut', 'Thu nhỏ')}
                className="heritage-zoom-btn"
              >
                <ZoomOut className="h-4 w-4 text-brass" />
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="relative aspect-[16/10] overflow-hidden bg-paper">
          {thumbnailPhoto && (
            <CuratorLoupe
              imageSrc={thumbnailPhoto.src}
              altText={`${product.name} · ${t('product.tabPhotos', 'Ảnh thực địa')}`}
              zoomLevel={2.5}
              className="h-full w-full"
            />
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

      {/* Historical Chronicle Modal / Cultural Heritage Dossier */}
      {isChronicleOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md animate-fade-in"
          onClick={() => setIsChronicleOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label={t('hotspots.chronicleTitle', 'Điển tích & Bối cảnh lịch sử')}
        >
          <div
            className="relative max-h-[85vh] w-full max-w-xl overflow-y-auto border border-brass/50 bg-[#121915] p-6 text-paper shadow-2xl rounded-[3px]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between border-b border-brass/30 pb-3">
              <div>
                <span className="font-cinzel text-[10px] font-bold uppercase tracking-widest text-brass block">
                  {product.epoch || t('hotspots.chronicleSubtitle', 'Hồ sơ di sản văn hóa')}
                </span>
                <h3 className="font-display text-xl sm:text-2xl font-bold text-paper mt-1">
                  {product.name}
                </h3>
                {product.subName && (
                  <p className="font-sans text-xs text-brass-light/85 italic mt-0.5">
                    {product.subName}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={() => setIsChronicleOpen(false)}
                className="p-1.5 text-paper/70 hover:text-paper hover:bg-white/10 rounded transition-colors cursor-pointer"
                aria-label={t('hotspots.closeChronicle', 'Đóng điển tích')}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4 space-y-4 font-sans text-sm text-paper/90 leading-relaxed">
              {product.location && (
                <div className="flex items-center gap-2 text-xs text-paper/80 bg-paper/5 px-3 py-2 border border-paper/10">
                  <span className="font-semibold text-brass">Địa điểm:</span>
                  <span>{product.location}</span>
                </div>
              )}

              <p>{product.shortDescription}</p>

              {product.audioGuide?.transcript && (
                <div className="border-l-2 border-brass pl-3.5 py-1 text-paper/85 italic bg-brass/5">
                  <p>{product.audioGuide.transcript}</p>
                </div>
              )}

              {product.collection?.description && (
                <p className="text-xs text-paper/70">{product.collection.description}</p>
              )}

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setIsChronicleOpen(false);
                    const essayEl = document.getElementById('in-depth-essay') || document.querySelector('.story-blocks-container');
                    if (essayEl) {
                      essayEl.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className="inline-flex items-center gap-2 border border-brass bg-brass/20 px-4 py-2 text-xs font-sans font-medium text-brass-light hover:bg-brass hover:text-forest transition-colors cursor-pointer"
                >
                  <span>{t('hotspots.viewFullStory', 'Xem toàn bộ khảo cứu chuyên sâu')}</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Web AR Experience Modal */}
      <ARLaunchModal
        product={product}
        isOpen={isARModalOpen}
        onClose={() => setIsARModalOpen(false)}
        canDirectAR={Boolean((modelViewerRef.current as unknown as { canActivateAR?: boolean })?.canActivateAR)}
        onActivateDirectAR={() => {
          try {
            (modelViewerRef.current as unknown as { activateAR?: () => void })?.activateAR?.();
          } catch {
            // ignore
          }
        }}
      />

      {/* Bespoke Heritage Postcard Generator Modal */}
      <PostcardGeneratorModal
        product={product}
        isOpen={isPostcardOpen}
        onClose={() => {
          setIsPostcardOpen(false);
          setPostcardSnapshot(null);
        }}
        snapshotDataUrl={postcardSnapshot}
      />
    </div>
  );
};

export default ArchitecturalViewer;
