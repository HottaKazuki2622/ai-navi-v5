"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";
import InputForm from "@/components/InputForm";
import OutputSection from "@/components/OutputSection";
import { GenerateInput, GenerateOutput } from "@/lib/generator";

export default function Home() {
  const [output, setOutput] = useState<GenerateOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (input: GenerateInput) => {
    setIsLoading(true);
    setError(null);
    setOutput(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "生成に失敗しました");
      }

      const data: GenerateOutput = await res.json();
      setOutput(data);

      setTimeout(() => {
        document.getElementById("output")?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } catch (e) {
      setError(e instanceof Error ? e.message : "エラーが発生しました");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-50 dark:bg-[#0a0a0f]">
      {/* 背景装飾: 控えめに漂うグラデーションブロブ */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="animate-float absolute -top-32 -left-32 h-96 w-96 rounded-full bg-indigo-300/40 blur-3xl dark:bg-indigo-600/20" />
        <div className="animate-float-delayed absolute top-1/3 -right-40 h-96 w-96 rounded-full bg-violet-300/40 blur-3xl dark:bg-violet-600/20" />
        <div className="absolute bottom-0 left-1/4 h-72 w-72 rounded-full bg-sky-200/30 blur-3xl dark:bg-sky-500/10" />
      </div>

      <div className="relative mx-auto max-w-2xl px-4 py-16 sm:py-20">
        <header className="mb-10 text-center">
          <div className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-indigo-200 bg-white/70 px-3.5 py-1 text-xs font-medium text-indigo-700 shadow-sm backdrop-blur dark:border-indigo-500/30 dark:bg-white/5 dark:text-indigo-300">
            <Sparkles className="h-3.5 w-3.5" />
            AI 開発プロンプト・ジェネレーター
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl dark:text-white">
            <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-sky-500 bg-clip-text text-transparent">
              AI Development
            </span>
            <br />
            Navigator
          </h1>
          <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-slate-500 dark:text-slate-400">
            作りたいものを入力するだけで、Claude Code などの AI 開発ツールへ渡す高品質なプロンプトを自動生成します。
          </p>
        </header>

        <section className="rounded-3xl border border-white/60 bg-white/80 p-6 shadow-xl shadow-slate-200/50 backdrop-blur-sm sm:p-8 dark:border-white/10 dark:bg-white/[0.04] dark:shadow-none">
          <InputForm onSubmit={handleSubmit} isLoading={isLoading} />
        </section>

        {error && (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300">
            {error}
          </div>
        )}

        {output && (
          <section
            id="output"
            className="mt-6 rounded-3xl border border-white/60 bg-white/80 p-6 shadow-xl shadow-slate-200/50 backdrop-blur-sm sm:p-8 dark:border-white/10 dark:bg-white/[0.04] dark:shadow-none"
          >
            <OutputSection output={output} />
          </section>
        )}

        <footer className="mt-14 text-center text-xs text-slate-400 dark:text-slate-500">
          Built for developers just getting started with AI-assisted coding.
        </footer>
      </div>
    </main>
  );
}
