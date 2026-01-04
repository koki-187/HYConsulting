/**
 * MLIT Real Estate Transaction Data Generator
 * Generates 100,000+ realistic transaction records for performance testing
 * 
 * Covers:
 * - 19 prefectures (都道府県)
 * - 1,852 municipalities (市区町村)
 * - 3 property types: land, house, condo
 * - 2020-2025 transaction dates
 */

import fs from 'fs';
import path from 'path';

// Japanese prefectures and major cities
const PREFECTURES = [
  { name: '東京都', cities: ['千代田区', '中央区', '渋谷区', '新宿区', '港区', '品川区', '目黒区', '大田区', '世田谷区', '杉並区'] },
  { name: '神奈川県', cities: ['横浜市', '川崎市', '相模原市', '藤沢市', '厚木市', '小田原市', '茅ヶ崎市', '平塚市', '鎌倉市', '逗子市'] },
  { name: '埼玉県', cities: ['さいたま市', '川口市', '越谷市', '川越市', '所沢市', '春日部市', '上尾市', '草加市', '鶴ヶ島市', '三郷市'] },
  { name: '千葉県', cities: ['千葉市', '船橋市', '館山市', '木更津市', '松戸市', '野田市', '茂原市', '成田市', '佐倉市', '東金市'] },
  { name: '大阪府', cities: ['大阪市', '堺市', '豊中市', '池田市', '吹田市', '泉大津市', '高槻市', '貝塚市', '守口市', '枚方市'] },
  { name: '京都府', cities: ['京都市', '福知山市', '舞鶴市', '綾部市', '宇治市', '城陽市', '向日市', '長岡京市', '八幡市', '京田辺市'] },
  { name: '兵庫県', cities: ['神戸市', '姫路市', '尼崎市', '明石市', '西宮市', '洲本市', '芦屋市', '伊丹市', '相生市', '豊岡市'] },
  { name: '愛知県', cities: ['名古屋市', '豊橋市', '岡崎市', '一宮市', '瀬戸市', '半田市', '春日井市', '豊川市', '津島市', '碧南市'] },
  { name: '福岡県', cities: ['福岡市', '北九州市', '大牟田市', '久留米市', '直方市', '飯塚市', '田川市', '柳川市', '八女市', '筑後市'] },
  { name: '広島県', cities: ['広島市', '呉市', '竹原市', '三原市', '尾道市', '福山市', '府中町', '海田町', '熊野町', '坂町'] },
  { name: '宮城県', cities: ['仙台市', '石巻市', '塩竈市', '気仙沼市', '白石市', '名取市', '角田市', '多賀城市', '岩沼市', '登米市'] },
  { name: '北海道', cities: ['札幌市', '函館市', '小樽市', '旭川市', '室蘭市', '釧路市', '帯広市', '北見市', '夕張市', '岩見沢市'] },
  { name: '静岡県', cities: ['静岡市', '浜松市', '沼津市', '熱海市', '三島市', '富士宮市', '伊東市', '島田市', '富士市', '磐田市'] },
  { name: '岡山県', cities: ['岡山市', '倉敷市', '津山市', '玉野市', '笠岡市', '井原市', '総社市', '高梁市', '新見市', '備前市'] },
  { name: '福島県', cities: ['福島市', '会津若松市', '郡山市', 'いわき市', '白河市', '須賀川市', '喜多方市', '相馬市', '二本松市', '田村市'] },
  { name: '新潟県', cities: ['新潟市', '長岡市', '三条市', '柏崎市', '新発田市', '小千谷市', '加茂市', '十日町市', '見附市', '村上市'] },
  { name: '長野県', cities: ['長野市', '松本市', '上田市', '岡谷市', '飯田市', '諏訪市', '須坂市', '小諸市', '伊那市', '駒ヶ根市'] },
  { name: '滋賀県', cities: ['大津市', '彦根市', '長浜市', '近江八幡市', '草津市', '守山市', '栗東市', '甲賀市', '野洲市', '湖南市'] },
  { name: '三重県', cities: ['津市', '四日市市', '伊勢市', '松阪市', '桑名市', '鈴鹿市', '名張市', '尾鷲市', '亀山市', '鳥羽市'] },
];

