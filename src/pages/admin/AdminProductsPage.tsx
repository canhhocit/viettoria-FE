import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Box, 
  Plus, 
  Edit, 
  Trash2, 
  CheckCircle, 
  XCircle, 
  ExternalLink,
  BookOpen,
  X,
  Upload,
  Loader2,
  Check,
} from 'lucide-react';
import { adminApi } from '../../services/api';
import type { Product, Collection } from '../../types';
import { resolveImageUrl, handleImageFallback } from '../../utils/mediaResolver';
import { AdminImagePicker } from '../../components/admin/AdminImagePicker';
import { HeritageLoader } from '../../components/common/HeritageLoader';

export const AdminProductsPage: React.FC = () => {
  const isDemo = adminApi.isDemoSession();
  const [products, setProducts] = useState<Product[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const modelFileInputRef = useRef<HTMLInputElement>(null);
  const [uploadingModel, setUploadingModel] = useState(false);
  const [modelUploadMessage, setModelUploadMessage] = useState<string | null>(null);
  const [editingModelLink, setEditingModelLink] = useState(false);
  const [modelLinkDraft, setModelLinkDraft] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      const [prods, cols] = await Promise.all([adminApi.getProducts(), adminApi.getCollections()]);
      setProducts(prods);
      setCollections(cols);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không tải được danh sách mô hình.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenAdd = () => {
    setEditingModelLink(false);
    setModelLinkDraft('');
    setModelUploadMessage(null);
    setEditingProduct({
      code: `VT-NEW-00${products.length + 1}`,
      name: '',
      subName: '',
      slug: '',
      collectionId: collections[0]?.id || 'col-ly',
      epoch: 'Thời Lý',
      location: 'Hà Nội',
      shortDescription: '',
      heroImage: '/3D/chua-mot-cot-poster.webp',
      galleryImages: [],
      displayOrder: products.length + 1,
      status: 'published',
      isHeroRelease: false,
      modelSpecs: {
        scale: '1:120',
        heightCm: 12,
        widthCm: 10,
        weightGrams: 400,
        material: 'BioPETG Khoáng Đá',
        partsCount: 20,
        finishing: 'Sơn then & thếp vàng thủ công'
      }
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (product: Product) => {
    setEditingProduct({ ...product });
    setEditingModelLink(false);
    setModelLinkDraft('');
    setModelUploadMessage(null);
    setIsModalOpen(true);
  };

  const handleModelFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file || !editingProduct) return;
    if (!file.name.toLowerCase().endsWith('.glb')) {
      setModelUploadMessage('Chọn tệp mô hình 3D hợp lệ.');
      return;
    }

    setUploadingModel(true);
    setModelUploadMessage(null);
    try {
      const name = file.name.replace(/\.glb$/i, '');
      const result = await adminApi.uploadMediaAsset(file, name, editingProduct.name || name);
      setEditingProduct(current => current ? { ...current, model3dUrl: result.item.url } : current);
      setModelLinkDraft('');
      setEditingModelLink(false);
      setModelUploadMessage('Đã tải mô hình lên.');
    } catch {
      setModelUploadMessage('Không thể tải mô hình lên. Vui lòng thử lại.');
    } finally {
      setUploadingModel(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct || !editingProduct.name) return;

    setSaving(true);
    setError(null);
    try {
      if (editingProduct.id) await adminApi.updateProduct(editingProduct.id, editingProduct);
      else await adminApi.createProduct(editingProduct);
      setIsModalOpen(false);
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không lưu được tác phẩm.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa tác phẩm này?')) {
      setDeletingId(id);
      setError(null);
      try { await adminApi.deleteProduct(id); await loadData(); }
      catch (err) { setError(err instanceof Error ? err.message : 'Không xóa được tác phẩm.'); }
      finally { setDeletingId(null); }
    }
  };

  const handleToggleStatus = async (p: Product) => {
    const newStatus = p.status === 'published' ? 'draft' : 'published';
    setError(null);
    try { await adminApi.updateProduct(p.id, { status: newStatus }); await loadData(); }
    catch (err) { setError(err instanceof Error ? err.message : 'Không đổi được trạng thái tác phẩm.'); }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-paper-border">
        <div>
          <div className="flex items-center gap-2 text-brass text-xs font-mono uppercase tracking-widest">
            <Box className="w-4 h-4" />
            <span>Quản Trị Tác Phẩm & Hồ Sơ Di Sản</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-forest mt-1">
            Danh Mục Mô Hình Kiến Trúc
          </h1>
        </div>

        {!isDemo && <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-forest text-paper hover:bg-brass transition-colors font-sans text-xs uppercase tracking-wider font-bold flex items-center gap-2 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm Mô Hình Mới</span>
        </button>}
      </div>

      {error && <div role="alert" className="border border-terracotta/40 bg-terracotta/10 p-3 text-sm text-terracotta font-sans">{error}</div>}

      {/* Table Card */}
      <div className="overflow-hidden border border-brass/30 bg-paper-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-paper-warm border-b border-paper-border text-charcoal-muted font-sans uppercase tracking-wider text-[11px] font-semibold">
                <th className="p-4">Tác Phẩm</th>
                <th className="whitespace-nowrap p-4">Mã SKU</th>
                <th className="p-4">Địa Điểm & Niên Đại</th>
                <th className="p-4">Tỷ Lệ / Mộng</th>
                <th className="whitespace-nowrap p-4">Trạng Thái</th>
                <th className="p-4 text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-paper-border font-sans">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center">
                    <HeritageLoader variant="section" size="md" message="Đang tải danh sách tác phẩm..." />
                  </td>
                </tr>
              ) : products.map((product) => (
                <tr key={product.id} className="hover:bg-paper-warm/50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={resolveImageUrl(product.heroImage)}
                        alt={product.name}
                        onError={(e) => handleImageFallback(e)}
                        className="h-12 w-12 shrink-0 border border-brass/20 object-cover"
                      />
                      <div>
                        <div className="font-serif font-bold text-forest text-sm">{product.name}</div>
                        <div className="text-[11px] font-sans text-charcoal-muted italic">{product.subName}</div>
                      </div>
                    </div>
                  </td>
                  <td className="whitespace-nowrap p-4">
                    <span className="bg-paper-warm px-2 py-1 border border-paper-border text-forest font-sans font-bold text-xs tracking-wider">
                      {product.code}
                    </span>
                    {product.isHeroRelease && (
                      <span className="block mt-1 text-[10px] text-brass uppercase font-sans font-bold tracking-wider">
                        Hero Release
                      </span>
                    )}
                  </td>
                  <td className="p-4">
                    <div className="font-medium text-forest">{product.location}</div>
                    <div className="text-charcoal-muted text-[11px]">{product.epoch}</div>
                  </td>
                  <td className="p-4">
                    <div className="font-mono text-xs font-semibold text-charcoal">{product.modelSpecs.scale}</div>
                    <div className="text-brass font-bold text-[11px]">{product.modelSpecs.partsCount} mộng</div>
                  </td>
                  <td className="p-4">
                    {isDemo ? <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] uppercase font-bold tracking-wider ${product.status === 'published' ? 'bg-forest/15 text-forest border border-forest/30' : 'bg-charcoal/10 text-charcoal-muted border border-charcoal/20'}`}>
                      {product.status === 'published' ? 'Đã xuất bản' : 'Bản nháp'}
                    </span> : <button
                      onClick={() => handleToggleStatus(product)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] uppercase font-bold tracking-wider ${
                        product.status === 'published'
                          ? 'bg-forest/15 text-forest border border-forest/30'
                          : 'bg-charcoal/10 text-charcoal-muted border border-charcoal/20'
                      }`}
                    >
                      {product.status === 'published' ? (
                        <>
                          <CheckCircle className="w-3 h-3 text-forest" />
                          <span>Xuất Bản</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3 h-3 text-charcoal-muted" />
                          <span>Bản Nháp</span>
                        </>
                      )}
                    </button>}
                  </td>
                  <td className="whitespace-nowrap p-4 text-right">
                    <div className="flex items-center justify-end gap-2 font-sans">
                      <Link
                        to={`/admin/products/${product.id}/stories`}
                        className="px-2.5 py-1.5 bg-forest text-paper hover:bg-brass transition-colors uppercase tracking-wider text-[11px] flex items-center gap-1 font-bold"
                        title="Biên tập các khối câu chuyện lịch sử"
                      >
                        <BookOpen className="w-3 h-3" />
                        <span>Stories</span>
                      </Link>

                      {!isDemo && <button
                        onClick={() => handleOpenEdit(product)}
                        className="p-2 border border-paper-border text-charcoal transition-colors hover:border-brass hover:bg-forest/10"
                        title="Chỉnh sửa thông số mô hình"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>}

                      <Link
                        to={`/products/${product.slug}`}
                        target="_blank"
                        className="p-2 border border-paper-border text-charcoal transition-colors hover:border-forest hover:bg-forest/10"
                        title="Xem trang công khai"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>

                      {!isDemo && <button
                        onClick={() => handleDelete(product.id)}
                        disabled={deletingId !== null}
                        className="p-2 border border-paper-border text-terracotta transition-colors hover:border-terracotta hover:bg-terracotta/10 disabled:cursor-not-allowed disabled:opacity-50"
                        title="Xóa mô hình"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit / Add Modal */}
      {!isDemo && isModalOpen && editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-forest-dark/80 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-paper border border-brass corner-frame p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-1 text-charcoal-muted hover:text-charcoal"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="font-serif text-2xl font-bold text-forest mb-6">
              {editingProduct.id ? 'Chỉnh Sửa Thông Tin Mô Hình' : 'Thêm Mô Hình Kiến Trúc Mới'}
            </h2>

            {error && <div role="alert" className="mb-4 border border-terracotta/40 bg-terracotta/10 p-3 text-sm text-terracotta">{error}</div>}

            <form onSubmit={handleSave} className="space-y-4 font-sans text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-charcoal-muted uppercase mb-1 font-semibold tracking-wider">Mã SKU Di Sản</label>
                  <input
                    type="text"
                    value={editingProduct.code || ''}
                    onChange={e => setEditingProduct({ ...editingProduct, code: e.target.value })}
                    className="w-full px-3 py-2 bg-paper-warm border border-paper-border font-sans font-bold text-xs tracking-wider text-forest focus:border-brass focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-charcoal-muted uppercase mb-1 font-semibold tracking-wider">Slug URL</label>
                  <input
                    type="text"
                    value={editingProduct.slug || ''}
                    onChange={e => setEditingProduct({ ...editingProduct, slug: e.target.value })}
                    placeholder="chua-mot-cot"
                    className="w-full px-3 py-2 bg-paper-warm border border-paper-border font-mono text-xs focus:border-brass focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-charcoal-muted uppercase mb-1 font-semibold tracking-wider">Tên Công Trình</label>
                  <input
                    type="text"
                    value={editingProduct.name || ''}
                    onChange={e => setEditingProduct({ ...editingProduct, name: e.target.value })}
                    className="w-full px-3 py-2 bg-paper-warm border border-paper-border font-serif text-sm font-bold text-forest focus:border-brass focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-charcoal-muted uppercase mb-1 font-semibold tracking-wider">Tên Chữ Hán / Tên Phụ</label>
                  <input
                    type="text"
                    value={editingProduct.subName || ''}
                    onChange={e => setEditingProduct({ ...editingProduct, subName: e.target.value })}
                    placeholder="Diên Hựu Tự — Liên Hoa Đài"
                    className="w-full px-3 py-2 bg-paper-warm border border-paper-border text-xs focus:border-brass focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-charcoal-muted uppercase mb-1 font-semibold tracking-wider">Địa Điểm</label>
                  <input
                    type="text"
                    value={editingProduct.location || ''}
                    onChange={e => setEditingProduct({ ...editingProduct, location: e.target.value })}
                    className="w-full px-3 py-2 bg-paper-warm border border-paper-border text-xs focus:border-brass focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-charcoal-muted uppercase mb-1 font-semibold tracking-wider">Niên Đại Lịch Sử</label>
                  <input
                    type="text"
                    value={editingProduct.epoch || ''}
                    onChange={e => setEditingProduct({ ...editingProduct, epoch: e.target.value })}
                    className="w-full px-3 py-2 bg-paper-warm border border-paper-border text-xs focus:border-brass focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-charcoal-muted uppercase mb-1 font-semibold tracking-wider">Bộ Sưu Tập</label>
                  <select
                    value={editingProduct.collectionId || ''}
                    onChange={e => setEditingProduct({ ...editingProduct, collectionId: e.target.value })}
                    className="w-full px-3 py-2 bg-paper-warm border border-paper-border text-xs focus:border-brass focus:outline-none"
                  >
                    {collections.map(col => (
                      <option key={col.id} value={col.id}>{col.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-charcoal-muted uppercase mb-1 font-semibold tracking-wider">Mô Tả Ngắn</label>
                <textarea
                  rows={3}
                  value={editingProduct.shortDescription || ''}
                  onChange={e => setEditingProduct({ ...editingProduct, shortDescription: e.target.value })}
                  className="w-full px-3 py-2 bg-paper-warm border border-paper-border focus:border-brass focus:outline-none font-sans text-xs leading-relaxed"
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-charcoal-muted uppercase mb-1 font-semibold tracking-wider">Tỷ Lệ Điêu Khắc</label>
                  <input
                    type="text"
                    value={editingProduct.modelSpecs?.scale || '1:120'}
                    onChange={e => setEditingProduct({
                      ...editingProduct,
                      modelSpecs: { ...editingProduct.modelSpecs!, scale: e.target.value }
                    })}
                    className="w-full px-3 py-2 bg-paper-warm border border-paper-border font-mono text-xs focus:border-brass focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-charcoal-muted uppercase mb-1 font-semibold tracking-wider">Số Khớp Mộng Gỗ</label>
                  <input
                    type="number"
                    value={editingProduct.modelSpecs?.partsCount || 20}
                    onChange={e => setEditingProduct({
                      ...editingProduct,
                      modelSpecs: { ...editingProduct.modelSpecs!, partsCount: parseInt(e.target.value, 10) || 0 }
                    })}
                    className="w-full px-3 py-2 bg-paper-warm border border-paper-border text-xs focus:border-brass focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-charcoal-muted uppercase mb-1 font-semibold tracking-wider">Vật Liệu Cốt Lõi</label>
                  <input
                    type="text"
                    value={editingProduct.modelSpecs?.material || 'BioPETG Khoáng Đá'}
                    onChange={e => setEditingProduct({
                      ...editingProduct,
                      modelSpecs: { ...editingProduct.modelSpecs!, material: e.target.value }
                    })}
                    className="w-full px-3 py-2 bg-paper-warm border border-paper-border text-xs focus:border-brass focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <AdminImagePicker
                  label="Ảnh bìa đại diện"
                  value={editingProduct.heroImage || ''}
                  onChange={url => setEditingProduct({ ...editingProduct, heroImage: url })}
                  placeholder="Dán liên kết ảnh tại đây"
                  required
                />
                <div>
                  <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                    <label htmlFor="product-model-link" className="block text-charcoal-muted uppercase">Mô hình 3D</label>
                    <button type="button" onClick={() => modelFileInputRef.current?.click()} disabled={uploadingModel} className="inline-flex items-center gap-1.5 border border-paper-border bg-paper-warm px-2.5 py-1.5 text-xs text-forest transition-colors hover:border-brass disabled:opacity-50">
                      {uploadingModel ? <Loader2 className="h-3.5 w-3.5 animate-spin text-brass" /> : <Upload className="h-3.5 w-3.5 text-brass" />}
                      Tải mô hình lên
                    </button>
                    <input ref={modelFileInputRef} type="file" accept=".glb,model/gltf-binary" onChange={event => void handleModelFileChange(event)} className="hidden" />
                  </div>
                  {editingProduct.model3dUrl && !editingModelLink ? (
                    <div className="flex min-h-10 items-center justify-between gap-3 border border-paper-border bg-paper-warm px-3 py-2 text-xs text-charcoal">
                      <span className="inline-flex items-center gap-2"><Check className="h-4 w-4 text-brass" />Đang sử dụng mô hình đã chọn</span>
                      <button type="button" onClick={() => { setModelLinkDraft(''); setEditingModelLink(true); }} className="shrink-0 text-brown underline-offset-2 hover:underline">Dán liên kết khác</button>
                    </div>
                  ) : (
                    <div className="relative">
                      <input
                        id="product-model-link"
                        type="text"
                        value={modelLinkDraft}
                        onChange={event => { setModelLinkDraft(event.target.value); setEditingModelLink(true); setEditingProduct({ ...editingProduct, model3dUrl: event.target.value }); }}
                        placeholder="Dán liên kết mô hình tại đây"
                        className="w-full border border-paper-border bg-paper-warm px-3 py-2 pr-9 text-sm focus:border-brass focus:outline-none"
                      />
                      {editingProduct.model3dUrl && <button type="button" onClick={() => { setEditingProduct({ ...editingProduct, model3dUrl: '' }); setModelLinkDraft(''); setEditingModelLink(false); }} className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-charcoal-muted hover:text-terracotta" title="Gỡ mô hình" aria-label="Gỡ mô hình"><X className="h-3.5 w-3.5" /></button>}
                    </div>
                  )}
                  {modelUploadMessage && <p role="status" className="mt-1.5 text-xs text-charcoal-muted">{modelUploadMessage}</p>}
                </div>
              </div>

              <div className="pt-4 border-t border-paper-border flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-paper-border text-charcoal uppercase tracking-wider hover:bg-paper-warm"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  disabled={saving || uploadingModel}
                  className="px-6 py-2 bg-forest text-paper hover:bg-brass uppercase tracking-wider font-bold shadow-md disabled:opacity-50"
                >
                  {saving ? 'Đang lưu…' : 'Lưu Thông Tin'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProductsPage;
