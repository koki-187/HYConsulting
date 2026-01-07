import { drizzle } from "drizzle-orm/mysql2";
import { sql } from "drizzle-orm";

const db = drizzle(process.env.DATABASE_URL);

try {
  const result = await db.execute(sql`SELECT COUNT(*) as count FROM aggregated_real_estate_data`);
  console.log("総レコード件数:", result[0][0].count);
  
  const prefResult = await db.execute(sql`SELECT prefecture, COUNT(*) as count FROM aggregated_real_estate_data GROUP BY prefecture ORDER BY count DESC LIMIT 10`);
  console.log("\n都道府県別件数 (上位10件):");
  prefResult[0].forEach(row => {
    console.log(`  ${row.prefecture}: ${row.count}件`);
  });
  
  const kanagawaResult = await db.execute(sql`SELECT COUNT(*) as count FROM aggregated_real_estate_data WHERE prefecture = '神奈川県'`);
  console.log("\n神奈川県のレコード件数:", kanagawaResult[0][0].count);
  
} catch (error) {
  console.error("エラー:", error.message);
}

process.exit(0);
