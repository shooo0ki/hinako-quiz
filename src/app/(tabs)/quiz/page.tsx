"use client";

import { useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { QUIZ_QUESTIONS } from "@/data/quiz";
import { cn } from "@/lib/utils";
import { Brain, Coffee, Heart, ListChecks, Timer, Trash2 } from "lucide-react";

type MistakeCounts = Record<string, number>;
type MistakeStateLegacy = { date: string; counts: MistakeCounts };
type Mode = "all" | "mistakes" | "favorites";

const MISTAKES_KEY = "hinako-mistakes-v3";
const QUIZ_PROGRESS_KEY = "hinako-quiz-progress";
const FAVORITES_KEY = "hinako-favorites";

export default function QuizPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(5);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [mode, setMode] = useState<Mode>("all");

  const [answered, setAnswered] = useState(() => {
    if (typeof window === "undefined") return 0;
    const stored = localStorage.getItem(QUIZ_PROGRESS_KEY);
    if (!stored) return 0;
    try {
      const parsed = JSON.parse(stored) as { date: string; answered: number };
      const today = new Date().toISOString().slice(0, 10);
      if (parsed.date === today) return parsed.answered || 0;
      return 0;
    } catch {
      return 0;
    }
  });

  const [mistakes, setMistakes] = useState<MistakeCounts>(() => {
    if (typeof window === "undefined") return {};
    const stored = localStorage.getItem(MISTAKES_KEY);
    if (!stored) return {};
    try {
      const parsed = JSON.parse(stored) as MistakeStateLegacy | MistakeCounts;
      if (parsed && typeof parsed === "object" && "counts" in parsed) {
        return (parsed as MistakeStateLegacy).counts || {};
      }
      if (parsed && typeof parsed === "object") {
        return parsed as MistakeCounts;
      }
      return {};
    } catch {
      return {};
    }
  });

  const [favorites, setFavorites] = useState<string[]>(() => {
    if (typeof window === "undefined") return [];
    const stored = localStorage.getItem(FAVORITES_KEY);
    if (!stored) return [];
    try {
      return JSON.parse(stored) as string[];
    } catch {
      return [];
    }
  });

  const pool = useMemo(() => {
    if (mode === "mistakes") {
      return QUIZ_QUESTIONS.filter((q) => (mistakes[q.id] || 0) > 0);
    }
    if (mode === "favorites") {
      return QUIZ_QUESTIONS.filter((q) => favorites.includes(q.id));
    }
    return QUIZ_QUESTIONS;
  }, [mode, mistakes, favorites]);

  const currentQuestion = pool[currentIndex] ?? pool[0];
  const progressValue = pool.length
    ? ((currentIndex + 1) / pool.length) * 100
    : 0;
  const isFavorite = currentQuestion
    ? favorites.includes(currentQuestion.id)
    : false;

  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem(
      QUIZ_PROGRESS_KEY,
      JSON.stringify({
        date: new Date().toISOString().slice(0, 10),
        answered,
      }),
    );
  }, [answered]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem(MISTAKES_KEY, JSON.stringify(mistakes));
  }, [mistakes]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setSecondsLeft((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [currentIndex, pool.length]);

  const topMistakes = useMemo(() => {
    return Object.entries(mistakes)
      .sort((a, b) => b[1] - a[1])
      .map(([id, count]) => ({
        question: QUIZ_QUESTIONS.find((q) => q.id === id),
        count,
      }))
      .filter((entry) => entry.question)
      .slice(0, 6);
  }, [mistakes]);

  const goToQuestion = (idx: number) => {
    resetForNewQuestion(idx);
  };

  const handleNext = (wasCorrect: boolean) => {
    if (hasAnswered) return;
    if (!currentQuestion) return;
    setHasAnswered(true);
    setAnswered((prev) => prev + 1);
    if (!wasCorrect) {
      setMistakes((prev) => ({
        ...prev,
        [currentQuestion.id]: (prev[currentQuestion.id] || 0) + 1,
      }));
    }
    if (pool.length > 0) {
      const nextIndex = (currentIndex + 1) % pool.length;
      setTimeout(() => goToQuestion(nextIndex), 0);
    }
  };

  const handleRemoveMistake = (id: string) => {
    setMistakes((prev) => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
  };

  const toggleFavorite = () => {
    if (!currentQuestion) return;
    setFavorites((prev) =>
      prev.includes(currentQuestion.id)
        ? prev.filter((id) => id !== currentQuestion.id)
        : [...prev, currentQuestion.id],
    );
  };

  const totalMistakes = Object.values(mistakes).reduce((a, b) => a + b, 0);

  const resetForNewQuestion = (idx: number) => {
    setCurrentIndex(idx);
    setSecondsLeft(5);
    setShowAnswer(false);
    setHasAnswered(false);
  };

  return (
    <main className="space-y-4">
      <header className="space-y-1">
        <p className="text-sm text-muted-foreground">ひなこ専用・ピーク前の5秒訓練</p>
        <h1 className="text-3xl font-semibold tracking-tight">ひなこのスタバ5秒クイズ</h1>
      </header>

      <Card className="border-border-strong/60 bg-card shadow-lg shadow-black/10">
        <CardHeader className="space-y-2">
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Coffee className="h-6 w-6 text-primary" />
            ひなこの反射バリスタ練習帳
          </CardTitle>
          <CardDescription className="text-base text-muted-foreground">
            サイズ別ポンプ数、ショット数、ミルク変更などを5秒で判断する
            100問クイズ。ホーム画面追加でオフラインでも使えます。
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Timer className="h-4 w-4 text-primary" />
              制限時間: 5秒 / 1問
            </div>
            <div className="flex items-center gap-2">
              <Brain className="h-4 w-4 text-primary" />
              出題: {pool.length}問
            </div>
            <div className="flex gap-2 text-xs">
              <ModePill
                active={mode === "all"}
                label="全部"
                onClick={() => {
                  setMode("all");
                  resetForNewQuestion(0);
                }}
              />
              <ModePill
                active={mode === "mistakes"}
                label="ミスのみ"
                disabled={Object.keys(mistakes).length === 0}
                onClick={() => {
                  setMode("mistakes");
                  resetForNewQuestion(0);
                }}
              />
              <ModePill
                active={mode === "favorites"}
                label="マイリスト"
                disabled={favorites.length === 0}
                onClick={() => {
                  setMode("favorites");
                  resetForNewQuestion(0);
                }}
              />
            </div>
          </div>

          <div className="space-y-3 rounded-xl border border-border-strong/70 bg-background/60 p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.08em] text-muted-foreground">
                  {pool.length > 0
                    ? `Q${currentIndex + 1} / ${pool.length}`
                    : "出題なし"}
                </p>
                <p className="text-xl font-semibold leading-snug">
                  {currentQuestion ? currentQuestion.prompt : "出題する問題がありません"}
                </p>
              </div>
              {currentQuestion && (
                <div className="rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary">
                  5秒判断
                </div>
              )}
            </div>

            {currentQuestion ? (
              <>
                <Progress value={(secondsLeft / 5) * 100} className="h-2" />
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>残り {secondsLeft.toString().padStart(2, "0")} 秒</span>
                  <span>
                    回答数 {answered} / ミス {Object.keys(mistakes).length}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {!showAnswer ? (
                    <Button onClick={() => setShowAnswer(true)} className="px-4">
                      答えを見る
                    </Button>
                  ) : (
                    <>
                      <Button
                        variant="default"
                        className="px-4"
                        onClick={() => handleNext(true)}
                      >
                        正解だった
                      </Button>
                      <Button
                        variant="outline"
                        className="px-4"
                        onClick={() => handleNext(false)}
                      >
                        間違えた
                      </Button>
                    </>
                  )}
                  <Button
                    variant="ghost"
                    className="px-3 text-muted-foreground"
                    onClick={() => handleNext(true)}
                  >
                    スキップ
                  </Button>
                  <Button
                    variant={isFavorite ? "secondary" : "outline"}
                    className="px-3"
                    onClick={toggleFavorite}
                  >
                    <Heart className="mr-2 h-4 w-4" />
                    {isFavorite ? "マイリストから外す" : "マイリストに追加"}
                  </Button>
                </div>

                {showAnswer && (
                  <div className="space-y-2 rounded-lg border border-border-strong/70 bg-card/80 p-4">
                    <p className="text-base font-semibold text-foreground">
                      答え: {currentQuestion.answer}
                    </p>
                    {currentQuestion.detail && (
                      <p className="text-sm text-muted-foreground">
                        メモ: {currentQuestion.detail}
                      </p>
                    )}
                  </div>
                )}
              </>
            ) : (
              <div className="rounded-lg border border-dashed border-border-strong/60 p-4 text-sm text-muted-foreground">
                選択したモードに出題可能な問題がありません。モードを変えてください。
              </div>
            )}
          </div>

          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.08em] text-muted-foreground">
              進行度
            </p>
            <Progress value={progressValue} className="h-2" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>
                {pool.length > 0 ? `${currentIndex + 1} / ${pool.length}` : "0 / 0"}
              </span>
              <span>
                あと {pool.length > 0 ? pool.length - (currentIndex + 1) : 0} 問
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-border-strong/60 bg-card/80">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <ListChecks className="h-5 w-5 text-primary" />
              よく間違える問題リスト
            </CardTitle>
            <CardDescription>
              ミス回数の多い順に表示。タップで再挑戦・削除できます。
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {topMistakes.map(({ question, count }) => (
              <div
                key={question?.id}
                className="w-full rounded-lg border border-border-strong/60 bg-background/60 px-3 py-2 text-left transition hover:border-primary/60"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">{question?.prompt}</p>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="shrink-0">
                      ミス {count}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-muted-foreground"
                      onClick={() => {
                        if (!question) return;
                        setMode("mistakes");
                        resetForNewQuestion(0);
                      }}
                    >
                      出題
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-muted-foreground"
                      onClick={() => question && handleRemoveMistake(question.id)}
                    >
                      <Trash2 className="mr-1 h-4 w-4" />
                      削除
                    </Button>
                  </div>
                </div>
                {question?.answer && (
                  <p className="mt-1 text-xs text-muted-foreground">
                    答え: {question.answer}
                  </p>
                )}
              </div>
            ))}
            {topMistakes.length === 0 && (
              <p className="text-sm text-muted-foreground">
                ミス履歴はありません。間違えた問題がここに溜まります。
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="border-border-strong/60 bg-card/80">
          <CardHeader>
            <CardTitle className="text-lg">今日の小目標</CardTitle>
            <CardDescription>
              「間違えた」を5件以内に抑えて、反射レベルを上げよう。
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="rounded-lg border border-border-strong/70 bg-background/60 p-3">
              <div className="flex items-center justify-between text-sm">
                <span>ミス累計</span>
                <Badge variant="outline">{totalMistakes} 件</Badge>
              </div>
              <Progress
                value={Math.min(100, (totalMistakes / 5) * 100)}
                className="mt-2 h-2"
              />
              <p className="mt-1 text-xs text-muted-foreground">
                5件以内に抑えられたらクリア。ミス一覧で個別削除できます。
              </p>
            </div>
            <div className="rounded-lg border border-border-strong/70 bg-background/60 p-3 text-sm text-muted-foreground">
              ・「間違えた」を押した問題はリストに保存されます。<br />
              ・リストから直接再挑戦できます。<br />
              ・ミス履歴は日付に依存せず残ります（個別削除可能）。<br />
              ・マイリストを使うと好きな問題だけ出題できます。
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

function ModePill({
  active,
  label,
  onClick,
  disabled,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "rounded-full border px-3 py-1 transition",
        active
          ? "border-primary bg-primary/20 text-primary"
          : "border-border-strong/70 text-muted-foreground hover:text-foreground",
        disabled && "opacity-50 cursor-not-allowed",
      )}
      aria-pressed={active}
    >
      {label}
    </button>
  );
}
