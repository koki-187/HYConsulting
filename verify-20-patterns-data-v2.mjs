import fs from 'fs';
import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';

const { Pool } = pg;

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL?.includes('localhost') ? false : { rejectUnauthorized: false }
});

const db = drizzle(pool);

// Load test data
const testDataArray = JSON.parse(fs.readFileSync('/home/ubuntu/hy-consulting-lp/session67-test-data.json', 'utf-8'));

// Property type mapping
const propertyTypeMap = {
  'マンション': 'condo',
  '戸建て': 'house',
  '土地': 'land',
  'アパート': 'apartment'
};

async function verifyDataExistence() {
  console.log('='.repeat(80));
  console.log('Session 67: 神奈川県20パターンデータ存在検証 (v2 - 正しいスキーマ)');
  console.log('='.repeat(80));
  console.log('');

  const results = [];

  for (let i = 0; i < testDataArray.length; i++) {
    const testCase = testDataArray[i];
    const fullCity = `${testCase.city}${testCase.district}`;
    const propertyTypeEn = propertyTypeMap[testCase.propertyType] || testCase.propertyType;

    console.log(`\nTest ${i + 1}/${testDataArray.length}: ${fullCity} - ${testCase.propertyType}`);
    console.log(`  物件種別: ${testCase.propertyType} (${propertyTypeEn})`);
    console.log(`  市区町村: ${fullCity}`);
    console.log(`  面積: ${testCase.floorArea}㎡`);
    console.log(`  築年数: ${testCase.buildingAge}年`);
    console.log(`  期待データ件数: ${testCase.expectedDataCount}件`);

    try {
      // Query to count matching records using raw SQL
      const countQuery = `
        SELECT COUNT(*) as count
        FROM transactions
        WHERE prefecture = $1
          AND city LIKE $2
          AND "propertyType" = $3
      `;

      const countResult = await pool.query(countQuery, [
        testCase.prefecture,
        `%${testCase.city}%${testCase.district}%`,
        propertyTypeEn
      ]);

      const count = Number(countResult.rows[0]?.count || 0);

      console.log(`  ✅ データ件数: ${count}件`);

      // Additional query: Get sample data with similar characteristics
      const sampleQuery = `
        SELECT 
          prefecture, 
          city, 
          ward,
          district,
          "propertyType", 
          "priceYen", 
          "buildingAreaM2",
          "landAreaM2",
          "buildingYear",
          "transactionYm"
        FROM transactions
        WHERE prefecture = $1
          AND city LIKE $2
          AND "propertyType" = $3
        LIMIT 5
      `;

      const sampleResult = await pool.query(sampleQuery, [
        testCase.prefecture,
        `%${testCase.city}%${testCase.district}%`,
        propertyTypeEn
      ]);

      const samples = sampleResult.rows;

      if (samples.length > 0) {
        console.log(`  サンプルデータ（最初の5件）:`);
        samples.forEach((sample, idx) => {
          const priceManYen = Math.round(Number(sample.priceYen) / 10000);
          const buildingArea = sample.buildingAreaM2 ? `${Number(sample.buildingAreaM2).toFixed(1)}㎡` : 'N/A';
          const landArea = sample.landAreaM2 ? `${Number(sample.landAreaM2).toFixed(1)}㎡` : 'N/A';
          const buildingYearText = sample.buildingYear ? `${sample.buildingYear}年築` : '築年不明';
          console.log(`    ${idx + 1}. ${sample.city}${sample.ward || ''}${sample.district || ''} | ${sample.propertyType} | ${priceManYen}万円 | 建物:${buildingArea} 土地:${landArea} | ${buildingYearText} | ${sample.transactionYm}`);
        });
      }

      results.push({
        testNumber: i + 1,
        ...testCase,
        fullCity,
        propertyTypeEn,
        actualDataCount: count,
        dataExists: count > 0,
        samplesFound: samples.length,
      });

    } catch (error) {
      console.log(`  ❌ エラー: ${error.message}`);
      results.push({
        testNumber: i + 1,
        ...testCase,
        fullCity,
        propertyTypeEn,
        actualDataCount: 0,
        dataExists: false,
        error: error.message,
      });
    }
  }

  console.log('');
  console.log('='.repeat(80));
  console.log('検証完了サマリー');
  console.log('='.repeat(80));

  const withData = results.filter(r => r.dataExists).length;
  const withoutData = results.filter(r => !r.dataExists).length;

  console.log(`総テスト数: ${results.length}`);
  console.log(`データ存在: ${withData} (${((withData / results.length) * 100).toFixed(1)}%)`);
  console.log(`データなし: ${withoutData} (${((withoutData / results.length) * 100).toFixed(1)}%)`);
  console.log('');

  // Calculate statistics
  const totalExpected = results.reduce((sum, r) => sum + r.expectedDataCount, 0);
  const totalActual = results.reduce((sum, r) => sum + (r.actualDataCount || 0), 0);

  console.log(`期待データ総数: ${totalExpected.toLocaleString()}件`);
  console.log(`実際のデータ総数: ${totalActual.toLocaleString()}件`);
  console.log(`データ充足率: ${totalExpected > 0 ? ((totalActual / totalExpected) * 100).toFixed(1) : '0.0'}%`);
  console.log('');

  // Detailed analysis
  console.log('詳細分析:');
  results.forEach(r => {
    if (r.dataExists) {
      const fulfillment = ((r.actualDataCount / r.expectedDataCount) * 100).toFixed(1);
      console.log(`  ✅ ${r.fullCity} (${r.propertyType}): ${r.actualDataCount}件 / ${r.expectedDataCount}件 (${fulfillment}%)`);
    } else {
      console.log(`  ❌ ${r.fullCity} (${r.propertyType}): データなし`);
    }
  });

  // Save results to JSON
  const outputFile = '/home/ubuntu/hy-consulting-lp/session67-data-verification-results-v2.json';
  fs.writeFileSync(outputFile, JSON.stringify({ 
    summary: { 
      total: results.length, 
      withData, 
      withoutData,
      totalExpected,
      totalActual,
      fulfillmentRate: totalExpected > 0 ? ((totalActual / totalExpected) * 100).toFixed(1) + '%' : '0.0%'
    }, 
    results 
  }, null, 2));
  console.log(`\n結果をファイルに保存しました: ${outputFile}`);

  // Generate markdown report
  generateMarkdownReport(results, withData, withoutData, totalExpected, totalActual);

  await pool.end();
}

