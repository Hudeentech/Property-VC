import React, { useState } from 'react';
import { ThemeMode } from '../types/valuation';
import { SUPPORTED_CURRENCIES } from '../utils/calculator';
import { PRESET_SCENARIOS, ValuationScenario } from '../utils/presets';
import { Sun, Moon, Trash2, Check, RotateCcw, Sparkles } from 'lucide-react';
import { PWAInstallButton } from './PWAInstallButton';

interface SettingsPageProps {
  theme: ThemeMode;
  onThemeChange: (theme: ThemeMode) => void;
  currencyCode: string;
  onCurrencyChange: (code: string) => void;
  onSelectScenario: (scenario: ValuationScenario) => void;
  historyCount: number;
  onClearHistory: () => void;
  onResetInputs: () => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({
  theme,
  onThemeChange,
  currencyCode,
  onCurrencyChange,
  onSelectScenario,
  historyCount,
  onClearHistory,
  onResetInputs,
}) => {
  const [clearedToast, setClearedToast] = useState(false);
  const [loadedToast, setLoadedToast] = useState<string | null>(null);

  const handleClear = () => {
    onClearHistory();
    setClearedToast(true);
    setTimeout(() => setClearedToast(false), 2500);
  };

  return (
    <div className="space-y-4">
      {/* Install App (PWA) Section */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-6 shadow-2xs">
        <PWAInstallButton variant="settings" />
      </section>

      {/* Appearance / Theme */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-6 shadow-2xs">
        <div className="mb-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Appearance
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Switch between Light Mode and Dark Mode for comfortable viewing.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 max-w-md">
          <button
            type="button"
            onClick={() => onThemeChange('light')}
            className={`flex items-center justify-between p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
              theme === 'light'
                ? 'border-[#1B3352] bg-[#1B3352] text-white font-semibold shadow-2xs'
                : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 text-slate-700 dark:text-slate-300'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Sun className={`w-4 h-4 ${theme === 'light' ? 'text-[#F9C083]' : ''}`} />
              <span className="text-sm">Light Mode</span>
            </div>
            {theme === 'light' && <Check className="w-4 h-4 text-[#F9C083]" />}
          </button>

          <button
            type="button"
            onClick={() => onThemeChange('dark')}
            className={`flex items-center justify-between p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
              theme === 'dark'
                ? 'border-[#F9C083] bg-[#222325] text-white font-semibold shadow-2xs'
                : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Moon className={`w-4 h-4 ${theme === 'dark' ? 'text-[#F9C083]' : ''}`} />
              <span className="text-sm">Dark Mode</span>
            </div>
            {theme === 'dark' && <Check className="w-4 h-4 text-[#F9C083]" />}
          </button>
        </div>
      </section>

      {/* Currency Preference */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-6 shadow-2xs">
        <div className="mb-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Valuation Currency
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Choose the currency symbol and formatting used across all calculations.
          </p>
        </div>

        <div className="max-w-xs">
          <label htmlFor="settings-currency" className="sr-only">
            Select Currency
          </label>
          <select
            id="settings-currency"
            value={currencyCode}
            onChange={(e) => onCurrencyChange(e.target.value)}
            className="w-full h-10 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 text-sm font-medium text-slate-900 dark:text-white outline-none focus:border-[#1B3352] dark:focus:border-[#F9C083] transition-colors cursor-pointer"
          >
            {SUPPORTED_CURRENCIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </section>

      {/* Sample Templates */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-6 shadow-2xs">
        <div className="mb-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Sample Templates
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            By default, all fields stay empty with placeholders to prevent input mistakes. You can optionally load an example property below.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {PRESET_SCENARIOS.filter((s) => s.id !== 'blank-property').map((scenario) => (
            <button
              key={scenario.id}
              type="button"
              onClick={() => {
                onSelectScenario(scenario);
                setLoadedToast(scenario.name);
                setTimeout(() => setLoadedToast(null), 2500);
              }}
              className="inline-flex items-center gap-1.5 bg-[#1B3352]/10 dark:bg-slate-800 hover:bg-[#1B3352]/20 dark:hover:bg-slate-700 text-[#1B3352] dark:text-slate-200 text-xs font-semibold px-3.5 py-2 rounded-xl transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#D68B42] dark:text-[#F9C083]" />
              <span>Load {scenario.name}</span>
            </button>
          ))}
        </div>

        {loadedToast && (
          <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium mt-2.5">
            Loaded "{loadedToast}" into the calculator.
          </p>
        )}
      </section>

      {/* Data & Reset */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-6 shadow-2xs">
        <div className="mb-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Data &amp; Storage
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Clear your current form inputs or wipe saved valuation history from this device.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={onResetInputs}
            className="inline-flex items-center gap-1.5 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-medium px-3.5 py-2 rounded-xl transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Clear Current Form Inputs</span>
          </button>

          <button
            type="button"
            disabled={historyCount === 0}
            onClick={handleClear}
            className={`inline-flex items-center gap-1.5 text-xs font-medium px-3.5 py-2 rounded-xl transition-colors ${
              historyCount > 0
                ? 'bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-950/70 cursor-pointer'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed'
            }`}
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Saved History ({historyCount})</span>
          </button>
        </div>

        {clearedToast && (
          <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium mt-2.5">
            Valuation history has been cleared.
          </p>
        )}
      </section>
    </div>
  );
};
