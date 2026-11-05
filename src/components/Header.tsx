import React from 'react';
import { ActiveTab } from '../types/valuation';
import { BrandLogo } from './HomePage';
import { PWAInstallButton } from './PWAInstallButton';
import {
  Home,
  KeyRound,
  Building2,
  Landmark,
  History,
  Settings,
  Printer,
  RotateCcw,
  BookmarkPlus,
} from 'lucide-react';

interface HeaderProps {
  activeTab: ActiveTab;
  historyCount: number;
  onSelectTab: (tab: ActiveTab) => void;
  onSaveToHistory: () => void;
  onReset: () => void;
  onOpenReport: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  historyCount,
  onSelectTab,
  onSaveToHistory,
  onReset,
  onOpenReport,
}) => {
  const isCalculatorPage =
    activeTab === 'rental' || activeTab === 'capital' || activeTab === 'mortgage';

  return (
    <>
      {activeTab !== 'home' && (
        <header className="pt-5 sm:pt-6 md:pt-5 pb-4 md:shrink-0 bg-[#f8fafc] dark:bg-[#12151C] transition-colors">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
            {/* Brand Title that returns to Home */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => onSelectTab('home')}
                className="flex items-center gap-2.5 text-left group cursor-pointer"
                aria-label="Go to Home Page"
              >
                <div className="w-9 h-9 rounded-xl bg-[#1B3352] text-white flex items-center justify-center p-1.5 shadow-xs group-hover:bg-[#13253D] transition-colors">
                  <BrandLogo className="w-full h-full text-white" />
                </div>
                <div>
                  <h1 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-white leading-tight">
                    Property Value Calculator
                  </h1>
                  <p className="text-slate-500 dark:text-slate-400 text-xs">
                    {activeTab === 'rental' && 'Rental Value Calculator'}
                    {activeTab === 'capital' && 'Capital Value Calculator'}
                    {activeTab === 'mortgage' && 'Mortgage Value Calculator'}
                    {activeTab === 'history' && 'Saved Valuation Reports'}
                    {activeTab === 'settings' && 'Preferences & Theme'}
                  </p>
                </div>
              </button>
            </div>

            {/* Desktop Navigation Tabs + Quick Actions */}
            <div className="flex flex-wrap items-center gap-2 no-print">
              <nav
                aria-label="Primary Navigation"
                className="hidden sm:flex items-center bg-slate-100 dark:bg-slate-800/90 p-1 rounded-xl"
              >
                <button
                  type="button"
                  onClick={() => onSelectTab('home')}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                >
                  <Home className="w-3.5 h-3.5" />
                  <span>Home</span>
                </button>

                <button
                  type="button"
                  onClick={() => onSelectTab('rental')}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                    activeTab === 'rental'
                      ? 'bg-[#F9C083] text-[#1E1E1E] shadow-2xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>Rental</span>
                </button>

                <button
                  type="button"
                  onClick={() => onSelectTab('capital')}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                    activeTab === 'capital'
                      ? 'bg-[#1B3352] text-white shadow-2xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Building2 className="w-3.5 h-3.5" />
                  <span>Capital</span>
                </button>

                <button
                  type="button"
                  onClick={() => onSelectTab('mortgage')}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                    activeTab === 'mortgage'
                      ? 'bg-[#E4CEFA] text-[#222325] shadow-2xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Landmark className="w-3.5 h-3.5" />
                  <span>Mortgage</span>
                </button>

                <button
                  type="button"
                  onClick={() => onSelectTab('history')}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    activeTab === 'history'
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <History className="w-3.5 h-3.5" />
                  <span>History</span>
                  {historyCount > 0 && (
                    <span className="text-[11px] opacity-75">({historyCount})</span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => onSelectTab('settings')}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    activeTab === 'settings'
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Settings className="w-3.5 h-3.5" />
                  <span>Settings</span>
                </button>
              </nav>

              <PWAInstallButton variant="app-header" />

              {/* Quick Action Buttons when on Calculator pages */}
              {isCalculatorPage && (
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={onSaveToHistory}
                    className="h-9 inline-flex items-center gap-1.5 bg-[#1B3352] hover:bg-[#13253D] text-white text-xs font-medium px-3 rounded-xl transition-colors cursor-pointer shadow-2xs"
                    aria-label="Save Valuation to History"
                  >
                    <BookmarkPlus className="w-3.5 h-3.5 text-[#F9C083]" />
                    <span>Save</span>
                  </button>

                  {activeTab !== 'mortgage' && (
                    <button
                      type="button"
                      onClick={onOpenReport}
                      className="h-9 inline-flex items-center gap-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-medium px-3 rounded-xl transition-colors cursor-pointer"
                      aria-label="Generate Valuation Report"
                    >
                      <Printer className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                      <span className="hidden md:inline">Report</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={onReset}
                    className="h-9 inline-flex items-center gap-1 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-medium px-2.5 rounded-xl transition-colors cursor-pointer"
                    aria-label="Clear Calculator Fields"
                    title="Clear fields"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span className="hidden md:inline">Clear</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>
      )}

      {/* Mobile Native Bottom Navigation Bar */}
      {activeTab !== 'home' && (
        <nav
          aria-label="Mobile Bottom Navigation"
          className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#181B22]/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 px-1.5 py-1.5 no-print"
        >
          <div className="grid grid-cols-6 gap-0.5 max-w-md mx-auto">
            <button
              type="button"
              onClick={() => onSelectTab('home')}
              className="flex flex-col items-center justify-center py-1 rounded-xl text-[10px] font-medium transition-colors cursor-pointer text-slate-500 dark:text-slate-400"
            >
              <Home className="w-4 h-4 mb-0.5" />
              <span>Home</span>
            </button>

            <button
              type="button"
              onClick={() => onSelectTab('rental')}
              className={`flex flex-col items-center justify-center py-1 rounded-xl text-[10px] font-medium transition-colors cursor-pointer ${
                activeTab === 'rental'
                  ? 'text-[#D68B42] dark:text-[#F9C083] font-semibold'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              <KeyRound className="w-4 h-4 mb-0.5" />
              <span>Rental</span>
            </button>

            <button
              type="button"
              onClick={() => onSelectTab('capital')}
              className={`flex flex-col items-center justify-center py-1 rounded-xl text-[10px] font-medium transition-colors cursor-pointer ${
                activeTab === 'capital'
                  ? 'text-[#1B3352] dark:text-[#F9C083] font-semibold'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              <Building2 className="w-4 h-4 mb-0.5" />
              <span>Capital</span>
            </button>

            <button
              type="button"
              onClick={() => onSelectTab('mortgage')}
              className={`flex flex-col items-center justify-center py-1 rounded-xl text-[10px] font-medium transition-colors cursor-pointer ${
                activeTab === 'mortgage'
                  ? 'text-[#9B51E0] dark:text-[#E4CEFA] font-semibold'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              <Landmark className="w-4 h-4 mb-0.5" />
              <span>Mortgage</span>
            </button>

            <button
              type="button"
              onClick={() => onSelectTab('history')}
              className={`flex flex-col items-center justify-center py-1 rounded-xl text-[10px] font-medium transition-colors cursor-pointer ${
                activeTab === 'history'
                  ? 'text-[#1B3352] dark:text-[#F9C083] font-semibold'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              <History className="w-4 h-4 mb-0.5" />
              <span>History</span>
            </button>

            <button
              type="button"
              onClick={() => onSelectTab('settings')}
              className={`flex flex-col items-center justify-center py-1 rounded-xl text-[10px] font-medium transition-colors cursor-pointer ${
                activeTab === 'settings'
                  ? 'text-[#1B3352] dark:text-[#F9C083] font-semibold'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              <Settings className="w-4 h-4 mb-0.5" />
              <span>Settings</span>
            </button>
          </div>
        </nav>
      )}
    </>
  );
};
