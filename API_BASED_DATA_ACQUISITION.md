# API経由でのデータ取得戦略

## 発見事項

国土交通省 不動産情報ライブラリは **公開API** を提供しています。

### API情報
- **URL**: https://www.reinfolib.mlit.go.jp/help/apiManual/
- **API名**: 不動産価格（取引価格・成約価格）情報取得API
- **出力形式**: JSON
- **認証**: APIキーが必要（利用申請が必要）

### API利用申請
- **申請ページ**: https://www.reinfolib.mlit.go.jp/api/request/
- **審査**: 反社会的勢力チェック等
- **通知**: メールでAPIキーが通知される
- **所要時間**: 数日～1週間程度（推定）

## 戦略の再評価

### Option A: API利用（理想的だが時間がかかる）
**メリット**:
- プログラマティックに全データ取得可能
- 自動化が容易
- エラーハンドリングが容易
- 最新データを常に取得可能

**デメリット**:
- API利用申請に数日～1週間かかる
- **今すぐには使えない**

**推定所要時間**: 
- 申請: 5分
- 承認待ち: 3-7日
- スクリプト実装: 30分
- データ取得: 30分
- **合計: 3-7日**

### Option B: 手動ダウンロード（現実的）
**メリット**:
- **今すぐ開始できる**
- API申請不要
- 確実にデータ取得可能

**デメリット**:
- 手動作業が必要
- 時間がかかる（3-4時間）
- 自動化が困難

**推定所要時間**: 
- ダウンロード: 3-4時間
- 集計・投入: 30分
- **合計: 3.5-4.5時間**

### Option C: 既存CSVの活用（最速）
**メリット**:
- **最速（10-20分）**
- 既存データを活用

**デメリット**:
- 既存CSVが必要
- データが古い可能性

## 推奨戦略

### 短期（今すぐ）: Option B（手動ダウンロード）
1. 国土交通省サイトから手動でCSVをダウンロード
2. 優先都道府県から順次ダウンロード
3. 集計スクリプトで処理
4. データベースに投入

### 中期（並行作業）: Option A（API申請）
1. API利用申請を提出（バックグラウンド）
2. 承認されたらAPIスクリプトを実装
3. 定期的な自動更新を設定

### 長期（運用）: API自動更新
1. 月次または四半期ごとに自動更新
2. データの鮮度を維持
3. 運用コストを最小化

## 実装計画（短期: 手動ダウンロード）

### Phase 1: 最優先都道府県（5都府県）- 30分

| No | 都道府県 | アクション |
|----|---------|----------|
| 1 | 東京都 | ダウンロード → 集計 → 投入 |
| 2 | 神奈川県 | ダウンロード → 集計 → 投入 |
| 3 | 大阪府 | ダウンロード → 集計 → 投入 |
| 4 | 愛知県 | ダウンロード → 集計 → 投入 |
| 5 | 福岡県 | ダウンロード → 集計 → 投入 |

**手順**:
1. https://www.reinfolib.mlit.go.jp/realEstatePrices/ にアクセス
2. 都道府県を選択
3. 種類: 「すべて」を選択
4. 時期: 2020年Q1 ～ 2025年Q2
5. 「ダウンロード」ボタンをクリック
6. ファイル名を変更: `<都道府県>_すべて_2020Q1-2025Q2.csv`
7. `/home/ubuntu/hy-consulting-lp/mlit-data/` に配置
8. 次の都道府県へ

### Phase 2: 集計とデータベース投入 - 30分

```bash
cd /home/ubuntu/hy-consulting-lp
python3 scripts/download-mlit-data.py --csv-dir ./mlit-data
```

### Phase 3: 検証 - 10分

```bash
# データベース確認
cd /home/ubuntu/hy-consulting-lp
node -e "
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
dotenv.config();

(async () => {
  const conn = await mysql.createConnection(process.env.DATABASE_URL);
  const [rows] = await conn.query(\`
    SELECT prefecture, COUNT(*) as count, SUM(transactionCount) as tx_count
    FROM aggregated_real_estate_data
    GROUP BY prefecture
    ORDER BY count DESC
  \`);
  console.table(rows);
  await conn.end();
})();
"
```

## 次のアクション

### 即時実行
1. ✅ API情報の確認（完了）
2. ⏳ **Phase 1開始: 東京都のダウンロード**
3. ⏳ 集計スクリプトの実行
4. ⏳ データベース投入
5. ⏳ 検証

### 並行作業（バックグラウンド）
1. ⏳ API利用申請の提出
2. ⏳ API承認待ち
3. ⏳ APIスクリプトの実装（承認後）

## API利用申請の準備

### 申請情報
- **利用者種別**: 個人 / 法人
- **氏名**: [ユーザー名]
- **メールアドレス**: [メールアドレス]
- **利用目的**: 不動産査定システムの開発・運用
- **法人または団体名**: HY Consulting（該当する場合）

### 申請URL
https://www.reinfolib.mlit.go.jp/api/request/

---

**作成日**: 2026年1月8日  
**作成者**: Manus AI Agent  
**セッション**: Session 62  
**ステータス**: 手動ダウンロード戦略を採用
