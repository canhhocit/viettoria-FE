import React, { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Menu, X, QrCode } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { LanguageSwitcher } from './LanguageSwitcher';
import { HeritageSoundscape } from '../heritage/HeritageSoundscape';
import { WebsiteQRModal } from './WebsiteQRModal';

interface HeaderProps {
  onOpenQRModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenQRModal }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [websiteQrOpen, setWebsiteQrOpen] = useState<boolean>(false);
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const { t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { to: '/', label: t('nav.home', 'Trang Chủ') },
    { to: '/collections', label: t('nav.collections', 'Bộ Sưu Tập') },
    { to: '/products', label: t('nav.products', 'Tác Phẩm Di Sản') },
    { to: '/map', label: t('nav.map', 'Bản Đồ Di Sản') },
    { to: '/blogs', label: t('nav.blogs', 'Góc Nhìn Di Sản') },
    { to: '/about', label: t('nav.about', 'Về Viettoria') },
  ];

  return (
    <header 
      className={`customer-header sticky top-0 z-50 border-b-2 border-brass/50 bg-[#FAF7F0]/95 text-ink backdrop-blur-md transition-all duration-300 shadow-[0_2px_12px_rgba(20,40,32,0.06)] ${
        isScrolled ? 'py-0.5 shadow-md border-brass/70' : 'py-0'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div 
          className={`flex items-center justify-between transition-all duration-300 ${
            isScrolled ? 'h-14 sm:h-16' : 'h-16 sm:h-20'
          }`}
        >
          {/* Brand Logo - Pure SVG Identity from Reference */}
          <Link to="/" className="flex items-center gap-2 group focus:outline-none shrink-0" aria-label="Viettoria Trang chủ">
            <img
              src="/viettoria-noback.svg"
              alt="Viettoria"
              className={`w-auto object-contain transition-all duration-300 ${
                isScrolled ? 'h-7 sm:h-8' : 'h-8 sm:h-9'
              }`}
            />
          </Link>

          {/* Desktop Navigation Links - Heritage Pill Style */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2 text-[13px] font-sans font-medium shrink-0" aria-label={t('nav.menu', 'Menu chính')}>
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `whitespace-nowrap px-3 py-1.5 transition-all duration-200 rounded-[2px] ${
                    isActive
                      ? 'border-b-2 border-forest bg-forest/8 text-forest font-bold shadow-2xs'
                      : 'border-b-2 border-transparent text-charcoal/80 hover:text-forest hover:bg-paper-warm/80 hover:border-brass/40 font-semibold'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Right Actions: Multi-language Switcher, Soundscape & Mobile Menu Toggle */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Heritage Soundscape Ambient Bell Audio Toggle & Language Switcher Group */}
            <div className="flex items-center gap-1.5 border border-brass/35 bg-paper-warm/90 px-1.5 py-1 rounded-[2px] shadow-2xs">
              <HeritageSoundscape />
              <span className="h-3.5 w-px bg-brass/30" />
              <LanguageSwitcher variant="header" />
            </div>

            {/* Website Direct QR Modal Trigger (Icon only, cute & compact) */}
            <button
              type="button"
              onClick={() => setWebsiteQrOpen(true)}
              className="flex items-center justify-center p-2 border border-brass/40 bg-paper-warm/90 hover:bg-forest hover:text-brass text-forest transition-all rounded-[2px] shadow-2xs group focus:outline-none focus:ring-1 focus:ring-brass"
              aria-label={t('header.webQrAria', 'Mã QR liên kết website')}
              title={t('header.webQrTitle', 'Mã QR liên kết website')}
            >
              <QrCode className="w-4 h-4 transition-transform group-hover:scale-110 text-brass-dark group-hover:text-brass" />
            </button>

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 border border-paper-border text-ink hover:border-brass hover:text-forest lg:hidden transition-colors rounded-[2px]"
              aria-label={mobileMenuOpen ? t('nav.close', 'Đóng menu') : t('header.openNavigation', 'Mở danh mục điều hướng')}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-paper-border bg-header px-4 pt-4 pb-6 space-y-4 animate-fade-in">
          <nav className="flex flex-col space-y-1 text-sm font-medium">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `border-l-2 px-3 py-2.5 transition-colors ${
                    isActive
                      ? 'border-forest bg-forest text-brass font-bold'
                      : 'border-transparent text-charcoal hover:text-forest hover:bg-paper-warm font-medium'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Mobile Language Switcher */}
          <LanguageSwitcher variant="drawer" />

          <div className="pt-3 border-t border-paper-border flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenQRModal();
              }}
              className="w-full py-2.5 px-4 bg-brown-dark text-white text-sm font-semibold flex items-center justify-center gap-2 rounded-[2px] transition-colors hover:bg-brown"
            >
              <QrCode className="w-4 h-4" />
              <span>{t('nav.scanQr', 'Quét Tem QR Mô Hình')}</span>
            </button>
            <Link
              to="/admin/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-2 px-4 border border-paper-border text-brown-dark hover:text-ink text-sm font-medium text-center rounded-[2px] transition-colors"
            >
              {t('nav.cmsPortal', 'Truy Cập Quản Trị CMS')}
            </Link>
          </div>
        </div>
      )}
      {/* Website Direct Link QR Modal */}
      <WebsiteQRModal
        isOpen={websiteQrOpen}
        onClose={() => setWebsiteQrOpen(false)}
      />
    </header>
  );
};

export default Header;
