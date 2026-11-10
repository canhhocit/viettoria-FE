import React, { useEffect, useRef, useState } from 'react';
import { Download, Sparkles, X, Stamp } from 'lucide-react';
import type { Product } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext';
import { resolveImageUrl } from '../../utils/mediaResolver';
import type { LanguageCode } from '../../locales';

interface PostcardGeneratorModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
  snapshotDataUrl?: string | null;
}

const HERITAGE_QUOTES: Record<LanguageCode, string[]> = {
  vi: [
    'Ngàn năm bia đá còn ghi · Hồn cốt tiền nhân đọng mái đình.',
    'Khắc dấu thời gian, nối dài hồn cốt di sản nghìn năm.',
    'Dấu xưa xe ngựa hồn thu thảo · Nền cũ lâu đài bóng tịch dương.',
    'Nơi tinh hoa kiến trúc Việt giao hòa cùng đất trời.',
  ],
  en: [
    'Carved in stone through a thousand years · Ancestral spirit in ancient eaves.',
    'Etching the marks of time, preserving millenary heritage.',
    'Traces of past glory lingering like autumn whispers.',
    'Where the quintessence of Vietnamese architecture embraces heaven and earth.',
  ],
  fr: [
    'Mille ans gravés dans la pierre · L\'âme ancestrale sous les toits anciens.',
    'Graver l\'empreinte du temps, perpétuer un héritage millénaire.',
    'Les traces d\'antan résonnent comme un murmure d\'automne.',
    'Où la quintessence architecturale vietnamienne s\'unit au ciel et à la terre.',
  ],
  zh: [
    '千年碑石仍载史 · 先祖神韵驻飞檐。',
    '铭刻岁月痕迹，传承千载华章。',
    '古道西风忆昔年 · 故城落日映残阳。',
    '越南建筑精粹与天地和谐共生之地。',
  ],
  ko: [
    '천년의 비석에 새겨진 선조들의 숨결 · 고즈넉한 지붕 처마.',
    '세월의 흔적을 새겨 천년의 유산을 이어가다.',
    '옛 궁궐 터에 서린 역사의 깊은 울림.',
    '베트남 건축의 정수가 하늘과 땅과 어우러지는 곳.',
  ],
  ja: [
    '千年の碑石に刻まれた先人の魂 · 古き軒先に宿る美。',
    '時の刻印を刻み、千年の遺産を未来へ紡ぐ。',
    '古の栄華を偲ばせる夕暮れの佇まい。',
    'ベトナム建築の粋が天と地と調和する聖地。',
  ],
};

