import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  AlertCircle,
  Check,
  FileText,
  Globe,
  Headphones,
  Loader2,
  Mic,
  Music,
  Save,
  Search,
  Trash2,
  Upload,
  Volume2,
} from 'lucide-react';
import { adminApi } from '../../services/api';
import type { AudioGuideData, Product } from '../../types';
import { resolveAudioUrl } from '../../utils/mediaResolver';
import { HeritageLoader } from '../../components/common/HeritageLoader';
import { LANGUAGES, type LanguageCode } from '../../locales';
import { PRODUCT_TRANSLATIONS } from '../../utils/localizedEntities';

const emptyGuide = (productName: string): AudioGuideData => ({
  title: `Lời kể về ${productName}`,
  duration: '',
  audioUrl: '',
  narrator: 'Hướng dẫn viên Viettoria',
  transcript: '',
  audioUrls: {
    vi: '',
    en: '',
    fr: '',
    zh: '',
    ko: '',
    ja: '',
  },
});

const normalizeGuide = (product: Product | null): AudioGuideData => {
  if (!product) return emptyGuide('công trình');
  const base = product.audioGuide ? { ...product.audioGuide } : emptyGuide(product.name);
  const audioUrls: Partial<Record<LanguageCode, string>> = {
    vi: base.audioUrls?.vi || base.audioUrl || '',
    en: base.audioUrls?.en || '',
    fr: base.audioUrls?.fr || '',
    zh: base.audioUrls?.zh || '',
    ko: base.audioUrls?.ko || '',
    ja: base.audioUrls?.ja || '',
  };
  return {
    ...base,
    audioUrl: audioUrls.vi || base.audioUrl || '',
    audioUrls,
  };
};

