import React from 'react';
import { RentalUnit } from '../types/valuation';
import { calculateRentalItem, calculateValuationSummary, formatCurrency } from '../utils/calculator';
import { Plus, Trash2, ArrowRight } from 'lucide-react';

interface RentalSectionProps {
  rentalUnits: RentalUnit[];
  currencySymbol: string;
  currencyCode: string;
  locale: string;
  onUpdateRentalUnits: (units: RentalUnit[]) => void;
  onAddRentalUnit: () => void;
  onSwitchToCapital?: () => void;
}

export const RentalSection: React.FC<RentalSectionProps> = ({
  rentalUnits,
  currencySymbol,
  currencyCode,
  locale,
  onUpdateRentalUnits,
  onAddRentalUnit,
  onSwitchToCapital,
}) => {
  const summary = calculateValuationSummary([], { title: '', area: 0, costPerSqM: 0 }, rentalUnits);

  const handleUnitChange = (index: number, field: keyof RentalUnit, value: string | number) => {
    const list = [...rentalUnits];
    const target = { ...list[index] };
    if (field === 'title') {
      target.title = String(value);
    } else if (field === 'period') {
      target.period = value as 'annual' | 'monthly';
    } else {
      target[field] = Math.max(0, Number(value) || 0) as never;
    }
    list[index] = target;
    onUpdateRentalUnits(list);
  };

  const handleRemoveUnit = (id: string) => {
    if (rentalUnits.length <= 1) return;
    onUpdateRentalUnits(rentalUnits.filter((u) => u.id !== id));
  };

  return (
    <div className="space-y-5">
      {/* Brand Peach Banner Header for Rental Value */}
      <div className="relative overflow-hidden rounded-2xl bg-[#F9C083] text-[#1E1E1E] p-5 sm:p-6 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-12 -left-12 w-36 h-36 rounded-full border-[14px] border-[#D68B42]/60"
        />
        <div className="relative z-10">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#1E1E1E]">
            Rental Value Calculator
          </h2>
          <p className="text-xs sm:text-sm text-[#2C2620]/85 mt-0.5">
            Estimate rental income based on lettable area and expected rent rate per m².
          </p>
        </div>

        <div className="relative z-10 text-left sm:text-right bg-white/45 backdrop-blur-xs px-4 py-2.5 rounded-xl">
          <span className="text-xs font-semibold text-[#2C2620] block">Total Annual Rent</span>
          <strong
            id="rentalValue"
            className="text-xl sm:text-2xl font-bold tracking-tight text-[#1E1E1E] tabular-nums"
          >
            {formatCurrency(summary.totalAnnualRentalValue, currencyCode, locale)}
          </strong>
        </div>
      </div>

      {/* Rental Units Input Section */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-6 shadow-2xs">
        <div className="grid gap-3">
          {rentalUnits.map((unit, index) => {
            const calc = calculateRentalItem(unit);
            const isFirst = index === 0;

            return (
              <div
                key={unit.id}
                className="border border-slate-200 dark:border-slate-800 rounded-xl p-4 bg-white dark:bg-slate-900 transition-colors hover:border-slate-300 dark:hover:border-slate-700"
              >
                {rentalUnits.length > 1 && (
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                      Lettable Space #{index + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveUnit(unit.id)}
                      className="text-slate-400 hover:text-red-600 dark:hover:text-red-400 text-xs font-medium cursor-pointer inline-flex items-center gap-1 transition-colors py-0.5 px-1.5 rounded hover:bg-red-50 dark:hover:bg-red-950/40"
                      aria-label={`Remove Lettable Space ${index + 1}`}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove</span>
                    </button>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                  {/* Title */}
                  <div className="sm:col-span-5">
                    <label
                      htmlFor={isFirst ? 'rentalTitle' : `rentalTitle-${unit.id}`}
                      className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1"
                    >
                      Space Description
                    </label>
                    <input
                      id={isFirst ? 'rentalTitle' : `rentalTitle-${unit.id}`}
                      type="text"
                      value={unit.title}
                      onChange={(e) => handleUnitChange(index, 'title', e.target.value)}
                      placeholder="e.g. Lettable Commercial Space"
                      className="w-full h-10 sm:h-9 border border-slate-200 dark:border-slate-700 rounded-lg px-3 text-sm text-slate-900 dark:text-white bg-white dark:bg-slate-800/70 outline-none transition focus:border-[#D68B42] focus:ring-2 focus:ring-[#F9C083]/40 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                    />
                  </div>

                  {/* Area */}
                  <div className="sm:col-span-3">
                    <label
                      htmlFor={isFirst ? 'rentalArea' : `rentalArea-${unit.id}`}
                      className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1"
                    >
                      Area (m²)
                    </label>
                    <input
                      id={isFirst ? 'rentalArea' : `rentalArea-${unit.id}`}
                      type="number"
                      min="0"
                      step="any"
                      value={unit.area === 0 ? '' : unit.area}
                      onChange={(e) => handleUnitChange(index, 'area', e.target.value)}
                      placeholder="e.g. 250"
                      className="w-full h-10 sm:h-9 border border-slate-200 dark:border-slate-700 rounded-lg px-3 text-sm text-slate-900 dark:text-white bg-white dark:bg-slate-800/70 outline-none transition focus:border-[#D68B42] focus:ring-2 focus:ring-[#F9C083]/40 placeholder:text-slate-400 dark:placeholder:text-slate-500 tabular-nums"
                    />
                  </div>

                  {/* Expected Rent per m² */}
                  <div className="sm:col-span-4">
                    <div className="flex justify-between items-center mb-1 h-4">
                      <label
                        htmlFor={isFirst ? 'rentRate' : `rentRate-${unit.id}`}
                        className="block text-xs font-medium text-slate-600 dark:text-slate-300"
                      >
                        Rent / m²
                      </label>
                      <div className="flex items-center text-[10px] font-medium bg-slate-100 dark:bg-slate-800 rounded px-0.5">
                        <button
                          type="button"
                          onClick={() => handleUnitChange(index, 'period', 'annual')}
                          className={`px-1.5 leading-4 rounded cursor-pointer transition-colors ${
                            unit.period !== 'monthly'
                              ? 'bg-[#1B3352] text-white shadow-2xs'
                              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
                          }`}
                          aria-label="Set annual rent frequency"
                        >
                          /yr
                        </button>
                        <button
                          type="button"
                          onClick={() => handleUnitChange(index, 'period', 'monthly')}
                          className={`px-1.5 leading-4 rounded cursor-pointer transition-colors ${
                            unit.period === 'monthly'
                              ? 'bg-[#1B3352] text-white shadow-2xs'
                              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
                          }`}
                          aria-label="Set monthly rent frequency"
                        >
                          /mo
                        </button>
                      </div>
                    </div>

                    <div className="relative">
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 font-medium select-none text-xs">
                        {currencySymbol}
                      </span>
                      <input
                        id={isFirst ? 'rentRate' : `rentRate-${unit.id}`}
                        type="number"
                        min="0"
                        step="any"
                        value={unit.rentRatePerSqM === 0 ? '' : unit.rentRatePerSqM}
                        onChange={(e) => handleUnitChange(index, 'rentRatePerSqM', e.target.value)}
                        placeholder="e.g. 10,000"
                        className="w-full h-10 sm:h-9 border border-slate-200 dark:border-slate-700 rounded-lg pl-7 pr-2.5 text-sm text-slate-900 dark:text-white bg-white dark:bg-slate-800/70 outline-none transition focus:border-[#D68B42] focus:ring-2 focus:ring-[#F9C083]/40 placeholder:text-slate-400 dark:placeholder:text-slate-500 tabular-nums"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <span className="text-slate-500 dark:text-slate-400">
                    {calc.annualValue > 0
                      ? `Monthly equivalent: ${formatCurrency(calc.monthlyValue, currencyCode, locale)}/mo`
                      : 'Area × expected rent per m²'}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-500 dark:text-slate-400 font-medium">Annual Rent:</span>
                    <span className="text-sm font-bold text-slate-900 dark:text-white tabular-nums">
                      {formatCurrency(calc.annualValue, currencyCode, locale)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 no-print">
          <button
            type="button"
            onClick={onAddRentalUnit}
            className="inline-flex items-center gap-1.5 bg-[#F9C083]/25 hover:bg-[#F9C083]/40 text-[#9A5B13] dark:text-[#F9C083] text-xs font-semibold px-3.5 py-2 rounded-xl transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Lettable Space</span>
          </button>

          {onSwitchToCapital && (
            <button
              type="button"
              onClick={onSwitchToCapital}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1B3352] dark:text-slate-300 hover:underline cursor-pointer"
            >
              <span>Need Capital Value instead?</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </section>
    </div>
  );
};
