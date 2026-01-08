import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import { sql } from 'drizzle-orm';
import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';
import iconv from 'iconv-lite';

const connection = await mysql.createConnection(process.env.DATABASE_URL);
const db = drizzle(connection);

const CSV_DIR = '/home/ubuntu/upload';
const BATCH_SIZE = 1000;
const DATASET_VERSION_ID = `mlit_csv_${Date.now()}`;

// Property type mapping from CSV to database
const PROPERTY_TYPE_MAP = {
  '中古マンション等': 'マンション',
  '宅地(土地と建物)': '一戸建て',
  '宅地(土地)': '土地',
  '農地': '農地',
  '林地': '林地',
};

// Building age group calculation
function getBuildingAgeGroup(buildingYear) {
  if (!buildingYear || buildingYear === '') return '不明';
  
  const year = parseInt(buildingYear.replace(/[年代以前]/g, ''));
  if (isNaN(year)) return '不明';
  
  const currentYear = 2025;
  const age = currentYear - year;
  
  if (age < 0) return '不明';
  if (age <= 5) return '0～5年';
  if (age <= 10) return '5～10年';
  if (age <= 15) return '10～15年';
  if (age <= 20) return '15～20年';
  if (age <= 30) return '20～30年';
  return '30年以上';
}

// Parse price (remove commas and convert to number)
function parsePrice(priceStr) {
  if (!priceStr || priceStr === '') return null;
  const cleaned = priceStr.replace(/[,円]/g, '');
  const num = parseInt(cleaned);
  return isNaN(num) ? null : num;
}

// Parse area (remove commas and convert to number)
function parseArea(areaStr) {
  if (!areaStr || areaStr === '') return null;
  const cleaned = areaStr.replace(/[,㎡]/g, '');
  const num = parseFloat(cleaned);
  return isNaN(num) ? null : num;
}

console.log('=' .repeat(100));
console.log('全国不動産データ投入開始');
console.log('=' .repeat(100));
console.log(`データセットバージョンID: ${DATASET_VERSION_ID}\n`);

// Step 1: Delete existing data
console.log('Step 1: 既存データの削除...');
const deleteResult = await db.execute(sql`DELETE FROM aggregated_real_estate_data`);
console.log(`削除完了: ${deleteResult[0].affectedRows} 件\n`);

// Step 2: Get all CSV files
const csvFiles = fs.readdirSync(CSV_DIR)
  .filter(f => f.endsWith('_20202_20252.csv'))
  .sort();

console.log(`Step 2: CSVファイル検出: ${csvFiles.length} ファイル\n`);

let totalImported = 0;
let totalSkipped = 0;
let totalErrors = 0;

