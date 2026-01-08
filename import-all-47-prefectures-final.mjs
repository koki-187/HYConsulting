import { createReadStream } from 'fs';
import { parse } from 'csv-parse';
import { readdir } from 'fs/promises';
import { join } from 'path';
import mysql from 'mysql2/promise';
import iconv from 'iconv-lite';

const CSV_DIR = '/home/ubuntu/upload';
const DATABASE_URL = process.env.DATABASE_URL;
const DATASET_VERSION_ID = 'mlit_20202_20252_v1';

function getPrefectureName(filename) {
  const parts = filename.replace('_20202_20252.csv', '').split('_');
  if (parts.length > 1) {
    return parts.slice(1).join(' ').replace(' Prefecture', '');
  }
  return parts[0];
}

function parseTransactionYm(period) {
  // Example: "2020年第1四半期" -> "2020-01"
  const match = period.match(/(\d{4})年第(\d)四半期/);
  if (match) {
    const year = match[1];
    const quarter = parseInt(match[2]);
    const month = (quarter - 1) * 3 + 1;
    return `${year}-${month.toString().padStart(2, '0')}`;
  }
  return null;
}

function parseBuildingYear(buildingYearStr) {
  if (!buildingYearStr) return null;
  
  if (buildingYearStr.startsWith('昭和') || buildingYearStr.startsWith('平成') || buildingYearStr.startsWith('令和')) {
    const match = buildingYearStr.match(/(\d+)/);
    if (match) {
      const eraYear = parseInt(match[1]);
      if (buildingYearStr.startsWith('昭和')) {
        return 1925 + eraYear;
      } else if (buildingYearStr.startsWith('平成')) {
        return 1988 + eraYear;
      } else if (buildingYearStr.startsWith('令和')) {
        return 2018 + eraYear;
      }
    }
  } else if (/^\d{4}$/.test(buildingYearStr)) {
    return parseInt(buildingYearStr);
  }
  return null;
}

function mapPropertyType(typeStr) {
  if (!typeStr) return null;
  if (typeStr.includes('宅地') || typeStr.includes('土地')) return 'land';
  if (typeStr.includes('中古マンション') || typeStr.includes('マンション')) return 'condo';
  if (typeStr.includes('戸建') || typeStr.includes('住宅')) return 'house';
  return null;
}

async function importCSVFile(csvFile, connection, prefectureName) {
  console.log(`\n処理中: ${prefectureName} (${csvFile})`);
  
  return new Promise((resolve, reject) => {
    const records = [];
    let count = 0;
    let skipped = 0;
    
    createReadStream(join(CSV_DIR, csvFile))
      .pipe(iconv.decodeStream('cp932'))
      .pipe(parse({ 
        columns: true, 
        skip_empty_lines: true,
        relax_quotes: true,
        relax_column_count: true,
        trim: true
      }))
      .on('data', (row) => {
        try {
          const city = (row['市区町村名'] || '').trim();
          const district = (row['地区名'] || '').trim();
          const typeStr = (row['種類'] || '').trim();
          const propertyType = mapPropertyType(typeStr);
          
          const priceStr = (row['取引価格（総額）'] || '0').replace(/,/g, '').trim();
          const price = parseInt(priceStr) || 0;
          
          const landAreaStr = (row['面積（㎡）'] || '0').replace(/,/g, '').trim();
          const landArea = parseFloat(landAreaStr) || 0;
          
          const buildingAreaStr = (row['延床面積（㎡）'] || '0').replace(/,/g, '').trim();
          const buildingArea = parseFloat(buildingAreaStr) || 0;
          
          const buildingYear = parseBuildingYear((row['建築年'] || '').trim());
          
          const period = (row['取引時期'] || '').trim();
          const transactionYm = parseTransactionYm(period);
          
          const stationDistanceStr = (row['最寄駅：距離（分）'] || '').trim();
          const stationDistance = parseInt(stationDistanceStr) || null;
          
          const nearestStation = (row['最寄駅：名称'] || '').trim() || null;
          const structure = (row['建物の構造'] || '').trim() || null;
          const floorPlan = (row['間取り'] || '').trim() || null;
          
          // Calculate unit price per sqm
          let unitPrice = null;
          if (price > 0 && landArea > 0) {
            unitPrice = price / landArea;
          }
          
          if (!city || !propertyType || price === 0 || landArea === 0 || !transactionYm) {
            skipped++;
            return;
          }
          
          records.push([
            DATASET_VERSION_ID,
            transactionYm,
            prefectureName,
            city,
            null, // ward
            district || null,
            propertyType,
            landArea,
            buildingArea || null,
            buildingYear,
            structure,
            floorPlan,
            null, // floor
            nearestStation,
            stationDistance,
            price,
            unitPrice
          ]);
          
          count++;
          
          if (count % 1000 === 0) {
            process.stdout.write(`  ${count.toLocaleString()}件処理中...\r`);
          }
        } catch (e) {
          skipped++;
        }
      })
      .on('end', async () => {
        try {
          if (records.length > 0) {
            // Insert in batches
            const batchSize = 1000;
            for (let i = 0; i < records.length; i += batchSize) {
              const batch = records.slice(i, i + batchSize);
              await connection.query(
                `INSERT INTO transactions 
                (datasetVersionId, transactionYm, prefecture, city, ward, district, 
                 propertyType, landAreaM2, buildingAreaM2, buildingYear, structure, 
                 floorPlan, floor, nearestStation, stationDistanceMin, priceYen, unitPriceYenPerM2)
                VALUES ?`,
                [batch]
              );
            }
          }
          console.log(`  ${prefectureName}: ${count.toLocaleString()}件投入完了 (スキップ: ${skipped.toLocaleString()}件)`);
          resolve(count);
        } catch (e) {
          console.error(`\nエラー (${prefectureName}):`, e.message);
          resolve(count);
        }
      })
      .on('error', (err) => {
        console.error(`\nCSVパースエラー (${prefectureName}):`, err.message);
        resolve(count);
      });
  });
}

async function main() {
  console.log('='.repeat(60));
  console.log('全47都道府県データベース投入開始');
  console.log('='.repeat(60));
  
  const connection = await mysql.createConnection(DATABASE_URL);
  
  console.log('\n既存データを削除中...');
  await connection.query('DELETE FROM transactions');
  console.log('既存データ削除完了');
  
  const files = await readdir(CSV_DIR);
  const csvFiles = files
    .filter(f => f.endsWith('_20202_20252.csv'))
    .sort();
  
  console.log(`\n処理対象: ${csvFiles.length}ファイル`);
  
  let totalCount = 0;
  const startTime = Date.now();
  
  for (let i = 0; i < csvFiles.length; i++) {
    const csvFile = csvFiles[i];
    const prefectureName = getPrefectureName(csvFile);
    console.log(`\n[${i + 1}/${csvFiles.length}]`);
    const count = await importCSVFile(csvFile, connection, prefectureName);
    totalCount += count;
  }
  
  await connection.end();
  
  const duration = (Date.now() - startTime) / 1000;
  
  console.log('\n' + '='.repeat(60));
  console.log('データ投入完了');
  console.log('='.repeat(60));
  console.log(`総投入件数: ${totalCount.toLocaleString()}件`);
  console.log(`処理時間: ${duration.toFixed(1)}秒`);
  console.log(`処理速度: ${(totalCount / duration).toFixed(0)}件/秒`);
  console.log('='.repeat(60));
  
  process.exit(0);
}

main().catch(console.error);
