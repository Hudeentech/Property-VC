export interface ConstructionVariable {
  id: string;
  title: string;
  area: number;
  costPerSqM: number;
  depreciationPercent: number;
}

export interface LandData {
  title: string;
  area: number;
  costPerSqM: number;
}

export interface RentalUnit {
  id: string;
  title: string;
  area: number;
  rentRatePerSqM: number;
  period?: 'annual' | 'monthly';
}

export interface CurrencyConfig {
  code: string;
  symbol: string;
  name: string;
  locale: string;
}

export interface ValuationSummary {
  constructionGrossTotal: number;
  constructionDepreciationTotal: number;
  constructionNetTotal: number;
  landValueTotal: number;
  totalCapitalValue: number;
  totalAnnualRentalValue: number;
  totalMonthlyRentalValue: number;
  grossRentalYieldPercent: number;
  totalBuiltAreaSqM: number;
  averageCapitalPerSqM: number;
}

export type ThemeMode = 'light' | 'dark';

export type ActiveTab = 'home' | 'rental' | 'capital' | 'history' | 'settings';

export interface ValuationHistoryItem {
  id: string;
  savedAt: string;
  type: 'rental' | 'capital' | 'full';
  label: string;
  currencyCode: string;
  constructionVariables: ConstructionVariable[];
  land: LandData;
  rentalUnits: RentalUnit[];
  summary: ValuationSummary;
}
