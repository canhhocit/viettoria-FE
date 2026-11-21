import React, { useState, useEffect, useCallback } from 'react';
import { Download, X, Sparkles, Share, PlusSquare, ArrowDown, Check, Smartphone } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import type { LanguageCode } from '../../locales';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

// Multilingual labels for 6 languages
const PWA_TEXT: Record<LanguageCode, {
  badge: string;
  title: string;
  desc: string;
  installBtn: string;
  laterBtn: string;
  collapsedLabel: string;
  iosTitle: string;
  iosStep1: string;
  iosStep2: string;
  iosStep3: string;
  iosGotIt: string;
  androidFallbackTitle: string;
  androidFallbackStep1: string;
  androidFallbackStep2: string;
  androidFallbackGotIt: string;
}> = {
  vi: {
    badge: 'Ứng Dụng Di Sản',
    title: 'Cài Đặt App Viettoria',
    desc: 'Cài đặt về máy để xoay 3D toàn màn hình, tải nhanh tức thì và khám phá di sản offline.',
    installBtn: 'Cài Đặt Ngay',
    laterBtn: 'Để sau',
    collapsedLabel: 'Cài App',
    iosTitle: 'Cài Đặt Lên Màn Hình iPhone',
    iosStep1: 'Nhấn vào biểu tượng Chia sẻ ở thanh dưới cùng trình duyệt Safari.',
    iosStep2: 'Cuộn xuống danh sách tác vụ và chọn "Thêm vào MH chính" (Add to Home Screen).',
    iosStep3: 'Nhấn "Thêm" ở góc trên bên phải để đưa Viettoria ra màn hình chính.',
    iosGotIt: 'Đã hiểu',
    androidFallbackTitle: 'Cài Đặt Trên Trình Duyệt',
    androidFallbackStep1: 'Chạm vào biểu tượng Menu 3 chấm (⋮) ở góc trên bên phải trình duyệt.',
    androidFallbackStep2: 'Chọn "Cài đặt ứng dụng" hoặc "Thêm vào Màn hình chính".',
    androidFallbackGotIt: 'Đã hiểu',
  },
  en: {
    badge: 'Heritage App',
    title: 'Install Viettoria App',
    desc: 'Install to your home screen for immersive fullscreen 3D models and offline heritage exploration.',
    installBtn: 'Install App',
    laterBtn: 'Later',
    collapsedLabel: 'Get App',
    iosTitle: 'Install to iPhone Home Screen',
    iosStep1: 'Tap the Share icon on the bottom toolbar in Safari.',
    iosStep2: 'Scroll down and tap "Add to Home Screen".',
    iosStep3: 'Tap "Add" at the top right corner to install Viettoria.',
    iosGotIt: 'Got it',
    androidFallbackTitle: 'Install in Browser',
    androidFallbackStep1: 'Tap the three dots menu (⋮) at the top right corner of your browser.',
    androidFallbackStep2: 'Select "Install app" or "Add to Home screen".',
    androidFallbackGotIt: 'Got it',
  },
  fr: {
    badge: 'App Patrimoine',
    title: 'Installer l\'App Viettoria',
    desc: 'Installez sur votre écran d\'accueil pour profiter des modèles 3D plein écran et hors ligne.',
    installBtn: 'Installer',
    laterBtn: 'Plus tard',
    collapsedLabel: 'Installer',
    iosTitle: 'Installer sur l\'écran d\'accueil iPhone',
    iosStep1: 'Touchez l\'icône Partager dans la barre inférieure de Safari.',
    iosStep2: 'Faites défiler vers le bas et sélectionnez "Sur l\'écran d\'accueil".',
    iosStep3: 'Touchez "Ajouter" en haut à droite pour finaliser l\'installation.',
    iosGotIt: 'Compris',
    androidFallbackTitle: 'Installer dans le navigateur',
    androidFallbackStep1: 'Touchez le menu à trois points (⋮) en haut à droite de votre navigateur.',
    androidFallbackStep2: 'Sélectionnez "Installer l\'application" ou "Ajouter à l\'écran d\'accueil".',
    androidFallbackGotIt: 'Compris',
  },
  zh: {
    badge: '文化遗产应用',
    title: '安装 Viettoria 应用',
    desc: '安装至手机桌面，畅享全屏三维互动与离线遗产沉浸体验。',
    installBtn: '立即安装',
    laterBtn: '稍后',
    collapsedLabel: '安装应用',
    iosTitle: '添加至 iPhone 主屏幕',
    iosStep1: '轻触 Safari 浏览器底部工具栏的“分享”图标。',
    iosStep2: '向下滑动并选择“添加到主屏幕”。',
    iosStep3: '轻触右上角“添加”即可完成安装。',
    iosGotIt: '我知道了',
    androidFallbackTitle: '在浏览器中安装',
    androidFallbackStep1: '轻触浏览器右上角的三点菜单 (⋮)。',
    androidFallbackStep2: '选择“安装应用”或“添加到主屏幕”。',
    androidFallbackGotIt: '我知道了',
  },
  ko: {
    badge: '문화유산 앱',
    title: 'Viettoria 앱 설치',
    desc: '홈 화면에 설치하여 전체 화면 3D 감상과 오프라인 유산 탐색을 경험하세요.',
    installBtn: '앱 설치하기',
    laterBtn: '나중에',
    collapsedLabel: '앱 설치',
    iosTitle: 'iPhone 홈 화면에 추가',
    iosStep1: 'Safari 브라우저 하단 툴바의 공유 아이콘을 탭합니다.',
    iosStep2: '스크롤을 내려 "홈 화면에 추가"를 선택합니다.',
    iosStep3: '우측 상단의 "추가"를 탭하여 설치를 완료합니다.',
    iosGotIt: '확인',
    androidFallbackTitle: '브라우저에서 설치',
    androidFallbackStep1: '브라우저 우측 상단의 메뉴(⋮) 아이콘을 탭합니다.',
    androidFallbackStep2: '"앱 설치" 또는 "홈 화면에 추가"를 선택합니다.',
    androidFallbackGotIt: '확인',
  },
  ja: {
    badge: '遺産アプリ',
    title: 'Viettoria アプリをインストール',
    desc: 'ホーム画面に追加して、全画面3Dモデル鑑賞とオフライン遺産体験をお楽しみください。',
    installBtn: '今すぐインストール',
    laterBtn: '後で',
    collapsedLabel: 'アプリ追加',
    iosTitle: 'iPhoneのホーム画面に追加',
    iosStep1: 'Safari下部ツールバーの「共有」アイコンをタップします。',
    iosStep2: 'スクロールして「ホーム画面に追加」を選択します。',
    iosStep3: '右上の「追加」をタップしてインストールを完了します。',
    iosGotIt: '了解しました',
    androidFallbackTitle: 'ブラウザでのインストール',
    androidFallbackStep1: 'ブラウザ右上のメニュー（⋮）アイコンをタップします。',
    androidFallbackStep2: '「アプリをインストール」または「ホーム画面に追加」を選択します。',
    androidFallbackGotIt: '了解しました',
  },
};

