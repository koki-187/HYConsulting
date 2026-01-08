// 査定ロジックの直接テスト
// ESモジュールの問題を回避するため、動的インポートを使用

console.log("🔍 査定ロジック直接テスト開始\n");

async function testAssessment() {
  try {
    // 動的インポートでESモジュールを読み込み
    const { calculateAssessment } = await import('./server/assessment.js');
    
    console.log("✅ assessment.js のインポート成功\n");
    
    // テストケース1: 東京都新宿区の戸建て
    console.log("📍 テストケース1: 東京都新宿区の戸建て");
    console.log("─".repeat(50));
    
    const testInput1 = {
      prefecture: "東京都",
      city: "新宿区",
      propertyType: "house",
      landAreaM2: 100,
      buildingAreaM2: 80,
      buildingYear: 2004,
      stationDistanceMin: 10
    };
    
    console.log("入力データ:", testInput1);
    console.log("\n⏳ 査定計算中...\n");
    
    const startTime = Date.now();
    const result1 = await calculateAssessment(testInput1);
    const endTime = Date.now();
    
    console.log("✅ 査定完了! (処理時間:", (endTime - startTime), "ms)\n");
    console.log("📊 査定結果:");
    console.log("  概算最低価格:", (result1.estimatedLowYen / 10000).toLocaleString(), "万円");
    console.log("  概算価格:", (result1.estimatedMidYen / 10000).toLocaleString(), "万円");
    console.log("  概算最高価格:", (result1.estimatedHighYen / 10000).toLocaleString(), "万円");
    console.log("  参照取引件数:", result1.compsUsedCount, "件");
    console.log("  査定方法:", result1.method);
    console.log("  市場トレンド:", result1.marketAnalysis.marketTrend);
    console.log("  周辺取引件数:", result1.marketAnalysis.transactionCount, "件");
    console.log("  平均単価:", result1.marketAnalysis.avgPricePerM2.toLocaleString(), "円/㎡");
    console.log("\n" + "─".repeat(50) + "\n");
    
    // テストケース2: 神奈川県横浜市戸塚区のマンション
    console.log("📍 テストケース2: 神奈川県横浜市戸塚区のマンション");
    console.log("─".repeat(50));
    
    const testInput2 = {
      prefecture: "神奈川県",
      city: "横浜市戸塚区",
      propertyType: "condo",
      buildingAreaM2: 70,
      buildingYear: 2010,
      stationDistanceMin: 5
    };
    
    console.log("入力データ:", testInput2);
    console.log("\n⏳ 査定計算中...\n");
    
    const startTime2 = Date.now();
    const result2 = await calculateAssessment(testInput2);
    const endTime2 = Date.now();
    
    console.log("✅ 査定完了! (処理時間:", (endTime2 - startTime2), "ms)\n");
    console.log("📊 査定結果:");
    console.log("  概算最低価格:", (result2.estimatedLowYen / 10000).toLocaleString(), "万円");
    console.log("  概算価格:", (result2.estimatedMidYen / 10000).toLocaleString(), "万円");
    console.log("  概算最高価格:", (result2.estimatedHighYen / 10000).toLocaleString(), "万円");
    console.log("  参照取引件数:", result2.compsUsedCount, "件");
    console.log("  査定方法:", result2.method);
    console.log("  市場トレンド:", result2.marketAnalysis.marketTrend);
    console.log("  周辺取引件数:", result2.marketAnalysis.transactionCount, "件");
    console.log("  平均単価:", result2.marketAnalysis.avgPricePerM2.toLocaleString(), "円/㎡");
    console.log("\n" + "─".repeat(50) + "\n");
    
    // テストケース3: 大阪府大阪市の土地
    console.log("📍 テストケース3: 大阪府大阪市の土地");
    console.log("─".repeat(50));
    
    const testInput3 = {
      prefecture: "大阪府",
      city: "大阪市",
      propertyType: "land",
      landAreaM2: 150
    };
    
    console.log("入力データ:", testInput3);
    console.log("\n⏳ 査定計算中...\n");
    
    const startTime3 = Date.now();
    const result3 = await calculateAssessment(testInput3);
    const endTime3 = Date.now();
    
    console.log("✅ 査定完了! (処理時間:", (endTime3 - startTime3), "ms)\n");
    console.log("📊 査定結果:");
    console.log("  概算最低価格:", (result3.estimatedLowYen / 10000).toLocaleString(), "万円");
    console.log("  概算価格:", (result3.estimatedMidYen / 10000).toLocaleString(), "万円");
    console.log("  概算最高価格:", (result3.estimatedHighYen / 10000).toLocaleString(), "万円");
    console.log("  参照取引件数:", result3.compsUsedCount, "件");
    console.log("  査定方法:", result3.method);
    console.log("  市場トレンド:", result3.marketAnalysis.marketTrend);
    console.log("  周辺取引件数:", result3.marketAnalysis.transactionCount, "件");
    console.log("  平均単価:", result3.marketAnalysis.avgPricePerM2.toLocaleString(), "円/㎡");
    console.log("\n" + "─".repeat(50) + "\n");
    
    console.log("✅ 全テスト完了!");
    
  } catch (error) {
    console.error("❌ エラー発生:", error.message);
    console.error("スタックトレース:", error.stack);
    process.exit(1);
  }
}

testAssessment();
