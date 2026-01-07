#!/usr/bin/env python3
"""
全国不動産取引データ取得・集計スクリプト

国土交通省 不動産情報ライブラリから全国47都道府県のデータを取得し、
集計してデータベースに投入する。

使用方法:
    python3 download-mlit-data.py --prefectures "東京都,神奈川県,大阪府" --years 5
"""

import argparse
import csv
import json
import os
import sys
import time
from collections import defaultdict
from datetime import datetime
from typing import Dict, List, Tuple

import mysql.connector
from dotenv import load_dotenv

# 環境変数読み込み
load_dotenv()

# 都道府県リスト（全47都道府県）
ALL_PREFECTURES = [
    "北海道", "青森県", "岩手県", "宮城県", "秋田県", "山形県", "福島県",
    "茨城県", "栃木県", "群馬県", "埼玉県", "千葉県", "東京都", "神奈川県",
    "新潟県", "富山県", "石川県", "福井県", "山梨県", "長野県", "岐阜県",
    "静岡県", "愛知県", "三重県", "滋賀県", "京都府", "大阪府", "兵庫県",
    "奈良県", "和歌山県", "鳥取県", "島根県", "岡山県", "広島県", "山口県",
    "徳島県", "香川県", "愛媛県", "高知県", "福岡県", "佐賀県", "長崎県",
    "熊本県", "大分県", "宮崎県", "鹿児島県", "沖縄県"
]

# 物件種別マッピング
PROPERTY_TYPE_MAP = {
    "宅地(土地)": "土地",
    "宅地(土地と建物)": "一戸建て",
    "中古マンション等": "マンション",
    "農地": "農地",
    "林地": "林地"
}

# 築年数グループマッピング
def get_building_age_group(year_str: str) -> str:
    """築年数を年数グループに変換"""
    if not year_str or year_str == "":
        return "不明"
    
    try:
        # 西暦を取得
        year = int(year_str)
        current_year = datetime.now().year
        age = current_year - year
        
        if age < 0:
            return "不明"
        elif age <= 5:
            return "0～5年"
        elif age <= 10:
            return "5～10年"
        elif age <= 15:
            return "10～15年"
        elif age <= 20:
            return "15～20年"
        elif age <= 25:
            return "20～25年"
        elif age <= 30:
            return "25～30年"
        else:
            return "30年以上"
    except:
        return "不明"


def aggregate_data(csv_file_path: str) -> List[Dict]:
    """
    CSVファイルを読み込み、集計データを生成
    
    Returns:
        List of aggregated records
    """
    print(f"📊 集計処理開始: {csv_file_path}")
    
    # 集計用辞書
    aggregated = defaultdict(lambda: {
        "totalPriceYen": 0,
        "totalAreaM2": 0,
        "transactionCount": 0,
        "prices": [],
        "areas": []
    })
    
    try:
        with open(csv_file_path, 'r', encoding='utf-8-sig') as f:
            reader = csv.DictReader(f)
            
            for row in reader:
                # 必須フィールドの確認
                if not all(k in row for k in ['種類', '都道府県名', '市区町村名', '地区名', '取引価格（総額）', '面積（㎡）']):
                    continue
                
                # データ抽出
                property_type_raw = row.get('種類', '')
                property_type = PROPERTY_TYPE_MAP.get(property_type_raw, property_type_raw)
                prefecture = row.get('都道府県名', '')
                city = row.get('市区町村名', '')
                district = row.get('地区名', '') or city  # 地区名が空の場合は市区町村名を使用
                building_year = row.get('建築年', '')
                building_age_group = get_building_age_group(building_year)
                
                # 価格と面積
                try:
                    price = float(row.get('取引価格（総額）', '0').replace(',', ''))
                    area = float(row.get('面積（㎡）', '0').replace(',', ''))
                except:
                    continue
                
                # 無効なデータをスキップ
                if price <= 0 or area <= 0:
                    continue
                
                # 集計キー
                key = (prefecture, city, district, property_type, building_age_group)
                
                # 集計
                aggregated[key]["totalPriceYen"] += price
                aggregated[key]["totalAreaM2"] += area
                aggregated[key]["transactionCount"] += 1
                aggregated[key]["prices"].append(price)
                aggregated[key]["areas"].append(area)
        
        # 集計結果を整形
        results = []
        for key, data in aggregated.items():
            prefecture, city, district, property_type, building_age_group = key
            
            # 坪単価計算（1坪 = 3.30579㎡）
            avg_price_per_m2 = data["totalPriceYen"] / data["totalAreaM2"]
            price_per_tsubo = int(avg_price_per_m2 * 3.30579)
            
            # 平均値計算
            avg_price = int(sum(data["prices"]) / len(data["prices"]))
            avg_area = sum(data["areas"]) / len(data["areas"])
            
            results.append({
                "propertyType": property_type,
                "prefecture": prefecture,
                "city": city,
                "district": district,
                "buildingAgeGroup": building_age_group,
                "totalPriceYen": data["totalPriceYen"],
                "totalAreaM2": data["totalAreaM2"],
                "transactionCount": data["transactionCount"],
                "pricePerTsubo": price_per_tsubo,
                "averagePriceYen": avg_price,
                "averageAreaM2": avg_area
            })
        
        print(f"✅ 集計完了: {len(results)}件のレコード")
        return results
    
    except Exception as e:
        print(f"❌ エラー: {e}")
        return []


