import React, { useCallback, useEffect, useState } from 'react';
import { AlertCircle, Plus, Edit, CheckCircle, Circle, X, ExternalLink, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { adminApi } from '../../services/api';
import type { BlogPost, ContentStatus } from '../../types';
import { AdminImagePicker } from '../../components/admin/AdminImagePicker';
import { HeritageLoader } from '../../components/common/HeritageLoader';

const slugFromTitle = (value: string) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/đ/g, 'd').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const today = () => new Date().toISOString().slice(0, 10);

export const AdminBlogsPage: React.FC = () => {
  const isDemo = adminApi.isDemoSession();
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<Partial<BlogPost> | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    try { setBlogs(await adminApi.getBlogs()); setError(null); }
    catch (err) { setError(err instanceof Error ? err.message : 'Không tải được danh sách bài viết.'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { void loadData(); }, [loadData]);

  const handleOpenAdd = () => {
    setEditingBlog({ title: '', slug: '', excerpt: '', content: '', coverImage: '/3D/chua-mot-cot-poster.webp', author: '', category: '', readTime: '5 phút đọc', publishedAt: today(), status: 'draft' });
    setError(null);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBlog?.title?.trim()) return;
    setSaving(true); setError(null);
    try {
      const payload = { ...editingBlog, title: editingBlog.title.trim(), slug: editingBlog.slug?.trim() || slugFromTitle(editingBlog.title), publishedAt: editingBlog.publishedAt || today() };
      if (editingBlog.id) await adminApi.updateBlog(editingBlog.id, payload);
      else await adminApi.createBlog(payload);
      setIsModalOpen(false);
      await loadData();
    } catch (err) { setError(err instanceof Error ? err.message : 'Không lưu được bài viết.'); }
    finally { setSaving(false); }
  };

  const handleToggleStatus = async (blog: BlogPost) => {
    const status: ContentStatus = blog.status === 'published' ? 'draft' : 'published';
    setError(null);
    try { await adminApi.updateBlog(blog.id, { status }); await loadData(); }
    catch (err) { setError(err instanceof Error ? err.message : 'Không đổi được trạng thái bài viết.'); }
  };

  const handleDelete = async (blog: BlogPost) => {
    if (!window.confirm(`Xóa bài viết “${blog.title}”?`)) return;
    setDeletingId(blog.id);
    setError(null);
    try { await adminApi.deleteBlog(blog.id); await loadData(); }
    catch (err) { setError(err instanceof Error ? err.message : 'Không xóa được bài viết.'); }
    finally { setDeletingId(null); }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 border-b border-paper-border pb-4 sm:flex-row sm:items-center"><div><h1 className="mt-1 font-serif text-2xl font-bold text-forest sm:text-3xl">Quản lý Góc Văn Hóa</h1><p className="mt-1 text-xs font-sans text-charcoal-muted">Soạn, xuất bản và cập nhật bài viết di sản.</p></div>{!isDemo && <button onClick={handleOpenAdd} className="flex items-center gap-2 bg-forest px-4 py-2.5 font-sans text-xs font-bold uppercase tracking-wider text-paper hover:bg-brass transition-colors shadow-sm"><Plus className="h-4 w-4"/>Bài viết mới</button>}</div>
      {error && <div role="alert" className="flex items-start gap-2 border border-terracotta/40 bg-terracotta/10 p-3 text-sm text-terracotta font-sans"><AlertCircle className="mt-0.5 h-4 w-4 shrink-0"/>{error}</div>}
      <div><div className="overflow-x-auto border border-brass/30 bg-paper-card shadow-sm"><table className="w-full min-w-[780px] border-collapse text-left text-xs"><thead><tr className="border-b border-paper-border bg-paper-warm font-sans text-[11px] font-semibold uppercase tracking-wider text-charcoal-muted"><th className="p-4">Bài viết</th><th className="p-4">Chuyên mục</th><th className="p-4">Tác giả</th><th className="whitespace-nowrap p-4">Ngày đăng</th><th className="whitespace-nowrap p-4">Trạng thái</th><th className="whitespace-nowrap p-4 text-right">Thao tác</th></tr></thead>
          <tbody className="divide-y divide-paper-border font-sans">{loading ? <tr><td colSpan={6} className="p-8 text-center"><HeritageLoader variant="section" size="md" message="Đang tải danh sách bài viết di sản…" /></td></tr> : blogs.length === 0 ? <tr><td colSpan={6} className="p-8 text-center text-charcoal-muted font-sans text-xs">Chưa có bài viết nào.</td></tr> : blogs.map(blog => <tr key={blog.id} className="transition-colors hover:bg-paper-warm/50"><td className="max-w-sm p-4"><div className="line-clamp-1 font-serif text-sm font-bold text-forest">{blog.title}</div><div className="line-clamp-1 text-[11px] font-sans text-charcoal-muted">{blog.excerpt}</div></td><td className="p-4 font-sans">{blog.category}</td><td className="p-4 font-sans">{blog.author}</td><td className="whitespace-nowrap p-4 font-sans text-charcoal-muted">{blog.publishedAt}</td><td className="whitespace-nowrap p-4">{isDemo ? <span className={`inline-flex items-center gap-1 border px-2 py-1 text-[10px] font-bold uppercase font-sans ${blog.status === 'published' ? 'border-forest/20 bg-forest/10 text-forest' : 'border-charcoal/20 bg-charcoal/5 text-charcoal-muted'}`}>{blog.status === 'published' ? 'Đã xuất bản' : 'Bản nháp'}</span> : <button onClick={() => void handleToggleStatus(blog)} className={`inline-flex items-center gap-1 border px-2 py-1 text-[10px] font-bold uppercase font-sans ${blog.status === 'published' ? 'border-forest/20 bg-forest/10 text-forest' : 'border-charcoal/20 bg-charcoal/5 text-charcoal-muted'}`} title="Nhấn để đổi trạng thái">{blog.status === 'published' ? <><CheckCircle className="h-3 w-3"/>Đã xuất bản</> : <><Circle className="h-3 w-3"/>Bản nháp</>}</button>}</td><td className="whitespace-nowrap p-4 text-right"><div className="flex items-center justify-end gap-2 font-sans">{!isDemo && <button onClick={() => { setEditingBlog({ ...blog }); setError(null); setIsModalOpen(true); }} className="border border-paper-border p-2 text-charcoal transition-colors hover:border-brass hover:bg-forest/10" title="Sửa bài viết"><Edit className="h-3.5 w-3.5"/></button>}<Link to={`/blogs/${blog.slug}`} target="_blank" rel="noreferrer" className="border border-paper-border p-2 text-charcoal transition-colors hover:border-forest hover:bg-forest/10" title="Xem bài viết công khai"><ExternalLink className="h-3.5 w-3.5"/></Link>{!isDemo && <button onClick={() => void handleDelete(blog)} disabled={deletingId !== null} className="border border-paper-border p-2 text-terracotta transition-colors hover:border-terracotta hover:bg-terracotta/10 disabled:cursor-not-allowed disabled:opacity-50" title="Xóa bài viết"><Trash2 className="h-3.5 w-3.5"/></button>}</div></td></tr>)}</tbody>
        </table></div>
      </div>

      {!isDemo && isModalOpen && editingBlog && <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-forest-dark/80 p-4"><div className="relative my-auto max-h-[92vh] w-full max-w-2xl overflow-y-auto border border-brass bg-paper p-6 shadow-2xl sm:p-8"><button onClick={() => setIsModalOpen(false)} className="absolute right-4 top-4 p-1 text-charcoal-muted hover:text-charcoal" aria-label="Đóng"><X className="h-5 w-5"/></button><h2 className="mb-5 pr-8 font-serif text-2xl font-bold text-forest">{editingBlog.id ? 'Sửa bài viết' : 'Soạn bài viết mới'}</h2>
        <form onSubmit={handleSave} className="space-y-4 font-sans text-xs">
          <label className="block text-charcoal-muted font-semibold uppercase tracking-wider">Tiêu đề<input value={editingBlog.title || ''} onChange={e => setEditingBlog({ ...editingBlog, title: e.target.value, ...(editingBlog.id ? {} : { slug: slugFromTitle(e.target.value) }) })} className="mt-1 w-full border border-paper-border bg-paper-warm px-3 py-2 text-charcoal font-serif text-sm font-bold focus:border-brass focus:outline-none" required/></label>
          <label className="block text-charcoal-muted font-semibold uppercase tracking-wider">Đường dẫn (slug)<input value={editingBlog.slug || ''} onChange={e => setEditingBlog({ ...editingBlog, slug: e.target.value })} className="mt-1 w-full border border-paper-border bg-paper-warm px-3 py-2 text-charcoal font-mono text-xs focus:border-brass focus:outline-none" required/></label>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2"><label className="block text-charcoal-muted font-semibold uppercase tracking-wider">Chuyên mục<input value={editingBlog.category || ''} onChange={e => setEditingBlog({ ...editingBlog, category: e.target.value })} className="mt-1 w-full border border-paper-border bg-paper-warm px-3 py-2 text-charcoal focus:border-brass focus:outline-none" required/></label><label className="block text-charcoal-muted font-semibold uppercase tracking-wider">Tác giả<input value={editingBlog.author || ''} onChange={e => setEditingBlog({ ...editingBlog, author: e.target.value })} className="mt-1 w-full border border-paper-border bg-paper-warm px-3 py-2 text-charcoal focus:border-brass focus:outline-none" required/></label></div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3"><label className="block text-charcoal-muted font-semibold uppercase tracking-wider sm:col-span-1">Thời gian đọc<input value={editingBlog.readTime || ''} onChange={e => setEditingBlog({ ...editingBlog, readTime: e.target.value })} className="mt-1 w-full border border-paper-border bg-paper-warm px-3 py-2 text-charcoal focus:border-brass focus:outline-none" required/></label><label className="block text-charcoal-muted font-semibold uppercase tracking-wider sm:col-span-1">Ngày đăng<input type="date" value={editingBlog.publishedAt || today()} onChange={e => setEditingBlog({ ...editingBlog, publishedAt: e.target.value })} className="mt-1 w-full border border-paper-border bg-paper-warm px-3 py-2 text-charcoal focus:border-brass focus:outline-none" required/></label><label className="block text-charcoal-muted font-semibold uppercase tracking-wider sm:col-span-1">Trạng thái<select value={editingBlog.status || 'draft'} onChange={e => setEditingBlog({ ...editingBlog, status: e.target.value as ContentStatus })} className="mt-1 w-full border border-paper-border bg-paper-warm px-3 py-2 text-charcoal focus:border-brass focus:outline-none"><option value="draft">Bản nháp</option><option value="published">Xuất bản</option><option value="hidden">Ẩn</option></select></label></div>
          <label className="block text-charcoal-muted font-semibold uppercase tracking-wider">Đoạn trích<textarea rows={2} value={editingBlog.excerpt || ''} onChange={e => setEditingBlog({ ...editingBlog, excerpt: e.target.value })} className="mt-1 w-full border border-paper-border bg-paper-warm px-3 py-2 text-charcoal leading-relaxed focus:border-brass focus:outline-none" required/></label>
          <label className="block text-charcoal-muted font-semibold uppercase tracking-wider">Nội dung<textarea rows={8} value={editingBlog.content || ''} onChange={e => setEditingBlog({ ...editingBlog, content: e.target.value })} className="mt-1 w-full border border-paper-border bg-paper-warm px-3 py-2 text-charcoal leading-relaxed focus:border-brass focus:outline-none" required/></label>
          <AdminImagePicker
            label="Ảnh bìa"
            value={editingBlog.coverImage || ''}
            onChange={url => setEditingBlog({ ...editingBlog, coverImage: url })}
            placeholder="Dán liên kết ảnh tại đây"
            required
          />
          {error && <div role="alert" className="text-terracotta">{error}</div>}
          <div className="flex justify-end gap-3 border-t border-paper-border pt-4"><button type="button" onClick={() => setIsModalOpen(false)} className="border border-paper-border px-4 py-2 uppercase font-sans text-xs text-charcoal hover:bg-paper-warm transition-colors font-medium">Hủy</button><button type="submit" disabled={saving} className="bg-forest px-6 py-2 font-bold uppercase font-sans text-xs tracking-wider text-paper hover:bg-brass transition-colors disabled:cursor-not-allowed disabled:opacity-50 shadow-sm">{saving ? 'Đang lưu…' : 'Lưu bài viết'}</button></div>
        </form>
      </div></div>}
    </div>
  );
};

export default AdminBlogsPage;
