import mysql from 'mysql2/promise';

const config = {
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT || '4000'),
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  ssl: { rejectUnauthorized: true }
};

async function checkDatabase() {
  const conn = await mysql.createConnection(config);
  
  console.log('=== データベース状態確認 ===\n');
  
  // テーブル一覧
  const [tables] = await conn.query("SHOW TABLES");
  console.log('テーブル一覧:');
  tables.forEach(t => console.log('  -', Object.values(t)[0]));
  console.log('');
  
  // transactionsテーブルの件数
  const [txCount] = await conn.query("SELECT COUNT(*) as count FROM transactions");
  console.log(`transactions件数: ${txCount[0].count.toLocaleString()}件`);
  
  // 都道府県別件数（上位10）
  const [prefStats] = await conn.query(`
    SELECT prefecture, COUNT(*) as count 
    FROM transactions 
    GROUP BY prefecture 
    ORDER BY count DESC 
    LIMIT 10
  `);
  console.log('\n都道府県別件数（上位10）:');
  prefStats.forEach(p => console.log(`  ${p.prefecture}: ${p.count.toLocaleString()}件`));
  
  // 東京都新宿区のデータ確認
  const [shinjukuData] = await conn.query(`
    SELECT propertyType, COUNT(*) as count, AVG(priceYen) as avgPrice
    FROM transactions 
    WHERE prefecture = '東京都' AND (city LIKE '%新宿%' OR district LIKE '%新宿%')
    GROUP BY propertyType
  `);
  console.log('\n東京都新宿区のデータ:');
  shinjukuData.forEach(d => {
    const avgPriceMan = d.avgPrice ? Math.round(d.avgPrice / 10000).toLocaleString() : 'N/A';
    console.log(`  ${d.propertyType}: ${d.count}件 (平均: ${avgPriceMan}万円)`);
  });
  
  await conn.end();
}

checkDatabase().catch(console.error);
