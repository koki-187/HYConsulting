#!/usr/bin/env python3
import sqlite3
import csv
import os
import sys
from datetime import datetime
import glob

# Database path
DB_PATH = "/home/ubuntu/hy-consulting-lp/.data/sqlite.db"
CSV_DIR = "/home/ubuntu/upload"

def get_prefecture_name(filename):
    """Extract prefecture name from filename"""
    # Example: 01_Hokkaido_20202_20252.csv -> Hokkaido
    parts = filename.replace("_20202_20252.csv", "").split("_", 1)
    if len(parts) > 1:
        return parts[1].replace(" Prefecture", "")
    return parts[0]

def import_csv_to_db(csv_file, conn, cursor):
    """Import a single CSV file to database"""
    prefecture = get_prefecture_name(os.path.basename(csv_file))
    print(f"\n処理中: {prefecture} ({os.path.basename(csv_file)})")
    
    with open(csv_file, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        
        batch = []
        batch_size = 1000
        count = 0
        
        for row in reader:
            try:
                # Parse data
                transaction_type = row.get('Type', '').strip()
                city = row.get('Municipality', '').strip()
                district = row.get('District Name', '').strip()
                property_type = row.get('Type', '').strip()
                
                # Parse price (remove commas and convert to integer)
                price_str = row.get('Trade Price', '0').replace(',', '').strip()
                price = int(price_str) if price_str and price_str.isdigit() else 0
                
                # Parse area
                area_str = row.get('Area(㎡)', '0').replace(',', '').strip()
                area = float(area_str) if area_str else 0.0
                
                # Parse building year
                building_year_str = row.get('Building Year', '').strip()
                building_year = None
                if building_year_str and building_year_str.startswith('Built in '):
                    year_str = building_year_str.replace('Built in ', '').strip()
                    if year_str.isdigit():
                        building_year = int(year_str)
                
                # Parse transaction period
                period = row.get('Period', '').strip()
                
                # Skip if essential data is missing
                if not city or price == 0 or area == 0:
                    continue
                
                batch.append((
                    prefecture,
                    city,
                    district,
                    transaction_type,
                    property_type,
                    price,
                    area,
                    building_year,
                    period,
                    datetime.now().isoformat()
                ))
                
                count += 1
                
                # Insert batch
                if len(batch) >= batch_size:
                    cursor.executemany('''
                        INSERT INTO transactions 
                        (prefecture, city, district, transactionType, propertyType, 
                         priceYen, areaSquareMeters, buildingYear, transactionPeriod, createdAt)
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                    ''', batch)
                    conn.commit()
                    print(f"  {count:,}件投入完了...", end='\r')
                    batch = []
                    
            except Exception as e:
                print(f"\nエラー（行スキップ）: {e}")
                continue
        
        # Insert remaining batch
        if batch:
            cursor.executemany('''
                INSERT INTO transactions 
                (prefecture, city, district, transactionType, propertyType, 
                 priceYen, areaSquareMeters, buildingYear, transactionPeriod, createdAt)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', batch)
            conn.commit()
        
        print(f"  {prefecture}: {count:,}件投入完了")
        return count

def main():
    print("=" * 60)
    print("全47都道府県データベース投入開始")
    print("=" * 60)
    
    # Connect to database
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    # Clear existing data
    print("\n既存データを削除中...")
    cursor.execute("DELETE FROM transactions")
    conn.commit()
    print("既存データ削除完了")
    
    # Get all CSV files
    csv_files = sorted(glob.glob(os.path.join(CSV_DIR, "*_20202_20252.csv")))
    print(f"\n処理対象: {len(csv_files)}ファイル")
    
    total_count = 0
    start_time = datetime.now()
    
    # Import each CSV file
    for i, csv_file in enumerate(csv_files, 1):
        print(f"\n[{i}/{len(csv_files)}]", end=" ")
        count = import_csv_to_db(csv_file, conn, cursor)
        total_count += count
    
    # Close connection
    conn.close()
    
    end_time = datetime.now()
    duration = (end_time - start_time).total_seconds()
    
    print("\n" + "=" * 60)
    print("データ投入完了")
    print("=" * 60)
    print(f"総投入件数: {total_count:,}件")
    print(f"処理時間: {duration:.1f}秒")
    print(f"処理速度: {total_count/duration:.0f}件/秒")
    print("=" * 60)

if __name__ == "__main__":
    main()
