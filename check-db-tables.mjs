import { drizzle } from "drizzle-orm/mysql2";
import mysql2 from "mysql2/promise";

try {
  const dbUrl = new URL(process.env.DATABASE_URL);
  
  const connection = await mysql2.createConnection({
    host: dbUrl.hostname,
    port: parseInt(dbUrl.port) || 3306,
    user: dbUrl.username,
    password: dbUrl.password,
    database: dbUrl.pathname.slice(1),
    ssl: { rejectUnauthorized: true }
  });

  console.log("✅ Database connection successful");

  // Check if transactions table exists
  const [tables] = await connection.query("SHOW TABLES");
  console.log("\nAvailable tables:", tables);

  // Check transactions table row count
  try {
    const [result] = await connection.query("SELECT COUNT(*) as count FROM transactions");
    console.log("\nTransactions table row count:", result[0].count);
  } catch (e) {
    console.log("\n❌ Transactions table does not exist or is empty");
  }

  // Check for Tokyo Shibuya data
  try {
    const [result] = await connection.query(
      "SELECT COUNT(*) as count FROM transactions WHERE prefecture = '東京都' AND city = '渋谷区'"
    );
    console.log("Tokyo Shibuya data count:", result[0].count);
  } catch (e) {
    console.log("❌ Cannot query Tokyo Shibuya data:", e.message);
  }

  await connection.end();
} catch (error) {
  console.error("❌ Database error:", error.message);
}
