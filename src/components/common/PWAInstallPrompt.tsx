import React, { useState, useEffect } from 'react';
import { Download, X, Sparkles } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export const PWAInstallPrompt: React.FC = () => {
  const { t } = useLanguage();
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isInstalled, setIsInstalled] = useState(() => {
    if (typeof window === 'undefined') return false;
    return (
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true
    );
  });

  useEffect(() => {
    if (isInstalled) return;

    // Check if user dismissed prompt recently (within 7 days)
    const dismissedTime = localStorage.getItem('viettoria_pwa_dismissed');
    if (dismissedTime && Date.now() - parseInt(dismissedTime, 10) < 7 * 24 * 60 * 60 * 1000) {
      return;
    }

    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      // Show prompt smoothly after 3 seconds of browsing
      const timer = window.setTimeout(() => {
        setIsVisible(true);
      }, 3000);
      return () => window.clearTimeout(timer);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setIsVisible(false);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsVisible(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem('viettoria_pwa_dismissed', Date.now().toString());
  };

  if (!isVisible || isInstalled) return null;

  return (
    <aside
      aria-label="Cài đặt ứng dụng Viettoria"
      className="fixed bottom-20 md:bottom-6 left-4 right-4 md:left-auto md:right-6 md:max-w-md z-50 animate-fade-up"
    >
      <div className="relative overflow-hidden rounded-[2px] border border-brass/60 bg-[#0D1C16]/95 p-4 text-paper shadow-[0_12px_36px_rgba(13,28,22,0.65)] backdrop-blur-md">
        {/* Gold accent line */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-brass-light via-brass to-brass-dark" />

        <div className="flex items-start gap-3.5">
          {/* App Icon */}
          <div className="relative shrink-0 w-11 h-11 rounded-[2px] overflow-hidden border border-brass/40 bg-forest p-1 shadow-sm">
            <img src="/pwa-192x192.png" alt="Viettoria Logo" className="w-full h-full object-contain" />
          </div>

          <div className="flex-1 min-w-0 pr-5">
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="font-serif text-sm font-bold text-paper truncate">
                VIETTORIA Atelier
              </span>
              <Sparkles size={13} className="text-brass animate-pulse shrink-0" />
            </div>
            <p className="text-xs text-paper/80 leading-snug">
              {t(
                'pwa.installDesc',
                'Cài đặt ứng dụng lên màn hình chính để khám phá mô hình 3D toàn màn hình và xem di sản offline.',
              )}
            </p>

            <div className="mt-3 flex items-center gap-2">
              <button
                type="button"
                onClick={handleInstallClick}
                className="inline-flex items-center gap-1.5 rounded-[2px] bg-gradient-to-r from-brass to-brass-dark px-3 py-1.5 text-xs font-sans font-bold uppercase tracking-wider text-forest shadow-[0_0_12px_rgba(184,138,68,0.35)] transition-all hover:brightness-110 active:scale-95 cursor-pointer"
              >
                <Download size={13} strokeWidth={2.5} />
                <span>{t('pwa.installButton', 'Cài Đặt Ngay')}</span>
              </button>
              <button
                type="button"
                onClick={handleDismiss}
                className="px-2.5 py-1.5 text-xs font-sans text-paper/60 hover:text-paper transition-colors cursor-pointer"
              >
                {t('pwa.later', 'Để sau')}
              </button>
            </div>
          </div>

          {/* Close button */}
          <button
            type="button"
            onClick={handleDismiss}
            aria-label="Đóng thông báo"
            className="absolute top-3 right-3 text-paper/50 hover:text-paper p-1 transition-colors cursor-pointer"
          >
            <X size={15} />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default PWAInstallPrompt;
