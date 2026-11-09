import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, useParams, Link } from 'react-router-dom';
import { QrCode, ArrowRight, AlertTriangle, ShieldCheck } from 'lucide-react';
import { publicApi } from '../services/api';
import { HeritageLoader } from '../components/common/HeritageLoader';
import { useLanguage } from '../contexts/LanguageContext';

export const QRResolverPage: React.FC = () => {
  const { t } = useLanguage();
  const [searchParams] = useSearchParams();
  const { code: pathCode } = useParams<{ code?: string }>();
  const navigate = useNavigate();

  // Code can come from ?code=... or from path param /p/:code
  const rawCode = pathCode || searchParams.get('code') || '';
  const [inputCode, setInputCode] = useState(rawCode);
  const [error, setError] = useState<string | null>(null);
  const [resolving, setResolving] = useState(Boolean(rawCode));

  useEffect(() => {
    if (rawCode) {
      setResolving(true);
      setError(null);
      publicApi.resolveQR(rawCode.trim()).then((res) => {
        if (res) {
          // Successfully resolved -> navigate to product detail with code query
          navigate(res.targetUrl, { replace: true });
        } else {
          setError(`Mã tem QR "${rawCode}" không tồn tại trong hệ thống di sản Viettoria.`);
          setResolving(false);
        }
      }).catch(() => {
        setError('Có lỗi xảy ra khi xác thực tem QR. Vui lòng thử lại.');
        setResolving(false);
      });
    }
  }, [rawCode, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCode.trim()) return;
    navigate(`/product?code=${encodeURIComponent(inputCode.trim().toUpperCase())}`);
  };

  if (resolving) {
    return (
      <div className="relative min-h-[70vh] flex items-center justify-center bg-paper">
        <HeritageLoader
          variant="overlay"
          blur={true}
          size="lg"
          message={`${t('qr.resolvingTitle', 'Đang Xác Thực Mã Di Sản')} [${rawCode.toUpperCase()}]...`}
          submessage={t('qr.resolvingSub', 'Kết nối hệ sinh thái Phygital Viettoria')}
          showWordmark={true}
        />
      </div>
    );
  }

  return (
    <div className="min-h-[70vh] py-16 px-4 bg-paper flex items-center justify-center">
      <div className="max-w-md w-full bg-paper-warm border border-brass corner-frame p-6 sm:p-8 shadow-xl space-y-6">
        <div className="flex items-center gap-2 text-brass text-xs font-mono uppercase tracking-widest">
          <QrCode className="w-4 h-4" />
          <span>Kích Hoạt Di Sản Số Viettoria</span>
        </div>

        <div className="space-y-2">
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-forest">
            Xác Thực Tem QR Mô Hình
          </h1>
          <p className="text-xs sm:text-sm text-charcoal/80 font-normal leading-relaxed">
            Nhập mã in dưới đế mô hình thu nhỏ của bạn để truy cập ngay bản thu âm thuyết minh và khảo cứu kiến trúc.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-terracotta/10 border border-terracotta/30 text-terracotta text-xs font-mono flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="resolver-code-input" className="block text-xs uppercase tracking-wider text-charcoal-muted mb-1.5 font-medium">
              Mã Xác Thực / Tác Phẩm
            </label>
            <input
              id="resolver-code-input"
              type="text"
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value)}
              placeholder="Nhập mã xác thực hoặc chọn tác phẩm bên dưới..."
              className="w-full px-4 py-2.5 bg-paper border border-paper-border focus:border-brass text-sm text-forest tracking-wider focus:outline-none transition-colors"
              required
            />
          </div>

          {/* Quick SKU presets */}
          <div>
            <span className="block text-[11px] text-charcoal-muted uppercase mb-1.5 font-medium">Tác phẩm di sản mẫu:</span>
            <div className="flex flex-wrap gap-2">
              {[
                { code: 'VT-HN-001', label: 'Chùa Một Cột' },
                { code: 'VT-HN-002', label: 'Khuê Văn Các' },
                { code: 'VT-HN-003', label: 'Cột Cờ Hà Nội' },
                { code: 'VT-HUE-004', label: 'Ngọ Môn Huế' },
                { code: 'VT-SG-005', label: 'Bến Nhà Rồng' },
              ].map((p) => (
                <button
                  key={p.code}
                  type="button"
                  onClick={() => setInputCode(p.code)}
                  className="whitespace-nowrap px-3 py-1.5 text-xs border border-paper-border bg-paper hover:border-brass text-charcoal transition-colors"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-forest text-paper hover:bg-brass transition-colors font-mono text-xs uppercase tracking-widest font-bold flex items-center justify-center gap-2 shadow-md"
          >
            <span>Mở Khóa Trải Nghiệm</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-4 border-t border-paper-border flex items-center justify-between text-xs text-charcoal-muted">
          <Link to="/products" className="hover:text-forest transition-colors">
            ← Xem toàn bộ tác phẩm
          </Link>
          <span className="flex items-center gap-1 text-[11px] font-mono text-brass">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Hệ Thống Phygital</span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default QRResolverPage;
