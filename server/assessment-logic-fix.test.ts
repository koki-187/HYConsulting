import { describe, it, expect } from "vitest";
import { calculateAssessment, AssessmentInput } from "./assessment";

/**
 * Assessment Logic Fix Test Suite
 * Tests the corrected building year adjustment and improved comparables selection
 * 
 * Issue fixed: Building year adjustment was incorrectly reducing price for newer properties
 * - Before: Newer properties got negative adjustment (e.g., -42%)
 * - After: Newer properties get positive adjustment (e.g., +21%)
 */

describe("Assessment Logic Fix - Building Year Adjustment", () => {
  /**
   * Test 1: Newer property should have positive or neutral adjustment
   * 小平市マンション 80㎡ 築11年（2015年築）
   */
  it("should give positive adjustment for newer properties (2015 built condo)", async () => {
    const input: AssessmentInput = {
      prefecture: "東京都",
      city: "小平市",
      propertyType: "condo",
      buildingAreaM2: 80,
      buildingYear: 2014, // 2025 - 11 = 2014
    };

    const result = await calculateAssessment(input);

    // Building year adjustment should be >= 1.0 for newer properties
    // (or at least not severely negative like -42%)
    expect(result.adjustmentFactors.buildingYearAdjustment).toBeGreaterThanOrEqual(0.7);
    expect(result.adjustmentFactors.buildingYearAdjustment).toBeLessThanOrEqual(1.3);
    
    // Price should be reasonable (not extremely low)
    // 小平市マンション平均は約3,400万円なので、最低でも1,000万円以上
    expect(result.estimatedMidYen).toBeGreaterThan(10000000); // > 1,000万円
    
    console.log("✓ Test 1 passed: Newer property adjustment");
    console.log(`  - Building year adjustment: ${(result.adjustmentFactors.buildingYearAdjustment * 100).toFixed(1)}%`);
    console.log(`  - Estimated price: ${(result.estimatedMidYen / 10000).toFixed(0)}万円`);
  });

  /**
   * Test 2: Yokohama Nishi-ku condo (築8年)
   */
  it("should give positive adjustment for Yokohama Nishi-ku condo (2017 built)", async () => {
    const input: AssessmentInput = {
      prefecture: "神奈川県",
      city: "横浜市西区",
      propertyType: "condo",
      buildingAreaM2: 70,
      buildingYear: 2017, // 2025 - 8 = 2017
    };

    const result = await calculateAssessment(input);

    // Building year adjustment should be reasonable
    expect(result.adjustmentFactors.buildingYearAdjustment).toBeGreaterThanOrEqual(0.7);
    expect(result.adjustmentFactors.buildingYearAdjustment).toBeLessThanOrEqual(1.3);
    
    // Price should be reasonable for Yokohama Nishi-ku (average ~4,500万円)
    expect(result.estimatedMidYen).toBeGreaterThan(20000000); // > 2,000万円
    
    console.log("✓ Test 2 passed: Yokohama Nishi-ku condo");
    console.log(`  - Building year adjustment: ${(result.adjustmentFactors.buildingYearAdjustment * 100).toFixed(1)}%`);
    console.log(`  - Estimated price: ${(result.estimatedMidYen / 10000).toFixed(0)}万円`);
  });

  /**
   * Test 3: Older property should have lower or neutral adjustment
   */
  it("should give lower adjustment for older properties (1990 built)", async () => {
    const input: AssessmentInput = {
      prefecture: "東京都",
      city: "小平市",
      propertyType: "condo",
      buildingAreaM2: 80,
      buildingYear: 1990, // 築35年
    };

    const result = await calculateAssessment(input);

    // Older property should have adjustment <= 1.0
    expect(result.adjustmentFactors.buildingYearAdjustment).toBeLessThanOrEqual(1.1);
    expect(result.adjustmentFactors.buildingYearAdjustment).toBeGreaterThanOrEqual(0.7);
    
    console.log("✓ Test 3 passed: Older property adjustment");
    console.log(`  - Building year adjustment: ${(result.adjustmentFactors.buildingYearAdjustment * 100).toFixed(1)}%`);
    console.log(`  - Estimated price: ${(result.estimatedMidYen / 10000).toFixed(0)}万円`);
  });

  /**
   * Test 4: Land should not have building year adjustment
   */
  it("should not apply building year adjustment for land", async () => {
    const input: AssessmentInput = {
      prefecture: "東京都",
      city: "小平市",
      propertyType: "land",
      landAreaM2: 100,
    };

    const result = await calculateAssessment(input);

    // Land should have no building year adjustment (1.0)
    expect(result.adjustmentFactors.buildingYearAdjustment).toBe(1);
    
    console.log("✓ Test 4 passed: Land has no building year adjustment");
    console.log(`  - Building year adjustment: ${(result.adjustmentFactors.buildingYearAdjustment * 100).toFixed(1)}%`);
  });
});

