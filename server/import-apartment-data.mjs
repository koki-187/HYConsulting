/**
 * アパートデータ投入スクリプト
 * 全国アパートデータベース2020.1～2025.12(1).csvをtransactionsテーブルに投入
 */

import fs from 'fs';
import path from 'path';
import mysql from 'mysql2/promise';
import { parse } from 'csv-parse/sync';

const CSV_PATH = '/home/ubuntu/upload/全国アパートデータベース2020.1～2025.12(1).csv';

// Database connection
const dbUrl = new URL(process.env.DATABASE_URL);
const pool = mysql.createPool({
  host: dbUrl.hostname,
  port: parseInt(dbUrl.port) || 3306,
  user: dbUrl.username,
  password: dbUrl.password,
  database: dbUrl.pathname.slice(1),
  ssl: {
    rejectUnauthorized: true
  },
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

/**
 * 住所から都道府県と市区町村を抽出
 */
function parseAddress(address) {
  if (!address) return { prefecture: null, city: null };
  
  // 都道府県パターン
  const prefectureMatch = address.match(/^(北海道|東京都|京都府|大阪府|.{2,3}県)/);
  const prefecture = prefectureMatch ? prefectureMatch[1] : null;
  
  if (!prefecture) return { prefecture: null, city: null };
  
  // 市区町村を抽出
  const rest = address.replace(prefecture, '');
  const cityMatch = rest.match(/^(.+?[市区町村])/);
  const city = cityMatch ? cityMatch[1] : null;
  
  return { prefecture, city };
}

/**
 * 価格文字列を数値に変換（円単位）
 */
function parsePrice(priceStr) {
  if (!priceStr) return null;
  // カンマと引用符を除去
  const cleaned = priceStr.replace(/[,"]/g, '');
  const price = parseInt(cleaned, 10);
  return isNaN(price) ? null : price;
}

/**
 * 面積文字列を数値に変換
 */
function parseArea(areaStr) {
  if (!areaStr) return null;
  const cleaned = areaStr.replace(/[,"]/g, '');
  const area = parseFloat(cleaned);
  return isNaN(area) ? null : area;
}

/**
 * 築年月から築年を計算
 */
function parseBuildingYear(buildingYearMonth) {
  if (!buildingYearMonth) return null;
  const match = buildingYearMonth.match(/(\d{4})/);
  return match ? parseInt(match[1], 10) : null;
}

/**
 * 階建を数値に変換
 */
function parseFloors(floorsStr) {
  if (!floorsStr) return null;
  const floors = parseInt(floorsStr, 10);
  return isNaN(floors) ? null : floors;
}

/**
 * 最寄駅から駅名と徒歩分数を抽出
 */
function parseStation(stationStr) {
  if (!stationStr) return { station: null, walkingMinutes: null };
  
  // パターン: "路線名・駅名　徒歩X分"
  const stationMatch = stationStr.match(/・(.+?)(?:駅|　)/);
  const station = stationMatch ? stationMatch[1] : null;
  
  const minutesMatch = stationStr.match(/徒歩(\d+)分/);
  const walkingMinutes = minutesMatch ? parseInt(minutesMatch[1], 10) : null;
  
  return { station, walkingMinutes };
}

/**
 * 成約年月日からYYYY-MM形式に変換
 */
function parseTransactionDate(dateStr) {
  if (!dateStr) return null;
  const match = dateStr.match(/(\d{4})\/(\d{1,2})/);
  return match ? `${match[1]}-${match[2].padStart(2, '0')}` : null;
}

async function importApartmentData() {
  console.log('=== アパートデータ投入開始 ===');
  console.log(`CSV: ${CSV_PATH}`);
  
  // CSVファイル読み込み
  const csvContent = fs.readFileSync(CSV_PATH, 'utf-8');
  const records = parse(csvContent, {
    columns: true,
    skip_empty_lines: true,
    bom: true, // BOMを処理
  });
  
  console.log(`総レコード数: ${records.length}`);
  
  // データセットバージョンを作成
  const datasetVersionId = `apartment_2020_2025_${Date.now()}`;
  
  try {
    await pool.execute(
      `INSERT INTO dataset_versions (id, source, description, publishedDate, ingestedAt)
       VALUES (?, ?, ?, ?, NOW())
       ON DUPLICATE KEY UPDATE ingestedAt = NOW()`,
      [datasetVersionId, 'アパート成約事例データベース', '全国アパート成約事例 2020年1月～2025年12月', '2025-12-31']
    );
    console.log(`データセットバージョン作成: ${datasetVersionId}`);
  } catch (err) {
    console.error('データセットバージョン作成エラー:', err.message);
  }
  
  // バッチ処理
  const BATCH_SIZE = 100;
  let insertedCount = 0;
  let skippedCount = 0;
  let errorCount = 0;
  
  for (let i = 0; i < records.length; i += BATCH_SIZE) {
    const batch = records.slice(i, i + BATCH_SIZE);
    const values = [];
    const placeholders = [];
    
    for (const record of batch) {
      const { prefecture, city } = parseAddress(record['住所']);
      const price = parsePrice(record['価格']);
      const buildingArea = parseArea(record['建物面積(㎡)']);
      const landArea = parseArea(record['土地面積(㎡)']);
      const buildingYear = parseBuildingYear(record['築年月']);
      const floors = parseFloors(record['階建']);
      const { station, walkingMinutes } = parseStation(record['最寄駅']);
      const transactionYm = parseTransactionDate(record['成約年月日']);
      const structure = record['建築構造'] || null;
      
      // 必須フィールドのチェック
      if (!prefecture || !city || !price) {
        skippedCount++;
        continue;
      }
      
      // 単価計算（円/㎡）
      const unitPrice = buildingArea ? Math.round(price / buildingArea) : null;
      
      values.push(
        datasetVersionId,
        transactionYm || '2025-01',
        prefecture,
        city,
        null, // ward
        null, // district
        'アパート', // propertyType
        landArea,
        buildingArea,
        buildingYear,
        structure,
        null, // floorPlan
        floors,
        station,
        walkingMinutes,
        price,
        unitPrice,
        null, // lat
        null, // lon
        null  // remarks
      );
      
      placeholders.push('(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
    }
    
    if (placeholders.length === 0) continue;
    
    const sql = `
      INSERT INTO transactions 
      (datasetVersionId, transactionYm, prefecture, city, ward, district, propertyType, 
       landAreaM2, buildingAreaM2, buildingYear, structure, floorPlan, floor,
       nearestStation, stationDistanceMin, priceYen, unitPriceYenPerM2, lat, lon, remarks)
      VALUES ${placeholders.join(', ')}
    `;
    
    try {
      await pool.execute(sql, values);
      insertedCount += placeholders.length;
      
      if ((i + BATCH_SIZE) % 1000 === 0 || i + BATCH_SIZE >= records.length) {
        console.log(`進捗: ${Math.min(i + BATCH_SIZE, records.length)}/${records.length} (${insertedCount}件投入, ${skippedCount}件スキップ)`);
      }
    } catch (err) {
      console.error(`バッチ ${i}-${i + BATCH_SIZE} エラー:`, err.message);
      errorCount += batch.length;
    }
  }
  
  console.log('\n=== 投入完了 ===');
  console.log(`投入成功: ${insertedCount}件`);
  console.log(`スキップ: ${skippedCount}件`);
  console.log(`エラー: ${errorCount}件`);
  
  // 投入結果の確認
  const [countResult] = await pool.execute(
    `SELECT COUNT(*) as count FROM transactions WHERE propertyType = 'アパート'`
  );
  console.log(`\nアパートデータ総数: ${countResult[0].count}件`);
  
  // 都道府県別件数
  const [prefectureResult] = await pool.execute(
    `SELECT prefecture, COUNT(*) as count 
     FROM transactions 
     WHERE propertyType = 'アパート'
     GROUP BY prefecture 
     ORDER BY count DESC 
     LIMIT 10`
  );
  console.log('\n都道府県別件数（上位10）:');
  prefectureResult.forEach(row => {
    console.log(`  ${row.prefecture}: ${row.count}件`);
  });
  
  await pool.end();
}

importApartmentData().catch(console.error);
