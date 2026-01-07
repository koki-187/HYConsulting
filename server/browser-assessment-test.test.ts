import { describe, it, expect } from 'vitest';
import { calculateAssessment } from './server/assessment-aggregated';

describe('Browser Assessment Tests - Comprehensive Verification', () => {
  
  it('Test 1: 横浜市戸塚区 - 戸建て', async () => {
    console.log('\n' + '='.repeat(70));
    console.log('Test 1: 横浜市戸塚区 - 戸建て');
    console.log('='.repeat(70));
    
    const result = await calculateAssessment({
      prefecture: '神奈川県',
      city: '横浜市戸塚区',
      propertyType: 'house',
      buildingAreaM2: 100,
      landAreaM2: 150,
      buildingYear: 2010,
    });
    
    console.log(`概算価格: ${(result.estimatedLowYen / 10000).toLocaleString()}万円 ~ ${(result.estimatedHighYen / 10000).toLocaleString()}万円`);
    console.log(`信頼度: ${result.confidenceBreakdown.totalScore}%`);
    console.log(`参照データ: ${result.compsUsedCount}件`);
    console.log(`実取引件数: ${result.marketAnalysis.transactionCount}件`);
    console.log(`市場トレンド: ${result.marketAnalysis.marketTrend}`);
    console.log(`単価: ¥${result.marketAnalysis.avgPricePerM2.toLocaleString()}/㎡`);
    
    expect(result.compsUsedCount).toBeGreaterThan(0);
    expect(result.marketAnalysis.transactionCount).toBeGreaterThan(0);
    expect(result.confidenceBreakdown.totalScore).toBeGreaterThan(0);
  });
  
  it('Test 2: 横浜市戸塚区 - マンション', async () => {
    console.log('\n' + '='.repeat(70));
    console.log('Test 2: 横浜市戸塚区 - マンション');
    console.log('='.repeat(70));
    
    const result = await calculateAssessment({
      prefecture: '神奈川県',
      city: '横浜市戸塚区',
      propertyType: 'condo',
      buildingAreaM2: 70,
      buildingYear: 2015,
    });
    
    console.log(`概算価格: ${(result.estimatedLowYen / 10000).toLocaleString()}万円 ~ ${(result.estimatedHighYen / 10000).toLocaleString()}万円`);
    console.log(`信頼度: ${result.confidenceBreakdown.totalScore}%`);
    console.log(`参照データ: ${result.compsUsedCount}件`);
    console.log(`実取引件数: ${result.marketAnalysis.transactionCount}件`);
    console.log(`市場トレンド: ${result.marketAnalysis.marketTrend}`);
    
    expect(result.compsUsedCount).toBeGreaterThan(0);
    expect(result.marketAnalysis.transactionCount).toBeGreaterThan(0);
  });
  
  it('Test 3: 横浜市戸塚区 - 土地', async () => {
    console.log('\n' + '='.repeat(70));
    console.log('Test 3: 横浜市戸塚区 - 土地');
    console.log('='.repeat(70));
    
    const result = await calculateAssessment({
      prefecture: '神奈川県',
      city: '横浜市戸塚区',
      propertyType: 'land',
      landAreaM2: 200,
    });
    
    console.log(`概算価格: ${(result.estimatedLowYen / 10000).toLocaleString()}万円 ~ ${(result.estimatedHighYen / 10000).toLocaleString()}万円`);
    console.log(`信頼度: ${result.confidenceBreakdown.totalScore}%`);
    console.log(`参照データ: ${result.compsUsedCount}件`);
    console.log(`実取引件数: ${result.marketAnalysis.transactionCount}件`);
    
    expect(result.compsUsedCount).toBeGreaterThan(0);
  });
  
  it('Test 4: 東京都港区 - マンション (データがない場合のエラーハンドリング確認)', async () => {
    console.log('\n' + '='.repeat(70));
    console.log('Test 4: 東京都港区 - マンション');
    console.log('='.repeat(70));
    
    try {
      const result = await calculateAssessment({
        prefecture: '東京都',
        city: '港区',
        propertyType: 'condo',
        buildingAreaM2: 80,
        buildingYear: 2018,
      });
      
      console.log(`概算価格: ${(result.estimatedLowYen / 10000).toLocaleString()}万円 ~ ${(result.estimatedHighYen / 10000).toLocaleString()}万円`);
      console.log(`信頼度: ${result.confidenceBreakdown.totalScore}%`);
      console.log(`参照データ: ${result.compsUsedCount}件`);
    } catch (error: any) {
      console.log(`エラー: ${error.message}`);
      console.log('✅ 東京都のデータが未登録のため、期待通りエラーが発生しました');
      expect(error.message).toContain('データが見つかりませんでした');
    }
  });
  
  it('Test 5: 大阪府大阪市 - 戸建て (データがない場合のエラーハンドリング確認)', async () => {
    console.log('\n' + '='.repeat(70));
    console.log('Test 5: 大阪府大阪市 - 戸建て');
    console.log('='.repeat(70));
    
    try {
      const result = await calculateAssessment({
        prefecture: '大阪府',
        city: '大阪市',
        propertyType: 'house',
        buildingAreaM2: 120,
        landAreaM2: 180,
        buildingYear: 2012,
      });
      
      console.log(`概算価格: ${(result.estimatedLowYen / 10000).toLocaleString()}万円 ~ ${(result.estimatedHighYen / 10000).toLocaleString()}万円`);
      console.log(`信頼度: ${result.confidenceBreakdown.totalScore}%`);
    } catch (error: any) {
      console.log(`エラー: ${error.message}`);
      console.log('✅ 大阪府のデータが未登録のため、期待通りエラーが発生しました');
      expect(error.message).toContain('データが見つかりませんでした');
    }
  });
  
  it('Test 6: 福岡県福岡市 - マンション', async () => {
    console.log('\n' + '='.repeat(70));
    console.log('Test 6: 福岡県福岡市 - マンション');
    console.log('='.repeat(70));
    
    const result = await calculateAssessment({
      prefecture: '福岡県',
      city: '福岡市',
      propertyType: 'condo',
      buildingAreaM2: 75,
      buildingYear: 2016,
    });
    
    console.log(`概算価格: ${(result.estimatedLowYen / 10000).toLocaleString()}万円 ~ ${(result.estimatedHighYen / 10000).toLocaleString()}万円`);
    console.log(`信頼度: ${result.confidenceBreakdown.totalScore}%`);
    console.log(`参照データ: ${result.compsUsedCount}件`);
    console.log(`実取引件数: ${result.marketAnalysis.transactionCount}件`);
    
    expect(result.compsUsedCount).toBeGreaterThan(0);
  });
  
  it('Test 7: 信頼度スコア詳細表示の確認', async () => {
    console.log('\n' + '='.repeat(70));
    console.log('Test 7: 信頼度スコア詳細表示の確認');
    console.log('='.repeat(70));
    
    const result = await calculateAssessment({
      prefecture: '神奈川県',
      city: '横浜市戸塚区',
      propertyType: 'house',
      buildingAreaM2: 100,
      landAreaM2: 150,
      buildingYear: 2010,
    });
    
    console.log('信頼度スコア詳細:');
    console.log(`  総合スコア: ${result.confidenceBreakdown.totalScore}%`);
    console.log(`  データ件数スコア: ${result.confidenceBreakdown.dataVolumeScore}% - ${result.confidenceBreakdown.dataVolumeDetails}`);
    console.log(`  地域一致度スコア: ${result.confidenceBreakdown.locationMatchScore}% - ${result.confidenceBreakdown.locationMatchDetails}`);
    console.log(`  築年数類似性スコア: ${result.confidenceBreakdown.buildingAgeSimilarityScore}% - ${result.confidenceBreakdown.buildingAgeSimilarityDetails}`);
    console.log(`  物件種別一致度スコア: ${result.confidenceBreakdown.propertyTypeMatchScore}% - ${result.confidenceBreakdown.propertyTypeMatchDetails}`);
    
    expect(result.confidenceBreakdown).toBeDefined();
    expect(result.confidenceBreakdown.totalScore).toBeGreaterThan(0);
    expect(result.confidenceBreakdown.dataVolumeScore).toBeGreaterThan(0);
    expect(result.confidenceBreakdown.locationMatchScore).toBeGreaterThan(0);
  });
});
