import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AlertCircle, Check, FileText, Headphones, Loader2, Mic, Save, Search, Trash2, Upload } from 'lucide-react';
import { adminApi } from '../../services/api';
import type { AudioGuideData, Product } from '../../types';
import { resolveAudioUrl } from '../../utils/mediaResolver';
import { HeritageLoader } from '../../components/common/HeritageLoader';

const emptyGuide = (productName: string): AudioGuideData => ({
  title: `Lời kể về ${productName}`,
  duration: '',
  audioUrl: '',
  narrator: 'Hướng dẫn viên Viettoria',
  transcript: '',
});

export const AdminAudioGuidesPage: React.FC = () => {
  const isDemo = adminApi.isDemoSession();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [guide, setGuide] = useState<AudioGuideData>(emptyGuide('công trình'));
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [editingAudioLink, setEditingAudioLink] = useState(false);
  const [audioLinkDraft, setAudioLinkDraft] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const selectedProduct = products.find((product) => product.id === selectedProductId) || null;
  const filteredProducts = useMemo(() => {
    const query = search.trim().toLocaleLowerCase('vi');
    if (!query) return products;
    return products.filter((product) =>
      `${product.name} ${product.code} ${product.location}`.toLocaleLowerCase('vi').includes(query),
    );
  }, [products, search]);

  useEffect(() => {
    adminApi.getProducts()
      .then((items) => {
        setProducts(items);
        const first = items[0];
        setSelectedProductId(first?.id || '');
        if (first) setGuide(first.audioGuide ? { ...first.audioGuide } : emptyGuide(first.name));
      })
      .catch((err: unknown) => setError(err instanceof Error ? err.message : 'Không tải được danh sách công trình.'))
      .finally(() => setLoading(false));
  }, []);

  const selectProduct = (product: Product) => {
    setSelectedProductId(product.id);
    setGuide(product.audioGuide ? { ...product.audioGuide } : emptyGuide(product.name));
    setEditingAudioLink(false);
    setAudioLinkDraft('');
    setSelectedFile(null);
    setError(null);
    setNotice(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const updateGuide = (field: keyof AudioGuideData, value: string) => {
    setGuide((current) => ({ ...current, [field]: value }));
    setNotice(null);
  };

  const selectAudio = (file?: File) => {
    if (!file) return;
    const extension = file.name.split('.').pop()?.toLowerCase();
    if (!['mp3', 'wav', 'm4a', 'ogg', 'flac'].includes(extension || '')) {
      setError('Chọn bản thu MP3, WAV, M4A, OGG hoặc FLAC.');
      setSelectedFile(null);
      return;
    }
    if (file.size > 100 * 1024 * 1024) {
      setError('Bản thu vượt quá giới hạn 100 MB.');
      setSelectedFile(null);
      return;
    }
    setSelectedFile(file);
    setError(null);
    setNotice(null);
  };

  const uploadAudio = async () => {
    if (!selectedFile || !selectedProduct) return;
    setUploading(true);
    setError(null);
    setNotice(null);
    try {
      const result = await adminApi.uploadMediaAsset(
        selectedFile,
        `${selectedProduct.name} — ${guide.title || 'Audio Guide'}`,
        `Bản thu hướng dẫn viên cho ${selectedProduct.name}`,
      );
      setGuide((current) => ({ ...current, audioUrl: result.item.url }));
      setEditingAudioLink(false);
      setAudioLinkDraft('');
      setNotice('Đã tải bản thu lên. Lưu hướng dẫn viên để gắn vào công trình.');
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không tải được bản thu lên.');
    } finally {
      setUploading(false);
    }
  };

  const saveGuide = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedProduct || isDemo) return;
    setSaving(true);
    setError(null);
    setNotice(null);
    try {
      const saved = await adminApi.updateProduct(selectedProduct.id, { displayOrder: selectedProduct.displayOrder, audioGuide: guide });
      setProducts((current) => current.map((product) => product.id === saved.id ? { ...product, ...saved } : product));
      setNotice('Hướng dẫn viên audio đã lưu cho công trình này.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không lưu được hướng dẫn viên audio.');
    } finally {
      setSaving(false);
    }
  };

  const removeGuide = async () => {
    if (!selectedProduct || isDemo) return;
    setSaving(true);
    setError(null);
    setNotice(null);
    try {
      const cleared: AudioGuideData = { title: '', duration: '', audioUrl: '', narrator: '', transcript: '' };
      const saved = await adminApi.updateProduct(selectedProduct.id, { displayOrder: selectedProduct.displayOrder, audioGuide: cleared });
      setProducts((current) => current.map((product) => product.id === saved.id ? { ...product, ...saved } : product));
      setGuide(emptyGuide(saved.name));
      setNotice('Đã gỡ hướng dẫn viên audio khỏi công trình.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không gỡ được hướng dẫn viên audio.');
    } finally {
      setSaving(false);
    }
  };

  const guideCount = products.filter((product) => Boolean(product.audioGuide?.audioUrl?.trim())).length;

  return (
    <div className="space-y-6">
      <header className="flex flex-col justify-between gap-4 border-b border-paper-border pb-4 sm:flex-row sm:items-end">
        <div>
          <div className="flex items-center gap-2 font-cinzel text-xs uppercase tracking-widest text-brass font-bold">
            <Headphones className="h-4 w-4" />
            <span>Giọng kể & tư liệu âm thanh</span>
          </div>
          <h1 className="mt-1 font-serif text-2xl font-bold text-forest sm:text-3xl">Hướng dẫn viên audio</h1>
          <p className="mt-1 text-xs text-charcoal-muted font-sans">Quản lý bản thu, người dẫn và lời thoại theo từng công trình.</p>
        </div>
        <div className="border border-paper-border bg-paper px-4 py-2 font-sans text-xs text-charcoal-muted">
          <span className="font-bold text-forest">{guideCount}</span> / {products.length} công trình có bản thu
        </div>
      </header>

      {error && <div role="alert" className="flex items-start gap-2 border border-terracotta/40 bg-terracotta/10 p-3 text-sm text-terracotta"><AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />{error}</div>}
      {notice && <div role="status" className="flex items-start gap-2 border border-brass/40 bg-paper-warm p-3 text-sm text-forest"><Check className="mt-0.5 h-4 w-4 shrink-0 text-brass" />{notice}</div>}

      {isDemo && <div className="border border-brass/35 bg-paper-warm px-4 py-3 text-xs leading-relaxed text-charcoal-muted">Chế độ xem thử: có thể xem các hướng dẫn viên và bản thu, thao tác upload, lưu hoặc gỡ đang khóa.</div>}

      <div className="grid items-start gap-5 xl:grid-cols-[310px_minmax(0,1fr)]">
        <aside className="border border-paper-border bg-paper">
          <div className="border-b border-paper-border p-4">
            <label className="relative block">
              <span className="sr-only">Tìm công trình</span>
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-charcoal-muted" />
              <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Tìm công trình..." className="w-full border border-paper-border bg-paper-warm py-2.5 pl-9 pr-3 text-sm focus:border-brass focus:outline-none" />
            </label>
          </div>
          <div className="max-h-[68vh] overflow-y-auto">
            {loading ? (
              <HeritageLoader
                variant="section"
                size="sm"
                message="Đang tải công trình..."
                className="py-8"
              />
            ) : filteredProducts.length === 0 ? (
              <p className="p-6 text-center text-sm text-charcoal-muted">Không tìm thấy công trình.</p>
            ) : filteredProducts.map((product) => {
              const hasAudio = Boolean(product.audioGuide?.audioUrl?.trim());
              const active = product.id === selectedProductId;
              return (
                <button key={product.id} type="button" onClick={() => selectProduct(product)} className={`w-full border-b border-paper-border p-4 text-left transition-colors ${active ? 'bg-forest text-paper' : 'bg-paper text-charcoal hover:bg-paper-warm'}`}>
                  <span className="flex items-start justify-between gap-3">
                    <span className="min-w-0">
                      <span className="block truncate font-serif text-base font-semibold">{product.name}</span>
                      <span className={`mt-1 block font-mono text-[10px] uppercase tracking-wider ${active ? 'text-paper/60' : 'text-charcoal-muted'}`}>{product.location} · {product.code}</span>
                    </span>
                    <span className={`mt-1 h-2 w-2 shrink-0 ${hasAudio ? 'bg-brass' : active ? 'bg-paper/35' : 'bg-paper-border'}`} aria-label={hasAudio ? 'Đã có bản thu' : 'Chưa có bản thu'} />
                  </span>
                  <span className={`mt-3 block truncate text-xs ${active ? 'text-paper/75' : 'text-charcoal-muted'}`}>
                    {hasAudio ? product.audioGuide?.title : 'Chưa có bản thu audio'}
                  </span>
                </button>
              );
            })}
          </div>
        </aside>

        {!selectedProduct ? (
          <section className="flex min-h-72 items-center justify-center border border-dashed border-paper-border bg-paper p-8 text-center text-sm text-charcoal-muted">
            {loading ? 'Đang nạp danh sách...' : 'Chọn một công trình để biên tập hướng dẫn viên audio.'}
          </section>
        ) : (
          <form onSubmit={(event) => void saveGuide(event)} className="space-y-5 border border-paper-border bg-paper p-4 sm:p-6">
            <div className="flex flex-col justify-between gap-3 border-b border-paper-border pb-4 sm:flex-row sm:items-start">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-brass">{selectedProduct.code} · {selectedProduct.location}</p>
                <h2 className="mt-1 font-serif text-xl font-bold text-forest">{selectedProduct.name}</h2>
              </div>
              <span className={`inline-flex w-fit items-center gap-2 border px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider ${guide.audioUrl?.trim() ? 'border-forest/25 bg-forest/5 text-forest' : 'border-paper-border text-charcoal-muted'}`}>
                <span className={`h-1.5 w-1.5 ${guide.audioUrl?.trim() ? 'bg-brass' : 'bg-paper-border'}`} />
                {guide.audioUrl?.trim() ? 'Bản thu riêng sẵn sàng' : 'Đang dùng audio mẫu'}
              </span>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="block font-mono text-[11px] uppercase tracking-wider text-charcoal-muted">
                Tên chương thuyết minh
                <input value={guide.title} onChange={(event) => updateGuide('title', event.target.value)} disabled={isDemo} maxLength={255} className="mt-1.5 w-full border border-paper-border bg-paper-warm px-3 py-2.5 font-sans text-sm normal-case text-charcoal focus:border-brass focus:outline-none disabled:opacity-60" placeholder="Ví dụ: Dấu ấn qua nghìn năm" />
              </label>
              <label className="block font-mono text-[11px] uppercase tracking-wider text-charcoal-muted">
                Hướng dẫn viên / người đọc
                <span className="relative mt-1.5 block">
                  <Mic className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brass" />
                  <input value={guide.narrator || ''} onChange={(event) => updateGuide('narrator', event.target.value)} disabled={isDemo} maxLength={128} className="w-full border border-paper-border bg-paper-warm py-2.5 pl-9 pr-3 font-sans text-sm normal-case text-charcoal focus:border-brass focus:outline-none disabled:opacity-60" placeholder="Tên người dẫn chuyện" />
                </span>
              </label>
            </div>

            <div className="grid gap-4 lg:grid-cols-[1fr_190px]">
              <div className="border border-paper-border bg-paper-warm p-4">
                <div className="flex items-start gap-3">
                  <div className="border border-brass/35 bg-paper p-2 text-brass"><Headphones className="h-4 w-4" /></div>
                  <div>
                    <h3 className="font-serif text-sm font-bold text-forest">Bản thu âm thanh</h3>
                    <p className="mt-1 text-xs leading-relaxed text-charcoal-muted">Tải bản thu lên hoặc dán liên kết âm thanh.</p>
                  </div>
                </div>
                <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end">
                  <label className="block flex-1 font-mono text-[10px] uppercase tracking-wider text-charcoal-muted">
                    Chọn tệp audio · tối đa 100 MB
                    <input ref={fileInputRef} type="file" accept="audio/mpeg,audio/wav,audio/mp4,audio/ogg,audio/flac,.mp3,.wav,.m4a,.ogg,.flac" disabled={isDemo || uploading} onChange={(event) => selectAudio(event.target.files?.[0])} className="mt-1.5 block w-full text-xs normal-case file:mr-2 file:border file:border-paper-border file:bg-paper file:px-2.5 file:py-2 file:font-mono file:text-[10px] file:uppercase file:text-charcoal" />
                  </label>
                  <button type="button" onClick={() => void uploadAudio()} disabled={!selectedFile || uploading || isDemo} className="inline-flex h-10 items-center justify-center gap-2 border border-forest bg-forest px-4 font-mono text-[10px] uppercase tracking-wider text-paper transition-colors hover:bg-brass hover:text-forest disabled:cursor-not-allowed disabled:opacity-45">
                    {uploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
                    {uploading ? 'Đang tải' : 'Tải bản thu'}
                  </button>
                </div>
                {selectedFile && <p className="mt-2 font-mono text-[10px] text-charcoal-muted">{selectedFile.name} · {(selectedFile.size / 1024 / 1024).toFixed(1)} MB</p>}
                {guide.audioUrl && !editingAudioLink ? (
                  <div className="mt-4 flex min-h-10 items-center justify-between gap-3 border border-paper-border bg-paper px-3 py-2 text-xs text-charcoal">
                    <span className="inline-flex min-w-0 items-center gap-2"><Check className="h-4 w-4 shrink-0 text-brass" /><span className="truncate">Đang sử dụng bản thu đã chọn</span></span>
                    {!isDemo && <button type="button" onClick={() => { setAudioLinkDraft(''); setEditingAudioLink(true); }} className="shrink-0 text-brown underline-offset-2 hover:underline">Dán liên kết khác</button>}
                  </div>
                ) : (
                  <label className="mt-4 block font-mono text-[10px] uppercase tracking-wider text-charcoal-muted">
                    Hoặc dán liên kết bản thu
                    <input value={audioLinkDraft} onChange={(event) => { setAudioLinkDraft(event.target.value); setEditingAudioLink(true); updateGuide('audioUrl', event.target.value); }} disabled={isDemo} className="mt-1.5 w-full border border-paper-border bg-paper px-3 py-2.5 font-sans text-xs normal-case text-charcoal focus:border-brass focus:outline-none disabled:opacity-60" placeholder="Dán liên kết âm thanh tại đây" />
                  </label>
                )}
                <audio
                  key={guide.audioUrl || 'sample-audio'}
                  controls
                  preload="metadata"
                  src={resolveAudioUrl(guide.audioUrl || '') || '/audio/heritage-guide-sample.wav'}
                  className="mt-3 h-10 w-full"
                  aria-label={`Nghe thử thuyết minh ${selectedProduct.name}`}
                  onError={() => setError('Không mở được audio. Kiểm tra URL bản thu hoặc file audio mẫu.')}
                />
              </div>

              <label className="block font-mono text-[11px] uppercase tracking-wider text-charcoal-muted">
                Thời lượng ghi chú
                <input value={guide.duration} onChange={(event) => updateGuide('duration', event.target.value)} disabled={isDemo} maxLength={32} className="mt-1.5 w-full border border-paper-border bg-paper-warm px-3 py-2.5 font-mono text-sm normal-case text-charcoal focus:border-brass focus:outline-none disabled:opacity-60" placeholder="03:25" />
                <span className="mt-2 block font-sans text-xs normal-case leading-relaxed text-charcoal-muted">Thời lượng thực tế sẽ lấy từ metadata của tệp khi phát.</span>
              </label>
            </div>

            <label className="block font-mono text-[11px] uppercase tracking-wider text-charcoal-muted">
              Lời thoại / bản chép lời
              <span className="mt-1.5 flex items-center gap-1.5 font-sans text-xs normal-case text-charcoal-muted"><FileText className="h-3.5 w-3.5 text-brass" />Hiển thị cho khách nghe cùng hoặc đọc thay cho bản thu.</span>
              <textarea value={guide.transcript} onChange={(event) => updateGuide('transcript', event.target.value)} disabled={isDemo} rows={10} className="mt-2 w-full border border-paper-border bg-paper-warm px-3 py-3 font-sans text-sm leading-6 normal-case text-charcoal focus:border-brass focus:outline-none disabled:opacity-60" placeholder="Nhập lời dẫn của hướng dẫn viên..." />
            </label>

            <div className="flex flex-col-reverse justify-between gap-3 border-t border-paper-border pt-4 sm:flex-row sm:items-center">
              <button type="button" onClick={() => void removeGuide()} disabled={isDemo || saving || (!selectedProduct.audioGuide && !guide.audioUrl?.trim() && !guide.transcript.trim())} className="inline-flex items-center justify-center gap-2 px-3 py-2 font-sans text-xs uppercase tracking-wider text-terracotta transition-colors hover:bg-terracotta/5 disabled:cursor-not-allowed disabled:opacity-40">
                <Trash2 className="h-3.5 w-3.5" />Gỡ audio guide
              </button>
              <button type="submit" disabled={isDemo || saving || uploading} className="inline-flex items-center justify-center gap-2 border border-forest bg-forest px-5 py-2.5 font-sans text-xs font-bold uppercase tracking-wider text-paper transition-colors hover:bg-brass hover:text-forest disabled:cursor-not-allowed disabled:opacity-50 shadow-sm">
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                {saving ? 'Đang lưu...' : 'Lưu hướng dẫn viên'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default AdminAudioGuidesPage;
