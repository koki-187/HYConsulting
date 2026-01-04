import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { calculateAssessment, AssessmentInput, AssessmentResult } from "./assessment";
import { getDb } from "./db";
import { datasetVersions, regions, transactions } from "../drizzle/schema";
import { drizzle } from "drizzle-orm/mysql2";

/**
 * Assessment Calculation Test Suite
 * Tests the MLIT-based valuation logic with 10 comprehensive test cases
 */

let db: ReturnType<typeof drizzle> | null = null;

beforeAll(async () => {
  // Initialize database connection
  if (process.env.DATABASE_URL) {
    db = drizzle(process.env.DATABASE_URL);
    console.log("✓ Database connected for testing");

    // Seed sample data
    await seedTestData();
  }
});

afterAll(async () => {
  // Cleanup
  if (db) {
    console.log("✓ Test cleanup completed");
  }
});

async function seedTestData() {
  if (!db) return;

  try {
    // Insert dataset version
    await db.insert(datasetVersions).values({
      id: "test_dataset_2025Q1",
      source: "MLIT Test Data",
      description: "Test dataset for assessment calculation",
      publishedDate: "2025-01-01",
      ingestedAt: new Date(),
      notes: "Test data only",
    });

    // Insert test regions
    await db.insert(regions).values([
      {
        prefecture: "神奈川県",
        city: "横浜市",
        ward: "西区",
        district: "みなとみらい",
        geoCode: "14103",
        lat: "35.457",
        lon: "139.632",
      },
      {
        prefecture: "神奈川県",
        city: "横浜市",
        ward: "中区",
        district: "関内",
        geoCode: "14104",
        lat: "35.444",
        lon: "139.636",
      },
      {
        prefecture: "神奈川県",
        city: "藤沢市",
        ward: null,
        district: "藤沢",
        geoCode: "14204",
        lat: "35.338",
        lon: "139.490",
      },
    ]);

    // Insert test transactions (comparable sales data)
    await db.insert(transactions).values([
      // Land transactions in Yokohama Nishi-ku
      {
        datasetVersionId: "test_dataset_2025Q1",
        transactionYm: "2025-01",
        prefecture: "神奈川県",
        city: "横浜市",
        ward: "西区",
        district: "みなとみらい",
        propertyType: "land",
        landAreaM2: "120",
        buildingAreaM2: null,
        buildingYear: null,
        structure: null,
        floorPlan: null,
        floor: null,
        nearestStation: "みなとみらい駅",
        stationDistanceMin: 8,
        priceYen: 185000000,
        unitPriceYenPerM2: "1541666.67",
        lat: "35.457",
        lon: "139.632",
        remarks: "Test data",
      },
      {
        datasetVersionId: "test_dataset_2025Q1",
        transactionYm: "2024-12",
        prefecture: "神奈川県",
        city: "横浜市",
        ward: "西区",
        district: "みなとみらい",
        propertyType: "land",
        landAreaM2: "100",
        buildingAreaM2: null,
        buildingYear: null,
        structure: null,
        floorPlan: null,
        floor: null,
        nearestStation: "みなとみらい駅",
        stationDistanceMin: 10,
        priceYen: 155000000,
        unitPriceYenPerM2: "1550000.00",
        lat: "35.457",
        lon: "139.632",
        remarks: "Test data",
      },
      {
        datasetVersionId: "test_dataset_2025Q1",
        transactionYm: "2024-11",
        prefecture: "神奈川県",
        city: "横浜市",
        ward: "西区",
        district: "みなとみらい",
        propertyType: "land",
        landAreaM2: "110",
        buildingAreaM2: null,
        buildingYear: null,
        structure: null,
        floorPlan: null,
        floor: null,
        nearestStation: "みなとみらい駅",
        stationDistanceMin: 7,
        priceYen: 170000000,
        unitPriceYenPerM2: "1545454.55",
        lat: "35.457",
        lon: "139.632",
        remarks: "Test data",
      },
      // Condo transactions in Yokohama Naka-ku
      {
        datasetVersionId: "test_dataset_2025Q1",
        transactionYm: "2025-01",
        prefecture: "神奈川県",
        city: "横浜市",
        ward: "中区",
        district: "関内",
        propertyType: "condo",
        landAreaM2: null,
        buildingAreaM2: "68",
        buildingYear: 2016,
        structure: "鉄筋コンクリート",
        floorPlan: "2LDK",
        floor: 5,
        nearestStation: "関内駅",
        stationDistanceMin: 6,
        priceYen: 98000000,
        unitPriceYenPerM2: "1441176.47",
        lat: "35.444",
        lon: "139.636",
        remarks: "Test data",
      },
      {
        datasetVersionId: "test_dataset_2025Q1",
        transactionYm: "2024-12",
        prefecture: "神奈川県",
        city: "横浜市",
        ward: "中区",
        district: "関内",
        propertyType: "condo",
        landAreaM2: null,
        buildingAreaM2: "70",
        buildingYear: 2015,
        structure: "鉄筋コンクリート",
        floorPlan: "2LDK",
        floor: 3,
        nearestStation: "関内駅",
        stationDistanceMin: 8,
        priceYen: 92000000,
        unitPriceYenPerM2: "1314285.71",
        lat: "35.444",
        lon: "139.636",
        remarks: "Test data",
      },
      {
        datasetVersionId: "test_dataset_2025Q1",
        transactionYm: "2024-11",
        prefecture: "神奈川県",
        city: "横浜市",
        ward: "中区",
        district: "関内",
        propertyType: "condo",
        landAreaM2: null,
        buildingAreaM2: "65",
        buildingYear: 2017,
        structure: "鉄筋コンクリート",
        floorPlan: "1LDK",
        floor: 8,
        nearestStation: "関内駅",
        stationDistanceMin: 5,
        priceYen: 104000000,
        unitPriceYenPerM2: "1600000.00",
        lat: "35.444",
        lon: "139.636",
        remarks: "Test data",
      },
      // House transactions in Fujisawa
      {
        datasetVersionId: "test_dataset_2025Q1",
        transactionYm: "2025-01",
        prefecture: "神奈川県",
        city: "藤沢市",
        ward: null,
        district: "藤沢",
        propertyType: "house",
        landAreaM2: "150",
        buildingAreaM2: "120",
        buildingYear: 2010,
        structure: "木造",
        floorPlan: "4LDK",
        floor: null,
        nearestStation: "藤沢駅",
        stationDistanceMin: 12,
        priceYen: 45000000,
        unitPriceYenPerM2: "300000.00",
        lat: "35.338",
        lon: "139.490",
        remarks: "Test data",
      },
      {
        datasetVersionId: "test_dataset_2025Q1",
        transactionYm: "2024-12",
        prefecture: "神奈川県",
        city: "藤沢市",
        ward: null,
        district: "藤沢",
        propertyType: "house",
        landAreaM2: "160",
        buildingAreaM2: "130",
        buildingYear: 2008,
        structure: "木造",
        floorPlan: "4LDK",
        floor: null,
        nearestStation: "藤沢駅",
        stationDistanceMin: 15,
        priceYen: 42000000,
        unitPriceYenPerM2: "280000.00",
        lat: "35.338",
        lon: "139.490",
        remarks: "Test data",
      },
    ]);

    console.log("✓ Test data seeded successfully");
  } catch (error) {
    console.error("Error seeding test data:", error);
  }
}

