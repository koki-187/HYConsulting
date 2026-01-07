/**
 * Generate Priority Prefecture Data for PostgreSQL
 * Focused on: Tokyo, Kanagawa, Osaka, Aichi, Fukuoka
 * 2,000 records per prefecture = 10,000 total records
 */

import pg from 'pg';
const { Pool } = pg;

const PRIORITY_PREFECTURES = [
  { name: '東京都', cities: ['千代田区', '中央区', '渋谷区', '新宿区', '港区', '品川区', '目黒区', '大田区', '世田谷区', '杉並区'] },
  { name: '神奈川県', cities: ['横浜市中区', '横浜市西区', '川崎市', '相模原市', '藤沢市', '厚木市', '小田原市', '茅ヶ崎市', '鎌倉市', '逗子市'] },
  { name: '大阪府', cities: ['大阪市北区', '大阪市中央区', '堺市', '豊中市', '池田市', '吹田市', '泉大津市', '高槻市', '貝塚市', '守口市'] },
  { name: '愛知県', cities: ['名古屋市中区', '名古屋市東区', '豊橋市', '岡崎市', '一宮市', '瀬戸市', '半田市', '春日井市', '豊川市', '津島市'] },
  { name: '福岡県', cities: ['福岡市中央区', '福岡市博多区', '北九州市', '大牟田市', '久留米市', '直方市', '飯塚市', '田川市', '柳川市', '八女市'] },
];

const PROPERTY_TYPES = ['land', 'house', 'mansion', 'apartment'];
const STRUCTURES = ['木造', '鉄骨造', 'RC造', '鉄筋コンクリート造'];
const FLOOR_PLANS = ['1K', '1LDK', '2DK', '2LDK', '3DK', '3LDK', '4LDK', '5LDK'];

function generatePrice(propertyType, prefectureName) {
  const baseMultiplier = {
    '東京都': 3.5,
    '神奈川県': 2.8,
    '大阪府': 2.5,
    '愛知県': 2.2,
    '福岡県': 2.0,
  };

  const multiplier = baseMultiplier[prefectureName] || 1.5;

  let basePrice;
  if (propertyType === 'land') {
    basePrice = Math.random() * 150000000 + 30000000; // 3000万〜1億8000万
  } else if (propertyType === 'house') {
    basePrice = Math.random() * 80000000 + 20000000; // 2000万〜1億
  } else if (propertyType === 'mansion') {
    basePrice = Math.random() * 60000000 + 15000000; // 1500万〜7500万
  } else {
    basePrice = Math.random() * 100000000 + 30000000; // 3000万〜1億3000万
  }

  return Math.floor(basePrice * multiplier);
}

function generateArea(propertyType) {
  if (propertyType === 'land') {
    return Math.floor(Math.random() * 500 + 50); // 50〜550㎡
  } else if (propertyType === 'house') {
    return Math.floor(Math.random() * 200 + 80); // 80〜280㎡
  } else if (propertyType === 'mansion') {
    return Math.floor(Math.random() * 100 + 30); // 30〜130㎡
  } else {
    return Math.floor(Math.random() * 300 + 100); // 100〜400㎡
  }
}

function generateBuildingYear(propertyType) {
  if (propertyType === 'land') return null;
  return Math.floor(Math.random() * 40 + 1985); // 1985〜2024
}

function generateStationDistance() {
  return Math.floor(Math.random() * 30 + 2); // 2〜31分
}

function generateTransactionDate() {
  const year = Math.floor(Math.random() * 5 + 2020); // 2020〜2024
  const quarter = Math.floor(Math.random() * 4 + 1); // Q1〜Q4
  return `${year}Q${quarter}`;
}

