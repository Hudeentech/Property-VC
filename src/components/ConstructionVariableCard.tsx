import React from 'react';
import { ConstructionVariable } from '../types/valuation';
import { calculateConstructionItem, formatCurrency } from '../utils/calculator';
import { Trash2 } from 'lucide-react';

interface ConstructionVariableCardProps {
  item: ConstructionVariable;
  index: number;
  currencySymbol: string;
  currencyCode: string;
  locale: string;
  onChange: (updated: ConstructionVariable) => void;
  onRemove: (id: string) => void;
  canRemove: boolean;
}

export const ConstructionVariableCard: React.FC<ConstructionVariableCardProps> = ({
  item,
  index,
  currencySymbol,
  currencyCode,
  locale,
  onChange,
  onRemove,
  canRemove,
}) => {
  const calc = calculateConstructionItem(item);

  const handleFieldChange = (field: keyof ConstructionVariable, value: string | number) => {
    if (field === 'title') {
      onChange({ ...item, title: String(value) });
    } else {
      const numVal = Math.max(0, Number(value) || 0);
      if (field === 'depreciationPercent') {
        onChange({ ...item, [field]: Math.min(100, numVal) });
      } else {
        onChange({ ...item, [field]: numVal });
      }
    }
  };

  return (
    <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-4 bg-white dark:bg-slate-900 transition-colors hover:border-slate-300 dark:hover:border-slate-700">
      {/* Compact Row Header */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
          Component #{index + 1}
        </span>
        {canRemove && (
          <button
            type="button"
            onClick={() => onRemove(item.id)}
            className="text-slate-400 hover:text-red-600 dark:hover:text-red-400 text-xs font-medium cursor-pointer inline-flex items-center gap-1 transition-colors py-0.5 px-1.5 rounded hover:bg-red-50 dark:hover:bg-red-950/40"
            aria-label={`Remove Construction Variable ${index + 1}`}
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Remove</span>
          </button>
        )}
      </div>

      {/* Streamlined 4-field Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
        {/* Title - 4 cols */}
        <div className="sm:col-span-4">
          <label
            htmlFor={`v-title-${item.id}`}
            className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1"
          >
            Description
          </label>
          <input
            id={`v-title-${item.id}`}
            type="text"
            value={item.title}
            onChange={(e) => handleFieldChange('title', e.target.value)}
            placeholder={index === 0 ? 'e.g. Main building' : 'e.g. Warehouse or annex'}
            className="w-full h-10 sm:h-9 border border-slate-200 dark:border-slate-700 rounded-lg px-3 text-sm text-slate-900 dark:text-white bg-white dark:bg-slate-800/70 outline-none transition focus:border-[#1B3352] dark:focus:border-[#F9C083] focus:ring-2 focus:ring-[#1B3352]/15 dark:focus:ring-[#F9C083]/20 placeholder:text-slate-400 dark:placeholder:text-slate-500"
          />
        </div>

        {/* Area - 3 cols */}
        <div className="sm:col-span-3">
          <label
            htmlFor={`v-area-${item.id}`}
            className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1"
          >
            Area (m²)
          </label>
          <input
            id={`v-area-${item.id}`}
            type="number"
            min="0"
            step="any"
            value={item.area === 0 ? '' : item.area}
            onChange={(e) => handleFieldChange('area', e.target.value)}
            placeholder="e.g. 250"
            className="w-full h-10 sm:h-9 border border-slate-200 dark:border-slate-700 rounded-lg px-3 text-sm text-slate-900 dark:text-white bg-white dark:bg-slate-800/70 outline-none transition focus:border-[#1B3352] dark:focus:border-[#F9C083] focus:ring-2 focus:ring-[#1B3352]/15 dark:focus:ring-[#F9C083]/20 placeholder:text-slate-400 dark:placeholder:text-slate-500 tabular-nums"
          />
        </div>

        {/* Construction Cost per m² - 3 cols */}
        <div className="sm:col-span-3">
          <label
            htmlFor={`v-cost-${item.id}`}
            className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1"
          >
            Cost / m²
          </label>
          <div className="relative">
            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 font-medium select-none text-xs">
              {currencySymbol}
            </span>
            <input
              id={`v-cost-${item.id}`}
              type="number"
              min="0"
              step="any"
              value={item.costPerSqM === 0 ? '' : item.costPerSqM}
              onChange={(e) => handleFieldChange('costPerSqM', e.target.value)}
              placeholder="e.g. 250,000"
              className="w-full h-10 sm:h-9 border border-slate-200 dark:border-slate-700 rounded-lg pl-7 pr-2.5 text-sm text-slate-900 dark:text-white bg-white dark:bg-slate-800/70 outline-none transition focus:border-[#1B3352] dark:focus:border-[#F9C083] focus:ring-2 focus:ring-[#1B3352]/15 dark:focus:ring-[#F9C083]/20 placeholder:text-slate-400 dark:placeholder:text-slate-500 tabular-nums"
            />
          </div>
        </div>

        {/* Depreciation Percentage - 2 cols */}
        <div className="sm:col-span-2">
          <label
            htmlFor={`v-dep-${item.id}`}
            className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1"
          >
            Depr. (%)
          </label>
          <div className="relative">
            <input
              id={`v-dep-${item.id}`}
              type="number"
              min="0"
              max="100"
              step="any"
              value={item.depreciationPercent === 0 ? '' : item.depreciationPercent}
              onChange={(e) => handleFieldChange('depreciationPercent', e.target.value)}
              placeholder="e.g. 10"
              className="w-full h-10 sm:h-9 border border-slate-200 dark:border-slate-700 rounded-lg pl-2.5 pr-6 text-sm text-slate-900 dark:text-white bg-white dark:bg-slate-800/70 outline-none transition focus:border-[#1B3352] dark:focus:border-[#F9C083] focus:ring-2 focus:ring-[#1B3352]/15 dark:focus:ring-[#F9C083]/20 placeholder:text-slate-400 dark:placeholder:text-slate-500 tabular-nums"
            />
            <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 font-medium select-none text-xs">
              %
            </span>
          </div>
        </div>
      </div>

      {/* Subtle inline footer calculation */}
      <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
        <span className="text-slate-500 dark:text-slate-400">
          {calc.grossValue > 0 ? (
            <>
              Gross: {formatCurrency(calc.grossValue, currencyCode, locale)}
              {calc.depreciationAmount > 0 && (
                <>
                  {' '}· Less {calc.depreciationPercent}% depr. (−{formatCurrency(calc.depreciationAmount, currencyCode, locale)})
                </>
              )}
            </>
          ) : (
            'Enter area and cost per m²'
          )}
        </span>
        <div className="flex items-center gap-1.5">
          <span className="text-slate-500 dark:text-slate-400 font-medium">Net Value:</span>
          <span className="text-sm font-bold text-slate-900 dark:text-white tabular-nums">
            {formatCurrency(calc.finalValue, currencyCode, locale)}
          </span>
        </div>
      </div>
    </div>
  );
};
