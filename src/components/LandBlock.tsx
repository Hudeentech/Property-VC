import React from 'react';
import { LandData } from '../types/valuation';
import { calculateLandValue, formatCurrency } from '../utils/calculator';
import { PencilLine } from 'lucide-react';

interface LandBlockProps {
  land: LandData;
  currencySymbol: string;
  currencyCode: string;
  locale: string;
  onChange: (updated: LandData) => void;
}

export const LandBlock: React.FC<LandBlockProps> = ({
  land,
  currencySymbol,
  currencyCode,
  locale,
  onChange,
}) => {
  const calc = calculateLandValue(land);

  const handleFieldChange = (field: keyof LandData, value: string | number) => {
    if (field === 'title') {
      onChange({ ...land, title: String(value) });
    } else {
      const numVal = Math.max(0, Number(value) || 0);
      onChange({ ...land, [field]: numVal });
    }
  };

  return (
    <div className="border-t border-slate-200 dark:border-slate-800 mt-5 pt-5">
      <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-4 sm:p-5 bg-white dark:bg-slate-900">
        <div className="flex items-center gap-2 mb-4 pb-2.5 border-b border-slate-100 dark:border-slate-800">
          <div className="relative flex-1 flex items-center">
            <PencilLine
              aria-hidden="true"
              className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 absolute left-2.5 pointer-events-none"
            />
            <label htmlFor="landTitle" className="sr-only">
              Land Value Title
            </label>
            <input
              id="landTitle"
              type="text"
              value={land.title}
              onChange={(e) => handleFieldChange('title', e.target.value)}
              aria-label="Land Value"
              className="w-full h-9 border border-slate-200/80 dark:border-slate-700/80 hover:border-slate-300 dark:hover:border-slate-600 focus:border-[#1B3352] dark:focus:border-[#F9C083] rounded-lg pl-8 pr-3 text-sm font-semibold text-slate-900 dark:text-white bg-slate-50/80 dark:bg-slate-800/60 focus:bg-white dark:focus:bg-slate-800 outline-none transition focus:ring-2 focus:ring-[#1B3352]/15 dark:focus:ring-[#F9C083]/20"
            />
            {!land.title && (
              <span className="pointer-events-none absolute left-8 text-sm font-semibold text-slate-700 dark:text-slate-300">
                Land Value
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Land Area */}
          <div>
            <label
              htmlFor="landArea"
              className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1"
            >
              Area (m²)
            </label>
            <input
              id="landArea"
              type="number"
              min="0"
              step="any"
              value={land.area === 0 ? '' : land.area}
              onChange={(e) => handleFieldChange('area', e.target.value)}
              className="w-full h-10 sm:h-9 border border-slate-200 dark:border-slate-700 rounded-lg px-3 text-sm text-slate-900 dark:text-white bg-white dark:bg-slate-800/70 outline-none transition focus:border-[#1B3352] dark:focus:border-[#F9C083] focus:ring-2 focus:ring-[#1B3352]/15 dark:focus:ring-[#F9C083]/20 tabular-nums"
            />
          </div>

          {/* Cost of Land per m² */}
          <div>
            <label
              htmlFor="landCost"
              className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1"
            >
              Land cost per m²
            </label>
            <div className="relative">
              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 font-medium select-none text-xs">
                {currencySymbol}
              </span>
              <input
                id="landCost"
                type="number"
                min="0"
                step="any"
                value={land.costPerSqM === 0 ? '' : land.costPerSqM}
                onChange={(e) => handleFieldChange('costPerSqM', e.target.value)}
                className="w-full h-10 sm:h-9 border border-slate-200 dark:border-slate-700 rounded-lg pl-7 pr-2.5 text-sm text-slate-900 dark:text-white bg-white dark:bg-slate-800/70 outline-none transition focus:border-[#1B3352] dark:focus:border-[#F9C083] focus:ring-2 focus:ring-[#1B3352]/15 dark:focus:ring-[#F9C083]/20 tabular-nums"
              />
            </div>
          </div>
        </div>

        {/* Quiet Inline Result */}
        <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
          <span id="landDetail" className="text-slate-500 dark:text-slate-400">
            {calc.area > 0 && calc.costPerSqM > 0
              ? `${calc.area.toLocaleString()} m² × ${formatCurrency(calc.costPerSqM, currencyCode, locale)}/m²`
              : 'Site area × cost per m²'}
          </span>
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 dark:text-slate-400 font-medium">Land Value:</span>
            <span id="landValue" className="text-sm font-bold text-slate-900 dark:text-white tabular-nums">
              {formatCurrency(calc.value, currencyCode, locale)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
