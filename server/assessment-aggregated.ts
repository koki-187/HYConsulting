/**
 * Assessment Calculation Logic (Aggregated Data Version)
 * Implements database-driven valuation using aggregated MLIT transaction data
 * 
 * Based on comparable sales approach (コンプス法):
 * 1. Find comparable aggregated data (similar property, location, building age)
 * 2. Calculate weighted average price
 * 3. Apply adjustment factors (building age, area, etc.)
 * 4. Generate explanation with confidence level
 */

import { getDb } from "./db";
import { eq, and, sql } from "drizzle-orm";
import { aggregatedRealEstateData } from "../drizzle/schema";

export interface AssessmentInput {
  prefecture: string;
  city: string;
  propertyType: "land" | "house" | "condo" | "apartment";
  landAreaM2?: number;
  buildingAreaM2?: number;
  buildingYear?: number;
  stationDistanceMin?: number;
}

export interface AssessmentResult {
  estimatedLowYen: number;
  estimatedHighYen: number;
  estimatedMidYen: number;
  compsUsedCount: number;
  method: string;
  methodVersion: string;
  explanation: string;
  marketAnalysis: {
    surroundingPrice: number;
    transactionCount: number;
    avgPricePerM2: number;
    marketTrend: string;
  };
  adjustmentFactors: {
    buildingYearAdjustment: number;
    areaAdjustment: number;
  };
  forecastAnalysis: {
    forecast1Year: number;
    forecast3Year: number;
    forecast5Year: number;
  };
}

/**
 * Map frontend property types to database property types
 */
function mapPropertyType(type: string): string {
  const typeMap: Record<string, string> = {
    "land": "土地",
    "house": "一戸建て",
    "condo": "マンション",
    "apartment": "マンション",
  };
  return typeMap[type] || "土地";
}

/**
 * Determine building age group from building year
 */
function getBuildingAgeGroup(buildingYear?: number): string[] {
  if (!buildingYear) {
    return ["0～5年", "5～10年", "10～15年", "15～20年", "20～30年", "30年以上", "不明"];
  }

  const currentYear = new Date().getFullYear();
  const age = currentYear - buildingYear;

  if (age < 0) return ["0～5年"];
  if (age <= 5) return ["0～5年", "5～10年"];
  if (age <= 10) return ["5～10年", "10～15年"];
  if (age <= 15) return ["10～15年", "15～20年"];
  if (age <= 20) return ["15～20年", "20～30年"];
  if (age <= 30) return ["20～30年", "30年以上"];
  return ["30年以上"];
}

/**
 * Find comparable aggregated data
 * Uses progressive search strategy: exact match → city level → prefecture level
 */
async function findComparables(input: AssessmentInput): Promise<any[]> {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  const { prefecture, city, propertyType, buildingYear } = input;
  const dbPropertyType = mapPropertyType(propertyType);
  const ageGroups = getBuildingAgeGroup(buildingYear);

  console.log(`🔍 Searching for: ${prefecture} ${city} ${dbPropertyType} ${ageGroups.join(", ")}`);

  // Step 1: Try exact match (same city, property type, age group)
  let comparables = await db
    .select()
    .from(aggregatedRealEstateData)
    .where(
      and(
        eq(aggregatedRealEstateData.prefecture, prefecture),
        eq(aggregatedRealEstateData.city, city),
        eq(aggregatedRealEstateData.propertyType, dbPropertyType),
        sql`${aggregatedRealEstateData.buildingAgeGroup} IN ${ageGroups}`
      )
    );

  console.log(`  ✓ City level: ${comparables.length} records`);

  // Step 2: If not enough, expand to city level (all age groups)
  if (comparables.length < 3) {
    comparables = await db
      .select()
      .from(aggregatedRealEstateData)
      .where(
        and(
          eq(aggregatedRealEstateData.prefecture, prefecture),
          eq(aggregatedRealEstateData.city, city),
          eq(aggregatedRealEstateData.propertyType, dbPropertyType)
        )
      );

    console.log(`  ✓ City level (all ages): ${comparables.length} records`);
  }

  // Step 3: If still not enough, expand to prefecture level
  if (comparables.length < 3) {
    comparables = await db
      .select()
      .from(aggregatedRealEstateData)
      .where(
        and(
          eq(aggregatedRealEstateData.prefecture, prefecture),
          eq(aggregatedRealEstateData.propertyType, dbPropertyType)
        )
      )
      .limit(100);

    console.log(`  ✓ Prefecture level: ${comparables.length} records`);
  }

  // Step 4: If still not enough, use nationwide data
  if (comparables.length < 3) {
    comparables = await db
      .select()
      .from(aggregatedRealEstateData)
      .where(eq(aggregatedRealEstateData.propertyType, dbPropertyType))
      .limit(100);

    console.log(`  ✓ Nationwide: ${comparables.length} records`);
  }

  return comparables;
}

