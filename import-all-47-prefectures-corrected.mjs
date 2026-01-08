import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';
import iconv from 'iconv-lite';

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('DATABASE_URL environment variable is not set');
  process.exit(1);
}

// Parse DATABASE_URL
const dbUrl = new URL(DATABASE_URL);
const config = {
  host: dbUrl.hostname,
  port: parseInt(dbUrl.port) || 3306,
  user: dbUrl.username,
  password: dbUrl.password,
  database: dbUrl.pathname.slice(1),
  ssl: { rejectUnauthorized: true },
};

const CSV_DIR = '/home/ubuntu/upload';
const BATCH_SIZE = 1000;

async function importCSV(connection, csvFilePath) {
  const fileName = path.basename(csvFilePath);
  console.log(`\n処理中: ${fileName}`);
  
  try {
    // Read CSV file with Shift-JIS encoding
    const buffer = fs.readFileSync(csvFilePath);
    const content = iconv.decode(buffer, 'cp932');
    
    // Parse CSV
    const records = parse(content, {
      columns: true,
      skip_empty_lines: true,
      relax_column_count: true,
      relax_quotes: true,
      escape: '"',
      quote: '"',
    });
    
    console.log(`  総行数: ${records.length}`);
    
    let insertedCount = 0;
    let skippedCount = 0;
    let batch = [];
    
    for (const row of records) {
      // Extract prefecture from CSV column "都道府県名"
      const prefecture = row['都道府県名']?.trim();
      const city = row['市区町村名']?.trim();
      const district = row['地区名']?.trim();
      const propertyType = row['種類']?.trim();
      const priceStr = row['取引価格（総額）']?.trim();
      const areaStr = row['面積（㎡）']?.trim();
      const buildingYearRaw = row['建築年']?.trim();
      // Extract year from buildingYear (e.g., "2015年" -> "2015", "?" -> null)
      let buildingYear = null;
      if (buildingYearRaw && buildingYearRaw !== '?' && buildingYearRaw !== '不明') {
        const yearMatch = buildingYearRaw.match(/(\d{4})/);
        if (yearMatch) {
          buildingYear = yearMatch[1];
        }
      }
      const period = row['取引時期']?.trim();
      
      // Skip if required fields are missing
      if (!prefecture || !city || !priceStr || !areaStr || !period) {
        skippedCount++;
        continue;
      }
      
      const price = parseInt(priceStr);
      const area = parseFloat(areaStr);
      
      // Skip if price or area is invalid
      if (isNaN(price) || isNaN(area) || price <= 0 || area <= 0) {
        skippedCount++;
        continue;
      }
      
      // Convert period to transactionYm format (YYYYMM)
      let transactionYm = null;
      if (period) {
        const match = period.match(/(\d{4})年第(\d)四半期/);
        if (match) {
          const year = match[1];
          const quarter = parseInt(match[2]);
          const month = (quarter - 1) * 3 + 1; // Q1->01, Q2->04, Q3->07, Q4->10
          transactionYm = `${year}${month.toString().padStart(2, '0')}`;
        }
      }
      
      batch.push({
        prefecture,
        city,
        ward: null,
        district: district || null,
        propertyType: propertyType || null,
        priceYen: price,
        landAreaM2: area,
        buildingAreaM2: null,
        buildingYear: buildingYear || null,
        transactionYm,
        datasetVersionId: 1,
      });
      
      // Insert batch when it reaches BATCH_SIZE
      if (batch.length >= BATCH_SIZE) {
        try {
          const values = batch.map(item => [
            item.datasetVersionId,
            item.transactionYm,
            item.prefecture,
            item.city,
            item.ward,
            item.district,
            item.propertyType,
            item.priceYen,
            item.landAreaM2,
            item.buildingAreaM2,
            item.buildingYear,
          ]);
          
          await connection.query(
            `INSERT INTO transactions 
            (datasetVersionId, transactionYm, prefecture, city, ward, district, propertyType, priceYen, landAreaM2, buildingAreaM2, buildingYear) 
            VALUES ?`,
            [values]
          );
          
          insertedCount += batch.length;
          batch = [];
        } catch (error) {
          console.error(`  バッチ挿入エラー:`, error.message);
          skippedCount += batch.length;
          batch = [];
        }
      }
    }
    
    // Insert remaining batch
    if (batch.length > 0) {
      try {
        const values = batch.map(item => [
          item.datasetVersionId,
          item.transactionYm,
          item.prefecture,
          item.city,
          item.ward,
          item.district,
          item.propertyType,
          item.priceYen,
          item.landAreaM2,
          item.buildingAreaM2,
          item.buildingYear,
        ]);
        
        await connection.query(
          `INSERT INTO transactions 
          (datasetVersionId, transactionYm, prefecture, city, ward, district, propertyType, priceYen, landAreaM2, buildingAreaM2, buildingYear) 
          VALUES ?`,
          [values]
        );
        
        insertedCount += batch.length;
      } catch (error) {
        console.error(`  最終バッチ挿入エラー:`, error.message);
        skippedCount += batch.length;
      }
    }
    
    console.log(`  ✓ 投入完了: ${insertedCount}件 (スキップ: ${skippedCount}件)`);
    return { inserted: insertedCount, skipped: skippedCount };
  } catch (error) {
    console.error(`  ✗ エラー: ${error.message}`);
    return { inserted: 0, skipped: 0 };
  }
}

async function main() {
  console.log('=== 全47都道府県データ投入開始 ===\n');
  console.log(`データベース: ${config.host}:${config.port}/${config.database}`);
  console.log(`CSV ディレクトリ: ${CSV_DIR}\n`);
  
  const connection = await mysql.createConnection(config);
  console.log('✓ データベース接続成功\n');
  
  const startTime = Date.now();
  
  // Get all CSV files
  const csvFiles = fs.readdirSync(CSV_DIR)
    .filter(file => file.endsWith('_20202_20252.csv'))
    .sort()
    .map(file => path.join(CSV_DIR, file));
  
  console.log(`対象ファイル数: ${csvFiles.length}\n`);
  
  let totalInserted = 0;
  let totalSkipped = 0;
  
  for (const csvFile of csvFiles) {
    const result = await importCSV(connection, csvFile);
    totalInserted += result.inserted;
    totalSkipped += result.skipped;
  }
  
  await connection.end();
  
  const endTime = Date.now();
  const duration = ((endTime - startTime) / 1000).toFixed(1);
  
  console.log('\n=== 投入完了 ===');
  console.log(`総投入件数: ${totalInserted.toLocaleString()}件`);
  console.log(`総スキップ件数: ${totalSkipped.toLocaleString()}件`);
  console.log(`処理時間: ${duration}秒`);
  console.log(`処理速度: ${Math.round(totalInserted / (duration / 1))}件/秒`);
}

main().catch(console.error);
