#!/usr/bin/env python3.11
import csv
import os
import glob
import sys
from datetime import datetime
import mysql.connector
from mysql.connector import Error

# Database configuration
DB_CONFIG = {
    'host': os.environ.get('DB_HOST', 'localhost'),
    'user': os.environ.get('DB_USER', 'root'),
    'password': os.environ.get('DB_PASSWORD', ''),
    'database': os.environ.get('DB_NAME', 'real_estate'),
}

# Parse DATABASE_URL if available
DATABASE_URL = os.environ.get('DATABASE_URL', '')
if DATABASE_URL:
    # Parse mysql://user:password@host:port/database
    import re
    match = re.match(r'mysql://([^:]+):([^@]+)@([^:]+):(\d+)/([^?]+)', DATABASE_URL)
    if match:
        DB_CONFIG['user'] = match.group(1)
        DB_CONFIG['password'] = match.group(2)
        DB_CONFIG['host'] = match.group(3)
        DB_CONFIG['port'] = int(match.group(4))
        DB_CONFIG['database'] = match.group(5)

CSV_DIR = '/home/ubuntu/upload'
BATCH_SIZE = 1000
DATASET_VERSION_ID = f'mlit_csv_{int(datetime.now().timestamp() * 1000)}'

# Property type mapping
PROPERTY_TYPE_MAP = {
    '中古マンション等': 'マンション',
    '宅地(土地と建物)': '一戸建て',
    '宅地(土地)': '土地',
    '農地': '農地',
    '林地': '林地',
}

def get_building_age_group(building_year):
    """Calculate building age group"""
    if not building_year or building_year == '':
        return '不明'
    
    # Remove non-numeric characters
    year_str = building_year.replace('年', '').replace('代', '').replace('以前', '')
    try:
        year = int(year_str)
    except ValueError:
        return '不明'
    
    current_year = 2025
    age = current_year - year
    
    if age < 0:
        return '不明'
    elif age <= 5:
        return '0～5年'
    elif age <= 10:
        return '5～10年'
    elif age <= 15:
        return '10～15年'
    elif age <= 20:
        return '15～20年'
    elif age <= 30:
        return '20～30年'
    else:
        return '30年以上'

def parse_number(value_str):
    """Parse numeric value from string"""
    if not value_str or value_str == '':
        return None
    
    cleaned = value_str.replace(',', '').replace('円', '').replace('㎡', '')
    try:
        if '.' in cleaned:
            return float(cleaned)
        else:
            return int(cleaned)
    except ValueError:
        return None

