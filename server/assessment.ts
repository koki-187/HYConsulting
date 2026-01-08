/**
 * Assessment Calculation Logic
 * Implements database-driven valuation using MLIT transaction data
 * 
 * Based on comparable sales approach (コンプス法):
 * 1. Find comparable transactions (similar property, location, condition)
 * 2. Calculate median price and range (IQR)
 * 3. Apply adjustment factors (building age, station distance, etc.)
 * 4. Generate explanation with confidence level
 */

import { getDb } from "./db";
import { eq, and, gte, lte, sql } from "drizzle-orm";
import { transactions, valuationRequests, valuationResults } from "../drizzle/schema";

export interface AssessmentInput {
  prefecture: string;
  city: string;
  ward?: string;
  district?: string;
  propertyType: "land" | "house" | "condo" | "apartment";
  landAreaM2?: number;
  buildingAreaM2?: number;
  buildingYear?: number;
  stationDistanceMin?: number;
  ownershipType?: string;
  inheritanceFlag?: number;
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
    stationDistanceAdjustment: number;
    areaAdjustment: number;
  };
  forecastAnalysis: {
    forecast1Year: number;
    forecast3Year: number;
    forecast5Year: number;
  };
}

/**
 * Map frontend property type to database property type
 */
function mapPropertyTypeToDb(propertyType: string): string {
  const mapping: Record<string, string> = {
    "apartment": "中古マンション等",
    "condo": "中古マンション等",
    "house": "宅地(土地と建物)",
    "land": "宅地(土地)",
    "building": "中古マンション等", // アパート一棟は中古マンション等として扱う
  };
  return mapping[propertyType] || propertyType;
}

/**
 * Find comparable transactions
 * Uses progressive search strategy: exact match → expanded search
 */
async function findComparables(input: AssessmentInput): Promise<any[]> {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  const { prefecture, city, propertyType, buildingAreaM2, buildingYear, stationDistanceMin } = input;
  const dbPropertyType = mapPropertyTypeToDb(propertyType);

  // Step 1: Try exact match (same city, property type)
  let comparables = await db
    .select()
    .from(transactions)
    .where(
      and(
        eq(transactions.prefecture, prefecture),
        eq(transactions.city, city),
        eq(transactions.propertyType, dbPropertyType)
      )
    )
    .limit(500); // Limit to 500 records for performance

  // If we have enough comparables, apply filters
  if (comparables.length >= 3) {
    comparables = applyFilters(comparables, input);
  }

  // Step 2: If not enough, expand to prefecture level
  if (comparables.length < 3) {
    comparables = await db
      .select()
      .from(transactions)
      .where(
        and(
          eq(transactions.prefecture, prefecture),
          eq(transactions.propertyType, dbPropertyType)
        )
      )
      .limit(500); // Limit to 500 records for performance

    if (comparables.length >= 3) {
      comparables = applyFilters(comparables, input);
    }
  }

  // Step 3: If still not enough, use all available data for the property type
  if (comparables.length < 3) {
    comparables = await db
      .select()
      .from(transactions)
      .where(eq(transactions.propertyType, dbPropertyType))
      .limit(100);
  }

  return comparables;
}


/**
 * Apply filters to comparables based on property characteristics
 */
function applyFilters(comparables: any[], input: AssessmentInput): any[] {
  const { buildingAreaM2, buildingYear, stationDistanceMin } = input;

  return comparables.filter((comp) => {
    // For land, check land area
    if (input.propertyType === "land" && input.landAreaM2) {
      const compArea = Number(comp.landAreaM2) || 0;
      const inputArea = input.landAreaM2;
      if (compArea < inputArea * 0.7 || compArea > inputArea * 1.3) {
        return false; // Area ±30%
      }
    }

    // For buildings, check building area
    if (input.propertyType !== "land" && buildingAreaM2) {
      const compArea = Number(comp.buildingAreaM2) || 0;
      if (compArea < buildingAreaM2 * 0.7 || compArea > buildingAreaM2 * 1.3) {
        return false; // Area ±30%
      }
    }

    // Check building year (±10 years)
    if (buildingYear && comp.buildingYear) {
      if (Math.abs(comp.buildingYear - buildingYear) > 10) {
        return false;
      }
    }

    // Check station distance (±10 minutes)
    if (stationDistanceMin && comp.stationDistanceMin) {
      if (Math.abs(comp.stationDistanceMin - stationDistanceMin) > 10) {
        return false;
      }
    }

    return true;
  });
}

/**
 * Calculate statistical measures (median, quartiles, etc.)
 */