/**
 * Calculate weighted average price from aggregated data
 */
function calculateWeightedAverage(comps: any[]): {
  weightedAvgPrice: number;
  weightedAvgPricePerM2: number;
  totalTransactions: number;
  minPrice: number;
  maxPrice: number;
} {
  let totalWeightedPrice = 0;
  let totalWeightedPricePerM2 = 0;
  let totalTransactions = 0;
  let minPrice = Infinity;
  let maxPrice = 0;

  for (const comp of comps) {
    const count = Number(comp.transactionCount) || 0;
    const avgPrice = Number(comp.averagePriceYen) || 0;
    const avgArea = Number(comp.averageAreaM2) || 1;
    const pricePerM2 = avgPrice / avgArea;

    totalWeightedPrice += avgPrice * count;
    totalWeightedPricePerM2 += pricePerM2 * count;
    totalTransactions += count;

    if (avgPrice < minPrice) minPrice = avgPrice;
    if (avgPrice > maxPrice) maxPrice = avgPrice;
  }

  return {
    weightedAvgPrice: totalTransactions > 0 ? totalWeightedPrice / totalTransactions : 0,
    weightedAvgPricePerM2: totalTransactions > 0 ? totalWeightedPricePerM2 / totalTransactions : 0,
    totalTransactions,
    minPrice: minPrice === Infinity ? 0 : minPrice,
    maxPrice,
  };
}

/**
 * Calculate adjustment factors
 */
function calculateAdjustments(input: AssessmentInput, comps: any[]): {
  buildingYearAdjustment: number;
  areaAdjustment: number;
} {
  // Building year adjustment (depreciation: -2% per year)
  let buildingYearAdjustment = 1.0;
  if (input.buildingYear && input.propertyType !== "land") {
    const currentYear = new Date().getFullYear();
    const age = currentYear - input.buildingYear;
    
    // Calculate average age from comps
    let avgAge = 15; // Default to 15 years if unknown
    const ageGroupCounts: Record<string, number> = {};
    for (const comp of comps) {
      const ageGroup = comp.buildingAgeGroup;
      ageGroupCounts[ageGroup] = (ageGroupCounts[ageGroup] || 0) + Number(comp.transactionCount);
    }
    
    // Estimate average age from most common age group
    const mostCommonAgeGroup = Object.entries(ageGroupCounts).sort((a, b) => b[1] - a[1])[0]?.[0];
    if (mostCommonAgeGroup) {
      const ageMap: Record<string, number> = {
        "0～5年": 2.5,
        "5～10年": 7.5,
        "10～15年": 12.5,
        "15～20年": 17.5,
        "20～30年": 25,
        "30年以上": 35,
        "不明": 15,
      };
      avgAge = ageMap[mostCommonAgeGroup] || 15;
    }

    const ageDiff = avgAge - age; // Negative if input is newer
    buildingYearAdjustment = Math.max(0.5, 1 + ageDiff * 0.02); // +2% per year older, floor at 50%
  }

  // Area adjustment (larger properties often have lower per-sqm value)
  let areaAdjustment = 1.0;
  const inputArea = input.landAreaM2 || input.buildingAreaM2;
  if (inputArea) {
    const avgCompArea = comps.reduce((sum, c) => sum + Number(c.averageAreaM2 || 0), 0) / comps.length;
    const areaDiff = inputArea - avgCompArea;
    // Larger area = slightly lower per-sqm value (-0.5% per 100 sqm)
    areaAdjustment = Math.max(0.8, 1 - (areaDiff / 100) * 0.005);
  }

  return {
    buildingYearAdjustment,
    areaAdjustment,
  };
}

/**
 * Main assessment calculation function
 */
