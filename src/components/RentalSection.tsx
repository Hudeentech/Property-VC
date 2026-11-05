import React from 'react';
import { LandData, RentalUnit } from '../types/valuation';
import {
  calculateLandValue,
  calculateRentalItem,
  calculateValuationSummary,
  formatCurrency,
} from '../utils/calculator';
import { Plus, Trash2, ArrowRight, PencilLine } from 'lucide-react';

interface RentalSectionProps {
  rentalUnits: RentalUnit[];
  land: LandData;
  currencySymbol: string;
  currencyCode: string;
  locale: string;
  onUpdateRentalUnits: (units: RentalUnit[]) => void;
  onUpdateLand: (land: LandData) => void;
  onAddRentalUnit: () => void;
  onSwitchToCapital?: () => void;
}

export const RentalSection: React.FC<RentalSectionProps> = ({
  rentalUnits,
  land,
  currencySymbol,
  currencyCode,
  locale,
  onUpdateRentalUnits,
  onUpdateLand,
  onAddRentalUnit,
  onSwitchToCapital,
}) => {
  const summary = calculateValuationSummary([], land, rentalUnits);
  const landCalc = calculateLandValue(land);

  const handleUnitChange = (index: number, field: keyof RentalUnit, value: string | number) => {
    const list = [...rentalUnits];
    const target = { ...list[index] };
    if (field === 'title') {
      target.title = String(value);
    } else if (field === 'period') {
      target.period = value as 'annual' | 'monthly';
    } else {
      const numVal = Math.max(0, Number(value) || 0);
      if (field === 'outgoingsPercent') {
        target.outgoingsPercent = Math.min(100, numVal);
      } else {
        target[field] = numVal as never;
      }
    }
    list[index] = target;
    onUpdateRentalUnits(list);
  };

  const handleRemoveUnit = (id: string) => {
    if (rentalUnits.length <= 1) return;
    onUpdateRentalUnits(rentalUnits.filter((u) => u.id !== id));
  };

  const handleLandChange = (field: keyof LandData, value: string | number) => {
    if (field === 'title') {
      onUpdateLand({ ...land, title: String(value) });
    } else {
      const numVal = Math.max(0, Number(value) || 0);
      onUpdateLand({ ...land, [field]: numVal });
    }
  };

  return (
    <div className="space-y-5">
      {/* Brand Peach Banner Header for Rental Valuation */}
      <div className="relative overflow-hidden rounded-2xl bg-[#F9C083] text-[#1E1E1E] p-5 sm:p-6 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-12 -left-12 w-36 h-36 rounded-full border-[14px] border-[#D68B42]/60"
        />
        <div className="relative z-10">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#1E1E1E]">
            Rental Valuation
          </h2>
          <p className="text-xs sm:text-sm text-[#2C2620]/85 mt-0.5">
            Gross rental value less outgoings for each component, plus site land value.
          </p>
        </div>

        <div className="relative z-10 text-left sm:text-right bg-white/45 backdrop-blur-xs px-4 py-2.5 rounded-xl">
          <span className="text-xs font-semibold text-[#2C2620] block">Total Net Rental Value</span>
          <strong
            id="rentalValue"
            className="text-xl sm:text-2xl font-bold tracking-tight text-[#1E1E1E] tabular-nums"
          >
            {formatCurrency(summary.rentalNetTotal, currencyCode, locale)}
          </strong>
        </div>
      </div>

      {/* Rental Components + Land Value Section */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-6 shadow-2xs space-y-5">
        <div className="space-y-4">
          {rentalUnits.map((unit, index) => {
            const calc = calculateRentalItem(unit);
            const isFirst = index === 0;
            const defaultHeading = index === 0 ? 'Main Building' : 'Additional Component';

            return (
              <div
                key={unit.id}
                className="border border-slate-200 dark:border-slate-800 rounded-xl p-4 sm:p-5 bg-white dark:bg-slate-900 transition-colors hover:border-slate-300 dark:hover:border-slate-700"
              >
                {/* Editable Component Heading: e.g. "1. Main Building", "2. Additional Component" */}
                <div className="flex items-center justify-between gap-3 mb-4 pb-2.5 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2 flex-1">
                    <span className="text-sm font-bold text-[#1B3352] dark:text-[#F9C083] shrink-0">
                      {index + 1}.
                    </span>
                    <div className="relative flex-1 flex items-center">
                      <PencilLine
                        aria-hidden="true"
                        className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 absolute left-2.5 pointer-events-none"
                      />
                      <label
                        htmlFor={isFirst ? 'rentalTitle' : `rentalTitle-${unit.id}`}
                        className="sr-only"
                      >
                        Component Name
                      </label>
                      <input
                        id={isFirst ? 'rentalTitle' : `rentalTitle-${unit.id}`}
                        type="text"
                        value={unit.title}
                        onChange={(e) => handleUnitChange(index, 'title', e.target.value)}
                        aria-label={defaultHeading}
                        className="w-full h-9 border border-slate-200/80 dark:border-slate-700/80 hover:border-slate-300 dark:hover:border-slate-600 focus:border-[#D68B42] rounded-lg pl-8 pr-3 text-sm font-semibold text-slate-900 dark:text-white bg-slate-50/80 dark:bg-slate-800/60 focus:bg-white dark:focus:bg-slate-800 outline-none transition focus:ring-2 focus:ring-[#F9C083]/40"
                      />
                      {!unit.title && (
                        <span className="pointer-events-none absolute left-8 text-sm font-semibold text-slate-700 dark:text-slate-300">
                          {defaultHeading}
                        </span>
                      )}
                    </div>
                  </div>

                  {rentalUnits.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveUnit(unit.id)}
                      className="text-slate-400 hover:text-red-600 dark:hover:text-red-400 text-xs font-medium cursor-pointer inline-flex items-center gap-1 transition-colors py-1.5 px-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/40 shrink-0"
                      aria-label={`Remove ${unit.title || defaultHeading}`}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove</span>
                    </button>
                  )}
                </div>

                {/* 3-Column Inputs: Area, Rental rate per m², Outgoings @ % */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                  {/* Area */}
                  <div>
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
                      className="w-full h-10 sm:h-9 border border-slate-200 dark:border-slate-700 rounded-lg px-3 text-sm text-slate-900 dark:text-white bg-white dark:bg-slate-800/70 outline-none transition focus:border-[#D68B42] focus:ring-2 focus:ring-[#F9C083]/40 tabular-nums"
                    />
                  </div>

                  {/* Rental rate per m² */}
                  <div>
                    <label
                      htmlFor={isFirst ? 'rentRate' : `rentRate-${unit.id}`}
                      className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1"
                    >
                      Rental rate per m²
                    </label>
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
                        className="w-full h-10 sm:h-9 border border-slate-200 dark:border-slate-700 rounded-lg pl-7 pr-2.5 text-sm text-slate-900 dark:text-white bg-white dark:bg-slate-800/70 outline-none transition focus:border-[#D68B42] focus:ring-2 focus:ring-[#F9C083]/40 tabular-nums"
                      />
                    </div>
                  </div>

                  {/* Less: Outgoings (%) */}
                  <div>
                    <label
                      htmlFor={isFirst ? 'rentOutgoings' : `rentOutgoings-${unit.id}`}
                      className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1"
                    >
                      Outgoings (%)
                    </label>
                    <div className="relative">
                      <input
                        id={isFirst ? 'rentOutgoings' : `rentOutgoings-${unit.id}`}
                        type="number"
                        min="0"
                        max="100"
                        step="any"
                        value={unit.outgoingsPercent === 0 ? '' : unit.outgoingsPercent}
                        onChange={(e) => handleUnitChange(index, 'outgoingsPercent', e.target.value)}
                        className="w-full h-10 sm:h-9 border border-slate-200 dark:border-slate-700 rounded-lg pl-3 pr-7 text-sm text-slate-900 dark:text-white bg-white dark:bg-slate-800/70 outline-none transition focus:border-[#D68B42] focus:ring-2 focus:ring-[#F9C083]/40 tabular-nums"
                      />
                      <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 font-medium select-none text-xs">
                        %
                      </span>
                    </div>
                  </div>
                </div>

                {/* Live Description | Value Breakdown Table */}
                <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-800">
                      <tr>
                        <th className="py-2 px-3.5">Description</th>
                        <th className="py-2 px-3.5 text-right">Value</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/70 bg-white dark:bg-slate-900">
                      <tr>
                        <td className="py-2 px-3.5 text-slate-600 dark:text-slate-400">Area</td>
                        <td className="py-2 px-3.5 text-right font-medium text-slate-900 dark:text-white tabular-nums">
                          {calc.area > 0
                            ? `${calc.area.toLocaleString(undefined, { maximumFractionDigits: 4 })} m²`
                            : '0 m²'}
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2 px-3.5 text-slate-600 dark:text-slate-400">
                          Rental rate per m²
                        </td>
                        <td className="py-2 px-3.5 text-right font-medium text-slate-900 dark:text-white tabular-nums">
                          {formatCurrency(calc.rentRatePerSqM, currencyCode, locale)}
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2 px-3.5 text-slate-700 dark:text-slate-300 font-medium">
                          Gross Rental Value
                        </td>
                        <td className="py-2 px-3.5 text-right font-semibold text-slate-900 dark:text-white tabular-nums">
                          {formatCurrency(calc.grossValue, currencyCode, locale)}
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2 px-3.5 text-slate-600 dark:text-slate-400">
                          Less: Outgoings @ {calc.outgoingsPercent}%
                        </td>
                        <td className="py-2 px-3.5 text-right font-medium text-slate-700 dark:text-slate-300 tabular-nums">
                          {formatCurrency(calc.outgoingsAmount, currencyCode, locale)}
                        </td>
                      </tr>
                      <tr className="bg-[#F9C083]/20 dark:bg-[#F9C083]/10">
                        <td className="py-2.5 px-3.5 font-bold text-[#1E1E1E] dark:text-white">
                          Net Rental Value
                        </td>
                        <td className="py-2.5 px-3.5 text-right font-bold text-[#1B3352] dark:text-[#F9C083] tabular-nums text-sm">
                          {formatCurrency(calc.netValue, currencyCode, locale)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })}
        </div>

        {/* Add Component Button */}
        <div className="flex flex-wrap items-center justify-between gap-3 no-print">
          <button
            type="button"
            onClick={onAddRentalUnit}
            className="inline-flex items-center gap-1.5 bg-[#F9C083]/25 hover:bg-[#F9C083]/40 text-[#9A5B13] dark:text-[#F9C083] text-xs font-semibold px-3.5 py-2 rounded-xl transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Component</span>
          </button>

          {summary.rentalNetTotal > 0 && (
            <span className="text-xs text-slate-500 dark:text-slate-400 tabular-nums">
              Components Net Total:{' '}
              <strong className="text-slate-900 dark:text-white">
                {formatCurrency(summary.rentalNetTotal, currencyCode, locale)}
              </strong>
            </span>
          )}
        </div>

        {/* Section 3 (or N+1): Land Value */}
        <div className="border-t border-slate-200 dark:border-slate-800 pt-5">
          <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-4 sm:p-5 bg-white dark:bg-slate-900">
            <div className="flex items-center gap-2 mb-4 pb-2.5 border-b border-slate-100 dark:border-slate-800">
              <span className="text-sm font-bold text-[#1B3352] dark:text-[#F9C083] shrink-0">
                {rentalUnits.length + 1}.
              </span>
              <div className="relative flex-1 flex items-center">
                <PencilLine
                  aria-hidden="true"
                  className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 absolute left-2.5 pointer-events-none"
                />
                <label htmlFor="rentalLandTitle" className="sr-only">
                  Land Value Title
                </label>
                <input
                  id="rentalLandTitle"
                  type="text"
                  value={land.title}
                  onChange={(e) => handleLandChange('title', e.target.value)}
                  aria-label="Land Value"
                  className="w-full h-9 border border-slate-200/80 dark:border-slate-700/80 hover:border-slate-300 dark:hover:border-slate-600 focus:border-[#D68B42] rounded-lg pl-8 pr-3 text-sm font-semibold text-slate-900 dark:text-white bg-slate-50/80 dark:bg-slate-800/60 focus:bg-white dark:focus:bg-slate-800 outline-none transition focus:ring-2 focus:ring-[#F9C083]/40"
                />
                {!land.title && (
                  <span className="pointer-events-none absolute left-8 text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Land Value
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
              {/* Land Area */}
              <div>
                <label
                  htmlFor="rentalLandArea"
                  className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1"
                >
                  Area (m²)
                </label>
                <input
                  id="rentalLandArea"
                  type="number"
                  min="0"
                  step="any"
                  value={land.area === 0 ? '' : land.area}
                  onChange={(e) => handleLandChange('area', e.target.value)}
                  className="w-full h-10 sm:h-9 border border-slate-200 dark:border-slate-700 rounded-lg px-3 text-sm text-slate-900 dark:text-white bg-white dark:bg-slate-800/70 outline-none transition focus:border-[#D68B42] focus:ring-2 focus:ring-[#F9C083]/40 tabular-nums"
                />
              </div>

              {/* Land cost per m² */}
              <div>
                <label
                  htmlFor="rentalLandCost"
                  className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1"
                >
                  Land cost per m²
                </label>
                <div className="relative">
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 font-medium select-none text-xs">
                    {currencySymbol}
                  </span>
                  <input
                    id="rentalLandCost"
                    type="number"
                    min="0"
                    step="any"
                    value={land.costPerSqM === 0 ? '' : land.costPerSqM}
                    onChange={(e) => handleLandChange('costPerSqM', e.target.value)}
                    className="w-full h-10 sm:h-9 border border-slate-200 dark:border-slate-700 rounded-lg pl-7 pr-2.5 text-sm text-slate-900 dark:text-white bg-white dark:bg-slate-800/70 outline-none transition focus:border-[#D68B42] focus:ring-2 focus:ring-[#F9C083]/40 tabular-nums"
                  />
                </div>
              </div>
            </div>

            {/* Land Description | Value Table */}
            <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="py-2 px-3.5">Description</th>
                    <th className="py-2 px-3.5 text-right">Value</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/70 bg-white dark:bg-slate-900">
                  <tr>
                    <td className="py-2 px-3.5 text-slate-600 dark:text-slate-400">Area</td>
                    <td className="py-2 px-3.5 text-right font-medium text-slate-900 dark:text-white tabular-nums">
                      {landCalc.area > 0
                        ? `${landCalc.area.toLocaleString(undefined, { maximumFractionDigits: 4 })} m²`
                        : '0 m²'}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3.5 text-slate-600 dark:text-slate-400">
                      Land cost per m²
                    </td>
                    <td className="py-2 px-3.5 text-right font-medium text-slate-900 dark:text-white tabular-nums">
                      {formatCurrency(landCalc.costPerSqM, currencyCode, locale)}
                    </td>
                  </tr>
                  <tr className="bg-slate-50/90 dark:bg-slate-800/50">
                    <td className="py-2.5 px-3.5 font-bold text-[#1E1E1E] dark:text-white">
                      Total Land Value
                    </td>
                    <td className="py-2.5 px-3.5 text-right font-bold text-[#1B3352] dark:text-[#F9C083] tabular-nums text-sm">
                      {formatCurrency(landCalc.value, currencyCode, locale)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {onSwitchToCapital && (
          <div className="pt-2 flex justify-end no-print">
            <button
              type="button"
              onClick={onSwitchToCapital}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1B3352] dark:text-slate-300 hover:underline cursor-pointer"
            >
              <span>Need Capital Value instead?</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </section>
    </div>
  );
};
