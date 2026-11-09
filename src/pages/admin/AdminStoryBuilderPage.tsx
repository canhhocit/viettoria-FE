import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  ArrowUp, 
  ArrowDown, 
  BookOpen, 
  Clock, 
  Edit3, 
  ExternalLink, 
  Eye, 
  EyeOff, 
  FileText, 
  Image as ImageIcon, 
  Plus, 
  Sparkles, 
  Trash2, 
  X,
  Layers,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { adminApi } from '../../services/api';
import type { StoryBlock, Product, StoryBlockType, TimelineItem } from '../../types';
import { AdminImagePicker } from '../../components/admin/AdminImagePicker';
import { resolveImageUrl, handleImageFallback } from '../../utils/mediaResolver';
import { HeritageLoader } from '../../components/common/HeritageLoader';

interface BlockTypeMeta {
  type: StoryBlockType;
  label: string;
  shortLabel: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  badgeClass: string;
}

const BLOCK_TYPES: BlockTypeMeta[] = [
  {
    type: 'text_image',
    label: 'Kể Chuyện & Tư Liệu',
    shortLabel: 'Truyện & Ảnh',
    description: 'Bố cục 2 cột kinh điển: tự sự lịch sử song hành ảnh khảo cứu thực địa',
    icon: BookOpen,
    badgeClass: 'bg-forest/10 text-forest border-forest/30',
  },
  {
    type: 'text',
    label: 'Văn Bản Khảo Cứu',
    shortLabel: 'Văn Bản',
    description: 'Bài viết tự sự lịch sử chuyên sâu với chữ khởi đầu drop-cap trang trọng',
    icon: FileText,
    badgeClass: 'bg-paper-warm text-charcoal border-paper-border',
  },
  {
    type: 'image',
    label: 'Hình Ảnh Đơn Khổ Lớn',
    shortLabel: 'Ảnh Toàn Cảnh',
    description: 'Khung ảnh di sản khổ rộng với chú thích nguồn gốc và niên đại',
    icon: ImageIcon,
    badgeClass: 'bg-paper-warm text-charcoal border-paper-border',
  },
  {
    type: 'timeline',
    label: 'Tiến Trình Niên Đại',
    shortLabel: 'Dòng Thời Gian',
    description: 'Dòng thời gian dọc ghi nhận các mốc hưng thịnh và biến thiên',
    icon: Clock,
    badgeClass: 'bg-brass/15 text-brass-dark border-brass/40',
  },
  {
    type: 'highlight',
    label: 'Điểm Nhấn Độc Bản',
    shortLabel: 'Điểm Nhấn',
    description: 'Khung vàng son làm nổi bật triết lý kiến trúc hoặc thông số đắt giá',
    icon: Sparkles,
    badgeClass: 'bg-terracotta/10 text-terracotta border-terracotta/30',
  },
];

