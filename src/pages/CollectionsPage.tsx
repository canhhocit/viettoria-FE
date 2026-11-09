import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Layers, ArrowRight, Landmark, Clock, Award } from 'lucide-react';
import { publicApi } from '../services/api';
import type { Collection } from '../types';
import { PageLoadingHeritage } from '../components/common/HeritageSkeleton';
import { HeritageTimeline } from '../components/common/HeritageTimeline';
import { resolveImageUrl, handleImageFallback } from '../utils/mediaResolver';
import { useLanguage } from '../contexts/LanguageContext';

export const CollectionsPage: React.FC = () => {
  const { t, localizeCollection } = useLanguage();
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    publicApi.getCollections().then((data) => {
      setCollections(data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <PageLoadingHeritage message={t('collectionsPage.loading', 'Đang tải các bộ sưu tập di sản kiến trúc...')} />;
  }

  return (
    <div className="bg-paper min-h-screen py-10 sm:py-16 lg:py-20 space-y-16 lg:space-y-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 lg:space-y-20">
        
        {/* Curated Museum Editorial Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-end border-b border-paper-border pb-10 sm:pb-14">
          {/* Main Title & Manifesto */}
          <div className="lg:col-span-8 space-y-4">
            <div className="inline-flex items-center gap-2.5 text-brass text-xs font-cinzel uppercase tracking-[0.2em] font-bold">
              <Layers className="w-4 h-4 text-brass" />
              <span>{t('collectionsPage.eyebrow', 'Phân Loại Niên Đại & Kiến Trúc')}</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold text-forest leading-[1.2] tracking-tight">
              {t('collectionsPage.title', 'Các Tuyển Tập Di Sản')}
            </h1>

            <p className="text-base sm:text-lg text-charcoal/80 font-sans font-normal leading-relaxed max-w-2xl pt-1">
              {t(
                'collectionsPage.pageSubtitle',
                'Mỗi bộ sưu tập đại diện cho một thời kỳ hoàng kim của kiến trúc Việt Nam. Chúng tôi tái hiện từng cấu kiện với lòng thành kính và tiêu chuẩn kỹ thuật số bảo tàng học.'
              )}
            </p>
          </div>

          {/* Curatorial Seal & Archive Badge */}
          <div className="lg:col-span-4 bg-paper-card border border-brass/40 corner-frame p-5 sm:p-6 space-y-3 shadow-sm">
            <div className="flex items-center justify-between text-[11px] font-mono text-brass uppercase font-bold tracking-widest border-b border-paper-border pb-2">
              <span className="flex items-center gap-1.5">
                <Landmark className="w-3.5 h-3.5 text-brass" />
                <span>Viettoria Atelier</span>
              </span>
              <span className="text-charcoal-muted">VN-ARC-2026</span>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1 text-xs">
              <div className="space-y-0.5">
                <span className="text-[10px] font-mono uppercase text-charcoal-muted tracking-wider block">
                  Quy Mô Khảo Cứu
                </span>
                <span className="font-serif text-base font-bold text-forest">
                  5 Mốc Hoàng Kim
                </span>
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] font-mono uppercase text-charcoal-muted tracking-wider block">
                  Trục Niên Biểu
                </span>
                <span className="font-serif text-base font-bold text-forest">
                  1049 — 1863
                </span>
              </div>
            </div>

            <p className="text-[11px] font-sans text-charcoal/70 leading-normal pt-1 border-t border-paper-border flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-brass shrink-0" />
              <span>Tiêu chuẩn số hóa phục chế 3D độ chính xác cao</span>
            </p>
          </div>
        </div>

        {/* Chronological Heritage Timeline (1049 - 1863) */}
        <section aria-label="Biên niên sử di sản kiến trúc">
          <HeritageTimeline />
        </section>

        {/* Collections Grid Section */}
        <section className="space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-brass/30 pb-4">
            <div>
              <span className="text-[11px] font-sans text-brass uppercase tracking-[0.18em] font-bold block mb-1">
                {t('collectionsPage.subtitle', 'Tuyển tập theo triều đại và văn hóa')}
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-forest">
                {t('collectionsPage.gridTitle', 'Danh Mục Bộ Sưu Tập Theo Thời Kỳ')}
              </h2>
            </div>
            
            <span className="text-xs font-mono text-brass-dark uppercase font-bold tracking-wider px-3 py-1 bg-paper-card border border-brass/30 self-start sm:self-auto">
              {collections.length} {t('collectionsPage.worksCount', 'Tuyển Tập')}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
            {collections.map((rawCol) => {
              const col = localizeCollection(rawCol);
              return (
                <div
                  key={col.id}
                  className="h-full bg-paper-card border-2 border-brass/25 hover:border-brass transition-all duration-300 corner-frame overflow-hidden flex flex-col justify-between group shadow-sm hover:shadow-xl hover:-translate-y-1"
                >
                  <div>
                    {/* Hero Image Container */}
                    <div className="aspect-[16/10] overflow-hidden bg-forest-dark relative">
                      <img
                        src={resolveImageUrl(col.heroImage)}
                        alt={col.name}
                        onError={(e) => handleImageFallback(e)}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-forest-dark/70 via-transparent to-transparent pointer-events-none" />
                      
                      <div className="absolute top-3 left-3 bg-forest/90 border border-brass/50 px-3 py-1 text-[10px] font-sans uppercase tracking-widest text-brass font-bold backdrop-blur-sm">
                        {t('collectionsPage.collectionTag', 'Tuyển Tập Di Sản')}
                      </div>

                      {col.code && (
                        <div className="absolute top-3 right-3 bg-forest-dark/80 px-2 py-0.5 text-[10px] font-mono text-paper/70 border border-paper/20">
                          {col.code}
                        </div>
                      )}
                    </div>

                    {/* Card Content */}
                    <div className="p-6 sm:p-8 space-y-3">
                      <h3 className="font-serif text-2xl font-bold text-forest group-hover:text-brass-dark transition-colors duration-200 leading-snug">
                        {col.name}
                      </h3>
                      <p className="line-clamp-2 text-sm text-charcoal/85 font-sans font-normal leading-relaxed">
                        {col.description}
                      </p>
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="p-6 sm:p-8 pt-0 border-t border-paper-border mt-4">
                    <div className="pt-4 flex items-center justify-between">
                      <span className="text-xs font-mono text-charcoal-muted flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-brass" />
                        <span>{col.productsCount || 1} {t('collectionsPage.monumentResearch', 'Công trình nghiên cứu')}</span>
                      </span>

                      <Link
                        to={`/collections/${col.slug}`}
                        className="inline-flex items-center gap-2 text-xs font-sans uppercase tracking-wider text-forest font-bold group-hover:text-brass transition-colors"
                      >
                        <span>{t('home.exploreCollection', 'Khám phá')}</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-200" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
};

export default CollectionsPage;
