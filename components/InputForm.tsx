"use client";

import { useState } from "react";
import { Compass, Layers, Lightbulb, Loader2, Sparkles, type LucideIcon } from "lucide-react";
import { GenerateInput } from "@/lib/generator";

interface Props {
  onSubmit: (input: GenerateInput) => void;
  isLoading: boolean;
}

interface FieldConfig {
  name: keyof GenerateInput;
  label: string;
  icon: LucideIcon;
  required?: boolean;
  rows: number;
  placeholder: string;
}

const FIELDS: FieldConfig[] = [
  {
    name: "whatToBuild",
    label: "作りたいもの",
    icon: Lightbulb,
    required: true,
    rows: 3,
    placeholder: "例: タスク管理アプリ。ユーザーがタスクを追加・完了・削除できる Web アプリ",
  },
  {
    name: "techStack",
    label: "使用技術",
    icon: Layers,
    rows: 2,
    placeholder: "例: Next.js (App Router) + TypeScript + Tailwind CSS + Supabase",
  },
  {
    name: "currentSituation",
    label: "現在の状況",
    icon: Compass,
    rows: 2,
    placeholder: "例: ログイン機能まで完成。次はタスクの CRUD を実装したい",
  },
];

export default function InputForm({ onSubmit, isLoading }: Props) {
  const [form, setForm] = useState<GenerateInput>({
    whatToBuild: "",
    techStack: "",
    currentSituation: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {FIELDS.map(({ name, label, icon: Icon, required, rows, placeholder }) => (
        <div key={name}>
          <label className="mb-1.5 flex items-center gap-1.5 text-sm font-semibold text-slate-700 dark:text-slate-200">
            <Icon className="h-4 w-4 text-indigo-500" />
            {label}
            {required && <span className="text-red-500">*</span>}
          </label>
          <textarea
            name={name}
            value={form[name]}
            onChange={handleChange}
            required={required}
            rows={rows}
            placeholder={placeholder}
            className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 shadow-sm transition focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 dark:border-white/10 dark:bg-white/5 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:border-indigo-400/50 dark:focus:ring-indigo-500/20"
          />
        </div>
      ))}

      <button
        type="submit"
        disabled={isLoading || !form.whatToBuild.trim()}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-3 text-sm font-semibold text-white shadow-md shadow-indigo-500/20 transition hover:shadow-lg hover:shadow-indigo-500/30 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            生成中...
          </>
        ) : (
          <>
            <Sparkles className="h-4 w-4" />
            プロンプトを生成する
          </>
        )}
      </button>
    </form>
  );
}
