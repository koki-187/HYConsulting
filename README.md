# HYConsulting ランディングページ プロジェクト

HYConsultingの公式ランディングページ（LP）をSTUDIOで構築するプロジェクトです。

## プロジェクト概要

このリポジトリは、STUDIOを使用してHYConsultingのランディングページを構築・管理するためのものです。
コンテンツ、仕様、アセット、ドキュメントをバージョン管理し、効率的な開発とメンテナンスを実現します。

## STUDIOプロジェクト

- **プロジェクトURL**: https://app.studio.design/projects/G3qbQAobOJ/dashboard/home/general
- **ヘルプドキュメント**: https://help.studio.design/ja/

## クイックスタート

### 1. STUDIOにアクセス
```
1. 上記のプロジェクトURLにアクセス
2. STUDIOアカウントでログイン
3. 「エディタを開く」をクリック
```

### 2. ドキュメントを確認
```
- STUDIO_SETUP.md: STUDIOの初期設定ガイド
- docs/LP_SPECIFICATION.md: LP全体の仕様書
- docs/CONTENT.md: 使用するコンテンツ（テキスト）
- docs/design/STUDIO_BUILD_GUIDE.md: STUDIO構築手順
```

### 3. 構築を開始
STUDIOエディタでLPを構築します。詳細は `docs/design/STUDIO_BUILD_GUIDE.md` を参照してください。

## ディレクトリ構成

```
HYConsulting/
├── README.md                          # プロジェクト概要（このファイル）
├── STUDIO_SETUP.md                    # STUDIOセットアップガイド
├── docs/                              # ドキュメント
│   ├── LP_SPECIFICATION.md            # LP仕様書
│   ├── CONTENT.md                     # コンテンツ（テキスト）
│   └── design/                        # デザイン関連
│       └── STUDIO_BUILD_GUIDE.md      # STUDIO構築ガイド
└── assets/                            # アセット
    ├── README.md                      # アセット管理ガイド
    ├── images/                        # 画像ファイル
    │   ├── logo/                      # ロゴ
    │   ├── hero/                      # ヒーロー画像
    │   ├── services/                  # サービス紹介
    │   ├── features/                  # 強み・特徴
    │   ├── clients/                   # お客様の声
    │   └── icons/                     # アイコン
    └── documents/                     # ドキュメントファイル
        ├── policies/                  # ポリシー類
        └── guides/                    # ガイド類
```

## LP構成

### ページセクション
1. **ファーストビュー**: キャッチコピー + CTA
2. **サービス紹介**: 提供サービス3つ
3. **強み・特徴**: HYConsultingの強み3つ
4. **実績**: 数値実績とクライアント事例
5. **お客様の声**: レビュー3-5件
6. **FAQ**: よくある質問
7. **お問い合わせ**: フォーム
8. **フッター**: 会社情報とリンク

詳細は `docs/LP_SPECIFICATION.md` を参照してください。

## 開発フロー

### STUDIOでの作業
```
1. 仕様書とコンテンツを確認
   ├─ docs/LP_SPECIFICATION.md
   └─ docs/CONTENT.md

2. 必要な画像を準備
   └─ assets/images/ に配置

3. STUDIOエディタで構築
   └─ docs/design/STUDIO_BUILD_GUIDE.md を参照

4. プレビューで確認
   └─ 各デバイスサイズで確認

5. 公開
   └─ ドメイン設定とSSL有効化
```

### このリポジトリの更新
```
1. 変更内容をドキュメントに反映
2. 新しい画像をassets/に追加
3. コミットしてプッシュ
```

## AIエージェント（ChatGPT）の活用

STUDIOでのLP構築において、AIエージェントは以下のサポートが可能です：

### コンテンツ作成
- キャッチコピーの提案
- サービス説明文の作成
- FAQの作成
- SEO最適化されたメタデータの生成

### デザイン提案
- カラースキームの提案
- レイアウトパターンの提案
- UX改善のアドバイス

### 使用例
```
「コンサルティング会社のLPに適したキャッチコピーを5つ提案してください」
「CTAボタンの効果的な文言を教えてください」
「この会社に合うブランドカラーを提案してください」
```

## 技術スタック

- **プラットフォーム**: STUDIO（ノーコードWebサイト構築ツール）
- **バージョン管理**: Git/GitHub
- **デザイン**: STUDIO内蔵エディタ
- **ホスティング**: STUDIO（独自ドメイン対応）

## STUDIOの主な機能

- ✅ ノーコードでの直感的な編集
- ✅ レスポンシブデザイン対応
- ✅ CMS機能
- ✅ フォーム機能（お問い合わせ）
- ✅ アニメーション機能
- ✅ SEO設定
- ✅ 独自ドメイン対応
- ✅ SSL証明書（自動発行）
- ✅ Google Analytics連携

## タスクリスト

### Phase 1: 準備（完了）
- [x] プロジェクトリポジトリ作成
- [x] ドキュメント構造作成
- [x] LP仕様書作成
- [x] コンテンツ作成
- [x] STUDIO構築ガイド作成

### Phase 2: アセット準備
- [ ] ロゴファイルの準備
- [ ] ヒーロー画像の準備
- [ ] サービスアイコンの準備（3つ）
- [ ] 強み・特徴セクション用画像の準備（3つ）
- [ ] OGP画像の作成
- [ ] ファビコンの作成

### Phase 3: STUDIO構築
- [ ] ヘッダーの作成
- [ ] ファーストビューの作成
- [ ] サービス紹介セクションの作成
- [ ] 強み・特徴セクションの作成
- [ ] 実績セクションの作成
- [ ] お客様の声セクションの作成
- [ ] FAQセクションの作成
- [ ] お問い合わせフォームの作成
- [ ] フッターの作成

### Phase 4: 最適化
- [ ] レスポンシブ対応の確認
- [ ] アニメーション設定
- [ ] SEO設定（タイトル、メタディスクリプション）
- [ ] OGP設定
- [ ] パフォーマンステスト

### Phase 5: 公開
- [ ] プレビュー確認
- [ ] 独自ドメイン設定
- [ ] SSL証明書発行
- [ ] Google Analytics設定
- [ ] 本番公開

## 参考リンク

### STUDIO公式
- [STUDIO公式サイト](https://studio.design/)
- [STUDIOヘルプセンター](https://help.studio.design/ja/)
- [STUDIOコミュニティ](https://community.studio.design/)
- [STUDIO YouTube](https://www.youtube.com/c/STUDIODesign)

### 参考資料
- [ランディングページのベストプラクティス](https://help.studio.design/ja/)
- [ノーコードツールでのWebサイト構築](https://blog.studio.design/)

## サポート

### 質問・問題が発生した場合
1. `docs/design/STUDIO_BUILD_GUIDE.md` のトラブルシューティングを確認
2. [STUDIOヘルプセンター](https://help.studio.design/ja/) で検索
3. [STUDIOコミュニティ](https://community.studio.design/) で質問
4. プロジェクトチームに連絡

## ライセンス

このプロジェクトは HYConsulting の所有物です。

## 更新履歴

- 2024-12-27: プロジェクト初期構築、ドキュメント作成
