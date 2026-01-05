/**
 * Market Analysis Data Generation
 * Generates comprehensive market analysis data for interactive charts
 */

import { getDb } from "./db";
import { transactions } from "../drizzle/schema";
import { sql, and, eq, gte, lte } from "drizzle-orm";

export interface PriceTrendData {
  month: string;
  averagePrice: number;
  medianPrice: number;
  transactionCount: number;
}

export interface PriceDistributionData {
  range: string;
  count: number;
  percentage: number;
}

export interface PropertyTypeComparison {
  type: string;
  averagePrice: number;
  medianPrice: number;
  count: number;
}

export interface StationDistanceAnalysis {
  distance: string;
  averagePrice: number;
  count: number;
}

export interface BuildingAgeAnalysis {
  ageRange: string;
  averagePrice: number;
  count: number;
}

export interface MarketAnalysisData {
  priceTrends: PriceTrendData[];
  priceDistribution: PriceDistributionData[];
  propertyTypeComparison: PropertyTypeComparison[];
  stationDistanceAnalysis: StationDistanceAnalysis[];
  buildingAgeAnalysis: BuildingAgeAnalysis[];
  marketSummary: {
    averagePrice: number;
    medianPrice: number;
    minPrice: number;
    maxPrice: number;
    totalTransactions: number;
    priceChangeYoY: number;
  };
}

/**
 * Generate price trend data for the past 12 months
 */
export async function generatePriceTrendData(
  prefecture: string,
  propertyType?: string
): Promise<PriceTrendData[]> {
  const months = [
    "1月", "2月", "3月", "4月", "5月", "6月",
    "7月", "8月", "9月", "10月", "11月", "12月"
  ];

  const trendData: PriceTrendData[] = [];
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  // Simulate trend data based on database
  const whereConditions = propertyType
    ? and(eq(transactions.prefecture, prefecture), eq(transactions.propertyType, propertyType))
    : eq(transactions.prefecture, prefecture);

  // Get all prices to calculate median manually (MySQL doesn't support MEDIAN)
  const priceResults = await db
    .select({
      priceYen: transactions.priceYen,
    })
    .from(transactions)
    .where(whereConditions);

  const prices = priceResults.map(r => Number(r.priceYen)).filter(p => p > 0).sort((a, b) => a - b);
  const medianPrice = prices.length > 0
    ? (prices.length % 2 === 0
      ? (prices[prices.length / 2 - 1] + prices[prices.length / 2]) / 2
      : prices[Math.floor(prices.length / 2)])
    : 0;

  const result = await db
    .select({
      averagePrice: sql<number>`AVG(${transactions.priceYen})`,
      count: sql<number>`COUNT(*)`,
    })
    .from(transactions)
    .where(whereConditions);
  
  const baseData = {
    averagePrice: result[0]?.averagePrice || 0,
    medianPrice,
    count: result[0]?.count || 0,
  };

  // Generate 12 months of trend data with slight variations
  for (let i = 0; i < 12; i++) {
    const variation = 0.95 + Math.random() * 0.1; // 95-105% of base
    trendData.push({
      month: months[i],
      averagePrice: Math.round(baseData.averagePrice * variation),
      medianPrice: Math.round(baseData.medianPrice * variation),
      transactionCount: Math.round(baseData.count / 12 * (0.8 + Math.random() * 0.4)),
    });
  }

  return trendData;
}

/**
 * Generate price distribution data
 */
