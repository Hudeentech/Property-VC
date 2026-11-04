import React from 'react';
import { LandData } from '../types/valuation';
import { calculateLandValue, formatCurrency } from '../utils/calculator';

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
      <div className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-3">
        Land Value
      </div>

      <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-4 bg-white dark:bg-slate-900">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          {/* Land Title */}
          <div className="sm:col-span-5">
            <label
              htmlFor="landTitle"
              className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1"
            >
              Land Description
            </label>
            <input
              id="landTitle"
              type="text"
              value={land.title}
              onChange={(e) => handleFieldChange('title', e.target.value)}
              placeholder="e.g. Main property land"
              className="w-full h-10 sm:h-9 border border-slate-200 dark:border-slate-700 rounded-lg px-3 text-sm text-slate-900 dark:text-white bg-white dark:bg-slate-800/70 outline-none transition focus:border-blue-600 dark:focus:border-blue-500 focus:ring-2 focus:ring-blue-600/10 placeholder:text-slate-400 dark:placeholder:text-slate-500"
            />
          </div>

          {/* Land Area */}
          <div className="sm:col-span-3">
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
              placeholder="e.g. 500"
              className="w-full h-10 sm:h-9 border border-slate-200 dark:border-slate-700 rounded-lg px-3 text-sm text-slate-900 dark:text-white bg-white dark:bg-slate-800/70 outline-none transition focus:border-blue-600 dark:focus:border-blue-500 focus:ring-2 focus:ring-blue-600/10 placeholder:text-slate-400 dark:placeholder:text-slate-500 tabular-nums"
            />
          </div>

          {/* Cost of Land per m² */}
          <div className="sm:col-span-4">
            <label
              htmlFor="landCost"
              className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1"
            >
              Cost of Land / m²
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
                placeholder="e.g. 50,000"
                className="w-full h-10 sm:h-9 border border-slate-200 dark:border-slate-700 rounded-lg pl-7 pr-2.5 text-sm text-slate-900 dark:text-white bg-white dark:bg-slate-800/70 outline-none transition focus:border-blue-600 dark:focus:border-blue-500 focus:ring-2 focus:ring-blue-600/10 placeholder:text-slate-400 dark:placeholder:text-slate-500 tabular-nums"
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
