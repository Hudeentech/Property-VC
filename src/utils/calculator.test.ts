import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateConstructionItem,
  calculateLandValue,
  calculateRentalItem,
  calculateValuationSummary,
  formatCurrency,
} from './calculator';

test('calculateConstructionItem computes gross, depreciation and final value', () => {
  const item = {
    area: 250,
    costPerSqM: 250000,
    depreciationPercent: 10,
  };
  const result = calculateConstructionItem(item);
  assert.equal(result.grossValue, 62500000);
  assert.equal(result.depreciationAmount, 6250000);
  assert.equal(result.finalValue, 56250000);
});

test('calculateConstructionItem handles 0% and 100% depreciation correctly', () => {
  const zeroDep = calculateConstructionItem({ area: 100, costPerSqM: 1000, depreciationPercent: 0 });
  assert.equal(zeroDep.grossValue, 100000);
  assert.equal(zeroDep.depreciationAmount, 0);
  assert.equal(zeroDep.finalValue, 100000);

  const fullDep = calculateConstructionItem({ area: 100, costPerSqM: 1000, depreciationPercent: 100 });
  assert.equal(fullDep.grossValue, 100000);
  assert.equal(fullDep.depreciationAmount, 100000);
  assert.equal(fullDep.finalValue, 0);
});

test('calculateLandValue computes area * cost', () => {
  const result = calculateLandValue({ area: 500, costPerSqM: 50000 });
  assert.equal(result.value, 25000000);
});

test('calculateRentalItem computes rental value correctly', () => {
  const result = calculateRentalItem({ area: 250, rentRatePerSqM: 10000, period: 'annual' });
  assert.equal(result.annualValue, 2500000);
  assert.equal(result.monthlyValue, 2500000 / 12);
});

test('calculateValuationSummary aggregates capital, rental, and yield', () => {
  const construction = [
    { id: '1', title: 'Main Building', area: 200, costPerSqM: 100000, depreciationPercent: 10 }, // 20M - 2M = 18M
    { id: '2', title: 'Security Post', area: 50, costPerSqM: 40000, depreciationPercent: 0 },   // 2M - 0 = 2M
  ];
  const land = { title: 'Main Land', area: 400, costPerSqM: 25000 }; // 10M
  const rentals = [
    { id: 'r1', title: 'Offices', area: 200, rentRatePerSqM: 15000, period: 'annual' as const }, // 3M
  ];

  const summary = calculateValuationSummary(construction, land, rentals);
  // Net construction: 18M + 2M = 20M
  // Land: 10M
  // Total capital: 30M
  assert.equal(summary.constructionNetTotal, 20000000);
  assert.equal(summary.landValueTotal, 10000000);
  assert.equal(summary.totalCapitalValue, 30000000);
  assert.equal(summary.totalAnnualRentalValue, 3000000);

  // Yield: 3M / 30M = 10%
  assert.equal(summary.grossRentalYieldPercent, 10);
});

test('formatCurrency formats values properly', () => {
  const formatted = formatCurrency(50000, 'NGN', 'en-NG');
  assert.ok(formatted.includes('50,000') || formatted.includes('50000'));
});
