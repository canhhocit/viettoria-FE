import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { ArrowRight, Compass } from 'lucide-react';
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
  const markersRef = useRef<{ [key: string]: L.Marker }>({});

  const [activeSite, setActiveSite] = useState<HeritageSiteLocation>(
    HERITAGE_SITES.find(s => s.id === initialSiteId) || HERITAGE_SITES[0]
  );
  const [activeRegion, setActiveRegion] = useState<'all' | 'hanoi' | 'hue' | 'saigon'>('all');

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
        attribution: 'Tiles &copy; Esri — Source: Esri, Maxar, Earthstar Geographics, and the GIS User Community',
      },
    );

    const map = L.map(mapContainerRef.current, {
      center: [16.5, 107.0],
      zoom: 6,
      zoomControl: false,
      scrollWheelZoom: true,
      attributionControl: true,
      layers: [osmStandard],
    });

    L.control.zoom({ position: 'bottomright' }).addTo(map);
    L.control.layers({
      'Bản đồ Tiêu chuẩn': osmStandard,
      'Bản đồ Vệ tinh': esriSatellite,
    }, undefined, { position: 'topright' }).addTo(map);

    mapRef.current = map;

    // Auto fit bounds to encompass all 5 heritage sites across Vietnam
    const bounds = L.latLngBounds(HERITAGE_SITES.map(s => [s.lat, s.lng]));
    map.fitBounds(bounds, { padding: [40, 40] });

    // Handle container resize cleanly
    setTimeout(() => {
      map.invalidateSize();
    }, 200);

    // Create markers for each heritage site
    HERITAGE_SITES.forEach((site) => {
      const isHero = site.code === 'VT-HN-001';
      
      // Antique Atelier Pin Icon
      const icon = L.divIcon({
        className: 'heritage-custom-pin',
        html: `
          <div class="heritage-map-pin${isHero ? ' heritage-map-pin--featured' : ''}">
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
        zIndexOffset: isHero ? 1000 : 100 - parseInt(site.id),
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
        setActiveSite(site);
      });

      markersRef.current[site.id] = marker;
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Fly to region or site
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
      if (hanoiSite) setActiveSite(hanoiSite);
    } else if (region === 'hue') {
      const hueSite = HERITAGE_SITES.find(s => s.city === 'hue');
      if (hueSite) {
        map.flyTo([hueSite.lat, hueSite.lng], 15, { duration: 1.2 });
        setActiveSite(hueSite);
      }
    } else if (region === 'saigon') {
      const sgSite = HERITAGE_SITES.find(s => s.city === 'saigon');
      if (sgSite) {
        map.flyTo([sgSite.lat, sgSite.lng], 15, { duration: 1.2 });
        setActiveSite(sgSite);
      }
    }
  };

  const focusSite = (site: HeritageSiteLocation) => {
    setActiveSite(site);
    const map = mapRef.current;
    if (!map) return;

    map.flyTo([site.lat, site.lng], 16, { duration: 1.0 });

    const marker = markersRef.current[site.id];
    if (marker) {
      marker.openPopup();
    }
  };

  return (
    <div className="heritage-map bg-paper border border-brass/40 corner-frame shadow-xl overflow-hidden flex flex-col lg:flex-row">
      {/* Left Sidebar: Heritage Site Navigator */}
      <div className="w-full lg:w-96 bg-paper-warm border-b lg:border-b-0 lg:border-r border-paper-border p-6 flex flex-col justify-between space-y-6 shrink-0">
        <div className="space-y-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-brass text-xs font-mono uppercase tracking-widest">
              <Compass className="w-4 h-4" />
            <span>Bản đồ di sản</span>
            </div>
            <h3 className="font-serif text-2xl font-bold text-forest">
              Tọa độ di sản
            </h3>
            <p className="text-xs text-charcoal/80 font-normal leading-relaxed">
              Chọn một điểm để xem trên bản đồ.
            </p>
          </div>

          {/* Quick Region Selector Pills */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 p-1 bg-paper border border-paper-border text-xs font-mono">
            <button
              onClick={() => flyToRegion('all')}
              className={`py-1.5 px-2 text-center transition-colors ${
                activeRegion === 'all'
                  ? 'bg-forest text-brass font-bold'
                  : 'text-charcoal-muted hover:text-forest'
              }`}
            >
              {t('common.all', 'Toàn Cảnh')}
            </button>
            <button
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
          <div className="space-y-2 max-h-56 lg:max-h-64 overflow-y-auto pr-1">
            {HERITAGE_SITES.map((site) => {
              const isSelected = activeSite.id === site.id;
              return (
                <button
                  key={site.id}
                  onClick={() => focusSite(site)}
                  className={`w-full text-left p-3 border transition-all flex items-start justify-between gap-3 ${
                    isSelected
                      ? 'bg-forest text-paper border-brass font-semibold shadow-sm'
                      : 'bg-paper border-paper-border text-charcoal hover:border-brass/70'
                  }`}
                >
                  <div className="min-w-0 space-y-1">
                    <div className="flex items-center gap-1.5 text-[11px]">
                      <span className={`font-serif uppercase tracking-wider ${isSelected ? 'text-brass font-bold' : 'text-brass'}`}>
                        {site.cityName.split('—')[0].trim()}
                      </span>
                      <span className={isSelected ? 'text-paper/60' : 'text-charcoal-muted'}>
                        • {site.epoch.split('(')[0].trim()}
                      </span>
                    </div>
                    <div className="font-serif text-sm font-bold">
                      {site.name}
                    </div>
                  </div>

                  <span className={`text-[10px] font-mono px-1.5 py-0.5 border ${
                    isSelected 
                      ? 'border-brass/50 bg-forest-dark text-brass' 
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
              <h4 className="truncate font-serif text-lg font-bold">{activeSite.name}</h4>
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

      {/* Right: Leaflet Map Viewport */}
      <div 
        className={`relative flex-1 bg-paper-warm ${
          compactHeight ? 'min-h-[360px] lg:min-h-[440px]' : 'min-h-[420px] lg:min-h-[560px]'
        }`}
      >
        {/* Leaflet DOM container */}
        <div 
          ref={mapContainerRef} 
          className="absolute inset-0 w-full h-full z-10"
        />
        
      </div>
    </div>
  );
};

export default HeritageMap;
