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
  const { setLanguage } = useLanguage();

  // Show language picker only on the very first visit (no stored preference)
  const [showLangPicker, setShowLangPicker] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return !localStorage.getItem('viettoria_language');
  });

  const handleLanguageSelect = (lang: LanguageCode) => {
    setLanguage(lang);
    setShowLangPicker(false);
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

      {/* First-visit Language Picker — triggers bell audio on selection */}
      <LanguagePickerModal isOpen={showLangPicker} onSelect={handleLanguageSelect} />
    </div>
  );
};

export default MainLayout;
