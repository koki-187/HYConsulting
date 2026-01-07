#!/usr/bin/env node
/**
 * CSVファイルを読み込み、集計してデータベースに投入するスクリプト
 * 
 * 使用方法:
 *   node scripts/aggregate-csv-data.mjs server/mlit-production-data.csv
 */

import fs from 'fs';
import { createConnection } from 'mysql2/promise';
import dotenv from 'dotenv';

// 環境変数読み込み
dotenv.config();

// 物件種別マッピング
const PROPERTY_TYPE_MAP = {
  'land': '土地',
  'house': '一戸建て',
  'condo': 'マンション',
  '農地': '農地',
  '林地': '林地'
};

// 築年数グループマッピング
function getBuildingAgeGroup(yearStr) {
  if (!yearStr || yearStr === '') {
    return '不明';
  }
  
  try {
    const year = parseInt(yearStr);
    const currentYear = new Date().getFullYear();
    const age = currentYear - year;
    
    if (age < 0) return '不明';
    if (age <= 5) return '0～5年';
    if (age <= 10) return '5～10年';
    if (age <= 15) return '10～15年';
    if (age <= 20) return '15～20年';
    if (age <= 25) return '20～25年';
    if (age <= 30) return '25～30年';
    return '30年以上';
  } catch {
    return '不明';
  }
}

// CSVをパース（簡易版）
function parseCSV(content) {
  const lines = content.split('\n');
  const headers = lines[0].split(',').map(h => h.trim());
  const records = [];
  
  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;
    
    const values = lines[i].split(',');
    const record = {};
    
    for (let j = 0; j < headers.length; j++) {
      record[headers[j]] = values[j] ? values[j].trim() : '';
    }
    
    records.push(record);
  }
  
  return records;
}

// データを集計
function aggregateData(records) {
  console.log(`📊 集計処理開始: ${records.length}件のレコード`);
  
  const aggregated = {};
  
  for (const record of records) {
    const prefecture = record.prefecture || '';
    const city = record.city || record.ward || '';
    const propertyTypeRaw = record.property_type || '';
    const propertyType = PROPERTY_TYPE_MAP[propertyTypeRaw] || propertyTypeRaw;
    const buildingYear = record.building_year || '';
    const buildingAgeGroup = getBuildingAgeGroup(buildingYear);
    
    // 集計キー
    const district = record.district || '';
    const key = `${prefecture}|${city}|${district}|${propertyType}|${buildingAgeGroup}`;
    
    if (!aggregated[key]) {
      aggregated[key] = {
        prefecture,
        city,
        district,
        propertyType,
        buildingAgeGroup,
        totalPriceYen: 0,
        totalAreaM2: 0,
        transactionCount: 0,
        prices: [],
        areas: []
      };
    }
    
    // 価格と面積を集計
    const price = parseFloat(record.price_yen) || 0;
    const area = parseFloat(record.land_area_m2 || record.building_area_m2) || 0;
    
    if (price > 0) {
      aggregated[key].totalPriceYen += price;
      aggregated[key].prices.push(price);
    }
    
    if (area > 0) {
      aggregated[key].totalAreaM2 += area;
      aggregated[key].areas.push(area);
    }
    
    aggregated[key].transactionCount++;
  }
  
  // 平均値を計算
  const results = [];
  for (const key in aggregated) {
    const data = aggregated[key];
    
    // 価格の平均値
    const avgPriceYen = data.prices.length > 0
      ? data.prices.reduce((a, b) => a + b, 0) / data.prices.length
      : 0;
    
    // 面積の平均値
    const avgAreaM2 = data.areas.length > 0
      ? data.areas.reduce((a, b) => a + b, 0) / data.areas.length
      : 0;
    
    // 平米単価
    const avgPricePerM2 = avgAreaM2 > 0 ? avgPriceYen / avgAreaM2 : 0;
    
    // 坪単価を計算（1坪 = 3.30579平米）
    const pricePerTsubo = avgAreaM2 > 0 ? Math.round(avgPriceYen / (avgAreaM2 / 3.30579)) : 0;
    
    results.push({
      prefecture: data.prefecture,
      city: data.city,
      district: data.district,
      propertyType: data.propertyType,
      buildingAgeGroup: data.buildingAgeGroup,
      totalPriceYen: Math.round(data.totalPriceYen),
      totalAreaM2: Math.round(data.totalAreaM2 * 100) / 100,
      transactionCount: data.transactionCount,
      pricePerTsubo: pricePerTsubo,
      averagePriceYen: Math.round(avgPriceYen),
      averageAreaM2: Math.round(avgAreaM2 * 100) / 100
    });
  }
  
  console.log(`✅ 集計完了: ${results.length}件の集計レコード`);
  return results;
}

