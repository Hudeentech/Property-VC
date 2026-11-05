import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateConstructionItem,
  calculateLandValue,
  calculateRentalItem,
  calculateValuationSummary,
  formatCurrency,
} from './calculator.ts';

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

test('calculateRentalItem computes gross, outgoings, and net rental value correctly', () => {
  const result = calculateRentalItem({
    area: 165.018,
    rentRatePerSqM: 30000,
    outgoingsPercent: 10,
    period: 'annual',
  });
  assert.equal(result.grossValue, 4950540);
  assert.equal(result.outgoingsAmount, 495054);
  assert.equal(result.netValue, 4455486);
  assert.equal(result.annualValue, 4455486);
});

test('calculateValuationSummary aggregates capital, rental, and yield', () => {
  const construction = [
    { id: '1', title: 'Main Building', area: 200, costPerSqM: 100000, depreciationPercent: 10 }, // 20M - 2M = 18M
    { id: '2', title: 'Security Post', area: 50, costPerSqM: 40000, depreciationPercent: 0 },   // 2M - 0 = 2M
  ];
  const land = { title: 'Main Land', area: 400, costPerSqM: 25000 }; // 10M
  const rentals = [
    { id: 'r1', title: 'Main Building', area: 200, rentRatePerSqM: 15000, outgoingsPercent: 10, period: 'annual' as const }, // Gross 3M, Outgoings 300k, Net 2.7M
  ];

  const summary = calculateValuationSummary(construction, land, rentals);
  assert.equal(summary.constructionNetTotal, 20000000);
  assert.equal(summary.landValueTotal, 10000000);
  assert.equal(summary.totalCapitalValue, 30000000);
  assert.equal(summary.rentalGrossTotal, 3000000);
  assert.equal(summary.rentalOutgoingsTotal, 300000);
  assert.equal(summary.rentalNetTotal, 2700000);
  assert.equal(summary.totalAnnualRentalValue, 2700000);

  // Yield: 2.7M / 30M = 9%
  assert.equal(summary.grossRentalYieldPercent, 9);
});

test('formatCurrency formats values properly', () => {
  const formatted = formatCurrency(50000, 'NGN', 'en-NG');
  assert.ok(formatted.includes('50,000') || formatted.includes('50000'));
});