function generateMarkdownReport(results, withData, withoutData, totalExpected, totalActual) {
  let markdown = `# Session 67: 神奈川県20パターンデータ存在検証結果 (v2)\n\n`;
  markdown += `## 検証実施日時\n2026年1月8日\n\n`;
  markdown += `## 検証結果サマリー\n`;
  markdown += `- **総テスト数**: 20パターン\n`;
  markdown += `- **データ存在**: ${withData}件 (${((withData / results.length) * 100).toFixed(1)}%)\n`;
  markdown += `- **データなし**: ${withoutData}件 (${((withoutData / results.length) * 100).toFixed(1)}%)\n`;
  markdown += `- **期待データ総数**: ${totalExpected.toLocaleString()}件\n`;
  markdown += `- **実際のデータ総数**: ${totalActual.toLocaleString()}件\n`;
  markdown += `- **データ充足率**: ${totalExpected > 0 ? ((totalActual / totalExpected) * 100).toFixed(1) : '0.0'}%\n\n`;
  markdown += `---\n\n`;

  results.forEach((result) => {
    const fulfillment = result.expectedDataCount > 0 ? ((result.actualDataCount / result.expectedDataCount) * 100).toFixed(1) : '0.0';
    markdown += `### Test ${result.testNumber}: ${result.fullCity} - ${result.propertyType} ${result.dataExists ? '✅' : '❌'}\n\n`;
    markdown += `| 項目 | 値 |\n`;
    markdown += `|------|------|\n`;
    markdown += `| 物件種別 | ${result.propertyType} (${result.propertyTypeEn}) |\n`;
    markdown += `| 市区町村 | ${result.fullCity} |\n`;
    markdown += `| 面積 | ${result.floorArea}㎡ |\n`;
    markdown += `| 築年数 | ${result.buildingAge}年 |\n`;
    markdown += `| 期待データ件数 | ${result.expectedDataCount}件 |\n`;
    markdown += `| **実際のデータ件数** | **${result.actualDataCount}件** |\n`;
    markdown += `| **データ充足率** | **${fulfillment}%** |\n`;
    markdown += `| データ存在 | ${result.dataExists ? 'あり ✅' : 'なし ❌'} |\n`;
    
    if (result.error) {
      markdown += `| エラー | ${result.error} |\n`;
    }

    markdown += `\n---\n\n`;
  });

  const markdownFile = '/home/ubuntu/hy-consulting-lp/session67-data-verification-results-v2.md';
  fs.writeFileSync(markdownFile, markdown);
  console.log(`Markdownレポートを生成しました: ${markdownFile}`);
}

// Run verification
verifyDataExistence().catch(console.error);
