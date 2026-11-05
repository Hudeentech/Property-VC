import React, { useState, useEffect } from 'react';
import { ConstructionVariable, LandData, RentalUnit, ValuationSummary } from '../types/valuation';
import {
  calculateConstructionItem,
  calculateLandValue,
  calculateRentalItem,
  formatCurrency,
} from '../utils/calculator';
import { exportValuationReportToPdf } from '../utils/pdfExport';
import { Download, Printer, X, KeyRound, Building2, Layers } from 'lucide-react';

export type ReportTemplateType = 'rental' | 'capital' | 'combined';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTemplate?: ReportTemplateType;
  reportTitle?: string;
  constructionVariables: ConstructionVariable[];
  land: LandData;
  rentalUnits: RentalUnit[];
  summary: ValuationSummary;
  currencyCode: string;
  locale: string;
}

export const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  onClose,
  defaultTemplate = 'rental',
  reportTitle,
  constructionVariables,
  land,
  rentalUnits,
  summary,
  currencyCode,
  locale,
}) => {
  const [template, setTemplate] = useState<ReportTemplateType>(defaultTemplate);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setTemplate(defaultTemplate);
    }
  }, [isOpen, defaultTemplate]);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleExportPdf = async () => {
    if (isExporting) return;
    setIsExporting(true);
    try {
      await exportValuationReportToPdf({
        template,
        reportTitle,
        constructionVariables,
        land,
        rentalUnits,
        summary,
        currencyCode,
        locale,
      });
    } finally {
      setIsExporting(false);
    }
  };

  const today = new Date().toLocaleDateString(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  const landCalc = calculateLandValue(land);
  const showCapital = template === 'capital' || template === 'combined';
  const showRental = template === 'rental' || template === 'combined';

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="report-modal-title"
      className="fixed inset-0 z-50 bg-[#12151C]/70 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-6"
    >
      <div className="relative bg-white dark:bg-[#181B22] rounded-t-[24px] sm:rounded-[24px] max-w-3xl w-full max-h-[92vh] overflow-y-auto p-4 sm:p-7 shadow-2xl border border-slate-200/90 dark:border-slate-800">
        {/* Top Action Bar & Template Switcher (Hidden in Print) */}
        <div className="sticky top-0 bg-white/95 dark:bg-[#181B22]/95 backdrop-blur-md z-20 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3 border-b border-slate-200 dark:border-slate-800 pb-3 mb-4 sm:mb-5 no-print">
          <div className="flex items-center justify-between gap-2">
            {/* Template Selector */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/90 p-1 rounded-xl flex-1 sm:flex-initial">
              <button
                type="button"
                onClick={() => setTemplate('rental')}
                className={`flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  template === 'rental'
                    ? 'bg-[#F9C083] text-[#1E1E1E] shadow-2xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <KeyRound className="w-3.5 h-3.5 shrink-0" />
                <span>Rental</span>
              </button>

              <button
                type="button"
                onClick={() => setTemplate('capital')}
                className={`flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  template === 'capital'
                    ? 'bg-[#1B3352] text-white shadow-2xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Building2 className="w-3.5 h-3.5 shrink-0" />
                <span>Capital</span>
              </button>

              <button
                type="button"
                onClick={() => setTemplate('combined')}
                className={`flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  template === 'combined'
                    ? 'bg-[#222325] text-white shadow-2xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Layers className="w-3.5 h-3.5 text-[#F9C083] shrink-0" />
                <span>Full</span>
              </button>
            </div>

            {/* Mobile Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="sm:hidden p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white bg-slate-100 dark:bg-slate-800 rounded-xl transition-colors cursor-pointer"
              aria-label="Close report modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Export B&W PDF, Print & Desktop Close Buttons */}
          <div className="flex items-center gap-2 sm:ml-auto">
            <button
              type="button"
              onClick={handleExportPdf}
              disabled={isExporting}
              title="Downloads a printer-friendly Black & White desktop A4 PDF"
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 bg-[#1B3352] hover:bg-[#13253D] disabled:opacity-60 text-white text-xs font-semibold px-3.5 py-2 rounded-xl transition-colors cursor-pointer shadow-2xs"
            >
              <Download className="w-3.5 h-3.5 text-[#F9C083]" />
              <span>{isExporting ? 'Exporting…' : 'Export PDF (B&W)'}</span>
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center justify-center gap-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-medium px-3 py-2 rounded-xl transition-colors cursor-pointer"
              title="Print report"
              aria-label="Print report"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Print</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="hidden sm:inline-flex p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
              aria-label="Close report modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* On-Screen Brand Report Surface */}
        <div className="printable-report bg-white text-[#1E1E1E] rounded-2xl">
          {/* Clean Brand Header Banner */}
          {template === 'rental' ? (
            <div className="relative overflow-hidden rounded-[20px] sm:rounded-[22px] bg-[#F9C083] text-[#1E1E1E] p-4 sm:p-6 mb-4 sm:mb-5">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -top-14 -left-14 w-36 sm:w-40 h-36 sm:h-40 rounded-full border-[14px] sm:border-[16px] border-[#D68B42]/55"
              />
              <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
                <div>
                  <h1
                    id="report-modal-title"
                    className="text-xl sm:text-3xl font-bold tracking-tight text-[#1E1E1E]"
                  >
                    {reportTitle || 'Rental Valuation'}
                  </h1>
                  <p className="text-xs text-[#2C2620]/80 mt-0.5">{today}</p>
                </div>

                <div className="pt-2 sm:pt-0 border-t border-[#D68B42]/25 sm:border-0 text-left sm:text-right">
                  <span className="text-[11px] sm:text-xs font-medium text-[#2C2620]/80 block">
                    Net Rental Value
                  </span>
                  <strong className="text-lg sm:text-2xl font-bold tracking-tight text-[#1E1E1E] tabular-nums">
                    {formatCurrency(summary.rentalNetTotal, currencyCode, locale)}
                  </strong>
                </div>
              </div>
            </div>
          ) : (
            <div className="relative overflow-hidden rounded-[20px] sm:rounded-[22px] bg-[#1B3352] text-white p-4 sm:p-6 mb-4 sm:mb-5">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -top-16 -right-10 w-40 sm:w-48 h-40 sm:h-48 rounded-full border-[18px] sm:border-[20px] border-white/[0.06]"
              />
              <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
                <div>
                  <h1
                    id="report-modal-title"
                    className="text-xl sm:text-3xl font-bold tracking-tight text-white"
                  >
                    {reportTitle ||
                      (template === 'capital' ? 'Capital Value' : 'Property Valuation')}
                  </h1>
                  <p className="text-xs text-white/75 mt-0.5">{today}</p>
                </div>

                <div className="pt-2 sm:pt-0 border-t border-white/15 sm:border-0 text-left sm:text-right">
                  <span className="text-[11px] sm:text-xs font-medium text-[#F9C083] block">
                    Total Capital Value
                  </span>
                  <strong className="text-lg sm:text-2xl font-bold tracking-tight text-white tabular-nums">
                    {formatCurrency(summary.totalCapitalValue, currencyCode, locale)}
                  </strong>
                </div>
              </div>
            </div>
          )}

          {/* Brand Bento Summary Cards */}
          {template === 'rental' && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3 mb-4 sm:mb-5">
              <div className="col-span-2 sm:col-span-1 rounded-2xl bg-[#F9C083] text-[#1E1E1E] p-3.5 sm:p-4">
                <span className="text-xs font-medium text-[#2C2620] block">Net Rental Value</span>
                <span className="text-base sm:text-xl font-bold tracking-tight text-[#1E1E1E] block mt-0.5 sm:mt-1 tabular-nums break-words">
                  {formatCurrency(summary.rentalNetTotal, currencyCode, locale)}
                </span>
              </div>

              <div className="rounded-2xl bg-[#1B3352] text-white p-3.5 sm:p-4">
                <span className="text-xs font-medium text-[#F9C083] block">Gross Rental Value</span>
                <span className="text-sm sm:text-xl font-bold tracking-tight text-white block mt-0.5 sm:mt-1 tabular-nums break-words">
                  {formatCurrency(summary.rentalGrossTotal, currencyCode, locale)}
                </span>
              </div>

              <div className="rounded-2xl bg-[#222325] text-white p-3.5 sm:p-4">
                <span className="text-xs font-medium text-[#F9C083] block">Total Land Value</span>
                <span className="text-sm sm:text-xl font-bold tracking-tight text-white block mt-0.5 sm:mt-1 tabular-nums break-words">
                  {formatCurrency(summary.landValueTotal, currencyCode, locale)}
                </span>
              </div>
            </div>
          )}

          {template === 'capital' && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3 mb-4 sm:mb-5">
              <div className="col-span-2 sm:col-span-1 rounded-2xl bg-[#1B3352] text-white p-3.5 sm:p-4">
                <span className="text-xs font-medium text-[#F9C083] block">Capital Value</span>
                <span className="text-base sm:text-xl font-bold tracking-tight text-white block mt-0.5 sm:mt-1 tabular-nums break-words">
                  {formatCurrency(summary.totalCapitalValue, currencyCode, locale)}
                </span>
              </div>

              <div className="rounded-2xl bg-[#F9C083] text-[#1E1E1E] p-3.5 sm:p-4">
                <span className="text-xs font-medium text-[#2C2620] block">Buildings (Net)</span>
                <span className="text-sm sm:text-xl font-bold tracking-tight text-[#1E1E1E] block mt-0.5 sm:mt-1 tabular-nums break-words">
                  {formatCurrency(summary.constructionNetTotal, currencyCode, locale)}
                </span>
              </div>

              <div className="rounded-2xl bg-[#222325] text-white p-3.5 sm:p-4">
                <span className="text-xs font-medium text-[#F9C083] block">Land Value</span>
                <span className="text-sm sm:text-xl font-bold tracking-tight text-white block mt-0.5 sm:mt-1 tabular-nums break-words">
                  {formatCurrency(summary.landValueTotal, currencyCode, locale)}
                </span>
              </div>
            </div>
          )}

          {template === 'combined' && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3 mb-4 sm:mb-5">
              <div className="rounded-2xl bg-[#1B3352] text-white p-3.5 sm:p-4">
                <span className="text-xs font-medium text-[#F9C083] block">Capital Value</span>
                <span className="text-sm sm:text-xl font-bold tracking-tight text-white block mt-0.5 sm:mt-1 tabular-nums break-words">
                  {formatCurrency(summary.totalCapitalValue, currencyCode, locale)}
                </span>
              </div>

              <div className="rounded-2xl bg-[#F9C083] text-[#1E1E1E] p-3.5 sm:p-4">
                <span className="text-xs font-medium text-[#2C2620] block">Net Rental Value</span>
                <span className="text-sm sm:text-xl font-bold tracking-tight text-[#1E1E1E] block mt-0.5 sm:mt-1 tabular-nums break-words">
                  {formatCurrency(summary.rentalNetTotal, currencyCode, locale)}
                </span>
              </div>

              <div className="col-span-2 sm:col-span-1 rounded-2xl bg-[#222325] text-white p-3.5 sm:p-4">
                <span className="text-xs font-medium text-[#F9C083] block">Rental Yield</span>
                <span className="text-base sm:text-xl font-bold tracking-tight text-[#F9C083] block mt-0.5 sm:mt-1 tabular-nums">
                  {summary.grossRentalYieldPercent > 0
                    ? `${summary.grossRentalYieldPercent.toFixed(2)}%`
                    : '—'}
                </span>
              </div>
            </div>
          )}

          {/* Rental Valuation Sections: 1. Main Building, 2. Additional Component, 3. Land Value */}
          {showRental && (
            <div className="space-y-4 mb-5 last:mb-0">
              {rentalUnits.map((u, i) => {
                const c = calculateRentalItem(u);
                const heading = u.title.trim() || (i === 0 ? 'Main Building' : 'Additional Component');
                return (
                  <div key={u.id}>
                    <h3 className="text-sm font-bold text-[#1B3352] mb-2">
                      {i + 1}. {heading}
                    </h3>
                    <div className="overflow-hidden border border-slate-200 rounded-2xl">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-[#1B3352] text-white font-semibold">
                          <tr>
                            <th className="py-2.5 px-3.5">Description</th>
                            <th className="py-2.5 px-3.5 text-right">Value</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 bg-white">
                          <tr>
                            <td className="py-2 px-3.5 text-slate-700">Area</td>
                            <td className="py-2 px-3.5 text-right font-medium tabular-nums text-[#1E1E1E]">
                              {c.area.toLocaleString(undefined, { maximumFractionDigits: 4 })} m²
                            </td>
                          </tr>
                          <tr>
                            <td className="py-2 px-3.5 text-slate-700">Rental rate per m²</td>
                            <td className="py-2 px-3.5 text-right font-medium tabular-nums text-[#1E1E1E]">
                              {formatCurrency(c.rentRatePerSqM, currencyCode, locale)}
                            </td>
                          </tr>
                          <tr>
                            <td className="py-2 px-3.5 font-medium text-[#1E1E1E]">
                              Gross Rental Value
                            </td>
                            <td className="py-2 px-3.5 text-right font-semibold tabular-nums text-[#1E1E1E]">
                              {formatCurrency(c.grossValue, currencyCode, locale)}
                            </td>
                          </tr>
                          <tr>
                            <td className="py-2 px-3.5 text-slate-700">
                              Less: Outgoings @ {c.outgoingsPercent}%
                            </td>
                            <td className="py-2 px-3.5 text-right font-medium tabular-nums text-slate-700">
                              {formatCurrency(c.outgoingsAmount, currencyCode, locale)}
                            </td>
                          </tr>
                          <tr className="bg-[#F9C083]/25 font-bold">
                            <td className="py-2.5 px-3.5 text-[#1E1E1E]">Net Rental Value</td>
                            <td className="py-2.5 px-3.5 text-right tabular-nums text-[#1B3352]">
                              {formatCurrency(c.netValue, currencyCode, locale)}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                );
              })}

              {/* Section N+1: Land Value inside Rental Report */}
              {template === 'rental' && (
                <div>
                  <h3 className="text-sm font-bold text-[#1B3352] mb-2">
                    {rentalUnits.length + 1}. {land.title.trim() || 'Land Value'}
                  </h3>
                  <div className="overflow-hidden border border-slate-200 rounded-2xl">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#222325] text-white font-semibold">
                        <tr>
                          <th className="py-2.5 px-3.5">Description</th>
                          <th className="py-2.5 px-3.5 text-right">Value</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 bg-white">
                        <tr>
                          <td className="py-2 px-3.5 text-slate-700">Area</td>
                          <td className="py-2 px-3.5 text-right font-medium tabular-nums text-[#1E1E1E]">
                            {landCalc.area.toLocaleString(undefined, { maximumFractionDigits: 4 })} m²
                          </td>
                        </tr>
                        <tr>
                          <td className="py-2 px-3.5 text-slate-700">Land cost per m²</td>
                          <td className="py-2 px-3.5 text-right font-medium tabular-nums text-[#1E1E1E]">
                            {formatCurrency(landCalc.costPerSqM, currencyCode, locale)}
                          </td>
                        </tr>
                        <tr className="bg-slate-50 font-bold">
                          <td className="py-2.5 px-3.5 text-[#1E1E1E]">Total Land Value</td>
                          <td className="py-2.5 px-3.5 text-right tabular-nums text-[#1B3352]">
                            {formatCurrency(landCalc.value, currencyCode, locale)}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Capital Value Sections (Construction + Land) */}
          {showCapital && (
            <div className="space-y-4 sm:space-y-5">
              <div>
                <h3 className="text-xs font-semibold text-slate-600 mb-2">
                  Construction Components
                </h3>

                {/* Simple Mobile Cards (< sm) */}
                <div className="sm:hidden space-y-2">
                  {constructionVariables.map((v, i) => {
                    const c = calculateConstructionItem(v);
                    return (
                      <div
                        key={v.id}
                        className="rounded-xl border border-slate-200 p-3 bg-white flex items-center justify-between gap-3"
                      >
                        <div className="min-w-0">
                          <div className="text-xs font-semibold text-[#1E1E1E] truncate">
                            {v.title || (i === 0 ? 'Main Building' : `Component ${i + 1}`)}
                          </div>
                          <div className="text-[11px] text-slate-500 tabular-nums mt-0.5">
                            {v.area.toLocaleString()} m² · Depr. {v.depreciationPercent}%
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="text-xs font-bold text-[#1B3352] tabular-nums">
                            {formatCurrency(c.finalValue, currencyCode, locale)}
                          </div>
                          <div className="text-[10px] text-slate-400 tabular-nums">
                            Gross {formatCurrency(c.grossValue, currencyCode, locale)}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <div className="rounded-xl bg-slate-100 p-3 flex items-center justify-between text-xs font-bold">
                    <span className="text-[#1B3352]">Buildings Total</span>
                    <span className="text-[#1B3352] tabular-nums">
                      {formatCurrency(summary.constructionNetTotal, currencyCode, locale)}
                    </span>
                  </div>
                </div>

                {/* Full Desktop Table (sm+) */}
                <div className="hidden sm:block overflow-x-auto border border-slate-200 rounded-2xl">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#1B3352] text-white font-semibold">
                      <tr>
                        <th className="py-2.5 px-3.5">Component</th>
                        <th className="py-2.5 px-3.5 text-right">Area (m²)</th>
                        <th className="py-2.5 px-3.5 text-right">Cost / m²</th>
                        <th className="py-2.5 px-3.5 text-right">Gross</th>
                        <th className="py-2.5 px-3.5 text-right">Depr.</th>
                        <th className="py-2.5 px-3.5 text-right">Net Value</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 bg-white">
                      {constructionVariables.map((v, i) => {
                        const c = calculateConstructionItem(v);
                        return (
                          <tr key={v.id}>
                            <td className="py-2.5 px-3.5 font-medium text-[#1E1E1E]">
                              {v.title || (i === 0 ? 'Main Building' : `Component ${i + 1}`)}
                            </td>
                            <td className="py-2.5 px-3.5 text-right tabular-nums text-slate-700">
                              {v.area.toLocaleString()} m²
                            </td>
                            <td className="py-2.5 px-3.5 text-right tabular-nums text-slate-700">
                              {formatCurrency(v.costPerSqM, currencyCode, locale)}
                            </td>
                            <td className="py-2.5 px-3.5 text-right tabular-nums text-slate-600">
                              {formatCurrency(c.grossValue, currencyCode, locale)}
                            </td>
                            <td className="py-2.5 px-3.5 text-right tabular-nums text-slate-500">
                              {v.depreciationPercent}%
                            </td>
                            <td className="py-2.5 px-3.5 text-right font-bold tabular-nums text-[#1B3352]">
                              {formatCurrency(c.finalValue, currencyCode, locale)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                    <tfoot className="bg-slate-50 font-bold border-t border-slate-200">
                      <tr>
                        <td className="py-2.5 px-3.5 text-[#1B3352]">Buildings Total</td>
                        <td className="py-2.5 px-3.5 text-right tabular-nums text-[#1E1E1E]">
                          {summary.totalBuiltAreaSqM.toLocaleString()} m²
                        </td>
                        <td className="py-2.5 px-3.5 text-right text-slate-400">—</td>
                        <td className="py-2.5 px-3.5 text-right tabular-nums text-slate-700">
                          {formatCurrency(summary.constructionGrossTotal, currencyCode, locale)}
                        </td>
                        <td className="py-2.5 px-3.5 text-right tabular-nums text-slate-500">
                          −{formatCurrency(summary.constructionDepreciationTotal, currencyCode, locale)}
                        </td>
                        <td className="py-2.5 px-3.5 text-right tabular-nums text-[#1B3352]">
                          {formatCurrency(summary.constructionNetTotal, currencyCode, locale)}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              <div>
                <h3 className="text-xs font-semibold text-slate-600 mb-2">
                  Land Value
                </h3>

                {/* Simple Mobile Card (< sm) */}
                <div className="sm:hidden rounded-xl border border-slate-200 p-3 bg-white flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-xs font-semibold text-[#1E1E1E] truncate">
                      {land.title || 'Land Value'}
                    </div>
                    <div className="text-[11px] text-slate-500 tabular-nums mt-0.5">
                      {land.area.toLocaleString()} m² ×{' '}
                      {formatCurrency(land.costPerSqM, currencyCode, locale)}/m²
                    </div>
                  </div>
                  <div className="text-xs font-bold text-[#1B3352] tabular-nums shrink-0">
                    {formatCurrency(summary.landValueTotal, currencyCode, locale)}
                  </div>
                </div>

                {/* Full Desktop Table (sm+) */}
                <div className="hidden sm:block overflow-x-auto border border-slate-200 rounded-2xl">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#222325] text-white font-semibold">
                      <tr>
                        <th className="py-2.5 px-3.5">Description</th>
                        <th className="py-2.5 px-3.5 text-right">Area (m²)</th>
                        <th className="py-2.5 px-3.5 text-right">Land cost per m²</th>
                        <th className="py-2.5 px-3.5 text-right">Total Land Value</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 bg-white">
                      <tr>
                        <td className="py-2.5 px-3.5 font-medium text-[#1E1E1E]">
                          {land.title || 'Land Value'}
                        </td>
                        <td className="py-2.5 px-3.5 text-right tabular-nums text-slate-700">
                          {land.area.toLocaleString()} m²
                        </td>
                        <td className="py-2.5 px-3.5 text-right tabular-nums text-slate-700">
                          {formatCurrency(land.costPerSqM, currencyCode, locale)}
                        </td>
                        <td className="py-2.5 px-3.5 text-right font-bold tabular-nums text-[#1B3352]">
                          {formatCurrency(summary.landValueTotal, currencyCode, locale)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
