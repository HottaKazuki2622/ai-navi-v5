"use client";

import { useState } from "react";
import { GenerateOutput } from "@/lib/generator";

interface Props {
  output: GenerateOutput;
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="text-xs px-3 py-1 rounded-md border border-gray-300 bg-white hover:bg-gray-50 text-gray-600 transition-colors"
    >
      {copied ? "コピーしました!" : "コピー"}
    </button>
  );
}

export default function OutputSection({ output }: Props) {
  return (
    <div className="space-y-6">
      {/* Claude Code プロンプト */}
      <section>
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-base font-bold text-gray-800 flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-indigo-500" />
            Claude Code 向けプロンプト
          </h2>
          <CopyButton text={output.claudePrompt} />
        </div>
        <pre className="w-full rounded-lg bg-gray-900 text-gray-100 p-4 text-xs leading-relaxed overflow-x-auto whitespace-pre-wrap break-words font-mono">
          {output.claudePrompt}
        </pre>
      </section>

      {/* 実装ステップ */}
      <section>
        <h2 className="text-base font-bold text-gray-800 flex items-center gap-2 mb-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" />
          実装ステップ
        </h2>
        <ol className="space-y-2">
          {output.implementationSteps.map((step, i) => (
            <li
              key={i}
              className="flex items-start gap-3 rounded-lg bg-emerald-50 border border-emerald-100 px-4 py-3 text-sm text-gray-700"
            >
              <span className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full bg-emerald-500 text-white text-xs flex items-center justify-center font-bold">
                {i + 1}
              </span>
              <span>{step.replace(/^\d+\.\s*/, "")}</span>
            </li>
          ))}
        </ol>
      </section>

      {/* 注意点 */}
      <section>
        <h2 className="text-base font-bold text-gray-800 flex items-center gap-2 mb-2">
          <span className="inline-block w-2 h-2 rounded-full bg-amber-500" />
          初心者がハマりやすい注意点
        </h2>
        <ul className="space-y-2">
          {output.warnings.map((w, i) => (
            <li
              key={i}
              className="flex items-start gap-3 rounded-lg bg-amber-50 border border-amber-100 px-4 py-3 text-sm text-gray-700"
            >
              <span className="flex-shrink-0 text-amber-500 font-bold">!</span>
              <span>{w}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
