import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X, QrCode, Copy, Check, Smartphone, Download } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

interface WebsiteQRModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WebsiteQRModal: React.FC<WebsiteQRModalProps> = ({ isOpen, onClose }) => {
  const { t } = useLanguage();
  const [qrUrl, setQrUrl] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  const websiteUrl = typeof window !== 'undefined' ? window.location.origin : 'https://viettoria.vn';

  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    setLoading(true);

    const generateQR = async () => {
      let resolvedDataUrl = '';

      try {
        const QRCodeMod = await import('qrcode');
        const toDataURL = (QRCodeMod as any).toDataURL || (QRCodeMod as any).default?.toDataURL;

        if (typeof toDataURL === 'function') {
          resolvedDataUrl = await toDataURL(websiteUrl, {
            width: 320,
            margin: 1.5,
            color: {
              dark: '#142820', // Imperial Forest Lacquer
              light: '#FAF7F0', // Do Paper Warm Canvas
            },
            errorCorrectionLevel: 'M',
          });
        }
      } catch (err) {
        console.warn('Local QRCode generation failed, engaging resilient fallback:', err);
      }

      // 100% Guaranteed High-Res Fallback in exact brand colors (#142820 on #FAF7F0)
      if (!resolvedDataUrl) {
        resolvedDataUrl = `https://api.qrserver.com/v1/create-qr-code/?size=320x320&data=${encodeURIComponent(websiteUrl)}&color=20-40-32&bgcolor=250-247-240`;
      }

      if (isMounted) {
        setQrUrl(resolvedDataUrl);
        setLoading(false);
      }
    };

    void generateQR();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      isMounted = false;
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen, websiteUrl, onClose]);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(websiteUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  const handleDownloadQR = async () => {
    if (!qrUrl) return;
    try {
      if (qrUrl.startsWith('data:')) {
        const link = document.createElement('a');
        link.href = qrUrl;
        link.download = 'viettoria-qr-code.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        const response = await fetch(qrUrl);
        const blob = await response.blob();
        const blobUrl = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = 'viettoria-qr-code.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(blobUrl);
      }
    } catch {
      window.open(qrUrl, '_blank');
    }
  };

  if (!isOpen || typeof document === 'undefined') return null;

  // Use createPortal to attach directly to document.body, escaping any header stacking context or backdrop-filter
  return createPortal(
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-forest-dark/80 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="corner-frame relative w-full max-w-sm border-2 border-brass/60 bg-paper p-6 sm:p-7 shadow-2xl rounded-[2px]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="website-qr-title"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close "X" Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3.5 right-3.5 p-2 text-charcoal/60 hover:text-forest hover:bg-paper-warm transition-colors rounded-[2px] focus:outline-none focus:ring-1 focus:ring-brass z-20 cursor-pointer"
          aria-label={t('nav.close', 'Đóng cửa sổ')}
        >
          <X className="w-5 h-5" />
        </button>

        {/* Eyebrow & Title */}
        <div className="text-center pr-4">
          <div className="inline-flex items-center gap-1.5 text-brass text-[11px] font-sans font-semibold uppercase tracking-wider mb-1">
            <Smartphone className="w-3.5 h-3.5" />
            <span>{t('header.qrEyebrow', 'Trải Nghiệm Trên Di Động')}</span>
          </div>
          <h3 
            id="website-qr-title" 
            className="font-serif text-xl sm:text-2xl font-bold text-forest"
          >
            {t('header.qrTitle', 'Quét Mã Vào Website')}
          </h3>
          <p className="mt-1 text-xs text-charcoal/75 font-normal leading-relaxed">
            {t('header.qrDesc', 'Mở camera điện thoại để quét mã và truy cập trực tiếp vào nền tảng di sản Viettoria.')}
          </p>
        </div>

        {/* QR Code Container */}
        <div className="my-5 flex flex-col items-center justify-center">
          <div className="relative border-2 border-brass/40 bg-[#FAF7F0] p-3 rounded-[2px] shadow-sm">
            {/* Antique Corner Accents */}
            <div className="pointer-events-none absolute -top-1 -left-1 h-2.5 w-2.5 border-t-2 border-l-2 border-brass" />
            <div className="pointer-events-none absolute -top-1 -right-1 h-2.5 w-2.5 border-t-2 border-r-2 border-brass" />
            <div className="pointer-events-none absolute -bottom-1 -left-1 h-2.5 w-2.5 border-b-2 border-l-2 border-brass" />
            <div className="pointer-events-none absolute -bottom-1 -right-1 h-2.5 w-2.5 border-b-2 border-r-2 border-brass" />

            {loading ? (
              <div className="flex h-52 w-52 items-center justify-center">
                <QrCode className="h-10 w-10 animate-pulse text-brass/60" />
              </div>
            ) : qrUrl ? (
              <img
                src={qrUrl}
                alt={t('header.qrAlt', 'Mã QR liên kết website Viettoria')}
                className="h-52 w-52 object-contain"
              />
            ) : (
              <div className="flex h-52 w-52 items-center justify-center text-xs text-charcoal-muted">
                {t('common.error', 'Không thể tạo mã QR')}
              </div>
            )}
          </div>

          {/* Compact Download QR Button & Brand Identifier */}
          <div className="mt-3 flex items-center justify-between w-full max-w-[230px] px-0.5">
            <span className="text-[10px] font-mono text-charcoal-muted uppercase tracking-wider">
              Viettoria Phygital
            </span>

            {qrUrl && (
              <button
                type="button"
                onClick={handleDownloadQR}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-sans font-semibold bg-paper hover:bg-forest text-forest hover:text-brass border border-brass/50 rounded-[2px] shadow-2xs transition-all active:scale-95 cursor-pointer"
                title={t('header.downloadQr', 'Tải ảnh mã QR về máy')}
              >
                <Download className="w-3.5 h-3.5 text-brass-dark" />
                <span>{t('header.downloadQr', 'Tải xuống')}</span>
              </button>
            )}
          </div>
        </div>

        {/* Copy Link Action Bar */}
        <div className="border-t border-paper-border pt-4">
          <div className="flex items-center gap-2 border border-paper-border bg-paper-warm px-3 py-2 rounded-[2px]">
            <span className="flex-1 truncate font-mono text-xs text-forest select-all">
              {websiteUrl}
            </span>
            <button
              type="button"
              onClick={handleCopyLink}
              className="inline-flex items-center gap-1 shrink-0 px-3 py-1.5 text-xs font-sans font-semibold bg-brass text-forest hover:bg-brass-light transition-colors rounded-[1px] shadow-2xs cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>{t('header.copied', 'Đã chép')}</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>{t('header.copy', 'Sao chép')}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};
