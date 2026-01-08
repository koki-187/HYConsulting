import { createReadStream } from 'fs';
import { parse } from 'csv-parse';
import { readdir } from 'fs/promises';
import { join } from 'path';
import mysql from 'mysql2/promise';
import iconv from 'iconv-lite';

const CSV_DIR = '/home/ubuntu/upload';
const DATABASE_URL = process.env.DATABASE_URL;

function getPrefectureName(filename) {
  const parts = filename.replace('_20202_20252.csv', '').split('_');
  if (parts.length > 1) {
    return parts.slice(1).join(' ').replace(' Prefecture', '');
  }
  return parts[0];
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
          const transactionType = (row['取引の事情等'] || '').trim();
          const propertyType = (row['種類'] || '').trim();
          
          const priceStr = (row['取引価格（総額）'] || '0').replace(/,/g, '').trim();
          const price = parseInt(priceStr) || 0;
          
          const areaStr = (row['面積（㎡）'] || '0').replace(/,/g, '').trim();
          const area = parseFloat(areaStr) || 0;
          
          let buildingYear = null;
          const buildingYearStr = (row['建築年'] || '').trim();
          if (buildingYearStr.startsWith('昭和') || buildingYearStr.startsWith('平成') || buildingYearStr.startsWith('令和')) {
            const match = buildingYearStr.match(/(\d+)/);
            if (match) {
              const eraYear = parseInt(match[1]);
              if (buildingYearStr.startsWith('昭和')) {
                buildingYear = 1925 + eraYear;
              } else if (buildingYearStr.startsWith('平成')) {
                buildingYear = 1988 + eraYear;
              } else if (buildingYearStr.startsWith('令和')) {
                buildingYear = 2018 + eraYear;
              }
            }
          } else if (/^\d{4}$/.test(buildingYearStr)) {
            buildingYear = parseInt(buildingYearStr);
          }
          
          const period = (row['取引時期'] || '').trim();
          
          if (!city || price === 0 || area === 0) {
            skipped++;
            return;
          }
          
          records.push([
            prefectureName,
            city,
            district,
            transactionType,
            propertyType,
            price,
            area,
            buildingYear,
            period,
            new Date().toISOString()
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
                (prefecture, city, district, transactionType, propertyType, 
                 priceYen, areaSquareMeters, buildingYear, transactionPeriod, createdAt)
                VALUES ?`,
                [batch]
              );
            }
          }
          console.log(`  ${prefectureName}: ${count.toLocaleString()}件投入完了 (スキップ: ${skipped}件)`);
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