export async function calculateAssessment(input: AssessmentInput): Promise<AssessmentResult> {
  console.log("\n" + "=".repeat(60));
  console.log("査定計算開始 (集計データ版)");
  console.log("=".repeat(60));
  console.log("Input:", JSON.stringify(input, null, 2));

  // Find comparable aggregated data
  const comps = await findComparables(input);

  if (comps.length === 0) {
    throw new Error(`No comparable data found for ${input.prefecture} ${input.city} ${input.propertyType}`);
  }

  console.log(`\n✅ Found ${comps.length} comparable records`);

  // Calculate weighted average
  const stats = calculateWeightedAverage(comps);
  console.log(`\n📊 Statistics:`);
  console.log(`  Weighted Avg Price: ¥${stats.weightedAvgPrice.toLocaleString()}`);
  console.log(`  Weighted Avg Price/m²: ¥${Math.round(stats.weightedAvgPricePerM2).toLocaleString()}`);
  console.log(`  Total Transactions: ${stats.totalTransactions}`);
  console.log(`  Price Range: ¥${stats.minPrice.toLocaleString()} - ¥${stats.maxPrice.toLocaleString()}`);

  // Calculate adjustments
  const adjustments = calculateAdjustments(input, comps);
  console.log(`\n🔧 Adjustments:`);
  console.log(`  Building Year: ${(adjustments.buildingYearAdjustment * 100).toFixed(1)}%`);
  console.log(`  Area: ${(adjustments.areaAdjustment * 100).toFixed(1)}%`);

  // Apply adjustments to weighted average
  const adjustedPrice = Math.round(
    stats.weightedAvgPrice * adjustments.buildingYearAdjustment * adjustments.areaAdjustment
  );

  // Calculate range (±15% for aggregated data)
  const margin = adjustedPrice * 0.15;
  const estimatedLowYen = Math.round(adjustedPrice - margin);
  const estimatedHighYen = Math.round(adjustedPrice + margin);

  console.log(`\n💰 Estimated Price:`);
  console.log(`  Low: ¥${estimatedLowYen.toLocaleString()}`);
  console.log(`  Mid: ¥${adjustedPrice.toLocaleString()}`);
  console.log(`  High: ¥${estimatedHighYen.toLocaleString()}`);

  // Market trend (simplified for aggregated data)
  const marketTrend = "stable"; // TODO: Implement trend analysis when historical data is available

  // Forecast (simple trend-based)
  const trendMultiplier = 1.0; // Stable market
  const forecast1Year = Math.round(adjustedPrice * Math.pow(trendMultiplier, 1));
  const forecast3Year = Math.round(adjustedPrice * Math.pow(trendMultiplier, 3));
  const forecast5Year = Math.round(adjustedPrice * Math.pow(trendMultiplier, 5));

  // Generate explanation
  const explanation = generateExplanation(input, comps.length, stats.totalTransactions, adjustments);

  console.log("\n" + "=".repeat(60));
  console.log("査定計算完了");
  console.log("=".repeat(60) + "\n");

  return {
    estimatedLowYen,
    estimatedHighYen,
    estimatedMidYen: adjustedPrice,
    compsUsedCount: comps.length,
    method: "weighted_average_aggregated",
    methodVersion: "v2.0-mlit-aggregated",
    explanation,
    marketAnalysis: {
      surroundingPrice: adjustedPrice,
      transactionCount: stats.totalTransactions,
      avgPricePerM2: Math.round(stats.weightedAvgPricePerM2),
      marketTrend,
    },
    adjustmentFactors: adjustments,
    forecastAnalysis: {
      forecast1Year,
      forecast3Year,
      forecast5Year,
    },
  };
}

/**
 * Generate user-friendly explanation
 */
function generateExplanation(
  input: AssessmentInput,
  compsCount: number,
  totalTransactions: number,
  adjustments: { buildingYearAdjustment: number; areaAdjustment: number }
): string {
  const parts: string[] = [];

  parts.push(
    `${input.prefecture}${input.city}エリアの${mapPropertyType(input.propertyType)}について、` +
    `国土交通省の取引データ${compsCount}件（合計${totalTransactions}取引）を基に査定しました。`
  );

  if (adjustments.buildingYearAdjustment !== 1.0) {
    const pct = ((adjustments.buildingYearAdjustment - 1) * 100).toFixed(1);
    parts.push(`築年数による補正: ${pct > "0" ? "+" : ""}${pct}%`);
  }

  if (adjustments.areaAdjustment !== 1.0) {
    const pct = ((adjustments.areaAdjustment - 1) * 100).toFixed(1);
    parts.push(`面積による補正: ${pct > "0" ? "+" : ""}${pct}%`);
  }

  parts.push(
    `この査定額は、周辺エリアの実際の取引価格を統計的に分析した結果です。` +
    `より正確な査定をご希望の場合は、訪問査定をご利用ください。`
  );

  return parts.join(" ");
}
