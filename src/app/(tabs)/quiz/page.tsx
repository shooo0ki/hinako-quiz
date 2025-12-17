/* eslint-disable react-hooks/exhaustive-deps */
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
import { Brain, Coffee, ListChecks, RotateCcw, Settings2, Timer } from "lucide-react";

type MistakeCounts = Record<string, number>;

type MistakeState = {
  date: string;
  counts: MistakeCounts;
};

const STORAGE_KEY = "hinako-mistakes-v2";
const QUIZ_PROGRESS_KEY = "hinako-quiz-progress";

export default function QuizPage() {
  const today = new Date().toISOString().slice(0, 10);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(5);
  const [autoTimeoutMiss, setAutoTimeoutMiss] = useState(true);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [answered, setAnswered] = useState(() => {
    if (typeof window === "undefined") return 0;
    const stored = localStorage.getItem(QUIZ_PROGRESS_KEY);
    if (!stored) return 0;
    try {
      const parsed = JSON.parse(stored) as { date: string; answered: number };
      if (parsed.date === today) return parsed.answered || 0;
      return 0;
    } catch {
      return 0;
    }
  });
  const [mistakeState, setMistakeState] = useState<MistakeState>(() => {
    if (typeof window === "undefined") return { date: today, counts: {} };
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return { date: today, counts: {} };
    try {
      const parsed = JSON.parse(stored) as MistakeState;
      if (parsed.date !== today) return { date: today, counts: {} };
      return parsed;
    } catch {
      return { date: today, counts: {} };
    }
  });

  const mistakes = mistakeState.date === today ? mistakeState.counts : {};
  const currentQuestion = QUIZ_QUESTIONS[currentIndex];
  const progressValue = ((currentIndex + 1) / QUIZ_QUESTIONS.length) * 100;

  // persist mistakes
  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ date: today, counts: mistakes }),
    );
  }, [mistakes, today]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem(
      QUIZ_PROGRESS_KEY,
      JSON.stringify({ date: today, answered }),
    );
  }, [answered, today]);

  // reset timer when question changes
  useEffect(() => {
    setSecondsLeft(5);
    setShowAnswer(false);
    setHasAnswered(false);
    const timer = window.setInterval(() => {
      setSecondsLeft((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [currentIndex]);

  // auto-miss on timeout
  useEffect(() => {
    if (!autoTimeoutMiss) return;
    if (secondsLeft === 0 && !hasAnswered) {
      setShowAnswer(true);
      handleNext(false, true);
    }
  }, [secondsLeft, autoTimeoutMiss, hasAnswered]);

  const topMistakes = useMemo(() => {
    return Object.entries(mistakes)
      .sort((a, b) => b[1] - a[1])
      .map(([id, count]) => ({
        question: QUIZ_QUESTIONS.find((q) => q.id === id),
        count,
      }))
      .filter((entry) => entry.question)
      .slice(0, 4);
  }, [mistakes]);

  const goToQuestion = (idx: number) => {
    setCurrentIndex(idx);
  };

  const handleNext = (wasCorrect: boolean, auto = false) => {
    if (hasAnswered && !auto) {
      return;
    }
    setHasAnswered(true);
    setAnswered((prev) => prev + 1);
    if (!wasCorrect) {
      setMistakeState((prev) => {
        const counts = prev.date === today ? prev.counts : {};
        return {
          date: today,
          counts: {
            ...counts,
            [currentQuestion.id]: (counts[currentQuestion.id] || 0) + 1,
          },
        };
      });
    }
    const nextIndex = (currentIndex + 1) % QUIZ_QUESTIONS.length;
    setTimeout(() => goToQuestion(nextIndex), auto ? 400 : 0);
  };

  const resetMistakes = () => setMistakeState({ date: today, counts: {} });

  const totalMistakes = Object.values(mistakes).reduce(
    (a, b) => a + b,
    0,
  );

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
              出題数: 100問（カスタム・例外対応含む）
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="gap-2 text-xs"
              onClick={() => setAutoTimeoutMiss((prev) => !prev)}
            >
              <Settings2 className="h-4 w-4" />
              タイムアウト自動ミス: {autoTimeoutMiss ? "ON" : "OFF"}
            </Button>
          </div>

          <div className="space-y-3 rounded-xl border border-border-strong/70 bg-background/60 p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.08em] text-muted-foreground">
                  Q{currentIndex + 1} / {QUIZ_QUESTIONS.length}
                </p>
                <p className="text-xl font-semibold leading-snug">
                  {currentQuestion.prompt}
                </p>
              </div>
              <div className="rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary">
                5秒判断
              </div>
            </div>

            <Progress value={(secondsLeft / 5) * 100} className="h-2" />
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>残り {secondsLeft.toString().padStart(2, "0")} 秒</span>
              <span>
                回答数 {answered} / 今日のミス {Object.keys(mistakes).length}
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
            </div>

            {showAnswer && (
              <div className="space-y-2 rounded-lg border border-border-strong/70 bg-card/80 p-4">
                <p className="text-sm font-semibold text-primary">
                  答え: {currentQuestion.answer}
                </p>
                {currentQuestion.detail && (
                  <p className="text-sm text-muted-foreground">
                    メモ: {currentQuestion.detail}
                  </p>
                )}
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
                {currentIndex + 1} / {QUIZ_QUESTIONS.length}
              </span>
              <span>あと {QUIZ_QUESTIONS.length - (currentIndex + 1)} 問</span>
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
              ミス回数の多い順に表示。タップで再挑戦できます。
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {topMistakes.length === 0 && (
              <p className="text-sm text-muted-foreground">
                まだ間違いは記録されていません。
              </p>
            )}
            {topMistakes.map(({ question, count }) => (
              <button
                key={question?.id}
                type="button"
                className="w-full rounded-lg border border-border-strong/60 bg-background/60 px-3 py-2 text-left transition hover:border-primary/60"
                onClick={() => {
                  if (!question) return;
                  const idx = QUIZ_QUESTIONS.findIndex((q) => q.id === question.id);
                  if (idx >= 0) {
                    goToQuestion(idx);
                  }
                }}
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">{question?.prompt}</p>
                  <Badge variant="secondary" className="shrink-0">
                    ミス {count}
                  </Badge>
                </div>
                {question?.answer && (
                  <p className="mt-1 text-xs text-muted-foreground">
                    答え: {question.answer}
                  </p>
                )}
              </button>
            ))}
            {topMistakes.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground"
                  onClick={resetMistakes}
                >
                  <RotateCcw className="mr-2 h-4 w-4" />
                  今日のミス履歴をリセット
                </Button>
                <p className="text-xs text-muted-foreground">
                  日付が変わると自動でリセットされます。
                </p>
              </div>
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
                <span>今日のミス累計</span>
                <Badge variant="outline">{totalMistakes} 件</Badge>
              </div>
              <Progress
                value={Math.min(100, (totalMistakes / 5) * 100)}
                className="mt-2 h-2"
              />
              <p className="mt-1 text-xs text-muted-foreground">
                5件以内に抑えられたらクリア。無理しないでリセットもOK。
              </p>
            </div>
            <div className="rounded-lg border border-border-strong/70 bg-background/60 p-3 text-sm text-muted-foreground">
              ・「間違えた」を押した問題はリストに保存されます。
              <br />
              ・リストから直接再挑戦できます。
              <br />
              ・ミス履歴は日付単位で保存されます（ひなこ専用）。
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
