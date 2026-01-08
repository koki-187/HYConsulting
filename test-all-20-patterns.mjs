import fs from 'fs';

// Load test data
const testDataArray = JSON.parse(fs.readFileSync('/home/ubuntu/hy-consulting-lp/session67-test-data.json', 'utf-8'));

const API_URL = 'http://localhost:3000/api/assessment';

// Function to call the assessment API
async function callAssessmentAPI(testCase) {
  try {
    const payload = {
      propertyType: testCase.propertyType,
      prefecture: testCase.prefecture,
      city: `${testCase.city}${testCase.district}`,
      area: testCase.floorArea,
      buildingAge: testCase.buildingAge
    };

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      return {
        success: false,
        error: `HTTP ${response.status}: ${response.statusText}`,
        statusCode: response.status
      };
    }

    const result = await response.json();
    return {
      success: true,
      data: result
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

// Main test function
async function runAllTests() {
  console.log('='.repeat(80));
  console.log('Session 67: 神奈川県20パターン自動テスト開始');
  console.log('='.repeat(80));
  console.log('');

  const results = [];
  let successCount = 0;
  let failureCount = 0;

  for (let i = 0; i < testDataArray.length; i++) {
    const testCase = testDataArray[i];
    console.log(`\nTest ${i + 1}/${testDataArray.length}: ${testCase.city}${testCase.district} - ${testCase.propertyType}`);
    console.log(`  物件種別: ${testCase.propertyType}`);
    console.log(`  市区町村: ${testCase.city}${testCase.district}`);
    console.log(`  面積: ${testCase.floorArea}㎡`);
    console.log(`  築年数: ${testCase.buildingAge}年`);
    console.log(`  期待データ件数: ${testCase.expectedDataCount}件`);

    const startTime = Date.now();
    const apiResult = await callAssessmentAPI(testCase);
    const endTime = Date.now();
    const processingTime = ((endTime - startTime) / 1000).toFixed(2);

    const testResult = {
      testNumber: i + 1,
      ...testCase,
      processingTime: `${processingTime}秒`,
      success: apiResult.success,
      error: apiResult.error || null
    };

    if (apiResult.success) {
      const data = apiResult.data;
      testResult.estimatedPrice = data.estimatedPrice;
      testResult.priceRange = `${data.minPrice}万円～${data.maxPrice}万円`;
      testResult.similarTransactions = data.similarTransactions;
      testResult.confidenceLevel = `${data.confidenceLevel}%`;
      testResult.marketTrend = data.marketTrend || 'N/A';

      console.log(`  ✅ 成功`);
      console.log(`  査定価格: ${data.estimatedPrice}万円`);
      console.log(`  価格レンジ: ${data.minPrice}万円～${data.maxPrice}万円`);
      console.log(`  類似取引件数: ${data.similarTransactions}件`);
      console.log(`  信頼度: ${data.confidenceLevel}%`);
      console.log(`  処理時間: ${processingTime}秒`);
      successCount++;
    } else {
      console.log(`  ❌ 失敗: ${apiResult.error}`);
      failureCount++;
    }

    results.push(testResult);

    // Small delay to avoid overwhelming the server
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  console.log('');
  console.log('='.repeat(80));
  console.log('テスト完了サマリー');
  console.log('='.repeat(80));
  console.log(`総テスト数: ${testDataArray.length}`);
  console.log(`成功: ${successCount} (${((successCount / testDataArray.length) * 100).toFixed(1)}%)`);
  console.log(`失敗: ${failureCount} (${((failureCount / testDataArray.length) * 100).toFixed(1)}%)`);
  console.log('');

  // Save results to JSON file
  const outputFile = '/home/ubuntu/hy-consulting-lp/session67-api-test-results.json';
  fs.writeFileSync(outputFile, JSON.stringify({ summary: { total: testDataArray.length, success: successCount, failure: failureCount }, results }, null, 2));
  console.log(`結果をファイルに保存しました: ${outputFile}`);

  // Generate markdown report
  generateMarkdownReport(results, successCount, failureCount);

  return results;
}

// Generate markdown report
function generateMarkdownReport(results, successCount, failureCount) {
  let markdown = `# Session 67: 神奈川県20パターンAPI自動テスト結果\n\n`;
  markdown += `## テスト実施日時\n2026年1月8日\n\n`;
  markdown += `## テスト結果サマリー\n`;
  markdown += `- **総テスト数**: 20パターン\n`;
  markdown += `- **成功**: ${successCount}件 (${((successCount / results.length) * 100).toFixed(1)}%)\n`;
  markdown += `- **失敗**: ${failureCount}件 (${((failureCount / results.length) * 100).toFixed(1)}%)\n\n`;
  markdown += `---\n\n`;

  results.forEach((result, index) => {
    markdown += `### Test ${result.testNumber}: ${result.city} - ${result.propertyType} ${result.success ? '✅' : '❌'}\n\n`;
    markdown += `| 項目 | 値 |\n`;
    markdown += `|------|------|\n`;
    markdown += `| 物件種別 | ${result.propertyType} |\n`;
    markdown += `| 市区町村 | ${result.city} |\n`;
    markdown += `| 面積 | ${result.area}㎡ |\n`;
    markdown += `| 築年数 | ${result.buildingAge}年 |\n`;
    markdown += `| 期待データ件数 | ${result.expectedDataCount}件 |\n`;

    if (result.success) {
      markdown += `| **査定価格** | **${result.estimatedPrice}万円** |\n`;
      markdown += `| 価格レンジ | ${result.priceRange} |\n`;
      markdown += `| 類似取引件数 | ${result.similarTransactions}件 |\n`;
      markdown += `| 信頼度 | ${result.confidenceLevel} |\n`;
      markdown += `| 市場トレンド | ${result.marketTrend} |\n`;
      markdown += `| 処理時間 | ${result.processingTime} |\n`;
      markdown += `| エラー | なし |\n`;
    } else {
      markdown += `| エラー | ${result.error} |\n`;
      markdown += `| 処理時間 | ${result.processingTime} |\n`;
    }

    markdown += `\n---\n\n`;
  });

  const markdownFile = '/home/ubuntu/hy-consulting-lp/session67-api-test-results.md';
  fs.writeFileSync(markdownFile, markdown);
  console.log(`Markdownレポートを生成しました: ${markdownFile}`);
}

// Run the tests
runAllTests().catch(console.error);
