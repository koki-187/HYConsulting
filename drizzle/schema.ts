import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

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
  assessmentStatus: varchar("assessmentStatus", { length: 50 }).default("pending"), // "pending", "completed", "rejected"
  // Timestamps
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type AssessmentRequest = typeof assessmentRequests.$inferSelect;
export type InsertAssessmentRequest = typeof assessmentRequests.$inferInsert;

/**
 * Property Database for Assessment Calculation
 * Contains reference data for price estimation
 */
export const propertyDatabase = mysqlTable("property_database", {
  id: int("id").autoincrement().primaryKey(),
  propertyType: varchar("propertyType", { length: 50 }).notNull(),
  location: varchar("location", { length: 255 }).notNull(),
  buildingAge: int("buildingAge").notNull(),
  floorArea: int("floorArea").notNull(),
  condition: varchar("condition", { length: 50 }).notNull(),
  soldPrice: int("soldPrice").notNull(), // In 万円
  pricePerSqm: int("pricePerSqm").notNull(), // Price per square meter in 万円
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type PropertyDatabase = typeof propertyDatabase.$inferSelect;
export type InsertPropertyDatabase = typeof propertyDatabase.$inferInsert;