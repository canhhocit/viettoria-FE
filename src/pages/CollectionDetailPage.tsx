import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, MapPin } from 'lucide-react';
import { publicApi } from '../services/api';
import type { Collection, Product } from '../types';
import { PageLoadingHeritage } from '../components/common/HeritageSkeleton';
import { resolveImageUrl, handleImageFallback } from '../utils/mediaResolver';
import { useLanguage } from '../contexts/LanguageContext';

export const CollectionDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { t, localizeCollection, localizeProduct } = useLanguage();
  const [collection, setCollection] = useState<(Collection & { products: Product[] }) | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      publicApi.getCollectionBySlug(slug).then((data) => {
        setCollection(data);
        setLoading(false);
      });
    }
  }, [slug]);

  if (loading) {
    return <PageLoadingHeritage message={t('common.loading', 'Đang tải chi tiết bộ sưu tập kiến trúc...')} />;
  }

  if (!collection) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-paper text-center px-4">
        <h2 className="font-serif text-2xl font-bold text-forest mb-2">{t('collectionsPage.notFoundTitle', 'Không tìm thấy bộ sưu tập')}</h2>
        <p className="text-sm text-charcoal-muted mb-6">{t('collectionsPage.notFoundDesc', 'Bộ sưu tập bạn tìm kiếm không tồn tại hoặc đã được chuyển dời.')}</p>
        <Link to="/collections" className="px-5 py-2.5 bg-forest text-paper font-mono text-xs uppercase tracking-wider">
          {t('common.back', 'Quay lại danh mục bộ sưu tập')}
        </Link>
      </div>
    );
  }

  const currentCollection = localizeCollection(collection);
  const currentProducts = (collection.products || []).map((p) => localizeProduct(p));

  return (
    <div className="bg-paper min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Back Link */}
        <Link
          to="/collections"
          className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-charcoal-muted hover:text-forest transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t('collectionsPage.allCollections', 'Tất cả bộ sưu tập')}</span>
        </Link>

        {/* Collection Banner */}
        <div className="bg-forest text-paper border border-brass corner-frame p-8 sm:p-12 relative overflow-hidden shadow-xl">
          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-brass text-forest text-xs font-serif uppercase tracking-widest font-bold">
                {t('collectionsPage.collectionTag', 'Tuyển Tập Di Sản')}
              </span>
              <span className="text-xs text-brass-subtle uppercase tracking-widest">
                {t('collectionsPage.historicEra', 'Thời kỳ lịch sử')}
              </span>
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-wide">
              {currentCollection.name}
            </h1>

            <p className="text-sm sm:text-base text-paper/85 font-normal leading-relaxed">
              {currentCollection.description}
            </p>
          </div>
        </div>

        {/* Products in this collection */}
        <div className="space-y-6">
          <div className="border-b border-paper-border pb-4 flex items-center justify-between">
            <h2 className="font-serif text-2xl font-bold text-forest">
              {t('collectionsPage.worksInCollection', 'Các Tác Phẩm Trong Bộ Sưu Tập')} ({currentProducts.length})
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {currentProducts.map((product) => (
              <div
                key={product.id}
                className="bg-paper-card border border-brass/25 hover:border-brass transition-all corner-frame overflow-hidden flex flex-col justify-between group shadow-sm hover:shadow-md duration-300"
              >
                <div>
                  <div className="aspect-[16/10] overflow-hidden bg-forest relative">
                    <img
                      src={resolveImageUrl(product.heroImage)}
                      alt={product.name}
                      onError={(e) => handleImageFallback(e)}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 bg-forest/90 border border-brass/50 px-2.5 py-1 text-[11px] font-serif uppercase tracking-wider text-brass">
                      {product.epoch}
                    </div>
                    {product.isHeroRelease && (
                      <div className="absolute top-3 right-3 bg-brass text-forest px-2.5 py-1 text-[10px] font-mono uppercase font-bold">
                        Hero Release
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

                    <h3 className="mt-2.5 font-serif text-xl font-bold text-forest group-hover:text-brass transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-xs font-serif italic text-brass-dark">
                      {product.subName}
                    </p>

                    <p className="text-xs text-charcoal/80 font-normal line-clamp-3 leading-relaxed">
                      {product.shortDescription}
                    </p>
                  </div>
                </div>

                <div className="p-6 pt-0 border-t border-paper-border mt-4">
                  <div className="pt-4 flex items-center justify-between">
                    <span className="text-xs font-mono text-charcoal-muted">
                      {t('product.specScale', 'Tỷ lệ')} {product.modelSpecs.scale}
                    </span>

                    <Link
                      to={`/products/${product.slug}`}
                      className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-forest font-bold group-hover:text-brass transition-colors"
                    >
                      <span>{t('common.viewDetails', 'Xem chi tiết')}</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollectionDetailPage;
