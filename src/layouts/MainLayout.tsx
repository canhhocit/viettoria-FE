import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Header } from '../components/common/Header';
import { Footer } from '../components/common/Footer';
import { QRScanModal } from '../components/common/QRScanModal';
import { PageScrollProgress } from '../components/common/PageScrollProgress';
import { LanguagePickerModal } from '../components/common/LanguagePickerModal';
import { useLanguage } from '../contexts/LanguageContext';
import type { LanguageCode } from '../locales';

export const MainLayout: React.FC = () => {
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const location = useLocation();
  const { language, setLanguage } = useLanguage();

  // Always show language picker whenever loading or reloading on the main page ('/'),
  // or on any entry point if not yet chosen in this browser session.
  const [showLangPicker, setShowLangPicker] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    // Always prompt on main page on every entry or reload
    if (location.pathname === '/' || location.pathname === '') return true;
    // On other routes, prompt if entering the web without having selected language this session
    return sessionStorage.getItem('viettoria_lang_selected_session') !== 'true';
  });

  const handleLanguageSelect = (lang: LanguageCode) => {
    setLanguage(lang);
    setShowLangPicker(false);
    try {
      sessionStorage.setItem('viettoria_lang_selected_session', 'true');
    } catch {
      // ignore
    }
    // Fire inside the user-gesture stack so AudioContext.resume() is allowed
    window.dispatchEvent(new CustomEvent('viettoria:start-bell'));
  };

  return (
    <div className="min-h-screen flex flex-col bg-paper text-charcoal font-sans selection:bg-brass selection:text-white">
      <PageScrollProgress />
      {/* Editorial Header */}
      <Header onOpenQRModal={() => setIsQRModalOpen(true)} />

      {/* Main Outlet with Page Transition */}
      <main key={location.pathname} className="flex-1 animate-fade-up">
        <Outlet />
      </main>

      {/* Universal Footer */}
      <Footer />

      {/* QR Code Scanner / Resolver Modal */}
      <QRScanModal 
        isOpen={isQRModalOpen} 
        onClose={() => setIsQRModalOpen(false)} 
      />

      {/* Language Picker Modal — triggers bell audio on selection */}
      <LanguagePickerModal
        isOpen={showLangPicker}
        currentLanguage={language}
        onSelect={handleLanguageSelect}
      />
    </div>
  );
};

export default MainLayout;
