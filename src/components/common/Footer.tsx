import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, MapPin, Share2, Camera, HelpingHandIcon } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { LanguageSwitcher } from './LanguageSwitcher';

export const Footer: React.FC = () => {
  const { t } = useLanguage();

  return (
    <footer className="border-t border-brass/25 bg-paper-deep/40 text-ink px-4 py-12 sm:px-6 lg:px-8 select-none">
      <div className="mx-auto max-w-7xl">
        {/* Main 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12 pb-8">
          {/* Column 1: Brand & Philosophy */}
          <div className="lg:col-span-4 space-y-4">
            <Link to="/" className="inline-block" aria-label="Viettoria Trang chủ">
              <img
                src="/viettoria-noback.svg"
                alt="Viettoria"
                className="h-8 sm:h-9 w-auto object-contain"
              />
            </Link>
            <p className="font-serif text-xs sm:text-sm text-brown-dark leading-relaxed max-w-sm">
              {t('footer.brandDesc')}
            </p>
          </div>

          {/* Column 2: 5 Monuments Collection */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-cinzel text-xs uppercase tracking-widest text-brown-dark font-bold">
              {t('footer.monumentsCol')}
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm font-serif">
              <li>
                <Link
                  to="/products/chua-mot-cot"
                  className="text-brown-dark hover:text-brown transition-colors flex items-center justify-between pr-4"
                >
                  <span>Chùa Một Cột</span>
                  <span className="font-sans text-[11px] opacity-70">Hà Nội</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/products/khue-van-cac"
                  className="text-brown-dark hover:text-brown transition-colors flex items-center justify-between pr-4"
                >
                  <span>Khuê Văn Các</span>
                  <span className="font-sans text-[11px] opacity-70">Hà Nội</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/products/cot-co-ha-noi"
                  className="text-brown-dark hover:text-brown transition-colors flex items-center justify-between pr-4"
                >
                  <span>Cột Cờ Hà Nội</span>
                  <span className="font-sans text-[11px] opacity-70">Hà Nội</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/products/ngo-mon-hue"
                  className="text-brown-dark hover:text-brown transition-colors flex items-center justify-between pr-4"
                >
                  <span>Ngọ Môn Huế</span>
                  <span className="font-sans text-[11px] opacity-70">Thừa Thiên Huế</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/products"
                  className="text-brown-dark hover:text-brown transition-colors flex items-center justify-between pr-4 font-semibold text-brass-dark"
                >
                  <span>{t('footer.otherMonuments')}</span>
                  <span className="font-sans text-[11px] opacity-70">→</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Atelier & Story */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="font-cinzel text-xs uppercase tracking-widest text-brown-dark font-bold">
              {t('footer.atelierCol')}
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm font-serif text-brown-dark">
              <li>
                <Link to="/about" className="hover:text-brown transition-colors block">
                  {t('nav.about')}
                </Link>
              </li>
              <li>
                <Link to="/collections" className="hover:text-brown transition-colors block">
                  {t('nav.collections')}
                </Link>
              </li>
              <li>
                <Link to="/map" className="hover:text-brown transition-colors block">
                  {t('nav.map')}
                </Link>
              </li>
              <li>
                <Link to="/blogs" className="hover:text-brown transition-colors block">
                  {t('nav.blogs')}
                </Link>
              </li>
              <li>
                <Link to="/admin/login" className="hover:text-brown transition-colors block font-sans text-xs text-brass-dark font-semibold">
                  {t('nav.cmsPortal')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Social */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-cinzel text-xs uppercase tracking-widest text-brown-dark font-bold">
              {t('footer.connectCol')}
            </h4>
            <div className="space-y-2.5 text-xs sm:text-[13px] text-brown-dark font-serif">
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-brown-dark shrink-0" />
                <a href={`mailto:${t('footer.contactEmail')}`} className="hover:text-brown transition-colors">
                  {t('footer.contactEmail')}
                </a>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-brown-dark shrink-0 mt-0.5" />
                <span>{t('footer.locationHanoi')}</span>
              </div>
              <div className="flex items-start gap-2">
                <HelpingHandIcon className="w-3.5 h-3.5 text-brown-dark shrink-0 mt-0.5" />
                <span>{t('footer.support247')}</span>
              </div>
            </div>

            {/* Social & Action Button */}
            <div className="flex items-center gap-2 pt-2">
              <button 
                type="button"
                className="w-8 h-8 flex items-center justify-center border border-paper-border text-brown-dark hover:bg-paper-warm hover:text-ink transition-all rounded-[2px]"
                title={t('common.share')}
              >
                <Share2 className="w-3.5 h-3.5" />
              </button>
              <button 
                type="button"
                className="w-8 h-8 flex items-center justify-center border border-paper-border text-brown-dark hover:bg-paper-warm hover:text-ink transition-all rounded-[2px]"
                title={t('common.photoLibrary')}
              >
                <Camera className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom copyright & language switcher line */}
        <div className="mt-8 border-t border-paper-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-charcoal-muted">
          <p>{t('footer.copyright')}</p>

          {/* Footer Multi-Language Switcher */}
          <LanguageSwitcher variant="footer" />

          <p className="font-serif italic text-brown-dark">
            {t('footer.tagline')}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
