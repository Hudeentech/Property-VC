import React from 'react';
import { MortgageData } from '../types/valuation';
import { formatCurrency } from '../utils/calculator';
import { ArrowRight, PencilLine, Plus, Trash2 } from 'lucide-react';

interface MortgageSectionProps {
  mortgageUnits: MortgageData[];
  currencySymbol: string;
  currencyCode: string;
  locale: string;
  onUpdateMortgageUnits: (updated: MortgageData[]) => void;
  onAddMortgageUnit: () => void;
  onSwitchToRental?: () => void;
}

export function calculateMortgageItem(mortgage: MortgageData) {
  const price = Math.max(0, Number(mortgage.propertyPrice) || 0);
  const downPercent = Math.min(100, Math.max(0, Number(mortgage.downPaymentPercent) || 0));
  const annualRate = Math.max(0, Number(mortgage.interestRatePercent) || 0);
  const years = Math.max(0, Number(mortgage.loanTermYears) || 0);

  const downPaymentAmount = price * (downPercent / 100);
  const loanPrincipal = Math.max(0, price - downPaymentAmount);
  const totalMonths = Math.round(years * 12);
  const monthlyInterestRate = annualRate / 100 / 12;

  let monthlyPayment = 0;
  if (loanPrincipal > 0 && totalMonths > 0) {
    if (monthlyInterestRate === 0) {
      monthlyPayment = loanPrincipal / totalMonths;
    } else {
      const factor = Math.pow(1 + monthlyInterestRate, totalMonths);
      monthlyPayment = (loanPrincipal * (monthlyInterestRate * factor)) / (factor - 1);
    }
  }

  const totalRepayment = monthlyPayment * totalMonths;
  const totalInterest = Math.max(0, totalRepayment - loanPrincipal);

  return {
    price,
    downPercent,
    annualRate,
    years,
    downPaymentAmount,
    loanPrincipal,
    monthlyPayment,
    totalInterest,
    totalRepayment,
    totalMonths,
  };
}

export function calculateMortgageSummary(mortgageUnits: MortgageData[]) {
  let totalPropertyPrice = 0;
  let downPaymentAmount = 0;
  let loanPrincipal = 0;
  let monthlyPayment = 0;
  let totalInterest = 0;
  let totalRepayment = 0;

  for (const unit of mortgageUnits) {
    const c = calculateMortgageItem(unit);
    totalPropertyPrice += c.price;
    downPaymentAmount += c.downPaymentAmount;
    loanPrincipal += c.loanPrincipal;
    monthlyPayment += c.monthlyPayment;
    totalInterest += c.totalInterest;
    totalRepayment += c.totalRepayment;
  }

  return {
    totalPropertyPrice,
    downPaymentAmount,
    loanPrincipal,
    monthlyPayment,
    totalInterest,
    totalRepayment,
  };
}

