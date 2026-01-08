# データ取得実行計画 - Session 62

## 実行日時
2026-01-08

## 現状分析

### データベース状況
- **投入済み**: 15都道府県、約88,000レコード
- **未投入**: 32都府県
- **目標**: 全47都道府県の完全カバレッジ

### データソース
- **国土交通省 不動産情報ライブラリ**: https://www.reinfolib.mlit.go.jp/realEstatePrices/
- **データ形式**: CSV（ダウンロード可能）
- **制限事項**: 1回のダウンロードで最大10,000件

## 実行戦略

### アプローチ: 段階的な手動ダウンロード + 自動投入

**理由**:
1. API申請には時間がかかる（承認待ち）
2. 手動ダウンロードは即座に開始可能
3. 主要都市圏のデータを最優先で確保

### Phase 3-1: 主要4都府県のデータ取得（最優先）

#### 対象都府県
1. **東京都** - ビジネス上最重要
2. **大阪府** - 西日本最大都市
3. **京都府** - 関西圏主要都市
4. **兵庫県** - 神戸市を含む

#### 実行手順

**Step 1: ブラウザでのCSVダウンロード**

各都府県ごとに以下の手順を実行:

1. 国土交通省 不動産情報ライブラリにアクセス
2. 検索条件設定:
   - 地域: 対象都府県を選択
   - 価格情報区分: ✓ 不動産取引価格情報、✓ 成約価格情報
   - 種類: すべて
   - 時期: 2020年第1四半期 ～ 2025年第2四半期（直近5年分）
3. 「ダウンロード」ボタンをクリック
4. CSVファイルを `/home/ubuntu/Downloads/` に保存
5. ファイル名を確認: `prefecture_name_YYYYMMDD.csv`

**Step 2: ダウンロードしたCSVの構造確認**

```bash
# CSVファイルのヘッダーを確認
head -n 1 /home/ubuntu/Downloads/*.csv

# データサンプルを確認
head -n 10 /home/ubuntu/Downloads/*.csv
```

**Step 3: CSV → データベース投入スクリプトの作成**

新規スクリプト: `scripts/import-csv-to-aggregated.mjs`

機能:
- CSVファイルを読み込み
- データクリーニング（欠損値、異常値の除外）
- 集計処理（都道府県 × 市区町村 × 物件種別 × 築年数グループ）
- `aggregated_real_estate_data` テーブルへの投入
- 進捗表示とエラーハンドリング

**Step 4: データ投入の実行**

```bash
# 東京都データの投入
node scripts/import-csv-to-aggregated.mjs --file=/home/ubuntu/Downloads/tokyo_20260108.csv --prefecture=東京都

# 大阪府データの投入
node scripts/import-csv-to-aggregated.mjs --file=/home/ubuntu/Downloads/osaka_20260108.csv --prefecture=大阪府

# 京都府データの投入
node scripts/import-csv-to-aggregated.mjs --file=/home/ubuntu/Downloads/kyoto_20260108.csv --prefecture=京都府

# 兵庫県データの投入
node scripts/import-csv-to-aggregated.mjs --file=/home/ubuntu/Downloads/hyogo_20260108.csv --prefecture=兵庫県
```

**Step 5: 投入結果の検証**

```sql
-- 投入された都道府県の確認
SELECT prefecture, COUNT(*) as record_count
FROM aggregated_real_estate_data
WHERE prefecture IN ('東京都', '大阪府', '京都府', '兵庫県')
GROUP BY prefecture;

-- 総レコード数の確認
SELECT COUNT(*) FROM aggregated_real_estate_data;
```

### Phase 3-2: 次の6県のデータ取得（高優先）

#### 対象県
5. 静岡県
6. 広島県
7. 新潟県
8. 岡山県
9. 熊本県
10. 長野県

#### 実行手順
Phase 3-1 と同じ手順を繰り返す

### Phase 3-3: 残り22県のデータ取得（中・低優先）

#### 対象県
11. 岐阜県
12. 三重県
13. 滋賀県
14. 奈良県
15. 和歌山県
16. 山口県
17. 香川県
18. 愛媛県
19. 長崎県
20. 大分県
21. 鹿児島県
22. 富山県
23. 石川県
24. 福井県
25. 山梨県
26. 鳥取県
27. 島根県
28. 徳島県
29. 高知県
30. 佐賀県
31. 宮崎県
32. 沖縄県

#### 実行手順
Phase 3-1 と同じ手順を繰り返す

## スクリプト設計

### `scripts/import-csv-to-aggregated.mjs`

#### 入力
- CSVファイルパス
- 都道府県名（オプション、検証用）

#### 処理フロー

1. **CSV読み込み**
   ```javascript
   import { readFileSync } from 'fs';
   import { parse } from 'csv-parse/sync';
   
   const csvContent = readFileSync(csvFilePath, 'utf-8');
   const records = parse(csvContent, {
     columns: true,
     skip_empty_lines: true
   });
   ```

