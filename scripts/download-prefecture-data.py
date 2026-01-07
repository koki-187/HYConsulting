#!/usr/bin/env python3
"""
国土交通省 不動産情報ライブラリからデータをダウンロードするスクリプト
"""
import requests
import time
import os
from datetime import datetime

# ダウンロード対象の都道府県リスト（Phase 1: 最優先）
PHASE1_PREFECTURES = [
    "東京都",
    "神奈川県",
    "大阪府",
    "愛知県",
    "福岡県"
]

# ダウンロードURL（実際のAPIエンドポイント）
BASE_URL = "https://www.reinfolib.mlit.go.jp/ex-api/external/XIT001"

def download_prefecture_data(prefecture_name, output_dir="./mlit-data"):
    """
    指定した都道府県のデータをダウンロード
    """
    print(f"\n{'='*60}")
    print(f"都道府県: {prefecture_name}")
    print(f"{'='*60}")
    
    # 出力ディレクトリの作成
    os.makedirs(output_dir, exist_ok=True)
    
    # ファイル名
    filename = f"{prefecture_name}_すべて_2020Q1-2025Q2.csv"
    filepath = os.path.join(output_dir, filename)
    
    # リクエストパラメータ
    params = {
        "area": prefecture_name,
        "from": "20201",  # 2020年第1四半期
        "to": "20252",    # 2025年第2四半期
        "kind": "all"     # すべて
    }
    
    print(f"リクエストパラメータ: {params}")
    print(f"ダウンロード先: {filepath}")
    
    try:
        # リクエスト送信
        print("ダウンロード中...")
        response = requests.get(BASE_URL, params=params, timeout=300)
        response.raise_for_status()
        
        # ファイルに保存
        with open(filepath, 'wb') as f:
            f.write(response.content)
        
        file_size = os.path.getsize(filepath)
        print(f"✅ ダウンロード完了: {file_size:,} bytes")
        
        return True
        
    except requests.exceptions.RequestException as e:
        print(f"❌ ダウンロードエラー: {e}")
        return False

def main():
    """
    メイン処理
    """
    print("="*60)
    print("国土交通省 不動産データ ダウンロードスクリプト")
    print("="*60)
    print(f"実行日時: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"対象都道府県数: {len(PHASE1_PREFECTURES)}")
    print("="*60)
    
    success_count = 0
    fail_count = 0
    
    for i, prefecture in enumerate(PHASE1_PREFECTURES, 1):
        print(f"\n[{i}/{len(PHASE1_PREFECTURES)}] {prefecture} のダウンロード開始...")
        
        if download_prefecture_data(prefecture):
            success_count += 1
        else:
            fail_count += 1
        
        # レート制限対策（最後の都道府県以外は待機）
        if i < len(PHASE1_PREFECTURES):
            print("次のダウンロードまで3秒待機...")
            time.sleep(3)
    
    # 結果サマリー
    print("\n" + "="*60)
    print("ダウンロード結果サマリー")
    print("="*60)
    print(f"成功: {success_count} 都道府県")
    print(f"失敗: {fail_count} 都道府県")
    print(f"合計: {len(PHASE1_PREFECTURES)} 都道府県")
    print("="*60)
    
    if fail_count > 0:
        print("\n⚠️ 一部のダウンロードが失敗しました。")
        print("手動でダウンロードしてください:")
        print("https://www.reinfolib.mlit.go.jp/realEstatePrices/")
    else:
        print("\n✅ すべてのダウンロードが完了しました！")
        print("\n次のステップ:")
        print("python3 scripts/download-mlit-data.py --csv-dir ./mlit-data")

if __name__ == "__main__":
    main()
