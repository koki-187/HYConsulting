import { eq, and, like } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, assessmentRequests, propertyDatabase, InsertAssessmentRequest, InsertPropertyDatabase } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
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
  const db = await getDb();
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
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }
  
  const result = await db.insert(assessmentRequests).values(request);
  return result;
}

export async function getAssessmentRequests(limit: number = 100, offset: number = 0) {
  const db = await getDb();
  if (!db) {
    return [];
  }
  
  const results = await db.select().from(assessmentRequests).limit(limit).offset(offset);
  return results;
}

/**
 * Property Database Helpers for Assessment Calculation
 */
export async function findSimilarProperties(
  propertyType: string,
  location: string,
  buildingAge: number,
  floorArea: number,
  condition: string
) {
  const db = await getDb();
  if (!db) {
    return [];
  }
  
  // Find properties with similar characteristics
  const results = await db.select().from(propertyDatabase).where(
    and(
      eq(propertyDatabase.propertyType, propertyType),
      like(propertyDatabase.location, `%${location}%`)
    )
  ).limit(10);
  
  // Filter by building age and floor area in JavaScript
  const filtered = results.filter(prop => {
    const ageMatch = Math.abs(prop.buildingAge - buildingAge) <= 5;
    const areaMatch = prop.floorArea >= floorArea * 0.8 && prop.floorArea <= floorArea * 1.2;
    return ageMatch && areaMatch;
  });
  
  return filtered;
}

export async function calculateAssessmentPrice(
  propertyType: string,
  location: string,
  buildingAge: number,
  floorArea: number,
  condition: string
): Promise<number | null> {
  const similarProperties = await findSimilarProperties(
    propertyType,
    location,
    buildingAge,
    floorArea,
    condition
  );
  
  if (similarProperties.length === 0) {
    return null;
  }
  
  // Calculate average price per square meter
  const avgPricePerSqm = similarProperties.reduce((sum, prop) => sum + prop.pricePerSqm, 0) / similarProperties.length;
  
  // Apply condition adjustment
  const conditionMultiplier: Record<string, number> = {
    "excellent": 1.2,
    "good": 1.0,
    "fair": 0.8,
    "poor": 0.6,
  };
  
  const adjustedPricePerSqm = avgPricePerSqm * (conditionMultiplier[condition] || 1.0);
  const estimatedPrice = Math.round(adjustedPricePerSqm * floorArea);
  
  return estimatedPrice;
}

export async function seedPropertyDatabase() {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }
  
  // Sample data from the Google Drive spreadsheet
  const sampleData: InsertPropertyDatabase[] = [
    {
      propertyType: "apartment",
      location: "横浜市戸塚区",
      buildingAge: 5,
      floorArea: 100,
      condition: "excellent",
      soldPrice: 2150,
      pricePerSqm: 215,
    },
    {
      propertyType: "apartment",
      location: "横浜市戸塚区",
      buildingAge: 8,
      floorArea: 95,
      condition: "good",
      soldPrice: 2070,
      pricePerSqm: 218,
    },
    {
      propertyType: "apartment",
      location: "横浜市緑区",
      buildingAge: 10,
      floorArea: 110,
      condition: "good",
      soldPrice: 1800,
      pricePerSqm: 164,
    },
    {
      propertyType: "house",
      location: "横浜市戸塚区",
      buildingAge: 15,
      floorArea: 150,
      condition: "fair",
      soldPrice: 1500,
      pricePerSqm: 100,
    },
    {
      propertyType: "house",
      location: "横浜市緑区",
      buildingAge: 20,
      floorArea: 160,
      condition: "fair",
      soldPrice: 1200,
      pricePerSqm: 75,
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

// TODO: add more feature queries here as your schema grows.