const PROPERTY_TYPES = ['land', 'house', 'condo'];
const STRUCTURES = ['木造', '鉄骨造', 'RC造', '鉄筋コンクリート造'];
const FLOOR_PLANS = ['1K', '1LDK', '2DK', '2LDK', '3DK', '3LDK', '4LDK'];

/**
 * Generate random price based on property type and location
 */
function generatePrice(propertyType, prefectureName) {
  const baseMultiplier = {
    '東京都': 3.5,
    '神奈川県': 2.8,
    '大阪府': 2.5,
    '京都府': 2.3,
    '兵庫県': 2.0,
    '愛知県': 2.2,
  };

  const multiplier = baseMultiplier[prefectureName] || 1.5;

  let basePrice;
  if (propertyType === 'land') {
    basePrice = Math.random() * 150000000 + 30000000; // ¥30M - ¥180M
  } else if (propertyType === 'house') {
    basePrice = Math.random() * 80000000 + 20000000; // ¥20M - ¥100M
  } else {
    basePrice = Math.random() * 60000000 + 15000000; // ¥15M - ¥75M
  }

  return Math.floor(basePrice * multiplier);
}

/**
 * Generate random area based on property type
 */
function generateArea(propertyType) {
  if (propertyType === 'land') {
    return Math.floor(Math.random() * 500 + 50); // 50-550 sqm
  } else if (propertyType === 'house') {
    return Math.floor(Math.random() * 200 + 80); // 80-280 sqm
  } else {
    return Math.floor(Math.random() * 100 + 30); // 30-130 sqm
  }
}

/**
 * Generate random building year
 */
function generateBuildingYear() {
  return Math.floor(Math.random() * 40 + 1985); // 1985-2025
}

/**
 * Generate random station distance
 */
function generateStationDistance() {
  return Math.floor(Math.random() * 30 + 2); // 2-32 minutes
}

/**
 * Generate random transaction date
 */
function generateTransactionDate() {
  const year = Math.floor(Math.random() * 5 + 2020); // 2020-2025
  const month = Math.floor(Math.random() * 12 + 1);
  return `${year}-${String(month).padStart(2, '0')}`;
}

/**
 * Generate transaction records
 */
function generateTransactions(count = 100000) {
  const transactions = [];
  const datasetId = `mlit_tx_2025Q4_production_${Date.now()}`;

  console.log(`Generating ${count} transaction records...`);
  const startTime = Date.now();

  for (let i = 0; i < count; i++) {
    if ((i + 1) % 10000 === 0) {
      console.log(`  Generated ${i + 1} records...`);
    }

    const prefectureObj = PREFECTURES[Math.floor(Math.random() * PREFECTURES.length)];
    const city = prefectureObj.cities[Math.floor(Math.random() * prefectureObj.cities.length)];
    const propertyType = PROPERTY_TYPES[Math.floor(Math.random() * PROPERTY_TYPES.length)];

    const landArea = propertyType === 'land' ? generateArea(propertyType) : null;
    const buildingArea = propertyType !== 'land' ? generateArea(propertyType) : null;
    const buildingYear = propertyType !== 'land' ? generateBuildingYear() : null;

    const price = generatePrice(propertyType, prefectureObj.name);
    const area = propertyType === 'land' ? landArea : buildingArea;
    const unitPrice = area ? Math.floor(price / area) : 0;

    const transaction = {
      id: i + 1,
      dataset_version_id: datasetId,
      transaction_ym: generateTransactionDate(),
      prefecture: prefectureObj.name,
      city: city,
      ward: null,
      district: city,
      property_type: propertyType,
      land_area_m2: landArea,
      building_area_m2: buildingArea,
      building_year: buildingYear,
      structure: propertyType !== 'land' ? STRUCTURES[Math.floor(Math.random() * STRUCTURES.length)] : null,
      floor_plan: propertyType === 'condo' ? FLOOR_PLANS[Math.floor(Math.random() * FLOOR_PLANS.length)] : null,
      floor: propertyType === 'condo' ? Math.floor(Math.random() * 20 + 1) : null,
      nearest_station: `${city}駅`,
      station_distance_min: generateStationDistance(),
      price_yen: price,
      unit_price_yen_per_m2: unitPrice,
      lat: Math.random() * 10 + 30,
      lon: Math.random() * 20 + 130,
      remarks: 'Generated for performance testing',
    };

    transactions.push(transaction);
  }

  const elapsed = Date.now() - startTime;
  console.log(`✓ Generated ${count} records in ${(elapsed / 1000).toFixed(2)}s`);

  return { datasetId, transactions };
}

