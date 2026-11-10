import React, { useId, useRef, useState } from 'react';
import {
  AlertCircle,
  Check,
  Copy,
  ExternalLink,
  FolderOpen,
  Image as ImageIcon,
  Loader2,
  Search,
  Trash2,
  Upload,
  X,
} from 'lucide-react';
import { adminApi } from '../../services/api';
import type { MediaItem } from '../../types';
import { handleImageFallback, resolveImageUrl } from '../../utils/mediaResolver';
import { HeritageSpinner } from '../common/HeritageLoader';

interface AdminImagePickerProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  helpText?: string;
  disabled?: boolean;
}

export const AdminImagePicker: React.FC<AdminImagePickerProps> = ({
  label = 'Ảnh minh họa',
  value,
  onChange,
  placeholder = 'Dán liên kết ảnh tại đây',
  required = false,
  helpText,
  disabled = false,
}) => {
  const isDemo = adminApi.isDemoSession();
  const fileInputId = useId();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const modalUploadInputRef = useRef<HTMLInputElement>(null);

  // States
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const [isEditingLink, setIsEditingLink] = useState(false);
  const [linkDraft, setLinkDraft] = useState('');

  // Library modal states
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  const [isLoadingMedia, setIsLoadingMedia] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [libraryError, setLibraryError] = useState<string | null>(null);
  const [copiedMediaId, setCopiedMediaId] = useState<string | null>(null);

  // Drag and drop state
  const [isDragging, setIsDragging] = useState(false);

  // Load media library on modal open
  const loadMediaLibrary = async () => {
    setIsLoadingMedia(true);
    setLibraryError(null);
    try {
      const items = await adminApi.getMedia();
      setMediaList(items);
    } catch (err) {
      setLibraryError(err instanceof Error ? err.message : 'Không tải được thư viện media.');
    } finally {
      setIsLoadingMedia(false);
    }
  };

  const handleOpenLibrary = () => {
    setIsLibraryOpen(true);
    void loadMediaLibrary();
  };

  const handleCopyMediaUrl = async (item: MediaItem) => {
    try {
      await navigator.clipboard.writeText(item.url);
      setCopiedMediaId(item.id);
      setLibraryError(null);
      window.setTimeout(() => setCopiedMediaId(current => current === item.id ? null : current), 1500);
    } catch {
      setLibraryError('Không thể sao chép URL ảnh. Hãy chọn URL và sao chép thủ công.');
    }
  };

  const handleUploadFile = async (file: File) => {
    const ext = file.name.split('.').pop()?.toLowerCase() || '';
    const allowed = ['jpg', 'jpeg', 'png', 'webp', 'avif', 'gif'];
    if (!allowed.includes(ext)) {
      setUploadError('Chỉ hỗ trợ định dạng ảnh (JPG, PNG, WEBP, AVIF, GIF).');
      return;
    }

    if (file.size > 20 * 1024 * 1024) {
      setUploadError('Dung lượng tệp không được vượt quá 20 MB.');
      return;
    }

    setIsUploading(true);
    setUploadError(null);
    setUploadSuccess(null);

    try {
      const displayName = file.name.replace(/\.[^.]+$/, '');
      const result = await adminApi.uploadMediaAsset(file, displayName, displayName);
      onChange(result.item.url);
      setLinkDraft('');
      setIsEditingLink(false);
      setUploadSuccess('Đã tải ảnh lên.');
      setTimeout(() => setUploadSuccess(null), 4000);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Không thể tải ảnh lên.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
      if (modalUploadInputRef.current) modalUploadInputRef.current.value = '';
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      void handleUploadFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled || isDemo) return;
    const file = e.dataTransfer.files?.[0];
    if (file) {
      void handleUploadFile(file);
    }
  };

  const handleSelectFromLibrary = (url: string) => {
    onChange(url);
    setLinkDraft('');
    setIsEditingLink(false);
    setIsLibraryOpen(false);
    setUploadSuccess('Đã chọn ảnh.');
    setTimeout(() => setUploadSuccess(null), 3000);
  };

  // Filter only images from the media list
  const imageMediaItems = mediaList.filter((item) => {
    const isModel = item.resourceType === 'raw' || (item.fileName || '').toLowerCase().endsWith('.glb');
    const isAudio =
      item.resourceType === 'video' ||
      (item.fileType || '').startsWith('audio/') ||
      /\.(mp3|wav|m4a|ogg|flac)$/i.test(item.fileName || '');
    if (isModel || isAudio) return false;

    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      (item.name || '').toLowerCase().includes(q) ||
      (item.fileName || '').toLowerCase().includes(q) ||
      (item.url || '').toLowerCase().includes(q)
    );
  });

  const hasValue = Boolean(value && value.trim());

  return (
    <div className="space-y-2">
      {/* Header bar: Label & Action Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <label htmlFor={fileInputId} className="block font-sans text-xs font-semibold text-charcoal-muted uppercase tracking-wider">
          {label} {required && <span className="text-terracotta">*</span>}
        </label>
        <div className="flex items-center gap-2">
          {!isDemo && (
            <button
              type="button"
              disabled={disabled || isUploading}
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-1.5 border border-paper-border bg-paper-warm px-2.5 py-1 font-sans text-xs font-medium text-forest transition-colors hover:border-brass hover:bg-paper focus:outline-none disabled:opacity-50"
              title="Tải ảnh trực tiếp từ máy tính"
            >
              {isUploading ? <Loader2 className="h-3.5 w-3.5 animate-spin text-brass" /> : <Upload className="h-3.5 w-3.5 text-brass" />}
              <span>Tải ảnh lên</span>
            </button>
          )}
          <button
            type="button"
            disabled={disabled}
            onClick={handleOpenLibrary}
            className="inline-flex items-center gap-1.5 border border-paper-border bg-paper-warm px-2.5 py-1 font-sans text-xs font-medium text-forest transition-colors hover:border-brass hover:bg-paper focus:outline-none disabled:opacity-50"
            title="Mở kho ảnh di sản có sẵn"
          >
            <FolderOpen className="h-3.5 w-3.5 text-brass" />
            <span>Thư viện media</span>
          </button>
        </div>
      </div>

      {/* Hidden file input for direct upload */}
      <input
        ref={fileInputRef}
        type="file"
        id={fileInputId}
        accept="image/jpeg,image/png,image/webp,image/avif,image/gif"
        onChange={handleFileChange}
        className="hidden"
      />

      {hasValue && !isEditingLink ? (
        <div className="flex min-h-10 items-center justify-between gap-3 border border-paper-border bg-paper-warm px-3 py-2 text-xs text-charcoal">
          <span className="inline-flex min-w-0 items-center gap-2">
            <ImageIcon className="h-4 w-4 shrink-0 text-brass" />
            <span className="truncate">Đang sử dụng ảnh đã chọn</span>
          </span>
          <button type="button" onClick={() => { setLinkDraft(''); setIsEditingLink(true); }} className="shrink-0 text-brown underline-offset-2 hover:underline" disabled={disabled}>
            Dán liên kết khác
          </button>
        </div>
      ) : (
        <div className="relative flex items-center">
          <input
            type="text"
            value={linkDraft}
            onChange={(e) => { setLinkDraft(e.target.value); setIsEditingLink(true); onChange(e.target.value); }}
            placeholder={placeholder}
            required={required && !hasValue}
            disabled={disabled}
            className="w-full border border-paper-border bg-paper-warm px-3 py-2 pr-9 text-sm text-charcoal transition-colors placeholder:text-charcoal-muted/70 focus:border-brass focus:bg-paper focus:outline-none disabled:opacity-60"
          />
          {hasValue && !disabled && (
            <button
              type="button"
              onClick={() => { onChange(''); setLinkDraft(''); setIsEditingLink(false); }}
              className="absolute right-2 p-1 text-charcoal-muted transition-colors hover:text-terracotta"
              title="Gỡ ảnh"
              aria-label="Gỡ ảnh"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      )}

      {/* Status Messages */}
      {uploadError && (
        <div role="alert" className="flex items-center gap-1.5 text-xs font-sans text-terracotta">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
          <span>{uploadError}</span>
        </div>
      )}
      {uploadSuccess && (
        <div role="status" className="flex items-center gap-1.5 text-xs font-sans text-forest">
          <Check className="h-3.5 w-3.5 shrink-0 text-brass" />
          <span>{uploadSuccess}</span>
        </div>
      )}

      {/* Preview Container */}
      {hasValue ? (
        <div className="relative overflow-hidden border border-paper-border bg-paper-warm">
          <div className="flex flex-col sm:flex-row items-center gap-3 p-2.5">
            {/* Thumbnail Preview with Fallback */}
            <div className="relative h-24 w-full sm:w-36 shrink-0 overflow-hidden border border-paper-border bg-paper">
              <img
                src={resolveImageUrl(value)}
                alt="Xem trước ảnh bìa"
                onError={(e) => handleImageFallback(e)}
                className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
              />
              <span className="absolute left-1 top-1 bg-forest/85 px-1 py-0.5 font-sans text-[8px] uppercase tracking-wider text-brass font-bold">
                Ảnh hiện tại
              </span>
            </div>

            {/* Image Details & Quick Actions */}
            <div className="flex flex-1 flex-col justify-between w-full min-w-0 space-y-2">
              <div>
                <p className="truncate font-serif text-sm font-semibold text-forest">Ảnh đã sẵn sàng</p>
                <p className="text-xs text-charcoal-muted">Bạn có thể thay ảnh hoặc gỡ ảnh này.</p>
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-paper-border/60">
                <a
                  href={resolveImageUrl(value)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-sans text-charcoal-muted transition-colors hover:text-forest"
                  title="Xem ảnh"
                >
                  <ExternalLink className="h-3 w-3" />
                  <span>Xem ảnh</span>
                </a>

                <span className="text-paper-border">|</span>

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-xs font-sans text-charcoal-muted transition-colors hover:text-brass"
                >
                  Thay ảnh
                </button>

                <span className="text-paper-border">|</span>

                <button
                  type="button"
                  onClick={() => onChange('')}
                  className="inline-flex items-center gap-1 text-xs font-sans text-terracotta/80 transition-colors hover:text-terracotta"
                >
                  <Trash2 className="h-3 w-3" />
                  <span>Gỡ ảnh</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Empty / Dropzone state */
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={`flex flex-col items-center justify-center border border-dashed p-4 text-center transition-colors ${
            isDragging
              ? 'border-brass bg-paper'
              : 'border-paper-border bg-paper-warm/40 hover:border-paper-border/80'
          }`}
        >
          <div className="flex items-center gap-2 text-charcoal-muted">
            <ImageIcon className="h-4 w-4 text-brass" />
            <span className="font-sans text-xs">
              Chưa chọn ảnh. Dán link phía trên, kéo thả ảnh vào đây hoặc
            </span>
          </div>
          <div className="mt-2 flex items-center gap-2">
            {!isDemo && (
              <button
                type="button"
                disabled={isUploading || disabled}
                onClick={() => fileInputRef.current?.click()}
                className="border border-paper-border bg-paper px-2.5 py-1 font-sans text-xs font-medium text-forest hover:border-brass transition-colors"
              >
                Tải ảnh từ máy
              </button>
            )}
            <button
              type="button"
              disabled={disabled}
              onClick={handleOpenLibrary}
              className="border border-paper-border bg-paper px-2.5 py-1 font-sans text-xs font-medium text-forest hover:border-brass transition-colors"
            >
              Chọn từ thư viện
            </button>
          </div>
        </div>
      )}

      {helpText && <p className="font-sans text-xs text-charcoal-muted">{helpText}</p>}

      {/* MEDIA LIBRARY MODAL */}
      {isLibraryOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto bg-forest-dark/80 p-4 backdrop-blur-[2px]">
          <div className="relative my-auto flex max-h-[85vh] w-full max-w-4xl flex-col border border-brass bg-paper p-5 shadow-2xl sm:p-6">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-paper-border pb-4">
              <div className="flex items-center gap-3">
                <div className="border border-brass/40 bg-paper-warm p-2 text-brass">
                  <ImageIcon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-forest sm:text-xl">
                    Thư Viện Media Di Sản
                  </h3>
                  <p className="font-sans text-xs text-charcoal-muted">
                    Chọn ảnh sẵn có trong hệ thống hoặc tải tệp mới vào thư viện
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsLibraryOpen(false)}
                className="p-1 text-charcoal-muted transition-colors hover:text-charcoal"
                aria-label="Đóng thư viện"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Toolbar: Search & Modal Upload */}
            <div className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-charcoal-muted" />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm theo tên ảnh..."
                  className="w-full border border-paper-border bg-paper-warm py-2 pl-9 pr-3 font-sans text-xs text-charcoal focus:border-brass focus:outline-none"
                />
              </div>

              {!isDemo && (
                <div>
                  <input
                    ref={modalUploadInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/avif,image/gif"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <button
                    type="button"
                    disabled={isUploading}
                    onClick={() => modalUploadInputRef.current?.click()}
                    className="inline-flex w-full items-center justify-center gap-2 border border-forest bg-forest px-4 py-2 font-sans text-xs font-bold uppercase tracking-wider text-paper transition-colors hover:bg-brass disabled:opacity-50 sm:w-auto"
                  >
                    {isUploading ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Upload className="h-3.5 w-3.5" />
                    )}
                    <span>{isUploading ? 'Đang tải lên…' : 'Tải ảnh mới lên'}</span>
                  </button>
                </div>
              )}
            </div>

            {/* Error alerts inside modal */}
            {libraryError && (
              <div role="alert" className="mb-3 border border-terracotta/40 bg-terracotta/10 p-2.5 font-sans text-xs text-terracotta">
                {libraryError}
              </div>
            )}

            {/* Media Grid */}
            <div className="flex-1 overflow-y-auto border border-paper-border bg-paper-warm/30 p-3">
              {isLoadingMedia ? (
                <div className="flex flex-col items-center justify-center py-20 text-center font-sans text-xs text-forest">
                  <HeritageSpinner size="md" className="mb-3" />
                  <span>Đang tải danh mục tư liệu hình ảnh…</span>
                </div>
              ) : imageMediaItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <ImageIcon className="mb-2 h-8 w-8 text-charcoal-muted/40" />
                  <p className="font-sans text-xs text-charcoal-muted">
                    {searchQuery
                      ? 'Không tìm thấy hình ảnh phù hợp với từ khóa.'
                      : 'Chưa có hình ảnh nào trong thư viện media.'}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                  {imageMediaItems.map((item) => {
                    const isSelected = value === item.url;
                    return (
                      <article
                        key={item.id}
                        className={`group relative flex flex-col overflow-hidden border text-left transition-all ${
                          isSelected
                            ? 'border-brass bg-paper ring-2 ring-brass/40 shadow-sm'
                            : 'border-paper-border bg-paper hover:border-brass/80 hover:shadow-sm'
                        }`}
                      >
                        <button type="button" onClick={() => handleSelectFromLibrary(item.url)} className="flex h-full flex-col text-left" aria-label={`Chọn ảnh ${item.name}`}>
                          <div className="relative aspect-square w-full overflow-hidden bg-paper-deep/30">
                            <img
                              src={resolveImageUrl(item.url)}
                              alt={item.altText || item.name}
                              onError={(e) => handleImageFallback(e)}
                              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                            {isSelected && (
                              <span className="absolute left-1.5 top-1.5 flex h-5 w-5 items-center justify-center bg-forest text-brass shadow">
                                <Check className="h-3 w-3 stroke-[2.5]" />
                              </span>
                            )}
                          </div>
                          <div className="w-full p-2">
                            <p className="truncate font-serif text-xs font-bold text-forest" title={item.name}>{item.name}</p>
                            <p className="truncate font-mono text-[10px] text-charcoal-muted" title={item.fileName}>
                              {item.fileName || 'Ảnh di sản'}{item.fileSize ? ` · ${(item.fileSize / 1024).toFixed(0)} KB` : ''}
                            </p>
                          </div>
                        </button>
                        <button
                          type="button"
                          onClick={() => void handleCopyMediaUrl(item)}
                          className="absolute right-1.5 top-1.5 flex h-7 w-7 items-center justify-center border border-paper-border bg-paper/95 text-forest shadow-sm transition-colors hover:border-brass hover:text-brass"
                          title={copiedMediaId === item.id ? 'Đã sao chép URL' : 'Sao chép URL'}
                          aria-label={copiedMediaId === item.id ? `Đã sao chép URL ${item.name}` : `Sao chép URL ${item.name}`}
                        >
                          {copiedMediaId === item.id ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                        </button>
                      </article>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between border-t border-paper-border pt-4">
              <span className="font-sans text-xs text-charcoal-muted">
                {imageMediaItems.length} hình ảnh khả dụng
              </span>
              <button
                type="button"
                onClick={() => setIsLibraryOpen(false)}
                className="border border-paper-border px-4 py-1.5 font-sans text-xs uppercase text-charcoal hover:bg-paper-warm transition-colors font-medium"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminImagePicker;