async function main() {
  console.log('========================================');
  console.log('Priority Prefecture Data Generator (PostgreSQL)');
  console.log('========================================\n');

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: false
  });

  try {
    // Check current data
    const checkResult = await pool.query(
      `SELECT prefecture, COUNT(*) as count 
       FROM transactions 
       WHERE prefecture IN ('東京都', '神奈川県', '大阪府', '愛知県', '福岡県')
       GROUP BY prefecture`
    );
    
    console.log('Current data in priority prefectures:');
    checkResult.rows.forEach(row => {
      console.log(`  ${row.prefecture}: ${row.count} records`);
    });
    console.log('');

    // Generate and insert data for each prefecture
    let totalRecords = 0;
    const recordsPerPrefecture = 2000;
    const batchSize = 100;

    for (const prefecture of PRIORITY_PREFECTURES) {
      console.log(`\nGenerating data for ${prefecture.name}...`);
      
      let prefectureRecords = 0;
      
      while (prefectureRecords < recordsPerPrefecture) {
        const batch = [];
        const currentBatchSize = Math.min(batchSize, recordsPerPrefecture - prefectureRecords);
        
        for (let i = 0; i < currentBatchSize; i++) {
          const propertyType = PROPERTY_TYPES[Math.floor(Math.random() * PROPERTY_TYPES.length)];
          const city = prefecture.cities[Math.floor(Math.random() * prefecture.cities.length)];
          const price = generatePrice(propertyType, prefecture.name);
          const area = generateArea(propertyType);
          const buildingYear = generateBuildingYear(propertyType);
          const structure = propertyType === 'land' ? null : STRUCTURES[Math.floor(Math.random() * STRUCTURES.length)];
          const floorPlan = (propertyType === 'mansion' || propertyType === 'apartment') 
            ? FLOOR_PLANS[Math.floor(Math.random() * FLOOR_PLANS.length)] 
            : null;
          const stationDistance = generateStationDistance();
          const transactionDate = generateTransactionDate();
          
          batch.push({
            prefecture: prefecture.name,
            city,
            propertyType,
            price,
            area,
            buildingYear,
            structure,
            floorPlan,
            stationDistance,
            transactionDate
          });
        }

        // Insert batch
        const values = batch.map((record, idx) => {
          const offset = idx * 10;
          return `($${offset + 1}, $${offset + 2}, $${offset + 3}, $${offset + 4}, $${offset + 5}, $${offset + 6}, $${offset + 7}, $${offset + 8}, $${offset + 9}, $${offset + 10})`;
        }).join(', ');

        const flatValues = batch.flatMap(record => [
          record.prefecture,
          record.city,
          record.propertyType,
          record.price,
          record.area,
          record.buildingYear,
          record.structure,
          record.floorPlan,
          record.stationDistance,
          record.transactionDate
        ]);

        await pool.query(
          `INSERT INTO transactions 
           (prefecture, city, "propertyType", price, area, "buildingYear", structure, "floorPlan", "stationDistance", "transactionDate")
           VALUES ${values}`,
          flatValues
        );

        prefectureRecords += currentBatchSize;
        totalRecords += currentBatchSize;
        
        process.stdout.write(`\r  Progress: ${prefectureRecords}/${recordsPerPrefecture} records`);
      }
      
      console.log(`\n  ✓ Completed ${prefecture.name}: ${prefectureRecords} records`);
    }

    console.log('\n========================================');
    console.log(`✓ Data generation completed!`);
    console.log(`  Total records inserted: ${totalRecords}`);
    console.log('========================================\n');

    // Verify final data
    const finalResult = await pool.query(
      `SELECT prefecture, COUNT(*) as count 
       FROM transactions 
       WHERE prefecture IN ('東京都', '神奈川県', '大阪府', '愛知県', '福岡県')
       GROUP BY prefecture
       ORDER BY count DESC`
    );
    
    console.log('Final data in priority prefectures:');
    finalResult.rows.forEach(row => {
      console.log(`  ${row.prefecture}: ${row.count} records`);
    });

  } catch (error) {
    console.error('Error:', error.message);
    console.error(error.stack);
  } finally {
    await pool.end();
  }
}

main();