// Step 3: Process each CSV file
for (const csvFile of csvFiles) {
  const filePath = path.join(CSV_DIR, csvFile);
  const prefectureName = csvFile.split('_')[1].replace(' Prefecture', '').replace('Prefecture', '');
  
  console.log(`\n処理中: ${csvFile}`);
  console.log('-'.repeat(100));
  
  try {
    // Read CSV file
    const buffer = fs.readFileSync(filePath);
    const fileContent = iconv.decode(buffer, 'cp932');
    const records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
      relax_quotes: true,
      relax_column_count: true,
    });
    
    console.log(`  読み込み: ${records.length.toLocaleString()} 行`);
    
    // Group data by propertyType, prefecture, city, district, buildingAgeGroup
    const aggregationMap = new Map();
    
    for (const record of records) {
      try {
        // Extract fields
        const propertyTypeRaw = record['種類'] || '';
        const propertyType = PROPERTY_TYPE_MAP[propertyTypeRaw] || propertyTypeRaw;
        const prefecture = record['都道府県名'] || '';
        const city = record['市区町村名'] || '';
        const district = record['地区名'] || city; // Use city as district if district is empty
        const buildingYear = record['建築年'] || '';
        const buildingAgeGroup = getBuildingAgeGroup(buildingYear);
        const priceYen = parsePrice(record['取引価格（総額）']);
        const areaM2 = parseArea(record['面積（㎡）']);
        
        // Skip if essential data is missing
        if (!propertyType || !prefecture || !city || !priceYen || !areaM2) {
          totalSkipped++;
          continue;
        }
        
        // Create aggregation key
        const key = `${propertyType}|${prefecture}|${city}|${district}|${buildingAgeGroup}`;
        
        if (!aggregationMap.has(key)) {
          aggregationMap.set(key, {
            propertyType,
            prefecture,
            city,
            district,
            buildingAgeGroup,
            totalPriceYen: 0,
            totalAreaM2: 0,
            transactionCount: 0,
          });
        }
        
        const agg = aggregationMap.get(key);
        agg.totalPriceYen += priceYen;
        agg.totalAreaM2 += areaM2;
        agg.transactionCount += 1;
      } catch (err) {
        totalErrors++;
        // Skip individual record errors
      }
    }
    
    console.log(`  集計グループ: ${aggregationMap.size.toLocaleString()} グループ`);
    
    // Prepare batch insert data
    const insertData = [];
    for (const [key, agg] of aggregationMap.entries()) {
      const averagePriceYen = Math.round(agg.totalPriceYen / agg.transactionCount);
      const averageAreaM2 = agg.totalAreaM2 / agg.transactionCount;
      const pricePerM2 = averagePriceYen / averageAreaM2;
      const pricePerTsubo = Math.round(pricePerM2 * 3.30579); // 1坪 = 3.30579㎡
      
      insertData.push({
        propertyType: agg.propertyType,
        prefecture: agg.prefecture,
        city: agg.city,
        district: agg.district,
        buildingAgeGroup: agg.buildingAgeGroup,
        totalPriceYen: agg.totalPriceYen.toString(),
        totalAreaM2: agg.totalAreaM2.toString(),
        transactionCount: agg.transactionCount,
        pricePerTsubo: pricePerTsubo,
        averagePriceYen: averagePriceYen,
        averageAreaM2: averageAreaM2.toString(),
        datasetVersionId: DATASET_VERSION_ID,
      });
    }
    
    // Batch insert
    let inserted = 0;
    for (let i = 0; i < insertData.length; i += BATCH_SIZE) {
      const batch = insertData.slice(i, i + BATCH_SIZE);
      
      const values = batch.map(d => 
        `('${d.propertyType}', '${d.prefecture}', '${d.city}', '${d.district}', '${d.buildingAgeGroup}', ${d.totalPriceYen}, ${d.totalAreaM2}, ${d.transactionCount}, ${d.pricePerTsubo}, ${d.averagePriceYen}, ${d.averageAreaM2}, '${d.datasetVersionId}')`
      ).join(',');
      
      await db.execute(sql.raw(`
        INSERT INTO aggregated_real_estate_data 
        (propertyType, prefecture, city, district, buildingAgeGroup, totalPriceYen, totalAreaM2, transactionCount, pricePerTsubo, averagePriceYen, averageAreaM2, datasetVersionId)
        VALUES ${values}
      `));
      
      inserted += batch.length;
    }
    
    console.log(`  投入完了: ${inserted.toLocaleString()} レコード`);
    totalImported += inserted;
    
  } catch (err) {
    console.error(`  エラー: ${err.message}`);
    totalErrors++;
  }
}

console.log('\n' + '=' .repeat(100));
console.log('データ投入完了');
console.log('=' .repeat(100));
console.log(`総投入レコード数: ${totalImported.toLocaleString()} 件`);
console.log(`スキップ: ${totalSkipped.toLocaleString()} 件`);
console.log(`エラー: ${totalErrors.toLocaleString()} 件`);

// Verify final count
const finalResult = await db.execute(sql`SELECT COUNT(*) as total FROM aggregated_real_estate_data`);
console.log(`\n最終レコード数: ${finalResult[0][0].total.toLocaleString()} 件`);

await connection.end();
console.log('\n処理完了');
