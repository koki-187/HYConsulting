# Session 78: Google Sheets詳細分析

## 確認日時
2026-01-09

## シート「不動産査定依頼フォーム」の現状

### カラム構成（1行目ヘッダー）
| 列 | ヘッダー名 | 説明 |
|---|---|---|
| A | 受付日時 | YYYY-MM-DDTHH:mm:ss形式 |
| B | 名前 | Anonymous/匿名/実名 |
| C | メールアドレス | メールアドレス |
| D | 電話番号 | 電話番号 |
| E | 物件種別 | 戸建て/マンション/アパート/土地 |
| F | 都道府県 | 都道府県名 |
| G | 市区町村 | 市区町村名 |
| H | 所在地 | 都道府県+市区町村 |
| I | 床面積（㎡） | 数値 |
| J | （年） | 築年数 |
| K | 最寄り駅 | 駅名/未入力 |
| L | 駅徒歩（分） | 〇分/未入力 |
| M | 建築構造(アパートのみ) | アパート専用 |
| N | 階数(アパートのみ) | アパート専用 |
| O | 推定価格（万円） | 〇〇万円～〇〇万円 または 数値のみ |

### 確認された問題点

1. **推定価格の表示形式が混在**
   - 新しいデータ: 「3,500万円～4,300万円」形式
   - 古いデータ: 「3500」など数値のみ

2. **1行目のヘッダー固定**
   - 現在、1行目にヘッダーがあるが、スクロール時に固定されていない可能性

3. **「未入力」の表示**
   - 最寄り駅、駅徒歩が未入力の場合「未入力」と表示（これは正常動作）

### 対応方針

1. **サーバー側のWebhook送信形式は既に統一されている**
   - 推定価格は「〇〇万円～〇〇万円」形式で送信
   - 未入力項目は「未入力」と表示

2. **Google Apps Script側での対応が必要**
   - ヘッダー行の自動固定
   - 既存データの形式統一（手動またはスクリプト）

### 現在のサーバー側Webhook送信データ

```javascript
const webhookData = {
  timestamp: formattedTimestamp,        // "YYYY-MM-DD HH:mm"
  ownerName: webhookInput.ownerName || "匿名",
  email: webhookInput.email || "",
  phone: formattedPhone,
  propertyType: propertyTypeJa,         // 日本語
  prefecture: webhookInput.prefecture,
  city: webhookInput.city,
  address: locationText,                // 都道府県+市区町村
  floorArea: webhookInput.floorArea || "",
  buildingAge: webhookInput.buildingAge || "",
  estimatedPrice: priceRangeText,       // "〇〇万円～〇〇万円"
  nearestStation: stationText,          // 駅名 or "未入力"
  walkingMinutes: walkingText,          // "〇分" or "未入力"
  buildingStructure: buildingStructureText,
  floors: floorsText,
};
```

## 結論

サーバー側のデータ送信形式は既に統一されています。古いデータの形式が異なるのは、過去のバージョンで送信されたデータです。

Google Apps Script側でヘッダー行を固定する設定が必要な場合は、Google Sheets側で「表示」→「固定」→「1行」を選択することで対応できます。
