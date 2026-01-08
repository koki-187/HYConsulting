import { getDb } from "./server/db";
import { transactions } from "./drizzle/schema";
import { eq, and } from "drizzle-orm";

async function main() {
  const db = await getDb();

  console.log("=== 小平市の戸建てデータ確認 ===\n");

  // Query for Kodaira house data
  const results = await db
    .select()
    .from(transactions)
    .where(
      and(
        eq(transactions.prefecture, "東京都"),
        eq(transactions.city, "小平市"),
        eq(transactions.propertyType, "宅地(土地と建物)")
      )
    )
    .limit(5);

  console.log(`取得件数: ${results.length}\n`);

  results.forEach((row, index) => {
    console.log(`--- レコード ${index + 1} ---`);
    console.log(`ID: ${row.id}`);
    console.log(`priceYen: ${row.priceYen}`);
    console.log(`priceYen型: ${typeof row.priceYen}`);
    console.log(`landAreaM2: ${row.landAreaM2}`);
    console.log(`buildingAreaM2: ${row.buildingAreaM2}`);
    console.log(`buildingYear: ${row.buildingYear}`);
    console.log(`transactionYm: ${row.transactionYm}`);
    console.log(`unitPriceYenPerM2: ${row.unitPriceYenPerM2}`);
    console.log(`\npriceYenを万円に変換: ${Number(row.priceYen) / 10000} 万円`);
    console.log(`priceYenをそのまま表示: ${Number(row.priceYen)} 円\n`);
  });

}

main().catch(console.error);
