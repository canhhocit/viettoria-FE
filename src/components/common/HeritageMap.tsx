import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { 
  ArrowRight, 
  Compass, 
  Box, 
  Maximize2, 
  Minimize2, 
  RotateCw, 
  Layers, 
  Eye, 
  X, 
  Sparkles 
} from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

export interface HeritageSiteLocation {
  id: string;
  code: string;
  mapLabel: string;
  name: string;
  subName: string;
  slug: string;
  epoch: string;
  city: 'hanoi' | 'hue' | 'saigon';
  cityName: string;
  location: string;
  lat: number;
  lng: number;
  heroImage: string;
  description: string;
}

const formatCoordinates = (site: HeritageSiteLocation) =>
  `${site.lat.toFixed(5)}° N · ${site.lng.toFixed(5)}° E`;

export const HERITAGE_SITES: HeritageSiteLocation[] = [
  {
    id: '1',
    code: 'VT-HN-001',
    mapLabel: 'MC',
    name: 'Chùa Một Cột',
    subName: 'Diên Hựu Tự — Liên Hoa Đài',
    slug: 'chua-mot-cot',
    epoch: 'Thời Lý (Năm 1049)',
    city: 'hanoi',
    cityName: 'Thăng Long — Hà Nội',
    location: 'Đội Cấn, Ba Đình, Hà Nội',
    lat: 21.03583,
    lng: 105.83362,
    heroImage: '/images/chua-mot-cot-hero.webp',
    description: 'Đài hoa sen nghìn năm tuổi, biểu tượng kiến trúc Phật giáo kinh thành Thăng Long thời Lý thịnh trị.',
  },
  {
    id: '2',
    code: 'VT-HN-002',
    mapLabel: 'KV',
    name: 'Khuê Văn Các',
    subName: 'Gác Vẻ Đẹp Sao Khuê',
    slug: 'khue-van-cac',
    epoch: 'Triều Nguyễn (Năm 1805)',
    city: 'hanoi',
    cityName: 'Thăng Long — Hà Nội',
    location: 'Văn Miếu - Quốc Tử Giám, Đống Đa, Hà Nội',
    lat: 21.02861,
    lng: 105.83556,
    heroImage: '/images/khue-van-cac.webp',
    description: 'Biểu tượng tinh hoa hiếu học của đất kinh kỳ, kiến trúc gỗ lầu vuông giao hòa trời đất.',
  },
  {
    id: '3',
    code: 'VT-HN-003',
    mapLabel: 'CC',
    name: 'Cột Cờ Hà Nội',
    subName: 'Kỳ Đài Thăng Long',
    slug: 'cot-co-ha-noi',
    epoch: 'Triều Nguyễn (Năm 1812)',
    city: 'hanoi',
    cityName: 'Thăng Long — Hà Nội',
    location: '28A Điện Biên Phủ, Ba Đình, Hà Nội',
    lat: 21.0325,
    lng: 105.83972,
    heroImage: '/images/cot-co-ha-noi.webp',
    description: 'Kỳ đài kiên cố xây dựng bằng gạch vồ nung, chứng nhân lịch sử thăng trầm của kinh đô nghìn năm.',
  },
  {
    id: '4',
    code: 'VT-HUE-004',
    mapLabel: 'NM',
    name: 'Ngọ Môn Huế',
    subName: 'Cửa Chính Hoàng Thành Huế',
    slug: 'ngo-mon-hue',
    epoch: 'Triều Nguyễn (Năm 1833)',
    city: 'hue',
    cityName: 'Cố Đô Huế',
    location: 'Hoàng Thành Huế, TP. Huế',
    lat: 16.46768,
    lng: 107.57918,
    heroImage: '/images/ngo-mon-hue.webp',
    description: 'Đỉnh cao kiến trúc cung đình triều Nguyễn với kết cấu lầu Ngũ Phụng chín tầng đao cong lộng lẫy.',
  },
  {
    id: '5',
    code: 'VT-SG-005',
    mapLabel: 'NR',
    name: 'Bến Nhà Rồng',
    subName: 'Thương Cảng Sài Gòn 1863',
    slug: 'ben-nha-rong',
    epoch: 'Cận Đại (Năm 1863)',
    city: 'saigon',
    cityName: 'Sài Gòn — Gia Định',
    location: '01 Nguyễn Tất Thành, TP. Hồ Chí Minh',
    lat: 10.76824,
    lng: 106.70686,
    heroImage: '/images/ben-nha-rong.webp',
    description: 'Giao thoa giữa kiến trúc Pháp thuộc và hoa văn rồng Á Đông bên dòng sông Sài Gòn phồn hoa.',
  },
];

