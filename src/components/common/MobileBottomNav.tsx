import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Compass, Box, Layers, MapPin, QrCode } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

interface MobileBottomNavProps {
  onOpenQRModal: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ onOpenQRModal }) => {
  const { t } = useLanguage();
  const location = useLocation();

  // Hide mobile bottom nav inside full-screen viewer or admin routes
  if (location.pathname.startsWith('/admin')) {
    return null;
  }

  const navItems = [
    {
      to: '/',
      label: t('nav.home', 'Khám Phá'),
      icon: Compass,
      exact: true,
    },
    {
      to: '/products',
      label: t('nav.products', 'Tác Phẩm'),
      icon: Box,
      exact: false,
    },
    {
      to: '/collections',
      label: t('nav.collections', 'Bộ Sưu Tập'),
      icon: Layers,
      exact: false,
    },
    {
      to: '/map',
      label: t('nav.map', 'Bản Đồ'),
      icon: MapPin,
      exact: false,
    },
  ];

  return (
    <aside
      aria-label="Thanh điều hướng di động"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0D1C16]/96 backdrop-blur-lg border-t border-brass/35 shadow-[0_-8px_24px_rgba(13,28,22,0.45)] pb-[max(env(safe-area-inset-bottom,0px),8px)] pt-1.5 transition-all duration-300 select-none"
    >
      <div className="grid grid-cols-5 items-center px-2 max-w-md mx-auto">
        {/* First 2 items: Home & Products */}
        {navItems.slice(0, 2).map((item) => {
          const isActive = item.exact
            ? location.pathname === item.to
            : location.pathname.startsWith(item.to);
          const Icon = item.icon;

          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={`flex flex-col items-center justify-center py-1 px-1 transition-all duration-200 active:scale-90 ${
                isActive ? 'text-brass font-bold' : 'text-paper/70 hover:text-paper font-medium'
              }`}
            >
              <div className="relative">
                <Icon
                  size={19}
                  strokeWidth={isActive ? 2.2 : 1.7}
                  className={`transition-transform duration-200 ${isActive ? 'scale-110 text-brass' : ''}`}
                />
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-brass shadow-[0_0_6px_#D4AF37]" />
                )}
              </div>
              <span className="text-[10px] font-sans tracking-tight mt-1 truncate max-w-full">
                {item.label}
              </span>
            </NavLink>
          );
        })}

        {/* Center: Tactile QR Scanner Action Button */}
        <div className="flex flex-col items-center justify-center">
          <button
            type="button"
            onClick={onOpenQRModal}
            aria-label={t('nav.scanQr', 'Quét Tem QR Mô Hình')}
            className="group relative -mt-5 flex h-12 w-12 items-center justify-center rounded-full border-2 border-brass bg-gradient-to-b from-[#B88A38] to-[#8F6E4A] text-forest shadow-[0_4px_16px_rgba(184,138,56,0.5)] transition-all duration-200 active:scale-95 cursor-pointer hover:scale-105"
          >
            <QrCode size={20} strokeWidth={2.2} className="text-forest transition-transform group-hover:rotate-12" />
            <span className="absolute -inset-1 rounded-full border border-brass/50 animate-pulse pointer-events-none" />
          </button>
          <span className="text-[9.5px] font-sans font-bold text-brass tracking-tight mt-0.5 uppercase">
            {t('nav.scanShort', 'Quét QR')}
          </span>
        </div>

        {/* Last 2 items: Collections & Map */}
        {navItems.slice(2, 4).map((item) => {
          const isActive = item.exact
            ? location.pathname === item.to
            : location.pathname.startsWith(item.to);
          const Icon = item.icon;

          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={`flex flex-col items-center justify-center py-1 px-1 transition-all duration-200 active:scale-90 ${
                isActive ? 'text-brass font-bold' : 'text-paper/70 hover:text-paper font-medium'
              }`}
            >
              <div className="relative">
                <Icon
                  size={19}
                  strokeWidth={isActive ? 2.2 : 1.7}
                  className={`transition-transform duration-200 ${isActive ? 'scale-110 text-brass' : ''}`}
                />
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-brass shadow-[0_0_6px_#D4AF37]" />
                )}
              </div>
              <span className="text-[10px] font-sans tracking-tight mt-1 truncate max-w-full">
                {item.label}
              </span>
            </NavLink>
          );
        })}
      </div>
    </aside>
  );
};

export default MobileBottomNav;
