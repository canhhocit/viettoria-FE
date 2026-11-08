import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { 
  MapPin, 
  Ruler, 
  CheckCircle,
  Check,
  Copy,
  Download,
  QrCode,
  Share2,
  X,
} from 'lucide-react';
import { publicApi } from '../services/api';
import type { Product } from '../types';
import { ArchitecturalViewer } from '../components/common/ArchitecturalViewer';
import { AudioPlayer } from '../components/common/AudioPlayer';
import { StoryBlockRenderer } from '../components/story/StoryBlockRenderer';
import { ScaleRuler } from '../components/common/ScaleRuler';
import { PageLoadingHeritage } from '../components/common/HeritageSkeleton';
import { resolveImageUrl, handleImageFallback } from '../utils/mediaResolver';

export const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [searchParams] = useSearchParams();
  const codeParam = searchParams.get('code');
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [qrImage, setQrImage] = useState('');
  const [qrLoading, setQrLoading] = useState(false);
  const [qrError, setQrError] = useState('');
  const [shareMessage, setShareMessage] = useState('');

  useEffect(() => {
    if (slug) {
      setLoading(true);
      publicApi.getProductBySlugOrCode(slug).then((data) => {
        setProduct(data);
        setLoading(false);
      });
    }
  }, [slug]);

  const shareUrl = product
    ? new URL(`/products/${encodeURIComponent(product.slug)}`, window.location.origin).toString()
    : '';

  useEffect(() => {
    if (!isShareOpen || !shareUrl) return;

    let isActive = true;
    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsShareOpen(false);
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);
    setQrLoading(true);
    setQrImage('');
    setQrError('');
    setShareMessage('');

    const generateQrCode = async () => {
      try {
        const { default: QRCode } = await import('qrcode');
        const image = await QRCode.toDataURL(shareUrl, {
          errorCorrectionLevel: 'H',
          margin: 2,
          width: 280,
          color: { dark: '#142820', light: '#FAF7F0' },
        });
        if (isActive) setQrImage(image);
      } catch {
        if (isActive) setQrError('Chưa tạo được mã QR. Vui lòng thử lại.');
      } finally {
        if (isActive) setQrLoading(false);
      }
    };
    void generateQrCode();

    return () => {
      isActive = false;
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isShareOpen, shareUrl]);

  const copyShareLink = async () => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareUrl);
      } else {
        const input = document.createElement('textarea');
        input.value = shareUrl;
        input.style.position = 'fixed';
        input.style.opacity = '0';
        document.body.appendChild(input);
        input.select();
        const copied = document.execCommand('copy');
        input.remove();
        if (!copied) throw new Error('Copy failed');
      }
      setShareMessage('Đã sao chép liên kết.');
    } catch {
      setShareMessage('Không sao chép được liên kết. Vui lòng thử lại.');
    }
  };

  const downloadQrCode = () => {
    if (!qrImage || !product) return;
    const link = document.createElement('a');
    link.href = qrImage;
    link.download = `viettoria-${product.slug || 'tac-pham'}-qr.png`;
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  if (loading) {
    return <PageLoadingHeritage message="Đang tải dữ liệu..." />;
  }

  if (!product) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-paper text-center px-4">
        <h2 className="font-serif text-2xl font-bold text-forest mb-2">Không tìm thấy tác phẩm di sản</h2>
        <p className="text-sm text-charcoal-muted mb-6">Mã tác phẩm hoặc đường dẫn không hợp lệ.</p>
        <Link to="/products" className="px-5 py-2.5 bg-forest text-paper font-mono text-xs uppercase tracking-wider">
          Xem danh mục tác phẩm
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-paper min-h-screen py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Đường dẫn điều hướng" className="flex items-center gap-2 text-xs font-mono text-charcoal-muted uppercase tracking-wider">
          <Link to="/" className="hover:text-forest transition-colors">Trang Chủ</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-forest transition-colors">Tác Phẩm</Link>
          <span>/</span>
          <span className="text-brass font-bold">{product.name}</span>
        </nav>

        {/* QR Deep-link Welcome Toast/Banner (When code parameter is present) */}
        {codeParam && (
          <div className="p-4 sm:p-5 bg-forest text-paper border border-brass corner-frame flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl animate-fadeIn">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 flex-none bg-brass text-forest flex items-center justify-center font-bold">
                <CheckCircle className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs uppercase tracking-wider text-brass font-bold">
                    Xác Thực Thành Công Tem QR Di Sản Độc Bản
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-paper/90 font-normal mt-0.5">
                  Chào mừng bạn đến với mô hình <strong className="font-semibold text-brass-subtle">{product.name}</strong> trên tay bạn! Không gian số và Audio Guide độc quyền đã được mở khóa.
                </p>
              </div>
            </div>

            <div className="text-[11px] font-mono text-brass-subtle uppercase tracking-widest shrink-0">
              Định Danh Vật Lý 1:120
            </div>
          </div>
        )}

        {/* Product Identity Header */}
        <div className="space-y-4 max-w-4xl">
          <div className="flex flex-wrap items-center gap-3">
            <span className="px-3 py-1 bg-paper-warm border border-paper-border text-forest text-xs uppercase tracking-wider font-medium">
              {product.epoch}
            </span>
            <span className="flex items-center gap-1.5 text-xs text-charcoal-muted">
              <MapPin className="w-3.5 h-3.5 text-brass" />
              <span>{product.location}</span>
            </span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-forest">
            {product.name}
          </h1>

          <p className="font-serif italic text-brass-dark text-lg sm:text-xl">
            {product.subName}
          </p>

          <p className="text-base sm:text-lg text-charcoal/85 font-normal leading-relaxed max-w-3xl">
            {product.shortDescription}
          </p>

          <button
            type="button"
            onClick={() => setIsShareOpen(true)}
            className="inline-flex items-center gap-2 border border-paper-border bg-paper-warm px-4 py-2.5 text-xs font-mono uppercase tracking-wider text-forest transition-colors hover:border-brass hover:bg-paper"
          >
            <Share2 className="h-4 w-4 text-brass" />
            Chia sẻ tác phẩm
          </button>
        </div>

        {isShareOpen && (
          <div
            className="fixed inset-0 z-[70] flex items-center justify-center bg-forest-dark/65 p-4 backdrop-blur-sm"
            onMouseDown={(event) => { if (event.target === event.currentTarget) setIsShareOpen(false); }}
          >
            <section
              role="dialog"
              aria-modal="true"
              aria-labelledby="product-share-title"
              className="relative max-h-[90vh] w-full max-w-md overflow-y-auto border border-brass/70 bg-paper p-5 shadow-2xl sm:p-7"
            >
              <button
                type="button"
                onClick={() => setIsShareOpen(false)}
                aria-label="Đóng cửa sổ chia sẻ"
                className="absolute right-3 top-3 p-1.5 text-charcoal-muted transition-colors hover:text-forest"
              >
                <X className="h-5 w-5" />
              </button>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-brass">Viettoria · Di sản Việt</p>
              <h2 id="product-share-title" className="mt-2 pr-8 font-serif text-2xl font-bold text-forest">Chia sẻ tác phẩm</h2>
              <p className="mt-1 text-sm text-charcoal-muted">{product.name}</p>

              <div className="my-5 flex min-h-52 items-center justify-center border border-paper-border bg-paper-warm p-4">
                {qrLoading ? (
                  <div className="flex flex-col items-center gap-3 text-xs text-charcoal-muted" role="status">
                    <QrCode className="h-8 w-8 animate-pulse text-brass" />
                    <span>Đang tạo mã QR…</span>
                  </div>
                ) : qrImage ? (
                  <img src={qrImage} alt={`Mã QR mở trang ${product.name}`} className="h-48 w-48 border border-paper-border bg-paper p-2" />
                ) : (
                  <p role="status" className="text-center text-xs text-charcoal-muted">{qrError || 'Chưa tạo được mã QR.'}</p>
                )}
              </div>

              <div className="grid gap-2 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => void copyShareLink()}
                  className="inline-flex min-h-11 items-center justify-center gap-2 border border-forest bg-forest px-3 py-2 text-xs font-mono uppercase tracking-wider text-paper transition-colors hover:bg-forest/90"
                >
                  {shareMessage === 'Đã sao chép liên kết.' ? <Check className="h-4 w-4 text-brass" /> : <Copy className="h-4 w-4 text-brass" />}
                  {shareMessage === 'Đã sao chép liên kết.' ? 'Đã sao chép' : 'Sao chép liên kết'}
                </button>
                <button
                  type="button"
                  onClick={downloadQrCode}
                  disabled={!qrImage || qrLoading}
                  className="inline-flex min-h-11 items-center justify-center gap-2 border border-brass bg-brass px-3 py-2 text-xs font-mono uppercase tracking-wider text-forest transition-colors hover:bg-brass/85 disabled:cursor-wait disabled:opacity-50"
                >
                  <Download className="h-4 w-4" />
                  Tải mã QR
                </button>
              </div>
              {shareMessage && <p role="status" className="mt-3 text-center text-xs text-charcoal-muted">{shareMessage}</p>}
              <p className="mt-3 break-all text-center font-mono text-[10px] text-charcoal-muted">{shareUrl}</p>
            </section>
          </div>
        )}

        {/* Architectural Inspection Frame */}
        <section className="space-y-4">
          

          <ArchitecturalViewer product={product} />
        </section>

        {/* Audio Guide Section */}
        {product.audioGuide && (
          <section className="mx-auto max-w-5xl space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-forest">
                Audio Guide Thuyết Minh Lịch Sử
              </h2>
              <span className="text-xs font-mono text-brass uppercase font-semibold">
                Độc quyền cho chủ sở hữu mô hình
              </span>
            </div>

            <AudioPlayer audioGuide={product.audioGuide} heritageName={product.name} />
          </section>
        )}

        {/* Modular Story Blocks Section */}
        {product.storyBlocks && product.storyBlocks.length > 0 && (
          <section className="space-y-6 pt-6">
            <div className="border-b border-paper-border pb-4 flex items-center justify-between">
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-brass font-semibold block mb-1">
                  Khảo Luận Chuyên Sâu
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-forest">
                  Hành Trình Di Sản Qua Các Thế Kỷ
                </h2>
              </div>
            </div>

            <div className="space-y-8">
              {product.storyBlocks.map((block) => (
                <StoryBlockRenderer 
                  key={block.id} 
                  block={block} 
                  heritageName={product.name} 
                />
              ))}
            </div>
          </section>
        )}

        {/* Interactive Scale Ruler & Hand Perspective */}
        <section className="space-y-4">
          <ScaleRuler 
            modelSpecs={product.modelSpecs} 
            heritageName={product.name} 
          />
        </section>

        {/* Technical Specifications Sheet */}
        <section className="bg-paper-warm border border-paper-border corner-frame p-5 sm:p-6 space-y-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-brass text-xs font-mono uppercase tracking-widest">
              <Ruler className="w-4 h-4" />
              <span>Tiêu Chuẩn Kỹ Thuật Chế Tác</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-forest">
              Bảng Thông Số Mô Hình Thu Nhỏ
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-4 border-t border-paper-border">
            <div className="space-y-1">
              <span className="text-xs font-mono text-charcoal-muted uppercase">Tỷ Lệ Điêu Khắc</span>
              <p className="font-serif text-xl font-bold text-forest">{product.modelSpecs.scale}</p>
            </div>

            <div className="space-y-1">
              <span className="text-xs font-mono text-charcoal-muted uppercase">Kích Thước / Khối Lượng</span>
              <p className="font-serif text-xl font-bold text-forest">
                {product.modelSpecs.heightCm} × {product.modelSpecs.widthCm} cm · {product.modelSpecs.weightGrams} g
              </p>
            </div>

            <div className="space-y-1">
              <span className="text-xs font-mono text-charcoal-muted uppercase">Vật Liệu Cốt Lõi</span>
              <p className="font-serif text-xl font-bold text-forest">{product.modelSpecs.material}</p>
            </div>

            <div className="space-y-1">
              <span className="text-xs font-mono text-charcoal-muted uppercase">Số Cấu Kiện</span>
              <p className="font-serif text-xl font-bold text-brass">
                {product.modelSpecs.partsCount}
              </p>
            </div>
          </div>
        </section>

        {/* Related Products Section */}
        {product.relatedProducts && product.relatedProducts.length > 0 && (
          <section className="space-y-6 pt-8 border-t border-paper-border">
            <h2 className="font-serif text-2xl font-bold text-forest">
              Các Tác Phẩm Cùng Thời Kỳ
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {product.relatedProducts.map((rel) => (
                <Link
                  key={rel.id}
                  to={`/products/${rel.slug}`}
                  className="group bg-paper-warm border border-paper-border hover:border-brass transition-all corner-frame p-5 block space-y-3"
                >
                  <div className="aspect-[16/10] overflow-hidden bg-forest">
                    <img
                      src={resolveImageUrl(rel.heroImage)}
                      alt={rel.name}
                      onError={(e) => handleImageFallback(e)}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div>
                    <span className="text-[11px] text-brass uppercase font-serif tracking-wider">{rel.epoch}</span>
                    <h3 className="font-serif text-lg font-bold text-forest group-hover:text-brass transition-colors">
                      {rel.name}
                    </h3>
                    <p className="text-xs text-charcoal-muted font-normal">{rel.location}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default ProductDetailPage;
