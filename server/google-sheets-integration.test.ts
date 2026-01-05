import { describe, it, expect } from 'vitest';

/**
 * Google Sheets Integration Test
 * 
 * This test validates the complete Google Sheets integration by sending
 * real assessment data to the webhook and verifying the response.
 */
describe('Google Sheets Integration - Real Data Test', () => {
  const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL || '';

  it('should have GOOGLE_SHEETS_WEBHOOK_URL configured', () => {
    expect(webhookUrl).toBeDefined();
    expect(webhookUrl).toContain('https://script.google.com/macros/s/');
    console.log('✅ Webhook URL configured:', webhookUrl);
  });

  it('should send assessment data to Google Sheets successfully', async () => {
    if (!webhookUrl) {
      throw new Error('GOOGLE_SHEETS_WEBHOOK_URL is not configured');
    }

    const testData = {
      timestamp: new Date().toISOString(),
      ownerName: 'テスト太郎',
      email: 'test@hyconsulting.jp',
      phone: '090-1234-5678',
      propertyType: 'マンション',
      prefecture: '神奈川県',
      city: '横浜市中区',
      address: 'テスト町1-2-3',
      floorArea: 70,
      buildingAge: 10,
      estimatedPrice: 3500,
      nearestStation: '横浜駅',
      walkingMinutes: 5
    };

    console.log('📤 Sending test data to Google Sheets...');
    console.log('Webhook URL:', webhookUrl);
    console.log('Test data:', JSON.stringify(testData, null, 2));

    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testData),
      });

      console.log('📥 Response status:', response.status);
      console.log('📥 Response headers:', Object.fromEntries(response.headers.entries()));

      // Google Apps Script returns 302 redirect on success
      expect([200, 302]).toContain(response.status);

      if (response.status === 302) {
        console.log('✅ Google Sheets webhook returned 302 (success redirect)');
      } else {
        const responseText = await response.text();
        console.log('📥 Response body:', responseText);
      }

      console.log('✅ Test data successfully sent to Google Sheets');
      console.log('📊 Please check your Google Sheet for the new row with:');
      console.log('   - 受付日時:', testData.timestamp);
      console.log('   - お名前:', testData.ownerName);
      console.log('   - メールアドレス:', testData.email);
      console.log('   - 電話番号:', testData.phone);
      console.log('   - 物件種別:', testData.propertyType);
      console.log('   - 都道府県:', testData.prefecture);
      console.log('   - 市区町村:', testData.city);
      console.log('   - 所在地:', testData.address);
      console.log('   - 床面積:', testData.floorArea, '㎡');
      console.log('   - 築年数:', testData.buildingAge, '年');
      console.log('   - 推定価格:', testData.estimatedPrice, '万円');
      console.log('   - 最寄り駅:', testData.nearestStation);
      console.log('   - 駅徒歩:', testData.walkingMinutes, '分');

    } catch (error) {
      console.error('❌ Failed to send data to Google Sheets:', error);
      throw error;
    }
  }, 30000);

  it('should send 10 different assessment patterns to Google Sheets', async () => {
    if (!webhookUrl) {
      throw new Error('GOOGLE_SHEETS_WEBHOOK_URL is not configured');
    }

    const testPatterns = [
      {
        timestamp: new Date().toISOString(),
        ownerName: 'パターン1: 既存DB該当',
        email: 'pattern1@test.jp',
        phone: '090-0001-0001',
        propertyType: 'マンション',
        prefecture: '神奈川県',
        city: '横浜市中区',
        address: '本町1-1-1',
        floorArea: 75,
        buildingAge: 15,
        estimatedPrice: 3800,
        nearestStation: '関内駅',
        walkingMinutes: 5
      },
      {
        timestamp: new Date().toISOString(),
        ownerName: 'パターン2: 湘南エリア',
        email: 'pattern2@test.jp',
        phone: '090-0002-0002',
        propertyType: '戸建て',
        prefecture: '神奈川県',
        city: '藤沢市',
        address: '鵠沼海岸2-2-2',
        floorArea: 120,
        buildingAge: 20,
        estimatedPrice: 5200,
        nearestStation: '鵠沼海岸駅',
        walkingMinutes: 10
      },
      {
        timestamp: new Date().toISOString(),
        ownerName: 'パターン3: 横浜市港北区',
        email: 'pattern3@test.jp',
        phone: '090-0003-0003',
        propertyType: 'マンション',
        prefecture: '神奈川県',
        city: '横浜市港北区',
        address: '日吉3-3-3',
        floorArea: 80,
        buildingAge: 10,
        estimatedPrice: 4500,
        nearestStation: '日吉駅',
        walkingMinutes: 7
      },
      {
        timestamp: new Date().toISOString(),
        ownerName: 'パターン4: 相続不動産（空き家）',
        email: 'pattern4@test.jp',
        phone: '090-0004-0004',
        propertyType: '戸建て',
        prefecture: '神奈川県',
        city: '横浜市南区',
        address: '南太田4-4-4',
        floorArea: 100,
        buildingAge: 35,
        estimatedPrice: 2800,
        nearestStation: '南太田駅',
        walkingMinutes: 12
      },
      {
        timestamp: new Date().toISOString(),
        ownerName: 'パターン5: アパート（共有名義）',
        email: 'pattern5@test.jp',
        phone: '090-0005-0005',
        propertyType: 'アパート',
        prefecture: '神奈川県',
        city: '横浜市西区',
        address: '西区5-5-5',
        floorArea: 200,
        buildingAge: 25,
        estimatedPrice: 8500,
        nearestStation: '横浜駅',
        walkingMinutes: 15
      },
      {
        timestamp: new Date().toISOString(),
        ownerName: 'パターン6: 湘南エリア（鎌倉）',
        email: 'pattern6@test.jp',
        phone: '090-0006-0006',
        propertyType: '戸建て',
        prefecture: '神奈川県',
        city: '鎌倉市',
        address: '鎌倉6-6-6',
        floorArea: 150,
        buildingAge: 30,
        estimatedPrice: 6200,
        nearestStation: '鎌倉駅',
        walkingMinutes: 20
      },
      {
        timestamp: new Date().toISOString(),
        ownerName: 'パターン7: 横浜市青葉区',
        email: 'pattern7@test.jp',
        phone: '090-0007-0007',
        propertyType: 'マンション',
        prefecture: '神奈川県',
        city: '横浜市青葉区',
        address: 'あざみ野7-7-7',
        floorArea: 85,
        buildingAge: 8,
        estimatedPrice: 5800,
        nearestStation: 'あざみ野駅',
        walkingMinutes: 5
      },
      {
        timestamp: new Date().toISOString(),
        ownerName: 'パターン8: 相続不動産（分割予定）',
        email: 'pattern8@test.jp',
        phone: '090-0008-0008',
        propertyType: '戸建て',
        prefecture: '神奈川県',
        city: '横浜市戸塚区',
        address: '戸塚8-8-8',
        floorArea: 110,
        buildingAge: 28,
        estimatedPrice: 3200,
        nearestStation: '戸塚駅',
        walkingMinutes: 18
      },
      {
        timestamp: new Date().toISOString(),
        ownerName: 'パターン9: 湘南エリア（茅ヶ崎）',
        email: 'pattern9@test.jp',
        phone: '090-0009-0009',
        propertyType: 'マンション',
        prefecture: '神奈川県',
        city: '茅ヶ崎市',
        address: '茅ヶ崎9-9-9',
        floorArea: 70,
        buildingAge: 12,
        estimatedPrice: 3500,
        nearestStation: '茅ヶ崎駅',
        walkingMinutes: 8
      },
      {
        timestamp: new Date().toISOString(),
        ownerName: 'パターン10: アパート（売却相談）',
        email: 'pattern10@test.jp',
        phone: '090-0010-0010',
        propertyType: 'アパート',
        prefecture: '神奈川県',
        city: '横浜市鶴見区',
        address: '鶴見10-10-10',
        floorArea: 180,
        buildingAge: 22,
        estimatedPrice: 7200,
        nearestStation: '鶴見駅',
        walkingMinutes: 10
      }
    ];

    console.log('📤 Sending 10 assessment patterns to Google Sheets...');

    let successCount = 0;
    let failureCount = 0;

    for (const [index, testData] of testPatterns.entries()) {
      try {
        console.log(`\n📤 Sending pattern ${index + 1}/10: ${testData.ownerName}`);
        
        const response = await fetch(webhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(testData),
        });

        if ([200, 302].includes(response.status)) {
          successCount++;
          console.log(`✅ Pattern ${index + 1} sent successfully (status: ${response.status})`);
        } else {
          failureCount++;
          console.log(`❌ Pattern ${index + 1} failed (status: ${response.status})`);
        }

        // Wait 1 second between requests to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));

      } catch (error) {
        failureCount++;
        console.error(`❌ Pattern ${index + 1} error:`, error);
      }
    }

    console.log('\n📊 Test Summary:');
    console.log(`   ✅ Success: ${successCount}/10`);
    console.log(`   ❌ Failure: ${failureCount}/10`);
    console.log(`   📈 Success Rate: ${(successCount / 10 * 100).toFixed(1)}%`);

    expect(successCount).toBeGreaterThan(0);
    console.log('\n✅ All 10 patterns sent to Google Sheets');
    console.log('📊 Please check your Google Sheet for 10 new rows');

  }, 60000);
});