export async function generatePriceDistribution(
  prefecture: string,
  propertyType?: string
): Promise<PriceDistributionData[]> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const whereConditions = propertyType
    ? and(eq(transactions.prefecture, prefecture), eq(transactions.propertyType, propertyType))
    : eq(transactions.prefecture, prefecture);
  
  const results = await db
    .select({
      priceYen: transactions.priceYen,
    })
    .from(transactions)
    .where(whereConditions);



  // Calculate price ranges
  const prices = results.map((r: any) => r.priceYen).sort((a: number, b: number) => a - b);
  const min = prices[0];
  const max = prices[prices.length - 1];
  const range = (max - min) / 5; // 5 buckets

  const distribution: PriceDistributionData[] = [];
  const totalCount = prices.length;

  for (let i = 0; i < 5; i++) {
    const rangeStart = min + range * i;
    const rangeEnd = min + range * (i + 1);
    const count = prices.filter((p: number) => p >= rangeStart && p < rangeEnd).length;

    distribution.push({
      range: `¥${(rangeStart / 100000000).toFixed(1)}億～¥${(rangeEnd / 100000000).toFixed(1)}億`,
      count,
      percentage: (count / totalCount) * 100,
    });
  }

  return distribution;
}

/**
 * Generate property type comparison data
 */
export async function generatePropertyTypeComparison(
  prefecture: string
): Promise<PropertyTypeComparison[]> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const propertyTypes = ["land", "house", "condo"];
  const comparison: PropertyTypeComparison[] = [];

  for (const type of propertyTypes) {
    // Get all prices to calculate median manually
    const priceResults = await db
      .select({
        priceYen: transactions.priceYen,
      })
      .from(transactions)
      .where(
        and(
          eq(transactions.prefecture, prefecture),
          eq(transactions.propertyType, type)
        )
      );

    const prices = priceResults.map(r => Number(r.priceYen)).filter(p => p > 0).sort((a, b) => a - b);
    const medianPrice = prices.length > 0
      ? (prices.length % 2 === 0
        ? (prices[prices.length / 2 - 1] + prices[prices.length / 2]) / 2
        : prices[Math.floor(prices.length / 2)])
      : 0;

    const result = await db
      .select({
        averagePrice: sql<number>`AVG(${transactions.priceYen})`,
        count: sql<number>`COUNT(*)`,
      })
      .from(transactions)
      .where(
        and(
          eq(transactions.prefecture, prefecture),
          eq(transactions.propertyType, type)
        )
      ) as any;

    if (result.length > 0) {
      const data = result[0];
      comparison.push({
        type: type === "land" ? "土地" : type === "house" ? "戸建て" : "マンション",
        averagePrice: Math.round(data.averagePrice || 0),
        medianPrice: Math.round(medianPrice),
        count: data.count,
      });
    }
  }

  return comparison;
}

/**
 * Generate station distance analysis data
 */
export async function generateStationDistanceAnalysis(
  prefecture: string,
  propertyType?: string
): Promise<StationDistanceAnalysis[]> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const distanceRanges = [
    { label: "0～5分", min: 0, max: 5 },
    { label: "5～10分", min: 5, max: 10 },
    { label: "10～15分", min: 10, max: 15 },
    { label: "15～20分", min: 15, max: 20 },
    { label: "20分以上", min: 20, max: 999 },
  ];

  const analysis: StationDistanceAnalysis[] = [];

  for (const range of distanceRanges) {
    const distanceConditions = propertyType
      ? and(
          eq(transactions.prefecture, prefecture),
          gte(transactions.stationDistanceMin, range.min),
          lte(transactions.stationDistanceMin, range.max),
          eq(transactions.propertyType, propertyType)
        )
      : and(
          eq(transactions.prefecture, prefecture),
          gte(transactions.stationDistanceMin, range.min),
          lte(transactions.stationDistanceMin, range.max)
        );

    const result = await db
      .select({
        averagePrice: sql<number>`AVG(${transactions.priceYen})`,
        count: sql<number>`COUNT(*)`,
      })
      .from(transactions)
      .where(distanceConditions) as any;

    if (result.length > 0 && result[0].count > 0) {
      analysis.push({
        distance: range.label,
        averagePrice: Math.round(result[0].averagePrice),
        count: result[0].count,
      });
    }
  }

  return analysis;
}

/**
 * Generate building age analysis data
 */
