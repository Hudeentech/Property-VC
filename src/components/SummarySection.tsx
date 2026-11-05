import React from 'react';
import { ValuationSummary } from '../types/valuation';
import { formatCurrency } from '../utils/calculator';

interface SummarySectionProps {
  mode: 'rental' | 'capital';
  summary: ValuationSummary;
  currencyCode: string;
  locale: string;
}

export const SummarySection: React.FC<SummarySectionProps> = ({
  mode,
  summary,
  currencyCode,
  locale,
}) => {
  return (
    <div>
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-6 shadow-2xs">
        <div className="flex flex-wrap items-baseline justify-between gap-2 pb-4 mb-4 border-b border-slate-100 dark:border-slate-800">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            {mode === 'rental' ? 'Rental Valuation Summary' : 'Capital Valuation Summary'}
          </h2>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Updates automatically
          </span>
        </div>

        {mode === 'rental' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-3">
            {/* Net Rental Value (Primary Highlight) */}
            <div className="p-4 rounded-xl bg-[#F9C083]/20 dark:bg-[#F9C083]/10 border border-[#F9C083]/50">
              <span className="block text-xs font-medium text-slate-700 dark:text-[#F9C083] mb-1">
                Net Rental Value
              </span>
              <strong
                id="summaryRental"
                className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white block tabular-nums break-words"
              >
                {formatCurrency(summary.rentalNetTotal, currencyCode, locale)}
              </strong>
              <span className="block text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                Gross rental value less outgoings
              </span>
            </div>

            {/* Gross Rental Value */}
            <div className="p-3.5 rounded-xl bg-slate-50/80 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <span className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
                Gross Rental Value
              </span>
              <strong className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-white block tabular-nums break-words">
                {formatCurrency(summary.rentalGrossTotal, currencyCode, locale)}
              </strong>
              <span className="block text-[11px] text-slate-400 dark:text-slate-500 mt-1">
                Area × rental rate per m²
              </span>
            </div>

            {/* Less: Outgoings */}
            <div className="p-3.5 rounded-xl bg-slate-50/80 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <span className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
                Less: Outgoings
              </span>
              <strong className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-white block tabular-nums break-words">
                {formatCurrency(summary.rentalOutgoingsTotal, currencyCode, locale)}
              </strong>
              <span className="block text-[11px] text-slate-400 dark:text-slate-500 mt-1">
                Total outgoings deduction
              </span>
            </div>

            {/* Total Land Value */}
            <div className="p-3.5 rounded-xl bg-slate-50/80 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <span className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
                Total Land Value
              </span>
              <strong className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-white block tabular-nums break-words">
                {formatCurrency(summary.landValueTotal, currencyCode, locale)}
              </strong>
              <span className="block text-[11px] text-slate-400 dark:text-slate-500 mt-1">
                Area × land cost per m²
              </span>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-1 gap-3">
            {/* Total Capital Value (Primary Highlight) */}
            <div className="p-4 rounded-xl bg-[#1B3352]/10 dark:bg-[#1B3352]/30 border border-[#1B3352]/25 dark:border-[#1B3352]/60">
              <span className="block text-xs font-medium text-[#1B3352] dark:text-[#F9C083] mb-1">
                Total Capital Value
              </span>
              <strong
                id="summaryCapital"
                className="text-xl sm:text-2xl font-bold tracking-tight text-[#1B3352] dark:text-white block tabular-nums break-words"
              >
                {formatCurrency(summary.totalCapitalValue, currencyCode, locale)}
              </strong>
              <span className="block text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                Net construction + land
              </span>
            </div>

            {/* Net Construction */}
            <div className="p-3.5 rounded-xl bg-slate-50/80 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <span className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
                Net Construction Value
              </span>
              <strong className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-white block tabular-nums break-words">
                {formatCurrency(summary.constructionNetTotal, currencyCode, locale)}
              </strong>
              <span className="block text-[11px] text-slate-400 dark:text-slate-500 mt-1">
                After depreciation deduction
              </span>
            </div>

            {/* Land Value */}
            <div className="p-3.5 rounded-xl bg-slate-50/80 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <span className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
                Site Land Value
              </span>
              <strong className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-white block tabular-nums break-words">
                {formatCurrency(summary.landValueTotal, currencyCode, locale)}
              </strong>
              <span className="block text-[11px] text-slate-400 dark:text-slate-500 mt-1">
                Site area × land cost/m²
              </span>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};
