import mysql from 'mysql2/promise';
import * as dotenv from 'dotenv';

dotenv.config();

const connection = await mysql.createConnection({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  ssl: {
    rejectUnauthorized: true
  }
});

console.log('✅ データベース接続成功\n');

// 総レコード数
const [totalRows] = await connection.execute('SELECT COUNT(*) as total FROM transactions');
console.log(`📊 総レコード数: ${totalRows[0].total.toLocaleString()}件\n`);

// 神奈川県のレコード数
const [kanagawaRows] = await connection.execute(
  'SELECT COUNT(*) as total FROM transactions WHERE prefecture = ?',
  ['神奈川県']
);
console.log(`📍 神奈川県のレコード数: ${kanagawaRows[0].total.toLocaleString()}件\n`);

// 神奈川県の市区町村別件数
const [cityRows] = await connection.execute(
  'SELECT city, district, COUNT(*) as count FROM transactions WHERE prefecture = ? GROUP BY city, district ORDER BY count DESC LIMIT 30',
  ['神奈川県']
);

console.log('🏙️ 神奈川県の市区町村別データ件数（上位30）:');
console.log('─'.repeat(60));
cityRows.forEach((row, index) => {
  const location = row.district ? `${row.city}${row.district}` : row.city;
  console.log(`${(index + 1).toString().padStart(2)}. ${location.padEnd(30)} ${row.count.toLocaleString().padStart(10)}件`);
});

await connection.end();
