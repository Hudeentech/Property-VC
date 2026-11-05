import type { ConstructionVariable, LandData, RentalUnit, ValuationSummary } from '../types/valuation.ts';

export const SUPPORTED_CURRENCIES = [
  { code: 'NGN', symbol: '₦', name: 'Nigerian Naira (₦)', locale: 'en-NG' },
  { code: 'USD', symbol: '$', name: 'US Dollar ($)', locale: 'en-US' },
  { code: 'GBP', symbol: '£', name: 'British Pound (£)', locale: 'en-GB' },
  { code: 'EUR', symbol: '€', name: 'Euro (€)', locale: 'de-DE' },
  { code: 'CAD', symbol: 'CA$', name: 'Canadian Dollar (CA$)', locale: 'en-CA' },
  { code: 'AED', symbol: 'AED', name: 'UAE Dirham (AED)', locale: 'en-AE' },
  { code: 'ZAR', symbol: 'R', name: 'South African Rand (R)', locale: 'en-ZA' },
  { code: 'KES', symbol: 'KSh', name: 'Kenyan Shilling (KSh)', locale: 'en-KE' },
  { code: 'GHS', symbol: 'GH₵', name: 'Ghanaian Cedi (GH₵)', locale: 'en-GH' },
];

export function sanitizeNumber(val: unknown): number {
  if (typeof val === 'number') {
    return isFinite(val) && !isNaN(val) ? Math.max(0, val) : 0;
  }
  if (typeof val === 'string') {
    const cleaned = val.replace(/,/g, '').trim();
    const parsed = parseFloat(cleaned);
    return isFinite(parsed) && !isNaN(parsed) ? Math.max(0, parsed) : 0;
  }
  return 0;
}

export function calculateConstructionItem(item: {
  area: number;
  costPerSqM: number;
  depreciationPercent: number;
}) {
  const area = sanitizeNumber(item.area);
  const costPerSqM = sanitizeNumber(item.costPerSqM);
  const depPercent = Math.min(100, sanitizeNumber(item.depreciationPercent));

  const grossValue = area * costPerSqM;
  const depreciationAmount = grossValue * (depPercent / 100);
  const finalValue = Math.max(0, grossValue - depreciationAmount);

  return {
    area,
    costPerSqM,
    depreciationPercent: depPercent,
    grossValue,
    depreciationAmount,
    finalValue,
  };
}

export function calculateLandValue(land: { area: number; costPerSqM: number }) {
  const area = sanitizeNumber(land.area);
  const costPerSqM = sanitizeNumber(land.costPerSqM);
  const value = area * costPerSqM;
  return {
    area,
    costPerSqM,
    value,
  };
}

export function calculateRentalItem(item: {
  area: number;
  rentRatePerSqM: number;
  outgoingsPercent?: number;
  period?: 'annual' | 'monthly';
}) {
  const area = sanitizeNumber(item.area);
  const rate = sanitizeNumber(item.rentRatePerSqM);
  const outgoingsPercent = Math.min(100, sanitizeNumber(item.outgoingsPercent));
  const isMonthly = item.period === 'monthly';

  const grossValue = area * rate;
  const outgoingsAmount = grossValue * (outgoingsPercent / 100);
  const netValue = Math.max(0, grossValue - outgoingsAmount);

  const annualGrossValue = isMonthly ? grossValue * 12 : grossValue;
  const annualOutgoingsAmount = isMonthly ? outgoingsAmount * 12 : outgoingsAmount;
  const annualValue = isMonthly ? netValue * 12 : netValue;
  const monthlyValue = isMonthly ? netValue : netValue / 12;

  return {
    area,
    rentRatePerSqM: rate,
    outgoingsPercent,
    grossValue,
    outgoingsAmount,
    netValue,
    rawValue: grossValue,
    annualGrossValue,
    annualOutgoingsAmount,
    annualValue,
    monthlyValue,
  };
}

export function calculateValuationSummary(
  constructionVariables: ConstructionVariable[],
  land: LandData,
  rentalUnits: RentalUnit[]
): ValuationSummary {
  let constructionGrossTotal = 0;
  let constructionDepreciationTotal = 0;
  let constructionNetTotal = 0;
  let totalBuiltAreaSqM = 0;

  for (const item of constructionVariables) {
    const calc = calculateConstructionItem(item);
    constructionGrossTotal += calc.grossValue;
    constructionDepreciationTotal += calc.depreciationAmount;
    constructionNetTotal += calc.finalValue;
    totalBuiltAreaSqM += calc.area;
  }

  const landCalc = calculateLandValue(land);
  const landValueTotal = landCalc.value;

  const totalCapitalValue = constructionNetTotal + landValueTotal;

  let rentalGrossTotal = 0;
  let rentalOutgoingsTotal = 0;
  let rentalNetTotal = 0;
  let totalAnnualRentalValue = 0;
  let totalMonthlyRentalValue = 0;
  let totalLettableAreaSqM = 0;

  for (const unit of rentalUnits) {
    const calc = calculateRentalItem(unit);
    rentalGrossTotal += calc.annualGrossValue;
    rentalOutgoingsTotal += calc.annualOutgoingsAmount;
    rentalNetTotal += calc.annualValue;
    totalAnnualRentalValue += calc.annualValue;
    totalMonthlyRentalValue += calc.monthlyValue;
    totalLettableAreaSqM += calc.area;
  }

  const grossRentalYieldPercent =
    totalCapitalValue > 0
      ? (totalAnnualRentalValue / totalCapitalValue) * 100
      : 0;

  const averageCapitalPerSqM =
    totalBuiltAreaSqM > 0
      ? totalCapitalValue / totalBuiltAreaSqM
      : 0;

  return {
    constructionGrossTotal,
    constructionDepreciationTotal,
    constructionNetTotal,
    landValueTotal,
    totalCapitalValue,
    rentalGrossTotal,
    rentalOutgoingsTotal,
    rentalNetTotal,
    totalAnnualRentalValue,
    totalMonthlyRentalValue,
    grossRentalYieldPercent,
    totalBuiltAreaSqM,
    totalLettableAreaSqM,
    averageCapitalPerSqM,
  };
}

export function formatCurrency(
  value: number,
  currencyCode: string = 'NGN',
  locale: string = 'en-NG'
): string {
  const safeVal = isFinite(value) && !isNaN(value) ? value : 0;
  const hasDecimals = Math.abs(safeVal - Math.round(safeVal)) > 0.001;
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: hasDecimals ? 2 : 0,
      maximumFractionDigits: 2,
    }).format(safeVal);
  } catch {
    // Fallback if specific currency is not supported by current environment
    const matching = SUPPORTED_CURRENCIES.find((c) => c.code === currencyCode);
    const sym = matching ? matching.symbol : currencyCode;
    return `${sym}${safeVal.toLocaleString('en-US', {
      minimumFractionDigits: hasDecimals ? 2 : 0,
      maximumFractionDigits: 2,
    })}`;
  }
}