2. **データクリーニング**
   - 欠損値のチェック（取引価格、面積、築年数）
   - 異常値の除外（価格が0円、面積が0㎡など）
   - 物件種別の正規化（「宅地(土地)」→「土地」など）

3. **集計処理**
   ```javascript
   const aggregated = {};
   
   for (const record of records) {
     const key = `${record.prefecture}_${record.city}_${record.propertyType}_${record.buildingAgeGroup}`;
     
     if (!aggregated[key]) {
       aggregated[key] = {
         prefecture: record.prefecture,
         city: record.city,
         district: record.district || '',
         propertyType: record.propertyType,
         buildingAgeGroup: record.buildingAgeGroup,
         totalPriceYen: 0,
         totalAreaM2: 0,
         transactionCount: 0
       };
     }
     
     aggregated[key].totalPriceYen += parseFloat(record.price);
     aggregated[key].totalAreaM2 += parseFloat(record.area);
     aggregated[key].transactionCount += 1;
   }
   ```

4. **平均値・坪単価の計算**
   ```javascript
   for (const entry of Object.values(aggregated)) {
     entry.averagePriceYen = entry.totalPriceYen / entry.transactionCount;
     entry.averageAreaM2 = entry.totalAreaM2 / entry.transactionCount;
     entry.pricePerTsubo = (entry.averagePriceYen / entry.averageAreaM2) * 3.30579; // 1坪 = 3.30579㎡
   }
   ```

5. **データベース投入**
   ```javascript
   import { getDb } from '../server/db.ts';
   import { aggregatedRealEstateData } from '../drizzle/schema.ts';
   
   const db = await getDb();
   const batchSize = 1000;
   let batch = [];
   
   for (const entry of Object.values(aggregated)) {
     batch.push(entry);
     
     if (batch.length >= batchSize) {
       await db.insert(aggregatedRealEstateData).values(batch);
       console.log(`Inserted ${batch.length} records`);
       batch = [];
     }
   }
   
   // Insert remaining batch
   if (batch.length > 0) {
     await db.insert(aggregatedRealEstateData).values(batch);
     console.log(`Inserted final batch: ${batch.length} records`);
   }
   ```

6. **進捗表示とエラーハンドリング**
   ```javascript
   console.log(`Processing: ${csvFilePath}`);
   console.log(`Total records: ${records.length}`);
   console.log(`Aggregated entries: ${Object.keys(aggregated).length}`);
   console.log(`Inserted entries: ${insertedCount}`);
   console.log(`Skipped entries: ${skippedCount}`);
   console.log(`Error entries: ${errorCount}`);
   ```

## タイムライン

### Day 1（今日）
- ✅ Phase 1: 現状分析完了
- ✅ Phase 2: データ取得戦略立案完了
- 🔄 Phase 3-1: 主要4都府県のデータ取得開始
  - 東京都CSVダウンロード
  - CSV構造確認
  - 投入スクリプト作成
  - 東京都データ投入
  - 検証

### Day 2
- Phase 3-1: 残り3府県のデータ取得と投入
  - 大阪府、京都府、兵庫県
- Phase 3-2: 次の6県のデータ取得開始

### Day 3
- Phase 3-2: 次の6県のデータ投入完了
- Phase 3-3: 残り22県のデータ取得開始

### Day 4-5
- Phase 3-3: 残り22県のデータ投入完了
- Phase 4: 全国データベースの完全性検証
- Phase 5: エラーチェックとファクトチェック

### Day 6
- Phase 6: ブラウザでの査定システム動作確認
- Phase 7: 必要な改善の実施
- Phase 8: チェックポイント保存と引き継ぎドキュメント作成

## リスクと対策

### リスク1: CSVファイルのフォーマットが不明
**対策**: 最初の1ファイルをダウンロードして構造を確認してからスクリプトを作成

### リスク2: データ量が想定より多い
**対策**: バッチ投入とトランザクション管理で対応

### リスク3: データベース接続のタイムアウト
**対策**: 接続プールの設定、リトライロジックの実装

### リスク4: 重複データの投入
**対策**: `ON DUPLICATE KEY UPDATE` または事前の重複チェック

## 成功基準

1. ✅ 全47都道府県のデータが投入されている
2. ✅ 各都道府県に最低100レコード以上存在する
3. ✅ データ整合性チェックが全てパスする
4. ✅ 査定システムが全都道府県で正常に動作する
5. ✅ エラーログに重大なエラーが存在しない

## 次のステップ

1. 🔄 東京都のCSVダウンロード（ブラウザで実行）
2. CSV構造の確認
3. 投入スクリプトの作成
4. 東京都データの投入とテスト
5. 他の都府県への展開