interface HeritageMapProps {
  initialSiteId?: string;
  compactHeight?: boolean;
}

export const HeritageMap: React.FC<HeritageMapProps> = ({ 
  initialSiteId, 
  compactHeight = false 
}) => {
  const { t } = useLanguage();
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const tileLayersRef = useRef<{ osmStandard: L.TileLayer; esriSatellite: L.TileLayer } | null>(null);
  const markersRef = useRef<{ [key: string]: L.Marker }>({});

  const [activeSite, setActiveSite] = useState<HeritageSiteLocation>(
    HERITAGE_SITES.find(s => s.id === initialSiteId) || HERITAGE_SITES[0]
  );
  const [activeRegion, setActiveRegion] = useState<'all' | 'hanoi' | 'hue' | 'saigon'>('all');
  const [is3DMode, setIs3DMode] = useState<boolean>(true);
  const [show3DModelCard, setShow3DModelCard] = useState<boolean>(true);
  const [is3DCardExpanded, setIs3DCardExpanded] = useState<boolean>(false);
  const [isAutoRotating, setIsAutoRotating] = useState<boolean>(true);
  const [mapLayerType, setMapLayerType] = useState<'satellite' | 'standard'>('satellite');

  // Switch between Tile Layers
  const toggleMapLayer = (type: 'standard' | 'satellite') => {
    setMapLayerType(type);
    const map = mapRef.current;
    const layers = tileLayersRef.current;
    if (!map || !layers) return;
    if (type === 'satellite') {
      map.removeLayer(layers.osmStandard);
      map.addLayer(layers.esriSatellite);
    } else {
      map.removeLayer(layers.esriSatellite);
      map.addLayer(layers.osmStandard);
    }
  };

  // Focus on a specific heritage site
  const focusSite = (site: HeritageSiteLocation) => {
    setActiveSite(site);
    setIs3DMode(true);
    setShow3DModelCard(true);

    const map = mapRef.current;
    if (!map) return;

    // Switch to satellite for realistic 3D architectural topography
    if (tileLayersRef.current) {
      map.removeLayer(tileLayersRef.current.osmStandard);
      map.addLayer(tileLayersRef.current.esriSatellite);
      setMapLayerType('satellite');
    }

    map.flyTo([site.lat, site.lng], 16.5, { duration: 1.2 });

    // Update pin marker selection beacon
    Object.entries(markersRef.current).forEach(([id, marker]) => {
      const el = marker.getElement();
      if (!el) return;
      const pin = el.querySelector('.heritage-map-pin');
      if (pin) {
        if (id === site.id) {
          pin.classList.add('heritage-map-pin--selected');
        } else {
          pin.classList.remove('heritage-map-pin--selected');
        }
      }
    });

    const marker = markersRef.current[site.id];
    if (marker) {
      marker.openPopup();
    }
  };

  // Fly to region or overview
  const flyToRegion = (region: 'all' | 'hanoi' | 'hue' | 'saigon') => {
    setActiveRegion(region);
    const map = mapRef.current;
    if (!map) return;

    if (region === 'all') {
      setIs3DMode(false);
      const allBounds = L.latLngBounds(HERITAGE_SITES.map(s => [s.lat, s.lng]));
      map.flyToBounds(allBounds, { padding: [50, 50], duration: 1.2 });
    } else if (region === 'hanoi') {
      map.flyTo([21.032, 105.836], 15, { duration: 1.2 });
      const hanoiSite = HERITAGE_SITES.find(s => s.city === 'hanoi');
      if (hanoiSite) focusSite(hanoiSite);
    } else if (region === 'hue') {
      const hueSite = HERITAGE_SITES.find(s => s.city === 'hue');
      if (hueSite) focusSite(hueSite);
    } else if (region === 'saigon') {
      const sgSite = HERITAGE_SITES.find(s => s.city === 'saigon');
      if (sgSite) focusSite(sgSite);
    }
  };

  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapRef.current) return; // Map already initialized

    const osmStandard = L.tileLayer('https://tile.openstreetmap.de/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>',
      className: 'heritage-standard-tiles',
    });
    const esriSatellite = L.tileLayer(
      'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      {
        maxZoom: 18,
        attribution: 'Tiles &copy; Esri — Source: Esri, Maxar, Earthstar Geographics',
      },
    );

    tileLayersRef.current = { osmStandard, esriSatellite };

    // Default to Satellite layer for 3D aerial perspective
    const map = L.map(mapContainerRef.current, {
      center: [activeSite.lat, activeSite.lng],
      zoom: 16.5,
      zoomControl: false,
      scrollWheelZoom: true,
      attributionControl: true,
      layers: [esriSatellite],
    });

    L.control.zoom({ position: 'bottomleft' }).addTo(map);

    mapRef.current = map;

    // Handle container resize cleanly
    setTimeout(() => {
      map.invalidateSize();
    }, 250);

    // Create markers for each heritage site
    HERITAGE_SITES.forEach((site) => {
      const isInitialActive = site.id === activeSite.id;
      
      const icon = L.divIcon({
        className: 'heritage-custom-pin',
        html: `
          <div class="heritage-map-pin${isInitialActive ? ' heritage-map-pin--selected' : ''}">
            <span>${site.mapLabel}</span>
            <i aria-hidden="true"></i>
          </div>
        `,
        iconSize: [38, 44],
        iconAnchor: [19, 44],
        popupAnchor: [0, -42],
      });

      const marker = L.marker([site.lat, site.lng], { 
        icon,
        title: `${site.mapLabel} · ${site.name}`,
        alt: `${site.mapLabel} · ${site.name}`,
        keyboard: true,
        zIndexOffset: isInitialActive ? 1000 : 100 - parseInt(site.id),
      }).addTo(map);

      // Tooltip on hover
      marker.bindTooltip(`<b>${site.mapLabel} · ${site.name}</b> (${site.epoch})`, {
        direction: 'top',
        offset: [0, -44],
        className: 'heritage-map-tooltip',
      });

      // Popup with Heritage Atelier styling
      const popupHtml = `
        <div style="
          font-family: 'Be Vietnam Pro', sans-serif;
          min-width: 220px;
          padding: 8px 4px;
          background: var(--color-paper);
          color: var(--heritage-ink);
        ">
          <div style="font-family: 'Playfair Display', serif; font-size: 11px; color: var(--heritage-brass); letter-spacing: 0.05em; text-transform: uppercase; font-weight: 600; margin-bottom: 4px;">
            ${site.mapLabel} · ${site.epoch}
          </div>
          <h4 style="font-family: 'Playfair Display', serif; font-size: 16px; font-weight: bold; color: var(--heritage-forest); margin: 0 0 4px 0;">
            ${site.name}
          </h4>
          <p style="font-size: 11px; color: #525952; margin: 0 0 8px 0; line-height: 1.4;">
            ${site.location}
          </p>
          <div style="font-size: 10px; color: var(--heritage-forest); border-top: 1px solid var(--heritage-line); padding-top: 6px; font-family: 'Roboto Mono', monospace;">
            Tọa độ: ${formatCoordinates(site)}
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml, {
        className: 'heritage-atelier-popup',
        closeButton: true,
      });

      marker.on('click', () => {
        focusSite(site);
      });

      markersRef.current[site.id] = marker;
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  return (
    <div className="heritage-map bg-paper border border-brass/40 corner-frame shadow-xl overflow-hidden flex flex-col lg:flex-row">
      {/* Left Sidebar: Heritage Site Navigator */}
      <div className="w-full lg:w-96 bg-paper-warm border-b lg:border-b-0 lg:border-r border-paper-border p-5 sm:p-6 flex flex-col justify-between space-y-5 shrink-0 z-20">
        <div className="space-y-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-brass text-xs font-mono uppercase tracking-widest font-semibold">
              <Compass className="w-4 h-4" />
              <span>{t('mapPage.subtitle', 'Bản Đồ Di Sản')}</span>
            </div>
            <h3 className="font-display text-2xl font-bold text-forest">
              {t('mapPage.selectedMonument', 'Tọa độ di sản')}
            </h3>
            <p className="text-xs text-charcoal/80 font-normal leading-relaxed">
              Chọn công trình để chuyển sang phối cảnh 3D và khám phá mô hình số hóa.
            </p>
          </div>

          {/* Quick Region Selector Pills */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 p-1 bg-paper border border-paper-border text-xs font-mono">
            <button
              type="button"
              onClick={() => flyToRegion('all')}
              className={`py-1.5 px-2 text-center transition-colors ${
                activeRegion === 'all'
                  ? 'bg-forest text-brass font-bold'
                  : 'text-charcoal-muted hover:text-forest'
              }`}
            >
              {t('mapPage.allVietnam', 'Toàn Cảnh')}
            </button>
            <button
              type="button"
              onClick={() => flyToRegion('hanoi')}
              className={`py-1.5 px-2 text-center transition-colors ${
                activeRegion === 'hanoi'
                  ? 'bg-forest text-brass font-bold'
                  : 'text-charcoal-muted hover:text-forest'
              }`}
            >
              Hà Nội (3)
            </button>
            <button
              type="button"
              onClick={() => flyToRegion('hue')}
              className={`py-1.5 px-2 text-center transition-colors ${
                activeRegion === 'hue'
                  ? 'bg-forest text-brass font-bold'
                  : 'text-charcoal-muted hover:text-forest'
              }`}
            >
              Huế (1)
            </button>
            <button
              type="button"
              onClick={() => flyToRegion('saigon')}
              className={`py-1.5 px-2 text-center transition-colors ${
                activeRegion === 'saigon'
                  ? 'bg-forest text-brass font-bold'
                  : 'text-charcoal-muted hover:text-forest'
              }`}
            >
              Sài Gòn (1)
            </button>
          </div>

          {/* Heritage Sites Mini List */}
          <div className="space-y-2 max-h-56 lg:max-h-64 overflow-y-auto pr-1 no-scrollbar">
            {HERITAGE_SITES.map((site) => {
              const isSelected = activeSite.id === site.id;
              return (
                <button
                  key={site.id}
                  type="button"
                  onClick={() => focusSite(site)}
                  className={`w-full text-left p-3 border transition-all flex items-start justify-between gap-3 ${
                    isSelected
                      ? 'bg-forest text-paper border-brass font-semibold shadow-sm'
                      : 'bg-paper border-paper-border text-charcoal hover:border-brass/70'
                  }`}
                >
                  <div className="min-w-0 space-y-1">
                    <div className="flex items-center gap-1.5 text-[11px]">
                      <span className={`font-cinzel uppercase tracking-wider font-bold ${isSelected ? 'text-brass' : 'text-brass-dark'}`}>
                        {site.cityName.split('—')[0].trim()}
                      </span>
                      <span className={isSelected ? 'text-paper/60' : 'text-charcoal-muted'}>
                        • {site.epoch.split('(')[0].trim()}
                      </span>
                    </div>
                    <div className="font-display text-sm font-bold truncate">
                      {site.name}
                    </div>
                  </div>

                  <span className={`text-[10px] font-mono px-1.5 py-0.5 border ${
                    isSelected 
                      ? 'border-brass/50 bg-forest-dark text-brass font-bold' 
                      : 'border-paper-border bg-paper-warm text-charcoal-muted'
                  }`}>
                    {site.mapLabel}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Heritage Spotlight Card */}
        <div className="border-t border-paper-border pt-4 text-forest">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h4 className="truncate font-display text-lg font-bold">{activeSite.name}</h4>
              <p className="mt-1 truncate text-xs text-charcoal-muted">{activeSite.location}</p>
            </div>
            <Link
              to={`/products/${activeSite.slug}`}
              className="shrink-0 inline-flex items-center gap-1 pt-1 text-xs font-semibold text-brass-dark hover:text-forest group"
            >
              <span>{t('mapPage.viewDetails', 'Mở di sản')}</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
          <p className="mt-2 border-t border-paper-border pt-2 font-mono text-[10px] text-charcoal-muted">
            {formatCoordinates(activeSite)}
          </p>
        </div>
      </div>

      {/* Right: Leaflet Map Viewport with 3D Perspective & Digital Twin Pedestal */}
      <div 
        className={`relative flex-1 bg-paper-warm overflow-hidden ${
          is3DMode ? 'heritage-map-viewport--3d' : ''
        } ${compactHeight ? 'min-h-[440px] lg:min-h-[520px]' : 'min-h-[500px] lg:min-h-[640px]'}`}
      >
        {/* Leaflet DOM container */}
        <div 
          ref={mapContainerRef} 
          className={`absolute inset-0 w-full h-full z-10 ${
            is3DMode ? 'heritage-map-canvas--3d' : 'heritage-map-canvas--2d'
          }`}
        />

        {/* Floating Map Mode Control Bar */}
        <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-20 flex flex-wrap items-center gap-1.5 bg-forest-dark/90 p-1.5 border border-brass/40 shadow-lg backdrop-blur-sm">
          <button
            type="button"
            onClick={() => setIs3DMode(prev => !prev)}
            aria-pressed={is3DMode}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-sans font-medium transition-all ${
              is3DMode 
                ? 'bg-brass text-forest font-bold shadow-xs' 
                : 'bg-forest/80 text-paper/85 hover:text-brass hover:border-brass'
            }`}
            title="Bật/Tắt góc nghiêng phối cảnh 3D"
          >
            <Box className="w-3.5 h-3.5" />
            <span>{is3DMode ? t('mapPage.mode3D', 'Góc 3D Nghiêng') : t('mapPage.mode2D', 'Bản Đồ Phẳng')}</span>
          </button>

          <button
            type="button"
            onClick={() => setShow3DModelCard(prev => !prev)}
            aria-pressed={show3DModelCard}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-sans font-medium transition-all ${
              show3DModelCard 
                ? 'bg-brass/25 border border-brass text-brass font-bold' 
                : 'bg-forest/80 text-paper/85 hover:text-brass'
            }`}
            title="Hiện/Ẩn bục mô hình 3D"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{t('mapPage.pedestal3D', 'Bục 3D')}</span>
          </button>

          <button
            type="button"
            onClick={() => toggleMapLayer(mapLayerType === 'satellite' ? 'standard' : 'satellite')}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-sans font-medium transition-all ${
              mapLayerType === 'satellite' 
                ? 'bg-forest text-paper border border-brass/60' 
                : 'bg-forest/80 text-paper/85 hover:text-brass'
            }`}
            title="Đổi lớp bản đồ vệ tinh / tiêu chuẩn"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{mapLayerType === 'satellite' ? t('mapPage.satelliteView', 'Vệ Tinh') : t('mapPage.standardView', 'Bản Đồ')}</span>
          </button>
        </div>

        {/* Floating 3D Digital Twin Model Stage Overlay */}
        {show3DModelCard && activeSite && (
          <div 
            className={`absolute bottom-3 right-3 sm:bottom-4 sm:right-4 z-20 border-2 border-brass/70 bg-forest/95 text-paper shadow-2xl backdrop-blur-md transition-all duration-300 corner-frame ${
              is3DCardExpanded 
                ? 'inset-x-3 bottom-3 top-14 sm:inset-x-auto sm:left-4 sm:right-4 sm:top-14 sm:bottom-4' 
                : 'w-[calc(100%-1.5rem)] sm:w-[360px] lg:w-[380px]'
            }`}
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-3 border-b border-brass/30 p-3 sm:p-3.5 bg-forest-dark/70">
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 text-brass">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span className="font-cinzel text-[10px] font-bold uppercase tracking-widest text-brass">
                    {t('mapPage.pedestal3D', 'Mô Hình 3D Địa Phương')}
                  </span>
                </div>
                <h4 className="mt-1 font-display text-base font-bold text-paper truncate">
                  {activeSite.name}
                </h4>
                <p className="font-display text-xs italic text-brass-subtle truncate">
                  {activeSite.subName}
                </p>
              </div>

              <div className="flex items-center gap-1 shrink-0 text-paper/70">
                <button
                  type="button"
                  onClick={() => setIsAutoRotating(prev => !prev)}
                  title={t('mapPage.autoRotate', 'Tự Xoay')}
                  className={`p-1.5 border transition-colors ${
                    isAutoRotating ? 'border-brass bg-brass text-forest' : 'border-paper/20 hover:text-paper hover:border-paper/40'
                  }`}
                >
                  <RotateCw className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setIs3DCardExpanded(prev => !prev)}
                  title={is3DCardExpanded ? t('mapPage.minimize', 'Thu Nhỏ') : t('mapPage.expand', 'Mở Rộng')}
                  className="p-1.5 border border-paper/20 hover:text-paper hover:border-paper/40 transition-colors"
                >
                  {is3DCardExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                </button>
                <button
                  type="button"
                  onClick={() => setShow3DModelCard(false)}
                  title={t('common.close', 'Đóng')}
                  className="p-1.5 border border-paper/20 hover:text-terracotta hover:border-terracotta transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* 3D Model Viewport */}
            <div className={`relative w-full overflow-hidden bg-forest-dark/90 ${
              is3DCardExpanded ? 'h-[calc(100%-135px)] min-h-[300px]' : 'h-48 sm:h-56'
            }`}>
              {/* Exhibition Pedestal Spotlight */}
              <div className="heritage-pedestal-light pointer-events-none absolute inset-0 z-[1]" aria-hidden="true" />

              <model-viewer
                key={`${activeSite.slug}-map-3d`}
                src={`/3D/${activeSite.slug}.glb`}
                poster={`/3D/${activeSite.slug}-poster.webp`}
                alt={`Mô hình 3D của ${activeSite.name}`}
                camera-controls
                auto-rotate={isAutoRotating ? '' : undefined}
                rotation-per-second="25deg"
                shadow-intensity="0.85"
                exposure="1"
                loading="lazy"
                reveal="auto"
                interaction-prompt="none"
                style={{ width: '100%', height: '100%', backgroundColor: 'transparent', touchAction: 'pan-y' }}
                className="absolute inset-0 h-full w-full"
              />

              {/* Interaction Hint Overlay */}
              <div className="pointer-events-none absolute bottom-2 left-2 right-2 z-10 flex items-center justify-between text-[10px] text-paper/70 font-sans px-2 py-1 bg-forest/80 backdrop-blur-xs border border-brass/20">
                <span>{t('mapPage.dragToRotate', 'Kéo để xoay 360° · Cuộn để thu phóng')}</span>
                <span className="font-cinzel text-brass font-bold">{activeSite.epoch.split('(')[0].trim()}</span>
              </div>
            </div>

            {/* Card Action Link */}
            <div className="flex items-center justify-between gap-3 border-t border-brass/30 p-2.5 sm:p-3 bg-forest-dark/80">
              <span className="font-mono text-[10px] text-paper/60 truncate">
                {formatCoordinates(activeSite)}
              </span>
              <Link
                to={`/products/${activeSite.slug}`}
                className="inline-flex items-center gap-1.5 border border-brass bg-brass px-3 py-1.5 text-xs font-semibold text-forest shadow-xs hover:bg-brass-light transition-colors shrink-0"
              >
                <span>{t('mapPage.exploreMonument3D', 'Khảo Cứu Tác Phẩm 3D')}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HeritageMap;