function calculateStatistics(prices: number[]): {
  median: number;
  q1: number;
  q3: number;
  mean: number;
  min: number;
  max: number;
} {
  const sorted = [...prices].sort((a, b) => a - b);
  const n = sorted.length;

  const median = n % 2 === 0 ? (sorted[n / 2 - 1] + sorted[n / 2]) / 2 : sorted[Math.floor(n / 2)];
  const q1 = sorted[Math.floor(n / 4)];
  const q3 = sorted[Math.floor((3 * n) / 4)];
  const mean = sorted.reduce((a, b) => a + b, 0) / n;

  return {
    median,
    q1,
    q3,
    mean,
    min: sorted[0],
    max: sorted[n - 1],
  };
}

/**
 * Calculate adjustment factors
 */
function calculateAdjustments(input: AssessmentInput, comps: any[]): {
  buildingYearAdjustment: number;
  stationDistanceAdjustment: number;
  areaAdjustment: number;
} {
  // Building year adjustment (depreciation: -2% per year)
  let buildingYearAdjustment = 1.0;
  if (input.buildingYear && input.propertyType !== "land") {
    const avgCompAge = comps.reduce((sum, c) => sum + (c.buildingYear || 0), 0) / comps.length;
    const ageDiff = avgCompAge - input.buildingYear; // Negative if input is newer (should increase value)
    buildingYearAdjustment = Math.max(0.5, 1 + ageDiff * 0.02); // +2% per year older, floor at 50%
  }

  // Station distance adjustment (-1% per minute)
  let stationDistanceAdjustment = 1.0;
  if (input.stationDistanceMin && comps.some((c) => c.stationDistanceMin)) {
    const avgCompDistance =
      comps.reduce((sum, c) => sum + (c.stationDistanceMin || 0), 0) / comps.length;
    // If subject property is farther from station than average comps, apply negative adjustment
    // If subject property is closer to station than average comps, apply positive adjustment
    const distanceDiff = input.stationDistanceMin - avgCompDistance;
    stationDistanceAdjustment = Math.max(0.7, 1 - Math.abs(distanceDiff) * 0.01); // -1% per minute difference, floor at 70%
  }

  // Area adjustment (larger properties often have lower per-sqm value)
  let areaAdjustment = 1.0;
  if (input.propertyType === "land" && input.landAreaM2) {
    const avgCompArea =
      comps.reduce((sum, c) => sum + (Number(c.landAreaM2) || 0), 0) / comps.length;
    const areaDiff = input.landAreaM2 - avgCompArea;
    // Larger land = slightly lower per-sqm value (-0.5% per 100 sqm)
    areaAdjustment = Math.max(0.8, 1 - (areaDiff / 100) * 0.005);
  }

  return {
    buildingYearAdjustment,
    stationDistanceAdjustment,
    areaAdjustment,
  };
}

/**
 * Determine market trend based on recent transactions
 */
function determineMarketTrend(comps: any[]): string {
  // Sort by transaction date and compare recent vs older prices
  const sorted = [...comps].sort((a, b) => {
    const dateA = a.transactionYm || "2020-01";
    const dateB = b.transactionYm || "2020-01";
    return dateB.localeCompare(dateA);
  });

  if (sorted.length < 2) {
    return "stable";
  }

  const recentAvg =
    sorted
      .slice(0, Math.ceil(sorted.length / 2))
      .reduce((sum, c) => sum + Number(c.unitPriceYenPerM2 || 0), 0) /
    Math.ceil(sorted.length / 2);

  const olderAvg =
    sorted
      .slice(Math.ceil(sorted.length / 2))
      .reduce((sum, c) => sum + Number(c.unitPriceYenPerM2 || 0), 0) /
    (sorted.length - Math.ceil(sorted.length / 2));

  const changeRate = (recentAvg - olderAvg) / olderAvg;

  if (changeRate > 0.05) {
    return "rising";
  } else if (changeRate < -0.05) {
    return "declining";
  } else {
    return "stable";
  }
}

/**
 * Main assessment calculation function
 */