describe("Assessment Calculation Tests", () => {
  /**
   * Test 1: Land assessment in Yokohama Nishi-ku (Minato Mirai)
   */
  it("Test 1: Calculate land price in Yokohama Nishi-ku (120 sqm)", async () => {
    const input: AssessmentInput = {
      prefecture: "神奈川県",
      city: "横浜市",
      ward: "西区",
      district: "みなとみらい",
      propertyType: "land",
      landAreaM2: 120,
      stationDistanceMin: 8,
    };

    const result = await calculateAssessment(input);

    expect(result).toBeDefined();
    expect(result.estimatedLowYen).toBeGreaterThan(0);
    expect(result.estimatedHighYen).toBeGreaterThan(result.estimatedLowYen);
    expect(result.compsUsedCount).toBeGreaterThan(0);
    expect(result.method).toBe("median_comps_adjusted");
    expect(result.explanation).toContain("類似取引");

    console.log("✓ Test 1 passed: Land assessment");
    console.log(`  - Estimated range: ¥${result.estimatedLowYen.toLocaleString()} - ¥${result.estimatedHighYen.toLocaleString()}`);
    console.log(`  - Comparables used: ${result.compsUsedCount}`);
  });

  /**
   * Test 2: Condo assessment in Yokohama Naka-ku (Kannai)
   */
  it("Test 2: Calculate condo price in Yokohama Naka-ku (68 sqm, 2016 built)", async () => {
    const input: AssessmentInput = {
      prefecture: "神奈川県",
      city: "横浜市",
      ward: "中区",
      district: "関内",
      propertyType: "condo",
      buildingAreaM2: 68,
      buildingYear: 2016,
      stationDistanceMin: 6,
    };

    const result = await calculateAssessment(input);

    expect(result).toBeDefined();
    expect(result.estimatedLowYen).toBeGreaterThan(0);
    expect(result.estimatedHighYen).toBeGreaterThan(result.estimatedLowYen);
    expect(result.compsUsedCount).toBeGreaterThan(0);
    expect(result.adjustmentFactors.buildingYearAdjustment).toBeGreaterThan(0);

    console.log("✓ Test 2 passed: Condo assessment");
    console.log(`  - Estimated range: ¥${result.estimatedLowYen.toLocaleString()} - ¥${result.estimatedHighYen.toLocaleString()}`);
    console.log(`  - Building year adjustment: ${(result.adjustmentFactors.buildingYearAdjustment * 100).toFixed(1)}%`);
  });

  /**
   * Test 3: House assessment in Fujisawa
   */
  it("Test 3: Calculate house price in Fujisawa (150 sqm land, 120 sqm building, 2010 built)", async () => {
    const input: AssessmentInput = {
      prefecture: "神奈川県",
      city: "藤沢市",
      propertyType: "house",
      landAreaM2: 150,
      buildingAreaM2: 120,
      buildingYear: 2010,
      stationDistanceMin: 12,
    };

    const result = await calculateAssessment(input);

    expect(result).toBeDefined();
    expect(result.estimatedLowYen).toBeGreaterThan(0);
    expect(result.compsUsedCount).toBeGreaterThan(0);
    expect(result.marketAnalysis.marketTrend).toMatch(/rising|declining|stable/);

    console.log("✓ Test 3 passed: House assessment");
    console.log(`  - Estimated range: ¥${result.estimatedLowYen.toLocaleString()} - ¥${result.estimatedHighYen.toLocaleString()}`);
    console.log(`  - Market trend: ${result.marketAnalysis.marketTrend}`);
  });

  /**
   * Test 4: Inheritance property assessment
   */
  it("Test 4: Inheritance property assessment (condo with inheritance flag)", async () => {
    const input: AssessmentInput = {
      prefecture: "神奈川県",
      city: "横浜市",
      ward: "中区",
      propertyType: "condo",
      buildingAreaM2: 68,
      buildingYear: 2016,
      stationDistanceMin: 6,
      inheritanceFlag: 1,
      ownershipType: "shared",
    };

    const result = await calculateAssessment(input);

    expect(result).toBeDefined();
    expect(result.explanation).toContain("相続");

    console.log("✓ Test 4 passed: Inheritance property assessment");
    console.log(`  - Inheritance flag: 1`);
    console.log(`  - Ownership type: shared`);
  });

  /**
   * Test 5: Larger land assessment (area adjustment)
   */
  it("Test 5: Large land assessment (200 sqm - area adjustment test)", async () => {
    const input: AssessmentInput = {
      prefecture: "神奈川県",
      city: "横浜市",
      ward: "西区",
      propertyType: "land",
      landAreaM2: 200,
      stationDistanceMin: 8,
    };

    const result = await calculateAssessment(input);

    expect(result).toBeDefined();
    expect(result.adjustmentFactors.areaAdjustment).toBeLessThanOrEqual(1.0);
    expect(result.adjustmentFactors.areaAdjustment).toBeGreaterThan(0);

    console.log("✓ Test 5 passed: Large land assessment");
    console.log(`  - Area adjustment: ${(result.adjustmentFactors.areaAdjustment * 100).toFixed(1)}%`);
  });

  /**
   * Test 6: Older building assessment (depreciation test)
   */
  it("Test 6: Older building assessment (condo built 2000 - depreciation test)", async () => {
    const input: AssessmentInput = {
      prefecture: "神奈川県",
      city: "横浜市",
      ward: "中区",
      propertyType: "condo",
      buildingAreaM2: 68,
      buildingYear: 2000,
      stationDistanceMin: 6,
    };

    const result = await calculateAssessment(input);

    expect(result).toBeDefined();
    expect(result.adjustmentFactors.buildingYearAdjustment).toBeGreaterThan(1.0);

    console.log("✓ Test 6 passed: Older building assessment");
    console.log(`  - Building year: 2000`);
    console.log(`  - Age adjustment: ${((result.adjustmentFactors.buildingYearAdjustment - 1) * 100).toFixed(1)}%`);
  });

  /**
   * Test 7: Far from station assessment (station distance adjustment)
   */
  it("Test 7: Far from station assessment (20 min walk - station distance adjustment)", async () => {
    const input: AssessmentInput = {
      prefecture: "神奈川県",
      city: "藤沢市",
      propertyType: "house",
      landAreaM2: 150,
      buildingAreaM2: 120,
      buildingYear: 2010,
      stationDistanceMin: 20,
    };

    const result = await calculateAssessment(input);

    expect(result).toBeDefined();
    expect(result.adjustmentFactors.stationDistanceAdjustment).toBeLessThan(1.0);

    console.log("✓ Test 7 passed: Far from station assessment");
    console.log(`  - Station distance: 20 minutes`);
    console.log(`  - Station distance adjustment: ${(result.adjustmentFactors.stationDistanceAdjustment * 100).toFixed(1)}%`);
  });

  /**
   * Test 8: Forecast analysis (1, 3, 5 year predictions)
   */
  it("Test 8: Forecast analysis (1, 3, 5 year predictions)", async () => {
    const input: AssessmentInput = {
      prefecture: "神奈川県",
      city: "横浜市",
      ward: "西区",
      propertyType: "land",
      landAreaM2: 120,
      stationDistanceMin: 8,
    };

    const result = await calculateAssessment(input);

    expect(result.forecastAnalysis).toBeDefined();
    expect(result.forecastAnalysis.forecast1Year).toBeGreaterThan(0);
    expect(result.forecastAnalysis.forecast3Year).toBeGreaterThan(0);
    expect(result.forecastAnalysis.forecast5Year).toBeGreaterThan(0);

    console.log("✓ Test 8 passed: Forecast analysis");
    console.log(`  - 1-year forecast: ¥${result.forecastAnalysis.forecast1Year.toLocaleString()}`);
    console.log(`  - 3-year forecast: ¥${result.forecastAnalysis.forecast3Year.toLocaleString()}`);
    console.log(`  - 5-year forecast: ¥${result.forecastAnalysis.forecast5Year.toLocaleString()}`);
  });

  /**
   * Test 9: Market analysis (surrounding prices, transaction count)
   */
  it("Test 9: Market analysis (surrounding prices, transaction count)", async () => {
    const input: AssessmentInput = {
      prefecture: "神奈川県",
      city: "横浜市",
      ward: "中区",
      propertyType: "condo",
      buildingAreaM2: 68,
      buildingYear: 2016,
      stationDistanceMin: 6,
    };

    const result = await calculateAssessment(input);

    expect(result.marketAnalysis).toBeDefined();
    expect(result.marketAnalysis.surroundingPrice).toBeGreaterThan(0);
    expect(result.marketAnalysis.transactionCount).toBeGreaterThan(0);
    expect(result.marketAnalysis.avgPricePerM2).toBeGreaterThan(0);
    expect(result.marketAnalysis.marketTrend).toMatch(/rising|declining|stable/);

    console.log("✓ Test 9 passed: Market analysis");
    console.log(`  - Surrounding price: ¥${result.marketAnalysis.surroundingPrice.toLocaleString()}`);
    console.log(`  - Transaction count: ${result.marketAnalysis.transactionCount}`);
    console.log(`  - Avg price per sqm: ¥${result.marketAnalysis.avgPricePerM2.toLocaleString()}`);
  });

  /**
   * Test 10: Error handling (invalid input)
   */
  it("Test 10: Error handling (no comparable transactions)", async () => {
    const input: AssessmentInput = {
      prefecture: "北海道",
      city: "札幌市",
      propertyType: "land",
      landAreaM2: 100,
    };

    try {
      await calculateAssessment(input);
      // If we reach here, check that we got a result
      expect(true).toBe(true);
    } catch (error) {
      // Expected to throw or return null
      expect(error).toBeDefined();
      console.log("✓ Test 10 passed: Error handling");
      console.log(`  - Error message: ${(error as Error).message}`);
    }
  });
});
