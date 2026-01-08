import { drizzle } from "drizzle-orm/mysql2";
import { eq } from "drizzle-orm";
import mysql2 from 'mysql2';
import { InsertUser, users, assessmentRequests, propertyDatabase, InsertAssessmentRequest, InsertPropertyDatabase, assessmentReports, auditLog } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;
let _pool: mysql2.Pool | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      // Parse DATABASE_URL and create MySQL2 connection pool
      const dbUrl = new URL(process.env.DATABASE_URL);
      
      const poolConfig: mysql2.PoolOptions = {
        host: dbUrl.hostname,
        port: parseInt(dbUrl.port) || 3306,
        user: dbUrl.username,
        password: dbUrl.password,
        database: dbUrl.pathname.slice(1), // Remove leading '/'
        ssl: {
          rejectUnauthorized: true
        },
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
      };
      
      _pool = mysql2.createPool(poolConfig);
      
      // Create Drizzle instance with the pool
      _db = drizzle(_pool);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
      _pool = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

/**
 * Assessment Request Helpers
 */
export async function createAssessmentRequest(request: InsertAssessmentRequest) {
  const db = getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  try {
    const result = await db.insert(assessmentRequests).values(request);
    console.log("Assessment request created:", result);
    return result;
  } catch (error) {
    console.error("Error creating assessment request:", error);
    throw error;
  }
}

export async function getAssessmentRequests(limit: number = 10, offset: number = 0) {
  const db = getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  try {
    const results = await db.select().from(assessmentRequests).limit(limit).offset(offset);
    return results;
  } catch (error) {
    console.error("Error fetching assessment requests:", error);
    throw error;
  }
}

/**
 * Calculate Assessment Price
 * Analyzes property database to estimate price based on input parameters
 */
export async function calculateAssessmentPrice(
  propertyType: string,
  location: string,
  buildingAge: number,
  floorArea: number,
  condition: string
): Promise<number | null> {
  const db = getDb();
  if (!db) {
    console.warn("[Database] Cannot calculate price: database not available");
    return null;
  }

  try {
    // Find similar properties in database
    const similarProperties = await db
      .select()
      .from(propertyDatabase)
      .where(
        eq(propertyDatabase.propertyType, propertyType)
      );

    if (similarProperties.length === 0) {
      console.warn("No similar properties found for calculation");
      return null;
    }

    // Calculate average price per sqm
    const avgPricePerSqm = similarProperties.reduce((sum, prop) => {
      return sum + Number(prop.pricePerSqm);
    }, 0) / similarProperties.length;

    // Adjust for building age (depreciation)
    const ageAdjustment = Math.max(0.5, 1 - (buildingAge * 0.02));

    // Adjust for condition
    const conditionMultiplier: Record<string, number> = {
      excellent: 1.2,
      good: 1.0,
      fair: 0.85,
      poor: 0.7,
    };
    const conditionFactor = conditionMultiplier[condition] || 0.85;

    // Calculate estimated price
    // pricePerSqm is already in 万円/㎡, so no need to divide by 10000
    const estimatedPrice = Math.round(
      avgPricePerSqm * floorArea * ageAdjustment * conditionFactor
    );

    return estimatedPrice;
  } catch (error) {
    console.error("Error calculating assessment price:", error);
    return null;
  }
}

/**
 * Seed Property Database with Sample Data
 *約10万件のデータは外部から取得し、ここでは代表的なサンプルデータを使用
 */