export const AdminStoryBuilderPage: React.FC = () => {
  const isDemo = adminApi.isDemoSession();
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [stories, setStories] = useState<StoryBlock[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingBlock, setEditingBlock] = useState<Partial<StoryBlock> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);

  const loadData = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const prod = await adminApi.getProductById(id);
      setProduct(prod);
      const rawStories = prod.storyBlocks || [];
      const cleanStories = rawStories.filter(b => b.type !== 'assembly');
      setStories(cleanStories);

      // Tự động dọn dẹp các khối mộng gài/assembly cũ khỏi CSDL nếu có
      if (!isDemo) {
        const assemblyBlocks = rawStories.filter(b => b.type === 'assembly');
        for (const ab of assemblyBlocks) {
          void adminApi.deleteStory(ab.id).catch(() => {});
        }
      }
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không tải được nội dung tác phẩm.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, [id]);

  const handleOpenAdd = (type: StoryBlockType) => {
    setIsAddMenuOpen(false);
    setEditingBlock({
      productId: id,
      type,
      title: '',
      subtitle: '',
      content: '',
      mediaUrl: '',
      mediaCaption: '',
      highlightBadge: type === 'highlight' ? 'Kiến Trúc Độc Bản' : undefined,
      timelineItems: type === 'timeline' ? [
        { year: '1049', event: 'Khởi Dựng Công Trình', detail: 'Ghi chép lịch sử khởi công.' },
      ] : undefined,
      displayOrder: stories.length + 1,
      status: 'published',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (block: StoryBlock) => {
    setEditingBlock({
      ...block,
      timelineItems: block.timelineItems ? [...block.timelineItems] : undefined,
    });
    setIsModalOpen(true);
  };

  const handleSaveBlock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBlock || !editingBlock.title?.trim() || !id) return;

    setSaving(true);
    setError(null);
    try {
      if (editingBlock.id) {
        await adminApi.updateStory(editingBlock.id, editingBlock);
      } else {
        await adminApi.createStory(id, editingBlock);
      }
      setIsModalOpen(false);
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không lưu được khối nội dung.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteBlock = async (block: StoryBlock) => {
    if (window.confirm(`Xóa vĩnh viễn khối câu chuyện “${block.title}”?`)) {
      setError(null);
      try {
        await adminApi.deleteStory(block.id);
        await loadData();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Không xóa được khối nội dung.');
      }
    }
  };

  const handleToggleStatus = async (block: StoryBlock) => {
    const newStatus = block.status === 'published' ? 'hidden' : 'published';
    setError(null);
    try {
      await adminApi.updateStory(block.id, { status: newStatus });
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không đổi được trạng thái khối nội dung.');
    }
  };

  const handleMove = async (index: number, direction: 'up' | 'down') => {
    if (!id) return;
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= stories.length) return;

    const previousStories = stories;
    const newStories = [...stories];
    const temp = newStories[index];
    newStories[index] = newStories[targetIndex];
    newStories[targetIndex] = temp;

    setStories(newStories);
    const blockIds = newStories.map(s => s.id);
    setError(null);
    try {
      await adminApi.reorderStories(id, blockIds);
    } catch (err) {
      setStories(previousStories);
      setError(err instanceof Error ? err.message : 'Không đổi được thứ tự khối nội dung.');
    }
  };

  const getBlockMeta = (type: StoryBlockType): BlockTypeMeta => {
    return BLOCK_TYPES.find(b => b.type === type) || BLOCK_TYPES[0];
  };

  // Timeline item helpers for the editor
  const handleAddTimelineItem = () => {
    if (!editingBlock) return;
    const current = editingBlock.timelineItems || [];
    setEditingBlock({
      ...editingBlock,
      timelineItems: [...current, { year: 'Năm...', event: 'Sự kiện mốc son', detail: 'Chi tiết bối cảnh biến thiên.' }],
    });
  };

  const handleUpdateTimelineItem = (index: number, field: keyof TimelineItem, val: string) => {
    if (!editingBlock?.timelineItems) return;
    const updated = [...editingBlock.timelineItems];
    updated[index] = { ...updated[index], [field]: val };
    setEditingBlock({ ...editingBlock, timelineItems: updated });
  };

  const handleRemoveTimelineItem = (index: number) => {
    if (!editingBlock?.timelineItems) return;
    const updated = editingBlock.timelineItems.filter((_, i) => i !== index);
    setEditingBlock({ ...editingBlock, timelineItems: updated });
  };

  return (
    <div className="space-y-6">
      {/* 1. TOP BREADCRUMB & BACK LINK */}
      <div className="flex items-center justify-between border-b border-paper-border pb-3">
        <Link
          to="/admin/products"
          className="inline-flex items-center gap-1.5 font-sans text-xs uppercase tracking-wider text-charcoal-muted transition-colors hover:text-forest"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Danh Mục Tác Phẩm</span>
          <span className="text-paper-border">/</span>
          <span className="text-forest font-semibold">Story Studio</span>
        </Link>

        {product?.slug && (
          <Link
            to={`/products/${product.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[11px] font-sans text-charcoal-muted transition-colors hover:text-forest"
          >
            <span>Xem trang công khai</span>
            <ExternalLink className="h-3 w-3" />
          </Link>
        )}
      </div>

      {/* 2. PRODUCT HERO SUMMARY BANNER */}
      <div className="relative border border-paper-border bg-paper p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
          {/* Left: Product Thumbnail & Details */}
          <div className="flex items-center gap-4">
            <div className="relative h-18 w-18 sm:h-20 sm:w-20 shrink-0 overflow-hidden border border-brass/50 bg-forest-dark">
              <img
                src={resolveImageUrl(product?.heroImage)}
                alt={product?.name || 'Tác phẩm'}
                onError={handleImageFallback}
                className="h-full w-full object-cover"
              />
              <span className="absolute bottom-0 inset-x-0 bg-forest/90 py-0.5 text-center font-cinzel text-[9px] uppercase tracking-wider text-brass font-bold">
                {product?.code || 'DI SẢN'}
              </span>
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="border border-brass/40 bg-paper-warm px-2 py-0.5 font-cinzel text-[10px] uppercase tracking-wider text-brass-dark font-semibold">
                  {product?.epoch || 'Triều đại lịch sử'}
                </span>
                <span className="font-sans text-xs text-charcoal-muted">
                  {product?.collection?.name || 'Bộ sưu tập độc bản'}
                </span>
              </div>

              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-forest leading-tight">
                {product?.name || 'Đang tải tác phẩm...'}
              </h1>

              <div className="flex items-center gap-3 font-sans text-xs text-charcoal-muted pt-0.5">
                <span>Mã: <strong className="font-cinzel text-charcoal font-bold tracking-wider">{product?.code}</strong></span>
                <span>•</span>
                <span>Khối câu chuyện: <strong className="text-forest font-semibold">{stories.length} khối</strong></span>
              </div>
            </div>
          </div>

          {/* Right: Primary Action / Add Block */}
          {!isDemo && (
            <div className="relative self-stretch sm:self-center">
              <button
                type="button"
                onClick={() => setIsAddMenuOpen(!isAddMenuOpen)}
                className="inline-flex w-full sm:w-auto items-center justify-center gap-2 border border-forest bg-forest px-5 py-2.5 font-sans text-xs font-bold uppercase tracking-wider text-paper transition-all hover:bg-brass shadow-sm"
              >
                <Plus className="h-4 w-4 text-brass" />
                <span>Thêm Khối Câu Chuyện</span>
              </button>

              {/* Add Menu Dropdown */}
              {isAddMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-20"
                    onClick={() => setIsAddMenuOpen(false)}
                  />
                  <div className="absolute right-0 top-full z-30 mt-2 w-80 border border-brass bg-paper p-2 shadow-xl">
                    <p className="px-3 py-1.5 font-cinzel text-[10px] uppercase tracking-widest text-charcoal-muted border-b border-paper-border font-bold">
                      Chọn cấu trúc khối
                    </p>
                    <div className="space-y-1 pt-1">
                      {BLOCK_TYPES.map((item) => {
                        const Icon = item.icon;
                        return (
                          <button
                            key={item.type}
                            type="button"
                            onClick={() => handleOpenAdd(item.type)}
                            className="flex w-full items-start gap-3 p-2.5 text-left transition-colors hover:bg-paper-warm group"
                          >
                            <div className="mt-0.5 border border-paper-border bg-paper p-1.5 text-brass group-hover:border-brass">
                              <Icon className="h-4 w-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-serif text-xs font-bold text-forest group-hover:text-brass">
                                {item.label}
                              </p>
                              <p className="font-sans text-[11px] text-charcoal-muted line-clamp-1">
                                {item.description}
                              </p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Quick Block Type Segmented Ribbon */}
        {!isDemo && (
          <div className="mt-5 pt-4 border-t border-paper-border">
            <p className="font-cinzel text-[10px] uppercase tracking-widest text-charcoal-muted mb-2.5 flex items-center gap-1.5 font-bold">
              <Layers className="h-3 w-3 text-brass" />
              <span>Thêm nhanh theo loại cấu kiện:</span>
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
              {BLOCK_TYPES.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.type}
                    type="button"
                    onClick={() => handleOpenAdd(item.type)}
                    className="flex items-center gap-2 border border-paper-border bg-paper-warm/60 px-3 py-2 text-left font-sans text-xs font-medium text-charcoal transition-all hover:border-brass hover:bg-paper hover:text-forest shadow-2xs"
                  >
                    <Icon className="h-3.5 w-3.5 shrink-0 text-brass" />
                    <span className="truncate">{item.shortLabel}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Global Error Banner */}
      {error && (
        <div role="alert" className="flex items-start gap-2 border border-terracotta/40 bg-terracotta/10 p-3 text-sm text-terracotta font-mono">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* 3. STORYBOARD FEED (THE STORY BLOCKS) */}
      {loading ? (
        <HeritageLoader
          variant="section"
          size="md"
          message="Đang tải dòng thời gian câu chuyện di sản..."
          submessage="Hệ thống quản trị di sản Viettoria"
        />
      ) : stories.length === 0 ? (
        /* Empty State */
        <div className="border border-dashed border-paper-border bg-paper p-10 sm:p-14 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center border border-brass/40 bg-paper-warm text-brass">
            <BookOpen className="h-6 w-6" />
          </div>
          <h3 className="font-serif text-xl font-bold text-forest">Chưa có khối Story nào cho tác phẩm này</h3>
          <p className="mx-auto mt-1.5 max-w-md font-mono text-xs text-charcoal-muted leading-relaxed">
            Hãy bắt đầu xây dựng chiều sâu di sản cho tác phẩm bằng cách thêm khối văn bản khảo cứu, hình ảnh thực địa hoặc niên đại lịch sử.
          </p>
          {!isDemo && (
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <button
                type="button"
                onClick={() => handleOpenAdd('text_image')}
                className="border border-forest bg-forest px-4 py-2 font-sans text-xs font-bold uppercase tracking-wider text-paper hover:bg-brass transition-colors"
              >
                + Khối Kể Chuyện & Ảnh
              </button>
              <button
                type="button"
                onClick={() => handleOpenAdd('timeline')}
                className="border border-paper-border bg-paper-warm px-4 py-2 font-sans text-xs uppercase tracking-wider text-forest hover:border-brass transition-colors"
              >
                + Khối Tiến Trình Lịch Sử
              </button>
            </div>
          )}
        </div>
      ) : (
        /* The Narrative Flow / Storyboard Timeline */
        <div className="relative space-y-4">
          {stories.map((block, idx) => {
            const meta = getBlockMeta(block.type);
            const Icon = meta.icon;
            const isHidden = block.status === 'hidden';
            const isSelected = editingBlock?.id === block.id;
            const hasMedia = Boolean(block.mediaUrl && block.mediaUrl.trim());

            return (
              <article
                key={block.id}
                className={`relative flex flex-col sm:flex-row items-stretch border transition-all ${
                  isHidden
                    ? 'border-paper-border/70 bg-paper-warm/40 opacity-60'
                    : isSelected
                      ? 'border-brass bg-paper-card ring-1 ring-brass shadow-xs'
                      : 'border-paper-border bg-paper hover:border-brass/80 shadow-xs'
                }`}
              >
                {/* Step / Index Spine Indicator */}
                <div className="flex sm:flex-col items-center justify-between sm:justify-start gap-2 border-b sm:border-b-0 sm:border-r border-paper-border bg-paper-warm/50 px-4 py-3 sm:w-20 sm:shrink-0 sm:text-center">
                  <div className="flex items-center gap-2 sm:flex-col">
                    <span className="font-serif text-lg sm:text-xl font-bold text-forest">
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    <span className="font-cinzel text-[9px] uppercase tracking-widest text-charcoal-muted font-bold">
                      THỨ TỰ
                    </span>
                  </div>

                  <div className="border border-paper-border bg-paper p-1 text-brass hidden sm:block">
                    <Icon className="h-3.5 w-3.5" />
                  </div>
                </div>

                {/* Card Body */}
                <div className="flex flex-1 flex-col justify-between p-4 sm:p-5">
                  <div className="space-y-3">
                    {/* Header Row: Type Badge, Era, Status */}
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-paper-border/60 pb-2.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`inline-flex items-center gap-1.5 border px-2 py-0.5 font-sans text-[11px] uppercase tracking-wider font-semibold ${meta.badgeClass}`}>
                          <Icon className="h-3 w-3" />
                          <span>{meta.label}</span>
                        </span>

                        {block.subtitle && (
                          <span className="font-serif italic text-xs text-brass-dark">
                            • {block.subtitle}
                          </span>
                        )}
                      </div>

                      {/* Status indicator */}
                      <span className={`inline-flex items-center gap-1.5 font-sans text-xs ${
                        !isHidden ? 'text-forest font-medium' : 'text-charcoal-muted'
                      }`}>
                        <span className={`h-1.5 w-1.5 rounded-none ${!isHidden ? 'bg-forest' : 'bg-charcoal-muted'}`} />
                        <span>{!isHidden ? 'Đang hiển thị' : 'Đang ẩn'}</span>
                      </span>
                    </div>

                    {/* Main Content with Optional Media Thumbnail */}
                    <div className="flex flex-col md:flex-row gap-4 items-start">
                      {/* Thumbnail Preview for Media-capable Blocks */}
                      {hasMedia && (
                        <div className="group/thumb relative h-24 w-full md:w-36 shrink-0 overflow-hidden border border-paper-border bg-paper-warm">
                          <img
                            src={resolveImageUrl(block.mediaUrl)}
                            alt={block.mediaCaption || block.title}
                            onError={handleImageFallback}
                            className="h-full w-full object-cover transition-transform duration-300 group-hover/thumb:scale-105"
                          />
                          <span className="absolute bottom-1 right-1 bg-forest/80 px-1 py-0.5 font-cinzel text-[8px] uppercase tracking-wider text-brass font-bold">
                            Tư Liệu
                          </span>
                        </div>
                      )}

                      {/* Text & Metadata */}
                      <div className="flex-1 min-w-0 space-y-1.5">
                        <h3
                          onClick={() => !isDemo && handleOpenEdit(block)}
                          className="font-serif text-base sm:text-lg font-bold text-forest transition-colors hover:text-brass cursor-pointer"
                          title="Nhấp để chỉnh sửa"
                        >
                          {block.title}
                        </h3>

                        {block.content && (
                          <p className="font-sans text-xs sm:text-[13px] text-charcoal/85 font-normal leading-relaxed line-clamp-2">
                            {block.content}
                          </p>
                        )}

                        {/* Special Block Previews */}
                        {block.type === 'timeline' && block.timelineItems && block.timelineItems.length > 0 && (
                          <div className="mt-2 flex flex-wrap items-center gap-1.5 pt-1">
                            <span className="font-sans text-xs text-charcoal-muted">Các mốc son:</span>
                            {block.timelineItems.slice(0, 4).map((item, tIdx) => (
                              <span key={tIdx} className="border border-paper-border bg-paper-warm px-1.5 py-0.5 font-cinzel text-[11px] font-bold text-brass-dark tracking-wider">
                                {item.year}
                              </span>
                            ))}
                            {block.timelineItems.length > 4 && (
                              <span className="font-sans text-xs text-charcoal-muted">
                                +{block.timelineItems.length - 4} mốc khác
                              </span>
                            )}
                          </div>
                        )}

                        {block.type === 'highlight' && block.highlightBadge && (
                          <div className="mt-1">
                            <span className="border border-brass/50 bg-brass/10 px-2 py-0.5 font-cinzel text-[10px] uppercase tracking-wider text-brass-dark font-bold">
                              ★ {block.highlightBadge}
                            </span>
                          </div>
                        )}

                        {block.mediaCaption && (
                          <p className="font-sans text-xs italic text-charcoal-muted pt-0.5">
                            Chú thích: {block.mediaCaption}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions Toolbar */}
                  {!isDemo && (
                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-paper-border/60 pt-3">
                      {/* Left: Move order buttons */}
                      <div className="flex items-center gap-1 font-sans text-xs">
                        <span className="text-xs text-charcoal-muted mr-1">Thứ tự:</span>
                        <button
                          type="button"
                          onClick={() => handleMove(idx, 'up')}
                          disabled={idx === 0}
                          className="inline-flex items-center gap-1 border border-paper-border bg-paper px-2 py-1 text-xs text-charcoal hover:border-brass disabled:opacity-30 disabled:hover:border-paper-border transition-colors"
                          title="Đẩy lên trước"
                        >
                          <ArrowUp className="h-3 w-3" />
                          <span className="hidden sm:inline">Lên</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleMove(idx, 'down')}
                          disabled={idx === stories.length - 1}
                          className="inline-flex items-center gap-1 border border-paper-border bg-paper px-2 py-1 text-xs text-charcoal hover:border-brass disabled:opacity-30 disabled:hover:border-paper-border transition-colors"
                          title="Đẩy xuống sau"
                        >
                          <ArrowDown className="h-3 w-3" />
                          <span className="hidden sm:inline">Xuống</span>
                        </button>
                      </div>

                      {/* Right: Visibility, Edit, Delete */}
                      <div className="flex items-center gap-2 font-sans text-xs">
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(block)}
                          className={`inline-flex items-center gap-1.5 border px-2.5 py-1 text-xs transition-colors ${
                            !isHidden
                              ? 'border-forest/30 bg-forest/5 text-forest hover:bg-forest/15'
                              : 'border-paper-border bg-paper text-charcoal-muted hover:text-charcoal'
                          }`}
                          title={!isHidden ? 'Nhấn để ẩn khối này' : 'Nhấn để hiển thị khối này'}
                        >
                          {!isHidden ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                          <span>{!isHidden ? 'Hiển thị' : 'Đang ẩn'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleOpenEdit(block)}
                          className="inline-flex items-center gap-1.5 border border-forest bg-forest/5 px-2.5 py-1 text-xs font-semibold text-forest transition-colors hover:border-brass hover:bg-forest hover:text-paper"
                          title="Chỉnh sửa nội dung khối"
                        >
                          <Edit3 className="h-3 w-3 text-brass" />
                          <span>Chỉnh sửa</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteBlock(block)}
                          className="inline-flex items-center gap-1 border border-paper-border px-2 py-1 text-xs text-terracotta hover:border-terracotta hover:bg-terracotta/5 transition-colors"
                          title="Xóa vĩnh viễn khối này"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* 4. MODAL BIÊN TẬP KHỐI (EDITORIAL WORKBENCH MODAL) */}
      {!isDemo && isModalOpen && editingBlock && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-forest-dark/80 p-4 backdrop-blur-xs">
          <div className="relative my-auto flex max-h-[92vh] w-full max-w-3xl flex-col border border-brass bg-paper p-6 sm:p-8 shadow-2xl">
            {/* Modal Close Button */}
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="absolute right-4 top-4 p-1 text-charcoal-muted transition-colors hover:text-charcoal"
              aria-label="Đóng bảng chỉnh sửa"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Modal Header */}
            {(() => {
              const ModalMeta = getBlockMeta(editingBlock.type || 'text');
              const ModalIcon = ModalMeta.icon;
              return (
                <div className="border-b border-paper-border pb-4 pr-8">
                  <div className="flex items-center gap-2 font-cinzel text-[11px] uppercase tracking-widest text-brass font-bold">
                    <ModalIcon className="h-4 w-4 text-brass" />
                    <span>{ModalMeta.label}</span>
                  </div>
                  <h2 className="font-serif text-2xl font-bold text-forest mt-1">
                    {editingBlock.id ? 'Biên Tập Khối Câu Chuyện' : 'Khởi Tạo Khối Nội Dung Mới'}
                  </h2>
                </div>
              );
            })()}

            {/* Modal Form */}
            <form onSubmit={handleSaveBlock} className="flex-1 overflow-y-auto space-y-5 py-4 font-sans text-xs">
              {/* Type Switcher Selector */}
              <div>
                <label className="block text-charcoal-muted uppercase mb-1.5 font-semibold tracking-wider">
                  Định Dạng Khối
                </label>
                <div className="flex flex-wrap gap-2">
                  {BLOCK_TYPES.map((item) => {
                    const isSelected = editingBlock.type === item.type;
                    const Icon = item.icon;
                    return (
                      <button
                        type="button"
                        key={item.type}
                        onClick={() => setEditingBlock({ ...editingBlock, type: item.type })}
                        className={`inline-flex items-center gap-2 border px-2.5 py-1.5 text-left transition-colors ${
                          isSelected
                            ? 'border-brass bg-paper-card text-forest ring-1 ring-brass'
                            : 'border-paper-border bg-paper-warm text-charcoal hover:border-brass/70'
                        }`}
                      >
                        <Icon className={`h-3.5 w-3.5 shrink-0 ${isSelected ? 'text-brass' : 'text-charcoal-muted'}`} />
                        <span className="truncate text-xs font-medium">{item.shortLabel}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Title & Subtitle */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-charcoal-muted uppercase mb-1 font-semibold tracking-wider">
                    Tiêu Đề Khối <span className="text-terracotta">*</span>
                  </label>
                  <input
                    type="text"
                    value={editingBlock.title || ''}
                    onChange={(e) => setEditingBlock({ ...editingBlock, title: e.target.value })}
                    placeholder="Ví dụ: Điềm Lành Đóa Sen & Giấc Mơ Của Vua Lý"
                    className="w-full border border-paper-border bg-paper-warm px-3 py-2 font-serif text-sm font-bold text-forest focus:border-brass focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-charcoal-muted uppercase mb-1 font-semibold tracking-wider">
                    Niên Hiệu / Nhãn Phụ
                  </label>
                  <input
                    type="text"
                    value={editingBlock.subtitle || ''}
                    onChange={(e) => setEditingBlock({ ...editingBlock, subtitle: e.target.value })}
                    placeholder="Niên hiệu Sùng Hưng (1049)"
                    className="w-full border border-paper-border bg-paper-warm px-3 py-2 text-xs text-charcoal focus:border-brass focus:outline-none"
                  />
                </div>
              </div>

              {/* Highlight Badge (if type is highlight) */}
              {editingBlock.type === 'highlight' && (
                <div>
                  <label className="block text-charcoal-muted uppercase mb-1 font-semibold tracking-wider">
                    Huy Hiệu Điểm Nhấn
                  </label>
                  <input
                    type="text"
                    value={editingBlock.highlightBadge || ''}
                    onChange={(e) => setEditingBlock({ ...editingBlock, highlightBadge: e.target.value })}
                    placeholder="Kiến Trúc Độc Bản"
                    className="w-full border border-paper-border bg-paper-warm px-3 py-2 text-xs text-charcoal focus:border-brass focus:outline-none"
                  />
                </div>
              )}

              {/* Content Textarea */}
              <div>
                <label className="block text-charcoal-muted uppercase mb-1 font-semibold tracking-wider">
                  Nội Dung Tự Sự / Khảo Cứu <span className="text-terracotta">*</span>
                </label>
                <textarea
                  rows={5}
                  value={editingBlock.content || ''}
                  onChange={(e) => setEditingBlock({ ...editingBlock, content: e.target.value })}
                  placeholder="Ghi lại câu chuyện lịch sử, khảo cứu chi tiết kiến trúc, hoa văn hoặc huyền tích..."
                  className="w-full border border-paper-border bg-paper-warm p-3 font-sans text-xs leading-relaxed text-charcoal focus:border-brass focus:outline-none"
                  required
                />
              </div>

              {/* Media Picker for Image-compatible blocks */}
              {(editingBlock.type === 'image' || editingBlock.type === 'text_image' || editingBlock.type === 'highlight') && (
                <div className="border border-paper-border bg-paper p-4 space-y-3">
                  <AdminImagePicker
                    label="Hình Ảnh Tư Liệu / Hiện Vật Thực Địa"
                    value={editingBlock.mediaUrl || ''}
                    onChange={(url) => setEditingBlock({ ...editingBlock, mediaUrl: url })}
                    placeholder="Dán liên kết ảnh tại đây"
                  />

                  <div>
                    <label className="block text-xs font-sans text-charcoal-muted uppercase mb-1 font-semibold tracking-wider">
                      Chú Thích Ảnh (Caption)
                    </label>
                    <input
                      type="text"
                      value={editingBlock.mediaCaption || ''}
                      onChange={(e) => setEditingBlock({ ...editingBlock, mediaCaption: e.target.value })}
                      placeholder="Bản vẽ phục dựng kết cấu xà nách 8 cánh vươn..."
                      className="w-full border border-paper-border bg-paper-warm px-3 py-1.5 text-xs text-charcoal focus:border-brass focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {/* Interactive Timeline Items Editor */}
              {editingBlock.type === 'timeline' && (
                <div className="border border-paper-border bg-paper p-4 space-y-3">
                  <div className="flex items-center justify-between border-b border-paper-border pb-2">
                    <span className="font-cinzel text-xs uppercase text-brass font-bold flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>Các Mốc Niên Đại Lịch Sử</span>
                    </span>
                    <button
                      type="button"
                      onClick={handleAddTimelineItem}
                      className="border border-paper-border bg-paper-warm px-2.5 py-1 font-sans text-xs font-medium text-forest hover:border-brass transition-colors"
                    >
                      + Thêm mốc năm
                    </button>
                  </div>

                  {(!editingBlock.timelineItems || editingBlock.timelineItems.length === 0) ? (
                    <p className="text-center py-4 font-sans text-xs text-charcoal-muted">
                      Chưa có mốc thời gian nào. Hãy nhấn nút "+ Thêm mốc năm" phía trên.
                    </p>
                  ) : (
                    <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                      {editingBlock.timelineItems.map((item, tIdx) => (
                        <div key={tIdx} className="flex items-start gap-2 border border-paper-border/80 bg-paper-warm p-2.5">
                          <input
                            type="text"
                            value={item.year}
                            onChange={(e) => handleUpdateTimelineItem(tIdx, 'year', e.target.value)}
                            placeholder="Năm (1049)"
                            className="w-20 border border-paper-border bg-paper px-2 py-1 font-cinzel text-xs text-brass-dark font-bold focus:border-brass focus:outline-none tracking-wider"
                          />
                          <div className="flex-1 space-y-1.5">
                            <input
                              type="text"
                              value={item.event}
                              onChange={(e) => handleUpdateTimelineItem(tIdx, 'event', e.target.value)}
                              placeholder="Tên sự kiện / Biến thiên"
                              className="w-full border border-paper-border bg-paper px-2 py-1 font-serif text-xs font-semibold text-forest focus:border-brass focus:outline-none"
                            />
                            <textarea
                              rows={2}
                              value={item.detail}
                              onChange={(e) => handleUpdateTimelineItem(tIdx, 'detail', e.target.value)}
                              placeholder="Chi tiết bối cảnh lịch sử..."
                              className="w-full border border-paper-border bg-paper p-1.5 font-sans text-xs text-charcoal focus:border-brass focus:outline-none"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveTimelineItem(tIdx)}
                            className="p-1 text-charcoal-muted hover:text-terracotta"
                            title="Xóa mốc này"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Status Selector */}
              <div className="flex items-center gap-4 pt-1">
                <label className="text-charcoal-muted uppercase">Trạng Thái Hiển Thị:</label>
                <div className="flex items-center gap-3">
                  <label className="inline-flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      value="published"
                      checked={editingBlock.status === 'published'}
                      onChange={() => setEditingBlock({ ...editingBlock, status: 'published' })}
                      className="accent-forest"
                    />
                    <span className="font-semibold text-forest">Xuất bản công khai</span>
                  </label>
                  <label className="inline-flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      value="hidden"
                      checked={editingBlock.status === 'hidden'}
                      onChange={() => setEditingBlock({ ...editingBlock, status: 'hidden' })}
                      className="accent-forest"
                    />
                    <span className="text-charcoal-muted">Lưu tạm (Ẩn)</span>
                  </label>
                </div>
              </div>

              {/* Modal Buttons */}
              <div className="flex justify-end gap-3 border-t border-paper-border pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="border border-paper-border px-4 py-2 font-sans text-xs uppercase font-medium text-charcoal hover:bg-paper-warm transition-colors"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-forest px-6 py-2 font-sans text-xs font-bold uppercase tracking-wider text-paper hover:bg-brass transition-colors disabled:opacity-50 shadow-sm"
                >
                  {saving ? 'Đang lưu…' : 'Lưu Khối Nội Dung'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminStoryBuilderPage;
