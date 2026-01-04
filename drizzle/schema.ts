import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, decimal } from "drizzle-orm/mysql-core";

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
