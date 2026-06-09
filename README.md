# AI Development Navigator

作りたいものを入力するだけで、Claude Code などの AI 開発ツールへ渡す高品質なプロンプトを自動生成する Web アプリです。

## 概要

AI を使ったアプリ開発を始めたばかりの初心者は「何を作りたいか」は説明できても「AI にどう指示すれば良いか」が分かりません。このツールはその橋渡しをします。

### 入力
- 作りたいもの
- 使用技術
- 現在の状況

### 出力
1. **Claude Code 向けプロンプト** — そのままコピペできる形式
2. **実装ステップ** — 入力内容から推定した手順
3. **注意点** — 初心者がハマりやすいポイント

## 技術スタック

| 項目 | 内容 |
|------|------|
| フレームワーク | Next.js 16 (App Router) |
| 言語 | TypeScript |
| スタイリング | Tailwind CSS |
| AI 利用 | なし（ルールベース生成） |

## ローカル起動

```bash
# 依存パッケージインストール
npm install

# 開発サーバー起動
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いてください。

## ビルド・本番起動

```bash
npm run build
npm start
```

## デプロイ（Vercel）

1. [Vercel](https://vercel.com) にサインアップ
2. このリポジトリを GitHub に push
3. Vercel の「New Project」からリポジトリをインポート
4. そのままデプロイ（環境変数の設定は不要）

## ディレクトリ構成

```
ai-dev-navigator/
├── app/
│   ├── layout.tsx          # ルートレイアウト（メタデータ含む）
│   ├── page.tsx            # メインページ（1ページ完結）
│   └── api/generate/
│       └── route.ts        # プロンプト生成 API（POST）
├── components/
│   ├── InputForm.tsx       # 入力フォーム
│   └── OutputSection.tsx   # 出力表示（コピーボタン付き）
└── lib/
    └── generator.ts        # ルールベース生成ロジック（コア）
```

## 今後の拡張案

- Claude API / OpenAI API を利用した LLM ベース生成への切り替え
- 対象ツール（Cursor / Gemini など）の選択機能
- 生成履歴の保存機能