export const PWAInstallPrompt: React.FC = () => {
  const { language } = useLanguage();
  const text = PWA_TEXT[language] || PWA_TEXT.vi;

  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [displayState, setDisplayState] = useState<'hidden' | 'collapsed' | 'expanded'>('hidden');
  const [showIOSSheet, setShowIOSSheet] = useState(false);
  const [showAndroidFallback, setShowAndroidFallback] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  // Check if app is already running in standalone (installed) mode
  const [isInstalled, setIsInstalled] = useState(() => {
    if (typeof window === 'undefined') return false;
    return (
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true ||
      document.referrer.includes('android-app://')
    );
  });

  // Detect platform & mount initial state
  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (isInstalled) {
      setDisplayState('hidden');
      return;
    }

    // Detect iOS
    const ua = window.navigator.userAgent.toLowerCase();
    const isIOSDevice =
      /iphone|ipad|ipod/.test(ua) ||
      (window.navigator.platform === 'MacIntel' && window.navigator.maxTouchPoints > 1);
    setIsIOS(isIOSDevice);

    // Capture native PWA install prompt event (Chromium / Android)
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    // Listen for successful installation
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDisplayState('hidden');
      setDeferredPrompt(null);
    };

    window.addEventListener('appinstalled', handleAppInstalled);

    // Initial display trigger: Show on mobile web after 1.8 seconds of browsing
    const isSessionDismissed = sessionStorage.getItem('viettoria_pwa_session_closed') === 'true';
    const isSessionCollapsed = sessionStorage.getItem('viettoria_pwa_collapsed') === 'true';

    if (!isSessionDismissed) {
      const timer = window.setTimeout(() => {
        if (isSessionCollapsed) {
          setDisplayState('collapsed');
        } else {
          setDisplayState('expanded');
        }
      }, 1800);

      return () => {
        window.clearTimeout(timer);
        window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
        window.removeEventListener('appinstalled', handleAppInstalled);
      };
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [isInstalled]);

  // Handle "Install Now" click
  const handleInstallClick = useCallback(async () => {
    if (isIOS) {
      // iOS Safari does not support automated prompt(); guide with bottom sheet
      setShowIOSSheet(true);
      return;
    }

    if (deferredPrompt) {
      // Native Android / Chromium automated prompt
      try {
        await deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
          setIsInstalled(true);
          setDisplayState('hidden');
        }
      } catch (err) {
        console.warn('Install prompt failed:', err);
      }
      setDeferredPrompt(null);
    } else {
      // Android / Other browsers where beforeinstallprompt was delayed or blocked
      setShowAndroidFallback(true);
    }
  }, [isIOS, deferredPrompt]);

  // Handle user clicking "Later" or minimize button
  const handleCollapse = () => {
    setDisplayState('collapsed');
    try {
      sessionStorage.setItem('viettoria_pwa_collapsed', 'true');
    } catch {
      // ignore storage errors
    }
  };

  // Completely close for this session
  const handleCloseSession = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDisplayState('hidden');
    try {
      sessionStorage.setItem('viettoria_pwa_session_closed', 'true');
    } catch {
      // ignore storage errors
    }
  };

  // Expand back from collapsed pill
  const handleExpand = () => {
    setDisplayState('expanded');
    try {
      sessionStorage.removeItem('viettoria_pwa_collapsed');
    } catch {
      // ignore
    }
  };

  if (isInstalled || displayState === 'hidden') {
    return null;
  }

  return (
    <>
      {/* 1. COLLAPSED FLOATING PILL (Bottom-Right, sits above mobile nav) */}
      {displayState === 'collapsed' && (
        <aside
          aria-label="Nút cài đặt ứng dụng"
          className="fixed bottom-[74px] right-3 sm:right-6 z-50 animate-fade-up select-none"
        >
          <div className="relative group">
            <button
              type="button"
              onClick={handleExpand}
              className="flex items-center gap-2 rounded-full border border-brass/80 bg-forest/95 px-3 py-2 text-paper shadow-[0_8px_24px_rgba(13,28,22,0.65),0_0_14px_rgba(184,138,68,0.3)] backdrop-blur-md transition-all duration-300 hover:border-brass hover:scale-105 active:scale-95 cursor-pointer"
            >
              {/* App mini icon with pulsing beacon */}
              <div className="relative w-6 h-6 rounded-full overflow-hidden border border-brass/50 bg-[#0D1C16] p-0.5 shrink-0">
                <img src="/pwa-192x192.png" alt="Viettoria" className="w-full h-full object-contain" />
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 border border-forest animate-pulse" />
              </div>
              <span className="font-sans text-xs font-bold text-brass tracking-wide uppercase">
                {text.collapsedLabel}
              </span>
              <Download size={13} className="text-brass animate-bounce" />
            </button>

            {/* Tiny close 'x' icon on hover/tap to fully dismiss */}
            <button
              type="button"
              onClick={handleCloseSession}
              aria-label="Đóng"
              className="absolute -top-1.5 -left-1.5 w-4 h-4 rounded-full bg-forest border border-brass/40 text-paper/60 hover:text-paper flex items-center justify-center text-[10px] shadow-sm cursor-pointer"
            >
              <X size={10} />
            </button>
          </div>
        </aside>
      )}

      {/* 2. EXPANDED MOBILE PROMPT CARD (Bottom-Right Floating Widget) */}
      {displayState === 'expanded' && (
        <aside
          aria-label="Đề xuất cài đặt ứng dụng Viettoria"
          className="fixed bottom-[74px] right-3 sm:right-6 z-50 max-w-[340px] w-[calc(100vw-24px)] animate-fade-up select-none"
        >
          <div className="relative overflow-hidden rounded-xl border border-brass/70 bg-[#0D1C16]/95 p-3.5 sm:p-4 text-paper shadow-[0_16px_40px_rgba(13,28,22,0.8),0_0_24px_rgba(184,138,68,0.22)] backdrop-blur-xl">
            {/* Royal Gold Top Accent Line */}
            <div className="absolute top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-brass-light via-brass to-brass-dark" />

            <div className="flex items-start gap-3">
              {/* App Icon with Golden Rim & Emerald Beacon */}
              <div className="relative shrink-0 w-12 h-12 rounded-lg overflow-hidden border border-brass/60 bg-forest p-1 shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
                <img
                  src="/pwa-192x192.png"
                  alt="Viettoria Atelier Logo"
                  className="w-full h-full object-contain"
                />
                <span className="absolute bottom-0.5 right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border border-forest animate-pulse" />
              </div>

              {/* Text Info */}
              <div className="flex-1 min-w-0 pr-4">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className="font-sans text-[10px] font-bold uppercase tracking-wider text-brass">
                    {text.badge}
                  </span>
                  <Sparkles size={11} className="text-brass animate-pulse shrink-0" />
                </div>
                <h4 className="font-serif text-sm font-bold text-paper tracking-tight leading-tight">
                  {text.title}
                </h4>
                <p className="mt-1 text-[11.5px] text-paper/80 leading-snug line-clamp-2">
                  {text.desc}
                </p>

                {/* Action Buttons */}
                <div className="mt-3 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleInstallClick}
                    className="inline-flex items-center gap-1.5 rounded-md bg-gradient-to-r from-brass via-brass-light to-brass-dark px-3 py-1.5 text-[11px] font-sans font-bold uppercase tracking-wider text-forest shadow-[0_0_14px_rgba(184,138,68,0.4)] transition-all duration-200 hover:brightness-110 active:scale-95 cursor-pointer"
                  >
                    <Download size={13} strokeWidth={2.6} />
                    <span>{text.installBtn}</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleCollapse}
                    className="px-2 py-1.5 text-[11.5px] font-sans text-paper/60 hover:text-paper transition-colors cursor-pointer"
                  >
                    {text.laterBtn}
                  </button>
                </div>
              </div>

              {/* Close Button */}
              <button
                type="button"
                onClick={handleCollapse}
                aria-label="Thu nhỏ"
                className="absolute top-2.5 right-2.5 text-paper/40 hover:text-paper p-1 rounded-full transition-colors cursor-pointer"
              >
                <X size={15} />
              </button>
            </div>
          </div>
        </aside>
      )}

      {/* 3. iOS SAFARI INSTALLATION GUIDE SHEET */}
      {showIOSSheet && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="ios-sheet-title"
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/75 backdrop-blur-sm animate-fade-up"
          onClick={() => setShowIOSSheet(false)}
        >
          <div
            className="w-full max-w-md rounded-t-2xl sm:rounded-2xl border border-brass/60 bg-[#0D1C16] p-5 text-paper shadow-[0_20px_50px_rgba(0,0,0,0.85)]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-brass/30">
              <div className="flex items-center gap-2">
                <Smartphone size={18} className="text-brass" />
                <h3 id="ios-sheet-title" className="font-serif text-base font-bold text-paper">
                  {text.iosTitle}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowIOSSheet(false)}
                className="text-paper/60 hover:text-paper p-1 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Steps */}
            <div className="mt-4 space-y-3.5 text-xs text-paper/90">
              <div className="flex items-start gap-3 p-2.5 rounded-lg bg-forest/60 border border-brass/20">
                <div className="w-6 h-6 rounded-full bg-brass/20 text-brass flex items-center justify-center font-bold text-xs shrink-0">
                  1
                </div>
                <div className="flex-1">
                  <p className="leading-relaxed">
                    {text.iosStep1}{' '}
                    <span className="inline-flex items-center gap-1 font-semibold text-brass">
                      <Share size={13} className="inline" /> Chia sẻ
                    </span>
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-2.5 rounded-lg bg-forest/60 border border-brass/20">
                <div className="w-6 h-6 rounded-full bg-brass/20 text-brass flex items-center justify-center font-bold text-xs shrink-0">
                  2
                </div>
                <div className="flex-1">
                  <p className="leading-relaxed">
                    {text.iosStep2}{' '}
                    <span className="inline-flex items-center gap-1 font-semibold text-brass">
                      <PlusSquare size={13} className="inline" /> Thêm vào MH chính
                    </span>
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-2.5 rounded-lg bg-forest/60 border border-brass/20">
                <div className="w-6 h-6 rounded-full bg-brass/20 text-brass flex items-center justify-center font-bold text-xs shrink-0">
                  3
                </div>
                <div className="flex-1">
                  <p className="leading-relaxed">{text.iosStep3}</p>
                </div>
              </div>
            </div>

            {/* Close CTA */}
            <div className="mt-5">
              <button
                type="button"
                onClick={() => setShowIOSSheet(false)}
                className="w-full flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-brass to-brass-dark py-2.5 text-xs font-sans font-bold uppercase tracking-wider text-forest cursor-pointer active:scale-95"
              >
                <Check size={14} strokeWidth={2.5} />
                <span>{text.iosGotIt}</span>
              </button>
            </div>

            {/* Down arrow pointing towards Safari bottom bar */}
            <div className="mt-3 flex flex-col items-center justify-center text-brass/70 text-[11px]">
              <span className="animate-bounce">
                <ArrowDown size={16} />
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 4. ANDROID FALLBACK GUIDE SHEET (When browser event is delayed) */}
      {showAndroidFallback && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-up"
          onClick={() => setShowAndroidFallback(false)}
        >
          <div
            className="w-full max-w-sm rounded-xl border border-brass/60 bg-[#0D1C16] p-5 text-paper shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-brass/30">
              <div className="flex items-center gap-2">
                <Smartphone size={18} className="text-brass" />
                <h3 className="font-serif text-base font-bold text-paper">
                  {text.androidFallbackTitle}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAndroidFallback(false)}
                className="text-paper/60 hover:text-paper p-1 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mt-4 space-y-3 text-xs text-paper/90">
              <p className="leading-relaxed">{text.androidFallbackStep1}</p>
              <p className="leading-relaxed">{text.androidFallbackStep2}</p>
            </div>

            <div className="mt-5">
              <button
                type="button"
                onClick={() => setShowAndroidFallback(false)}
                className="w-full flex items-center justify-center gap-2 rounded-md bg-gradient-to-r from-brass to-brass-dark py-2 text-xs font-sans font-bold uppercase tracking-wider text-forest cursor-pointer active:scale-95"
              >
                <Check size={14} strokeWidth={2.5} />
                <span>{text.androidFallbackGotIt}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PWAInstallPrompt;