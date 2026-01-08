import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:3000';

const testCases = [
  { prefecture: '東京都', city: '新宿区', propertyType: 'マンション', area: 70, buildYear: 2015 },
  { prefecture: '東京都', city: '渋谷区', propertyType: '戸建て', area: 120, buildYear: 2010 },
  { prefecture: '神奈川県', city: '横浜市戸塚区', propertyType: '戸建て', area: 125, buildYear: 2015 },
  { prefecture: '神奈川県', city: '川崎市中原区', propertyType: 'マンション', area: 65, buildYear: 2018 },
  { prefecture: '大阪府', city: '大阪市中央区', propertyType: 'マンション', area: 80, buildYear: 2012 },
  { prefecture: '福岡県', city: '福岡市博多区', propertyType: '戸建て', area: 100, buildYear: 2008 },
  { prefecture: '北海道', city: '札幌市中央区', propertyType: 'マンション', area: 75, buildYear: 2016 },
  { prefecture: '愛知県', city: '名古屋市中区', propertyType: '土地', area: 150, buildYear: null },
];

async function testAssessment(testCase) {
  const startTime = Date.now();
  try {
    const response = await fetch(`${BASE_URL}/api/assessment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        propertyType: testCase.propertyType,
        prefecture: testCase.prefecture,
        city: testCase.city,
        area: testCase.area,
        buildYear: testCase.buildYear,
      }),
    });
    
    const elapsed = Date.now() - startTime;
    
    if (!response.ok) {
      const errorText = await response.text();
      return { 
        ...testCase, 
        status: 'FAILED', 
        error: `HTTP ${response.status}: ${errorText}`,
        elapsed 
      };
    }
    
    const data = await response.json();
    
    // 価格の妥当性チェック（100万円〜50億円の範囲）
    const minPrice = data.priceRange?.min || 0;
    const maxPrice = data.priceRange?.max || 0;
    const estimatedPrice = data.estimatedPrice || 0;
    
    const isPriceReasonable = estimatedPrice >= 1000000 && estimatedPrice <= 5000000000;
    const hasValidRange = minPrice > 0 && maxPrice > 0 && minPrice <= estimatedPrice && estimatedPrice <= maxPrice;
    
    return {
      ...testCase,
      status: isPriceReasonable && hasValidRange ? 'PASSED' : 'WARNING',
      estimatedPrice: `${(estimatedPrice / 10000).toLocaleString()}万円`,
      priceRange: `${(minPrice / 10000).toLocaleString()}万円〜${(maxPrice / 10000).toLocaleString()}万円`,
      similarTransactions: data.similarTransactions || 0,
      confidence: data.confidence || 0,
      elapsed,
      warning: !isPriceReasonable ? '価格が範囲外' : (!hasValidRange ? '価格レンジが不正' : null)
    };
  } catch (error) {
    return { 
      ...testCase, 
      status: 'ERROR', 
      error: error.message,
      elapsed: Date.now() - startTime 
    };
  }
}

async function runTests() {
  console.log('=== 全国複数エリア査定テスト ===\n');
  
  let passed = 0;
  let failed = 0;
  let warnings = 0;
  
  for (const testCase of testCases) {
    const result = await testAssessment(testCase);
    
    const statusIcon = result.status === 'PASSED' ? '✅' : (result.status === 'WARNING' ? '⚠️' : '❌');
    console.log(`${statusIcon} ${result.prefecture} ${result.city} (${result.propertyType})`);
    
    if (result.status === 'PASSED' || result.status === 'WARNING') {
      console.log(`   査定価格: ${result.estimatedPrice}`);
      console.log(`   価格レンジ: ${result.priceRange}`);
      console.log(`   類似取引: ${result.similarTransactions}件`);
      console.log(`   信頼度: ${result.confidence}%`);
      console.log(`   応答時間: ${result.elapsed}ms`);
      if (result.warning) console.log(`   警告: ${result.warning}`);
      
      if (result.status === 'PASSED') passed++;
      else warnings++;
    } else {
      console.log(`   エラー: ${result.error}`);
      failed++;
    }
    console.log('');
  }
  
  console.log('=== テスト結果サマリー ===');
  console.log(`PASSED: ${passed}/${testCases.length}`);
  console.log(`WARNINGS: ${warnings}/${testCases.length}`);
  console.log(`FAILED: ${failed}/${testCases.length}`);
  
  return { passed, warnings, failed, total: testCases.length };
}

runTests().then(result => {
  process.exit(result.failed > 0 ? 1 : 0);
});