export const PostcardGeneratorModal: React.FC<PostcardGeneratorModalProps> = ({
  product,
  isOpen,
  onClose,
  snapshotDataUrl,
}) => {
  const { t, language } = useLanguage();
  const quotes = HERITAGE_QUOTES[language] || HERITAGE_QUOTES.vi;
  const [senderNote, setSenderNote] = useState<string>('');
  const [selectedQuoteIndex, setSelectedQuoteIndex] = useState<number>(0);
  const [postcardImageUrl, setPostcardImageUrl] = useState<string>('');
  const [isRendering, setIsRendering] = useState<boolean>(true);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Render High-Resolution Postcard onto Canvas
  useEffect(() => {
    if (!isOpen) return;

    setIsRendering(true);
    const canvas = document.createElement('canvas');
    canvasRef.current = canvas;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // High resolution 16:9 postcard canvas (1280 x 800)
    canvas.width = 1280;
    canvas.height = 800;

    // 1. Draw Authentic Do Paper Background
    ctx.fillStyle = '#FAF7F0';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Warm organic texture overlay
    ctx.fillStyle = '#F4EDE1';
    for (let x = 0; x < canvas.width; x += 8) {
      for (let y = 0; y < canvas.height; y += 8) {
        if ((x + y) % 16 === 0) {
          ctx.fillRect(x, y, 4, 4);
        }
      }
    }

    // Outer Antique Double Border
    ctx.strokeStyle = '#B88A38';
    ctx.lineWidth = 3;
    ctx.strokeRect(36, 36, canvas.width - 72, canvas.height - 72);

    ctx.strokeStyle = '#E2D3BA';
    ctx.lineWidth = 1;
    ctx.strokeRect(46, 46, canvas.width - 92, canvas.height - 92);

    // Corner decorative brackets
    const bracketSize = 24;
    ctx.fillStyle = '#B88A38';
    ctx.fillRect(36, 36, bracketSize, 4);
    ctx.fillRect(36, 36, 4, bracketSize);
    ctx.fillRect(canvas.width - 36 - bracketSize, 36, bracketSize, 4);
    ctx.fillRect(canvas.width - 40, 36, 4, bracketSize);
    ctx.fillRect(36, canvas.height - 40, bracketSize, 4);
    ctx.fillRect(36, canvas.height - 36 - bracketSize, 4, bracketSize);
    ctx.fillRect(canvas.width - 36 - bracketSize, canvas.height - 40, bracketSize, 4);
    ctx.fillRect(canvas.width - 40, canvas.height - 36 - bracketSize, 4, bracketSize);

    // 2. Load Model Snapshot or Product Image
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = snapshotDataUrl || resolveImageUrl(product.heroImage);

    img.onload = () => {
      // Draw model in left/center frame
      const frameX = 80;
      const frameY = 110;
      const frameW = 600;
      const frameH = 580;

      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(frameX, frameY, frameW, frameH);
      ctx.strokeStyle = '#D8CCB8';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(frameX, frameY, frameW, frameH);

      // Fit snapshot inside frame cleanly
      const aspect = img.width / img.height;
      let drawW = frameW - 40;
      let drawH = drawW / aspect;
      if (drawH > frameH - 40) {
        drawH = frameH - 40;
        drawW = drawH * aspect;
      }
      const drawX = frameX + (frameW - drawW) / 2;
      const drawY = frameY + (frameH - drawH) / 2;
      ctx.drawImage(img, drawX, drawY, drawW, drawH);

      // 3. Right Typography & Story Panel
      const rightX = 720;

      // Header Tag
      ctx.fillStyle = '#B88A38';
      ctx.font = 'bold 15px "Cinzel", "Playfair Display", Georgia, serif';
      ctx.fillText('VIETTORIA ATELIER · BƯU THIẾP DI SẢN', rightX, 140);

      // Monument Name
      ctx.fillStyle = '#142820';
      ctx.font = 'bold 44px "Playfair Display", Georgia, serif';
      ctx.fillText(product.name, rightX, 195);

      // Epoch & Subtitle
      ctx.fillStyle = '#8F6E4A';
      ctx.font = 'italic 20px "Playfair Display", Georgia, serif';
      ctx.fillText(`${product.subName || product.epoch}`, rightX, 230);

      // Divider line
      ctx.strokeStyle = '#D8CCB8';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(rightX, 255);
      ctx.lineTo(canvas.width - 80, 255);
      ctx.stroke();

      // Location & Specs
      ctx.fillStyle = '#5F4A38';
      ctx.font = '16px "Be Vietnam Pro", sans-serif';
      ctx.fillText(`Địa danh: ${product.location}`, rightX, 290);
      ctx.fillText(`Niên đại: ${product.epoch}`, rightX, 320);

      // Poetic Quote
      ctx.fillStyle = '#1B1E1B';
      ctx.font = 'italic 18px "Playfair Display", Georgia, serif';
      const quoteText = `"${quotes[selectedQuoteIndex] || quotes[0]}"`;
      ctx.fillText(quoteText, rightX, 390);

      // Sender Note Box
      ctx.fillStyle = '#F3EFE6';
      ctx.fillRect(rightX, 440, canvas.width - rightX - 80, 95);
      ctx.strokeStyle = '#D8CCB8';
      ctx.strokeRect(rightX, 440, canvas.width - rightX - 80, 95);

      ctx.fillStyle = '#8F6E4A';
      ctx.font = 'bold 12px "Playfair Display", Georgia, serif';
      ctx.fillText(t('postcard.sealText', 'LỜI NHẮN TỪ KÝ ỨC:'), rightX + 16, 465);

      ctx.fillStyle = '#1B1E1B';
      ctx.font = '15px "Be Vietnam Pro", sans-serif';
      ctx.fillText(senderNote || t('postcard.defaultNote', 'Lưu giữ vẻ đẹp truyền thống Việt Nam'), rightX + 16, 498);

      // 4. Imperial Vermilion Seal Stamp
      const stampX = canvas.width - 200;
      const stampY = 580;
      const stampSize = 100;

      ctx.save();
      ctx.translate(stampX + stampSize / 2, stampY + stampSize / 2);
      ctx.rotate((-4 * Math.PI) / 180);

      // Stamp border
      ctx.strokeStyle = '#98281A';
      ctx.lineWidth = 3.5;
      ctx.strokeRect(-stampSize / 2, -stampSize / 2, stampSize, stampSize);

      ctx.strokeStyle = '#7A1D12';
      ctx.lineWidth = 1;
      ctx.strokeRect(-stampSize / 2 + 5, -stampSize / 2 + 5, stampSize - 10, stampSize - 10);

      // Stamp text
      ctx.fillStyle = '#98281A';
      ctx.textAlign = 'center';
      ctx.font = 'bold 11px "Playfair Display", Georgia, serif';
      ctx.fillText('VIETTORIA', 0, -18);
      ctx.font = 'bold 17px "Playfair Display", Georgia, serif';
      ctx.fillText('CHÂU PHÊ', 0, 4);
      ctx.font = 'bold 10px "Be Vietnam Pro", sans-serif';
      ctx.fillText('TRƯỜNG TỒN', 0, 24);

      ctx.restore();

      // Export to Data URL
      try {
        const url = canvas.toDataURL('image/png');
        setPostcardImageUrl(url);
      } catch (err) {
        console.warn('Canvas export error', err);
      } finally {
        setIsRendering(false);
      }
    };

    img.onerror = () => {
      setIsRendering(false);
    };
  }, [isOpen, product, selectedQuoteIndex, senderNote, snapshotDataUrl]);

  if (!isOpen) return null;

  const handleDownload = () => {
    if (!postcardImageUrl) return;
    const a = document.createElement('a');
    a.href = postcardImageUrl;
    a.download = `viettoria-buu-thiep-${product.slug || 'di-san'}.png`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="postcard-modal-title"
      className="fixed inset-0 z-[100] flex items-center justify-center bg-forest-dark/80 p-4 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative max-h-[92vh] w-full max-w-4xl overflow-y-auto border-2 border-brass bg-paper p-5 sm:p-7 shadow-2xl rounded-[2px]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 p-1.5 text-charcoal-muted hover:text-forest transition-colors"
          aria-label={t('common.close', 'Đóng')}
        >
          <X size={20} />
        </button>

        <div className="flex items-center gap-2 text-brass">
          <Stamp size={16} />
          <span className="font-sans text-xs font-bold uppercase tracking-widest">
            {t('postcard.atelier', 'Xưởng In Bưu Thiếp Ký Ức')}
          </span>
        </div>

        <h3 id="postcard-modal-title" className="mt-1 font-serif text-2xl font-bold text-forest">
          {t('postcard.title', 'Bưu Thiếp Giấy Dó')}: {product.name}
        </h3>
        <p className="text-xs text-charcoal-muted font-normal">
          {t('postcard.subtitle', 'Bưu thiếp được đóng dấu triện son hoàng gia cùng góc chụp 3D độc bản của bạn.')}
        </p>

        {/* Postcard Live Visual Preview */}
        <div className="mt-5 border-2 border-brass/40 bg-paper-warm p-3 sm:p-4 rounded-[2px] shadow-inner text-center">
          {isRendering ? (
            <div className="flex h-64 sm:h-96 w-full items-center justify-center flex-col gap-3">
              <Sparkles size={24} className="animate-spin text-brass" />
              <span className="font-sans text-xs text-forest font-medium">{t('postcard.rendering', 'Đang in bưu thiếp chất liệu giấy dó...')}</span>
            </div>
          ) : postcardImageUrl ? (
            <img
              src={postcardImageUrl}
              alt={`Postcard: ${product.name}`}
              className="mx-auto max-h-[50vh] w-full object-contain shadow-lg border border-brass/50"
            />
          ) : (
            <p className="text-xs text-charcoal-muted">{t('postcard.failed', 'Không thể tạo bưu thiếp. Vui lòng thử lại.')}</p>
          )}
        </div>

        {/* Customization Controls */}
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {/* Poetic quote picker */}
          <div>
            <label className="block text-xs font-sans font-bold uppercase tracking-wider text-brass mb-1.5">
              {t('postcard.selectQuote', 'Chọn Lời Thơ Di Sản')}
            </label>
            <div className="space-y-1.5">
              {quotes.map((quote, idx) => (
                <button
                  key={quote}
                  type="button"
                  onClick={() => setSelectedQuoteIndex(idx)}
                  className={`w-full text-left text-xs p-2 rounded-[2px] border transition-all ${
                    selectedQuoteIndex === idx
                      ? 'border-forest bg-forest text-paper font-medium'
                      : 'border-paper-border bg-paper hover:border-brass text-forest'
                  }`}
                >
                  {quote}
                </button>
              ))}
            </div>
          </div>

          {/* Personal note input */}
          <div className="flex flex-col justify-between">
            <div>
              <label htmlFor="postcard-note" className="block text-xs font-sans font-bold uppercase tracking-wider text-brass mb-1.5">
                {t('postcard.yourNote', 'Lời Nhắn Của Bạn')}
              </label>
              <textarea
                id="postcard-note"
                rows={3}
                value={senderNote}
                maxLength={80}
                onChange={(e) => setSenderNote(e.target.value)}
                className="w-full border border-paper-border bg-paper p-2.5 text-xs text-forest font-sans rounded-[2px] focus:border-brass focus:outline-none"
                placeholder={t('postcard.notePlaceholder', 'Nhập lời đề tặng gửi người thân hoặc lưu giữ kỷ niệm...')}
              />
              <span className="text-[10px] text-charcoal-muted text-right block mt-1">
                {senderNote.length}/80 {t('postcard.charCount', 'ký tự')}
              </span>
            </div>

            {/* Download CTA Button */}
            <button
              type="button"
              disabled={isRendering || !postcardImageUrl}
              onClick={handleDownload}
              className="mt-4 w-full py-3 px-4 bg-brass text-forest font-sans text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-brass-light transition-all rounded-[2px] shadow-sm disabled:opacity-50"
            >
              <Download size={15} />
              <span>{t('postcard.downloadBtn', 'Tải Bưu Thiếp Về Máy (HD PNG)')}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
