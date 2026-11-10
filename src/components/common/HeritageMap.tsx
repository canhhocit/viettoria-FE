import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { 
  ArrowRight, 
  Compass, 
  Maximize2, 
  Layers, 
  X
} from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { getLocalizedProduct } from '../../utils/localizedEntities';
import {
  resolve3DModelUrl,
  resolve3DPreview,
  resolveImageUrl,
  VIETTORIA_IMAGES,
} from '../../utils/mediaResolver';

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
  const { t, language } = useLanguage();
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const tileLayersRef = useRef<{ osmStandard: L.TileLayer; esriSatellite: L.TileLayer } | null>(null);
  const markersRef = useRef<{ [key: string]: L.Marker }>({});

  const [activeSite, setActiveSite] = useState<HeritageSiteLocation>(
    HERITAGE_SITES.find(s => s.id === initialSiteId) || HERITAGE_SITES[1] // Mặc định Khuê Văn Các
  );
  const [activeRegion, setActiveRegion] = useState<'all' | 'hanoi' | 'hue' | 'saigon'>('all');
  const [mapLayerType, setMapLayerType] = useState<'standard' | 'satellite'>('standard');
  const [isFullscreen3D, setIsFullscreen3D] = useState<boolean>(false);

  const getLocalizedSite = (site: HeritageSiteLocation): HeritageSiteLocation => {
    if (language === 'vi') return site;
    const localized = getLocalizedProduct({
      id: site.id,
      slug: site.slug,
      name: site.name,
      subName: site.subName,
      shortDescription: site.description,
      location: site.location,
      epoch: site.epoch,
    } as any, language);
    return {
      ...site,
      name: localized.name || site.name,
      subName: localized.subName || site.subName,
      description: localized.shortDescription || site.description,
      location: localized.location || site.location,
      epoch: localized.epoch || site.epoch,
    };
  };

  const currentSite = getLocalizedSite(activeSite);

  const cityLabels: Record<string, Record<string, string>> = {
    hanoi: { vi: 'Hà Nội', en: 'Hanoi', fr: 'Hanoï', zh: '河内', ko: '하노이', ja: 'ハノイ' },
    hue: { vi: 'Huế', en: 'Hue', fr: 'Hué', zh: '顺化', ko: '후에', ja: 'フエ' },
    saigon: { vi: 'Sài Gòn', en: 'Saigon', fr: 'Saïgon', zh: '西贡', ko: '사이공', ja: 'サイゴン' },
  };

  // Chuyển đổi giữa các lớp bản đồ
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

  // Tập trung vào một công trình di sản cụ thể
  const focusSite = (site: HeritageSiteLocation) => {
    setActiveSite(site);

    const map = mapRef.current;
    if (!map) return;

    map.flyTo([site.lat, site.lng], 16.5, { duration: 1.1 });

    // Cập nhật beacon viền vàng cho marker đang chọn
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

  // Bay đến vùng miền hoặc toàn cảnh
  const flyToRegion = (region: 'all' | 'hanoi' | 'hue' | 'saigon') => {
    setActiveRegion(region);
    const map = mapRef.current;
    if (!map) return;

    if (region === 'all') {
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
    if (mapRef.current) return;

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

    // Khởi tạo bản đồ với OpenStreetMap tiêu chuẩn (ấm áp, rõ đường phố, không bị lóa)
    const map = L.map(mapContainerRef.current, {
      center: [activeSite.lat, activeSite.lng],
      zoom: 16.5,
      zoomControl: false,
      scrollWheelZoom: true,
      attributionControl: true,
      layers: [osmStandard],
    });

    mapRef.current = map;

    setTimeout(() => {
      map.invalidateSize();
    }, 250);

    // Tạo các điểm ghim di sản trên bản đồ
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

      // Tooltip khi di chuột
      marker.bindTooltip(`<b>${site.mapLabel} · ${site.name}</b> (${site.epoch.split('(')[0].trim()})`, {
        direction: 'top',
        offset: [0, -44],
        className: 'heritage-map-tooltip',
      });

      // Popup thông tin thanh lịch
      const popupHtml = `
        <div style="
          font-family: 'Be Vietnam Pro', sans-serif;
          min-width: 210px;
          padding: 6px 2px;
          background: #FAF7F0;
          color: #1B1E1B;
        ">
          <div style="font-family: 'Cinzel', serif; font-size: 10px; color: #B88A44; letter-spacing: 0.08em; text-transform: uppercase; font-weight: 700;">
            ${site.mapLabel} · ${site.epoch.split('(')[0].trim()}
          </div>
          <h4 style="font-family: 'Playfair Display', serif; font-size: 15px; font-weight: bold; color: #142820; margin: 3px 0;">
            ${site.name}
          </h4>
          <p style="font-size: 11px; color: #4A4A4A; margin: 0 0 6px 0; line-height: 1.35;">
            ${site.location}
          </p>
          <div style="font-size: 9.5px; color: #8A7246; font-family: monospace; border-top: 1px solid rgba(184, 138, 68, 0.2); padding-top: 4px;">
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
      {/* Cột Trái: Bộ điều hướng danh sách & Hồ sơ chi tiết Spotlight di sản */}
      <div className="w-full lg:w-[400px] xl:w-[430px] bg-paper-warm border-b lg:border-b-0 lg:border-r border-paper-border p-4 sm:p-5 flex flex-col shrink-0 z-20 space-y-4">
        {/* 1. Header */}
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-brass text-[11px] font-mono uppercase tracking-widest font-semibold">
            <Compass className="w-3.5 h-3.5" />
            <span>{t('mapPage.subtitle', 'Định Vị Tọa Độ Địa Lý')}</span>
          </div>
          <h3 className="font-serif text-xl sm:text-2xl font-bold text-forest">
            {t('mapPage.selectedMonument', 'Bản Đồ Di Sản')}
          </h3>
          <p className="text-xs text-charcoal/80 font-normal leading-relaxed">
            {t('home.mapDesc', 'Khảo cứu tọa độ địa lý, niên đại lịch sử và cấu trúc kiến trúc của các biểu tượng văn hóa.')}
          </p>
        </div>

        {/* 2. Bộ lọc vùng miền */}
        <div className="grid grid-cols-4 gap-1 p-1 bg-paper border border-paper-border text-xs font-mono">
          <button
            type="button"
            onClick={() => flyToRegion('all')}
            className={`py-1.5 px-1 text-center transition-colors text-[11px] ${
              activeRegion === 'all'
                ? 'bg-forest text-brass font-bold shadow-xs'
                : 'text-charcoal-muted hover:text-forest'
            }`}
          >
            {t('mapPage.allVietnam', 'Toàn Cảnh')}
          </button>
          <button
            type="button"
            onClick={() => flyToRegion('hanoi')}
            className={`py-1.5 px-1 text-center transition-colors text-[11px] ${
              activeRegion === 'hanoi'
                ? 'bg-forest text-brass font-bold shadow-xs'
                : 'text-charcoal-muted hover:text-forest'
            }`}
          >
            {cityLabels.hanoi[language] || 'Hà Nội'} (3)
          </button>
          <button
            type="button"
            onClick={() => flyToRegion('hue')}
            className={`py-1.5 px-1 text-center transition-colors text-[11px] ${
              activeRegion === 'hue'
                ? 'bg-forest text-brass font-bold shadow-xs'
                : 'text-charcoal-muted hover:text-forest'
            }`}
          >
            {cityLabels.hue[language] || 'Huế'} (1)
          </button>
          <button
            type="button"
            onClick={() => flyToRegion('saigon')}
            className={`py-1.5 px-1 text-center transition-colors text-[11px] ${
              activeRegion === 'saigon'
                ? 'bg-forest text-brass font-bold shadow-xs'
                : 'text-charcoal-muted hover:text-forest'
            }`}
          >
            {cityLabels.saigon[language] || 'Sài Gòn'} (1)
          </button>
        </div>

        {/* 3. Danh sách công trình thu gọn */}
        <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1 no-scrollbar border-b border-paper-border pb-3">
          {HERITAGE_SITES.map((site) => {
            const isSelected = activeSite.id === site.id;
            const locSite = getLocalizedSite(site);
            return (
              <button
                key={site.id}
                type="button"
                onClick={() => focusSite(site)}
                className={`w-full text-left px-3 py-2 border transition-all flex items-center justify-between gap-3 cursor-pointer ${
                  isSelected
                    ? 'bg-forest text-paper border-brass font-semibold shadow-xs'
                    : 'bg-paper border-paper-border text-charcoal hover:border-brass/70'
                }`}
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 text-[10px]">
                    <span className={`font-sans uppercase tracking-wider font-bold ${isSelected ? 'text-brass' : 'text-brass-dark'}`}>
                      {cityLabels[site.city]?.[language] || site.cityName.split('—')[0].trim()}
                    </span>
                    <span className={isSelected ? 'text-paper/60' : 'text-charcoal-muted'}>
                      • {locSite.epoch.split('(')[0].trim()}
                    </span>
                  </div>
                  <div className="font-serif text-xs sm:text-sm font-bold truncate">
                    {locSite.name}
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

        {/* 4. Hồ Sơ Di Sản Spotlight (Chỉ 3D Tinh Giản, Tối Giản Chữ) */}
        <div className="space-y-2.5 pt-1">
          {/* Khung hiển thị Mô hình 3D tinh xảo */}
          <div className="relative aspect-[16/11] w-full overflow-hidden border border-brass/40 bg-[#121814] shadow-inner rounded-[2px] group">
            <div className="heritage-3d-stage-glow pointer-events-none" aria-hidden="true" />
            
            {/* Header nhỏ góc trên: Nhãn 3D và Nút phóng to toàn màn hình */}
            <div className="absolute top-2 left-2.5 right-2.5 z-10 flex items-center justify-between pointer-events-none">
              <span className="font-mono text-[9.5px] uppercase tracking-wider text-brass bg-black/60 px-2 py-0.5 border border-brass/30 backdrop-blur-xs">
                ◇ 3D MODEL
              </span>
              <button
                type="button"
                onClick={() => setIsFullscreen3D(true)}
                className="pointer-events-auto text-paper/70 hover:text-brass bg-black/60 p-1 border border-white/10 hover:border-brass/40 backdrop-blur-xs transition-colors cursor-pointer"
                title={t('mapPage.expand', 'Phóng to 3D toàn màn hình')}
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
            </div>

            <model-viewer
              key={`${activeSite.slug}-sidebar-3d`}
              src={resolve3DModelUrl(activeSite.slug)}
              poster={resolve3DPreview(activeSite.slug)?.poster || resolveImageUrl(activeSite.heroImage, VIETTORIA_IMAGES.productHighlight)}
              alt={`Mô hình 3D ${currentSite.name}`}
              camera-controls
              auto-rotate=""
              rotation-per-second="6deg"
              shadow-intensity="1.2"
              shadow-softness="0.75"
              exposure="1.05"
              loading="lazy"
              reveal="auto"
              interaction-prompt="none"
              style={{ width: '100%', height: '100%', backgroundColor: 'transparent', touchAction: 'pan-y' }}
              className="absolute inset-0 h-full w-full"
            />
          </div>

          {/* Chi tiết di sản tối giản chữ: Tên, Địa danh · Niên đại và Tọa độ */}
          <div className="flex items-end justify-between gap-3 pt-0.5">
            <div className="min-w-0">
              <h4 className="font-serif text-lg font-bold text-forest leading-tight truncate">
                {currentSite.name}
              </h4>
              <p className="text-[11px] text-charcoal-muted font-sans mt-0.5 truncate">
                {currentSite.cityName.split('—')[0].trim()} · {currentSite.epoch.split('(')[0].trim()}
              </p>
            </div>
            <span className="font-mono text-[10px] text-brass-dark shrink-0">
              {formatCoordinates(activeSite)}
            </span>
          </div>

          {/* Nút hành động chính: Mở trang khảo cứu 3D chi tiết */}
          <Link
            to={`/products/${activeSite.slug}`}
            className="w-full inline-flex items-center justify-center gap-2 border border-brass bg-forest text-paper px-4 py-2 text-xs font-sans font-bold tracking-wider uppercase hover:bg-forest-muted transition-colors shadow-xs group"
          >
            <span>{t('mapPage.exploreMonument3D', 'Khảo Cứu 3D Chi Tiết')}</span>
            <ArrowRight className="w-3.5 h-3.5 text-brass transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>

      {/* Cột Phải: Khung nhìn Bản đồ Leaflet (100% THOÁNG ĐÃNG, KHÔNG BỊ CHE) */}
      <div 
        className={`relative flex-1 bg-paper-warm overflow-hidden ${
          compactHeight ? 'min-h-[440px] lg:min-h-[520px]' : 'min-h-[500px] lg:min-h-[640px]'
        }`}
      >
        {/* Container DOM Bản đồ Leaflet */}
        <div 
          ref={mapContainerRef} 
          className="absolute inset-0 w-full h-full z-10 heritage-map-canvas"
        />

        {/* Cụm điều khiển nổi góc trên bên phải (Tối giản, không che bản đồ) */}
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 flex items-center gap-1.5 bg-paper/95 p-1 border border-paper-border shadow-md backdrop-blur-sm">
          <button
            type="button"
            onClick={() => toggleMapLayer(mapLayerType === 'satellite' ? 'standard' : 'satellite')}
            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-sans font-medium text-charcoal hover:text-forest hover:bg-paper-warm transition-colors cursor-pointer"
            title={mapLayerType === 'satellite' ? 'Chuyển sang bản đồ phẳng' : 'Chuyển sang ảnh vệ tinh'}
          >
            <Layers className="w-3.5 h-3.5 text-brass" />
            <span>{mapLayerType === 'satellite' ? t('mapPage.standardView', 'Bản Đồ') : t('mapPage.satelliteView', 'Vệ Tinh')}</span>
          </button>

          <span className="w-px h-3.5 bg-paper-border" aria-hidden="true" />

          <button
            type="button"
            onClick={() => flyToRegion('all')}
            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-sans font-medium text-charcoal hover:text-forest hover:bg-paper-warm transition-colors cursor-pointer"
            title={t('mapPage.allVietnam', 'Toàn cảnh Việt Nam')}
          >
            <Compass className="w-3.5 h-3.5 text-brass" />
            <span>{t('mapPage.allVietnam', 'Toàn Cảnh')}</span>
          </button>

          <span className="w-px h-3.5 bg-paper-border" aria-hidden="true" />

          <button
            type="button"
            onClick={() => mapRef.current?.zoomIn()}
            className="p-1 text-charcoal hover:text-forest transition-colors font-bold text-sm px-1.5 leading-none cursor-pointer"
            title="Phóng to"
          >
            +
          </button>
          <button
            type="button"
            onClick={() => mapRef.current?.zoomOut()}
            className="p-1 text-charcoal hover:text-forest transition-colors font-bold text-sm px-1.5 leading-none cursor-pointer"
            title="Thu nhỏ"
          >
            −
          </button>
        </div>

        {/* Huy hiệu thông báo công trình đang chọn góc dưới bên trái (Gọn gàng, không che bản đồ) */}
        <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 z-20 pointer-events-none bg-paper/95 border border-paper-border px-3.5 py-2 shadow-md backdrop-blur-sm flex items-center gap-2.5 text-xs text-forest max-w-[calc(100%-2rem)] sm:max-w-md">
          <span className="h-2 w-2 rounded-full bg-brass shrink-0 animate-ping" />
          <div className="min-w-0 truncate">
            <span className="font-serif font-bold">{currentSite.name}</span>
            <span className="text-charcoal-muted ml-1.5 text-[11px] truncate hidden sm:inline">({currentSite.location})</span>
          </div>
        </div>
      </div>

      {/* Modal Triển Lãm 3D Toàn Màn Hình (Khi người dùng bấm Phóng To 3D) */}
      {isFullscreen3D && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-md animate-fade-in"
          role="dialog"
          aria-modal="true"
          aria-label={`Mô hình 3D ${currentSite.name}`}
        >
          <div className="relative w-full max-w-4xl h-[85vh] border border-brass/50 bg-[#121915] flex flex-col overflow-hidden shadow-2xl rounded-[3px]">
            {/* Header Modal */}
            <div className="flex items-center justify-between border-b border-brass/30 px-5 py-3.5 bg-forest-dark/80">
              <div>
                <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-brass block">
                  {currentSite.epoch} · {currentSite.cityName}
                </span>
                <h3 className="font-serif text-xl font-bold text-paper mt-0.5">
                  {currentSite.name}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setIsFullscreen3D(false)}
                className="p-2 text-paper/70 hover:text-paper hover:bg-white/10 rounded transition-colors cursor-pointer"
                aria-label={t('common.close', 'Đóng')}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Sân khấu 3D bảo tàng tối */}
            <div className="relative flex-1 heritage-3d-dark-stage overflow-hidden">
              <div className="heritage-3d-stage-glow pointer-events-none" aria-hidden="true" />
              <model-viewer
                key={`${activeSite.slug}-fullscreen-3d`}
                src={resolve3DModelUrl(activeSite.slug)}
                poster={resolve3DPreview(activeSite.slug)?.poster || resolveImageUrl(activeSite.heroImage, VIETTORIA_IMAGES.productHighlight)}
                alt={`Mô hình 3D ${currentSite.name}`}
                camera-controls
                auto-rotate=""
                rotation-per-second="6deg"
                shadow-intensity="1.2"
                shadow-softness="0.75"
                exposure="1.05"
                loading="eager"
                reveal="auto"
                interaction-prompt="none"
                style={{ width: '100%', height: '100%', backgroundColor: 'transparent', touchAction: 'pan-y' }}
                className="absolute inset-0 h-full w-full"
              />
            </div>

            {/* Footer Modal */}
            <div className="flex items-center justify-between border-t border-brass/30 px-5 py-3 bg-forest-dark/90">
              <span className="font-mono text-xs text-brass">
                📍 {formatCoordinates(activeSite)}
              </span>
              <Link
                to={`/products/${activeSite.slug}`}
                className="inline-flex items-center gap-2 border border-brass bg-brass px-4 py-2 text-xs font-semibold text-forest hover:bg-brass-light transition-colors"
              >
                <span>{t('mapPage.exploreMonument3D', 'Khảo Cứu Tác Phẩm Có Chỉ Dẫn Chi Tiết')}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HeritageMap;
