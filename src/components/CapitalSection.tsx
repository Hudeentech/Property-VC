import React from 'react';
import { ConstructionVariable, LandData } from '../types/valuation';
import { ConstructionVariableCard } from './ConstructionVariableCard';
import { LandBlock } from './LandBlock';
import { calculateValuationSummary, formatCurrency } from '../utils/calculator';
import { Plus, ArrowRight } from 'lucide-react';

interface CapitalSectionProps {
  constructionVariables: ConstructionVariable[];
  land: LandData;
  currencySymbol: string;
  currencyCode: string;
  locale: string;
  onUpdateConstruction: (updated: ConstructionVariable[]) => void;
  onUpdateLand: (updated: LandData) => void;
  onAddVariable: () => void;
  onSwitchToRental?: () => void;
}

export const CapitalSection: React.FC<CapitalSectionProps> = ({
  constructionVariables,
  land,
  currencySymbol,
  currencyCode,
  locale,
  onUpdateConstruction,
  onUpdateLand,
  onAddVariable,
  onSwitchToRental,
}) => {
  const summary = calculateValuationSummary(constructionVariables, land, []);

  const handleVariableChange = (index: number, updatedItem: ConstructionVariable) => {
    const list = [...constructionVariables];
    list[index] = updatedItem;
    onUpdateConstruction(list);
  };

  const handleRemoveVariable = (id: string) => {
    if (constructionVariables.length <= 1) return;
    onUpdateConstruction(constructionVariables.filter((v) => v.id !== id));
  };

  return (
    <div className="space-y-5">
      {/* Brand Deep Navy Banner Header for Capital Value */}
      <div className="relative overflow-hidden rounded-2xl bg-[#1B3352] text-white p-5 sm:p-6 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-16 -right-10 w-44 h-44 rounded-full border-[18px] border-white/[0.07]"
        />
        <div className="relative z-10">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            Capital Value Calculator
          </h2>
          <p className="text-xs sm:text-sm text-white/80 mt-0.5">
            Construction components after depreciation plus site land value.
          </p>
        </div>

        <div className="relative z-10 text-left sm:text-right bg-white/10 backdrop-blur-xs px-4 py-2.5 rounded-xl border border-white/10">
          <span className="text-xs font-medium text-[#F9C083] block">
            Total Capital Value
          </span>
          <strong
            id="capitalValue"
            className="text-xl sm:text-2xl font-bold tracking-tight text-white tabular-nums"
          >
            {formatCurrency(summary.totalCapitalValue, currencyCode, locale)}
          </strong>
        </div>
      </div>

      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-6 shadow-2xs">
        <div className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-3">
          Construction Components
        </div>

        {/* Construction Variables List */}
        <div id="variables" className="grid gap-3">
          {constructionVariables.map((item, idx) => (
            <ConstructionVariableCard
              key={item.id}
              item={item}
              index={idx}
              currencySymbol={currencySymbol}
              currencyCode={currencyCode}
              locale={locale}
              onChange={(updated) => handleVariableChange(idx, updated)}
              onRemove={handleRemoveVariable}
              canRemove={constructionVariables.length > 1}
            />
          ))}
        </div>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-3 no-print">
          <button
            id="addVariable"
            type="button"
            onClick={onAddVariable}
            className="inline-flex items-center gap-1.5 bg-[#1B3352]/10 dark:bg-[#F9C083]/15 hover:bg-[#1B3352]/20 text-[#1B3352] dark:text-[#F9C083] text-xs font-semibold px-3.5 py-2 rounded-xl transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Construction Component</span>
          </button>

          {summary.constructionNetTotal > 0 && (
            <span className="text-xs text-slate-500 dark:text-slate-400 tabular-nums">
              Buildings Subtotal:{' '}
              <strong className="text-slate-800 dark:text-slate-200">
                {formatCurrency(summary.constructionNetTotal, currencyCode, locale)}
              </strong>
            </span>
          )}
        </div>

        {/* Land Value */}
        <LandBlock
          land={land}
          currencySymbol={currencySymbol}
          currencyCode={currencyCode}
          locale={locale}
          onChange={onUpdateLand}
        />

        {onSwitchToRental && (
          <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end no-print">
            <button
              type="button"
              onClick={onSwitchToRental}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#9A5B13] dark:text-[#F9C083] hover:underline cursor-pointer"
            >
              <span>Need Rental Value instead?</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </section>
    </div>
  );
};
