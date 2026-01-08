import { getDb } from "./server/db";
import { transactions } from "./drizzle/schema";
import { eq, and } from "drizzle-orm";

async function verifyPrices() {
  console.log("=== Verifying Kodaira Property Prices ===\n");

  const db = getDb();
  if (!db) {
    console.error("Database not initialized");
    process.exit(1);
  }

  // Query small sample
  const results = await db
    .select({
      priceYen: transactions.priceYen,
      buildingAreaM2: transactions.buildingAreaM2,
      buildingYear: transactions.buildingYear,
      prefecture: transactions.prefecture,
      city: transactions.city,
      propertyType: transactions.propertyType,
    })
    .from(transactions)
    .where(
      and(
        eq(transactions.prefecture, "東京都"),
        eq(transactions.city, "小平市"),
        eq(transactions.propertyType, "宅地(土地と建物)")
      )
    )
    .limit(5);

  console.log("Sample prices from Kodaira:");
  results.forEach((r, i) => {
    const price = Number(r.priceYen) || 0;
    console.log(`\n${i + 1}. Price: ¥${price.toLocaleString('ja-JP')}`);
    console.log(`   Price in 万円: ${Math.round(price / 10000)}万円`);
    console.log(`   Area: ${r.buildingAreaM2}㎡`);
    console.log(`   Year: ${r.buildingYear}`);
  });

  // Calculate median
  const prices = results.map(r => Number(r.priceYen) || 0).filter(p => p > 0);
  prices.sort((a, b) => a - b);
  const median = prices[Math.floor(prices.length / 2)];
  
  console.log(`\n=== Statistics ===`);
  console.log(`Median price: ¥${median?.toLocaleString('ja-JP')}`);
  console.log(`Median in 万円: ${Math.round(median / 10000)}万円`);

  process.exit(0);
}

verifyPrices().catch(err => {
  console.error("Error:", err);
  process.exit(1);
});