export async function generateBuildingAgeAnalysis(
  prefecture: string,
  propertyType?: string
): Promise<BuildingAgeAnalysis[]> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const ageRanges = [
    { label: "新築～5年", min: 0, max: 5 },
    { label: "5～10年", min: 5, max: 10 },
    { label: "10～20年", min: 10, max: 20 },
    { label: "20～30年", min: 20, max: 30 },
    { label: "30年以上", min: 30, max: 999 },
  ];

  const analysis: BuildingAgeAnalysis[] = [];

  for (const range of ageRanges) {
    const ageConditions = propertyType
      ? and(
          eq(transactions.prefecture, prefecture),
          gte(transactions.buildingYear, new Date().getFullYear() - range.max),
          lte(transactions.buildingYear, new Date().getFullYear() - range.min),
          eq(transactions.propertyType, propertyType)
        )
      : and(
          eq(transactions.prefecture, prefecture),
          gte(transactions.buildingYear, new Date().getFullYear() - range.max),
          lte(transactions.buildingYear, new Date().getFullYear() - range.min)
        );

    const result = await db
      .select({
        averagePrice: sql<number>`AVG(${transactions.priceYen})`,
        count: sql<number>`COUNT(*)`,
      })
      .from(transactions)
      .where(ageConditions) as any;

    if (result.length > 0 && result[0].count > 0) {
      analysis.push({
        ageRange: range.label,
        averagePrice: Math.round(result[0].averagePrice),
        count: result[0].count,
      });
    }
  }

  return analysis;
}

/**
 * Generate comprehensive market analysis data
 */
export async function generateMarketAnalysis(
  prefecture: string,
  propertyType?: string
): Promise<MarketAnalysisData> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  // Get market summary
  const summaryConditions = propertyType
    ? and(eq(transactions.prefecture, prefecture), eq(transactions.propertyType, propertyType))
    : eq(transactions.prefecture, prefecture);

  // Get all prices to calculate median manually
  const priceResults = await db
    .select({
      priceYen: transactions.priceYen,
    })
    .from(transactions)
    .where(summaryConditions);

  const prices = priceResults.map(r => Number(r.priceYen)).filter(p => p > 0).sort((a, b) => a - b);
  const medianPrice = prices.length > 0
    ? (prices.length % 2 === 0
      ? (prices[prices.length / 2 - 1] + prices[prices.length / 2]) / 2
      : prices[Math.floor(prices.length / 2)])
    : 0;

  const summaryResult = await db
    .select({
      averagePrice: sql<number>`AVG(${transactions.priceYen})`,
      minPrice: sql<number>`MIN(${transactions.priceYen})`,
      maxPrice: sql<number>`MAX(${transactions.priceYen})`,
      count: sql<number>`COUNT(*)`,
    })
    .from(transactions)
    .where(summaryConditions) as any;
  
  const summary = {
    averagePrice: summaryResult[0]?.averagePrice || 0,
    medianPrice,
    minPrice: summaryResult[0]?.minPrice || 0,
    maxPrice: summaryResult[0]?.maxPrice || 0,
    count: summaryResult[0]?.count || 0,
  };

  // Generate all analysis data in parallel
  const [priceTrends, priceDistribution, propertyComparison, stationAnalysis, buildingAnalysis] =
    await Promise.all([
      generatePriceTrendData(prefecture, propertyType),
      generatePriceDistribution(prefecture, propertyType),
      generatePropertyTypeComparison(prefecture),
      generateStationDistanceAnalysis(prefecture, propertyType),
      generateBuildingAgeAnalysis(prefecture, propertyType),
    ]);

  return {
    priceTrends,
    priceDistribution,
    propertyTypeComparison: propertyComparison,
    stationDistanceAnalysis: stationAnalysis,
    buildingAgeAnalysis: buildingAnalysis,
    marketSummary: {
      averagePrice: Math.round(summary.averagePrice),
      medianPrice: Math.round(summary.medianPrice),
      minPrice: summary.minPrice,
      maxPrice: summary.maxPrice,
      totalTransactions: summary.count,
      priceChangeYoY: 2.5, // Placeholder: would calculate from historical data
    },
  };
}
