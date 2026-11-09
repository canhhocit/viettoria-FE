import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Box, 
  Layers, 
  FileText, 
  Plus, 
  BookOpen
} from 'lucide-react';
import { adminApi } from '../../services/api';
import type { DashboardStats, Product, BlogPost } from '../../types';
import { resolveImageUrl, handleImageFallback } from '../../utils/mediaResolver';
import { HeritageLoader } from '../../components/common/HeritageLoader';

export const AdminDashboardPage: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentProducts, setRecentProducts] = useState<Product[]>([]);
  const [recentBlogs, setRecentBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    adminApi.getDashboard().then((data) => {
      setStats(data.stats);
      setRecentProducts(data.recentProducts);
      setRecentBlogs(data.recentBlogs);
    }).catch((err: unknown) => {
      setError(err instanceof Error ? err.message : 'Không tải được dữ liệu điều hành.');
    }).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <HeritageLoader
        variant="section"
        size="lg"
        message="Đang tải dữ liệu điều hành CMS Viettoria..."
        submessage="Trung tâm giám sát & quản trị di sản kiến trúc"
      />
    );
  }

  return (
    <div className="space-y-8">
      {error && <div role="alert" className="border border-terracotta/40 bg-terracotta/10 p-3 text-sm text-terracotta">{error}</div>}
      {/* Top Banner */}
      <div className="bg-forest text-paper px-6 py-4 border border-brass corner-frame flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-md">
        <div className="space-y-2">
          
          <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-wide text-paper leading-snug">
            Bảng Điều Hành Trung Tâm
          </h1>
          
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            to="/admin/products"
            className="px-4 py-2.5 bg-brass text-forest hover:bg-brass-light transition-colors font-sans text-xs uppercase tracking-wider font-bold flex items-center gap-2 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Quản Lý Sản Phẩm</span>
          </Link>
          <Link
            to="/admin/blogs"
            className="px-4 py-2.5 border border-paper/30 text-paper hover:border-brass hover:text-brass transition-colors font-sans text-xs uppercase tracking-wider flex items-center gap-2 font-medium"
          >
            <Plus className="w-4 h-4" />
            <span>Viết Bài Mới</span>
          </Link>
        </div>
      </div>

      {/* Stats Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-paper p-6 border border-paper-border corner-frame space-y-2">
          <div className="flex items-center justify-between text-charcoal-muted">
            <span className="text-xs font-cinzel uppercase tracking-wider font-bold">Mô Hình 3D</span>
            <Box className="w-4 h-4 text-brass" />
          </div>
          <p className="font-serif text-3xl font-bold text-forest">
            {stats?.totalProducts || 0}
          </p>
          <p className="text-xs font-sans text-charcoal-muted">
            <span className="text-forest font-semibold">{stats?.publishedProducts || 0}</span> tác phẩm đã phát hành
          </p>
        </div>

        <div className="bg-paper p-6 border border-paper-border corner-frame space-y-2">
          <div className="flex items-center justify-between text-charcoal-muted">
            <span className="text-xs font-cinzel uppercase tracking-wider font-bold">Bộ Sưu Tập</span>
            <Layers className="w-4 h-4 text-brass" />
          </div>
          <p className="font-serif text-3xl font-bold text-forest">
            {stats?.totalCollections || 0}
          </p>
          <p className="text-xs font-sans text-charcoal-muted">
            Theo các thời kỳ lịch sử
          </p>
        </div>

        <div className="bg-paper p-6 border border-paper-border corner-frame space-y-2">
          <div className="flex items-center justify-between text-charcoal-muted">
            <span className="text-xs font-cinzel uppercase tracking-wider font-bold">Story Blocks</span>
            <BookOpen className="w-4 h-4 text-brass" />
          </div>
          <p className="font-serif text-3xl font-bold text-forest">
            {stats?.totalStoryBlocks || 0}
          </p>
          <p className="text-xs font-sans text-charcoal-muted">
            Khối câu chuyện số hóa
          </p>
        </div>

        <div className="bg-paper p-6 border border-paper-border corner-frame space-y-2">
          <div className="flex items-center justify-between text-charcoal-muted">
            <span className="text-xs font-cinzel uppercase tracking-wider font-bold">Bài Viết Khảo Cứu</span>
            <FileText className="w-4 h-4 text-brass" />
          </div>
          <p className="font-serif text-3xl font-bold text-forest">
            {stats?.totalBlogs || 0}
          </p>
          <p className="text-xs font-sans text-charcoal-muted">
            Góc nhìn di sản
          </p>
        </div>
      </div>

      {/* Recent Products with Story Builder shortcut */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 bg-paper border border-paper-border corner-frame p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-paper-border">
            <h2 className="font-serif text-lg font-bold text-forest">
              Mô Hình & Khối Câu Chuyện 
            </h2>
            <Link to="/admin/products" className="text-xs font-sans text-brass hover:underline font-semibold">
              Xem tất cả →
            </Link>
          </div>

          <div className="divide-y divide-paper-border font-sans">
            {recentProducts.map((p) => (
              <div key={p.id} className="py-3.5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img
                    src={resolveImageUrl(p.heroImage)}
                    alt={p.name}
                    onError={(e) => handleImageFallback(e)}
                    className="w-12 h-10 object-cover border border-paper-border bg-forest"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-serif font-bold text-forest text-sm">{p.name}</span>
                      <span className="text-[10px] font-cinzel font-bold bg-paper-warm px-1.5 py-0.5 border border-paper-border text-forest">
                        {p.code}
                      </span>
                    </div>
                    <span className="text-xs text-charcoal-muted font-normal">{p.location} • Tỷ lệ {p.modelSpecs.scale}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    to={`/admin/products/${p.id}/stories`}
                    className="px-2.5 py-1.5 bg-forest text-paper hover:bg-brass transition-colors font-sans text-xs uppercase tracking-wider font-semibold"
                  >
                    Biên Tập Stories
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Blogs */}
        <div className="lg:col-span-5 bg-paper border border-paper-border corner-frame p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-paper-border">
            <h2 className="font-serif text-lg font-bold text-forest">
              Bài Viết Mới Nhất
            </h2>
            <Link to="/admin/blogs" className="text-xs font-sans text-brass hover:underline font-semibold">
              Quản lý →
            </Link>
          </div>

          <div className="divide-y divide-paper-border font-sans">
            {recentBlogs.map((b) => (
              <div key={b.id} className="py-3 space-y-1">
                <div className="flex items-center justify-between text-xs text-charcoal-muted">
                  <span className="text-brass font-semibold">{b.category}</span>
                  <span>{b.publishedAt}</span>
                </div>
                <h3 className="font-serif text-sm font-semibold text-forest hover:text-brass transition-colors">
                  <Link to={`/blogs/${b.slug}`} target="_blank">
                    {b.title}
                  </Link>
                </h3>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
