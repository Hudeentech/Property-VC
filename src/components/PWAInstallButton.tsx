import React, { useState } from 'react';
import { Download, Share, PlusSquare, X, CheckCircle2, Smartphone } from 'lucide-react';
import { usePWAInstall, useOnlineStatus } from '../hooks/usePWAInstall';
import { BrandLogo } from './HomePage';

interface PWAInstallButtonProps {
  variant?: 'home-header' | 'app-header' | 'settings';
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({ variant = 'app-header' }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showGuideModal, setShowGuideModal] = useState(false);

  // When rendered outside Settings, hide if already running in standalone mode
  if (isInstalled && variant !== 'settings') {
    return null;
  }

  // On Home Header or App Header, show when native prompt is ready OR on iOS
  if (variant !== 'settings' && !isInstallable && !isIOS) {
    return null;
  }

  const handleClick = async () => {
    if (isInstallable) {
      await install();
    } else {
      setShowGuideModal(true);
    }
  };

  return (
    <>
      {variant === 'home-header' && (
        <button
          type="button"
          onClick={handleClick}
          aria-label="Install Property VC App"
          title="Install App to Home Screen"
          className="inline-flex items-center gap-1.5 bg-white/15 hover:bg-white/25 backdrop-blur-md text-white border border-white/20 text-xs sm:text-sm font-semibold px-3 sm:px-3.5 py-2 rounded-xl transition-colors cursor-pointer"
        >
          <Download className="w-4 h-4 text-[#F9C083]" />
          <span>Install App</span>
        </button>
      )}

      {variant === 'app-header' && (
        <button
          type="button"
          onClick={handleClick}
          aria-label="Install Property VC App"
          title="Install App"
          className="h-9 inline-flex items-center gap-1.5 bg-[#F9C083] hover:bg-[#fbd09e] text-[#222325] text-xs font-semibold px-3 rounded-xl transition-colors cursor-pointer shadow-2xs"
        >
          <Download className="w-3.5 h-3.5 text-[#1B3352]" />
          <span>Install App</span>
        </button>
      )}

      {variant === 'settings' && (
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#1B3352] text-white flex items-center justify-center p-2 shrink-0">
              <BrandLogo className="w-full h-full text-white" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>Property VC Progressive Web App</span>
                {isInstalled && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Installed
                  </span>
                )}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 max-w-md">
                {isInstalled
                  ? 'You are running Property VC as an installed standalone app with full offline support.'
                  : 'Install Property VC on your phone or desktop for instant home screen access and full offline valuation capabilities.'}
              </p>
            </div>
          </div>

          {!isInstalled && (
            <button
              type="button"
              onClick={handleClick}
              className="inline-flex items-center gap-2 bg-[#1B3352] hover:bg-[#13253D] text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-colors cursor-pointer shadow-2xs"
            >
              <Download className="w-4 h-4 text-[#F9C083]" />
              <span>{isInstallable ? 'Install App Now' : isIOS ? 'Install on iOS' : 'How to Install'}</span>
            </button>
          )}
        </div>
      )}

      {/* Guided Installation Modal for iOS Safari / Browser Fallback */}
      {showGuideModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 no-print"
          role="dialog"
          aria-modal="true"
          aria-labelledby="pwa-install-guide-title"
        >
          <div className="w-full max-w-sm rounded-2xl bg-white dark:bg-[#1E222B] border border-slate-200 dark:border-slate-800 p-6 shadow-2xl text-slate-900 dark:text-white">
            <div className="flex items-start justify-between gap-3 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#1B3352] text-white flex items-center justify-center p-1.5">
                  <BrandLogo className="w-full h-full text-white" />
                </div>
                <div>
                  <h3 id="pwa-install-guide-title" className="text-base font-bold leading-tight">
                    Install Property VC
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Add to Home Screen for offline access
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowGuideModal(false)}
                aria-label="Close installation guide"
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {isIOS ? (
              <div className="space-y-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/70">
                  <Share className="w-4 h-4 text-[#1B3352] dark:text-[#F9C083] shrink-0 mt-0.5" />
                  <p>
                    1. Tap the <strong>Share</strong> button in your Safari toolbar.
                  </p>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/70">
                  <PlusSquare className="w-4 h-4 text-[#1B3352] dark:text-[#F9C083] shrink-0 mt-0.5" />
                  <p>
                    2. Scroll down and tap <strong>Add to Home Screen</strong>.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/70">
                  <Smartphone className="w-4 h-4 text-[#1B3352] dark:text-[#F9C083] shrink-0 mt-0.5" />
                  <p>
                    1. Click the <strong>Install</strong> icon in your browser&apos;s address bar (or open the browser menu <strong>⋮</strong>).
                  </p>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/70">
                  <PlusSquare className="w-4 h-4 text-[#1B3352] dark:text-[#F9C083] shrink-0 mt-0.5" />
                  <p>
                    2. Select <strong>Install Property Value Calculator</strong> or <strong>Add to Home screen</strong>.
                  </p>
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={() => setShowGuideModal(false)}
              className="mt-5 w-full rounded-xl bg-[#1B3352] hover:bg-[#13253D] py-2.5 text-xs font-semibold text-white transition-colors cursor-pointer"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-16 sm:bottom-4 left-4 z-50 flex items-center gap-2 rounded-xl bg-[#222325] border border-[#F9C083]/40 px-3.5 py-2 text-xs font-medium text-white shadow-xl no-print"
    >
      <span className="h-2 w-2 rounded-full bg-[#F9C083] animate-pulse" />
      <span>Offline Mode — Calculators &amp; saved reports available</span>
    </div>
  );
};
