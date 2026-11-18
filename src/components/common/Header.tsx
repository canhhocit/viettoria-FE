import React, { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { Menu, X, QrCode, Compass, Box, Layers, MapPin, BookOpen, Info, Shield } from 'lucide-react';
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
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const { t } = useLanguage();
  const location = useLocation();

  const navLinks = [
    { to: '/', label: t('nav.home', 'Trang Chủ'), icon: Compass, sub: 'Khởi đầu hành trình văn hiến' },
    { to: '/collections', label: t('nav.collections', 'Bộ Sưu Tập'), icon: Layers, sub: 'Các dấu mốc thời đại' },
    { to: '/products', label: t('nav.products', 'Tác Phẩm Di Sản'), icon: Box, sub: 'Mô hình 3D & số hóa 1:120' },
    { to: '/map', label: t('nav.map', 'Bản Đồ Di Sản'), icon: MapPin, sub: 'Hệ tọa độ không gian số' },
    { to: '/blogs', label: t('nav.blogs', 'Góc Nhìn Di Sản'), icon: BookOpen, sub: 'Khảo cứu & ký ức lịch sử' },
    { to: '/about', label: t('nav.about', 'Về Viettoria'), icon: Info, sub: 'Xưởng chế tác & triết lý' },
  ];

  // Scroll handler: Morphing header elevation & scroll progress calculation
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 24);

      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight > 0) {
        const progress = Math.min(100, Math.max(0, (scrollY / docHeight) * 100));
        setScrollProgress(progress);
      } else {
        setScrollProgress(0);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`customer-header sticky top-0 z-50 text-ink backdrop-blur-md transition-all duration-300 ${
        isScrolled
          ? 'bg-[#FAF7F0]/98 border-b-2 border-forest/25 shadow-[0_4px_24px_rgba(20,40,32,0.08),0_1px_3px_rgba(184,138,56,0.12)]'
          : 'bg-[#FAF7F0]/92 border-b border-forest/15 shadow-[0_2px_12px_rgba(20,40,32,0.04)]'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`flex items-center justify-between transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            isScrolled ? 'h-14 sm:h-16' : 'h-16 sm:h-20'
          }`}
        >
          {/* Brand Logo - Identity with smooth hover elevation */}
          <Link
            to="/"
            className="flex items-center gap-2 group focus:outline-none shrink-0"
            aria-label="Viettoria Trang chủ"
          >
            <img
              src="/viettoria-noback.svg"
              alt="Viettoria"
              className={`w-auto object-contain transition-all duration-300 group-hover:scale-[1.03] ${
                isScrolled ? 'h-7 sm:h-8' : 'h-8 sm:h-9'
              }`}
            />
          </Link>

          {/* Desktop Navigation Links - Clean Heritage Editorial Style */}
          <nav
            className="hidden lg:flex items-center gap-6 xl:gap-8 shrink-0 py-1"
            aria-label={t('nav.menu', 'Menu chính')}
          >
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) =>
                  `relative py-1.5 whitespace-nowrap text-[13.5px] font-sans tracking-wide transition-all duration-200 select-none border-b-2 ${
                    isActive
                      ? 'border-forest text-forest font-bold'
                      : 'border-transparent text-charcoal/80 hover:text-forest hover:border-brass/50 font-medium'
                  }`
                }
              >
                <span>{link.label}</span>
              </NavLink>
            ))}
          </nav>

          {/* Right Actions: Multi-language Switcher, Soundscape & Mobile Menu Toggle */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Heritage Soundscape Ambient Audio Toggle & Language Switcher Group */}
            <div className="flex items-center gap-1.5 border border-forest/20 bg-paper-warm/90 hover:border-forest/40 transition-colors px-1.5 py-1 rounded-[2px] shadow-2xs">
              <HeritageSoundscape />
              <span className="h-3.5 w-px bg-forest/20" />
              <LanguageSwitcher variant="header" />
            </div>

            {/* Website Direct QR Modal Trigger with Tactile Feedback */}
            <button
              type="button"
              onClick={() => setWebsiteQrOpen(true)}
              className="relative flex items-center justify-center p-2 border border-forest/25 bg-paper-warm/90 hover:bg-forest hover:text-brass text-forest transition-all rounded-[2px] shadow-2xs group focus:outline-none focus:ring-1 focus:ring-forest active:scale-95 cursor-pointer"
              aria-label={t('header.webQrAria', 'Mã QR liên kết website')}
              title={t('header.webQrTitle', 'Mã QR liên kết website')}
            >
              <QrCode className="w-4 h-4 transition-transform group-hover:scale-110 group-hover:rotate-6 text-forest group-hover:text-brass" />
              <span className="absolute top-1 right-1 w-1 h-1 rounded-full bg-brass/80 pointer-events-none" />
            </button>

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 border border-forest/20 bg-paper-warm/90 text-forest hover:border-forest hover:bg-forest hover:text-paper lg:hidden transition-all rounded-[2px] active:scale-95 cursor-pointer"
              aria-label={
                mobileMenuOpen
                  ? t('nav.close', 'Đóng menu')
                  : t('header.openNavigation', 'Mở danh mục điều hướng')
              }
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Gold Leaf Hairline Scroll Progress Bar along Bottom Edge */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[2px] bg-paper-border/30 overflow-hidden pointer-events-none"
        aria-hidden="true"
      >
        <div
          className="h-full bg-gradient-to-r from-forest via-forest-light to-brass transition-all duration-150 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Mobile Drawer Navigation with Silk Paper & Lacquer Editorial Cadence */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-full z-50 animate-fade-in">
          {/* Backdrop Blur */}
          <div
            className="fixed inset-0 bg-forest-dark/60 backdrop-blur-xs -z-10"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />

          <div className="max-h-[calc(100svh-4rem)] overflow-y-auto border-b-2 border-brass/50 bg-[#FAF7F0] px-4 pt-4 pb-8 space-y-4 shadow-2xl">
            {/* Museum Header Badge inside Drawer */}
            <div className="flex items-center justify-between border-b border-paper-border pb-3">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-brass-dark font-semibold">
                VIETTORIA ATELIER · DANH MỤC
              </span>
              <span className="text-[10px] font-sans text-forest/70 font-medium">
                Tỷ lệ khảo cổ 1:120
              </span>
            </div>

            <nav className="flex flex-col space-y-2 text-sm" aria-label="Menu di động">
              {navLinks.map((link, idx) => {
                const isItemActive =
                  link.to === '/'
                    ? location.pathname === '/'
                    : location.pathname.startsWith(link.to);
                const Icon = link.icon;

                return (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    onClick={() => setMobileMenuOpen(false)}
                    style={{ animationDelay: `${idx * 35}ms` }}
                    className={`flex items-center justify-between px-3.5 py-3 rounded-[2px] transition-all duration-200 border ${
                      isItemActive
                        ? 'border-brass bg-forest text-paper font-bold shadow-sm'
                        : 'border-paper-border/80 bg-paper-warm/80 text-forest hover:bg-forest/10 hover:border-forest/40'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-[2px] border ${
                        isItemActive ? 'border-brass/40 bg-black/30 text-brass' : 'border-forest/15 bg-paper text-forest'
                      }`}>
                        <Icon size={16} strokeWidth={isItemActive ? 2.2 : 1.8} />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 leading-snug">
                          {isItemActive && <span className="text-brass text-xs">✦</span>}
                          <span className="font-medium truncate">{link.label}</span>
                        </div>
                        <p className={`text-[10px] truncate ${isItemActive ? 'text-brass-light/80' : 'text-charcoal-muted'}`}>
                          {link.sub}
                        </p>
                      </div>
                    </div>

                    {isItemActive ? (
                      <span className="text-[9.5px] uppercase font-mono tracking-widest text-brass bg-black/30 px-2 py-0.5 rounded-[1px] shrink-0">
                        {t('nav.current', 'Đang xem')}
                      </span>
                    ) : (
                      <span className="text-xs text-brass-dark font-sans opacity-60">→</span>
                    )}
                  </NavLink>
                );
              })}
            </nav>

            {/* Mobile Soundscape & Language Switcher in Drawer */}
            <div className="pt-3 border-t border-paper-border flex items-center justify-between gap-3 bg-paper-warm/90 p-3 border border-paper-border rounded-[2px]">
              <div className="flex items-center gap-2">
                <HeritageSoundscape />
                <span className="text-xs font-sans text-forest font-semibold">Âm vang di sản</span>
              </div>
              <LanguageSwitcher variant="drawer" />
            </div>

            {/* Direct Action Cards */}
            <div className="pt-2 flex flex-col gap-2.5">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenQRModal();
                }}
                className="w-full py-3 px-4 bg-gradient-to-r from-forest to-forest-light text-paper text-xs uppercase font-sans font-bold tracking-wider flex items-center justify-center gap-2.5 rounded-[2px] transition-all hover:brightness-110 border border-brass/50 shadow-md active:scale-[0.98] cursor-pointer"
              >
                <QrCode className="w-4 h-4 text-brass" />
                <span>{t('nav.scanQr', 'Quét Tem QR Mô Hình')}</span>
              </button>

              <Link
                to="/admin/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-2.5 px-4 border border-forest/20 bg-paper hover:bg-forest hover:text-paper text-forest text-xs font-mono uppercase tracking-wider text-center rounded-[2px] transition-colors flex items-center justify-center gap-2"
              >
                <Shield className="w-3.5 h-3.5 text-brass" />
                <span>{t('nav.cmsPortal', 'Truy Cập Quản Trị CMS')}</span>
              </Link>
            </div>
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
