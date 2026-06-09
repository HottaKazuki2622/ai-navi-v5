"use client";

import { useState } from "react";
import { GenerateInput } from "@/lib/generator";

interface Props {
  onSubmit: (input: GenerateInput) => void;
  isLoading: boolean;
}

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
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          作りたいもの
          <span className="ml-1 text-red-500">*</span>
        </label>
        <textarea
          name="whatToBuild"
          value={form.whatToBuild}
          onChange={handleChange}
          required
          rows={3}
          placeholder="例: タスク管理アプリ。ユーザーがタスクを追加・完了・削除できる Web アプリ"
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none resize-none transition"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          使用技術
        </label>
        <textarea
          name="techStack"
          value={form.techStack}
          onChange={handleChange}
          rows={2}
          placeholder="例: Next.js (App Router) + TypeScript + Tailwind CSS + Supabase"
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none resize-none transition"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          現在の状況
        </label>
        <textarea
          name="currentSituation"
          value={form.currentSituation}
          onChange={handleChange}
          rows={2}
          placeholder="例: ログイン機能まで完成。次はタスクの CRUD を実装したい"
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none resize-none transition"
        />
      </div>

      <button
        type="submit"
        disabled={isLoading || !form.whatToBuild.trim()}
        className="w-full rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 active:bg-indigo-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isLoading ? "生成中..." : "プロンプトを生成する"}
      </button>
    </form>
  );
}
