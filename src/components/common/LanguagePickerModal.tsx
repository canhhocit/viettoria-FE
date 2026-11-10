import React, { useEffect, useState } from 'react';
import { LANGUAGES, type LanguageCode } from '../../locales';

interface LanguagePickerModalProps {
  isOpen: boolean;
  onSelect: (lang: LanguageCode) => void;
}

export const LanguagePickerModal: React.FC<LanguagePickerModalProps> = ({ isOpen, onSelect }) => {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setMounted(true);
      // Small delay to allow CSS transition to run
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setVisible(true));
      });
    } else {
      setVisible(false);
      const t = setTimeout(() => setMounted(false), 350);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  if (!mounted) return null;

  return (
    <div
      className={`fixed inset-0 z-[300] flex items-center justify-center transition-opacity duration-300 ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
      style={{ background: 'rgba(13,28,22,0.88)' }}
      aria-modal="true"
      role="dialog"
      aria-labelledby="lang-picker-title"
    >
      {/* Backdrop grain overlay */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'200\' height=\'200\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.75\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3CfeColorMatrix type=\'saturate\' values=\'0\'/%3E%3C/filter%3E%3Crect width=\'200\' height=\'200\' filter=\'url(%23n)\' opacity=\'0.08\'/%3E%3C/svg%3E")',
          backgroundRepeat: 'repeat',
        }}
      />

      {/* Panel */}
      <div
        className={`relative w-full max-w-lg mx-4 border border-brass/30 bg-paper-warm transition-transform duration-300 ${
          visible ? 'translate-y-0' : 'translate-y-6'
        }`}
        style={{ boxShadow: '0 32px 80px rgba(13,28,22,0.6), inset 0 1px 0 rgba(180,138,68,0.15)' }}
      >
        {/* Top accent bar */}
        <div className="h-[3px] w-full bg-gradient-to-r from-transparent via-brass to-transparent opacity-70" />

        <div className="px-8 py-10">
          {/* Heritage ornament */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-px flex-1 bg-brass/25" />
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M12 2L14.5 9H22L16 13.5L18.5 20.5L12 16L5.5 20.5L8 13.5L2 9H9.5L12 2Z"
                stroke="#B88A44"
                strokeWidth="1.2"
                fill="none"
              />
            </svg>
            <div className="h-px flex-1 bg-brass/25" />
          </div>

          {/* Heading */}
          <div className="text-center mb-2">
            <p className="font-cinzel text-xs tracking-[0.3em] text-brass/70 uppercase mb-3">
              Viettoria · Heritage Collectibles
            </p>
            <h2
              id="lang-picker-title"
              className="font-cinzel text-2xl sm:text-3xl font-semibold tracking-wide text-forest-dark"
            >
              Chọn Ngôn Ngữ
            </h2>
            <p className="font-cinzel text-sm tracking-widest text-ink/40 mt-1">
              Select Your Language
            </p>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="h-px flex-1 bg-brass/20" />
            <div className="w-1 h-1 bg-brass/40 rotate-45" />
            <div className="h-px flex-1 bg-brass/20" />
          </div>

          {/* Language grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                type="button"
                onClick={() => onSelect(lang.code)}
                className="
                  group relative flex flex-col items-center gap-2 px-4 py-4
                  border border-brass/25 bg-paper
                  font-sans text-sm text-ink/70
                  transition-all duration-200
                  hover:border-brass/70 hover:bg-forest hover:text-brass
                  focus:outline-none focus:border-brass focus:ring-1 focus:ring-brass/40
                  active:scale-[0.97]
                  rounded-[2px]
                "
              >
                {/* Flag */}
                <span className="text-2xl leading-none select-none" role="img" aria-label={lang.label}>
                  {lang.flagSymbol}
                </span>
                {/* Label */}
                <span className="font-cinzel text-xs tracking-[0.12em] uppercase leading-tight text-center group-hover:text-brass transition-colors duration-200">
                  {lang.label}
                </span>
                {/* Short code badge */}
                <span className="absolute top-1.5 right-1.5 font-cinzel text-[9px] tracking-widest text-brass/40 group-hover:text-brass/70 transition-colors duration-200">
                  {lang.shortLabel}
                </span>
              </button>
            ))}
          </div>

          {/* Footer note */}
          <p className="font-sans text-xs text-ink/30 text-center mt-6 tracking-wide">
            Lựa chọn có thể thay đổi bất kỳ lúc nào · You may change this anytime
          </p>
        </div>

        {/* Bottom accent bar */}
        <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-brass/40 to-transparent" />
      </div>
    </div>
  );
};

export default LanguagePickerModal;
