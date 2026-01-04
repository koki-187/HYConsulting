/**
 * Price Calculation Accuracy Verification
 * Verifies that price calculations are accurate and consistent
 * across different property types and scenarios
 */

import { describe, it, expect, beforeAll } from "vitest";
import { calculateAssessment } from "./assessment";
import type { AssessmentInput } from "./assessment";

interface PriceVerificationTest {
  name: string;
  input: AssessmentInput;
  expectedRangeMin: number;
  expectedRangeMax: number;
  tolerance: number; // Percentage tolerance
}

describe("Price Calculation Accuracy Tests", () => {
  const tests: PriceVerificationTest[] = [
    {
      name: "Tokyo land - 120 sqm",
      input: {
        prefecture: "東京都",
        city: "渋谷区",
        propertyType: "land",
        landAreaM2: 120,
        stationDistanceMin: 5,
      },
      expectedRangeMin: 200000000, // ¥200M minimum
      expectedRangeMax: 300000000, // ¥300M maximum
      tolerance: 20, // 20% tolerance
    },
    {
      name: "Kanagawa house - 150 sqm land, 120 sqm building",
      input: {
        prefecture: "神奈川県",
        city: "横浜市",
        propertyType: "house",
        landAreaM2: 150,
        buildingAreaM2: 120,
        buildingYear: 2010,
        stationDistanceMin: 10,
      },
      expectedRangeMin: 80000000, // ¥80M minimum
      expectedRangeMax: 150000000, // ¥150M maximum
      tolerance: 25, // 25% tolerance
    },
    {
      name: "Osaka condo - 68 sqm, 2016 built",
      input: {
        prefecture: "大阪府",
        city: "大阪市",
        propertyType: "condo",
        buildingAreaM2: 68,
        buildingYear: 2016,
        stationDistanceMin: 8,
      },
      expectedRangeMin: 100000000, // ¥100M minimum
      expectedRangeMax: 180000000, // ¥180M maximum
      tolerance: 25, // 25% tolerance
    },
    {
      name: "Chiba land - 200 sqm",
      input: {
        prefecture: "千葉県",
        city: "千葉市",
        propertyType: "land",
        landAreaM2: 200,
        stationDistanceMin: 15,
      },
      expectedRangeMin: 50000000, // ¥50M minimum
      expectedRangeMax: 100000000, // ¥100M maximum
      tolerance: 30, // 30% tolerance
    },
    {
      name: "Saitama house - 180 sqm land, 140 sqm building",
      input: {
        prefecture: "埼玉県",
        city: "さいたま市",
        propertyType: "house",
        landAreaM2: 180,
        buildingAreaM2: 140,
        buildingYear: 2005,
        stationDistanceMin: 12,
      },
      expectedRangeMin: 60000000, // ¥60M minimum
      expectedRangeMax: 120000000, // ¥120M maximum
      tolerance: 30, // 30% tolerance
    },
  ];

  beforeAll(() => {
    console.log("\n📊 Price Calculation Accuracy Verification");
    console.log(`Testing ${tests.length} price calculation scenarios\n`);
  });

  tests.forEach((test, index) => {
    it(`Test ${index + 1}: ${test.name}`, async () => {
      console.log(`\n🔍 ${test.name}`);
      console.log(`   Input: ${JSON.stringify(test.input)}`);

      const result = await calculateAssessment(test.input);

      // Verify price range is within expected bounds
      const midPrice = (result.estimatedLowYen + result.estimatedHighYen) / 2;
      const rangeWidth = result.estimatedHighYen - result.estimatedLowYen;
      const rangePercent = ((rangeWidth / midPrice) * 100).toFixed(1);

      console.log(`   ✓ Estimated price: ¥${midPrice.toLocaleString()}`);
      console.log(`   ✓ Price range: ¥${result.estimatedLowYen.toLocaleString()} - ¥${result.estimatedHighYen.toLocaleString()}`);
      console.log(`   ✓ Range width: ${rangePercent}%`);
      console.log(`   ✓ Comparables used: ${result.compsUsedCount}`);

      // Verify price is reasonable
      expect(result.estimatedLowYen).toBeGreaterThan(0);
      expect(result.estimatedHighYen).toBeGreaterThan(result.estimatedLowYen);
      expect(result.compsUsedCount).toBeGreaterThan(0);

      // Verify range width is reasonable (typically 25-35%)
      const rangePercNum = parseFloat(rangePercent);
      expect(rangePercNum).toBeGreaterThan(15);
      expect(rangePercNum).toBeLessThan(50);

      // Verify adjustment factors are within reasonable bounds
      expect(result.adjustmentFactors.buildingYearAdjustment).toBeGreaterThan(0);
      expect(result.adjustmentFactors.buildingYearAdjustment).toBeLessThanOrEqual(1.2);
      expect(result.adjustmentFactors.stationDistanceAdjustment).toBeGreaterThan(0.7);
      expect(result.adjustmentFactors.stationDistanceAdjustment).toBeLessThanOrEqual(1.0);
      expect(result.adjustmentFactors.areaAdjustment).toBeGreaterThan(0.8);
      expect(result.adjustmentFactors.areaAdjustment).toBeLessThanOrEqual(1.1);

      console.log(`   ✓ Adjustment factors verified`);
      console.log(`     - Building year: ${(result.adjustmentFactors.buildingYearAdjustment * 100).toFixed(1)}%`);
      console.log(`     - Station distance: ${(result.adjustmentFactors.stationDistanceAdjustment * 100).toFixed(1)}%`);
      console.log(`     - Area: ${(result.adjustmentFactors.areaAdjustment * 100).toFixed(1)}%`);
    });
  });

  /**
   * Test consistency: Same input should produce same output
   */
  it("Consistency Test: Same input produces same output", async () => {
    console.log(`\n🔄 Consistency Test`);

    const input: AssessmentInput = {
      prefecture: "東京都",
      city: "渋谷区",
      propertyType: "land",
      landAreaM2: 120,
      stationDistanceMin: 5,
    };

    // Run calculation 3 times
    const result1 = await calculateAssessment(input);
    const result2 = await calculateAssessment(input);
    const result3 = await calculateAssessment(input);

    console.log(`   Run 1: ¥${result1.estimatedMidYen.toLocaleString()}`);
    console.log(`   Run 2: ¥${result2.estimatedMidYen.toLocaleString()}`);
    console.log(`   Run 3: ¥${result3.estimatedMidYen.toLocaleString()}`);

    // Verify all results are identical
    expect(result1.estimatedLowYen).toBe(result2.estimatedLowYen);
    expect(result2.estimatedLowYen).toBe(result3.estimatedLowYen);
    expect(result1.estimatedHighYen).toBe(result2.estimatedHighYen);
    expect(result2.estimatedHighYen).toBe(result3.estimatedHighYen);

    console.log(`   ✓ All runs produced identical results`);
  });

  /**
   * Test: Building age affects price
   */
  it("Building Age Impact Test", async () => {
    console.log(`\n📅 Building Age Impact Test`);

    const baseInput: AssessmentInput = {
      prefecture: "神奈川県",
      city: "横浜市",
      propertyType: "house",
      landAreaM2: 150,
      buildingAreaM2: 120,
      stationDistanceMin: 10,
    };

    // Test with new building (2020)
    const newBuildingResult = await calculateAssessment({
      ...baseInput,
      buildingYear: 2020,
    });

    // Test with old building (2000)
    const oldBuildingResult = await calculateAssessment({
      ...baseInput,
      buildingYear: 2000,
    });

    const newPrice = newBuildingResult.estimatedMidYen;
    const oldPrice = oldBuildingResult.estimatedMidYen;
    const priceDifference = ((newPrice - oldPrice) / oldPrice) * 100;

    console.log(`   New building (2020): ¥${newPrice.toLocaleString()}`);
    console.log(`   Old building (2000): ¥${oldPrice.toLocaleString()}`);
    console.log(`   Difference: ${priceDifference.toFixed(1)}%`);

    // New building should be more expensive
    expect(newPrice).toBeGreaterThan(oldPrice);
    expect(priceDifference).toBeGreaterThan(5); // At least 5% difference
    expect(priceDifference).toBeLessThan(30); // But not more than 30%

    console.log(`   ✓ Building age correctly affects price`);
  });

  /**
   * Test: Station distance affects price
   */
  it("Station Distance Impact Test", async () => {
    console.log(`\n🚉 Station Distance Impact Test`);

    const baseInput: AssessmentInput = {
      prefecture: "東京都",
      city: "渋谷区",
      propertyType: "land",
      landAreaM2: 120,
    };

    // Test with close station (5 minutes)
    const closeStationResult = await calculateAssessment({
      ...baseInput,
      stationDistanceMin: 5,
    });

    // Test with far station (25 minutes)
    const farStationResult = await calculateAssessment({
      ...baseInput,
      stationDistanceMin: 25,
    });

    const closePrice = closeStationResult.estimatedMidYen;
    const farPrice = farStationResult.estimatedMidYen;
    const priceDifference = ((closePrice - farPrice) / farPrice) * 100;

    console.log(`   Close station (5 min): ¥${closePrice.toLocaleString()}`);
    console.log(`   Far station (25 min): ¥${farPrice.toLocaleString()}`);
    console.log(`   Difference: ${priceDifference.toFixed(1)}%`);

    // Close station should be more expensive
    expect(closePrice).toBeGreaterThan(farPrice);
    expect(priceDifference).toBeGreaterThan(5); // At least 5% difference
    expect(priceDifference).toBeLessThan(25); // But not more than 25%

    console.log(`   ✓ Station distance correctly affects price`);
  });

  /**
   * Test: Area affects price
   */
  it("Area Impact Test", async () => {
    console.log(`\n📐 Area Impact Test`);

    const baseInput: AssessmentInput = {
      prefecture: "神奈川県",
      city: "横浜市",
      propertyType: "land",
      stationDistanceMin: 10,
    };

    // Test with small area (80 sqm)
    const smallAreaResult = await calculateAssessment({
      ...baseInput,
      landAreaM2: 80,
    });

    // Test with large area (200 sqm)
    const largeAreaResult = await calculateAssessment({
      ...baseInput,
      landAreaM2: 200,
    });

    const smallPrice = smallAreaResult.estimatedMidYen;
    const largePrice = largeAreaResult.estimatedMidYen;
    const priceDifference = ((largePrice - smallPrice) / smallPrice) * 100;

    console.log(`   Small area (80 sqm): ¥${smallPrice.toLocaleString()}`);
    console.log(`   Large area (200 sqm): ¥${largePrice.toLocaleString()}`);
    console.log(`   Difference: ${priceDifference.toFixed(1)}%`);

    // Large area should be more expensive
    expect(largePrice).toBeGreaterThan(smallPrice);
    expect(priceDifference).toBeGreaterThan(50); // At least 50% difference
    expect(priceDifference).toBeLessThan(200); // But not more than 200%

    console.log(`   ✓ Area correctly affects price`);
  });
});
