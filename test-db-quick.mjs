import { getDb } from "./server/db.js";
import { sql } from "drizzle-orm";

const timeout = setTimeout(() => {
  console.error("❌ タイムアウト: 10秒以内にデータベース接続できませんでした");
  process.exit(1);
}, 10000);

try {
  console.log("🔍 データベース接続開始...");
  const db = await getDb();
  
  if (!db) {
    console.error("❌ getDb() returned null");
    process.exit(1);
  }
  
  console.log("✅ getDb() 成功");
  
  const result = await db.execute(sql`SELECT COUNT(*) as count FROM transactions LIMIT 1`);
  console.log("✅ クエリ実行成功");
  console.log("📊 結果:", result);
  
  clearTimeout(timeout);
  process.exit(0);
} catch (error) {
  clearTimeout(timeout);
  console.error("❌ エラー:", error.message);
  process.exit(1);
}