export const MortgageSection: React.FC<MortgageSectionProps> = ({
  mortgageUnits,
  currencySymbol,
  currencyCode,
  locale,
  onUpdateMortgageUnits,
  onAddMortgageUnit,
  onSwitchToRental,
}) => {
  const summary = calculateMortgageSummary(mortgageUnits);

  const handleUnitChange = (index: number, field: keyof MortgageData, value: string | number) => {
    const list = [...mortgageUnits];
    const target = { ...list[index] };
    if (field === 'propertyTitle') {
      target.propertyTitle = String(value);
    } else {
      const numVal = Math.max(0, Number(value) || 0);
      if (field === 'downPaymentPercent') {
        target.downPaymentPercent = Math.min(100, numVal);
      } else {
        target[field] = numVal as never;
      }
    }
    list[index] = target;
    onUpdateMortgageUnits(list);
  };

  const handleRemoveUnit = (index: number) => {
    if (mortgageUnits.length <= 1) return;
    onUpdateMortgageUnits(mortgageUnits.filter((_, i) => i !== index));
  };

  return (
    <div className="md:flex-1 md:min-h-0 grid grid-cols-1 md:grid-cols-12 gap-5 md:gap-6 items-start md:items-stretch">
      <div className="md:col-span-7 lg:col-span-8 md:h-full md:overflow-y-auto md:pr-1 pb-4 space-y-5">
        {/* Brand Lavender Banner Header for Mortgage Value */}
        <div className="relative overflow-hidden rounded-2xl bg-[#E4CEFA] text-[#222325] p-5 sm:p-6 shadow-xs flex flex-wrap items-center justify-between gap-4">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-14 -left-10 w-44 h-44 rounded-full bg-[#D5ADFA]/75 flex items-center justify-center"
          >
            <div className="w-24 h-24 rounded-full bg-[#C388F8]/85" />
          </div>

          <div className="relative z-10">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#222325]">
              Mortgage Valuation
            </h2>
            <p className="text-xs sm:text-sm text-[#2C2620]/85 mt-0.5">
              Estimate monthly mortgage repayments, loan principal, and total interest.
            </p>
          </div>

          <div className="relative z-10 text-left sm:text-right bg-white/55 backdrop-blur-xs px-4 py-2.5 rounded-xl">
            <span className="text-xs font-semibold text-[#2C2620] block">
              Estimated Monthly Payment
            </span>
            <strong className="text-xl sm:text-2xl font-bold tracking-tight text-[#222325] tabular-nums">
              {formatCurrency(summary.monthlyPayment, currencyCode, locale)}
            </strong>
          </div>
        </div>

        {/* Mortgage Components Section (1 component by default) */}
        <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-6 shadow-2xs space-y-4">
          <div className="space-y-4">
            {mortgageUnits.map((unit, index) => {
              const calc = calculateMortgageItem(unit);
              const isFirst = index === 0;
              const defaultHeading = index === 0 ? 'Main Building' : `Additional Component`;
              const unitKey = unit.id || `mortgage-${index}`;

              return (
                <div
                  key={unitKey}
                  className="border border-slate-200 dark:border-slate-800 rounded-xl p-4 sm:p-5 bg-white dark:bg-slate-900 transition-colors hover:border-slate-300 dark:hover:border-slate-700"
                >
                  {/* Editable Component Heading: e.g. "1. Main Building" */}
                  <div className="flex items-center justify-between gap-3 mb-4 pb-2.5 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2 flex-1">
                      <span className="text-sm font-bold text-[#1B3352] dark:text-[#E4CEFA] shrink-0">
                        {index + 1}.
                      </span>
                      <div className="relative flex-1 flex items-center">
                        <PencilLine
                          aria-hidden="true"
                          className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 absolute left-2.5 pointer-events-none"
                        />
                        <label
                          htmlFor={isFirst ? 'mortgageTitle' : `mortgageTitle-${unitKey}`}
                          className="sr-only"
                        >
                          Component Name
                        </label>
                        <input
                          id={isFirst ? 'mortgageTitle' : `mortgageTitle-${unitKey}`}
                          type="text"
                          value={unit.propertyTitle}
                          onChange={(e) => handleUnitChange(index, 'propertyTitle', e.target.value)}
                          aria-label={defaultHeading}
                          className="w-full h-9 border border-slate-200/80 dark:border-slate-700/80 hover:border-slate-300 dark:hover:border-slate-600 focus:border-[#9B51E0] rounded-lg pl-8 pr-3 text-sm font-semibold text-slate-900 dark:text-white bg-slate-50/80 dark:bg-slate-800/60 focus:bg-white dark:focus:bg-slate-800 outline-none transition focus:ring-2 focus:ring-[#E4CEFA]/50"
                        />
                        {!unit.propertyTitle && (
                          <span className="pointer-events-none absolute left-8 text-sm font-semibold text-slate-700 dark:text-slate-300">
                            {defaultHeading}
                          </span>
                        )}
                      </div>
                    </div>

                    {mortgageUnits.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveUnit(index)}
                        className="text-slate-400 hover:text-red-600 dark:hover:text-red-400 text-xs font-medium cursor-pointer inline-flex items-center gap-1 transition-colors py-1.5 px-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/40 shrink-0"
                        aria-label={`Remove ${unit.propertyTitle || defaultHeading}`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove</span>
                      </button>
                    )}
                  </div>

                  {/* 4-Column Inputs (Clean, no placeholder clutter) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Property Value / Price */}
                    <div>
                      <label
                        htmlFor={isFirst ? 'mortgagePrice' : `mortgagePrice-${unitKey}`}
                        className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1"
                      >
                        Property Value / Price
                      </label>
                      <div className="relative">
                        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 font-medium select-none text-xs">
                          {currencySymbol}
                        </span>
                        <input
                          id={isFirst ? 'mortgagePrice' : `mortgagePrice-${unitKey}`}
                          type="number"
                          min="0"
                          step="any"
                          value={unit.propertyPrice === 0 ? '' : unit.propertyPrice}
                          onChange={(e) => handleUnitChange(index, 'propertyPrice', e.target.value)}
                          className="w-full h-10 sm:h-9 border border-slate-200 dark:border-slate-700 rounded-lg pl-7 pr-2.5 text-sm text-slate-900 dark:text-white bg-white dark:bg-slate-800/70 outline-none transition focus:border-[#9B51E0] focus:ring-2 focus:ring-[#E4CEFA]/50 tabular-nums"
                        />
                      </div>
                    </div>

                    {/* Down Payment (%) */}
                    <div>
                      <label
                        htmlFor={isFirst ? 'mortgageDownPayment' : `mortgageDownPayment-${unitKey}`}
                        className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1"
                      >
                        Down Payment (%)
                      </label>
                      <div className="relative">
                        <input
                          id={isFirst ? 'mortgageDownPayment' : `mortgageDownPayment-${unitKey}`}
                          type="number"
                          min="0"
                          max="100"
                          step="any"
                          value={unit.downPaymentPercent === 0 ? '' : unit.downPaymentPercent}
                          onChange={(e) =>
                            handleUnitChange(index, 'downPaymentPercent', e.target.value)
                          }
                          className="w-full h-10 sm:h-9 border border-slate-200 dark:border-slate-700 rounded-lg pl-3 pr-7 text-sm text-slate-900 dark:text-white bg-white dark:bg-slate-800/70 outline-none transition focus:border-[#9B51E0] focus:ring-2 focus:ring-[#E4CEFA]/50 tabular-nums"
                        />
                        <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 font-medium select-none text-xs">
                          %
                        </span>
                      </div>
                    </div>

                    {/* Annual Interest Rate (%) */}
                    <div>
                      <label
                        htmlFor={isFirst ? 'mortgageRate' : `mortgageRate-${unitKey}`}
                        className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1"
                      >
                        Interest Rate (% / yr)
                      </label>
                      <div className="relative">
                        <input
                          id={isFirst ? 'mortgageRate' : `mortgageRate-${unitKey}`}
                          type="number"
                          min="0"
                          step="any"
                          value={unit.interestRatePercent === 0 ? '' : unit.interestRatePercent}
                          onChange={(e) =>
                            handleUnitChange(index, 'interestRatePercent', e.target.value)
                          }
                          className="w-full h-10 sm:h-9 border border-slate-200 dark:border-slate-700 rounded-lg pl-3 pr-7 text-sm text-slate-900 dark:text-white bg-white dark:bg-slate-800/70 outline-none transition focus:border-[#9B51E0] focus:ring-2 focus:ring-[#E4CEFA]/50 tabular-nums"
                        />
                        <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 font-medium select-none text-xs">
                          %
                        </span>
                      </div>
                    </div>

                    {/* Loan Term (Years) */}
                    <div>
                      <label
                        htmlFor={isFirst ? 'mortgageTerm' : `mortgageTerm-${unitKey}`}
                        className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1"
                      >
                        Loan Tenure (Years)
                      </label>
                      <div className="relative">
                        <input
                          id={isFirst ? 'mortgageTerm' : `mortgageTerm-${unitKey}`}
                          type="number"
                          min="0"
                          max="50"
                          step="1"
                          value={unit.loanTermYears === 0 ? '' : unit.loanTermYears}
                          onChange={(e) => handleUnitChange(index, 'loanTermYears', e.target.value)}
                          className="w-full h-10 sm:h-9 border border-slate-200 dark:border-slate-700 rounded-lg pl-3 pr-10 text-sm text-slate-900 dark:text-white bg-white dark:bg-slate-800/70 outline-none transition focus:border-[#9B51E0] focus:ring-2 focus:ring-[#E4CEFA]/50 tabular-nums"
                        />
                        <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 font-medium select-none text-xs">
                          yrs
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Subtle inline footer calculation */}
                  <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
                    <span className="text-slate-500 dark:text-slate-400">
                      {calc.price > 0 ? (
                        <>
                          Principal: {formatCurrency(calc.loanPrincipal, currencyCode, locale)}
                          {calc.downPaymentAmount > 0 && (
                            <>
                              {' '}· Down payment {calc.downPercent}% (
                              {formatCurrency(calc.downPaymentAmount, currencyCode, locale)})
                            </>
                          )}
                        </>
                      ) : (
                        'Enter property price, interest rate, and tenure'
                      )}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-slate-500 dark:text-slate-400 font-medium">
                        Monthly Payment:
                      </span>
                      <span className="text-sm font-bold text-slate-900 dark:text-white tabular-nums">
                        {formatCurrency(calc.monthlyPayment, currencyCode, locale)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Add Component & Switch Action */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1 no-print">
            <button
              type="button"
              onClick={onAddMortgageUnit}
              className="inline-flex items-center gap-1.5 bg-[#E4CEFA]/45 hover:bg-[#E4CEFA]/75 text-[#5B21B6] dark:text-[#E4CEFA] text-xs font-semibold px-3.5 py-2 rounded-xl transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Component</span>
            </button>

            {onSwitchToRental && (
              <button
                type="button"
                onClick={onSwitchToRental}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1B3352] dark:text-slate-300 hover:underline cursor-pointer"
              >
                <span>Need Rental Value instead?</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </section>
      </div>

      {/* Mortgage Valuation Summary Cards (Fixed Right column on desktop) */}
      <div className="md:col-span-5 lg:col-span-4 md:h-full md:overflow-y-auto">
        <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-6 shadow-2xs">
          <div className="flex flex-wrap items-baseline justify-between gap-2 pb-4 mb-4 border-b border-slate-100 dark:border-slate-800">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Mortgage Valuation Summary
            </h2>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Updates automatically
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-3">
            <div className="p-4 rounded-xl bg-[#E4CEFA]/35 dark:bg-[#E4CEFA]/15 border border-[#C388F8]/50">
              <span className="block text-xs font-medium text-slate-700 dark:text-[#E4CEFA] mb-1">
                Monthly Repayment
              </span>
              <strong className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white block tabular-nums break-words">
                {formatCurrency(summary.monthlyPayment, currencyCode, locale)}
              </strong>
              <span className="block text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                Principal + monthly interest
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50/80 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <span className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
                Total Loan Principal
              </span>
              <strong className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-white block tabular-nums break-words">
                {formatCurrency(summary.loanPrincipal, currencyCode, locale)}
              </strong>
              <span className="block text-[11px] text-slate-400 dark:text-slate-500 mt-1">
                Property value less down payment
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50/80 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <span className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
                Total Interest Payable
              </span>
              <strong className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-white block tabular-nums break-words">
                {formatCurrency(summary.totalInterest, currencyCode, locale)}
              </strong>
              <span className="block text-[11px] text-slate-400 dark:text-slate-500 mt-1">
                Total interest over loan tenure
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50/80 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <span className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
                Total Loan Repayment
              </span>
              <strong className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-white block tabular-nums break-words">
                {formatCurrency(summary.totalRepayment, currencyCode, locale)}
              </strong>
              <span className="block text-[11px] text-slate-400 dark:text-slate-500 mt-1">
                Loan principal + total interest
              </span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
