import React from 'react';
import { MortgageData } from '../types/valuation';
import { formatCurrency } from '../utils/calculator';
import { ArrowRight } from 'lucide-react';

interface MortgageSectionProps {
  mortgage: MortgageData;
  currencySymbol: string;
  currencyCode: string;
  locale: string;
  onUpdateMortgage: (updated: MortgageData) => void;
  onSwitchToRental?: () => void;
}

export function calculateMortgageSummary(mortgage: MortgageData) {
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
    downPaymentAmount,
    loanPrincipal,
    monthlyPayment,
    totalInterest,
    totalRepayment,
    totalMonths,
  };
}

export const MortgageSection: React.FC<MortgageSectionProps> = ({
  mortgage,
  currencySymbol,
  currencyCode,
  locale,
  onUpdateMortgage,
  onSwitchToRental,
}) => {
  const calc = calculateMortgageSummary(mortgage);

  const handleFieldChange = (field: keyof MortgageData, value: string | number) => {
    if (field === 'propertyTitle') {
      onUpdateMortgage({ ...mortgage, propertyTitle: String(value) });
    } else {
      const numVal = Math.max(0, Number(value) || 0);
      if (field === 'downPaymentPercent') {
        onUpdateMortgage({ ...mortgage, downPaymentPercent: Math.min(100, numVal) });
      } else {
        onUpdateMortgage({ ...mortgage, [field]: numVal });
      }
    }
  };

  return (
    <div className="space-y-5">
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
            Mortgage Value Calculator
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
            {formatCurrency(calc.monthlyPayment, currencyCode, locale)}
          </strong>
        </div>
      </div>

      {/* Mortgage Inputs Section (Placeholders only, no pre-filled numbers) */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-6 shadow-2xs">
        <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-4 bg-white dark:bg-slate-900">
          {/* Property Name */}
          <div className="mb-4">
            <label
              htmlFor="mortgageTitle"
              className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1"
            >
              Property / Mortgage Name
            </label>
            <input
              id="mortgageTitle"
              type="text"
              value={mortgage.propertyTitle}
              onChange={(e) => handleFieldChange('propertyTitle', e.target.value)}
              placeholder="Name this property (e.g. 4-Bedroom Terrace Duplex)"
              className="w-full h-10 sm:h-9 border border-slate-200 dark:border-slate-700 rounded-lg px-3 text-sm text-slate-900 dark:text-white bg-white dark:bg-slate-800/70 outline-none transition focus:border-[#9B51E0] focus:ring-2 focus:ring-[#E4CEFA]/50 placeholder:text-slate-400 dark:placeholder:text-slate-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Property Price */}
            <div>
              <label
                htmlFor="mortgagePrice"
                className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1"
              >
                Property Value / Price
              </label>
              <div className="relative">
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 font-medium select-none text-xs">
                  {currencySymbol}
                </span>
                <input
                  id="mortgagePrice"
                  type="number"
                  min="0"
                  step="any"
                  value={mortgage.propertyPrice === 0 ? '' : mortgage.propertyPrice}
                  onChange={(e) => handleFieldChange('propertyPrice', e.target.value)}
                  placeholder="e.g. 85,000,000"
                  className="w-full h-10 sm:h-9 border border-slate-200 dark:border-slate-700 rounded-lg pl-7 pr-2.5 text-sm text-slate-900 dark:text-white bg-white dark:bg-slate-800/70 outline-none transition focus:border-[#9B51E0] focus:ring-2 focus:ring-[#E4CEFA]/50 placeholder:text-slate-400 dark:placeholder:text-slate-500 tabular-nums"
                />
              </div>
            </div>

            {/* Down Payment (%) */}
            <div>
              <label
                htmlFor="mortgageDownPayment"
                className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1"
              >
                Down Payment (%)
              </label>
              <div className="relative">
                <input
                  id="mortgageDownPayment"
                  type="number"
                  min="0"
                  max="100"
                  step="any"
                  value={mortgage.downPaymentPercent === 0 ? '' : mortgage.downPaymentPercent}
                  onChange={(e) => handleFieldChange('downPaymentPercent', e.target.value)}
                  placeholder="e.g. 20"
                  className="w-full h-10 sm:h-9 border border-slate-200 dark:border-slate-700 rounded-lg pl-3 pr-7 text-sm text-slate-900 dark:text-white bg-white dark:bg-slate-800/70 outline-none transition focus:border-[#9B51E0] focus:ring-2 focus:ring-[#E4CEFA]/50 placeholder:text-slate-400 dark:placeholder:text-slate-500 tabular-nums"
                />
                <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 font-medium select-none text-xs">
                  %
                </span>
              </div>
            </div>

            {/* Annual Interest Rate (%) */}
            <div>
              <label
                htmlFor="mortgageRate"
                className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1"
              >
                Interest Rate (% / yr)
              </label>
              <div className="relative">
                <input
                  id="mortgageRate"
                  type="number"
                  min="0"
                  step="any"
                  value={mortgage.interestRatePercent === 0 ? '' : mortgage.interestRatePercent}
                  onChange={(e) => handleFieldChange('interestRatePercent', e.target.value)}
                  placeholder="e.g. 12.5"
                  className="w-full h-10 sm:h-9 border border-slate-200 dark:border-slate-700 rounded-lg pl-3 pr-7 text-sm text-slate-900 dark:text-white bg-white dark:bg-slate-800/70 outline-none transition focus:border-[#9B51E0] focus:ring-2 focus:ring-[#E4CEFA]/50 placeholder:text-slate-400 dark:placeholder:text-slate-500 tabular-nums"
                />
                <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 font-medium select-none text-xs">
                  %
                </span>
              </div>
            </div>

            {/* Loan Term (Years) */}
            <div>
              <label
                htmlFor="mortgageTerm"
                className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1"
              >
                Loan Tenure (Years)
              </label>
              <div className="relative">
                <input
                  id="mortgageTerm"
                  type="number"
                  min="0"
                  max="50"
                  step="1"
                  value={mortgage.loanTermYears === 0 ? '' : mortgage.loanTermYears}
                  onChange={(e) => handleFieldChange('loanTermYears', e.target.value)}
                  placeholder="e.g. 15"
                  className="w-full h-10 sm:h-9 border border-slate-200 dark:border-slate-700 rounded-lg pl-3 pr-10 text-sm text-slate-900 dark:text-white bg-white dark:bg-slate-800/70 outline-none transition focus:border-[#9B51E0] focus:ring-2 focus:ring-[#E4CEFA]/50 placeholder:text-slate-400 dark:placeholder:text-slate-500 tabular-nums"
                />
                <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 font-medium select-none text-xs">
                  yrs
                </span>
              </div>
            </div>
          </div>

          <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
            <span className="text-slate-500 dark:text-slate-400">
              {calc.downPaymentAmount > 0
                ? `Down payment: ${formatCurrency(calc.downPaymentAmount, currencyCode, locale)} (${mortgage.downPaymentPercent}%)`
                : 'Enter property price, interest rate, and tenure'}
            </span>
            <div className="flex items-center gap-1.5">
              <span className="text-slate-500 dark:text-slate-400 font-medium">Loan Principal:</span>
              <span className="text-sm font-bold text-slate-900 dark:text-white tabular-nums">
                {formatCurrency(calc.loanPrincipal, currencyCode, locale)}
              </span>
            </div>
          </div>
        </div>

        {onSwitchToRental && (
          <div className="mt-4 flex justify-end no-print">
            <button
              type="button"
              onClick={onSwitchToRental}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1B3352] dark:text-slate-300 hover:underline cursor-pointer"
            >
              <span>Switch to Rental Value Calculator</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </section>

      {/* Mortgage Valuation Summary Cards */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-6 shadow-2xs">
        <div className="flex flex-wrap items-baseline justify-between gap-2 pb-4 mb-4 border-b border-slate-100 dark:border-slate-800">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Mortgage Repayment Summary
          </h2>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            {calc.totalMonths > 0 ? `${calc.totalMonths} monthly installments` : 'Updates automatically'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-5">
          <div className="p-3.5 rounded-xl bg-[#E4CEFA]/35 dark:bg-[#E4CEFA]/15 border border-[#C388F8]/50">
            <span className="block text-xs font-medium text-slate-700 dark:text-[#E4CEFA] mb-1">
              Monthly Repayment
            </span>
            <strong className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white block tabular-nums break-words">
              {formatCurrency(calc.monthlyPayment, currencyCode, locale)}
            </strong>
            <span className="block text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              Principal + monthly interest
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50/80 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
            <span className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
              Total Interest Payable
            </span>
            <strong className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-white block tabular-nums break-words">
              {formatCurrency(calc.totalInterest, currencyCode, locale)}
            </strong>
            <span className="block text-[11px] text-slate-400 dark:text-slate-500 mt-1">
              Over {mortgage.loanTermYears || 0} year(s)
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50/80 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
            <span className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
              Total Loan Repayment
            </span>
            <strong className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-white block tabular-nums break-words">
              {formatCurrency(calc.totalRepayment, currencyCode, locale)}
            </strong>
            <span className="block text-[11px] text-slate-400 dark:text-slate-500 mt-1">
              Loan principal + total interest
            </span>
          </div>
        </div>
      </section>
    </div>
  );
};
