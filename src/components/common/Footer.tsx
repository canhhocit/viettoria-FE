import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, MapPin, HelpingHandIcon, Share2, Camera } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { LanguageSwitcher } from './LanguageSwitcher';
import { getLocalizedProduct } from '../../utils/localizedEntities';

export const Footer: React.FC = () => {
  const { t, language } = useLanguage();

  const footerMonuments = [
    { slug: 'chua-mot-cot', name: 'Chùa Một Cột', city: 'hanoi' },
    { slug: 'khue-van-cac', name: 'Khuê Văn Các', city: 'hanoi' },
    { slug: 'cot-co-ha-noi', name: 'Cột Cờ Hà Nội', city: 'hanoi' },
    { slug: 'ngo-mon-hue', name: 'Ngọ Môn Huế', city: 'hue' },
  ];

  const cityLabels: Record<string, Record<string, string>> = {
    hanoi: { vi: 'Hà Nội', en: 'Hanoi', fr: 'Hanoï', zh: '河内', ko: '하노이', ja: 'ハノイ' },
    hue: { vi: 'Huế', en: 'Hue', fr: 'Hué', zh: '顺化', ko: '후에', ja: 'フエ' },
  };

  return (
    <footer className="border-t-2 border-brass/45 bg-forest-dark text-paper px-4 py-12 sm:px-6 lg:px-8 select-none">
      <div className="mx-auto max-w-7xl">
        {/* Main 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12 pb-8">
          {/* Column 1: Brand & Philosophy */}
          <div className="lg:col-span-4 space-y-4">
            <Link to="/" className="inline-block" aria-label="Viettoria Trang chủ">
              <img
                src="/viettoria-noback.svg"
                alt="Viettoria"
                className="h-8 sm:h-9 w-auto object-contain brightness-0 invert"
              />
            </Link>
            <p className="font-serif text-xs sm:text-sm text-paper/80 leading-relaxed max-w-sm">
              {t('footer.brandDesc')}
            </p>
          </div>

          {/* Column 2: 5 Monuments Collection */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-cinzel text-xs uppercase tracking-widest text-brass font-bold">
              {t('footer.monumentsCol')}
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm font-serif">
              {footerMonuments.map((m) => {
                const loc = getLocalizedProduct({ slug: m.slug, name: m.name } as any, language);
                return (
                  <li key={m.slug}>
                    <Link
                      to={`/products/${m.slug}`}
                      className="text-paper/80 hover:text-brass-light transition-colors flex items-center justify-between pr-4"
                    >
                      <span>{loc.name || m.name}</span>
                      <span className="font-sans text-[11px] text-brass/80">
                        {cityLabels[m.city]?.[language] || 'Hà Nội'}
                      </span>
                    </Link>
                  </li>
                );
              })}
              <li>
                <Link
                  to="/products"
                  className="text-paper/80 hover:text-brass-light transition-colors flex items-center justify-between pr-4 font-semibold text-brass"
                >
                  <span>{t('footer.otherMonuments')}</span>
                  <span className="font-sans text-[11px] text-brass">→</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Atelier & Story */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="font-cinzel text-xs uppercase tracking-widest text-brass font-bold">
              {t('footer.atelierCol')}
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm font-serif text-paper/80">
              <li>
                <Link to="/about" className="hover:text-brass-light transition-colors block">
                  {t('nav.about')}
                </Link>
              </li>
              <li>
                <Link to="/collections" className="hover:text-brass-light transition-colors block">
                  {t('nav.collections')}
                </Link>
              </li>
              <li>
                <Link to="/map" className="hover:text-brass-light transition-colors block">
                  {t('nav.map')}
                </Link>
              </li>
              <li>
                <Link to="/blogs" className="hover:text-brass-light transition-colors block">
                  {t('nav.blogs')}
                </Link>
              </li>
              <li>
                <Link to="/admin/login" className="hover:text-brass-light transition-colors block font-sans text-xs text-brass font-semibold">
                  {t('nav.cmsPortal')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Social */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-cinzel text-xs uppercase tracking-widest text-brass font-bold">
              {t('footer.connectCol')}
            </h4>
            <div className="space-y-2.5 text-xs sm:text-[13px] text-paper/80 font-serif">
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-brass shrink-0" />
                <a href={`mailto:${t('footer.contactEmail')}`} className="hover:text-brass-light transition-colors">
                  {t('footer.contactEmail')}
                </a>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-brass shrink-0 mt-0.5" />
                <span>{t('footer.locationHanoi')}</span>
              </div>
              <div className="flex items-start gap-2">
                <HelpingHandIcon className="w-3.5 h-3.5 text-brass shrink-0 mt-0.5" />
                <span>{t('footer.support247')}</span>
              </div>
            </div>

            {/* Social & Action Button */}
            <div className="flex items-center gap-2 pt-2">
              <button 
                type="button"
                className="w-8 h-8 flex items-center justify-center border border-brass/40 bg-forest text-paper hover:bg-brass hover:text-forest transition-all rounded-[2px]"
                title={t('common.share')}
              >
                <Share2 className="w-3.5 h-3.5" />
              </button>
              <button 
                type="button"
                className="w-8 h-8 flex items-center justify-center border border-brass/40 bg-forest text-paper hover:bg-brass hover:text-forest transition-all rounded-[2px]"
                title={t('common.photoLibrary')}
              >
                <Camera className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom copyright & language switcher line */}
        <div className="mt-8 border-t border-brass/25 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-paper/65">
          <p>{t('footer.copyright')}</p>

          {/* Footer Multi-Language Switcher */}
          <LanguageSwitcher variant="footer" />

          <p className="font-serif italic text-brass-subtle">
            {t('footer.tagline')}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
