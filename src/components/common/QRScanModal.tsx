import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { QrCode, X, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

interface QRScanModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QRScanModal: React.FC<QRScanModalProps> = ({ isOpen, onClose }) => {
  const [code, setCode] = useState<string>('VT-HN-001');
  const navigate = useNavigate();
  const { t } = useLanguage();

  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previousOverflow; };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;
    onClose();
    navigate(`/product?code=${encodeURIComponent(code.trim().toUpperCase())}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-forest-dark/80 backdrop-blur-sm animate-fadeIn">
      <div 
        className="relative w-full max-w-md bg-paper-card border border-brass corner-frame p-6 sm:p-8 shadow-2xl rounded-[2px]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="qr-modal-title"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 text-charcoal-muted hover:text-charcoal transition-colors"
          aria-label={t('nav.close', 'Đóng cửa sổ')}
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 text-brass text-xs font-mono tracking-widest uppercase mb-2">
          <QrCode className="w-4 h-4" />
          <span>{t('nav.scanQr', 'Trải Nghiệm Quét Mã Di Sản')}</span>
        </div>

        <h3 id="qr-modal-title" className="font-serif text-2xl font-bold text-forest mb-2">
          {t('qr.resolvingTitle', 'Mở Khóa Không Gian Số')}
        </h3>
        <p className="text-xs text-charcoal/80 font-normal leading-relaxed mb-6">
          Nhập mã sản phẩm in trên tem QR dưới đế mô hình của bạn để mở trực tiếp trang chi tiết và thuyết minh âm thanh.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="qr-code-input" className="block text-[11px] font-mono uppercase tracking-wider text-charcoal-muted mb-1.5">
              Mã Định Danh Di Sản (VD: VT-HN-001)
            </label>
            <input
              id="qr-code-input"
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Nhập mã tem xác thực hoặc chọn bên dưới..."
              className="w-full px-4 py-2.5 bg-paper-warm border border-paper-border focus:border-brass text-sm text-forest tracking-wider focus:outline-none transition-colors"
              required
            />
          </div>

          {/* Quick presets */}
          <div>
            <span className="block text-[11px] text-charcoal-muted uppercase mb-1.5 font-medium">Tác phẩm di sản mẫu:</span>
            <div className="flex flex-wrap gap-1.5">
              {[
                { code: 'VT-HN-001', label: 'Chùa Một Cột' },
                { code: 'VT-HN-002', label: 'Khuê Văn Các' },
                { code: 'VT-HN-003', label: 'Cột Cờ Hà Nội' },
                { code: 'VT-HUE-004', label: 'Ngọ Môn Huế' },
                { code: 'VT-SG-005', label: 'Bến Nhà Rồng' },
              ].map(preset => (
                <button
                  key={preset.code}
                  type="button"
                  onClick={() => setCode(preset.code)}
                  className={`px-2.5 py-1 text-xs border transition-colors ${
                    code === preset.code 
                      ? 'bg-forest text-paper border-forest font-semibold' 
                      : 'bg-paper-warm border-paper-border text-charcoal hover:border-brass'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 bg-brown-dark text-white hover:bg-brown-dark transition-colors font-mono text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-2 shadow-sm rounded-[2px] mt-6"
          >
            <span>Kích Hoạt Trải Nghiệm Số</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-paper-border flex items-center justify-between text-[11px] text-charcoal-muted font-mono">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-brass" />
            <span>Xác thực tiêu chuẩn Phygital</span>
          </span>
          <span className="flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-brass" />
            <span>Audio Guide độc quyền</span>
          </span>
        </div>
      </div>
    </div>
  );
};
