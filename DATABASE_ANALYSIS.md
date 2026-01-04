# HY Consulting 不動産査定データベース分析

## 1. 提供されたファイル構成

### 1.1 データベーススキーマ
**ファイル**: `HY_Appraisal_DB_schema.sql`

提供スキーマは以下の 5 つのテーブルで構成：

| テーブル | 用途 | 行数（サンプル） |
|---------|------|-----------------|
| `dataset_versions` | データセット管理（取り込み履歴） | 1 |
| `regions` | 地域マスタ（都道府県・市区町村・町域） | 5 |
| `transactions` | 取引データ（MLIT データ） | 8 |
| `valuation_requests` | 査定リクエスト履歴 | 1 |
| `valuation_results` | 査定結果 | 1 |

### 1.2 サンプルデータベース
**ファイル**: `HY_Appraisal_DB_sample.sqlite`

- 神奈川県（横浜市、藤沢市）の取引データを含む
- 土地（land）と共有住宅（condo）の 2 種別
- 実データではなく、運用設計説明用のデモ

### 1.3 データ辞書
**ファイル**: `HY_Appraisal_DB_DataDictionary.xlsx`

主要フィールド定義：
- **dataset_versions**: id, source, published_date, ingested_at, checksum, notes
- **regions**: prefecture, city, ward, district, geo_code, lat, lon
- **transactions**: transaction_ym, property_type, land_area_m2, building_area_m2, building_year, station_distance_min, price_yen, unit_price_yen_per_m2
- **valuation_requests**: input_prefecture, input_city, property_type, land_area_m2, building_area_m2, building_year, station_distance_min, ownership_type, inheritance_flag
- **valuation_results**: estimated_low_yen, estimated_high_yen, comps_used_count, method, method_version, explanation

### 1.4 運用設計ドキュメント
**ファイル**: `HY_DB_運用設計.md`

重要な指摘：
- サンプル DB は説明用のみ
- 実データ（国土交通省取引価格情報）は現在このチャット環境に存在しない
- 推奨アーキテクチャ：バックエンド API + PostgreSQL + PostGIS
- ETL 運用：月次（公的データ）、随時/週次（社内データ）

## 2. 現在のプロジェクトスキーマ（Drizzle ORM）

**ファイル**: `drizzle/schema.ts`

既存テーブル：
- `assessment_requests`: 査定リクエスト
- `property_database`: 物件データベース
- `assessmentReports`: 査定レポート
- `auditLog`: 監査ログ

## 3. スキーマ統合戦略

### 3.1 既存スキーマとの比較

| 既存（Drizzle） | 提供スキーマ | マッピング |
|---------------|-----------|----------|
| assessment_requests | valuation_requests | ほぼ同等（フィールド拡張） |
| property_database | transactions | 類似（構造調整） |
| assessmentReports | valuation_results | ほぼ同等 |
| auditLog | (なし) | 監査用（新規） |
| (なし) | dataset_versions | データセット管理（新規） |
| (なし) | regions | 地域マスタ（新規） |

### 3.2 統合アプローチ

1. **既存テーブルの拡張**
   - `assessment_requests` → `valuation_requests` の全フィールドを含める
   - `property_database` → `transactions` の全フィールドを含める
   - `assessmentReports` → `valuation_results` の全フィールドを含める

2. **新規テーブルの追加**
   - `dataset_versions`: データセット管理
   - `regions`: 地域マスタ

3. **既存テーブルの保持**
   - `auditLog`: 監査ログ（既存のまま）

## 4. 査定計算ロジック（提供スキーマから推測）

### 4.1 基本フロー

```
ユーザー入力
  ↓
valuation_requests に保存
  ↓
transactions から類似取引を検索
  - 同一市区町村
  - 同一物件種別
  - 面積 ±20%
  - 築年 ±10年
  - 駅距離 ±10分
  ↓
統計処理（中央値、IQR）
  ↓
valuation_results に結果を保存
  ↓
ユーザーに結果を表示
```

### 4.2 算定方式

- **method**: `median_comps_adjusted`
- **method_version**: バージョン管理（例：v0.1-sample）
- **comps_used_count**: 類似取引件数
- **estimated_low_yen**: 概算下限
- **estimated_high_yen**: 概算上限

### 4.3 説明可能性

結果には以下を含める：
- 「類似取引 ○ 件から算出」
- 「築年・駅距離・面積で調整」
- 「参考値であり詳細査定は面談で確定」

## 5. 実装上の注意点

### 5.1 データ品質

- 欠損値処理（面積、価格が必須）
- 外れ値検知（価格の異常値）
- 重複排除

### 5.2 セキュリティ

- 個人情報は DB に保存しない（またはハッシュ化）
- API キーはクライアント側に埋め込まない
- レート制限・reCAPTCHA 連携

### 5.3 運用

- バックアップ：日次スナップショット + 7/30/90 日保持
- 監視：500/timeout 率、リクエスト数、結果分布
- ETL：月次更新、取り込み失敗時の通知

## 6. 次のステップ

1. Drizzle スキーマを提供スキーマに合わせて拡張
2. 既存 API エンドポイントを更新
3. 査定計算ロジックを実装
4. 10 個のテストケースで検証
5. 本番環境での動作確認
