import React, { useEffect, useState } from 'react';
import { Box, Copy, Check, X, Smartphone, Sparkles } from 'lucide-react';
import type { Product } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext';

interface ARLaunchModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
  onActivateDirectAR?: () => void;
  canDirectAR?: boolean;
}

export const ARLaunchModal: React.FC<ARLaunchModalProps> = ({
  product,
  isOpen,
  onClose,
  onActivateDirectAR,
  canDirectAR = false,
}) => {
  const { t } = useLanguage();
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  const productUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/products/${encodeURIComponent(product.slug)}#ar-view`
    : '';

  useEffect(() => {
    if (!isOpen || !productUrl) return;

    let isMounted = true;
    import('qrcode')
      .then((QRCode) => {
        return QRCode.toDataURL(productUrl, {
          width: 240,
          margin: 1.5,
          color: {
            dark: '#142820',
            light: '#FAF7F0',
          },
        });
      })
      .then((url) => {
        if (isMounted) setQrDataUrl(url);
      })
      .catch((err) => {
        console.warn('QR code generation error', err);
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen, productUrl]);

  if (!isOpen) return null;

  const handleCopy = () => {
    if (!productUrl) return;
    navigator.clipboard?.writeText(productUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="ar-modal-title"
      className="fixed inset-0 z-[100] flex items-center justify-center bg-forest-dark/80 p-4 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative max-h-[90vh] w-full max-w-md overflow-y-auto border-2 border-brass bg-paper p-6 sm:p-7 shadow-2xl rounded-[2px]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3.5 top-3.5 p-1.5 text-charcoal-muted hover:text-forest transition-colors"
          aria-label={t('common.close', 'Đóng')}
        >
          <X size={18} />
        </button>

        <div className="flex items-center gap-2 text-brass">
          <Box size={16} />
          <span className="font-sans text-xs font-bold uppercase tracking-widest">
            {t('ar.title', 'Thực Tế Ảo Tăng Cường (Web AR)')}
          </span>
        </div>

        <h3 id="ar-modal-title" className="mt-1 font-serif text-2xl font-bold text-forest">
          {product.name}
        </h3>
        <p className="mt-1 text-xs text-charcoal-muted font-normal leading-relaxed">
          {t(
            'ar.intro',
            'Chiêm ngưỡng mô hình 3D nguyên vẹn đặt trên mặt bàn làm việc hoặc không gian thực của bạn với tỷ lệ chân thực.'
          )}
        </p>

        {/* Direct Mobile Launch Button if supported */}
        {canDirectAR && onActivateDirectAR && (
          <button
            type="button"
            onClick={() => {
              onActivateDirectAR();
              onClose();
            }}
            className="mt-4 w-full py-3 px-4 bg-forest text-brass font-sans text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 border border-brass hover:bg-forest-dark transition-all rounded-[2px] shadow-sm"
          >
            <Smartphone size={16} />
            <span>{t('ar.openNowMobile', 'Mở AR Ngay Trên Máy')}</span>
          </button>
        )}

        {/* QR Scanner Frame for Desktop / Cross-Device */}
        <div className="mt-5 border border-paper-border bg-paper-warm p-4 text-center rounded-[2px]">
          <div className="mx-auto flex h-52 w-52 items-center justify-center border border-brass/50 bg-paper p-2">
            {qrDataUrl ? (
              <img src={qrDataUrl} alt={`Mã QR xem AR ${product.name}`} className="h-full w-full object-contain" />
            ) : (
              <div className="flex flex-col items-center gap-2 text-xs text-charcoal-muted">
                <Sparkles size={20} className="animate-spin text-brass" />
                <span>{t('common.loading', 'Đang tạo mã QR...')}</span>
              </div>
            )}
          </div>

          <div className="mt-4 space-y-1.5 text-left text-xs text-charcoal/90">
            <p className="flex items-center gap-2 font-medium">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center bg-forest text-[10px] font-bold text-paper rounded-[1px]">1</span>
              <span>Dùng Camera iPhone (iOS 12+) hoặc Android quét mã</span>
            </p>
            <p className="flex items-center gap-2 font-medium">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center bg-forest text-[10px] font-bold text-paper rounded-[1px]">2</span>
              <span>Bấm vào liên kết vừa mở để kích hoạt chế độ AR</span>
            </p>
            <p className="flex items-center gap-2 font-medium">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center bg-forest text-[10px] font-bold text-paper rounded-[1px]">3</span>
              <span>Hướng camera xuống mặt bàn để đặt mô hình</span>
            </p>
          </div>
        </div>

        {/* Action Link Copy */}
        <div className="mt-4 flex items-center justify-between border-t border-paper-border pt-3">
          <span className="text-[11px] text-charcoal-muted truncate max-w-[240px]">
            {productUrl}
          </span>
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1 font-sans text-xs font-bold text-forest hover:text-brass transition-colors"
          >
            {copied ? <Check size={13} className="text-forest" /> : <Copy size={13} className="text-brass" />}
            <span>{copied ? 'Đã sao chép' : 'Chép link'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
