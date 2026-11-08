import React, { useEffect, useRef, useState } from 'react';
import { Box, Check, Copy, FileImage, Headphones, Image, Loader2, Trash2, Upload } from 'lucide-react';
import { adminApi } from '../../services/api';
import type { MediaItem } from '../../types';
import { resolveAudioUrl, resolveImageUrl, handleImageFallback } from '../../utils/mediaResolver';
import { HeritageLoader } from '../../components/common/HeritageLoader';

const getUploadKind = (file: File): 'image' | 'raw' | 'video' => {
  const extension = file.name.split('.').pop()?.toLowerCase() || '';
  if (['jpg', 'jpeg', 'png', 'webp', 'avif', 'gif'].includes(extension)) return 'image';
  if (extension === 'glb') return 'raw';
  if (['mp3', 'wav', 'm4a', 'ogg', 'flac'].includes(extension)) return 'video';
  throw new Error('Chỉ hỗ trợ ảnh, mô hình 3D GLB và audio MP3, WAV, M4A, OGG hoặc FLAC.');
};

const getDisplayName = (fileName: string) => fileName.replace(/\.[^.]+$/, '');

export const AdminMediaPage: React.FC = () => {
  const isDemo = adminApi.isDemoSession();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [assetName, setAssetName] = useState('');
  const [altText, setAltText] = useState('');

  useEffect(() => {
    adminApi.getMedia().then(setMediaList)
      .catch((err: unknown) => setError(err instanceof Error ? err.message : 'Không tải được thư viện media.'))
      .finally(() => setLoading(false));
  }, []);

  const selectFile = (file: File | undefined) => {
    if (!file) return;
    try {
      getUploadKind(file);
      setSelectedFile(file);
      setAssetName(getDisplayName(file.name));
      setAltText('');
      setError(null);
      setNotice(null);
    } catch (err) {
      setSelectedFile(null);
      setError(err instanceof Error ? err.message : 'Định dạng tệp không được hỗ trợ.');
    }
  };

  const handleUpload = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedFile) return;

    setUploading(true);
    setError(null);
    setNotice(null);
    try {
      getUploadKind(selectedFile);
      const displayName = assetName.trim() || getDisplayName(selectedFile.name);
      const description = altText.trim();
      const result = await adminApi.uploadMediaAsset(selectedFile, displayName, description);
      setNotice('Đã tải tệp lên thư viện.');
      setMediaList(current => [result.item, ...current]);
      setSelectedFile(null);
      setAssetName('');
      setAltText('');
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể tải tệp lên. Vui lòng thử lại.');
    } finally {
      setUploading(false);
    }
  };

  const handleCopy = async (url: string, id: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedId(id);
      setError(null);
      setTimeout(() => setCopiedId(null), 1500);
    } catch {
      setError('Trình duyệt không cho phép sao chép. Hãy chọn và sao chép URL thủ công.');
    }
  };

  const handleDelete = async (item: MediaItem) => {
    const storedAsset = item.url.startsWith('/uploads/') || item.url.startsWith('https://res.cloudinary.com/');
    const confirmation = storedAsset
      ? `Xóa “${item.name}” khỏi thư viện và kho lưu trữ?`
      : `Gỡ “${item.name}” khỏi thư viện? Tệp tĩnh trong mã nguồn vẫn được giữ nguyên.`;
    if (!window.confirm(confirmation)) return;
    setDeletingId(item.id);
    setError(null);
    setNotice(null);
    try {
      await adminApi.deleteMedia(item.id);
      setMediaList(current => current.filter(media => media.id !== item.id));
      setNotice('Đã xóa tệp khỏi thư viện.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể xóa tệp khỏi thư viện.');
    } finally {
      setDeletingId(null);
    }
  };

  const filteredMedia = mediaList.filter(item =>
    item.name.toLowerCase().includes(search.toLowerCase()) ||
    (item.fileName || '').toLowerCase().includes(search.toLowerCase()) ||
    item.url.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-paper-border">
        <div>
          <div className="flex items-center gap-2 text-brass text-xs font-mono uppercase tracking-widest">
            <Image className="w-4 h-4" />
            <span>Kho Lưu Trữ Hình Ảnh Thực Địa & Khảo Cứu</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-forest mt-1">Thư Viện Media Di Sản</h1>
        </div>
        <div className="w-full sm:w-72">
          <input
            type="search"
            value={search}
            onChange={event => setSearch(event.target.value)}
            placeholder="Tìm tên tệp hoặc URL..."
            className="w-full px-3 py-2 bg-paper border border-paper-border focus:border-brass text-xs font-mono focus:outline-none"
          />
        </div>
      </div>

      {error && <div role="alert" className="border border-terracotta/40 bg-terracotta/10 p-3 text-sm text-terracotta">{error}</div>}
      {notice && <div role="status" className="border border-brass/40 bg-paper-warm p-3 text-sm text-forest">{notice}</div>}

      {!isDemo && <form onSubmit={event => void handleUpload(event)} className="border border-paper-border bg-paper p-4 sm:p-5">
        <div className="flex items-start gap-3 mb-4">
          <div className="border border-brass/40 p-2 text-brass"><Upload className="w-4 h-4" /></div>
          <div>
            <h2 className="font-serif font-bold text-forest">Tải tệp lên</h2>
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-[1fr_1fr_1fr_auto] md:items-end">
          <label className="block text-[11px] font-mono uppercase tracking-wider text-charcoal-muted">
            Tệp ảnh, GLB hoặc audio
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/avif,image/gif,.glb,audio/mpeg,audio/wav,audio/mp4,audio/ogg,audio/flac,.mp3,.wav,.m4a,.ogg,.flac"
              onChange={event => selectFile(event.target.files?.[0])}
              className="mt-1 block w-full text-xs normal-case file:mr-2 file:border file:border-paper-border file:bg-paper-warm file:px-2 file:py-1.5 file:text-[11px] file:font-mono file:text-charcoal"
            />
          </label>
          <label className="block text-[11px] font-mono uppercase tracking-wider text-charcoal-muted">
            Tên hiển thị
            <input value={assetName} onChange={event => setAssetName(event.target.value)} placeholder="Ví dụ: Chùa Một Cột" className="mt-1 w-full border border-paper-border bg-paper px-3 py-2 text-sm normal-case text-charcoal focus:border-brass focus:outline-none" />
          </label>
          <label className="block text-[11px] font-mono uppercase tracking-wider text-charcoal-muted">
            Mô tả ảnh (alt text)
            <input value={altText} onChange={event => setAltText(event.target.value)} placeholder="Mô tả ngắn cho người xem" className="mt-1 w-full border border-paper-border bg-paper px-3 py-2 text-sm normal-case text-charcoal focus:border-brass focus:outline-none" />
          </label>
          <button type="submit" disabled={!selectedFile || uploading} className="inline-flex h-9 items-center justify-center gap-2 border border-forest bg-forest px-4 text-xs font-mono uppercase tracking-wider text-paper transition-colors hover:bg-forest/90 disabled:cursor-not-allowed disabled:opacity-50">
            {uploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
            {uploading ? 'Đang tải lên' : 'Tải lên'}
          </button>
        </div>
        {selectedFile && <p className="mt-3 flex items-center gap-2 text-[11px] font-mono text-charcoal-muted"><FileImage className="h-3.5 w-3.5 text-brass" />{selectedFile.name} · {(selectedFile.size / 1024).toFixed(0)} KB</p>}
      </form>}

      {loading ? (
        <HeritageLoader variant="section" size="md" message="Đang tải thư viện media di sản..." />
      ) : filteredMedia.length === 0 ? (
        <div className="border border-dashed border-paper-border py-14 text-center text-sm text-charcoal-muted">Chưa có tệp phù hợp trong thư viện.</div>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {filteredMedia.map(item => {
            const isModel = item.resourceType === 'raw' || (item.fileName || '').toLowerCase().endsWith('.glb');
            const isAudio = item.resourceType === 'video' || (item.fileType || '').startsWith('audio/') || /\.(mp3|wav|m4a|ogg|flac)$/i.test(item.fileName || '');
            return (
              <article key={item.id} className="flex flex-col justify-between overflow-hidden border border-paper-border bg-paper shadow-sm group">
                <div>
                  <div className={`relative aspect-square overflow-hidden ${isModel ? 'flex flex-col items-center justify-center gap-2 bg-forest text-paper' : 'bg-paper-deep/30'}`}>
                    {isModel ? <><Box className="h-9 w-9 text-brass" /><span className="font-mono text-[10px] uppercase tracking-[0.18em]">Mô hình 3D · GLB</span></> : isAudio ? (
                      <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-forest px-3 text-paper">
                        <Headphones className="h-7 w-7 text-brass" />
                        <span className="font-mono text-[10px] uppercase tracking-[0.14em]">Bản thu hướng dẫn viên</span>
                        <audio controls preload="metadata" src={resolveAudioUrl(item.url)} className="h-8 w-full max-w-[220px]" aria-label={`Nghe thử ${item.name}`} />
                      </div>
                    ) : (
                      <img src={resolveImageUrl(item.url)} alt={item.altText || item.name} onError={event => handleImageFallback(event)} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]" />
                    )}
                  </div>
                  <div className="space-y-1 p-3.5 font-mono text-xs">
                    <p className="truncate font-serif text-sm font-bold text-forest" title={item.name}>{item.name}</p>
                    <p className="truncate text-[10px] text-charcoal-muted" title={item.fileName}>{item.fileName || 'Tệp di sản'} · {(item.fileSize / 1024).toFixed(0)} KB</p>
                  </div>
                </div>
                <div className="mt-2 flex gap-2 border-t border-paper-border p-3.5 pt-3">
                  <button onClick={() => void handleCopy(item.url, item.id)} className="flex min-w-0 flex-1 items-center justify-center gap-1.5 border border-paper-border bg-paper-warm px-2 py-1.5 font-mono text-[10px] uppercase tracking-wider text-charcoal transition-colors hover:bg-forest hover:text-paper">
                    {copiedId === item.id ? <><Check className="h-3 w-3 text-brass" /><span className="font-bold text-brass">Đã sao chép URL</span></> : <><Copy className="h-3 w-3 text-brass" /><span>Sao chép URL</span></>}
                  </button>
                  {!isDemo && <button type="button" onClick={() => void handleDelete(item)} disabled={deletingId === item.id} className="flex h-8 w-9 shrink-0 items-center justify-center border border-paper-border text-terracotta transition-colors hover:border-terracotta hover:bg-terracotta/5 disabled:cursor-wait disabled:opacity-50" title="Xóa tệp" aria-label={`Xóa ${item.name}`}>
                    {deletingId === item.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
                  </button>}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AdminMediaPage;
