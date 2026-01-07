import { drizzle } from "drizzle-orm/mysql2";
import { aggregatedRealEstateData } from "./drizzle/schema.js";
import { sql } from "drizzle-orm";

const db = drizzle(process.env.DATABASE_URL);

console.log("=== データベース詳細調査 ===\n");

// 1. 総レコード件数
const totalCount = await db.select({ count: sql`COUNT(*)` }).from(aggregatedRealEstateData);
console.log(`1. 総レコード件数: ${totalCount[0].count}`);

// 2. 都道府県別件数
const prefectureCounts = await db.select({
  prefecture: aggregatedRealEstateData.prefecture,
  count: sql`COUNT(*)`
}).from(aggregatedRealEstateData).groupBy(aggregatedRealEstateData.prefecture).orderBy(sql`COUNT(*) DESC`);

console.log(`\n2. 都道府県別件数 (上位10件):`);
prefectureCounts.slice(0, 10).forEach(row => {
  console.log(`   ${row.prefecture}: ${row.count}件`);
});

// 3. 神奈川県のレコード件数
const kanagawaCount = await db.select({ count: sql`COUNT(*)` })
  .from(aggregatedRealEstateData)
  .where(sql`prefecture = '神奈川県'`);
console.log(`\n3. 神奈川県のレコード件数: ${kanagawaCount[0].count}`);

// 4. 横浜市戸塚区のレコード件数
const totsukaCounts = await db.select({
  city: aggregatedRealEstateData.city,
  district: aggregatedRealEstateData.district,
  count: sql`COUNT(*)`
})
  .from(aggregatedRealEstateData)
  .where(sql`prefecture = '神奈川県' AND (city LIKE '%横浜市%' OR district LIKE '%戸塚%')`)
  .groupBy(aggregatedRealEstateData.city, aggregatedRealEstateData.district);

console.log(`\n4. 横浜市戸塚区関連のレコード件数:`);
totsukaCounts.forEach(row => {
  console.log(`   ${row.city} ${row.district}: ${row.count}件`);
});

// 5. サンプルデータ（最初の5件）
const sampleData = await db.select().from(aggregatedRealEstateData).limit(5);
console.log(`\n5. サンプルデータ (最初の5件):`);
sampleData.forEach((row, i) => {
  console.log(`\n   [${i + 1}] ${row.prefecture} ${row.city} ${row.district}`);
  console.log(`       物件種別: ${row.propertyType}, 築年数: ${row.buildingAgeGroup}`);
  console.log(`       取引件数: ${row.transactionCount}, 平均価格: ¥${row.averagePriceYen.toLocaleString()}`);
});

process.exit(0);
