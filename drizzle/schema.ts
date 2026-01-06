import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, decimal, index } from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Property Assessment Requests
 * Stores assessment form submissions from the LP
 */
export const assessmentRequests = mysqlTable("assessment_requests", {
  id: int("id").autoincrement().primaryKey(),
  // Property Information
  propertyType: varchar("propertyType", { length: 50 }).notNull(), // "apartment", "house", "land", "commercial"
  prefecture: varchar("prefecture", { length: 50 }).notNull(), // For filtering
  city: varchar("city", { length: 100 }).notNull(), // For filtering
  location: varchar("location", { length: 255 }).notNull(),
  buildingAge: int("buildingAge"), // Years
  floorArea: int("floorArea"), // Square meters
  landArea: int("landArea"), // Square meters
  condition: varchar("condition", { length: 50 }), // "excellent", "good", "fair", "poor"
  // Contact Information
  ownerName: varchar("ownerName", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 20 }),
  // Assessment Result
  estimatedPrice: int("estimatedPrice"), // In 万円 (10,000 yen units)
  assessmentStatus: varchar("assessmentStatus", { length: 50 }).default("pending"), // "pending", "completed", "rejected", "error"
  errorMessage: text("errorMessage"), // For error tracking
  // Timestamps
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type AssessmentRequest = typeof assessmentRequests.$inferSelect;
export type InsertAssessmentRequest = typeof assessmentRequests.$inferInsert;

/**
 * Property Database for Assessment Calculation
 * Contains reference data for price estimation (約10万件のデータ)
 */
export const propertyDatabase = mysqlTable("property_database", {
  id: int("id").autoincrement().primaryKey(),
  propertyType: varchar("propertyType", { length: 50 }).notNull(),
  prefecture: varchar("prefecture", { length: 50 }).notNull(), // For filtering
  city: varchar("city", { length: 100 }).notNull(), // For filtering
  location: varchar("location", { length: 255 }).notNull(),
  buildingAge: int("buildingAge").notNull(),
  floorArea: int("floorArea").notNull(),
  condition: varchar("condition", { length: 50 }).notNull(),
  soldPrice: int("soldPrice").notNull(), // In 万円
  pricePerSqm: decimal("pricePerSqm", { precision: 10, scale: 2 }).notNull(), // Price per square meter in 万円
  transactionDate: varchar("transactionDate", { length: 50 }), // For trend analysis (YYYY-MM format)
  source: varchar("source", { length: 100 }).default("MLIT"), // Ministry of Land, Infrastructure, Transport and Tourism
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type PropertyDatabase = typeof propertyDatabase.$inferSelect;
export type InsertPropertyDatabase = typeof propertyDatabase.$inferInsert;

/**
 * Assessment Reports
 * Stores detailed assessment reports (market analysis, valuation, forecast)
 */
export const assessmentReports = mysqlTable("assessment_reports", {
  id: int("id").autoincrement().primaryKey(),
  assessmentRequestId: int("assessmentRequestId").notNull(),
  // Market Analysis Report (市場分析レポート)
  surroundingPrice: int("surroundingPrice"), // Average price in 万円
  transactionCount: int("transactionCount"), // Number of transactions
  avgPricePerSqm: decimal("avgPricePerSqm", { precision: 10, scale: 2 }), // Average price per sqm
  vacancyRate: varchar("vacancyRate", { length: 50 }), // Percentage
  marketTrend: varchar("marketTrend", { length: 50 }), // "rising", "stable", "declining"
  // Valuation Report (価値評価レポート)
  estimatedPrice: int("estimatedPrice"), // In 万円
  priceRangeMin: int("priceRangeMin"), // In 万円
  priceRangeMax: int("priceRangeMax"), // In 万円
  evaluationPoints: text("evaluationPoints"), // JSON array of key evaluation factors
  investmentValue: varchar("investmentValue", { length: 50 }), // "high", "medium", "low"
  // Forecast Report (将来予測レポート)
  forecast1Year: int("forecast1Year"), // In 万円
  forecast3Year: int("forecast3Year"), // In 万円
  forecast5Year: int("forecast5Year"), // In 万円
  forecastReasoning: text("forecastReasoning"), // Explanation of forecast
  // Status & Error Handling
  status: mysqlEnum("status", ["pending", "completed", "error"]).default("pending").notNull(),
  errorMessage: text("errorMessage"), // For error tracking
  retryCount: int("retryCount").default(0), // Track retry attempts
  // Timestamps
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type AssessmentReport = typeof assessmentReports.$inferSelect;
export type InsertAssessmentReport = typeof assessmentReports.$inferInsert;

/**
 * Audit Log
 * Tracks all assessment operations for debugging and compliance
 */
export const auditLog = mysqlTable("audit_log", {
  id: int("id").autoincrement().primaryKey(),
  assessmentRequestId: int("assessmentRequestId"),
  action: varchar("action", { length: 100 }).notNull(), // "submit", "calculate", "error", "retry"
  details: text("details"), // JSON details
  status: varchar("status", { length: 50 }).notNull(), // "success", "failure"
  errorCode: varchar("errorCode", { length: 50 }), // For error categorization
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type AuditLog = typeof auditLog.$inferSelect;
export type InsertAuditLog = typeof auditLog.$inferInsert;

/**
 * Dataset Versions
 * Tracks data ingestion history for reproducibility and audit trail
 * Based on MLIT (Ministry of Land, Infrastructure, Transport and Tourism) data
 */
export const datasetVersions = mysqlTable(
  "dataset_versions",
  {
    id: varchar("id", { length: 100 }).primaryKey(), // e.g., "mlit_tx_2025Q3"
    source: varchar("source", { length: 255 }).notNull(), // e.g., "MLIT 不動産取引価格情報"
    description: text("description"),
    publishedDate: varchar("publishedDate", { length: 50 }), // YYYY-MM-DD
    ingestedAt: timestamp("ingestedAt").defaultNow().notNull(), // ISO8601
    checksum: varchar("checksum", { length: 255 }), // For data integrity verification
    notes: text("notes"),
  },
  (table) => ({
    sourceIdx: index("idx_dataset_source").on(table.source),
  })
);

export type DatasetVersion = typeof datasetVersions.$inferSelect;
export type InsertDatasetVersion = typeof datasetVersions.$inferInsert;

/**
 * Regions (地域マスタ)
 * Master data for geographic regions (prefectures, cities, wards, districts)
 */
export const regions = mysqlTable(
  "regions",
  {
    id: int("id").autoincrement().primaryKey(),
    prefecture: varchar("prefecture", { length: 50 }).notNull(), // e.g., "神奈川県"
    city: varchar("city", { length: 100 }).notNull(), // e.g., "横浜市"
    ward: varchar("ward", { length: 100 }), // e.g., "西区"
    district: varchar("district", { length: 100 }), // e.g., "みなとみらい"
    geoCode: varchar("geoCode", { length: 20 }), // e.g., "14103"
    lat: decimal("lat", { precision: 10, scale: 6 }), // Latitude
    lon: decimal("lon", { precision: 10, scale: 6 }), // Longitude
  },
  (table) => ({
    prefectureIdx: index("idx_region_prefecture").on(table.prefecture),
    cityIdx: index("idx_region_city").on(table.city),
    prefectureCityIdx: index("idx_region_pref_city").on(table.prefecture, table.city),
  })
);

export type Region = typeof regions.$inferSelect;
export type InsertRegion = typeof regions.$inferInsert;

/**
 * Transactions (取引データ)
 * Real estate transaction data from MLIT
 * Contains ~100,000 records covering 19 prefectures, 1,852 municipalities
 */
export const transactions = mysqlTable(
  "transactions",
  {
    id: int("id").autoincrement().primaryKey(),
    datasetVersionId: varchar("datasetVersionId", { length: 100 }).notNull(), // Foreign key to dataset_versions
    transactionYm: varchar("transactionYm", { length: 50 }).notNull(), // YYYY-MM format
    prefecture: varchar("prefecture", { length: 50 }).notNull(),
    city: varchar("city", { length: 100 }).notNull(),
    ward: varchar("ward", { length: 100 }),
    district: varchar("district", { length: 100 }),
    propertyType: varchar("propertyType", { length: 50 }).notNull(), // "land", "house", "condo"
    landAreaM2: decimal("landAreaM2", { precision: 12, scale: 2 }), // 土地面積 (square meters)
    buildingAreaM2: decimal("buildingAreaM2", { precision: 12, scale: 2 }), // 延床 (square meters)
    buildingYear: int("buildingYear"), // 築年 (year built)
    structure: varchar("structure", { length: 100 }), // e.g., "木造", "鉄筋コンクリート"
    floorPlan: varchar("floorPlan", { length: 100 }), // e.g., "3LDK"
    floor: int("floor"), // Floor number
    nearestStation: varchar("nearestStation", { length: 100 }), // 最寄り駅
    stationDistanceMin: int("stationDistanceMin"), // 駅距離 (walking minutes)
    priceYen: int("priceYen").notNull(), // 価格 (price in yen)
    unitPriceYenPerM2: decimal("unitPriceYenPerM2", { precision: 15, scale: 2 }), // 単価 (price per sqm)
    lat: decimal("lat", { precision: 10, scale: 6 }), // Latitude
    lon: decimal("lon", { precision: 10, scale: 6 }), // Longitude
    remarks: text("remarks"), // 備考
  },
  (table) => ({
    datasetVersionIdx: index("idx_tx_dataset").on(table.datasetVersionId),
    prefectureIdx: index("idx_tx_prefecture").on(table.prefecture),
    cityIdx: index("idx_tx_city").on(table.city),
    propertyTypeIdx: index("idx_tx_property_type").on(table.propertyType),
    transactionYmIdx: index("idx_tx_transaction_ym").on(table.transactionYm),
    prefectureCityTypeIdx: index("idx_tx_pref_city_type").on(
      table.prefecture,
      table.city,
      table.propertyType
    ),
  })
);

export type Transaction = typeof transactions.$inferSelect;
export type InsertTransaction = typeof transactions.$inferInsert;

/**
 * Valuation Requests (査定リクエスト)
 * Enhanced version of assessment_requests with MLIT-aligned fields
 */
export const valuationRequests = mysqlTable(
  "valuation_requests",
  {
    id: varchar("id", { length: 100 }).primaryKey(), // UUID or custom ID
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    // Input Information
    inputPrefecture: varchar("inputPrefecture", { length: 50 }).notNull(),
    inputCity: varchar("inputCity", { length: 100 }).notNull(),
    inputWard: varchar("inputWard", { length: 100 }),
    inputDistrict: varchar("inputDistrict", { length: 100 }),
    propertyType: varchar("propertyType", { length: 50 }).notNull(), // "land", "house", "condo"
    landAreaM2: decimal("landAreaM2", { precision: 12, scale: 2 }),
    buildingAreaM2: decimal("buildingAreaM2", { precision: 12, scale: 2 }),
    buildingYear: int("buildingYear"),
    stationDistanceMin: int("stationDistanceMin"),
    // Additional Context
    ownershipType: varchar("ownershipType", { length: 50 }), // "single", "shared"
    inheritanceFlag: int("inheritanceFlag").default(0), // 0 or 1 (相続フラグ)
    // Contact Information
    ownerName: varchar("ownerName", { length: 255 }),
    email: varchar("email", { length: 320 }),
    phone: varchar("phone", { length: 20 }),
    // Notes
    notes: text("notes"),
    // Status
    status: varchar("status", { length: 50 }).default("pending"), // "pending", "completed", "error"
  },
  (table) => ({
    createdAtIdx: index("idx_valuation_req_created").on(table.createdAt),
    prefectureIdx: index("idx_valuation_req_prefecture").on(table.inputPrefecture),
    propertyTypeIdx: index("idx_valuation_req_property_type").on(table.propertyType),
  })
);

export type ValuationRequest = typeof valuationRequests.$inferSelect;
export type InsertValuationRequest = typeof valuationRequests.$inferInsert;

/**
 * Valuation Results (査定結果)
 * Enhanced version of assessment_reports with MLIT-aligned calculation details
 */
export const valuationResults = mysqlTable(
  "valuation_results",
  {
    id: int("id").autoincrement().primaryKey(),
    requestId: varchar("requestId", { length: 100 }).notNull(), // Foreign key to valuation_requests
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    // Valuation Results
    estimatedLowYen: int("estimatedLowYen").notNull(), // 概算下限
    estimatedHighYen: int("estimatedHighYen").notNull(), // 概算上限
    estimatedMidYen: int("estimatedMidYen"), // 概算中央値 (calculated)
    // Methodology
    compsUsedCount: int("compsUsedCount").notNull(), // Number of comparable transactions
    method: varchar("method", { length: 100 }).notNull(), // e.g., "median_comps_adjusted"
    methodVersion: varchar("methodVersion", { length: 50 }).notNull(), // e.g., "v0.1"
    explanation: text("explanation"), // User-facing explanation
    // Detailed Analysis
    marketAnalysis: text("marketAnalysis"), // JSON: market trends, surrounding prices
    adjustmentFactors: text("adjustmentFactors"), // JSON: building year, station distance, etc.
    forecastAnalysis: text("forecastAnalysis"), // JSON: 1-year, 3-year, 5-year forecasts
    // Status
    status: varchar("status", { length: 50 }).default("completed"), // "pending", "completed", "error"
    errorMessage: text("errorMessage"),
  },
  (table) => ({
    requestIdIdx: index("idx_valuation_result_request").on(table.requestId),
    createdAtIdx: index("idx_valuation_result_created").on(table.createdAt),
  })
);

export type ValuationResult = typeof valuationResults.$inferSelect;
export type InsertValuationResult = typeof valuationResults.$inferInsert;

/**
 * Aggregated Real Estate Data (集計不動産データ)
 * Nationwide aggregated transaction data by property type, location, and building age group
 * Source: MLIT (Ministry of Land, Infrastructure, Transport and Tourism)
 * Coverage: 47 prefectures, 7,760 municipalities, 189,391 districts
 */
export const aggregatedRealEstateData = mysqlTable(
  "aggregated_real_estate_data",
  {
    id: int("id").autoincrement().primaryKey(),
    // Geographic Information
    propertyType: varchar("propertyType", { length: 50 }).notNull(), // "マンション", "一戸建て", "土地", "林地", "農地"
    prefecture: varchar("prefecture", { length: 50 }).notNull(),
    city: varchar("city", { length: 100 }).notNull(),
    district: varchar("district", { length: 100 }).notNull(),
    // Building Age Group
    buildingAgeGroup: varchar("buildingAgeGroup", { length: 50 }).notNull(), // "0～5年", "5～10年", "10～15年", "15～20年", "20～30年", "30年以上", "不明"
    // Aggregated Data
    totalPriceYen: decimal("totalPriceYen", { precision: 20, scale: 2 }).notNull(), // Total price in yen
    totalAreaM2: decimal("totalAreaM2", { precision: 15, scale: 2 }).notNull(), // Total area in square meters
    transactionCount: int("transactionCount").notNull(), // Number of transactions
    pricePerTsubo: int("pricePerTsubo").notNull(), // Price per tsubo (yen/坪)
    averagePriceYen: int("averagePriceYen").notNull(), // Average price in yen
    averageAreaM2: decimal("averageAreaM2", { precision: 10, scale: 2 }).notNull(), // Average area in square meters
    // Metadata
    datasetVersionId: varchar("datasetVersionId", { length: 100 }).notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (table) => ({
    // Composite index for assessment queries
    lookupIdx: index("idx_agg_lookup").on(
      table.propertyType,
      table.prefecture,
      table.city,
      table.district,
      table.buildingAgeGroup
    ),
    prefectureIdx: index("idx_agg_prefecture").on(table.prefecture),
    cityIdx: index("idx_agg_city").on(table.city),
    propertyTypeIdx: index("idx_agg_property_type").on(table.propertyType),
    prefectureCityIdx: index("idx_agg_pref_city").on(table.prefecture, table.city),
  })
);

export type AggregatedRealEstateData = typeof aggregatedRealEstateData.$inferSelect;
export type InsertAggregatedRealEstateData = typeof aggregatedRealEstateData.$inferInsert;

/**
 * Assessment Error Log (査定エラーログ)
 * Tracks all assessment errors for debugging and monitoring
 */
export const assessmentErrorLog = mysqlTable("assessment_error_log", {
  id: int("id").autoincrement().primaryKey(),
  errorType: varchar("errorType", { length: 100 }).notNull(), // "DATA_NOT_FOUND", "VALIDATION_ERROR", "CALCULATION_ERROR", "SYSTEM_ERROR"
  input: text("input").notNull(), // JSON string of input parameters
  errorMessage: text("errorMessage"),
  stackTrace: text("stackTrace"),
  userMessage: text("userMessage"), // User-facing error message
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type AssessmentErrorLog = typeof assessmentErrorLog.$inferSelect;
export type InsertAssessmentErrorLog = typeof assessmentErrorLog.$inferInsert;

/**
 * Relations
 */
export const transactionsRelations = relations(transactions, ({ one }) => ({
  datasetVersion: one(datasetVersions, {
    fields: [transactions.datasetVersionId],
    references: [datasetVersions.id],
  }),
}));

export const valuationResultsRelations = relations(valuationResults, ({ one }) => ({
  valuationRequest: one(valuationRequests, {
    fields: [valuationResults.requestId],
    references: [valuationRequests.id],
  }),
}));
