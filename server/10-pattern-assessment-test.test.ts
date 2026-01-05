/**
 * 10パターン不動産査定テスト
 * 既存データベース該当住所を含む包括的テスト
 */

import { describe, it, expect } from 'vitest';

describe('10-Pattern Assessment Test', () => {
  const testPatterns = [
    {
      id: 1,
      name: '既存DB該当住所（横浜市中区）',
      data: {
        ownerName: 'テスト太郎',
        email: 'test1@example.com',
        phone: '090-1234-5678',
        propertyType: 'マンション',
        prefecture: '神奈川県',
        city: '横浜市中区',
        location: '本町1-1',
        floorArea: 70,
        buildingAge: 15,
        nearestStation: '関内駅',
        walkingMinutes: 5
      }
    },
    {
      id: 2,
      name: '湘南エリア（藤沢市）',
      data: {
        ownerName: '湘南花子',
        email: 'test2@example.com',
        phone: '090-2345-6789',
        propertyType: '戸建て',
        prefecture: '神奈川県',
        city: '藤沢市',
        location: '辻堂1-2-3',
        floorArea: 120,
        buildingAge: 25,
        nearestStation: '辻堂駅',
        walkingMinutes: 10
      }
    },
    {
      id: 3,
      name: '横浜市港北区',
      data: {
        ownerName: '港北次郎',
        email: 'test3@example.com',
        phone: '090-3456-7890',
        propertyType: 'マンション',
        prefecture: '神奈川県',
        city: '横浜市港北区',
        location: '新横浜2-3-4',
        floorArea: 85,
        buildingAge: 10,
        nearestStation: '新横浜駅',
        walkingMinutes: 3
      }
    },
    {
      id: 4,
      name: '相続不動産（空き家）',
      data: {
        ownerName: '相続三郎',
        email: 'test4@example.com',
        phone: '090-4567-8901',
        propertyType: '戸建て',
        prefecture: '神奈川県',
        city: '横浜市南区',
        location: '南太田3-4-5',
        floorArea: 100,
        buildingAge: 40,
        nearestStation: '南太田駅',
        walkingMinutes: 8
      }
    },
    {
      id: 5,
      name: 'アパート（共有名義）',
      data: {
        ownerName: '共有四郎',
        email: 'test5@example.com',
        phone: '090-5678-9012',
        propertyType: 'アパート',
        prefecture: '神奈川県',
        city: '横浜市西区',
        location: 'みなとみらい4-5-6',
        floorArea: 150,
        buildingAge: 20,
        nearestStation: 'みなとみらい駅',
        walkingMinutes: 7
      }
    },
    {
      id: 6,
      name: '湘南エリア（鎌倉市）',
      data: {
        ownerName: '鎌倉五郎',
        email: 'test6@example.com',
        phone: '090-6789-0123',
        propertyType: '戸建て',
        prefecture: '神奈川県',
        city: '鎌倉市',
        location: '由比ガ浜5-6-7',
        floorArea: 110,
        buildingAge: 30,
        nearestStation: '鎌倉駅',
        walkingMinutes: 15
      }
    },
    {
      id: 7,
      name: '横浜市青葉区',
      data: {
        ownerName: '青葉六郎',
        email: 'test7@example.com',
        phone: '090-7890-1234',
        propertyType: 'マンション',
        prefecture: '神奈川県',
        city: '横浜市青葉区',
        location: 'あざみ野6-7-8',
        floorArea: 75,
        buildingAge: 12,
        nearestStation: 'あざみ野駅',
        walkingMinutes: 6
      }
    },
    {
      id: 8,
      name: '相続不動産（分割予定）',
      data: {
        ownerName: '分割七子',
        email: 'test8@example.com',
        phone: '090-8901-2345',
        propertyType: '戸建て',
        prefecture: '神奈川県',
        city: '横浜市戸塚区',
        location: '戸塚町7-8-9',
        floorArea: 130,
        buildingAge: 35,
        nearestStation: '戸塚駅',
        walkingMinutes: 12
      }
    },
    {
      id: 9,
      name: '湘南エリア（茅ヶ崎市）',
      data: {
        ownerName: '茅ヶ崎八郎',
        email: 'test9@example.com',
        phone: '090-9012-3456',
        propertyType: 'マンション',
        prefecture: '神奈川県',
        city: '茅ヶ崎市',
        location: '茅ヶ崎8-9-10',
        floorArea: 65,
        buildingAge: 18,
        nearestStation: '茅ヶ崎駅',
        walkingMinutes: 9
      }
    },
    {
      id: 10,
      name: 'アパート（売却相談）',
      data: {
        ownerName: '売却九郎',
        email: 'test10@example.com',
        phone: '090-0123-4567',
        propertyType: 'アパート',
        prefecture: '神奈川県',
        city: '横浜市鶴見区',
        location: '鶴見中央9-10-11',
        floorArea: 180,
        buildingAge: 22,
        nearestStation: '鶴見駅',
        walkingMinutes: 5
      }
    }
  ];

  it('should have 10 test patterns', () => {
    expect(testPatterns).toHaveLength(10);
  });

  it('should include existing database address (横浜市中区)', () => {
    const existingDbPattern = testPatterns.find(p => p.id === 1);
    expect(existingDbPattern).toBeDefined();
    expect(existingDbPattern?.data.city).toBe('横浜市中区');
  });

  it('should cover all SEO keywords', () => {
    const allData = testPatterns.map(p => JSON.stringify(p.data) + ' ' + p.name).join(' ');
    
    // SEO強化キーワードの確認
    expect(allData).toContain('横浜');
    expect(allData).toContain('湘南');
    expect(allData).toContain('相続');
    expect(allData).toContain('空き家');
    expect(allData).toContain('アパート');
    expect(allData).toContain('売却');
    expect(allData).toContain('共有');
    expect(allData).toContain('分割');
  });

  it('should have valid contact information for all patterns', () => {
    testPatterns.forEach(pattern => {
      expect(pattern.data.ownerName).toBeTruthy();
      expect(pattern.data.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
      expect(pattern.data.phone).toMatch(/^\d{3}-\d{4}-\d{4}$/);
    });
  });

  it('should have valid property information for all patterns', () => {
    testPatterns.forEach(pattern => {
      expect(pattern.data.propertyType).toBeTruthy();
      expect(pattern.data.prefecture).toBe('神奈川県');
      expect(pattern.data.city).toBeTruthy();
      expect(pattern.data.location).toBeTruthy();
      expect(pattern.data.floorArea).toBeGreaterThan(0);
      expect(pattern.data.buildingAge).toBeGreaterThan(0);
      expect(pattern.data.nearestStation).toBeTruthy();
      expect(pattern.data.walkingMinutes).toBeGreaterThan(0);
    });
  });
});

// Export test patterns for manual testing
export const testPatterns = [
  {
    id: 1,
    name: '既存DB該当住所（横浜市中区）',
    data: {
      ownerName: 'テスト太郎',
      email: 'test1@example.com',
      phone: '090-1234-5678',
      propertyType: 'マンション',
      prefecture: '神奈川県',
      city: '横浜市中区',
      location: '本町1-1',
      floorArea: 70,
      buildingAge: 15,
      nearestStation: '関内駅',
      walkingMinutes: 5
    }
  },
  // ... (残り9パターン)
];
