"use client";

import { useState } from "react";
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
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 px-4 py-12">
      <div className="mx-auto max-w-2xl space-y-10">
        <header className="text-center space-y-2">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            AI Development Navigator
          </h1>
          <p className="text-sm text-gray-500">
            作りたいものを入力するだけで、AI へ渡す高品質なプロンプトを自動生成します
          </p>
        </header>

        <section className="rounded-2xl bg-white shadow-sm border border-gray-100 p-6">
          <InputForm onSubmit={handleSubmit} isLoading={isLoading} />
        </section>

        {error && (
          <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {output && (
          <section id="output" className="rounded-2xl bg-white shadow-sm border border-gray-100 p-6">
            <OutputSection output={output} />
          </section>
        )}
      </div>
    </main>
  );
}
