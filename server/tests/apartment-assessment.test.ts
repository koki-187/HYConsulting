/**
 * アパート査定機能のテスト
 * 
 * テストケース:
 * 1. 東京都のアパート査定（基本ケース）
 * 2. 建築構造による価格調整の確認
 * 3. 階建による価格調整の確認
 * 4. 複合調整（建築構造 + 階建）の確認
 * 5. 既存の査定機能への影響確認（マンション、戸建て、土地）
 */

import { describe, it, expect, beforeAll } from 'vitest';
import { calculateAssessment, AssessmentInput } from '../assessment';

describe('アパート査定機能', () => {
  
  describe('基本的なアパート査定', () => {
    it('東京都世田谷区のアパート査定が正常に動作する', async () => {
      const input: AssessmentInput = {
        prefecture: '東京都',
        city: '世田谷区',
        propertyType: 'apartment',
        buildingAreaM2: 200,
        buildingYear: 2010,
      };
      
      const result = await calculateAssessment(input);
      
      expect(result).toBeDefined();
      expect(result.estimatedLowYen).toBeGreaterThan(0);
      expect(result.estimatedHighYen).toBeGreaterThan(result.estimatedLowYen);
      expect(result.compsUsedCount).toBeGreaterThan(0);
      expect(result.method).toBe('median_comps_adjusted');
      console.log(`東京都世田谷区アパート査定結果: ${Math.round(result.estimatedLowYen/10000)}万円 〜 ${Math.round(result.estimatedHighYen/10000)}万円 (${result.compsUsedCount}件)`);
    });

    it('神奈川県川崎市のアパート査定が正常に動作する', async () => {
      const input: AssessmentInput = {
        prefecture: '神奈川県',
        city: '川崎市多摩区',
        propertyType: 'apartment',
        buildingAreaM2: 150,
        buildingYear: 2015,
      };
      
      const result = await calculateAssessment(input);
      
      expect(result).toBeDefined();
      expect(result.estimatedLowYen).toBeGreaterThan(0);
      console.log(`神奈川県川崎市アパート査定結果: ${Math.round(result.estimatedLowYen/10000)}万円 〜 ${Math.round(result.estimatedHighYen/10000)}万円 (${result.compsUsedCount}件)`);
    });
  });

  describe('建築構造による価格調整', () => {
    it('RC造はより高い査定額になる', async () => {
      const baseInput: AssessmentInput = {
        prefecture: '東京都',
        city: '世田谷区',
        propertyType: 'apartment',
        buildingAreaM2: 200,
        buildingYear: 2010,
      };
      
      // 木造
      const woodResult = await calculateAssessment({
        ...baseInput,
        buildingStructure: '木造',
      });
      
      // RC造
      const rcResult = await calculateAssessment({
        ...baseInput,
        buildingStructure: 'RC',
      });
      
      // RC造は木造より高い査定額
      expect(rcResult.estimatedMidYen).toBeGreaterThan(woodResult.estimatedMidYen);
      
      const ratio = rcResult.estimatedMidYen / woodResult.estimatedMidYen;
      console.log(`建築構造調整: 木造=${Math.round(woodResult.estimatedMidYen/10000)}万円, RC=${Math.round(rcResult.estimatedMidYen/10000)}万円, 比率=${ratio.toFixed(2)}`);
      
      // RC造は木造の1.3〜1.4倍程度を期待
      expect(ratio).toBeGreaterThan(1.2);
      expect(ratio).toBeLessThan(1.5);
    });

    it('SRC造はRC造より高い査定額になる', async () => {
      const baseInput: AssessmentInput = {
        prefecture: '東京都',
        city: '世田谷区',
        propertyType: 'apartment',
        buildingAreaM2: 200,
        buildingYear: 2010,
      };
      
      // RC造
      const rcResult = await calculateAssessment({
        ...baseInput,
        buildingStructure: 'RC',
      });
      
      // SRC造
      const srcResult = await calculateAssessment({
        ...baseInput,
        buildingStructure: 'SRC',
      });
      
      // SRC造はRC造より高い査定額
      expect(srcResult.estimatedMidYen).toBeGreaterThan(rcResult.estimatedMidYen);
      console.log(`SRC vs RC: RC=${Math.round(rcResult.estimatedMidYen/10000)}万円, SRC=${Math.round(srcResult.estimatedMidYen/10000)}万円`);
    });
  });

  describe('階建による価格調整', () => {
    it('3階建ては2階建てより高い査定額になる', async () => {
      const baseInput: AssessmentInput = {
        prefecture: '東京都',
        city: '世田谷区',
        propertyType: 'apartment',
        buildingAreaM2: 200,
        buildingYear: 2010,
      };
      
      // 2階建て
      const twoFloorResult = await calculateAssessment({
        ...baseInput,
        floors: 2,
      });
      
      // 3階建て
      const threeFloorResult = await calculateAssessment({
        ...baseInput,
        floors: 3,
      });
      
      // 3階建ては2階建てより高い査定額
      expect(threeFloorResult.estimatedMidYen).toBeGreaterThan(twoFloorResult.estimatedMidYen);
      
      const ratio = threeFloorResult.estimatedMidYen / twoFloorResult.estimatedMidYen;
      console.log(`階建調整: 2階建て=${Math.round(twoFloorResult.estimatedMidYen/10000)}万円, 3階建て=${Math.round(threeFloorResult.estimatedMidYen/10000)}万円, 比率=${ratio.toFixed(2)}`);
      
      // 3階建ては2階建ての1.4〜1.7倍程度を期待
      expect(ratio).toBeGreaterThan(1.3);
      expect(ratio).toBeLessThan(1.8);
    });

    it('1階建ては2階建てより低い査定額になる', async () => {
      const baseInput: AssessmentInput = {
        prefecture: '東京都',
        city: '世田谷区',
        propertyType: 'apartment',
        buildingAreaM2: 200,
        buildingYear: 2010,
      };
      
      // 1階建て
      const oneFloorResult = await calculateAssessment({
        ...baseInput,
        floors: 1,
      });
      
      // 2階建て
      const twoFloorResult = await calculateAssessment({
        ...baseInput,
        floors: 2,
      });
      
      // 1階建ては2階建てより低い査定額
      expect(oneFloorResult.estimatedMidYen).toBeLessThan(twoFloorResult.estimatedMidYen);
      console.log(`1階建て vs 2階建て: 1階建て=${Math.round(oneFloorResult.estimatedMidYen/10000)}万円, 2階建て=${Math.round(twoFloorResult.estimatedMidYen/10000)}万円`);
    });
  });

  describe('複合調整', () => {
    it('RC造3階建ては木造2階建てより大幅に高い査定額になる', async () => {
      const baseInput: AssessmentInput = {
        prefecture: '東京都',
        city: '世田谷区',
        propertyType: 'apartment',
        buildingAreaM2: 200,
        buildingYear: 2010,
      };
      
      // 木造2階建て
      const woodTwoResult = await calculateAssessment({
        ...baseInput,
        buildingStructure: '木造',
        floors: 2,
      });
      
      // RC造3階建て
      const rcThreeResult = await calculateAssessment({
        ...baseInput,
        buildingStructure: 'RC',
        floors: 3,
      });
      
      // RC造3階建ては木造2階建てより大幅に高い査定額
      expect(rcThreeResult.estimatedMidYen).toBeGreaterThan(woodTwoResult.estimatedMidYen);
      
      const ratio = rcThreeResult.estimatedMidYen / woodTwoResult.estimatedMidYen;
      console.log(`複合調整: 木造2階建て=${Math.round(woodTwoResult.estimatedMidYen/10000)}万円, RC3階建て=${Math.round(rcThreeResult.estimatedMidYen/10000)}万円, 比率=${ratio.toFixed(2)}`);
      
      // RC造3階建ては木造2階建ての1.8〜2.2倍程度を期待
      expect(ratio).toBeGreaterThan(1.6);
      expect(ratio).toBeLessThan(2.5);
    });
  });

  describe('説明文の確認', () => {
    it('アパート査定の説明文に建築構造・階建調整が含まれる', async () => {
      const input: AssessmentInput = {
        prefecture: '東京都',
        city: '世田谷区',
        propertyType: 'apartment',
        buildingAreaM2: 200,
        buildingYear: 2010,
        buildingStructure: 'RC',
        floors: 3,
      };
      
      const result = await calculateAssessment(input);
      
      expect(result.explanation).toContain('アパート');
      expect(result.explanation).toContain('建築構造');
      expect(result.explanation).toContain('RC');
      expect(result.explanation).toContain('階建');
      expect(result.explanation).toContain('3階建て');
      console.log('説明文:', result.explanation);
    });
  });
});

