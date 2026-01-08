import mysql from 'mysql2/promise';

console.log("🔍 DATABASE_URL:", process.env.DATABASE_URL ? "設定あり" : "設定なし");

const timeout = setTimeout(() => {
  console.error("❌ タイムアウト: 8秒以内に接続できませんでした");
  process.exit(1);
}, 8000);

try {
  const dbUrl = new URL(process.env.DATABASE_URL);
  console.log("📍 接続先:", dbUrl.hostname);
  console.log("🔌 ポート:", dbUrl.port || 3306);
  console.log("👤 ユーザー:", dbUrl.username);
  console.log("💾 データベース:", dbUrl.pathname.slice(1));
  
  console.log("\n🔄 接続開始...");
  const connection = await mysql.createConnection({
    host: dbUrl.hostname,
    port: parseInt(dbUrl.port) || 3306,
    user: dbUrl.username,
    password: dbUrl.password,
    database: dbUrl.pathname.slice(1),
    ssl: { rejectUnauthorized: true },
    connectTimeout: 5000
  });
  
  console.log("✅ 接続成功!");
  
  const [rows] = await connection.execute('SELECT COUNT(*) as count FROM transactions');
  console.log("📊 レコード件数:", rows[0].count);
  
  await connection.end();
  clearTimeout(timeout);
  process.exit(0);
} catch (error) {
  clearTimeout(timeout);
  console.error("❌ エラー:", error.message);
  console.error("エラーコード:", error.code);
  process.exit(1);
}
