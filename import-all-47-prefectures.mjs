import { createReadStream } from 'fs';
import { parse } from 'csv-parse';
import { readdir } from 'fs/promises';
import { join } from 'path';
import mysql from 'mysql2/promise';

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
    
    createReadStream(join(CSV_DIR, csvFile))
      .pipe(parse({ columns: true, skip_empty_lines: true }))
      .on('data', (row) => {
        try {
          const city = (row['Municipality'] || '').trim();
          const district = (row['District Name'] || '').trim();
          const transactionType = (row['Type'] || '').trim();
          const propertyType = (row['Type'] || '').trim();
          
          const priceStr = (row['Trade Price'] || '0').replace(/,/g, '').trim();
          const price = parseInt(priceStr) || 0;
          
          const areaStr = (row['Area(㎡)'] || '0').replace(/,/g, '').trim();
          const area = parseFloat(areaStr) || 0;
          
          let buildingYear = null;
          const buildingYearStr = (row['Building Year'] || '').trim();
          if (buildingYearStr.startsWith('Built in ')) {
            const yearStr = buildingYearStr.replace('Built in ', '').trim();
            if (/^\d+$/.test(yearStr)) {
              buildingYear = parseInt(yearStr);
            }
          }
          
          const period = (row['Period'] || '').trim();
          
          if (!city || price === 0 || area === 0) {
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
          // Skip error rows
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
          console.log(`  ${prefectureName}: ${count.toLocaleString()}件投入完了`);
          resolve(count);
        } catch (e) {
          reject(e);
        }
      })
      .on('error', reject);
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
