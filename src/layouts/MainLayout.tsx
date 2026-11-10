import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Header } from '../components/common/Header';
import { Footer } from '../components/common/Footer';
import { QRScanModal } from '../components/common/QRScanModal';
import { PageScrollProgress } from '../components/common/PageScrollProgress';
import { HeritagePassportModal } from '../components/heritage/HeritagePassportModal';

export const MainLayout: React.FC = () => {
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const location = useLocation();

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

      {/* Heritage Passport Modal */}
      <HeritagePassportModal />
    </div>
  );
};

export default MainLayout;
