/**
 * Quick Database Status Check
 */

import { getDb } from "./server/db.js";
import { aggregatedRealEstateData } from "./drizzle/schema.js";
import { sql } from "drizzle-orm";

async function checkStatus() {
  console.log("\n" + "=".repeat(80));
  console.log("データベース状況確認");
  console.log("=".repeat(80) + "\n");

  const db = await getDb();
  if (!db) {
    console.error("❌ データベース接続失敗");
    process.exit(1);
  }

  try {
    // Total count
    const countResult = await db
      .select({ count: sql`COUNT(*)::int` })
      .from(aggregatedRealEstateData);
    
    console.log(`✅ 総レコード数: ${countResult[0].count.toLocaleString()}件`);

    // By prefecture
    const prefResult = await db
      .select({
        prefecture: aggregatedRealEstateData.prefecture,
        count: sql`COUNT(*)::int`,
      })
      .from(aggregatedRealEstateData)
      .groupBy(aggregatedRealEstateData.prefecture)
      .orderBy(sql`COUNT(*) DESC`)
      .limit(10);

    console.log("\n📊 都道府県別レコード数（上位10件）:");
    for (const row of prefResult) {
      console.log(`  ${row.prefecture}: ${row.count.toLocaleString()}件`);
    }

    // By property type
    const typeResult = await db
      .select({
        propertyType: aggregatedRealEstateData.propertyType,
        count: sql`COUNT(*)::int`,
      })
      .from(aggregatedRealEstateData)
      .groupBy(aggregatedRealEstateData.propertyType);

    console.log("\n🏠 物件種別レコード数:");
    for (const row of typeResult) {
      console.log(`  ${row.propertyType}: ${row.count.toLocaleString()}件`);
    }

    console.log("\n" + "=".repeat(80) + "\n");
  } catch (error) {
    console.error("❌ エラー:", error.message);
  }

  process.exit(0);
}

checkStatus();
