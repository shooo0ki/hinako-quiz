"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { ShiftLog } from "@/data/logs";
import { getTodayLogs } from "@/lib/dashboard";
import { CalendarClock, NotebookPen, Trash2, X } from "lucide-react";
import { v4 as uuid } from "uuid";
import Image from "next/image";

const STORAGE_KEY = "hinako-shift-logs";

export default function LogsPage() {
  const today = new Date().toISOString().slice(0, 10);
  const [logs, setLogs] = useState<ShiftLog[]>(() => {
    if (typeof window === "undefined") return [];
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    try {
      return JSON.parse(stored);
    } catch {
      return [];
    }
  });
  const [form, setForm] = useState({
    date: today,
    shift: "",
    trouble: "",
    customFails: "",
    nextFocus: "",
  });
  const [showCongrats, setShowCongrats] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
  }, [logs]);

  const todayLogs = useMemo(() => getTodayLogs(logs, today), [logs, today]);

  const handleSave = () => {
    if (!form.shift && !form.trouble && !form.customFails && !form.nextFocus) {
      return;
    }
    const entry: ShiftLog = { id: uuid(), ...form };
    setLogs((prev) => [entry, ...prev]);
    setForm({
      date: today,
      shift: "",
      trouble: "",
      customFails: "",
      nextFocus: "",
    });
    setShowCongrats(true);
  };

  const handleDelete = (id: string) => {
    setLogs((prev) => prev.filter((log) => log.id !== id));
  };

  return (
    <main className="space-y-4">
      <header className="space-y-1">
        <p className="text-sm text-muted-foreground">ひなこ専用・バイトログ</p>
        <h1 className="text-3xl font-semibold tracking-tight">シフト記録</h1>
      </header>

      {showCongrats && (
        <Card className="border-border-strong/70 bg-card/80">
          <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
            <div className="shrink-0 overflow-hidden rounded-lg border border-border-strong/70 bg-background/60">
              <Image
                src="/hinako-congrats.jpg"
                alt="今日もお疲れさま！"
                width={200}
                height={200}
                className="h-full w-full object-cover"
                priority
              />
            </div>
            <div className="space-y-1">
              <p className="text-lg font-semibold text-foreground">今日も頑張ったね！</p>
              <p className="text-sm text-muted-foreground">
                ログを1分で書けたらそれでOK。無理せず続けよう。
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="border-border-strong/70 bg-card/80">
        <CardHeader className="space-y-2">
          <CardTitle className="flex items-center gap-2 text-lg">
            <NotebookPen className="h-5 w-5 text-primary" />
            1分で書けるログ
          </CardTitle>
          <CardDescription>完璧さより継続重視。必須項目なし。</CardDescription>
        </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1">
                <Label htmlFor="date">日付</Label>
                <Input
                  id="date"
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                />
              </div>
            <div className="space-y-1">
              <Label htmlFor="shift">シフト時間</Label>
              <Input
                id="shift"
                placeholder="例: 09:00-14:00"
                value={form.shift}
                onChange={(e) =>
                  setForm((f) => ({ ...f, shift: e.target.value }))
                }
              />
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor="trouble">今日困ったこと</Label>
            <Textarea
              id="trouble"
              placeholder="例: フラペのポンプ数を間違えた"
              value={form.trouble}
              onChange={(e) =>
                setForm((f) => ({ ...f, trouble: e.target.value }))
              }
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="customFails">できなかったカスタム</Label>
            <Textarea
              id="customFails"
              placeholder="例: ライトアイスのラインを迷った"
              value={form.customFails}
              onChange={(e) =>
                setForm((f) => ({ ...f, customFails: e.target.value }))
              }
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="nextFocus">次回意識すること（1行）</Label>
            <Input
              id="nextFocus"
              placeholder="例: フラペのポンプ数を先に口に出す"
              value={form.nextFocus}
              onChange={(e) =>
                setForm((f) => ({ ...f, nextFocus: e.target.value }))
              }
            />
          </div>

          <div className="flex justify-end">
            <Button onClick={handleSave}>保存する</Button>
          </div>
        </CardContent>
      </Card>

      {showCongrats && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-3xl overflow-hidden rounded-2xl border border-border-strong/70 bg-card shadow-2xl">
            <button
              type="button"
              className="absolute right-3 top-3 rounded-full border border-border-strong/70 bg-background/80 p-2 text-muted-foreground transition hover:text-foreground"
              onClick={() => setShowCongrats(false)}
              aria-label="閉じる"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="w-full">
              <Image
                src="/hinako-congrats.jpg"
                alt="今日も頑張ったね！"
                width={1200}
                height={800}
                className="h-[320px] w-full object-cover sm:h-[440px]"
                priority
              />
            </div>
            <div className="space-y-1 px-4 py-4 sm:px-6 sm:py-5">
              <p className="text-2xl font-semibold text-foreground">お疲れさま！今日も頑張ったね</p>
              <p className="text-sm text-muted-foreground">
                ログを書いたらひと息つこう。続けるだけで十分えらい。
              </p>
            </div>
          </div>
        </div>
      )}

      <Card className="border-border-strong/70 bg-card/80">
        <CardHeader className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-lg">
              <CalendarClock className="h-5 w-5 text-primary" />
              最近のログ
            </CardTitle>
            <CardDescription>直近の記録を表示（ローカルのみ保存）</CardDescription>
          </div>
          <BadgeToday count={todayLogs.length} />
        </CardHeader>
        <CardContent className="space-y-3">
          {logs.length === 0 && (
            <p className="text-sm text-muted-foreground">
              まだログがありません。1分だけ書いてみましょう。
            </p>
          )}
          {logs.map((log) => (
            <div
              key={log.id}
              className="rounded-lg border border-border-strong/60 bg-background/60 p-3 text-sm"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-col">
                  <span className="font-semibold">{log.date}</span>
                  <span className="text-xs text-muted-foreground">
                    シフト: {log.shift || "未入力"}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground"
                  onClick={() => handleDelete(log.id)}
                >
                  <Trash2 className="mr-1 h-4 w-4" />
                  削除
                </Button>
              </div>
              {log.trouble && (
                <p className="mt-1 text-muted-foreground">困った: {log.trouble}</p>
              )}
              {log.customFails && (
                <p className="mt-1 text-muted-foreground">
                  カスタム: {log.customFails}
                </p>
              )}
              {log.nextFocus && (
                <p className="mt-1 text-primary">次回: {log.nextFocus}</p>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </main>
  );
}

function BadgeToday({ count }: { count: number }) {
  return (
    <div className="rounded-full border border-border-strong/70 bg-background/70 px-3 py-1 text-xs text-muted-foreground">
      今日の記録 {count} 件
    </div>
  );
}
