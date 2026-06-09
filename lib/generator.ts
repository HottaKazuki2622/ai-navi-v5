export interface GenerateInput {
  whatToBuild: string;
  techStack: string;
  currentSituation: string;
}

export interface GenerateOutput {
  claudePrompt: string;
  implementationSteps: string[];
  warnings: string[];
}

// キーワードマッチング用ユーティリティ
function includes(text: string, keywords: string[]): boolean {
  const lower = text.toLowerCase();
  return keywords.some((k) => lower.includes(k));
}

function buildClaudePrompt(input: GenerateInput): string {
  const { whatToBuild, techStack, currentSituation } = input;

  return `# 目的
${whatToBuild} を実装してください。

# 技術スタック
${techStack || "（指定なし）"}

# 現在の状況
${currentSituation || "（初期状態）"}

# 依頼内容
上記の状況を踏まえ、次のステップに必要なコードを生成してください。

## 出力形式の要件
- 実装コードは省略せず完全に記述してください
- ファイルごとにパスを明示してください（例: \`src/app/page.tsx\`）
- 既存コードへの変更箇所はコメントで示してください（例: \`// ここを追加\`）
- エラーハンドリングを適切に実装してください

## コーディング規約
- TypeScript の型を明示的に定義してください
- コンポーネントは関数コンポーネント（アロー関数）で記述してください
- 変数名・関数名は英語でキャメルケースを使用してください

# 補足
不明な点があれば実装前に質問してください。`.trim();
}

// 技術スタックからステップを推定する
function inferSteps(input: GenerateInput): string[] {
  const text = `${input.whatToBuild} ${input.techStack} ${input.currentSituation}`;
  const steps: string[] = [];

  // 認証
  if (includes(text, ["auth", "login", "ログイン", "認証", "supabase"])) {
    if (!includes(input.currentSituation, ["ログイン機能まで完成", "auth完成", "認証済み"])) {
      steps.push("認証機能（サインアップ・ログイン）の実装");
    }
  }

  // DB / データモデル
  if (includes(text, ["db", "database", "supabase", "prisma", "mysql", "postgres", "mongodb", "データベース"])) {
    steps.push("データベーススキーマ・テーブル設計");
  }

  // API
  if (includes(text, ["api", "endpoint", "rest", "graphql", "route", "バックエンド"])) {
    steps.push("APIエンドポイントの作成（CRUD）");
  }

  // CRUD
  if (includes(text, ["crud", "作成", "編集", "削除", "一覧", "タスク", "todo", "管理"])) {
    steps.push("データの追加・編集・削除・一覧表示の実装");
  }

  // UI
  steps.push("UIコンポーネントの実装");

  // 状態管理
  if (includes(text, ["state", "redux", "zustand", "context", "recoil", "状態管理"])) {
    steps.push("状態管理の設定");
  }

  // スタイリング
  if (includes(text, ["tailwind", "css", "styled", "chakra", "mui", "デザイン"])) {
    steps.push("スタイリング・レスポンシブ対応");
  }

  // テスト
  steps.push("動作確認・デバッグ");

  // デプロイ
  if (includes(text, ["vercel", "deploy", "デプロイ", "本番"])) {
    steps.push("Vercel へのデプロイ");
  }

  // 重複削除・番号付与
  const unique = [...new Set(steps)];
  return unique.map((s, i) => `${i + 1}. ${s}`);
}

// 注意点をルールベースで生成する
function inferWarnings(input: GenerateInput): string[] {
  const text = `${input.whatToBuild} ${input.techStack} ${input.currentSituation}`;
  const warnings: string[] = [];

  // Next.js App Router
  if (includes(text, ["next.js", "nextjs", "next js", "app router"])) {
    warnings.push(
      '`use client` の付け忘れに注意：サーバーコンポーネントでは useState / useEffect は使えません。'
    );
    warnings.push(
      "API Route は `app/api/xxx/route.ts` に作成し、`export async function GET/POST` 形式で定義します。"
    );
  }

  // Supabase
  if (includes(text, ["supabase"])) {
    warnings.push(
      "Supabase の環境変数（NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY）を `.env.local` に設定し、`.gitignore` に追加してください。"
    );
    warnings.push(
      "Row Level Security（RLS）を有効にしないと、ログインしていないユーザーもデータを読み書きできます。"
    );
  }

  // TypeScript
  if (includes(text, ["typescript", "ts", ".tsx"])) {
    warnings.push(
      "`any` 型の多用は避け、インターフェースや型エイリアスで型を明示してください。"
    );
  }

  // Tailwind
  if (includes(text, ["tailwind"])) {
    warnings.push(
      "Tailwind のクラス名は動的に文字列連結すると JIT が認識できない場合があります。`cn()` ユーティリティや `clsx` を使うと安全です。"
    );
  }

  // 認証
  if (includes(text, ["auth", "login", "ログイン", "認証"])) {
    warnings.push(
      "パスワードは絶対に平文で保存しないでください。Supabase Auth や NextAuth.js などの認証ライブラリを使いましょう。"
    );
  }

  // Git / 環境変数
  warnings.push(
    "`.env.local` や API キーは絶対に GitHub に公開しないでください。`.gitignore` に含まれているか必ず確認しましょう。"
  );

  // 共通 - CORS
  if (includes(text, ["api", "fetch", "axios"])) {
    warnings.push(
      "外部 API を呼び出す場合は CORS エラーに注意。ブラウザから直接叩かず、Next.js の API Route 経由にするのが安全です。"
    );
  }

  return warnings;
}

export function generate(input: GenerateInput): GenerateOutput {
  return {
    claudePrompt: buildClaudePrompt(input),
    implementationSteps: inferSteps(input),
    warnings: inferWarnings(input),
  };
}
