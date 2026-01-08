import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '.env') });

async function checkPriceData() {
  const connection = await mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    port: parseInt(process.env.DATABASE_PORT || '3306'),
    ssl: { rejectUnauthorized: false }
  });

  console.log('=== 東京都小平市のデータ確認 ===\n');

  // 小平市のデータ概要
  const [summary] = await connection.execute(`
    SELECT 
      propertyType,
      COUNT(*) as count,
      AVG(priceYen) as avg_price,
      MIN(priceYen) as min_price,
      MAX(priceYen) as max_price,
      AVG(unitPriceYenPerM2) as avg_unit_price
    FROM transactions 
    WHERE prefecture = '東京都' AND city LIKE '%小平%'
    GROUP BY propertyType
  `);
  
  console.log('小平市データ概要:');
  console.table(summary);

  // マンションの具体的なデータ
  const [condoData] = await connection.execute(`
    SELECT 
      id, city, district, propertyType, 
      priceYen, unitPriceYenPerM2, 
      buildingAreaM2, buildingYear, stationDistanceMin
    FROM transactions 
    WHERE prefecture = '東京都' AND city LIKE '%小平%'
      AND propertyType = '中古マンション等'
    LIMIT 10
  `);
  
  console.log('\n小平市マンションデータ (サンプル10件):');
  console.table(condoData);

  // 戸建てのデータ
  const [houseData] = await connection.execute(`
    SELECT 
      id, city, district, propertyType, 
      priceYen, unitPriceYenPerM2, 
      buildingAreaM2, landAreaM2, buildingYear, stationDistanceMin
    FROM transactions 
    WHERE prefecture = '東京都' AND city LIKE '%小平%'
      AND propertyType = '宅地(土地と建物)'
    LIMIT 10
  `);
  
  console.log('\n小平市戸建てデータ (サンプル10件):');
  console.table(houseData);

  // 価格の分布を確認
  const [priceDistribution] = await connection.execute(`
    SELECT 
      propertyType,
      COUNT(*) as count,
      ROUND(AVG(priceYen)) as avg_price_yen,
      ROUND(AVG(priceYen)/10000) as avg_price_man,
      ROUND(MIN(priceYen)/10000) as min_price_man,
      ROUND(MAX(priceYen)/10000) as max_price_man
    FROM transactions 
    WHERE prefecture = '東京都' AND city LIKE '%小平%'
    GROUP BY propertyType
  `);
  
  console.log('\n価格分布（万円単位）:');
  console.table(priceDistribution);

  await connection.end();
}

checkPriceData().catch(console.error);
