import mysql from 'mysql2/promise';
import { URL } from 'url';

const dbUrl = new URL(process.env.DATABASE_URL);
const config = {
  host: dbUrl.hostname,
  port: dbUrl.port || 3306,
  user: dbUrl.username,
  password: dbUrl.password,
  database: dbUrl.pathname.slice(1),
};

const connection = await mysql.createConnection(config);

console.log("=== データベース実態調査 (最終確認) ===\n");

// 1. aggregated_real_estate_data
const [aggRows] = await connection.query('SELECT COUNT(*) as count FROM aggregated_real_estate_data');
console.log(`1. aggregated_real_estate_data: ${aggRows[0].count}件`);

// 2. transactions
const [txRows] = await connection.query('SELECT COUNT(*) as count FROM transactions');
console.log(`2. transactions: ${txRows[0].count}件`);

// 3. 都道府県別 (aggregated_real_estate_data)
const [prefRows] = await connection.query('SELECT prefecture, COUNT(*) as count FROM aggregated_real_estate_data GROUP BY prefecture ORDER BY count DESC LIMIT 10');
console.log(`\n3. 都道府県別件数 (aggregated_real_estate_data, 上位10件):`);
prefRows.forEach(row => {
  console.log(`   ${row.prefecture}: ${row.count}件`);
});

// 4. 神奈川県
const [kanagawaRows] = await connection.query("SELECT COUNT(*) as count FROM aggregated_real_estate_data WHERE prefecture = '神奈川県'");
console.log(`\n4. 神奈川県のレコード件数: ${kanagawaRows[0].count}件`);

// 5. 横浜市戸塚区
const [totsukaRows] = await connection.query("SELECT COUNT(*) as count FROM aggregated_real_estate_data WHERE prefecture = '神奈川県' AND (city LIKE '%横浜市%' OR district LIKE '%戸塚%')");
console.log(`5. 横浜市戸塚区関連のレコード件数: ${totsukaRows[0].count}件`);

await connection.end();
process.exit(0);