// データベースに投入
async function insertToDatabase(records) {
  console.log(`💾 データベース投入開始: ${records.length}件`);
  
  const conn = await createConnection(process.env.DATABASE_URL);
  
  try {
    // 既存データを削除（オプション）
    // await conn.query('DELETE FROM aggregated_real_estate_data');
    // console.log('既存データを削除しました');
    
    // バッチ挿入
    const batchSize = 1000;
    let inserted = 0;
    
    for (let i = 0; i < records.length; i += batchSize) {
      const batch = records.slice(i, i + batchSize);
      
      const values = batch.map(r => [
        r.propertyType,
        r.prefecture,
        r.city,
        r.district,
        r.buildingAgeGroup,
        r.totalPriceYen,
        r.totalAreaM2,
        r.transactionCount,
        r.pricePerTsubo,
        r.averagePriceYen,
        r.averageAreaM2,
        'mlit_csv_' + Date.now()
      ]);
      
      const sql = `
        INSERT INTO aggregated_real_estate_data 
        (propertyType, prefecture, city, district, buildingAgeGroup, totalPriceYen, totalAreaM2, transactionCount, pricePerTsubo, averagePriceYen, averageAreaM2, datasetVersionId)
        VALUES ?
        ON DUPLICATE KEY UPDATE
          totalPriceYen = VALUES(totalPriceYen),
          totalAreaM2 = VALUES(totalAreaM2),
          transactionCount = VALUES(transactionCount),
          pricePerTsubo = VALUES(pricePerTsubo),
          averagePriceYen = VALUES(averagePriceYen),
          averageAreaM2 = VALUES(averageAreaM2)
      `;
      
      await conn.query(sql, [values]);
      inserted += batch.length;
      
      console.log(`進捗: ${inserted} / ${records.length} (${Math.round(inserted / records.length * 100)}%)`);
    }
    
    console.log(`✅ データベース投入完了: ${inserted}件`);
    
    // 統計情報を表示
    const [stats] = await conn.query(`
      SELECT 
        COUNT(*) as total_records,
        COUNT(DISTINCT prefecture) as prefecture_count,
        SUM(transactionCount) as total_transactions
      FROM aggregated_real_estate_data
    `);
    
    console.log('\n=== データベース統計 ===');
    console.log(`総レコード数: ${stats[0].total_records}`);
    console.log(`都道府県数: ${stats[0].prefecture_count}`);
    console.log(`総取引件数: ${stats[0].total_transactions}`);
    
  } finally {
    await conn.end();
  }
}

// メイン処理
async function main() {
  const csvFilePath = process.argv[2];
  
  if (!csvFilePath) {
    console.error('使用方法: node scripts/aggregate-csv-data.mjs <csv_file_path>');
    process.exit(1);
  }
  
  console.log('='  .repeat(60));
  console.log('全国不動産取引データ集計スクリプト');
  console.log('=' .repeat(60));
  console.log(`実行日時: ${new Date().toLocaleString('ja-JP')}`);
  console.log(`CSVファイル: ${csvFilePath}`);
  console.log('=' .repeat(60));
  
  try {
    // CSVファイルを読み込み
    console.log('\n📂 CSVファイル読み込み中...');
    const content = fs.readFileSync(csvFilePath, 'utf-8');
    const records = parseCSV(content);
    console.log(`✅ 読み込み完了: ${records.length}件`);
    
    // データを集計
    console.log('\n📊 データ集計中...');
    const aggregated = aggregateData(records);
    
    // データベースに投入
    console.log('\n💾 データベース投入中...');
    await insertToDatabase(aggregated);
    
    console.log('\n' + '='.repeat(60));
    console.log('✅ 全処理完了！');
    console.log('='.repeat(60));
    
  } catch (error) {
    console.error('❌ エラーが発生しました:', error);
    process.exit(1);
  }
}

main();