def main():
    print('=' * 100)
    print('全国不動産データ投入開始 (Python版)')
    print('=' * 100)
    print(f'データセットバージョンID: {DATASET_VERSION_ID}\n')
    
    # Connect to database
    try:
        connection = mysql.connector.connect(**DB_CONFIG)
        cursor = connection.cursor()
        print('データベース接続成功\n')
    except Error as e:
        print(f'データベース接続エラー: {e}')
        sys.exit(1)
    
    # Step 1: Delete existing data
    print('Step 1: 既存データの削除...')
    try:
        cursor.execute('DELETE FROM aggregated_real_estate_data')
        connection.commit()
        print(f'削除完了: {cursor.rowcount} 件\n')
    except Error as e:
        print(f'削除エラー: {e}')
        sys.exit(1)
    
    # Step 2: Get all CSV files
    csv_files = sorted(glob.glob(os.path.join(CSV_DIR, '*_20202_20252.csv')))
    print(f'Step 2: CSVファイル検出: {len(csv_files)} ファイル\n')
    
    total_imported = 0
    total_skipped = 0
    total_errors = 0
    
    # Step 3: Process each CSV file
    for csv_file in csv_files:
        filename = os.path.basename(csv_file)
        print(f'\n処理中: {filename}')
        print('-' * 100)
        
        try:
            # Read CSV file with cp932 encoding
            with open(csv_file, 'r', encoding='cp932', errors='ignore') as f:
                reader = csv.DictReader(f)
                records = list(reader)
            
            print(f'  読み込み: {len(records):,} 行')
            
            # Group data by key
            aggregation_map = {}
            
            for record in records:
                try:
                    # Extract fields
                    property_type_raw = record.get('種類', '')
                    property_type = PROPERTY_TYPE_MAP.get(property_type_raw, property_type_raw)
                    prefecture = record.get('都道府県名', '')
                    city = record.get('市区町村名', '')
                    district = record.get('地区名', '') or city
                    building_year = record.get('建築年', '')
                    building_age_group = get_building_age_group(building_year)
                    price_yen = parse_number(record.get('取引価格（総額）', ''))
                    area_m2 = parse_number(record.get('面積（㎡）', ''))
                    
                    # Skip if essential data is missing
                    if not property_type or not prefecture or not city or not price_yen or not area_m2:
                        total_skipped += 1
                        continue
                    
                    # Create aggregation key
                    key = f'{property_type}|{prefecture}|{city}|{district}|{building_age_group}'
                    
                    if key not in aggregation_map:
                        aggregation_map[key] = {
                            'propertyType': property_type,
                            'prefecture': prefecture,
                            'city': city,
                            'district': district,
                            'buildingAgeGroup': building_age_group,
                            'totalPriceYen': 0,
                            'totalAreaM2': 0,
                            'transactionCount': 0,
                        }
                    
                    agg = aggregation_map[key]
                    agg['totalPriceYen'] += price_yen
                    agg['totalAreaM2'] += area_m2
                    agg['transactionCount'] += 1
                    
                except Exception as err:
                    total_errors += 1
                    continue
            
            print(f'  集計グループ: {len(aggregation_map):,} グループ')
            
            # Prepare batch insert data
            insert_data = []
            for key, agg in aggregation_map.items():
                average_price_yen = round(agg['totalPriceYen'] / agg['transactionCount'])
                average_area_m2 = agg['totalAreaM2'] / agg['transactionCount']
                price_per_m2 = average_price_yen / average_area_m2
                price_per_tsubo = round(price_per_m2 * 3.30579)  # 1坪 = 3.30579㎡
                
                insert_data.append((
                    agg['propertyType'],
                    agg['prefecture'],
                    agg['city'],
                    agg['district'],
                    agg['buildingAgeGroup'],
                    str(agg['totalPriceYen']),
                    str(agg['totalAreaM2']),
                    agg['transactionCount'],
                    price_per_tsubo,
                    average_price_yen,
                    str(average_area_m2),
                    DATASET_VERSION_ID,
                ))
            
            # Batch insert
            inserted = 0
            insert_query = '''
                INSERT INTO aggregated_real_estate_data 
                (propertyType, prefecture, city, district, buildingAgeGroup, 
                 totalPriceYen, totalAreaM2, transactionCount, pricePerTsubo, 
                 averagePriceYen, averageAreaM2, datasetVersionId)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            '''
            
            for i in range(0, len(insert_data), BATCH_SIZE):
                batch = insert_data[i:i + BATCH_SIZE]
                cursor.executemany(insert_query, batch)
                connection.commit()
                inserted += len(batch)
            
            print(f'  投入完了: {inserted:,} レコード')
            total_imported += inserted
            
        except Exception as err:
            print(f'  エラー: {err}')
            total_errors += 1
            continue
    
    print('\n' + '=' * 100)
    print('データ投入完了')
    print('=' * 100)
    print(f'総投入レコード数: {total_imported:,} 件')
    print(f'スキップ: {total_skipped:,} 件')
    print(f'エラー: {total_errors:,} 件')
    
    # Verify final count
    cursor.execute('SELECT COUNT(*) as total FROM aggregated_real_estate_data')
    result = cursor.fetchone()
    print(f'\n最終レコード数: {result[0]:,} 件')
    
    cursor.close()
    connection.close()
    print('\n処理完了')

if __name__ == '__main__':
    main()