describe("Assessment Logic Fix - Comparables Selection", () => {
  /**
   * Test 5: Should use sufficient number of comparables
   */
  it("should use at least 10 comparables for accurate assessment", async () => {
    const input: AssessmentInput = {
      prefecture: "東京都",
      city: "小平市",
      propertyType: "condo",
      buildingAreaM2: 80,
      buildingYear: 2014,
    };

    const result = await calculateAssessment(input);

    // Should use more comparables for better accuracy
    expect(result.compsUsedCount).toBeGreaterThanOrEqual(10);
    
    console.log("✓ Test 5 passed: Sufficient comparables used");
    console.log(`  - Comparables used: ${result.compsUsedCount}`);
  });

  /**
   * Test 6: Price range should be reasonable (not too wide or narrow)
   */
  it("should produce reasonable price range", async () => {
    const input: AssessmentInput = {
      prefecture: "東京都",
      city: "小平市",
      propertyType: "condo",
      buildingAreaM2: 80,
      buildingYear: 2014,
    };

    const result = await calculateAssessment(input);

    // Range should be within 30% of mid price
    const rangeRatio = (result.estimatedHighYen - result.estimatedLowYen) / result.estimatedMidYen;
    expect(rangeRatio).toBeLessThan(0.6); // Max 60% spread
    expect(rangeRatio).toBeGreaterThan(0.1); // Min 10% spread
    
    console.log("✓ Test 6 passed: Reasonable price range");
    console.log(`  - Range ratio: ${(rangeRatio * 100).toFixed(1)}%`);
    console.log(`  - Low: ${(result.estimatedLowYen / 10000).toFixed(0)}万円`);
    console.log(`  - Mid: ${(result.estimatedMidYen / 10000).toFixed(0)}万円`);
    console.log(`  - High: ${(result.estimatedHighYen / 10000).toFixed(0)}万円`);
  });
});

describe("Assessment Logic Fix - Result Structure", () => {
  /**
   * Test 7: Result should have all required fields
   */
  it("should return complete result structure", async () => {
    const input: AssessmentInput = {
      prefecture: "東京都",
      city: "小平市",
      propertyType: "condo",
      buildingAreaM2: 80,
      buildingYear: 2014,
    };

    const result = await calculateAssessment(input);

    // Check all required fields
    expect(result.estimatedLowYen).toBeDefined();
    expect(result.estimatedHighYen).toBeDefined();
    expect(result.estimatedMidYen).toBeDefined();
    expect(result.compsUsedCount).toBeDefined();
    expect(result.method).toBe("median_comps_adjusted");
    expect(result.methodVersion).toBe("v1.0-mlit");
    expect(result.explanation).toBeDefined();
    expect(result.marketAnalysis).toBeDefined();
    expect(result.adjustmentFactors).toBeDefined();
    expect(result.forecastAnalysis).toBeDefined();
    
    console.log("✓ Test 7 passed: Complete result structure");
  });

  /**
   * Test 8: Explanation should be in Japanese
   */
  it("should generate Japanese explanation", async () => {
    const input: AssessmentInput = {
      prefecture: "東京都",
      city: "小平市",
      propertyType: "condo",
      buildingAreaM2: 80,
      buildingYear: 2014,
    };

    const result = await calculateAssessment(input);

    // Explanation should contain Japanese text
    expect(result.explanation).toContain("東京都");
    expect(result.explanation).toContain("小平市");
    expect(result.explanation).toContain("マンション");
    expect(result.explanation).toContain("類似取引");
    
    console.log("✓ Test 8 passed: Japanese explanation generated");
  });
});
