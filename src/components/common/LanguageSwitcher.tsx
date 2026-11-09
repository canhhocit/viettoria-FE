import React, { useState, useRef, useEffect } from 'react';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

interface LanguageSwitcherProps {
  variant?: 'header' | 'drawer' | 'footer' | 'compact';
  className?: string;
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  variant = 'header',
  className = '',
}) => {
  const { language, setLanguage, languages, currentLanguageOption, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  // 1. Drawer Variant (For Mobile Menu Drawer)
  if (variant === 'drawer') {
    return (
      <div className={`space-y-2 pt-2 border-t border-paper-border/70 ${className}`}>
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-charcoal-muted">
          <Globe className="w-3.5 h-3.5 text-brass" />
          <span>{t('header.selectLanguage', 'Ngôn ngữ / Language')}</span>
        </div>
        <div className="grid grid-cols-3 gap-1.5">
          {languages.map((lang) => {
            const isActive = lang.code === language;
            return (
              <button
                key={lang.code}
                type="button"
                onClick={() => setLanguage(lang.code)}
                className={`py-2 px-2 text-xs font-mono flex items-center justify-center gap-1.5 border transition-all rounded-[2px] ${
                  isActive
                    ? 'border-brass bg-brass text-paper font-semibold shadow-xs'
                    : 'border-paper-border bg-paper text-ink hover:border-brass/60 hover:text-brown'
                }`}
                aria-pressed={isActive}
              >
                <span>{lang.flagSymbol}</span>
                <span className="font-bold">{lang.shortLabel}</span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // 2. Footer Variant (Inline Text Links)
  if (variant === 'footer') {
    return (
      <div className={`flex items-center gap-3 text-xs font-mono ${className}`}>
        <span className="flex items-center gap-1.5 text-paper/70">
          <Globe className="w-3.5 h-3.5 text-brass" />
          <span className="hidden sm:inline">{t('footer.languageLabel', 'Ngôn ngữ:')}</span>
        </span>
        <div className="inline-flex items-center gap-1">
          {languages.map((lang, idx) => {
            const isActive = lang.code === language;
            return (
              <React.Fragment key={lang.code}>
                {idx > 0 && <span className="text-white/20">·</span>}
                <button
                  type="button"
                  onClick={() => setLanguage(lang.code)}
                  className={`px-1.5 py-0.5 transition-colors uppercase tracking-wider ${
                    isActive
                      ? 'text-brass font-bold underline underline-offset-4 decoration-brass'
                      : 'text-paper/70 hover:text-paper'
                  }`}
                  aria-pressed={isActive}
                >
                  {lang.shortLabel}
                </button>
              </React.Fragment>
            );
          })}
        </div>
      </div>
    );
  }

  // 3. Compact Segmented Pill (For Header on small screens or simple toolbar)
  if (variant === 'compact') {
    return (
      <div className={`inline-flex items-center border border-paper-border bg-paper-card p-0.5 rounded-[2px] ${className}`}>
        {languages.map((lang) => {
          const isActive = lang.code === language;
          return (
            <button
              key={lang.code}
              type="button"
              onClick={() => setLanguage(lang.code)}
              className={`px-2 py-1 text-[11px] font-mono tracking-wider transition-all rounded-[2px] ${
                isActive
                  ? 'bg-brass text-paper font-bold shadow-xs'
                  : 'text-charcoal-muted hover:text-ink'
              }`}
              title={lang.label}
              aria-pressed={isActive}
            >
              {lang.shortLabel}
            </button>
          );
        })}
      </div>
    );
  }

  // 4. Default Header Variant (Luxury Tactile Dropdown)
  return (
    <div ref={dropdownRef} className={`relative inline-block text-left ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 border transition-all duration-200 text-xs font-mono uppercase tracking-wider rounded-[2px] ${
          isOpen
            ? 'border-brass bg-paper-warm text-brown shadow-sm'
            : 'border-paper-border bg-white/70 text-ink hover:border-brass hover:text-brown'
        }`}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label={t('header.selectLanguage', 'Chọn ngôn ngữ')}
      >
        <Globe className="w-3.5 h-3.5 text-brass shrink-0" />
        <span className="font-semibold">{currentLanguageOption.shortLabel}</span>
        <ChevronDown
          className={`w-3 h-3 text-charcoal-muted transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-brass' : ''
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className="absolute right-0 mt-1.5 w-44 bg-paper border border-brass/40 shadow-xl z-50 animate-fade-in divide-y divide-paper-border/60 rounded-[2px]"
          role="listbox"
          aria-label="Danh sách ngôn ngữ"
        >
          <div className="px-3 py-2 bg-paper-warm text-[10px] font-mono uppercase tracking-widest text-charcoal-muted">
            {t('header.selectLanguage', 'Ngôn ngữ hiển thị')}
          </div>
          <div className="py-1">
            {languages.map((lang) => {
              const isActive = lang.code === language;
              return (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => {
                    setLanguage(lang.code);
                    setIsOpen(false);
                  }}
                  className={`w-full px-3 py-2.5 text-left text-xs font-serif flex items-center justify-between transition-colors ${
                    isActive
                      ? 'bg-paper-warm text-brown font-bold'
                      : 'text-ink hover:bg-paper-warm/80 hover:text-brown'
                  }`}
                  role="option"
                  aria-selected={isActive}
                >
                  <span className="flex items-center gap-2">
                    <span className="text-sm">{lang.flagSymbol}</span>
                    <span>{lang.label}</span>
                  </span>
                  {isActive && <Check className="w-3.5 h-3.5 text-brass" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
