import React, { useState, useEffect, useRef, useCallback } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
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
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const { t } = useLanguage();
  const location = useLocation();

  // Sliding Heritage Indicator refs & state
  const navContainerRef = useRef<HTMLElement | null>(null);
  const linkRefs = useRef<Map<string, HTMLAnchorElement>>(new Map());
  const [hoveredPath, setHoveredPath] = useState<string | null>(null);
  const [indicatorStyle, setIndicatorStyle] = useState<{ left: number; width: number; opacity: number }>({
    left: 0,
    width: 0,
    opacity: 0,
  });

  const navLinks = [
    { to: '/', label: t('nav.home', 'Trang Chủ') },
    { to: '/collections', label: t('nav.collections', 'Bộ Sưu Tập') },
    { to: '/products', label: t('nav.products', 'Tác Phẩm Di Sản') },
    { to: '/map', label: t('nav.map', 'Bản Đồ Di Sản') },
    { to: '/blogs', label: t('nav.blogs', 'Góc Nhìn Di Sản') },
    { to: '/about', label: t('nav.about', 'Về Viettoria') },
  ];

  // Helper to determine active link path
  const getActiveLinkPath = useCallback(() => {
    const current = location.pathname;
    const match = navLinks.find((link) =>
      link.to === '/' ? current === '/' : current.startsWith(link.to)
    );
    return match ? match.to : null;
  }, [location.pathname, navLinks]);

  // Update position of the sliding magic indicator
  const updateIndicator = useCallback(
    (targetPath: string | null) => {
      const container = navContainerRef.current;
      if (!container || !targetPath) {
        setIndicatorStyle((prev) => ({ ...prev, opacity: 0 }));
        return;
      }

      const activeEl = linkRefs.current.get(targetPath);
      if (!activeEl) {
        setIndicatorStyle((prev) => ({ ...prev, opacity: 0 }));
        return;
      }

      const containerRect = container.getBoundingClientRect();
      const elRect = activeEl.getBoundingClientRect();

      setIndicatorStyle({
        left: elRect.left - containerRect.left,
        width: elRect.width,
        opacity: 1,
      });
    },
    []
  );

  // Re-measure indicator when route or hovered link changes
  useEffect(() => {
    const target = hoveredPath || getActiveLinkPath();
    updateIndicator(target);
  }, [hoveredPath, location.pathname, getActiveLinkPath, updateIndicator]);

  // Re-calculate on window resize
  useEffect(() => {
    const handleResize = () => {
      const target = hoveredPath || getActiveLinkPath();
      updateIndicator(target);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [hoveredPath, getActiveLinkPath, updateIndicator]);

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

          {/* Desktop Navigation Links - Tone Be + Xanh with Sliding Heritage Indicator */}
          <nav
            ref={navContainerRef}
            onMouseLeave={() => setHoveredPath(null)}
            className="hidden lg:flex relative items-center gap-0.5 xl:gap-1.5 p-1 border border-forest/15 bg-paper-warm/70 rounded-[2px] shadow-2xs shrink-0"
            aria-label={t('nav.menu', 'Menu chính')}
          >
            {/* Sliding Heritage Magic Indicator (Tone Be + Xanh) */}
            <div
              className="absolute top-1 bottom-1 rounded-[2px] pointer-events-none transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] border border-forest/25 bg-forest/[0.09] shadow-xs border-b-2 border-b-forest"
              style={{
                transform: `translateX(${indicatorStyle.left}px)`,
                width: `${indicatorStyle.width}px`,
                opacity: indicatorStyle.opacity,
              }}
              aria-hidden="true"
            />

            {navLinks.map((link) => {
              const isItemActive =
                link.to === '/'
                  ? location.pathname === '/'
                  : location.pathname.startsWith(link.to);

              return (
                <NavLink
                  key={link.to}
                  to={link.to}
                  ref={(el) => {
                    if (el) linkRefs.current.set(link.to, el);
                    else linkRefs.current.delete(link.to);
                  }}
                  onMouseEnter={() => setHoveredPath(link.to)}
                  className={`relative z-10 whitespace-nowrap px-3 py-1.5 text-[13px] font-sans tracking-wide transition-colors duration-200 rounded-[2px] select-none ${
                    isItemActive
                      ? 'text-forest font-bold'
                      : 'text-charcoal/75 hover:text-forest font-semibold'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    {isItemActive && (
                      <span
                        className="text-brass text-[9px] font-bold animate-fade-in"
                        aria-hidden="true"
                      >
                        ✦
                      </span>
                    )}
                    <span>{link.label}</span>
                  </span>
                </NavLink>
              );
            })}
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

      {/* Mobile Drawer Navigation with Tone Be + Xanh */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t-2 border-forest/20 bg-[#FAF7F0] px-4 pt-3 pb-6 space-y-4 shadow-xl animate-fade-in">
          <nav className="flex flex-col space-y-1.5 text-sm">
            {navLinks.map((link, idx) => {
              const isItemActive =
                link.to === '/'
                  ? location.pathname === '/'
                  : location.pathname.startsWith(link.to);

              return (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileMenuOpen(false)}
                  style={{ animationDelay: `${idx * 40}ms` }}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-[2px] transition-all duration-200 border-l-3 ${
                    isItemActive
                      ? 'border-brass bg-forest text-paper font-bold shadow-xs'
                      : 'border-transparent text-forest hover:bg-forest/10 hover:border-forest/40 font-medium'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    {isItemActive && <span className="text-brass text-xs">✦</span>}
                    <span>{link.label}</span>
                  </span>
                  {isItemActive && (
                    <span className="text-[10px] uppercase font-mono tracking-widest text-brass bg-black/25 px-1.5 py-0.5 rounded-[1px]">
                      {t('nav.current', 'Đang xem')}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>

          {/* Mobile Language Switcher */}
          <div className="pt-2 border-t border-forest/15">
            <LanguageSwitcher variant="drawer" />
          </div>

          <div className="pt-3 border-t border-forest/15 flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenQRModal();
              }}
              className="w-full py-2.5 px-4 bg-forest text-paper text-sm font-semibold flex items-center justify-center gap-2 rounded-[2px] transition-colors hover:bg-forest-light border border-brass/50 shadow-xs cursor-pointer"
            >
              <QrCode className="w-4 h-4 text-brass" />
              <span>{t('nav.scanQr', 'Quét Tem QR Mô Hình')}</span>
            </button>
            <Link
              to="/admin/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-2 px-4 border border-forest/25 bg-paper-warm/80 text-forest hover:bg-forest hover:text-paper text-sm font-medium text-center rounded-[2px] transition-colors"
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
