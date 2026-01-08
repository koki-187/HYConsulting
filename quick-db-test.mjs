import { getDb } from "./server/db.js";
import { transactions } from "./drizzle/schema.js";
import { sql } from "drizzle-orm";

console.log("🔍 データベース接続テスト開始...\n");

try {
  const db = await getDb();
  
  if (!db) {
    console.error("❌ データベース接続失敗: getDb() returned null");
    process.exit(1);
  }
  
  console.log("✅ データベース接続成功\n");
  
  // 総件数確認
  const countResult = await db.execute(sql`SELECT COUNT(*) as count FROM transactions`);
  const totalCount = countResult[0]?.[0]?.count || 0;
  console.log(`📊 総レコード件数: ${totalCount.toLocaleString()}件\n`);
  
  // 都道府県数確認
  const prefResult = await db.execute(sql`SELECT COUNT(DISTINCT prefecture) as count FROM transactions`);
  const prefCount = prefResult[0]?.[0]?.count || 0;
  console.log(`📍 都道府県数: ${prefCount}都道府県\n`);
  
  console.log("✅ データベーステスト完了");
  process.exit(0);
  
} catch (error) {
  console.error("❌ エラー発生:", error);
  process.exit(1);
}
