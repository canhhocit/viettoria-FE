import React, { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { QrCode, Menu, X } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { LanguageSwitcher } from './LanguageSwitcher';

interface HeaderProps {
  onOpenQRModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenQRModal }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
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
      className={`customer-header sticky top-0 z-50 border-b border-brass/30 bg-header/95 text-ink backdrop-blur-md transition-all duration-300 ${
        isScrolled ? 'py-1 shadow-sm' : 'py-0'
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
          <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5 text-[13px] font-medium shrink-0" aria-label={t('nav.menu', 'Menu chính')}>
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `whitespace-nowrap border-b-2 px-2.5 py-2 transition-colors duration-200 ${
                    isActive
                      ? 'border-forest text-forest font-bold'
                      : 'border-transparent text-ink/80 hover:border-forest/50 hover:text-forest'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Right Actions: Multi-language Switcher & Mobile Menu Toggle */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Heritage Language Switcher for International Visitors */}
            <LanguageSwitcher variant="header" />

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 border border-paper-border text-ink hover:border-brown-dark hover:text-brown-dark lg:hidden transition-colors rounded-[2px]"
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
    </header>
  );
};

export default Header;