export const AdminAudioGuidesPage: React.FC = () => {
  const isDemo = adminApi.isDemoSession();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [guide, setGuide] = useState<AudioGuideData>(emptyGuide('công trình'));
  const [activeLang, setActiveLang] = useState<LanguageCode>('vi');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [editingAudioLink, setEditingAudioLink] = useState(false);
  const [audioLinkDraft, setAudioLinkDraft] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const selectedProduct = useMemo(
    () => products.find((product) => product.id === selectedProductId) || null,
    [products, selectedProductId],
  );

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLocaleLowerCase('vi');
    if (!query) return products;
    return products.filter((product) =>
      `${product.name} ${product.code} ${product.location}`.toLocaleLowerCase('vi').includes(query),
    );
  }, [products, search]);

  useEffect(() => {
    adminApi
      .getProducts()
      .then((items) => {
        setProducts(items);
        const first = items[0] || null;
        setSelectedProductId(first?.id || '');
        if (first) setGuide(normalizeGuide(first));
      })
      .catch((err: unknown) =>
        setError(err instanceof Error ? err.message : 'Không tải được danh sách công trình.'),
      )
      .finally(() => setLoading(false));
  }, []);

  const selectProduct = (product: Product) => {
    setSelectedProductId(product.id);
    setGuide(normalizeGuide(product));
    setActiveLang('vi');
    setEditingAudioLink(false);
    setAudioLinkDraft('');
    setSelectedFile(null);
    setError(null);
    setNotice(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const updateGuideField = (field: keyof AudioGuideData, value: string) => {
    setGuide((current) => ({ ...current, [field]: value }));
    setNotice(null);
  };

  const updateLangAudioUrl = (lang: LanguageCode, url: string) => {
    setGuide((current) => {
      const updatedUrls: Partial<Record<LanguageCode, string>> = {
        ...(current.audioUrls || {}),
        [lang]: url,
      };
      return {
        ...current,
        audioUrls: updatedUrls,
        audioUrl: lang === 'vi' ? url : current.audioUrl || updatedUrls.vi || '',
      };
    });
    setNotice(null);
  };

  const switchLanguage = (lang: LanguageCode) => {
    setActiveLang(lang);
    setEditingAudioLink(false);
    setAudioLinkDraft('');
    setSelectedFile(null);
    setError(null);
    setNotice(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const currentLangAudioUrl = useMemo(() => {
    const fromMap = guide.audioUrls?.[activeLang];
    if (fromMap?.trim()) return fromMap.trim();
    if (activeLang === 'vi' && guide.audioUrl?.trim()) return guide.audioUrl.trim();
    return '';
  }, [guide.audioUrls, guide.audioUrl, activeLang]);

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
    const langInfo = LANGUAGES.find((l) => l.code === activeLang);
    const langLabel = langInfo ? `${langInfo.label} (${langInfo.shortLabel})` : activeLang.toUpperCase();
    try {
      const result = await adminApi.uploadMediaAsset(
        selectedFile,
        `${selectedProduct.name} — ${guide.title || 'Audio Guide'} [${langLabel}]`,
        `Bản thu hướng dẫn viên [${langLabel}] cho ${selectedProduct.name}`,
      );
      updateLangAudioUrl(activeLang, result.item.url);
      setEditingAudioLink(false);
      setAudioLinkDraft('');
      setNotice(`Đã tải bản thu cho ${langLabel}. Nhấn "Lưu hướng dẫn viên" để cập nhật.`);
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không tải được bản thu lên.');
    } finally {
      setUploading(false);
    }
  };

  const removeCurrentLangAudio = () => {
    const langLabel = LANGUAGES.find((l) => l.code === activeLang)?.label || activeLang;
    updateLangAudioUrl(activeLang, '');
    setEditingAudioLink(false);
    setAudioLinkDraft('');
    setSelectedFile(null);
    setNotice(`Đã gỡ bản thu cho ${langLabel}.`);
  };

  const saveGuide = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedProduct || isDemo) return;
    setSaving(true);
    setError(null);
    setNotice(null);
    try {
      const payloadGuide: AudioGuideData = {
        ...guide,
        audioUrl: guide.audioUrls?.vi || guide.audioUrl || '',
      };
      const saved = await adminApi.updateProduct(selectedProduct.id, {
        displayOrder: selectedProduct.displayOrder,
        audioGuide: payloadGuide,
      });
      setProducts((current) =>
        current.map((product) =>
          product.id === saved.id ? { ...product, ...saved, audioGuide: payloadGuide } : product,
        ),
      );
      setNotice('Đã lưu thành công bộ âm thanh hướng dẫn viên đa ngôn ngữ cho công trình này.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không lưu được hướng dẫn viên audio.');
    } finally {
      setSaving(false);
    }
  };

  const removeAllGuide = async () => {
    if (!selectedProduct || isDemo) return;
    setSaving(true);
    setError(null);
    setNotice(null);
    try {
      const cleared: AudioGuideData = {
        title: '',
        duration: '',
        audioUrl: '',
        narrator: '',
        transcript: '',
        audioUrls: {},
      };
      const saved = await adminApi.updateProduct(selectedProduct.id, {
        displayOrder: selectedProduct.displayOrder,
        audioGuide: cleared,
      });
      setProducts((current) =>
        current.map((product) => (product.id === saved.id ? { ...product, ...saved } : product)),
      );
      setGuide(emptyGuide(saved.name));
      setNotice('Đã gỡ toàn bộ hướng dẫn viên audio khỏi công trình.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không gỡ được hướng dẫn viên audio.');
    } finally {
      setSaving(false);
    }
  };

  // Helper to count how many languages have an audio file ready
  const getProductAudioCount = (product: Product): number => {
    const ag = product.audioGuide;
    if (!ag) return 0;
    let count = 0;
    LANGUAGES.forEach((lang) => {
      const hasLangAudio =
        Boolean(ag.audioUrls?.[lang.code]?.trim()) ||
        (lang.code === 'vi' && Boolean(ag.audioUrl?.trim()));
      if (hasLangAudio) count++;
    });
    return count;
  };

  const currentProductAudioCount = useMemo(() => {
    let count = 0;
    LANGUAGES.forEach((lang) => {
      const url =
        guide.audioUrls?.[lang.code]?.trim() ||
        (lang.code === 'vi' ? guide.audioUrl?.trim() : '');
      if (url) count++;
    });
    return count;
  }, [guide.audioUrls, guide.audioUrl]);

  const activeLangInfo = useMemo(
    () => LANGUAGES.find((l) => l.code === activeLang) || LANGUAGES[0],
    [activeLang],
  );

  // Translation record for current active language (if available)
  const activeTranslation = useMemo(() => {
    if (!selectedProduct || activeLang === 'vi') return null;
    const key = selectedProduct.slug || selectedProduct.code || selectedProduct.id;
    return PRODUCT_TRANSLATIONS[key]?.[activeLang] || null;
  }, [selectedProduct, activeLang]);

  const totalMonumentsWithAudio = products.filter(
    (product) => getProductAudioCount(product) > 0,
  ).length;

  return (
    <div className="space-y-6">
      {/* Editorial Header */}
      <header className="flex flex-col justify-between gap-4 border-b border-paper-border pb-4 sm:flex-row sm:items-end">
        <div>
          <div className="flex items-center gap-2 font-sans text-xs uppercase tracking-widest text-brass font-bold">
            <Globe className="h-4 w-4" />
            <span>Âm thanh & Thuyết minh đa ngôn ngữ</span>
          </div>
          <h1 className="mt-1 font-serif text-2xl font-bold text-forest sm:text-3xl">
            Hướng dẫn viên audio đa ngôn ngữ
          </h1>
          <p className="mt-1 text-xs text-charcoal-muted font-sans">
            Quản lý bản thu giọng đọc, tư liệu âm thanh và lời dẫn theo từng ngôn ngữ (VI, EN, FR, ZH, KO, JA).
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="border border-paper-border bg-paper px-4 py-2 font-sans text-xs text-charcoal-muted">
            <span className="font-bold text-forest">{totalMonumentsWithAudio}</span> / {products.length} công trình có bản thu
          </div>
        </div>
      </header>

      {error && (
        <div
          role="alert"
          className="flex items-start gap-2 border border-terracotta/40 bg-terracotta/10 p-3 text-sm text-terracotta rounded-[2px]"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          {error}
        </div>
      )}
      {notice && (
        <div
          role="status"
          className="flex items-start gap-2 border border-brass/40 bg-paper-warm p-3 text-sm text-forest rounded-[2px]"
        >
          <Check className="mt-0.5 h-4 w-4 shrink-0 text-brass" />
          {notice}
        </div>
      )}

      {isDemo && (
        <div className="border border-brass/35 bg-paper-warm px-4 py-3 text-xs leading-relaxed text-charcoal-muted rounded-[2px]">
          Chế độ xem thử: có thể xem các hướng dẫn viên và bản thu, thao tác upload, lưu hoặc gỡ đang khóa.
        </div>
      )}

      <div className="grid items-start gap-5 xl:grid-cols-[320px_minmax(0,1fr)]">
        {/* Sidebar Product List */}
        <aside className="border border-paper-border bg-paper rounded-[2px]">
          <div className="border-b border-paper-border p-4">
            <label className="relative block">
              <span className="sr-only">Tìm công trình</span>
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-charcoal-muted" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Tìm công trình..."
                className="w-full border border-paper-border bg-paper-warm py-2.5 pl-9 pr-3 text-sm focus:border-brass focus:outline-none rounded-[2px]"
              />
            </label>
          </div>
          <div className="max-h-[72vh] overflow-y-auto">
            {loading ? (
              <HeritageLoader
                variant="section"
                size="sm"
                message="Đang tải danh sách công trình..."
                className="py-8"
              />
            ) : filteredProducts.length === 0 ? (
              <p className="p-6 text-center text-sm text-charcoal-muted">Không tìm thấy công trình.</p>
            ) : (
              filteredProducts.map((product) => {
                const count = getProductAudioCount(product);
                const active = product.id === selectedProductId;
                return (
                  <button
                    key={product.id}
                    type="button"
                    onClick={() => selectProduct(product)}
                    className={`w-full border-b border-paper-border p-4 text-left transition-colors ${
                      active ? 'bg-forest text-paper' : 'bg-paper text-charcoal hover:bg-paper-warm'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <span className="block truncate font-serif text-base font-semibold">
                          {product.name}
                        </span>
                        <span
                          className={`mt-1 block font-mono text-[10px] uppercase tracking-wider ${
                            active ? 'text-paper/60' : 'text-charcoal-muted'
                          }`}
                        >
                          {product.location} · {product.code}
                        </span>
                      </div>
                      <span
                        className={`inline-flex shrink-0 items-center gap-1 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider rounded-[2px] ${
                          count === 6
                            ? active
                              ? 'bg-brass text-forest font-bold'
                              : 'bg-forest/10 text-forest border border-forest/30 font-bold'
                            : count > 0
                            ? active
                              ? 'bg-paper/20 text-brass'
                              : 'bg-brass/10 text-brass border border-brass/30'
                            : active
                            ? 'bg-paper/10 text-paper/40'
                            : 'bg-paper-border text-charcoal-muted'
                        }`}
                      >
                        {count === 6 ? '✓ 6/6 audio' : `${count}/6 audio`}
                      </span>
                    </div>
                    <span
                      className={`mt-2.5 block truncate text-xs ${
                        active ? 'text-paper/75' : 'text-charcoal-muted'
                      }`}
                    >
                      {count > 0 ? product.audioGuide?.title : 'Chưa có bản thu audio'}
                    </span>
                  </button>
                );
              })
            )}
          </div>
        </aside>

        {/* Main Editing Studio */}
        {!selectedProduct ? (
          <section className="flex min-h-72 items-center justify-center border border-dashed border-paper-border bg-paper p-8 text-center text-sm text-charcoal-muted rounded-[2px]">
            {loading ? 'Đang nạp danh sách...' : 'Chọn một công trình để biên tập hướng dẫn viên audio đa ngôn ngữ.'}
          </section>
        ) : (
          <form
            onSubmit={(event) => void saveGuide(event)}
            className="space-y-6 border border-paper-border bg-paper p-4 sm:p-6 rounded-[2px]"
          >
            {/* Monument Header with Status Badge */}
            <div className="flex flex-col justify-between gap-3 border-b border-paper-border pb-4 sm:flex-row sm:items-start">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-brass">
                  {selectedProduct.code} · {selectedProduct.location}
                </p>
                <h2 className="mt-1 font-serif text-xl sm:text-2xl font-bold text-forest">
                  {selectedProduct.name}
                </h2>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 border border-paper-border bg-paper-warm px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-charcoal rounded-[2px]">
                  <Volume2 className="h-3.5 w-3.5 text-brass" />
                  Độ phủ đa ngữ: <strong className="text-forest">{currentProductAudioCount}/6</strong>
                </span>
                <span
                  className={`inline-flex w-fit items-center gap-1.5 border px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider rounded-[2px] ${
                    currentProductAudioCount === 6
                      ? 'border-forest/25 bg-forest/5 text-forest font-bold'
                      : currentProductAudioCount > 0
                      ? 'border-brass/30 bg-brass/10 text-brass'
                      : 'border-paper-border text-charcoal-muted'
                  }`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      currentProductAudioCount === 6
                        ? 'bg-brass'
                        : currentProductAudioCount > 0
                        ? 'bg-amber-600'
                        : 'bg-paper-border'
                    }`}
                  />
                  {currentProductAudioCount === 6
                    ? 'Sẵn sàng 6 ngôn ngữ'
                    : currentProductAudioCount > 0
                    ? `Hoàn thiện ${currentProductAudioCount}/6 ngôn ngữ`
                    : 'Chưa có bản thu'}
                </span>
              </div>
            </div>

            {/* Language Switcher Tabs Bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="font-mono text-[11px] uppercase tracking-wider text-charcoal-muted flex items-center gap-1.5">
                  <Globe className="h-3.5 w-3.5 text-brass" />
                  Chọn ngôn ngữ biên tập âm thanh
                </label>
                <span className="font-mono text-[10px] text-charcoal-muted">
                  Bấm tab để chuyển đổi bản thu
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                {LANGUAGES.map((lang) => {
                  const hasAudio = Boolean(
                    guide.audioUrls?.[lang.code]?.trim() ||
                      (lang.code === 'vi' && guide.audioUrl?.trim()),
                  );
                  const isCurrent = activeLang === lang.code;

                  return (
                    <button
                      key={lang.code}
                      type="button"
                      onClick={() => switchLanguage(lang.code)}
                      className={`
                        relative flex flex-col items-center gap-1.5 px-3 py-2.5 text-center
                        border transition-all duration-150 rounded-[2px]
                        ${
                          isCurrent
                            ? 'border-forest bg-forest text-paper shadow-xs'
                            : 'border-paper-border bg-paper text-charcoal hover:border-brass/50 hover:bg-paper-warm'
                        }
                      `}
                    >
                      <div className="flex items-center gap-1.5">
                        <span className="text-base select-none leading-none">{lang.flagSymbol}</span>
                        <span
                          className={`font-sans text-xs font-bold uppercase tracking-wider ${
                            isCurrent ? 'text-brass' : 'text-charcoal'
                          }`}
                        >
                          {lang.shortLabel}
                        </span>
                      </div>
                      <span
                        className={`text-[11px] font-sans truncate max-w-full ${
                          isCurrent ? 'text-paper/90' : 'text-charcoal-muted'
                        }`}
                      >
                        {lang.label}
                      </span>
                      <span
                        className={`inline-flex items-center gap-1 text-[9px] font-mono tracking-wider ${
                          hasAudio
                            ? isCurrent
                              ? 'text-brass font-bold'
                              : 'text-forest font-semibold'
                            : isCurrent
                            ? 'text-paper/40'
                            : 'text-charcoal-muted/60'
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            hasAudio ? 'bg-brass' : 'bg-paper-border'
                          }`}
                        />
                        {hasAudio ? 'Có audio' : 'Trống'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Active Language Audio Management Card */}
            <div className="border border-brass/35 bg-paper-warm p-4 sm:p-5 rounded-[2px] space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-brass/20 pb-3">
                <div className="flex items-center gap-3">
                  <div className="border border-brass/40 bg-paper p-2 text-brass rounded-[2px]">
                    <Headphones className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="font-serif text-base font-bold text-forest flex items-center gap-2">
                      <span>Bản thu âm thanh · {activeLangInfo.label}</span>
                      <span className="text-base leading-none">{activeLangInfo.flagSymbol}</span>
                    </h3>
                    <p className="mt-0.5 text-xs text-charcoal-muted font-sans">
                      {activeLang === 'vi'
                        ? 'Bản thu tiếng Việt gốc (thuyết minh chủ đạo).'
                        : `Bản thu sẽ tự động phát khi người dùng chọn ngôn ngữ ${activeLangInfo.label}.`}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {currentLangAudioUrl ? (
                    <span className="inline-flex items-center gap-1.5 border border-forest/30 bg-forest/10 px-2.5 py-1 text-[11px] font-mono text-forest rounded-[2px]">
                      <Check className="h-3.5 w-3.5 text-brass" />
                      Đã có bản thu {activeLangInfo.shortLabel}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 border border-dashed border-paper-border bg-paper px-2.5 py-1 text-[11px] font-mono text-charcoal-muted rounded-[2px]">
                      Chưa có bản thu {activeLangInfo.shortLabel}
                    </span>
                  )}
                  {currentLangAudioUrl && !isDemo && (
                    <button
                      type="button"
                      onClick={removeCurrentLangAudio}
                      title="Gỡ bản thu của ngôn ngữ này"
                      className="inline-flex items-center gap-1 border border-paper-border bg-paper px-2 py-1 text-[11px] font-sans text-terracotta hover:border-terracotta rounded-[2px] transition-colors"
                    >
                      <Trash2 className="h-3 w-3" />
                      Gỡ
                    </button>
                  )}
                </div>
              </div>

              {/* Upload or Link Input */}
              <div className="grid gap-4 sm:grid-cols-[1fr_auto]">
                <label className="block font-mono text-[10px] uppercase tracking-wider text-charcoal-muted">
                  Chọn tệp audio cho {activeLangInfo.label} · tối đa 100 MB
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="audio/mpeg,audio/wav,audio/mp4,audio/ogg,audio/flac,.mp3,.wav,.m4a,.ogg,.flac"
                    disabled={isDemo || uploading}
                    onChange={(event) => selectAudio(event.target.files?.[0])}
                    className="mt-1.5 block w-full text-xs normal-case file:mr-2 file:border file:border-paper-border file:bg-paper file:px-2.5 file:py-2 file:font-mono file:text-[10px] file:uppercase file:text-charcoal rounded-[2px]"
                  />
                </label>
                <div className="flex items-end">
                  <button
                    type="button"
                    onClick={() => void uploadAudio()}
                    disabled={!selectedFile || uploading || isDemo}
                    className="inline-flex h-10 w-full sm:w-auto items-center justify-center gap-2 border border-forest bg-forest px-4 font-mono text-[10px] uppercase tracking-wider text-paper transition-colors hover:bg-brass hover:text-forest disabled:cursor-not-allowed disabled:opacity-45 rounded-[2px]"
                  >
                    {uploading ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Upload className="h-3.5 w-3.5" />
                    )}
                    {uploading ? 'Đang tải lên...' : `Tải lên (${activeLangInfo.shortLabel})`}
                  </button>
                </div>
              </div>

              {selectedFile && (
                <p className="font-mono text-[10px] text-charcoal-muted">
                  Đã chọn: <strong className="text-forest">{selectedFile.name}</strong> ·{' '}
                  {(selectedFile.size / 1024 / 1024).toFixed(1)} MB
                </p>
              )}

              {/* Direct Link or Active Display */}
              {currentLangAudioUrl && !editingAudioLink ? (
                <div className="flex min-h-10 items-center justify-between gap-3 border border-paper-border bg-paper px-3.5 py-2.5 text-xs text-charcoal rounded-[2px]">
                  <div className="min-w-0 flex items-center gap-2.5">
                    <Music className="h-4 w-4 shrink-0 text-brass" />
                    <span className="truncate font-mono text-xs">{currentLangAudioUrl}</span>
                  </div>
                  {!isDemo && (
                    <button
                      type="button"
                      onClick={() => {
                        setAudioLinkDraft(currentLangAudioUrl);
                        setEditingAudioLink(true);
                      }}
                      className="shrink-0 text-brass font-sans text-xs underline-offset-2 hover:underline"
                    >
                      Dán liên kết khác
                    </button>
                  )}
                </div>
              ) : (
                <label className="block font-mono text-[10px] uppercase tracking-wider text-charcoal-muted">
                  Hoặc dán URL âm thanh cho {activeLangInfo.label} ({activeLangInfo.shortLabel})
                  <input
                    value={editingAudioLink ? audioLinkDraft : currentLangAudioUrl}
                    onChange={(event) => {
                      setAudioLinkDraft(event.target.value);
                      setEditingAudioLink(true);
                      updateLangAudioUrl(activeLang, event.target.value);
                    }}
                    disabled={isDemo}
                    className="mt-1.5 w-full border border-paper-border bg-paper px-3 py-2.5 font-mono text-xs normal-case text-charcoal focus:border-brass focus:outline-none disabled:opacity-60 rounded-[2px]"
                    placeholder={`Ví dụ: /audio/${selectedProduct.slug}-${activeLang}.mp3 hoặc https://...`}
                  />
                </label>
              )}

              {/* Interactive Audio Player Preview */}
              <div className="pt-2">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-charcoal-muted flex items-center gap-1.5">
                    <Volume2 className="h-3.5 w-3.5 text-brass" />
                    Nghe thử bản thu ({activeLangInfo.label})
                  </span>
                  {currentLangAudioUrl && (
                    <span className="font-mono text-[10px] text-brass">
                      Đang phát: {activeLangInfo.shortLabel}
                    </span>
                  )}
                </div>
                <audio
                  key={`${activeLang}-${currentLangAudioUrl || 'empty'}`}
                  controls
                  preload="metadata"
                  src={
                    resolveAudioUrl(currentLangAudioUrl) ||
                    (activeLang === 'vi' ? '/audio/heritage-guide-sample.wav' : '')
                  }
                  className="h-10 w-full rounded-[2px]"
                  aria-label={`Nghe thử thuyết minh ${selectedProduct.name} bằng ${activeLangInfo.label}`}
                  onError={() => {
                    if (currentLangAudioUrl) {
                      setError(`Không phát được tệp âm thanh cho ${activeLangInfo.label}. Kiểm tra URL hoặc tệp đã tải.`);
                    }
                  }}
                />
              </div>
            </div>

            {/* General Guide Details (Title, Narrator, Duration, Transcript) */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-paper-border pb-2">
                <h3 className="font-serif text-sm font-bold text-forest flex items-center gap-2">
                  <FileText className="h-4 w-4 text-brass" />
                  <span>
                    {activeLang === 'vi'
                      ? 'Nội dung thuyết minh (Bản gốc tiếng Việt)'
                      : `Lời thoại dịch thuật văn hóa (${activeLangInfo.label})`}
                  </span>
                </h3>
                {activeLang !== 'vi' && (
                  <span className="font-mono text-[10px] text-brass">
                    Đồng bộ từ Cultural Translation Matrix
                  </span>
                )}
              </div>

              {activeLang === 'vi' ? (
                <>
                  <div className="grid gap-4 md:grid-cols-2">
                    <label className="block font-mono text-[11px] uppercase tracking-wider text-charcoal-muted">
                      Tên chương thuyết minh
                      <input
                        value={guide.title}
                        onChange={(event) => updateGuideField('title', event.target.value)}
                        disabled={isDemo}
                        maxLength={255}
                        className="mt-1.5 w-full border border-paper-border bg-paper-warm px-3 py-2.5 font-sans text-sm normal-case text-charcoal focus:border-brass focus:outline-none disabled:opacity-60 rounded-[2px]"
                        placeholder="Ví dụ: Dấu ấn qua nghìn năm"
                      />
                    </label>
                    <label className="block font-mono text-[11px] uppercase tracking-wider text-charcoal-muted">
                      Hướng dẫn viên / người đọc
                      <span className="relative mt-1.5 block">
                        <Mic className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brass" />
                        <input
                          value={guide.narrator || ''}
                          onChange={(event) => updateGuideField('narrator', event.target.value)}
                          disabled={isDemo}
                          maxLength={128}
                          className="w-full border border-paper-border bg-paper-warm py-2.5 pl-9 pr-3 font-sans text-sm normal-case text-charcoal focus:border-brass focus:outline-none disabled:opacity-60 rounded-[2px]"
                          placeholder="Tên người dẫn chuyện"
                        />
                      </span>
                    </label>
                  </div>

                  <div className="grid gap-4 md:grid-cols-[1fr_200px]">
                    <label className="block font-mono text-[11px] uppercase tracking-wider text-charcoal-muted">
                      Lời thoại / bản chép lời (Tiếng Việt)
                      <span className="mt-1.5 flex items-center gap-1.5 font-sans text-xs normal-case text-charcoal-muted">
                        <FileText className="h-3.5 w-3.5 text-brass" />
                        Hiển thị cho du khách đọc kèm khi nghe thuyết minh.
                      </span>
                      <textarea
                        value={guide.transcript}
                        onChange={(event) => updateGuideField('transcript', event.target.value)}
                        disabled={isDemo}
                        rows={8}
                        className="mt-2 w-full border border-paper-border bg-paper-warm px-3 py-3 font-sans text-sm leading-6 normal-case text-charcoal focus:border-brass focus:outline-none disabled:opacity-60 rounded-[2px]"
                        placeholder="Nhập lời dẫn của hướng dẫn viên..."
                      />
                    </label>

                    <label className="block font-mono text-[11px] uppercase tracking-wider text-charcoal-muted">
                      Thời lượng ghi chú
                      <input
                        value={guide.duration}
                        onChange={(event) => updateGuideField('duration', event.target.value)}
                        disabled={isDemo}
                        maxLength={32}
                        className="mt-1.5 w-full border border-paper-border bg-paper-warm px-3 py-2.5 font-mono text-sm normal-case text-charcoal focus:border-brass focus:outline-none disabled:opacity-60 rounded-[2px]"
                        placeholder="00:18"
                      />
                      <span className="mt-2 block font-sans text-xs normal-case leading-relaxed text-charcoal-muted">
                        Thời lượng thực tế sẽ được trình phát tự động nhận dạng từ tệp âm thanh.
                      </span>
                    </label>
                  </div>
                </>
              ) : (
                <div className="space-y-4">
                  <div className="border border-paper-border bg-paper-warm p-4 rounded-[2px] space-y-3">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <span className="block font-mono text-[10px] uppercase tracking-wider text-charcoal-muted">
                          Tiêu đề dịch ({activeLangInfo.label})
                        </span>
                        <p className="mt-1 font-serif text-base font-bold text-forest">
                          {activeTranslation?.audioGuideTitle || guide.title || 'Chưa có bản dịch tiêu đề'}
                        </p>
                      </div>
                      <div>
                        <span className="block font-mono text-[10px] uppercase tracking-wider text-charcoal-muted">
                          Người đọc / Hướng dẫn viên
                        </span>
                        <p className="mt-1 font-sans text-sm text-charcoal">
                          {activeTranslation?.audioGuideNarrator || guide.narrator || 'Hướng dẫn viên Viettoria'}
                        </p>
                      </div>
                    </div>

                    <div>
                      <span className="block font-mono text-[10px] uppercase tracking-wider text-charcoal-muted">
                        Bản chép lời dịch ({activeLangInfo.label})
                      </span>
                      <div className="mt-1.5 p-3.5 border border-paper-border bg-paper font-sans text-sm leading-relaxed text-charcoal max-h-56 overflow-y-auto rounded-[2px]">
                        {activeTranslation?.audioGuideTranscript || (
                          <span className="italic text-charcoal-muted">
                            Chưa có bản chép lời dịch riêng cho ngôn ngữ này. Hệ thống sẽ hiển thị bản tóm lược di sản khi khách truy cập.
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <p className="font-sans text-xs text-charcoal-muted">
                    💡 <em>Gợi ý:</em> Khi bạn tải lên bản thu âm cho <strong>{activeLangInfo.label}</strong>, tệp âm thanh này sẽ tự động được chọn và phát đúng khi du khách kích hoạt chế độ thuyết minh ở góc nhìn {activeLangInfo.label}.
                  </p>
                </div>
              )}
            </div>

            {/* Bottom Actions */}
            <div className="flex flex-col-reverse justify-between gap-3 border-t border-paper-border pt-4 sm:flex-row sm:items-center">
              <button
                type="button"
                onClick={() => void removeAllGuide()}
                disabled={
                  isDemo ||
                  saving ||
                  (!selectedProduct.audioGuide &&
                    !guide.audioUrl?.trim() &&
                    !guide.transcript.trim() &&
                    currentProductAudioCount === 0)
                }
                className="inline-flex items-center justify-center gap-2 px-3 py-2 font-sans text-xs uppercase tracking-wider text-terracotta transition-colors hover:bg-terracotta/5 disabled:cursor-not-allowed disabled:opacity-40 rounded-[2px]"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Gỡ toàn bộ audio guide
              </button>
              <button
                type="submit"
                disabled={isDemo || saving || uploading}
                className="inline-flex items-center justify-center gap-2 border border-forest bg-forest px-5 py-2.5 font-sans text-xs font-bold uppercase tracking-wider text-paper transition-colors hover:bg-brass hover:text-forest disabled:cursor-not-allowed disabled:opacity-50 shadow-sm rounded-[2px]"
              >
                {saving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
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
