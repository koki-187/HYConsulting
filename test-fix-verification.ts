// Test script to verify the fix
import { db } from "./server/db";
import { transactions } from "./drizzle/schema";
import { eq, and } from "drizzle-orm";

async function testFixVerification() {
  try {
    console.log("=== Fix Verification Test ===\n");

    // Get Kodaira data
    const kodairaData = await db
      .select()
      .from(transactions)
      .where(
        and(
          eq(transactions.city, "小平市"),
          eq(transactions.propertyType, "宅地(土地と建物)")
        )
      );

    console.log(`Found ${kodairaData.length} records for Kodaira`);
    
    if (kodairaData.length > 0) {
      console.log("\nFirst 3 records:");
      kodairaData.slice(0, 3).forEach((record, index) => {
        console.log(`Record ${index + 1}:`);
        console.log(`  priceYen: ${record.priceYen}`);
        console.log(`  priceManYen (calculated): ${Math.round(record.priceYen / 10000)}`);
      });
    }

    // Simulate the fix
    console.log("\n=== Simulating the Fix ===\n");
    
    // Original (broken) logic
    const estimatedLowYen = 23000000; // 2,300万円 (from calculation)
    const estimatedHighYen = 26450000; // 2,645万円 (from calculation)
    
    console.log("Original values (from calculation):");
    console.log(`  estimatedLowYen: ${estimatedLowYen} (${estimatedLowYen / 10000}万円)`);
    console.log(`  estimatedHighYen: ${estimatedHighYen} (${estimatedHighYen / 10000}万円)`);
    
    // Fixed logic
    const estimatedLowManYen = Math.round(estimatedLowYen / 10000);
    const estimatedHighManYen = Math.round(estimatedHighYen / 10000);
    
    console.log("\nAfter fix (converted to 万円):");
    console.log(`  estimatedLowManYen: ${estimatedLowManYen}万円`);
    console.log(`  estimatedHighManYen: ${estimatedHighManYen}万円`);
    
    // Frontend display (after fix)
    console.log("\nFrontend display (after fix):");
    console.log(`  formatPrice(${estimatedLowManYen}): ${estimatedLowManYen}万円`);
    console.log(`  formatPrice(${estimatedHighManYen}): ${estimatedHighManYen}万円`);
    
    // What's actually showing (153,103万円)
    console.log("\nWhat's actually showing:");
    console.log(`  153,103万円 = ${153103 * 10000}円`);
    console.log(`  Ratio: ${153103 / 2300} (should be close to 1 if fix works)`);
    
  } catch (error) {
    console.error("Error:", error);
  }
}

testFixVerification();
