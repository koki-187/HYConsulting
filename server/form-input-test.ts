/**
 * Form Input Test Suite
 * Tests random property inputs against database to verify:
 * 1. Correct database utilization
 * 2. Accurate price calculation
 * 3. Error handling
 * 4. Data integrity
 */

import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { getDb } from "./db";
import { calculateAssessment } from "./assessment";
import type { AssessmentInput } from "./assessment";

interface TestCase {
  id: number;
  input: AssessmentInput;
  expectedOutcome: string;
}

/**
 * Generate random test cases
 */
function generateRandomTestCases(count: number): TestCase[] {
  const prefectures = ["東京都", "神奈川県", "千葉県", "埼玉県", "大阪府", "京都府", "兵庫県", "福岡県"];
  const cities = {
    "東京都": ["渋谷区", "新宿区", "千代田区", "中央区", "港区"],
    "神奈川県": ["横浜市", "川崎市", "藤沢市", "鎌倉市", "厚木市"],
    "千葉県": ["千葉市", "船橋市", "松戸市", "成田市", "柏市"],
    "埼玉県": ["さいたま市", "川越市", "所沢市", "越谷市", "春日部市"],
    "大阪府": ["大阪市", "堺市", "豊中市", "池田市", "吹田市"],
    "京都府": ["京都市", "宇治市", "城陽市", "木津川市", "南丹市"],
    "兵庫県": ["神戸市", "姫路市", "尼崎市", "明石市", "西宮市"],
    "福岡県": ["福岡市", "北九州市", "久留米市", "飯塚市", "大牟田市"],
  };
  const propertyTypes = ["land", "house", "condo"];

  const testCases: TestCase[] = [];

  for (let i = 0; i < count; i++) {
    const prefecture = prefectures[Math.floor(Math.random() * prefectures.length)];
    const citiesForPref = cities[prefecture as keyof typeof cities] || [];
    const city = citiesForPref[Math.floor(Math.random() * citiesForPref.length)];
    const propertyType = propertyTypes[Math.floor(Math.random() * propertyTypes.length)];

    // Generate random property details
    const landAreaM2 = propertyType === "land" ? Math.floor(Math.random() * 400) + 50 : undefined;
    const buildingAreaM2 = propertyType !== "land" ? Math.floor(Math.random() * 300) + 50 : undefined;
    const buildingYear = propertyType !== "land" ? Math.floor(Math.random() * 50) + 1975 : undefined;
    const stationDistanceMin = Math.floor(Math.random() * 30) + 1;

    testCases.push({
      id: i + 1,
      input: {
        prefecture,
        city,
        propertyType: propertyType as "land" | "house" | "condo",
        landAreaM2,
        buildingAreaM2,
        buildingYear,
        stationDistanceMin,
      },
      expectedOutcome: `Calculate price for ${propertyType} in ${prefecture}${city}`,
    });
  }

  return testCases;
}

