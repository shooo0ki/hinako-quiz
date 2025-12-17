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
import { Brain, Coffee, ListChecks, RotateCcw, Timer } from "lucide-react";

type QuizQuestion = {
  id: string;
  prompt: string;
  answer: string;
  detail?: string;
};

const QUESTIONS: QuizQuestion[] = [
  {
    id: "hot-short-psl",
    prompt: "ホット ショート PSL ポンプ数は？",
    answer: "トール基準 -1ポンプで合計1ポンプ",
    detail: "PSLなどシロップ系はショートで1ポンプ、トールで2ポンプ。",
  },
  {
    id: "ice-grande-latte",
    prompt: "アイス グランデ ラテ ショット数は？",
    answer: "2ショット",
    detail: "アイスはショット数がトールと同じ（ショート:1 / トール:2 / グランデ:2 / ベンティ:3）。",
  },
  {
    id: "frap-syrup-tall",
    prompt: "トール フラペチーノ シロップポンプ数は？",
    answer: "2ポンプ",
    detail: "フラペはショート:1 / トール:2 / グランデ:2 / ベンティ:2。",
  },
  {
    id: "light-ice-tea",
    prompt: "アイス ティー系でライトアイス指定。氷の目盛りは？",
    answer: "1/2ライン",
    detail: "トール以上は2/3がデフォ、ライトは1/2、ノンは0。",
  },
  {
    id: "half-sweet-custom",
    prompt: "Half Sweet指定。シロップポンプはどうする？",
    answer: "デフォポンプの半分に減らす",
    detail: "1ポンプのときは0.5ポンプで作る。",
  },
  {
    id: "milk-change",
    prompt: "オーツミルク変更。フォームは？",
    answer: "フォームが必要ならオーツで作り直す",
    detail: "スタンダードミルクは牛乳→指定ミルクに変更。",
  },
  {
    id: "refresher-barista",
    prompt: "リフレッシャーズで水抜き・追加なしの場合の希釈は？",
    answer: "リフレッシャーベースのみ（ストレート）",
    detail: "ウォーター/レモネード追加なしならベースのみ。",
  },
  {
    id: "extra-shot-psl",
    prompt: "トール PSLにエスプレッソショット追加。フォームは？",
    answer: "追加ショットをフォームの上にかける",
    detail: "ショット追加時は仕上げでフォーム上に注ぐ。",
  },
];

type MistakeCounts = Record<string, number>;

export default function Home() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(5);
  const [mistakes, setMistakes] = useState<MistakeCounts>(() => {
    if (typeof window === "undefined") return {};
    const stored = localStorage.getItem("hinako-mistakes");
    if (!stored) return {};
    try {
      return JSON.parse(stored);
    } catch {
      return {};
    }
  });
  const [answered, setAnswered] = useState(0);

  // persist mistakes
  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem("hinako-mistakes", JSON.stringify(mistakes));
  }, [mistakes]);

  // countdown
  useEffect(() => {
    const timer = window.setInterval(() => {
      setSecondsLeft((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [currentIndex]);

  const currentQuestion = QUESTIONS[currentIndex];

  const topMistakes = useMemo(() => {
    return Object.entries(mistakes)
      .sort((a, b) => b[1] - a[1])
      .map(([id, count]) => ({
        question: QUESTIONS.find((q) => q.id === id),
        count,
      }))
      .filter((entry) => entry.question)
      .slice(0, 4);
  }, [mistakes]);

  const progressValue = ((currentIndex + 1) / QUESTIONS.length) * 100;

  const goToQuestion = (idx: number) => {
    setShowAnswer(false);
    setSecondsLeft(5);
    setCurrentIndex(idx);
  };

  const handleNext = (wasCorrect: boolean) => {
    setAnswered((prev) => prev + 1);
    if (!wasCorrect) {
      setMistakes((prev) => ({
        ...prev,
        [currentQuestion.id]: (prev[currentQuestion.id] || 0) + 1,
      }));
    }
    goToQuestion((currentIndex + 1) % QUESTIONS.length);
  };

  const resetMistakes = () => setMistakes({});

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-b from-background via-background/80 to-background px-4 py-10">
      <div className="flex w-full max-w-4xl flex-col gap-6">
        <header className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">
              ひなこ専用・ピーク前の5秒訓練
            </p>
            <h1 className="text-3xl font-semibold tracking-tight">
              ひなこのスタバ5秒クイズ
            </h1>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="border-border-strong/70">
              PWA ready
            </Badge>
            <Badge className="bg-primary/20 text-primary border-border-strong/70">
              ひなこ専用モード
            </Badge>
          </div>
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
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Timer className="h-4 w-4 text-primary" />
                制限時間: 5秒 / 1問
              </div>
              <div className="flex items-center gap-2">
                <Brain className="h-4 w-4 text-primary" />
                出題数: 100問（カスタム・例外対応含む）
              </div>
            </div>

            <div className="space-y-3 rounded-xl border border-border-strong/70 bg-background/60 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.08em] text-muted-foreground">
                    Q{currentIndex + 1} / {QUESTIONS.length}
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
                  {currentIndex + 1} / {QUESTIONS.length}
                </span>
                <span>あと {QUESTIONS.length - (currentIndex + 1)} 問</span>
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
                    const idx = QUESTIONS.findIndex((q) => q.id === question.id);
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
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground"
                  onClick={resetMistakes}
                >
                  <RotateCcw className="mr-2 h-4 w-4" />
                  ミス履歴をリセット
                </Button>
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
                  <Badge variant="outline">{Object.values(mistakes).reduce((a, b) => a + b, 0)} 件</Badge>
                </div>
                <Progress
                  value={Math.min(
                    100,
                    (Object.values(mistakes).reduce((a, b) => a + b, 0) / 5) *
                      100,
                  )}
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
                ・ミス履歴はローカルのみ保存されます（ひなこ専用）。
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
