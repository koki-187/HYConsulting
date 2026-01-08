import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import { eq, and } from "drizzle-orm";
import { transactions } from "./drizzle/schema.ts";

const sqlite = new Database("./local.db");
const db = drizzle(sqlite);

// Check for Tokyo + Shibuya data
const results = await db
  .select()
  .from(transactions)
  .where(
    and(
      eq(transactions.prefecture, "東京都"),
      eq(transactions.city, "渋谷区")
    )
  )
  .limit(10);

console.log(`Found ${results.length} transactions for 東京都渋谷区`);
if (results.length > 0) {
  console.log("Sample data:", JSON.stringify(results[0], null, 2));
}

// Check all Tokyo cities
const tokyoCities = await db
  .select({ city: transactions.city })
  .from(transactions)
  .where(eq(transactions.prefecture, "東京都"))
  .groupBy(transactions.city)
  .limit(50);

console.log("\nAvailable Tokyo cities:", tokyoCities.map(r => r.city).join(", "));

sqlite.close();
