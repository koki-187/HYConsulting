import { getDb } from "./server/db";
import { transactions } from "./drizzle/schema";
import { eq, and, like, sql } from "drizzle-orm";

async function checkPrices() {
  const db = await getDb();
  if (!db) {
    console.error("Database not available");
    return;
  }

  console.log("=== 東京都小平市のデータ確認 ===\n");

  // 小平市のデータ概要
  const summary = await db
    .select({
      propertyType: transactions.propertyType,
      count: sql<number>`COUNT(*)`,
      avgPrice: sql<number>`ROUND(AVG(${transactions.priceYen}))`,
      avgPriceMan: sql<number>`ROUND(AVG(${transactions.priceYen})/10000)`,
      minPriceMan: sql<number>`ROUND(MIN(${transactions.priceYen})/10000)`,
      maxPriceMan: sql<number>`ROUND(MAX(${transactions.priceYen})/10000)`,
      avgUnitPrice: sql<number>`ROUND(AVG(${transactions.unitPriceYenPerM2}))`,
    })
    .from(transactions)
    .where(
      and(
        eq(transactions.prefecture, "東京都"),
        like(transactions.city, "%小平%")
      )
    )
    .groupBy(transactions.propertyType);

  console.log("小平市データ概要:");
  console.table(summary);

  // マンションの具体的なデータ
  const condoData = await db
    .select({
      city: transactions.city,
      district: transactions.district,
      propertyType: transactions.propertyType,
      priceYen: transactions.priceYen,
      priceMan: sql<number>`ROUND(${transactions.priceYen}/10000)`,
      unitPriceYenPerM2: transactions.unitPriceYenPerM2,
      buildingAreaM2: transactions.buildingAreaM2,
      buildingYear: transactions.buildingYear,
    })
    .from(transactions)
    .where(
      and(
        eq(transactions.prefecture, "東京都"),
        like(transactions.city, "%小平%"),
        eq(transactions.propertyType, "中古マンション等")
      )
    )
    .limit(10);

  console.log("\n小平市マンションデータ (サンプル10件):");
  console.table(condoData);

  // 横浜市西区のデータ
  const yokohamaData = await db
    .select({
      propertyType: transactions.propertyType,
      count: sql<number>`COUNT(*)`,
      avgPriceMan: sql<number>`ROUND(AVG(${transactions.priceYen})/10000)`,
      minPriceMan: sql<number>`ROUND(MIN(${transactions.priceYen})/10000)`,
      maxPriceMan: sql<number>`ROUND(MAX(${transactions.priceYen})/10000)`,
      avgUnitPrice: sql<number>`ROUND(AVG(${transactions.unitPriceYenPerM2}))`,
    })
    .from(transactions)
    .where(
      and(
        eq(transactions.prefecture, "神奈川県"),
        like(transactions.city, "%横浜市西区%")
      )
    )
    .groupBy(transactions.propertyType);

  console.log("\n横浜市西区データ概要:");
  console.table(yokohamaData);

  process.exit(0);
}

checkPrices().catch(console.error);