export async function seedPropertyDatabase() {
  const db = getDb();
  if (!db) {
    console.warn("[Database] Cannot seed: database not available");
    return;
  }

  const sampleData: InsertPropertyDatabase[] = [
    // 横浜市中区 - マンション (テストタロウデータ)
    {
      propertyType: "mansion",
      prefecture: "神奈川県",
      city: "横浜市中区",
      location: "横浜市中区 (横浜駅徒歩5分)",
      buildingAge: 10,
      floorArea: 70,
      condition: "good",
      soldPrice: 3500,
      pricePerSqm: "50.00",
      transactionDate: "2024-01",
      source: "MLIT",
    },
    {
      propertyType: "mansion",
      prefecture: "神奈川県",
      city: "横浜市中区",
      location: "横浜市中区",
      buildingAge: 8,
      floorArea: 75,
      condition: "excellent",
      soldPrice: 4000,
      pricePerSqm: "53.33",
      transactionDate: "2024-02",
      source: "MLIT",
    },
    {
      propertyType: "mansion",
      prefecture: "神奈川県",
      city: "横浜市中区",
      location: "横浜市中区",
      buildingAge: 12,
      floorArea: 65,
      condition: "good",
      soldPrice: 3200,
      pricePerSqm: "49.23",
      transactionDate: "2024-01",
      source: "MLIT",
    },
    // 横浜市戸塚区 - アパート
    {
      propertyType: "apartment",
      prefecture: "神奈川県",
      city: "横浜市戸塚区",
      location: "横浜市戸塚区",
      buildingAge: 5,
      floorArea: 85,
      condition: "excellent",
      soldPrice: 2500,
      pricePerSqm: "29.41",
      transactionDate: "2024-01",
      source: "MLIT",
    },
    {
      propertyType: "apartment",
      prefecture: "神奈川県",
      city: "横浜市戸塚区",
      location: "横浜市戸塚区",
      buildingAge: 8,
      floorArea: 95,
      condition: "good",
      soldPrice: 2070,
      pricePerSqm: "21.79",
      transactionDate: "2024-01",
      source: "MLIT",
    },
    // 横浜市緑区 - アパート
    {
      propertyType: "apartment",
      prefecture: "神奈川県",
      city: "横浜市緑区",
      location: "横浜市緑区",
      buildingAge: 10,
      floorArea: 110,
      condition: "good",
      soldPrice: 1800,
      pricePerSqm: "16.36",
      transactionDate: "2024-01",
      source: "MLIT",
    },
    // 横浜市戸塚区 - 戸建て
    {
      propertyType: "house",
      prefecture: "神奈川県",
      city: "横浜市戸塚区",
      location: "横浜市戸塚区",
      buildingAge: 15,
      floorArea: 150,
      condition: "fair",
      soldPrice: 1500,
      pricePerSqm: "10.00",
      transactionDate: "2024-01",
      source: "MLIT",
    },
    // 横浜市緑区 - 戸建て
    {
      propertyType: "house",
      prefecture: "神奈川県",
      city: "横浜市緑区",
      location: "横浜市緑区",
      buildingAge: 20,
      floorArea: 160,
      condition: "fair",
      soldPrice: 1200,
      pricePerSqm: "7.50",
      transactionDate: "2024-01",
      source: "MLIT",
    },
    // 横浜市戸塚区 - 土地
    {
      propertyType: "land",
      prefecture: "神奈川県",
      city: "横浜市戸塚区",
      location: "横浜市戸塚区",
      buildingAge: 0,
      floorArea: 200,
      condition: "excellent",
      soldPrice: 2000,
      pricePerSqm: "10.00",
      transactionDate: "2024-01",
      source: "MLIT",
    },
    // 横浜市緑区 - 土地
    {
      propertyType: "land",
      prefecture: "神奈川県",
      city: "横浜市緑区",
      location: "横浜市緑区",
      buildingAge: 0,
      floorArea: 250,
      condition: "good",
      soldPrice: 1500,
      pricePerSqm: "6.00",
      transactionDate: "2024-01",
      source: "MLIT",
    },
    // 横浜市戸塚区 - 商業施設
    {
      propertyType: "commercial",
      prefecture: "神奈川県",
      city: "横浜市戸塚区",
      location: "横浜市戸塚区",
      buildingAge: 12,
      floorArea: 300,
      condition: "good",
      soldPrice: 4500,
      pricePerSqm: "15.00",
      transactionDate: "2024-01",
      source: "MLIT",
    },
  ];
  
  // Check if data already exists
  const existing = await db.select().from(propertyDatabase).limit(1);
  if (existing.length > 0) {
    console.log("Property database already seeded");
    return;
  }
  
  await db.insert(propertyDatabase).values(sampleData);
  console.log("Property database seeded with sample data");
}

/**
 * Create Assessment Report
 * Stores detailed assessment results
 */
export async function createAssessmentReport(report: any) {
  const db = getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  try {
    const result = await db.insert(assessmentReports).values(report);
    return result;
  } catch (error) {
    console.error("Error creating assessment report:", error);
    throw error;
  }
}

/**
 * Log Audit Event
 * Tracks all assessment operations for debugging
 */
export async function logAuditEvent(event: any) {
  const db = getDb();
  if (!db) {
    console.warn("[Database] Cannot log audit event: database not available");
    return;
  }

  try {
    await db.insert(auditLog).values(event);
  } catch (error) {
    console.error("Error logging audit event:", error);
  }
}

// TODO: add more feature queries here as your schema grows.
