"use client";

import { useState } from "react";
import { Check, Copy, ListChecks, MessageSquareWarning, Terminal, type LucideIcon } from "lucide-react";
import { GenerateOutput } from "@/lib/generator";

interface Props {
  output: GenerateOutput;
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // フォールバック: 非HTTPS環境やパーミッション拒否時
      const el = document.createElement("textarea");
      el.value = text;
      el.style.position = "fixed";
      el.style.opacity = "0";
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-1.5 rounded-md border border-white/10 bg-white/5 px-2.5 py-1 text-xs font-medium text-slate-300 transition hover:bg-white/10 hover:text-white"
    >
      {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
      {copied ? "コピーしました" : "コピー"}
    </button>
  );
}

function SectionHeading({
  icon: Icon,
  color,
  children,
}: {
  icon: LucideIcon;
  color: "indigo" | "emerald" | "amber";
  children: React.ReactNode;
}) {
  const colorMap = {
    indigo: "bg-indigo-100 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400",
    emerald: "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400",
    amber: "bg-amber-100 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400",
  };

  return (
    <h2 className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-800 dark:text-slate-100">
      <span className={`flex h-6 w-6 items-center justify-center rounded-full ${colorMap[color]}`}>
        <Icon className="h-3.5 w-3.5" />
      </span>
      {children}
    </h2>
  );
}

export default function OutputSection({ output }: Props) {
  return (
    <div className="space-y-8">
      {/* Claude Code プロンプト */}
      <section>
        <SectionHeading icon={Terminal} color="indigo">
          Claude Code 向けプロンプト
        </SectionHeading>
        <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900 shadow-inner">
          <div className="flex items-center justify-between border-b border-white/10 bg-white/5 px-4 py-2">
            <span className="text-xs font-medium text-slate-400">prompt.txt</span>
            <CopyButton text={output.claudePrompt} />
          </div>
          <pre className="max-h-96 overflow-auto whitespace-pre-wrap break-words p-4 font-mono text-xs leading-relaxed text-slate-100">
            {output.claudePrompt}
          </pre>
        </div>
      </section>

      {/* 実装ステップ */}
      <section>
        <SectionHeading icon={ListChecks} color="emerald">
          実装ステップ
        </SectionHeading>
        <ol className="space-y-2">
          {output.implementationSteps.map((step, i) => (
            <li
              key={i}
              className="flex items-start gap-3 rounded-xl border border-emerald-100 bg-emerald-50/60 px-4 py-3 text-sm text-slate-700 transition hover:border-emerald-200 dark:border-emerald-500/10 dark:bg-emerald-500/5 dark:text-slate-300"
            >
              <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-emerald-500 text-xs font-bold text-white">
                {i + 1}
              </span>
              <span className="min-w-0 break-words">{step.replace(/^\d+\.\s*/, "")}</span>
            </li>
          ))}
        </ol>
      </section>

      {/* 注意点 */}
      <section>
        <SectionHeading icon={MessageSquareWarning} color="amber">
          初心者がハマりやすい注意点
        </SectionHeading>
        <ul className="space-y-2">
          {output.warnings.map((w, i) => (
            <li
              key={i}
              className="flex items-start gap-3 rounded-xl border border-amber-100 bg-amber-50/60 px-4 py-3 text-sm text-slate-700 transition hover:border-amber-200 dark:border-amber-500/10 dark:bg-amber-500/5 dark:text-slate-300"
            >
              <span className="mt-0.5 flex-shrink-0 text-sm font-bold text-amber-500">!</span>
              <span className="min-w-0 break-words">{w}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
