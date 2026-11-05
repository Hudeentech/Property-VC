import React, { useState, useEffect } from 'react';
import {
  ActiveTab,
  ConstructionVariable,
  LandData,
  MortgageData,
  RentalUnit,
  ThemeMode,
  ValuationHistoryItem,
} from './types/valuation';
import { calculateValuationSummary, SUPPORTED_CURRENCIES } from './utils/calculator';
import { EMPTY_DEFAULT_SCENARIO, ValuationScenario } from './utils/presets';
import { HomePage } from './components/HomePage';
import { Header } from './components/Header';
import { CapitalSection } from './components/CapitalSection';
import { RentalSection } from './components/RentalSection';
import { MortgageSection } from './components/MortgageSection';
import { SummarySection } from './components/SummarySection';
import { HistoryPage } from './components/HistoryPage';
import { SettingsPage } from './components/SettingsPage';
import { ReportModal } from './components/ReportModal';

const STORAGE_KEY = 'prop_valuation_data_v2';
const HISTORY_KEY = 'prop_valuation_history_v1';
const THEME_KEY = 'prop_valuation_theme_v1';

export default function App() {
  const defaultScenario = EMPTY_DEFAULT_SCENARIO;

  // Start on the Home Page UI design, with Rental Value Calculator as the default calculator
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');

  const [theme, setTheme] = useState<ThemeMode>(() => {
    try {
      const saved = localStorage.getItem(THEME_KEY);
      if (saved === 'dark' || saved === 'light') return saved;
    } catch {
      // ignore
    }
    return 'light';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch {
      // ignore
    }
  }, [theme]);

  const [currencyCode, setCurrencyCode] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.currencyCode || defaultScenario.currency;
      }
    } catch {
      // fallback
    }
    return defaultScenario.currency;
  });

  const [constructionVariables, setConstructionVariables] = useState<ConstructionVariable[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed.constructionVariables) && parsed.constructionVariables.length > 0) {
          return parsed.constructionVariables;
        }
      }
    } catch {
      // fallback
    }
    return defaultScenario.constructionVariables;
  });

  const [land, setLand] = useState<LandData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.land) return parsed.land;
      }
    } catch {
      // fallback
    }
    return defaultScenario.land;
  });

  const [rentalUnits, setRentalUnits] = useState<RentalUnit[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed.rentalUnits) && parsed.rentalUnits.length > 0) {
          return parsed.rentalUnits;
        }
      }
    } catch {
      // fallback
    }
    return defaultScenario.rentalUnits;
  });

  const [mortgage, setMortgage] = useState<MortgageData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.mortgage) return parsed.mortgage;
      }
    } catch {
      // fallback
    }
    return {
      propertyTitle: '',
      propertyPrice: 0,
      downPaymentPercent: 0,
      interestRatePercent: 0,
      loanTermYears: 0,
    };
  });

  const [history, setHistory] = useState<ValuationHistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem(HISTORY_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // fallback
    }
    return [];
  });

  const [isReportOpen, setIsReportOpen] = useState(false);
  const [reportTemplate, setReportTemplate] = useState<'rental' | 'capital' | 'combined'>('rental');
  const [reportTitle, setReportTitle] = useState<string | undefined>(undefined);
  const [saveFeedback, setSaveFeedback] = useState<string | null>(null);

  // Sync current inputs to local storage
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          currencyCode,
          constructionVariables,
          land,
          rentalUnits,
          mortgage,
        })
      );
    } catch {
      // ignore
    }
  }, [currencyCode, constructionVariables, land, rentalUnits, mortgage]);

  // Sync history to local storage
  useEffect(() => {
    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    } catch {
      // ignore
    }
  }, [history]);

  const currentCurrency =
    SUPPORTED_CURRENCIES.find((c) => c.code === currencyCode) || SUPPORTED_CURRENCIES[0];

  const summary = calculateValuationSummary(constructionVariables, land, rentalUnits);

  const handleAddVariable = () => {
    const newVar: ConstructionVariable = {
      id: `var-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      title: '',
      area: 0,
      costPerSqM: 0,
      depreciationPercent: 0,
    };
    setConstructionVariables((prev) => [...prev, newVar]);
  };

  const handleAddRentalUnit = () => {
    const newUnit: RentalUnit = {
      id: `rent-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      title: '',
      area: 0,
      rentRatePerSqM: 0,
      period: 'annual',
    };
    setRentalUnits((prev) => [...prev, newUnit]);
  };

  const handleSelectScenario = (scenario: ValuationScenario) => {
    setCurrencyCode(scenario.currency);
    setConstructionVariables(
      scenario.constructionVariables.map((v) => ({ ...v, id: `${v.id}-${Date.now()}` }))
    );
    setLand({ ...scenario.land });
    setRentalUnits(scenario.rentalUnits.map((u) => ({ ...u, id: `${u.id}-${Date.now()}` })));
  };

  const handleReset = () => {
    if (activeTab === 'mortgage') {
      setMortgage({
        propertyTitle: '',
        propertyPrice: 0,
        downPaymentPercent: 0,
        interestRatePercent: 0,
        loanTermYears: 0,
      });
    } else {
      handleSelectScenario(defaultScenario);
    }
  };

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const handleSaveToHistory = () => {
    const isRental = activeTab === 'rental';
    const isMortgage = activeTab === 'mortgage';
    const firstTitle = isMortgage
      ? mortgage.propertyTitle.trim() || `Mortgage Valuation #${history.length + 1}`
      : isRental
      ? rentalUnits.find((r) => r.title.trim() !== '')?.title ||
        `Rental Valuation #${history.length + 1}`
      : constructionVariables.find((v) => v.title.trim() !== '')?.title ||
        land.title.trim() ||
        `Capital Valuation #${history.length + 1}`;

    const newItem: ValuationHistoryItem = {
      id: `hist-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      savedAt: new Date().toISOString(),
      type: isMortgage ? 'mortgage' : isRental ? 'rental' : 'capital',
      label: firstTitle,
      currencyCode,
      constructionVariables: constructionVariables.map((v) => ({ ...v })),
      land: { ...land },
      rentalUnits: rentalUnits.map((r) => ({ ...r })),
      summary: { ...summary },
    };

    setHistory((prev) => [newItem, ...prev]);
    setSaveFeedback('Saved to History');
    setTimeout(() => setSaveFeedback(null), 2200);
  };

  const handleLoadHistoryItem = (item: ValuationHistoryItem) => {
    setCurrencyCode(item.currencyCode);
    setConstructionVariables(item.constructionVariables.map((v) => ({ ...v })));
    setLand({ ...item.land });
    setRentalUnits(item.rentalUnits.map((r) => ({ ...r })));
    setActiveTab(
      item.type === 'capital' ? 'capital' : item.type === 'mortgage' ? 'mortgage' : 'rental'
    );
  };

  const handleViewHistoryReport = (item: ValuationHistoryItem) => {
    setCurrencyCode(item.currencyCode);
    setConstructionVariables(item.constructionVariables.map((v) => ({ ...v })));
    setLand({ ...item.land });
    setRentalUnits(item.rentalUnits.map((r) => ({ ...r })));
    setReportTemplate(item.type === 'capital' ? 'capital' : 'rental');
    setReportTitle(item.label);
    setIsReportOpen(true);
  };

  const handleOpenCurrentReport = () => {
    setReportTemplate(activeTab === 'capital' ? 'capital' : 'rental');
    setReportTitle(undefined);
    setIsReportOpen(true);
  };

  const handleDeleteHistoryItem = (id: string) => {
    setHistory((prev) => prev.filter((item) => item.id !== id));
  };

  const handleClearHistory = () => {
    setHistory([]);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#12151C] text-slate-900 dark:text-slate-100 transition-colors">
      {/* Home Page View (Full-bleed architectural design) */}
      {activeTab === 'home' ? (
        <>
          <HomePage
            onNavigate={setActiveTab}
            onToggleTheme={handleToggleTheme}
            theme={theme}
            historyCount={history.length}
          />
          <Header
            activeTab={activeTab}
            historyCount={history.length}
            onSelectTab={setActiveTab}
            onSaveToHistory={handleSaveToHistory}
            onReset={handleReset}
            onOpenReport={handleOpenCurrentReport}
          />
        </>
      ) : (
        <main className="max-w-3xl mx-auto px-3.5 sm:px-6 pt-5 sm:pt-9 pb-24 sm:pb-12">
          {/* Top App Bar & Navigation */}
          <Header
            activeTab={activeTab}
            historyCount={history.length}
            onSelectTab={setActiveTab}
            onSaveToHistory={handleSaveToHistory}
            onReset={handleReset}
            onOpenReport={handleOpenCurrentReport}
          />

          {/* Subtle Save Confirmation Banner */}
          {saveFeedback && (
            <div
              role="status"
              className="mb-4 px-3.5 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/80 text-emerald-700 dark:text-emerald-300 text-xs font-medium flex items-center justify-between"
            >
              <span>{saveFeedback}</span>
              <button
                type="button"
                onClick={() => setActiveTab('history')}
                className="underline font-semibold cursor-pointer"
              >
                View History
              </button>
            </div>
          )}

          {/* Dedicated Rental Value Calculator Page (Default Calculator) */}
          {activeTab === 'rental' && (
            <>
              <RentalSection
                rentalUnits={rentalUnits}
                currencySymbol={currentCurrency.symbol}
                currencyCode={currencyCode}
                locale={currentCurrency.locale}
                onUpdateRentalUnits={setRentalUnits}
                onAddRentalUnit={handleAddRentalUnit}
                onSwitchToCapital={() => setActiveTab('capital')}
              />
              <SummarySection
                mode="rental"
                summary={summary}
                currencyCode={currencyCode}
                locale={currentCurrency.locale}
              />
            </>
          )}

          {/* Dedicated Capital Value Calculator Page */}
          {activeTab === 'capital' && (
            <>
              <CapitalSection
                constructionVariables={constructionVariables}
                land={land}
                currencySymbol={currentCurrency.symbol}
                currencyCode={currencyCode}
                locale={currentCurrency.locale}
                onUpdateConstruction={setConstructionVariables}
                onUpdateLand={setLand}
                onAddVariable={handleAddVariable}
                onSwitchToRental={() => setActiveTab('rental')}
              />
              <SummarySection
                mode="capital"
                summary={summary}
                currencyCode={currencyCode}
                locale={currentCurrency.locale}
              />
            </>
          )}

          {/* Dedicated Mortgage Value Calculator Page */}
          {activeTab === 'mortgage' && (
            <MortgageSection
              mortgage={mortgage}
              currencySymbol={currentCurrency.symbol}
              currencyCode={currencyCode}
              locale={currentCurrency.locale}
              onUpdateMortgage={setMortgage}
              onSwitchToRental={() => setActiveTab('rental')}
            />
          )}

          {/* History Page */}
          {activeTab === 'history' && (
            <HistoryPage
              history={history}
              onLoadItem={handleLoadHistoryItem}
              onViewReport={handleViewHistoryReport}
              onDeleteItem={handleDeleteHistoryItem}
              onClearAll={handleClearHistory}
              onGoToCalculator={() => setActiveTab('rental')}
            />
          )}

          {/* Settings Page */}
          {activeTab === 'settings' && (
            <SettingsPage
              theme={theme}
              onThemeChange={setTheme}
              currencyCode={currencyCode}
              onCurrencyChange={setCurrencyCode}
              onSelectScenario={(scenario) => {
                handleSelectScenario(scenario);
                setActiveTab('rental');
              }}
              historyCount={history.length}
              onClearHistory={handleClearHistory}
              onResetInputs={() => {
                handleReset();
                setActiveTab('rental');
              }}
            />
          )}

          {/* Printable Appraisal Report Modal */}
          <ReportModal
            isOpen={isReportOpen}
            onClose={() => setIsReportOpen(false)}
            defaultTemplate={reportTemplate}
            reportTitle={reportTitle}
            constructionVariables={constructionVariables}
            land={land}
            rentalUnits={rentalUnits}
            summary={summary}
            currencyCode={currencyCode}
            locale={currentCurrency.locale}
          />
        </main>
      )}
    </div>
  );
}
