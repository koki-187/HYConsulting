import { getDb } from "./server/db";
const db = getDb();
import { transactions } from "./drizzle/schema";
import { eq, and } from "drizzle-orm";

async function debugKodaira() {
  try {
    console.log("=== Debugging Kodaira Assessment ===\n");

    // Get all transactions for Kodaira
    const kodairaData = await db
      .select()
      .from(transactions)
      .where(
        and(
          eq(transactions.prefecture, "東京都"),
          eq(transactions.city, "小平市"),
          eq(transactions.propertyType, "宅地(土地と建物)")
        )
      )
      .limit(15);

    console.log(`Found ${kodairaData.length} transactions in Kodaira\n`);

    // Display first 5 records with details
    kodairaData.slice(0, 5).forEach((t, i) => {
      console.log(`Record ${i + 1}:`);
      console.log(`  ID: ${t.id}`);
      console.log(`  Property Type: ${t.propertyType}`);
      console.log(`  Prefecture: ${t.prefecture}`);
      console.log(`  City: ${t.city}`);
      console.log(`  Price (Yen): ${t.priceYen}`);
      console.log(`  Price (万円): ${Number(t.priceYen) / 10000}`);
      console.log(`  Building Year: ${t.buildingYear}`);
      console.log(`  Transaction Date: ${t.transactionYm}`);
      console.log("");
    });

    // Calculate statistics
    const prices = kodairaData.map((t) => Number(t.priceYen) || 0).filter((p) => p > 0);
    const sorted = [...prices].sort((a, b) => a - b);
    const median = sorted.length % 2 === 0 
      ? (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2 
      : sorted[Math.floor(sorted.length / 2)];

    console.log("=== Price Statistics ===");
    console.log(`Min: ${sorted[0]} (${sorted[0] / 10000}万円)`);
    console.log(`Median: ${median} (${median / 10000}万円)`);
    console.log(`Max: ${sorted[sorted.length - 1]} (${sorted[sorted.length - 1] / 10000}万円)`);
    console.log(`Average: ${prices.reduce((a, b) => a + b, 0) / prices.length} (${prices.reduce((a, b) => a + b, 0) / prices.length / 10000}万円)`);

  } catch (error) {
    console.error("Error:", error);
  }
}

debugKodaira();
