"use client";

import { useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { ShiftLog } from "@/data/logs";
import { getStreak } from "@/lib/dashboard";
import { Brain, NotebookPen, Zap } from "lucide-react";

const MISTAKE_KEY = "hinako-mistakes-v2";
const QUIZ_PROGRESS_KEY = "hinako-quiz-progress";
const LOGS_KEY = "hinako-shift-logs";

type MistakeState = { date: string; counts: Record<string, number> };
type QuizProgress = { date: string; answered: number };

export default function DashboardPage() {
  const today = new Date().toISOString().slice(0, 10);
  const [mistakes] = useState<Record<string, number>>(() => {
    if (typeof window === "undefined") return {};
    const m = localStorage.getItem(MISTAKE_KEY);
    if (!m) return {};
    try {
      const parsed = JSON.parse(m) as MistakeState;
      if (parsed.date === today) return parsed.counts || {};
      return {};
    } catch {
      return {};
    }
  });
  const [answered] = useState(() => {
    if (typeof window === "undefined") return 0;
    const q = localStorage.getItem(QUIZ_PROGRESS_KEY);
    if (!q) return 0;
    try {
      const parsed = JSON.parse(q) as QuizProgress;
      if (parsed.date === today) return parsed.answered || 0;
      return 0;
    } catch {
      return 0;
    }
  });
  const [logs] = useState<ShiftLog[]>(() => {
    if (typeof window === "undefined") return [];
    const l = localStorage.getItem(LOGS_KEY);
    if (!l) return [];
    try {
      return JSON.parse(l) as ShiftLog[];
    } catch {
      return [];
    }
  });

  const totalMistakes = useMemo(
    () => Object.values(mistakes).reduce((a, b) => a + b, 0),
    [mistakes],
  );

  const streak = useMemo(() => getStreak(logs, new Date()), [logs]);

  return (
    <main className="space-y-4">
      <header className="space-y-1">
        <p className="text-sm text-muted-foreground">ひなこ専用・ダッシュボード</p>
        <h1 className="text-3xl font-semibold tracking-tight">今日の状況</h1>
      </header>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="border-border-strong/70 bg-card/80">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Zap className="h-5 w-5 text-primary" />
              クイズ
            </CardTitle>
            <CardDescription>今日の回答とミス</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-2xl font-semibold">
              {answered} 回答 / ミス {totalMistakes} 件
            </p>
            <p className="text-sm text-muted-foreground">
              ミスは日付ごとに自動リセットされます。
            </p>
          </CardContent>
        </Card>

        <Card className="border-border-strong/70 bg-card/80">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Brain className="h-5 w-5 text-primary" />
              苦手傾向
            </CardTitle>
            <CardDescription>ミス上位カテゴリ（暫定）</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-2xl font-semibold">
              {totalMistakes === 0 ? "未集計" : "ミス履歴あり"}
            </p>
            <p className="text-sm text-muted-foreground">
              苦手集計は後続で詳細表示を追加予定。
            </p>
          </CardContent>
        </Card>

        <Card className="border-border-strong/70 bg-card/80">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <NotebookPen className="h-5 w-5 text-primary" />
              ログ
            </CardTitle>
            <CardDescription>直近のメモ</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-2xl font-semibold">
              {logs.length} 件 / 連続 {streak} 日
            </p>
            <p className="text-sm text-muted-foreground">
              「ログ」タブの入力で自動集計されます。
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
