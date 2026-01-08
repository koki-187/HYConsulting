import { getDb } from './server/db';
import { transactions } from './drizzle/schema';
import { eq, and, gte, lte, sql } from 'drizzle-orm';

async function testAssessment() {
  console.log("Testing assessment query...");
  
  const db = getDb();
  if (!db) {
    console.error("Database not available!");
    return;
  }
  
  console.log("Database connection established");
  
  // Test query: Find Tokyo Shinjuku houses
  const prefecture = "東京都";
  const city = "新宿区";
  const propertyType = "宅地(土地と建物)";
  
  console.log(`Searching for: ${prefecture} ${city} ${propertyType}`);
  
  try {
    const results = await db
      .select()
      .from(transactions)
      .where(
        and(
          eq(transactions.prefecture, prefecture),
          eq(transactions.city, city),
          eq(transactions.propertyType, propertyType)
        )
      )
      .limit(10);
    
    console.log(`Found ${results.length} results`);
    if (results.length > 0) {
      console.log("Sample result:", JSON.stringify(results[0], null, 2));
    }
  } catch (error) {
    console.error("Query failed:", error);
  }
}

testAssessment().catch(console.error);
