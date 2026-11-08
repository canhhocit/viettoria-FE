import React, { useCallback, useEffect, useState } from 'react';
import { AlertCircle, Layers, Plus, Edit, Trash2, X } from 'lucide-react';
import { adminApi } from '../../services/api';
import type { Collection } from '../../types';
import { resolveImageUrl, handleImageFallback } from '../../utils/mediaResolver';
import { AdminImagePicker } from '../../components/admin/AdminImagePicker';
import { HeritageLoader } from '../../components/common/HeritageLoader';

const slugFromName = (value: string) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/đ/g, 'd').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

export const AdminCollectionsPage: React.FC = () => {
  const isDemo = adminApi.isDemoSession();
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCol, setEditingCol] = useState<Partial<Collection> | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      setCollections(await adminApi.getCollections());
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không tải được danh sách bộ sưu tập.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void loadData(); }, [loadData]);

  const handleOpenAdd = () => {
    setEditingCol({ code: `COL-${String(collections.length + 1).padStart(3, '0')}`, name: '', slug: '', description: '', heroImage: '/3D/chua-mot-cot-poster.webp', displayOrder: collections.length + 1, status: 'published' });
    setError(null);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCol?.name?.trim()) return;
    setSaving(true);
    setError(null);
    try {
      const payload = { ...editingCol, name: editingCol.name.trim(), slug: editingCol.slug?.trim() || slugFromName(editingCol.name), description: editingCol.description?.trim(), heroImage: editingCol.heroImage?.trim(), displayOrder: Number(editingCol.displayOrder) || 1 };
      if (editingCol.id) await adminApi.updateCollection(editingCol.id, payload);
      else await adminApi.createCollection(payload);
      setIsModalOpen(false);
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không lưu được bộ sưu tập.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (collection: Collection) => {
    if (!window.confirm(`Xóa bộ sưu tập “${collection.name}”?`)) return;
    setDeletingId(collection.id);
    setError(null);
    try {
      await adminApi.deleteCollection(collection.id);
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không xóa được bộ sưu tập.');
    } finally { setDeletingId(null); }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 border-b border-paper-border pb-4 sm:flex-row sm:items-center">
        <div><div className="flex items-center gap-2 text-brass text-xs font-mono uppercase tracking-widest"><Layers className="h-4 w-4"/><span>Phân loại niên đại & thời kỳ</span></div><h1 className="mt-1 font-serif text-2xl font-bold text-forest sm:text-3xl">Quản lý bộ sưu tập</h1></div>
        {!isDemo && <button onClick={handleOpenAdd} className="flex items-center gap-2 bg-forest px-4 py-2.5 font-mono text-xs font-bold uppercase tracking-wider text-paper transition-colors hover:bg-brass"><Plus className="h-4 w-4"/>Thêm bộ sưu tập</button>}
      </div>

      {error && <div role="alert" className="flex items-start gap-2 border border-terracotta/40 bg-terracotta/10 p-3 text-sm text-terracotta"><AlertCircle className="mt-0.5 h-4 w-4 shrink-0"/>{error}</div>}
      {loading ? <HeritageLoader variant="section" size="md" message="Đang tải danh sách bộ sưu tập di sản…" /> : collections.length === 0 ? <div className="border border-paper-border bg-paper p-10 text-center text-sm text-charcoal-muted">Chưa có bộ sưu tập nào.</div> : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {collections.map((col) => <article key={col.id} className="flex flex-col justify-between space-y-4 border border-paper-border bg-paper p-5 shadow-sm">
            <div className="space-y-3">
              <div className="relative aspect-[16/10] overflow-hidden border border-paper-border bg-paper-warm"><img src={resolveImageUrl(col.heroImage)} alt={col.name} onError={(e) => handleImageFallback(e)} className="h-full w-full object-contain"/><span className="absolute left-2 top-2 border border-brass/40 bg-forest/90 px-2 py-1 font-mono text-[10px] text-brass">{col.code}</span></div>
              <div className="flex items-start justify-between gap-3"><h2 className="font-serif text-lg font-bold text-forest">{col.name}</h2><span className={`shrink-0 border px-2 py-1 text-[10px] uppercase ${col.status === 'published' ? 'border-forest/30 bg-forest/10 text-forest' : 'border-charcoal/20 bg-charcoal/5 text-charcoal-muted'}`}>{col.status === 'published' ? 'Đã xuất bản' : col.status === 'hidden' ? 'Đang ẩn' : 'Bản nháp'}</span></div>
              <p className="line-clamp-3 text-xs leading-relaxed text-charcoal/80">{col.description}</p>
            </div>
            <div className="flex items-center justify-between border-t border-paper-border pt-3 font-mono text-xs"><span className="text-charcoal-muted">Thứ tự: {col.displayOrder}</span>{!isDemo && <div className="flex gap-2"><button onClick={() => { setEditingCol({ ...col }); setError(null); setIsModalOpen(true); }} className="flex items-center gap-1 border border-paper-border px-2.5 py-1.5 text-charcoal hover:border-brass" aria-label={`Sửa ${col.name}`}><Edit className="h-3 w-3 text-brass"/>Sửa</button><button onClick={() => void handleDelete(col)} disabled={deletingId !== null} className="border border-paper-border p-2 text-terracotta transition-colors hover:border-terracotta hover:bg-terracotta/10 disabled:cursor-not-allowed disabled:opacity-50" aria-label={`Xóa ${col.name}`}><Trash2 className="h-3.5 w-3.5"/></button></div>}</div>
          </article>)}
        </div>
      )}

      {!isDemo && isModalOpen && editingCol && <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-forest-dark/80 p-4">
        <div className="relative my-auto max-h-[92vh] w-full max-w-lg overflow-y-auto border border-brass bg-paper p-6 shadow-2xl sm:p-8">
          <button onClick={() => setIsModalOpen(false)} className="absolute right-4 top-4 p-1 text-charcoal-muted hover:text-charcoal" aria-label="Đóng"><X className="h-5 w-5"/></button>
          <h2 className="mb-5 pr-8 font-serif text-2xl font-bold text-forest">{editingCol.id ? 'Sửa bộ sưu tập' : 'Thêm bộ sưu tập'}</h2>
          <form onSubmit={handleSave} className="space-y-4 font-mono text-xs">
            <label className="block text-charcoal-muted">Mã bộ sưu tập<input value={editingCol.code || ''} onChange={e => setEditingCol({ ...editingCol, code: e.target.value })} className="mt-1 w-full border border-paper-border bg-paper-warm px-3 py-2 text-charcoal" required/></label>
            <label className="block text-charcoal-muted">Tên bộ sưu tập<input value={editingCol.name || ''} onChange={e => setEditingCol({ ...editingCol, name: e.target.value, ...(editingCol.id ? {} : { slug: slugFromName(e.target.value) }) })} className="mt-1 w-full border border-paper-border bg-paper-warm px-3 py-2 text-charcoal" required/></label>
            <label className="block text-charcoal-muted">Đường dẫn (slug)<input value={editingCol.slug || ''} onChange={e => setEditingCol({ ...editingCol, slug: e.target.value })} className="mt-1 w-full border border-paper-border bg-paper-warm px-3 py-2 text-charcoal" required/></label>
            <label className="block text-charcoal-muted">Mô tả<textarea rows={3} value={editingCol.description || ''} onChange={e => setEditingCol({ ...editingCol, description: e.target.value })} className="mt-1 w-full border border-paper-border bg-paper-warm px-3 py-2 text-charcoal" required/></label>
            <AdminImagePicker
              label="Ảnh bìa"
              value={editingCol.heroImage || ''}
              onChange={url => setEditingCol({ ...editingCol, heroImage: url })}
              placeholder="Dán liên kết ảnh tại đây"
              required
            />
            <div className="grid grid-cols-2 gap-3"><label className="block text-charcoal-muted">Thứ tự<input type="number" min="1" value={editingCol.displayOrder || 1} onChange={e => setEditingCol({ ...editingCol, displayOrder: Number(e.target.value) })} className="mt-1 w-full border border-paper-border bg-paper-warm px-3 py-2 text-charcoal"/></label><label className="block text-charcoal-muted">Trạng thái<select value={editingCol.status || 'published'} onChange={e => setEditingCol({ ...editingCol, status: e.target.value as Collection['status'] })} className="mt-1 w-full border border-paper-border bg-paper-warm px-3 py-2 text-charcoal"><option value="published">Xuất bản</option><option value="draft">Bản nháp</option><option value="hidden">Ẩn</option></select></label></div>
            {error && <div role="alert" className="text-terracotta">{error}</div>}
            <div className="flex justify-end gap-3 border-t border-paper-border pt-4"><button type="button" onClick={() => setIsModalOpen(false)} className="border border-paper-border px-4 py-2 uppercase text-charcoal hover:bg-paper-warm">Hủy</button><button type="submit" disabled={saving} className="bg-forest px-6 py-2 font-bold uppercase text-paper hover:bg-brass disabled:cursor-not-allowed disabled:opacity-50">{saving ? 'Đang lưu…' : 'Lưu bộ sưu tập'}</button></div>
          </form>
        </div>
      </div>}
    </div>
  );
};

export default AdminCollectionsPage;
