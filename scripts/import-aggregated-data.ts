#!/usr/bin/env tsx
/**
 * Import Aggregated Real Estate Data
 * 
 * Imports nationwide aggregated transaction data from JSON file to database
 * Source: realEstateDataByType_FINAL.json (86.9MB, 353,102 entries)
 * 
 * Usage:
 *   npx tsx scripts/import-aggregated-data.ts [--test] [--prefecture=東京都]
 * 
 * Options:
 *   --test: Import only first 100 entries for testing
 *   --prefecture=NAME: Import only specified prefecture
 *   --dry-run: Validate data without inserting
 */

import { readFileSync } from 'fs';
import { getDb } from '../server/db';
import { aggregatedRealEstateData, datasetVersions } from '../drizzle/schema';
import { eq } from 'drizzle-orm';

const args = process.argv.slice(2);
const isTest = args.includes('--test');
const isDryRun = args.includes('--dry-run');
const prefectureFilter = args.find(arg => arg.startsWith('--prefecture='))?.split('=')[1];

console.log('\n' + '='.repeat(60));
console.log('全国不動産データ投入スクリプト');
console.log('='.repeat(60));
console.log(`Mode: ${isDryRun ? 'DRY RUN' : isTest ? 'TEST' : 'PRODUCTION'}`);
if (prefectureFilter) {
  console.log(`Filter: ${prefectureFilter}のみ`);
}
console.log('');

async function main() {
  const db = await getDb();

  // Load JSON data
  console.log('📂 JSONファイル読み込み中...');
  const jsonPath = '/home/ubuntu/upload/realEstateDataByType_FINAL.json';
  const rawData = JSON.parse(readFileSync(jsonPath, 'utf-8'));
  console.log('✅ 読み込み完了\n');

  // Create dataset version
  const datasetVersionId = `mlit_aggregated_2026Q1`;

  if (!isDryRun) {
    console.log('📦 データセットバージョン作成中...');
    try {
      await db.insert(datasetVersions).values({
        id: datasetVersionId,
        source: 'MLIT 不動産取引価格情報（集計版）',
        description: '全国47都道府県、7,760市区町村、189,391地区の集計データ',
        publishedDate: '2026-01-01',
        notes: 'Imported from realEstateDataByType_FINAL.json',
      }).onDuplicateKeyUpdate({
        set: { ingestedAt: new Date() }
      });
      console.log('✅ データセットバージョン作成完了\n');
    } catch (error: any) {
      console.log('ℹ️  データセットバージョンは既に存在します\n');
    }
  }

  // Transform and insert data
  console.log('🔄 データ変換と投入開始...\n');

  const propertyTypeMap: Record<string, string> = {
    '土地': '土地',
    '一戸建て': '一戸建て',
    'マンション': 'マンション',
    '林地': '林地',
    '農地': '農地',
  };

  const buildingAgeGroupMap: Record<string, string> = {
    '0～5年': '0～5年',
    '5～10年': '5～10年',
    '10～15年': '10～15年',
    '15～20年': '15～20年',
    '20～30年': '20～30年',
    '30年以上': '30年以上',
    '不明': '不明',
  };

  let totalEntries = 0;
  let insertedEntries = 0;
  let skippedEntries = 0;
  let errorEntries = 0;
  const errors: any[] = [];

  const batchSize = 1000;
  let batch: any[] = [];

  for (const [propertyType, prefectures] of Object.entries(rawData)) {
    if (!propertyTypeMap[propertyType]) {
      console.warn(`⚠️  Unknown property type: ${propertyType}`);
      continue;
    }

    for (const [prefecture, cities] of Object.entries(prefectures as any)) {
      // Prefecture filter
      if (prefectureFilter && prefecture !== prefectureFilter) {
        continue;
      }

      console.log(`Processing: ${propertyType} > ${prefecture}...`);

      for (const [city, districts] of Object.entries(cities as any)) {
        for (const [district, ageGroups] of Object.entries(districts as any)) {
          for (const [ageGroup, data] of Object.entries(ageGroups as any)) {
            totalEntries++;

            // Test mode: limit to 100 entries
            if (isTest && totalEntries > 100) {
              break;
            }

            // Validate data
            if (!data.count || data.count <= 0) {
              skippedEntries++;
              continue;
            }

            if (!data.totalPrice || !data.totalArea) {
              skippedEntries++;
              continue;
            }

            // Map building age group
            const mappedAgeGroup = buildingAgeGroupMap[ageGroup] || '不明';

            // Prepare entry
            const entry = {
              propertyType: propertyTypeMap[propertyType],
              prefecture,
              city,
              district,
              buildingAgeGroup: mappedAgeGroup,
              totalPriceYen: data.totalPrice.toString(),
              totalAreaM2: data.totalArea.toString(),
              transactionCount: data.count,
              pricePerTsubo: data.pricePerTsubo || 0,
              averagePriceYen: data.averagePrice || 0,
              averageAreaM2: data.averageArea ? data.averageArea.toString() : '0',
              datasetVersionId,
            };

            // Validate entry
            try {
              if (entry.transactionCount <= 0) throw new Error('Invalid count');
              if (parseFloat(entry.totalPriceYen) <= 0) throw new Error('Invalid totalPrice');
              if (parseFloat(entry.totalAreaM2) <= 0) throw new Error('Invalid totalArea');

              batch.push(entry);
              insertedEntries++;

              // Insert batch
              if (batch.length >= batchSize && !isDryRun) {
                await db.insert(aggregatedRealEstateData).values(batch);
                console.log(`  ✓ Inserted ${insertedEntries} entries (${totalEntries} processed)`);
                batch = [];
              }
            } catch (error: any) {
              errorEntries++;
              errors.push({
                entry,
                error: error.message,
              });
              if (errors.length <= 10) {
                console.error(`  ❌ Error: ${error.message}`, entry);
              }
            }

            if (isTest && totalEntries >= 100) {
              break;
            }
          }
          if (isTest && totalEntries >= 100) break;
        }
        if (isTest && totalEntries >= 100) break;
      }
      if (isTest && totalEntries >= 100) break;
    }
    if (isTest && totalEntries >= 100) break;
  }

  // Insert remaining batch
  if (batch.length > 0 && !isDryRun) {
    await db.insert(aggregatedRealEstateData).values(batch);
    console.log(`  ✓ Inserted final batch: ${batch.length} entries`);
  }

  console.log('\n' + '='.repeat(60));
  console.log('投入完了');
  console.log('='.repeat(60));
  console.log(`総処理件数: ${totalEntries.toLocaleString()}`);
  console.log(`投入成功: ${insertedEntries.toLocaleString()}`);
  console.log(`スキップ: ${skippedEntries.toLocaleString()}`);
  console.log(`エラー: ${errorEntries.toLocaleString()}`);

  if (errors.length > 0) {
    console.log(`\n最初の${Math.min(errors.length, 10)}件のエラー:`);
    errors.slice(0, 10).forEach((err, i) => {
      console.log(`${i + 1}. ${err.error}`);
      console.log(`   ${JSON.stringify(err.entry).substring(0, 100)}...`);
    });
  }

  if (isDryRun) {
    console.log('\n✅ DRY RUN完了（データベースへの投入なし）');
  } else if (isTest) {
    console.log('\n✅ TESTモード完了（100件のみ投入）');
  } else {
    console.log('\n✅ 本番投入完了');
  }

  process.exit(0);
}

main().catch((error) => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});