describe('既存の査定機能への影響確認', () => {
  it('マンション査定が正常に動作する', async () => {
    const input: AssessmentInput = {
      prefecture: '東京都',
      city: '渋谷区',
      propertyType: 'condo',
      buildingAreaM2: 70,
      buildingYear: 2015,
    };
    
    const result = await calculateAssessment(input);
    
    expect(result).toBeDefined();
    expect(result.estimatedLowYen).toBeGreaterThan(0);
    console.log(`マンション査定結果: ${Math.round(result.estimatedLowYen/10000)}万円 〜 ${Math.round(result.estimatedHighYen/10000)}万円 (${result.compsUsedCount}件)`);
  });

  it('戸建て査定が正常に動作する', async () => {
    const input: AssessmentInput = {
      prefecture: '東京都',
      city: '世田谷区',
      propertyType: 'house',
      buildingAreaM2: 120,
      buildingYear: 2010,
    };
    
    const result = await calculateAssessment(input);
    
    expect(result).toBeDefined();
    expect(result.estimatedLowYen).toBeGreaterThan(0);
    console.log(`戸建て査定結果: ${Math.round(result.estimatedLowYen/10000)}万円 〜 ${Math.round(result.estimatedHighYen/10000)}万円 (${result.compsUsedCount}件)`);
  });

  it('土地査定が正常に動作する', async () => {
    const input: AssessmentInput = {
      prefecture: '東京都',
      city: '世田谷区',
      propertyType: 'land',
      landAreaM2: 150,
    };
    
    const result = await calculateAssessment(input);
    
    expect(result).toBeDefined();
    expect(result.estimatedLowYen).toBeGreaterThan(0);
    console.log(`土地査定結果: ${Math.round(result.estimatedLowYen/10000)}万円 〜 ${Math.round(result.estimatedHighYen/10000)}万円 (${result.compsUsedCount}件)`);
  });
});
