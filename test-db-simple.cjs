const mysql = require('mysql2/promise');

console.log("🔍 テスト開始");
console.log("DATABASE_URL:", process.env.DATABASE_URL ? "設定あり" : "設定なし");

async function test() {
  try {
    const dbUrl = new URL(process.env.DATABASE_URL);
    console.log("📍 ホスト:", dbUrl.hostname);
    console.log("🔌 ポート:", dbUrl.port);
    
    console.log("\n🔄 接続試行...");
    const connection = await mysql.createConnection({
      host: dbUrl.hostname,
      port: parseInt(dbUrl.port) || 4000,
      user: dbUrl.username,
      password: dbUrl.password,
      database: dbUrl.pathname.slice(1),
      ssl: { rejectUnauthorized: true },
      connectTimeout: 10000
    });
    
    console.log("✅ 接続成功!");
    
    const [rows] = await connection.execute('SELECT COUNT(*) as count FROM transactions');
    console.log("📊 件数:", rows[0].count);
    
    await connection.end();
    console.log("✅ テスト完了");
  } catch (error) {
    console.error("❌ エラー:", error.message);
    console.error("コード:", error.code);
    process.exit(1);
  }
}

test();
