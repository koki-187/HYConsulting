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
  confidenceBreakdown: {
    totalScore: number;
    dataVolumeScore: number;
    locationMatchScore: number;
    buildingAgeSimilarityScore: number;
    propertyTypeMatchScore: number;
    dataVolumeDetails: string;
    locationMatchDetails: string;
    buildingAgeSimilarityDetails: string;
    propertyTypeMatchDetails: string;
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
 * Parse city input to extract city and district
 * Handles formats like "横浜市戸塚区" → city: "横浜市", district: "戸塚区"
 */
function parseCityInput(cityInput: string): { city: string; district?: string } {
  // Common patterns: "横浜市戸塚区", "川崎市中原区", etc.
  const cityDistrictMatch = cityInput.match(/^(.+市)(.+区)$/);
  if (cityDistrictMatch) {
    return {
      city: cityDistrictMatch[1],
      district: cityDistrictMatch[2],
    };
  }
  
  // If no district found, return as-is
  return { city: cityInput };
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

  const { prefecture, city: cityInput, propertyType, buildingYear } = input;
  const { city, district } = parseCityInput(cityInput);
  const dbPropertyType = mapPropertyType(propertyType);
  const ageGroups = getBuildingAgeGroup(buildingYear);

  console.log(`🔍 Searching for: ${prefecture} ${city}${district ? ` ${district}` : ""} ${dbPropertyType} ${ageGroups.join(", ")}`);

  // Step 1: Try exact match with district (if district exists)
  let comparables: any[] = [];
  if (district) {
    comparables = await db
      .select()
      .from(aggregatedRealEstateData)
      .where(
        and(
          eq(aggregatedRealEstateData.prefecture, prefecture),
          eq(aggregatedRealEstateData.city, city),
          sql`${aggregatedRealEstateData.district} LIKE ${`%${district}%`}`,
          eq(aggregatedRealEstateData.propertyType, dbPropertyType),
          sql`${aggregatedRealEstateData.buildingAgeGroup} IN ${ageGroups}`
        )
      );

    console.log(`  ✓ City + District level (specific age): ${comparables.length} records`);

    // Step 2: If not enough, expand to district level (all age groups)
    if (comparables.length < 3) {
      comparables = await db
        .select()
        .from(aggregatedRealEstateData)
        .where(
          and(
            eq(aggregatedRealEstateData.prefecture, prefecture),
            eq(aggregatedRealEstateData.city, city),
            sql`${aggregatedRealEstateData.district} LIKE ${`%${district}%`}`,
            eq(aggregatedRealEstateData.propertyType, dbPropertyType)
          )
        );

      console.log(`  ✓ City + District level (all ages): ${comparables.length} records`);
    }
  }

  // Step 3: Try city level (without district filter)
  if (comparables.length < 3) {
    comparables = await db
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

    console.log(`  ✓ City level (specific age): ${comparables.length} records`);
  }

  // Step 4: If not enough, expand to city level (all age groups)
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
 * Calculate confidence breakdown scores
 */
function calculateConfidenceBreakdown(
  input: AssessmentInput,
  comps: any[],
  totalTransactions: number
): {
  totalScore: number;
  dataVolumeScore: number;
  locationMatchScore: number;
  buildingAgeSimilarityScore: number;
  propertyTypeMatchScore: number;
  dataVolumeDetails: string;
  locationMatchDetails: string;
  buildingAgeSimilarityDetails: string;
  propertyTypeMatchDetails: string;
} {
  // 1. Data Volume Score (0-25%)
  let dataVolumeScore = 0;
  let dataVolumeDetails = "";
  if (comps.length >= 100) {
    dataVolumeScore = 25;
    dataVolumeDetails = `参照データ${comps.length}件（取引${totalTransactions}件）- 非常に豊富なデータ`;
  } else if (comps.length >= 50) {
    dataVolumeScore = 20;
    dataVolumeDetails = `参照データ${comps.length}件（取引${totalTransactions}件）- 豊富なデータ`;
  } else if (comps.length >= 20) {
    dataVolumeScore = 15;
    dataVolumeDetails = `参照データ${comps.length}件（取引${totalTransactions}件）- 十分なデータ`;
  } else if (comps.length >= 10) {
    dataVolumeScore = 10;
    dataVolumeDetails = `参照データ${comps.length}件（取引${totalTransactions}件）- やや少ないデータ`;
  } else {
    dataVolumeScore = 5;
    dataVolumeDetails = `参照データ${comps.length}件（取引${totalTransactions}件）- 限定的なデータ`;
  }

  // 2. Location Match Score (0-25%)
  const { city, district } = parseCityInput(input.city);
  let locationMatchScore = 0;
  let locationMatchDetails = "";
  
  // Check if we have district-level matches
  const districtMatches = district
    ? comps.filter((c) => c.city === city && c.district && c.district.includes(district))
    : [];
  const cityMatches = comps.filter((c) => c.city === city);
  const prefectureMatches = comps.filter((c) => c.prefecture === input.prefecture);

  if (districtMatches.length > 0 && district) {
    locationMatchScore = 25;
    locationMatchDetails = `${input.prefecture}${city}${district}レベルで完全一致`;
  } else if (cityMatches.length > 0) {
    locationMatchScore = 20;
    locationMatchDetails = `${input.prefecture}${city}レベルで一致`;
  } else if (prefectureMatches.length > 0) {
    locationMatchScore = 10;
    locationMatchDetails = `${input.prefecture}レベルで一致`;
  } else {
    locationMatchScore = 5;
    locationMatchDetails = `全国データを使用`;
  }

  // 3. Building Age Similarity Score (0-25%)
  let buildingAgeSimilarityScore = 25; // Default for land
  let buildingAgeSimilarityDetails = "築年数: 該当なし（土地）";
  
  if (input.buildingYear && input.propertyType !== "land") {
    const currentYear = new Date().getFullYear();
    const inputAge = currentYear - input.buildingYear;
    const ageGroups = getBuildingAgeGroup(input.buildingYear);
    
    // Calculate percentage of transactions within similar age groups
    let similarAgeTransactions = 0;
    for (const comp of comps) {
      if (ageGroups.includes(comp.buildingAgeGroup)) {
        similarAgeTransactions += Number(comp.transactionCount) || 0;
      }
    }
    
    const similarityPercentage = totalTransactions > 0
      ? (similarAgeTransactions / totalTransactions) * 100
      : 0;
    
    if (similarityPercentage >= 80) {
      buildingAgeSimilarityScore = 25;
      buildingAgeSimilarityDetails = `築${inputAge}年 - 類似築年数物件が${similarityPercentage.toFixed(0)}%（非常に高い類似性）`;
    } else if (similarityPercentage >= 50) {
      buildingAgeSimilarityScore = 20;
      buildingAgeSimilarityDetails = `築${inputAge}年 - 類似築年数物件が${similarityPercentage.toFixed(0)}%（高い類似性）`;
    } else if (similarityPercentage >= 30) {
      buildingAgeSimilarityScore = 15;
      buildingAgeSimilarityDetails = `築${inputAge}年 - 類似築年数物件が${similarityPercentage.toFixed(0)}%（中程度の類似性）`;
    } else {
      buildingAgeSimilarityScore = 10;
      buildingAgeSimilarityDetails = `築${inputAge}年 - 類似築年数物件が${similarityPercentage.toFixed(0)}%（低い類似性）`;
    }
  }

  // 4. Property Type Match Score (0-25%)
  // Always 25% since we filter by property type
  const propertyTypeMatchScore = 25;
  const propertyTypeMatchDetails = `物件種別: ${mapPropertyType(input.propertyType)}で完全一致`;

  const totalScore = dataVolumeScore + locationMatchScore + buildingAgeSimilarityScore + propertyTypeMatchScore;

  return {
    totalScore,
    dataVolumeScore,
    locationMatchScore,
    buildingAgeSimilarityScore,
    propertyTypeMatchScore,
    dataVolumeDetails,
    locationMatchDetails,
    buildingAgeSimilarityDetails,
    propertyTypeMatchDetails,
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
    const propertyTypeJa = mapPropertyType(input.propertyType);
    console.error(`❌ No comparable data found`);
    console.error(`  Prefecture: ${input.prefecture}`);
    console.error(`  City: ${input.city}`);
    console.error(`  Property Type: ${propertyTypeJa}`);
    
    throw new Error(
      `申し訳ございません。${input.prefecture}${input.city}の${propertyTypeJa}に関する取引データが見つかりませんでした。` +
      `\n\n現在、全国のデータを順次投入中です。しばらく経ってから再度お試しいただくか、` +
      `お電話（0120-XXX-XXX）にて直接お問い合わせください。`
    );
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
  const marketTrend = "安定"; // TODO: Implement trend analysis when historical data is available

  // Forecast (simple trend-based)
  const trendMultiplier = 1.0; // Stable market
  const forecast1Year = Math.round(adjustedPrice * Math.pow(trendMultiplier, 1));
  const forecast3Year = Math.round(adjustedPrice * Math.pow(trendMultiplier, 3));
  const forecast5Year = Math.round(adjustedPrice * Math.pow(trendMultiplier, 5));

  // Generate explanation
  const explanation = generateExplanation(input, comps.length, stats.totalTransactions, adjustments);

  // Calculate confidence breakdown
  const confidenceBreakdown = calculateConfidenceBreakdown(input, comps, stats.totalTransactions);
  console.log(`\n📊 Confidence Breakdown:`);
  console.log(`  Total Score: ${confidenceBreakdown.totalScore}%`);
  console.log(`  Data Volume: ${confidenceBreakdown.dataVolumeScore}% - ${confidenceBreakdown.dataVolumeDetails}`);
  console.log(`  Location Match: ${confidenceBreakdown.locationMatchScore}% - ${confidenceBreakdown.locationMatchDetails}`);
  console.log(`  Building Age Similarity: ${confidenceBreakdown.buildingAgeSimilarityScore}% - ${confidenceBreakdown.buildingAgeSimilarityDetails}`);
  console.log(`  Property Type Match: ${confidenceBreakdown.propertyTypeMatchScore}% - ${confidenceBreakdown.propertyTypeMatchDetails}`);

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
    confidenceBreakdown,
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