export async function calculateAssessment(input: AssessmentInput): Promise<AssessmentResult> {
  // Find comparable transactions
  const comps = await findComparables(input);

  if (comps.length === 0) {
    throw new Error("No comparable transactions found for assessment");
  }

  // Extract prices
  const prices = comps.map((c) => Number(c.priceYen) || 0).filter((p) => p > 0);

  if (prices.length === 0) {
    throw new Error("No valid price data found");
  }

  // Calculate statistics
  const stats = calculateStatistics(prices);

  // Calculate adjustments
  const adjustments = calculateAdjustments(input, comps);

  // Apply adjustments to median
  const adjustedMedian = Math.round(stats.median * adjustments.buildingYearAdjustment * adjustments.stationDistanceAdjustment * adjustments.areaAdjustment);

  // Calculate range using IQR (Interquartile Range)
  const iqr = stats.q3 - stats.q1;
  const margin = Math.max(iqr * 0.25, adjustedMedian * 0.1); // At least 10% margin

  const estimatedLowYen = Math.round(adjustedMedian - margin);
  const estimatedHighYen = Math.round(adjustedMedian + margin);

  // Market analysis
  const avgPricePerM2 = comps.reduce((sum, c) => sum + Number(c.unitPriceYenPerM2 || 0), 0) / comps.length;
  const marketTrend = determineMarketTrend(comps);

  // Forecast (simple trend-based)
  const trendMultiplier = marketTrend === "rising" ? 1.02 : marketTrend === "declining" ? 0.98 : 1.0;
  const forecast1Year = Math.round(adjustedMedian * Math.pow(trendMultiplier, 1));
  const forecast3Year = Math.round(adjustedMedian * Math.pow(trendMultiplier, 3));
  const forecast5Year = Math.round(adjustedMedian * Math.pow(trendMultiplier, 5));

  // Generate explanation
  const explanation = generateExplanation(input, comps.length, adjustments, marketTrend);

  return {
    estimatedLowYen,
    estimatedHighYen,
    estimatedMidYen: adjustedMedian,
    compsUsedCount: comps.length,
    method: "median_comps_adjusted",
    methodVersion: "v1.0-mlit",
    explanation,
    marketAnalysis: {
      surroundingPrice: adjustedMedian,
      transactionCount: comps.length,
      avgPricePerM2: Math.round(avgPricePerM2),
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
  adjustments: any,
  marketTrend: string
): string {
  const propertyTypeLabel = {
    land: "土地",
    house: "戸建て",
    condo: "マンション",
    apartment: "アパート",
  }[input.propertyType] || "物件";

  const trendLabel = {
    rising: "上昇傾向",
    declining: "下降傾向",
    stable: "安定",
  }[marketTrend];

  let explanation = `${input.prefecture}${input.city}の${propertyTypeLabel}について、`;
  explanation += `同一エリア近傍の類似取引${compsCount}件から算出した中央値レンジです。\n\n`;

  explanation += "【調整要因】\n";
  if (input.buildingYear && input.propertyType !== "land") {
    const adjustment = Math.round((adjustments.buildingYearAdjustment - 1) * 100);
    explanation += `・築年による調整: ${adjustment > 0 ? "+" : ""}${adjustment}%\n`;
  }
  if (input.stationDistanceMin) {
    const adjustment = Math.round((adjustments.stationDistanceAdjustment - 1) * 100);
    explanation += `・駅距離による調整: ${adjustment > 0 ? "+" : ""}${adjustment}%\n`;
  }

  explanation += `\n【市場動向】\n`;
  explanation += `当該地域の市場は${trendLabel}です。\n\n`;

  explanation += "【ご注意】\n";
  explanation += "本査定は参考値であり、詳細査定は面談で確定いたします。\n";
  explanation += "相続・空き家・事故物件など特殊な状況がある場合はお知らせください。";

  return explanation;
}

/**
 * Save valuation request and result to database
 */
export async function saveValuationToDatabase(
  input: AssessmentInput,
  result: AssessmentResult,
  ownerName?: string,
  email?: string,
  phone?: string
): Promise<{ requestId: string; resultId: number }> {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  // Generate request ID
  const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  // Create valuation request
  await db.insert(valuationRequests).values({
    id: requestId,
    createdAt: new Date(),
    inputPrefecture: input.prefecture,
    inputCity: input.city,
    inputWard: input.ward,
    inputDistrict: input.district,
    propertyType: input.propertyType,
    landAreaM2: input.landAreaM2 ? String(input.landAreaM2) : null,
    buildingAreaM2: input.buildingAreaM2 ? String(input.buildingAreaM2) : null,
    buildingYear: input.buildingYear,
    stationDistanceMin: input.stationDistanceMin,
    ownershipType: input.ownershipType,
    inheritanceFlag: input.inheritanceFlag || 0,
    ownerName: ownerName || null,
    email: email || null,
    phone: phone || null,
    status: "completed",
  });

  // Create valuation result
  const resultInsert = await db.insert(valuationResults).values({
    requestId,
    createdAt: new Date(),
    estimatedLowYen: result.estimatedLowYen,
    estimatedHighYen: result.estimatedHighYen,
    estimatedMidYen: result.estimatedMidYen,
    compsUsedCount: result.compsUsedCount,
    method: result.method,
    methodVersion: result.methodVersion,
    explanation: result.explanation,
    marketAnalysis: JSON.stringify(result.marketAnalysis),
    adjustmentFactors: JSON.stringify(result.adjustmentFactors),
    forecastAnalysis: JSON.stringify(result.forecastAnalysis),
    status: "completed",
  });

  // Fetch the created result to get its ID
  const createdResult = await db
    .select()
    .from(valuationResults)
    .where(eq(valuationResults.requestId, requestId))
    .limit(1);

  return {
    requestId,
    resultId: createdResult[0]?.id || 0,
  };
}
