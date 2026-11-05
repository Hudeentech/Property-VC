import { ConstructionVariable, LandData, RentalUnit } from '../types/valuation';

export interface ValuationScenario {
  id: string;
  name: string;
  description: string;
  currency: string;
  constructionVariables: ConstructionVariable[];
  land: LandData;
  rentalUnits: RentalUnit[];
}

export const EMPTY_DEFAULT_SCENARIO: ValuationScenario = {
  id: 'blank-property',
  name: 'Empty Valuation (Default)',
  description: 'Clean blank fields with helpful placeholders',
  currency: 'NGN',
  constructionVariables: [
    {
      id: 'var-init-1',
      title: '',
      area: 0,
      costPerSqM: 0,
      depreciationPercent: 0,
    },
    {
      id: 'var-init-2',
      title: '',
      area: 0,
      costPerSqM: 0,
      depreciationPercent: 0,
    },
  ],
  land: {
    title: '',
    area: 0,
    costPerSqM: 0,
  },
  rentalUnits: [
    {
      id: 'rent-init-1',
      title: '',
      area: 0,
      rentRatePerSqM: 0,
      outgoingsPercent: 0,
      period: 'annual',
    },
    {
      id: 'rent-init-2',
      title: '',
      area: 0,
      rentRatePerSqM: 0,
      outgoingsPercent: 0,
      period: 'annual',
    },
  ],
};

export const PRESET_SCENARIOS: ValuationScenario[] = [
  EMPTY_DEFAULT_SCENARIO,
  {
    id: 'commercial-sample',
    name: 'Sample: Commercial Property',
    description: 'Two construction components, land, and commercial rental components',
    currency: 'NGN',
    constructionVariables: [
      {
        id: 'var-1',
        title: 'Main Building',
        area: 250,
        costPerSqM: 250000,
        depreciationPercent: 10,
      },
      {
        id: 'var-2',
        title: 'Additional Component',
        area: 120,
        costPerSqM: 180000,
        depreciationPercent: 5,
      },
    ],
    land: {
      title: 'Land Value',
      area: 500,
      costPerSqM: 50000,
    },
    rentalUnits: [
      {
        id: 'rent-1',
        title: 'Main Building',
        area: 165.018,
        rentRatePerSqM: 30000,
        outgoingsPercent: 10,
        period: 'annual',
      },
      {
        id: 'rent-2',
        title: 'Additional Component',
        area: 120,
        rentRatePerSqM: 20000,
        outgoingsPercent: 10,
        period: 'annual',
      },
    ],
  },
  {
    id: 'residential-duplex',
    name: 'Sample: Residential Duplex',
    description: 'Residential main house, BQ quarters, security post and land',
    currency: 'NGN',
    constructionVariables: [
      {
        id: 'var-res-1',
        title: '5-Bedroom Main Duplex',
        area: 380,
        costPerSqM: 320000,
        depreciationPercent: 8,
      },
      {
        id: 'var-res-2',
        title: '2-Room Boys Quarters (BQ)',
        area: 65,
        costPerSqM: 200000,
        depreciationPercent: 12,
      },
    ],
    land: {
      title: 'Gated Estate Plot',
      area: 800,
      costPerSqM: 95000,
    },
    rentalUnits: [
      {
        id: 'rent-res-1',
        title: 'Main Building',
        area: 380,
        rentRatePerSqM: 25000,
        outgoingsPercent: 10,
        period: 'annual',
      },
      {
        id: 'rent-res-2',
        title: 'Boys Quarters (BQ)',
        area: 65,
        rentRatePerSqM: 15000,
        outgoingsPercent: 10,
        period: 'annual',
      },
    ],
  },
];
