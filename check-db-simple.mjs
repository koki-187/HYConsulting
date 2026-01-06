/**
 * Simple Database Status Check using raw SQL
 */

import pg from "pg";
const { Client } = pg;

async function checkStatus() {
  const client = new Client({ 
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log("\n" + "=".repeat(80));
    console.log("データベース状況確認");
    console.log("=".repeat(80) + "\n");

    // Total count
    const countResult = await client.query(
      'SELECT COUNT(*) as total FROM "aggregatedRealEstateData"'
    );
    console.log(`✅ 総レコード数: ${parseInt(countResult.rows[0].total).toLocaleString()}件`);

    // By prefecture
    const prefResult = await client.query(`
      SELECT prefecture, COUNT(*) as count
      FROM "aggregatedRealEstateData"
      GROUP BY prefecture
      ORDER BY COUNT(*) DESC
      LIMIT 10
    `);
    console.log("\n📊 都道府県別レコード数（上位10件）:");
    for (const row of prefResult.rows) {
      console.log(`  ${row.prefecture}: ${parseInt(row.count).toLocaleString()}件`);
    }

    // By property type
    const typeResult = await client.query(`
      SELECT "propertyType", COUNT(*) as count
      FROM "aggregatedRealEstateData"
      GROUP BY "propertyType"
      ORDER BY COUNT(*) DESC
    `);
    console.log("\n🏠 物件種別レコード数:");
    for (const row of typeResult.rows) {
      console.log(`  ${row.propertyType}: ${parseInt(row.count).toLocaleString()}件`);
    }

    console.log("\n" + "=".repeat(80) + "\n");
  } catch (error) {
    console.error("❌ エラー:", error.message);
  } finally {
    await client.end();
  }
}

checkStatus();