def insert_to_database(records: List[Dict], dataset_version_id: str):
    """
    集計データをデータベースに投入
    """
    print(f"💾 データベース投入開始: {len(records)}件")
    
    try:
        # データベース接続
        conn = mysql.connector.connect(
            **mysql.connector.connect.parse_dsn(os.getenv('DATABASE_URL'))
        )
        cursor = conn.cursor()
        
        # バッチ投入
        batch_size = 100
        inserted_count = 0
        
        for i in range(0, len(records), batch_size):
            batch = records[i:i+batch_size]
            
            # INSERT文
            sql = """
                INSERT INTO aggregated_real_estate_data 
                (propertyType, prefecture, city, district, buildingAgeGroup,
                 totalPriceYen, totalAreaM2, transactionCount, pricePerTsubo,
                 averagePriceYen, averageAreaM2, datasetVersionId, createdAt)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, NOW())
                ON DUPLICATE KEY UPDATE
                totalPriceYen = totalPriceYen + VALUES(totalPriceYen),
                totalAreaM2 = totalAreaM2 + VALUES(totalAreaM2),
                transactionCount = transactionCount + VALUES(transactionCount),
                pricePerTsubo = (totalPriceYen + VALUES(totalPriceYen)) / (totalAreaM2 + VALUES(totalAreaM2)) * 3.30579,
                averagePriceYen = (totalPriceYen + VALUES(totalPriceYen)) / (transactionCount + VALUES(transactionCount)),
                averageAreaM2 = (totalAreaM2 + VALUES(totalAreaM2)) / (transactionCount + VALUES(transactionCount))
            """
            
            values = [
                (
                    r["propertyType"], r["prefecture"], r["city"], r["district"],
                    r["buildingAgeGroup"], r["totalPriceYen"], r["totalAreaM2"],
                    r["transactionCount"], r["pricePerTsubo"], r["averagePriceYen"],
                    r["averageAreaM2"], dataset_version_id
                )
                for r in batch
            ]
            
            cursor.executemany(sql, values)
            conn.commit()
            
            inserted_count += len(batch)
            print(f"  進捗: {inserted_count}/{len(records)} ({inserted_count*100//len(records)}%)")
        
        cursor.close()
        conn.close()
        
        print(f"✅ データベース投入完了: {inserted_count}件")
        
    except Exception as e:
        print(f"❌ データベースエラー: {e}")
        raise


def main():
    parser = argparse.ArgumentParser(description='国土交通省データ取得・集計スクリプト')
    parser.add_argument('--prefectures', type=str, help='対象都道府県（カンマ区切り）', default='all')
    parser.add_argument('--years', type=int, help='取得年数（直近N年）', default=5)
    parser.add_argument('--csv-dir', type=str, help='CSVファイルディレクトリ', default='./mlit-data')
    parser.add_argument('--dry-run', action='store_true', help='ドライラン（データベース投入なし）')
    
    args = parser.parse_args()
    
    # 対象都道府県
    if args.prefectures == 'all':
        target_prefectures = ALL_PREFECTURES
    else:
        target_prefectures = [p.strip() for p in args.prefectures.split(',')]
    
    print("=" * 60)
    print("🚀 全国不動産データ取得・集計スクリプト")
    print("=" * 60)
    print(f"対象都道府県: {len(target_prefectures)}件")
    print(f"取得年数: 直近{args.years}年")
    print(f"CSVディレクトリ: {args.csv_dir}")
    print(f"ドライラン: {args.dry_run}")
    print("=" * 60)
    
    # CSVディレクトリ確認
    if not os.path.exists(args.csv_dir):
        print(f"❌ CSVディレクトリが存在しません: {args.csv_dir}")
        print("\n📝 手動ダウンロード手順:")
        print("1. https://www.reinfolib.mlit.go.jp/realEstatePrices/ にアクセス")
        print("2. 都道府県・物件種別・期間を選択")
        print("3. 「ダウンロード」ボタンをクリック")
        print(f"4. ダウンロードしたCSVを {args.csv_dir}/ に配置")
        print(f"5. ファイル名: <都道府県>_<物件種別>_<期間>.csv")
        return
    
    # CSVファイル一覧取得
    csv_files = [f for f in os.listdir(args.csv_dir) if f.endswith('.csv')]
    
    if not csv_files:
        print(f"❌ CSVファイルが見つかりません: {args.csv_dir}")
        return
    
    print(f"\n📂 CSVファイル: {len(csv_files)}件")
    
    # データセットバージョンID
    dataset_version_id = f"mlit_aggregated_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
    
    # 各CSVファイルを処理
    total_records = 0
    for csv_file in csv_files:
        csv_path = os.path.join(args.csv_dir, csv_file)
        print(f"\n{'='*60}")
        print(f"📄 処理中: {csv_file}")
        print(f"{'='*60}")
        
        # 集計
        records = aggregate_data(csv_path)
        total_records += len(records)
        
        # データベース投入
        if not args.dry_run and records:
            insert_to_database(records, dataset_version_id)
        
        # レート制限対策
        time.sleep(1)
    
    print(f"\n{'='*60}")
    print(f"🎉 全処理完了")
    print(f"{'='*60}")
    print(f"総レコード数: {total_records}件")
    print(f"データセットID: {dataset_version_id}")
    print(f"{'='*60}")


if __name__ == "__main__":
    main()
