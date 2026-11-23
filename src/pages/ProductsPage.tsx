import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, Box, MapPin, ArrowRight } from 'lucide-react';
import { publicApi } from '../services/api';
import type { Product, Collection } from '../types';
import { TiltCard } from '../components/effects/TiltCard';
import { resolveImageUrl, handleImageFallback } from '../utils/mediaResolver';
import { useLanguage } from '../contexts/LanguageContext';

export const ProductsPage: React.FC = () => {
  const { language, t, localizeProduct, localizeCollection } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [selectedCollectionId, setSelectedCollectionId] = useState<string>(searchParams.get('collection') || 'all');
  const [searchQuery, setSearchQuery] = useState<string>(searchParams.get('q') || '');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    publicApi.getCollections(language).then(setCollections);
  }, [language]);

  useEffect(() => {
    setLoading(true);
    publicApi.getProducts({
      collectionId: selectedCollectionId === 'all' ? undefined : selectedCollectionId,
      search: searchQuery.trim() || undefined
    }, language).then((data) => {
      setProducts(data);
      setLoading(false);
    });
  }, [selectedCollectionId, searchQuery, language]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchQuery(val);
    if (val) {
      searchParams.set('q', val);
    } else {
      searchParams.delete('q');
    }
    setSearchParams(searchParams);
  };

  const handleCollectionSelect = (id: string) => {
    setSelectedCollectionId(id);
    if (id !== 'all') {
      searchParams.set('collection', id);
    } else {
      searchParams.delete('collection');
    }
    setSearchParams(searchParams);
  };

  return (
    <div className="bg-paper min-h-screen py-8 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-12">
        {/* Header */}
        <div className="max-w-3xl space-y-3 sm:space-y-4">
          <div className="flex items-center gap-2 text-brass text-xs font-mono uppercase tracking-widest font-semibold">
            <Box className="w-4 h-4" />
            <span>{t('productsPage.eyebrow')}</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-forest leading-tight">
            {t('productsPage.title')}
          </h1>
          <p className="text-sm sm:text-base text-charcoal/80 font-normal leading-relaxed">
            {t('productsPage.subtitle')}
          </p>
        </div>

        {/* Filter and Search Bar with Touch Horizontal Scroll on Mobile */}
        <div className="flex flex-col lg:flex-row gap-3.5 justify-between items-stretch lg:items-center p-3.5 sm:p-4 bg-paper-warm border border-paper-border corner-frame shadow-sm">
          {/* Collection Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 -mx-1 px-1 select-none">
            <button
              onClick={() => handleCollectionSelect('all')}
              className={`whitespace-nowrap px-3 py-1.5 text-xs font-mono tracking-wider transition-colors border rounded-[2px] active:scale-95 shrink-0 ${
                selectedCollectionId === 'all'
                  ? 'bg-forest text-paper border-forest font-semibold shadow-xs'
                  : 'bg-paper text-charcoal border-paper-border hover:border-brass'
              }`}
            >
              {t('common.all', 'Tất Cả')} ({products.length})
            </button>
            {collections.map((rawCol) => {
              const col = localizeCollection(rawCol);
              return (
              <button
                key={col.id}
                onClick={() => handleCollectionSelect(col.id)}
                className={`whitespace-nowrap px-3 py-1.5 text-xs font-mono tracking-wider transition-colors border rounded-[2px] active:scale-95 shrink-0 ${
                  selectedCollectionId === col.id
                    ? 'bg-forest text-paper border-forest font-semibold shadow-xs'
                    : 'bg-paper text-charcoal border-paper-border hover:border-brass'
                }`}
              >
                {col.name}
              </button>
            );
          })}
          </div>

          {/* Search Input with Clear Button */}
          <div className="relative min-w-full sm:min-w-[280px]">
            <Search className="w-4 h-4 text-charcoal-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder={t('common.search', 'Tìm kiếm tác phẩm, di tích...')}
              className="w-full pl-9 pr-8 py-2 bg-paper border border-paper-border focus:border-brass text-xs font-sans focus:outline-none transition-colors rounded-[2px]"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  searchParams.delete('q');
                  setSearchParams(searchParams);
                }}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-charcoal-muted hover:text-forest p-1 text-xs"
                aria-label="Xóa tìm kiếm"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 py-4">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-paper-warm border border-paper-border corner-frame overflow-hidden p-0 space-y-4 shadow-sm">
                <div className="aspect-[16/10] heritage-shimmer" />
                <div className="p-4 sm:p-6 space-y-3">
                  <div className="h-4 w-24 heritage-shimmer" />
                  <div className="h-6 w-3/4 heritage-shimmer" />
                  <div className="h-3 w-full heritage-shimmer" />
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="py-16 text-center space-y-3 bg-paper-warm border border-paper-border p-6 sm:p-8 rounded-[2px]">
            <p className="font-serif text-lg font-bold text-forest">{t('productsPage.notFoundTitle')}</p>
            <p className="text-xs text-charcoal-muted">{t('productsPage.notFoundDesc')}</p>
            <button
              onClick={() => {
                setSelectedCollectionId('all');
                setSearchQuery('');
              }}
              className="px-4 py-2 bg-forest text-paper text-xs font-mono uppercase tracking-wider rounded-[2px]"
            >
              {t('productsPage.viewAllBtn')}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {products.map((rawProduct) => {
              const product = localizeProduct(rawProduct);
              return (
              <TiltCard key={product.id} className="h-full">
                <div
                  className="h-full bg-paper-warm border border-paper-border hover:border-brass transition-all corner-frame overflow-hidden flex flex-col justify-between group shadow-sm hover:shadow-xl rounded-[2px]"
                >
                  <div>
                    <div className={`aspect-[16/10] overflow-hidden relative ${
                      product.heroImage?.includes('laugac') || product.slug?.includes('lau-gac')
                        ? 'bg-white'
                        : 'bg-forest'
                    }`}>
                      <img
                        src={resolveImageUrl(product.heroImage)}
                        alt={product.name}
                        onError={(e) => handleImageFallback(e)}
                        className={`w-full h-full transition-transform duration-500 ${
                          product.heroImage?.includes('laugac') || product.slug?.includes('lau-gac')
                            ? 'object-contain p-2 group-hover:scale-105'
                            : 'object-cover brightness-110 group-hover:scale-[1.025]'
                        }`}
                      />
                      {product.isHeroRelease ? (
                        <div className="absolute top-2.5 right-2.5 bg-brass text-forest px-2.5 py-1 text-[10.5px] font-sans uppercase font-bold shadow-sm rounded-[1px]">
                          <span>✦ Hero Release</span>
                        </div>
                      ) : (
                        <div className="absolute top-2.5 right-2.5 bg-forest/85 text-paper/90 px-2 py-0.5 text-[10px] font-sans uppercase rounded-[1px] border border-brass/30">
                          {t('productsPage.archivalResearch')}
                        </div>
                      )}
                    </div>

                    <div className="p-4 sm:p-6 space-y-2.5 sm:space-y-3">
                      <div className="flex items-center gap-2 text-xs font-mono text-charcoal-muted">
                        <MapPin className="w-3.5 h-3.5 text-brass shrink-0" />
                        <span className="truncate">{product.location}</span>
                        <span>•</span>
                        <span className="shrink-0">{product.epoch}</span>
                      </div>

                      <h2 className="font-serif text-xl sm:text-2xl font-bold text-forest group-hover:text-brass transition-colors leading-snug">
                        {product.name}
                      </h2>
                      <p className="text-xs sm:text-sm font-serif italic text-brass-dark">
                        {product.subName}
                      </p>

                      <p className="text-xs sm:text-sm text-charcoal/80 font-normal line-clamp-2 sm:line-clamp-3 leading-relaxed">
                        {product.shortDescription}
                      </p>

                      {/* Quick Specs */}
                      <div className="pt-2 grid grid-cols-2 gap-2 text-[11px] sm:text-xs font-mono text-charcoal-muted border-t border-paper-border/60">
                        <div>
                          <span>{t('product.specScale', 'Tỷ lệ')}:</span>{' '}
                          <span className="text-forest font-semibold">{product.modelSpecs.scale}</span>
                        </div>
                        <div>
                          <span>{t('product.specParts', 'Cấu kiện')}:</span>{' '}
                          <span className="text-brass font-bold">{product.modelSpecs.partsCount}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 sm:p-6 pt-0 border-t border-paper-border mt-3 sm:mt-4">
                    <div className="pt-3 sm:pt-4 flex items-center justify-between">
                      <span className="text-xs font-mono text-charcoal-muted">
                        {t('product.height', 'Cao')} {product.modelSpecs.heightCm}cm
                      </span>

                      <Link
                        to={`/products/${product.slug}`}
                        className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-forest font-bold group-hover:text-brass transition-colors active:scale-95"
                      >
                        <span>{t('common.learnMore', 'Khám phá chi tiết')}</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform text-brass" />
                      </Link>
                    </div>
                  </div>
                </div>
              </TiltCard>
            );
          })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsPage;