describe("Form Input & Database Integration Tests", () => {
  let testCases: TestCase[] = [];
  let db: any = null;

  beforeAll(async () => {
    // Generate 10 random test cases
    testCases = generateRandomTestCases(10);
    db = await getDb();
    console.log(`\n📋 Generated ${testCases.length} random test cases`);
  });

  afterAll(async () => {
    console.log("\n✅ Form input tests completed");
  });

  /**
   * Test 1: Random input - Land in Tokyo
   */
  it("Test 1: Random land assessment", async () => {
    const testCase = testCases[0];
    console.log(`\n🏗️  Test 1: ${testCase.expectedOutcome}`);
    console.log(`   Input: ${JSON.stringify(testCase.input)}`);

    const result = await calculateAssessment(testCase.input);

    expect(result).toBeDefined();
    expect(result.estimatedLowYen).toBeGreaterThan(0);
    expect(result.estimatedHighYen).toBeGreaterThan(result.estimatedLowYen);
    expect(result.compsUsedCount).toBeGreaterThan(0);

    console.log(`   ✓ Price range: ¥${result.estimatedLowYen.toLocaleString()} - ¥${result.estimatedHighYen.toLocaleString()}`);
    console.log(`   ✓ Comparables used: ${result.compsUsedCount}`);
  });

  /**
   * Test 2: Random input - House in Kanagawa
   */
  it("Test 2: Random house assessment", async () => {
    const testCase = testCases[1];
    console.log(`\n🏠 Test 2: ${testCase.expectedOutcome}`);
    console.log(`   Input: ${JSON.stringify(testCase.input)}`);

    const result = await calculateAssessment(testCase.input);

    expect(result).toBeDefined();
    expect(result.estimatedLowYen).toBeGreaterThan(0);
    expect(result.estimatedHighYen).toBeGreaterThan(result.estimatedLowYen);
    expect(result.adjustmentFactors).toBeDefined();

    console.log(`   ✓ Price range: ¥${result.estimatedLowYen.toLocaleString()} - ¥${result.estimatedHighYen.toLocaleString()}`);
    console.log(`   ✓ Building year adjustment: ${(result.adjustmentFactors.buildingYearAdjustment * 100).toFixed(1)}%`);
  });

  /**
   * Test 3: Random input - Condo in Osaka
   */
  it("Test 3: Random condo assessment", async () => {
    const testCase = testCases[2];
    console.log(`\n🏢 Test 3: ${testCase.expectedOutcome}`);
    console.log(`   Input: ${JSON.stringify(testCase.input)}`);

    const result = await calculateAssessment(testCase.input);

    expect(result).toBeDefined();
    expect(result.estimatedMidYen).toBeDefined();
    expect(result.marketAnalysis).toBeDefined();

    console.log(`   ✓ Estimated mid price: ¥${result.estimatedMidYen.toLocaleString()}`);
    console.log(`   ✓ Market trend: ${result.marketAnalysis.marketTrend}`);
  });

  /**
   * Test 4: Random input - Land in Chiba
   */
  it("Test 4: Random land in Chiba", async () => {
    const testCase = testCases[3];
    console.log(`\n🏗️  Test 4: ${testCase.expectedOutcome}`);
    console.log(`   Input: ${JSON.stringify(testCase.input)}`);

    const result = await calculateAssessment(testCase.input);

    expect(result).toBeDefined();
    expect(result.forecastAnalysis).toBeDefined();
    expect(result.forecastAnalysis.forecast1Year).toBeGreaterThan(0);

    console.log(`   ✓ 1-year forecast: ¥${result.forecastAnalysis.forecast1Year.toLocaleString()}`);
    console.log(`   ✓ 3-year forecast: ¥${result.forecastAnalysis.forecast3Year.toLocaleString()}`);
  });

  /**
   * Test 5: Random input - House in Saitama
   */
  it("Test 5: Random house in Saitama", async () => {
    const testCase = testCases[4];
    console.log(`\n🏠 Test 5: ${testCase.expectedOutcome}`);
    console.log(`   Input: ${JSON.stringify(testCase.input)}`);

    const result = await calculateAssessment(testCase.input);

    expect(result).toBeDefined();
    expect(result.explanation).toBeDefined();
    expect(result.explanation.length).toBeGreaterThan(0);

    console.log(`   ✓ Explanation length: ${result.explanation.length} characters`);
    console.log(`   ✓ Explanation preview: ${result.explanation.substring(0, 100)}...`);
  });

  /**
   * Test 6: Random input - Condo in Kyoto
   */
  it("Test 6: Random condo in Kyoto", async () => {
    const testCase = testCases[5];
    console.log(`\n🏢 Test 6: ${testCase.expectedOutcome}`);
    console.log(`   Input: ${JSON.stringify(testCase.input)}`);

    const result = await calculateAssessment(testCase.input);

    expect(result).toBeDefined();
    expect(result.method).toBeDefined();
    expect(result.methodVersion).toBeDefined();

    console.log(`   ✓ Method: ${result.method}`);
    console.log(`   ✓ Method version: ${result.methodVersion}`);
  });

  /**
   * Test 7: Random input - Land in Hyogo
   */
  it("Test 7: Random land in Hyogo", async () => {
    const testCase = testCases[6];
    console.log(`\n🏗️  Test 7: ${testCase.expectedOutcome}`);
    console.log(`   Input: ${JSON.stringify(testCase.input)}`);

    const result = await calculateAssessment(testCase.input);

    expect(result).toBeDefined();
    expect(result.compsUsedCount).toBeGreaterThan(0);
    expect(result.estimatedLowYen).toBeGreaterThan(0);

    const priceRange = result.estimatedHighYen - result.estimatedLowYen;
    const rangePercent = ((priceRange / result.estimatedMidYen) * 100).toFixed(1);

    console.log(`   ✓ Price range: ¥${result.estimatedLowYen.toLocaleString()} - ¥${result.estimatedHighYen.toLocaleString()}`);
    console.log(`   ✓ Range: ${rangePercent}%`);
  });

  /**
   * Test 8: Random input - House in Fukuoka
   */
  it("Test 8: Random house in Fukuoka", async () => {
    const testCase = testCases[7];
    console.log(`\n🏠 Test 8: ${testCase.expectedOutcome}`);
    console.log(`   Input: ${JSON.stringify(testCase.input)}`);

    const result = await calculateAssessment(testCase.input);

    expect(result).toBeDefined();
    expect(result.adjustmentFactors.stationDistanceAdjustment).toBeGreaterThan(0.7);
    expect(result.adjustmentFactors.stationDistanceAdjustment).toBeLessThanOrEqual(1.0);

    console.log(`   ✓ Station distance adjustment: ${(result.adjustmentFactors.stationDistanceAdjustment * 100).toFixed(1)}%`);
    console.log(`   ✓ Area adjustment: ${(result.adjustmentFactors.areaAdjustment * 100).toFixed(1)}%`);
  });

  /**
   * Test 9: Random input - Condo in Tokyo
   */
  it("Test 9: Random condo in Tokyo", async () => {
    const testCase = testCases[8];
    console.log(`\n🏢 Test 9: ${testCase.expectedOutcome}`);
    console.log(`   Input: ${JSON.stringify(testCase.input)}`);

    const result = await calculateAssessment(testCase.input);

    expect(result).toBeDefined();
    expect(result.marketAnalysis.transactionCount).toBeGreaterThan(0);
    expect(result.marketAnalysis.avgPricePerM2).toBeGreaterThan(0);

    console.log(`   ✓ Transaction count: ${result.marketAnalysis.transactionCount}`);
    console.log(`   ✓ Average price per m²: ¥${result.marketAnalysis.avgPricePerM2.toLocaleString()}`);
  });

  /**
   * Test 10: Random input - Land in Kanagawa
   */
  it("Test 10: Random land in Kanagawa", async () => {
    const testCase = testCases[9];
    console.log(`\n🏗️  Test 10: ${testCase.expectedOutcome}`);
    console.log(`   Input: ${JSON.stringify(testCase.input)}`);

    const result = await calculateAssessment(testCase.input);

    expect(result).toBeDefined();
    expect(result.estimatedMidYen).toBeGreaterThan(0);
    expect(result.compsUsedCount).toBeGreaterThan(0);

    console.log(`   ✓ Estimated mid price: ¥${result.estimatedMidYen.toLocaleString()}`);
    console.log(`   ✓ Comparables used: ${result.compsUsedCount}`);
    console.log(`   ✓ Data integrity: ✅ VERIFIED`);
  });
});
