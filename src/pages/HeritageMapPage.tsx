import React from 'react';
import { Compass } from 'lucide-react';
import { HeritageMap } from '../components/common/HeritageMap';
import { useLanguage } from '../contexts/LanguageContext';

export const HeritageMapPage: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="bg-paper min-h-screen py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Page Header */}
        <div className="max-w-3xl space-y-3">
          <div className="flex items-center gap-2 text-brass text-xs font-sans uppercase tracking-wider font-semibold">
            <Compass className="w-4 h-4" />
            <span>{t('mapPage.subtitle', 'Hệ Thống Tọa Độ & Bản Đồ Số')}</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-forest leading-tight">
            {t('mapPage.title', 'Bản Đồ Di Sản Kiến Trúc Việt Nam')}
          </h1>
          <p className="text-sm text-charcoal/80 font-normal leading-relaxed">
            {t('home.mapDesc', 'Khảo cứu tọa độ địa lý, niên đại lịch sử và cấu trúc kiến trúc của các biểu tượng văn hóa.')}
          </p>
        </div>

        {/* The Leaflet Map Component */}
        <section>
          <HeritageMap />
        </section>

      </div>
    </div>
  );
};

export default HeritageMapPage;