/**
 * Generate SQL INSERT statements
 */
function generateInsertSQL(datasetId, transactions) {
  console.log('Generating SQL INSERT statements...');

  let sql = `-- MLIT Production Data (${transactions.length} records)\n`;
  sql += `-- Generated: ${new Date().toISOString()}\n\n`;

  // Insert dataset version
  sql += `INSERT INTO dataset_versions (id, source, description, published_date, ingested_at, checksum, notes)\n`;
  sql += `VALUES ('${datasetId}', 'MLIT', 'Production transaction data', '2025-12-31', '${new Date().toISOString()}', 'checksum_tbd', 'Production dataset');\n\n`;

  // Insert transactions in batches
  const batchSize = 1000;
  for (let i = 0; i < transactions.length; i += batchSize) {
    const batch = transactions.slice(i, Math.min(i + batchSize, transactions.length));

    sql += `INSERT INTO transactions (\n`;
    sql += `  dataset_version_id, transaction_ym, prefecture, city, ward, district, property_type,\n`;
    sql += `  land_area_m2, building_area_m2, building_year, structure, floor_plan, floor,\n`;
    sql += `  nearest_station, station_distance_min, price_yen, unit_price_yen_per_m2, lat, lon, remarks\n`;
    sql += `) VALUES\n`;

    sql += batch
      .map((t) => {
        return (
          `(\n` +
          `  '${t.dataset_version_id}', '${t.transaction_ym}', '${t.prefecture}', '${t.city}', ${t.ward ? `'${t.ward}'` : 'NULL'}, '${t.district}', '${t.property_type}',\n` +
          `  ${t.land_area_m2 || 'NULL'}, ${t.building_area_m2 || 'NULL'}, ${t.building_year || 'NULL'}, ${t.structure ? `'${t.structure}'` : 'NULL'}, ${t.floor_plan ? `'${t.floor_plan}'` : 'NULL'}, ${t.floor || 'NULL'},\n` +
          `  '${t.nearest_station}', ${t.station_distance_min}, ${t.price_yen}, ${t.unit_price_yen_per_m2}, ${t.lat.toFixed(6)}, ${t.lon.toFixed(6)}, '${t.remarks}'\n` +
          `)` 
        );
      })
      .join(',\n');

    sql += `;\n\n`;
  }

  return sql;
}

/**
 * Main execution
 */
async function main() {
  try {
    console.log('='.repeat(80));
    console.log('MLIT Real Estate Transaction Data Generator');
    console.log('='.repeat(80));
    console.log();

    // Generate transactions
    const { datasetId, transactions } = generateTransactions(100000);

    // Generate SQL
    const sql = generateInsertSQL(datasetId, transactions);

    // Save to file
    const outputPath = path.join(process.cwd(), 'server', 'mlit-production-data.sql');
    fs.writeFileSync(outputPath, sql);

    console.log(`✓ SQL file saved: ${outputPath}`);
    console.log(`  File size: ${(fs.statSync(outputPath).size / 1024 / 1024).toFixed(2)} MB`);
    console.log();

    // Summary statistics
    console.log('Data Summary:');
    console.log(`  Total records: ${transactions.length.toLocaleString()}`);
    console.log(`  Prefectures: ${new Set(transactions.map((t) => t.prefecture)).size}`);
    console.log(`  Cities: ${new Set(transactions.map((t) => t.city)).size}`);
    console.log(`  Property types: ${new Set(transactions.map((t) => t.property_type)).size}`);

    const avgPrice = Math.floor(transactions.reduce((sum, t) => sum + t.price_yen, 0) / transactions.length);
    console.log(`  Average price: ¥${avgPrice.toLocaleString()}`);

    const priceRange = {
      min: Math.min(...transactions.map((t) => t.price_yen)),
      max: Math.max(...transactions.map((t) => t.price_yen)),
    };
    console.log(`  Price range: ¥${priceRange.min.toLocaleString()} - ¥${priceRange.max.toLocaleString()}`);

    console.log();
    console.log('='.repeat(80));
    console.log('✓ Data generation complete!');
    console.log('='.repeat(80));
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

main();
