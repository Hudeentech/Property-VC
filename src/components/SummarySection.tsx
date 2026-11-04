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
    <div className="mt-5">
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-6 shadow-2xs">
        <div className="flex flex-wrap items-baseline justify-between gap-2 pb-4 mb-4 border-b border-slate-100 dark:border-slate-800">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            {mode === 'rental' ? 'Rental Valuation Summary' : 'Capital Valuation Summary'}
          </h2>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Updates automatically as you type
          </span>
        </div>

        {mode === 'rental' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-5">
            {/* Annual Rental Value */}
            <div className="p-4 rounded-xl bg-[#F9C083]/15 dark:bg-[#F9C083]/10 border border-[#F9C083]/40">
              <span className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                Total Annual Rental Value
              </span>
              <strong
                id="summaryRental"
                className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white block tabular-nums break-words"
              >
                {formatCurrency(summary.totalAnnualRentalValue, currencyCode, locale)}
              </strong>
              <span className="block text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                Area × expected rent per m²
              </span>
            </div>

            {/* Monthly Equivalent */}
            <div className="p-4 rounded-xl bg-slate-50/80 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <span className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
                Monthly Rent Equivalent
              </span>
              <strong className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white block tabular-nums break-words">
                {formatCurrency(summary.totalMonthlyRentalValue, currencyCode, locale)}
              </strong>
              <span className="block text-[11px] text-slate-400 dark:text-slate-500 mt-1">
                Annual rental value ÷ 12 months
              </span>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-5">
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

            {/* Total Capital Value */}
            <div className="p-3.5 rounded-xl bg-[#1B3352]/10 dark:bg-[#1B3352]/30 border border-[#1B3352]/25 dark:border-[#1B3352]/60">
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
          </div>
        )}
      </section>
    </div>
  );
};
