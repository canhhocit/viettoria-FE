import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, Box, MapPin, ArrowRight } from 'lucide-react';
import { publicApi } from '../services/api';
import type { Product, Collection } from '../types';
import { TiltCard } from '../components/effects/TiltCard';
import { resolveImageUrl, handleImageFallback } from '../utils/mediaResolver';
import { useLanguage } from '../contexts/LanguageContext';

export const ProductsPage: React.FC = () => {
  const { t } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [selectedCollectionId, setSelectedCollectionId] = useState<string>(searchParams.get('collection') || 'all');
  const [searchQuery, setSearchQuery] = useState<string>(searchParams.get('q') || '');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    publicApi.getCollections().then(setCollections);
  }, []);

  useEffect(() => {
    setLoading(true);
    publicApi.getProducts({
      collectionId: selectedCollectionId === 'all' ? undefined : selectedCollectionId,
      search: searchQuery.trim() || undefined
    }).then((data) => {
      setProducts(data);
      setLoading(false);
    });
  }, [selectedCollectionId, searchQuery]);

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
    <div className="bg-paper min-h-screen py-12 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="max-w-3xl space-y-4">
          <div className="flex items-center gap-2 text-brass text-xs font-mono uppercase tracking-widest">
            <Box className="w-4 h-4" />
            <span>Danh Mục Tác Phẩm Khảo Cứu & Mô Hình 3D</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-forest leading-tight">
            Tác Phẩm Di Sản Việt Nam
          </h1>
          <p className="text-base text-charcoal/80 font-normal leading-relaxed">
            Tuyển tập 5 công trình kiến trúc tiêu biểu của đất Việt được số hóa và phục chế dưới dạng mô hình 3D tinh xảo. Mỗi tác phẩm đi kèm tài liệu lịch sử và bản thuyết minh âm thanh độc quyền.
          </p>
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center p-4 bg-paper-warm border border-paper-border corner-frame">
          {/* Collection Filter Tabs */}
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => handleCollectionSelect('all')}
              className={`px-3 py-1.5 text-xs font-mono tracking-wider transition-colors border ${
                selectedCollectionId === 'all'
                  ? 'bg-forest text-paper border-forest font-semibold'
                  : 'bg-paper text-charcoal border-paper-border hover:border-brass'
              }`}
            >
              {t('common.all', 'Tất Cả')} ({products.length})
            </button>
            {collections.map((col) => (
              <button
                key={col.id}
                onClick={() => handleCollectionSelect(col.id)}
                className={`px-3 py-1.5 text-xs font-mono tracking-wider transition-colors border ${
                  selectedCollectionId === col.id
                    ? 'bg-forest text-paper border-forest font-semibold'
                    : 'bg-paper text-charcoal border-paper-border hover:border-brass'
                }`}
              >
                {col.name}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative min-w-[260px]">
            <Search className="w-4 h-4 text-charcoal-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder={t('common.search', 'Tìm kiếm tác phẩm kiến trúc, địa danh lịch sử...')}
              className="w-full pl-9 pr-4 py-2 bg-paper border border-paper-border focus:border-brass text-xs font-sans focus:outline-none transition-colors"
            />
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 py-4">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-paper-warm border border-paper-border corner-frame overflow-hidden p-0 space-y-4 shadow-sm">
                <div className="aspect-[16/10] heritage-shimmer" />
                <div className="p-6 space-y-3">
                  <div className="h-4 w-24 heritage-shimmer" />
                  <div className="h-6 w-3/4 heritage-shimmer" />
                  <div className="h-3 w-full heritage-shimmer" />
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="py-20 text-center space-y-3 bg-paper-warm border border-paper-border p-8">
            <p className="font-serif text-lg font-bold text-forest">Không tìm thấy tác phẩm phù hợp</p>
            <p className="text-xs text-charcoal-muted">Hãy thử tìm kiếm với từ khóa khác hoặc bỏ chọn bộ lọc.</p>
            <button
              onClick={() => {
                setSelectedCollectionId('all');
                setSearchQuery('');
              }}
              className="px-4 py-2 bg-forest text-paper text-xs font-mono uppercase tracking-wider"
            >
              Xem tất cả tác phẩm
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <TiltCard key={product.id} className="h-full">
                <div
                  className="h-full bg-paper-warm border border-paper-border hover:border-brass transition-all corner-frame overflow-hidden flex flex-col justify-between group shadow-sm hover:shadow-xl"
                >
                  <div>
                    <div className="aspect-[16/10] overflow-hidden bg-forest relative">
                      <img
                        src={resolveImageUrl(product.heroImage)}
                        alt={product.name}
                        onError={(e) => handleImageFallback(e)}
                        className="w-full h-full object-cover brightness-110 group-hover:scale-[1.025] transition-transform duration-500"
                      />
                      {product.isHeroRelease ? (
                          <div className="absolute top-3 right-3 bg-brass text-forest px-2.5 py-1 text-[11px] font-sans uppercase font-bold shadow-sm">
                          <span>Hero Release</span>
                        </div>
                      ) : (
                        <div className="absolute top-3 right-3 bg-forest/80 text-paper/80 px-2.5 py-1 text-[11px] font-sans uppercase">
                          Khảo Cứu Lưu Trữ
                        </div>
                      )}
                    </div>

                    <div className="p-6 space-y-3">
                      <div className="flex items-center gap-2 text-xs font-mono text-charcoal-muted">
                        <MapPin className="w-3.5 h-3.5 text-brass" />
                        <span>{product.location}</span>
                        <span>•</span>
                        <span>{product.epoch}</span>
                      </div>

                      <h2 className="font-serif text-2xl font-bold text-forest group-hover:text-brass transition-colors">
                        {product.name}
                      </h2>
                      <p className="text-sm font-serif italic text-brass-dark">
                        {product.subName}
                      </p>

                      <p className="text-sm text-charcoal/80 font-normal line-clamp-3 leading-6">
                        {product.shortDescription}
                      </p>

                      {/* Quick Specs */}
                      <div className="pt-2 grid grid-cols-2 gap-2 text-xs font-mono text-charcoal-muted">
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

                  <div className="p-6 pt-0 border-t border-paper-border mt-4">
                    <div className="pt-4 flex items-center justify-between">
                      <span className="text-xs font-mono text-charcoal-muted">
                        Cao {product.modelSpecs.heightCm}cm
                      </span>

                      <Link
                        to={`/products/${product.slug}`}
                        className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-forest font-bold group-hover:text-brass transition-colors"
                      >
                        <span>{t('common.learnMore', 'Khám phá chi tiết')}</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </div>
              </TiltCard>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsPage;
