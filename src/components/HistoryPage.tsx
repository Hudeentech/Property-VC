import React, { useState } from 'react';
import { ValuationHistoryItem } from '../types/valuation';
import { formatCurrency, SUPPORTED_CURRENCIES } from '../utils/calculator';
import { Clock, Trash2, ArrowUpRight, AlertCircle, PlusCircle } from 'lucide-react';

interface HistoryPageProps {
  history: ValuationHistoryItem[];
  onLoadItem: (item: ValuationHistoryItem) => void;
  onDeleteItem: (id: string) => void;
  onClearAll: () => void;
  onGoToCalculator: () => void;
}

export const HistoryPage: React.FC<HistoryPageProps> = ({
  history,
  onLoadItem,
  onDeleteItem,
  onClearAll,
  onGoToCalculator,
}) => {
  const [confirmClear, setConfirmClear] = useState(false);

  const getLocaleForCurrency = (code: string) => {
    const found = SUPPORTED_CURRENCIES.find((c) => c.code === code);
    return found ? found.locale : 'en-NG';
  };

  return (
    <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-6 shadow-2xs">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-5 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h2 className="text-base sm:text-lg font-bold tracking-tight text-slate-900 dark:text-white">
            Valuation History
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Review, reload, or clear your saved property valuations.
          </p>
        </div>

        {history.length > 0 && (
          <div className="flex items-center gap-2">
            {!confirmClear ? (
              <button
                type="button"
                onClick={() => setConfirmClear(true)}
                className="inline-flex items-center gap-1.5 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 text-xs font-semibold px-3 py-2 rounded-xl transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear History</span>
              </button>
            ) : (
              <div className="flex items-center gap-2 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900/60 px-3 py-1.5 rounded-xl">
                <span className="text-xs font-medium text-red-700 dark:text-red-300">
                  Clear all {history.length} saved items?
                </span>
                <button
                  type="button"
                  onClick={() => {
                    onClearAll();
                    setConfirmClear(false);
                  }}
                  className="bg-red-600 hover:bg-red-700 text-white text-xs font-semibold px-2.5 py-1 rounded-lg cursor-pointer transition-colors"
                >
                  Yes, Clear All
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmClear(false)}
                  className="text-slate-600 dark:text-slate-300 hover:text-slate-900 text-xs font-medium px-2 py-1 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {history.length === 0 ? (
        <div className="py-12 px-4 text-center">
          <div className="w-11 h-11 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 flex items-center justify-center mx-auto mb-3">
            <Clock className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
            No saved valuations yet
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mt-1 mb-4">
            When you calculate a property's capital or rental value, tap "Save" to keep a record of it here.
          </p>
          <button
            type="button"
            onClick={onGoToCalculator}
            className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-4 py-2 rounded-xl transition-colors cursor-pointer"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Start a Calculation</span>
          </button>
        </div>
      ) : (
        <div className="grid gap-3">
          {history.map((item) => {
            const locale = getLocaleForCurrency(item.currencyCode);
            const formattedDate = new Date(item.savedAt).toLocaleString(locale, {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            });

            return (
              <div
                key={item.id}
                className="border border-slate-200 dark:border-slate-800 rounded-xl p-4 bg-slate-50/50 dark:bg-slate-800/40 hover:border-slate-300 dark:hover:border-slate-700 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <span className="font-semibold text-slate-900 dark:text-white text-sm">
                      {item.label}
                    </span>
                    <span>·</span>
                    <span>{formattedDate}</span>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-xs pt-1">
                    <div>
                      <span className="text-slate-500 dark:text-slate-400">Capital: </span>
                      <strong className="text-slate-900 dark:text-white tabular-nums">
                        {formatCurrency(item.summary.totalCapitalValue, item.currencyCode, locale)}
                      </strong>
                    </div>
                    <div>
                      <span className="text-slate-500 dark:text-slate-400">Annual Rent: </span>
                      <strong className="text-slate-900 dark:text-white tabular-nums">
                        {formatCurrency(item.summary.totalAnnualRentalValue, item.currencyCode, locale)}
                      </strong>
                    </div>
                    {item.summary.grossRentalYieldPercent > 0 && (
                      <div>
                        <span className="text-slate-500 dark:text-slate-400">Yield: </span>
                        <strong className="text-blue-600 dark:text-blue-400 tabular-nums">
                          {item.summary.grossRentalYieldPercent.toFixed(2)}%
                        </strong>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    type="button"
                    onClick={() => onLoadItem(item)}
                    className="inline-flex items-center gap-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-blue-600 dark:hover:border-blue-500 text-slate-700 dark:text-slate-200 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                  >
                    <span>Load</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onDeleteItem(item.id)}
                    className="p-1.5 text-slate-400 hover:text-red-600 dark:hover:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer"
                    aria-label={`Delete ${item.label}`}
                    title="Delete item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};
