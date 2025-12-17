 "use client";

import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RECIPES, type RecipeItem } from "@/data/recipes";
import { cn } from "@/lib/utils";
import { BookOpen, ListTree, Soup } from "lucide-react";

const categories = [
  { key: "Espresso", label: "エスプレッソ" },
  { key: "Frappuccino", label: "フラペチーノ" },
  { key: "Tea", label: "ティー" },
  { key: "Refreshers", label: "リフレッシャーズ" },
  { key: "Others", label: "その他" },
] as const;

export default function RecipesPage() {
  const [category, setCategory] = useState<(typeof categories)[number]["key"]>(
    "Espresso",
  );
  const [selected, setSelected] = useState<RecipeItem | null>(null);

  const filtered = useMemo(() => {
    return RECIPES.filter((r) => r.category === category).sort((a, b) =>
      a.name.localeCompare(b.name, "ja"),
    );
  }, [category]);

  const active = selected ?? filtered[0] ?? null;

  return (
    <main className="space-y-4">
      <header className="space-y-1">
        <p className="text-sm text-muted-foreground">ひなこ専用・レシピ確認</p>
        <h1 className="text-3xl font-semibold tracking-tight">ドリンク一覧</h1>
      </header>

      <div className="flex flex-wrap gap-2">
        {categories.map((c) => (
          <Badge
            key={c.key}
            variant={category === c.key ? "default" : "outline"}
            className={cn(
              "cursor-pointer px-3 py-1 text-sm",
              category === c.key && "bg-primary text-primary-foreground",
            )}
            onClick={() => {
              setCategory(c.key);
              setSelected(null);
            }}
          >
            {c.label}
          </Badge>
        ))}
      </div>

      <div className="grid gap-3 sm:grid-cols-[1.1fr_1.4fr]">
        <Card className="border-border-strong/70 bg-card/80">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <ListTree className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">ドリンクを選ぶ</CardTitle>
            </div>
            <CardDescription className="text-xs">
              2タップでレシピへ
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {filtered.length === 0 && (
              <p className="text-sm text-muted-foreground">
                このカテゴリにはまだ登録がありません。
              </p>
            )}
            <div className="grid gap-2">
              {filtered.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={cn(
                    "flex w-full items-center justify-between rounded-lg border border-border-strong/60 bg-background/60 px-3 py-2 text-left transition hover:border-primary/60",
                    active?.id === item.id && "border-primary/70 bg-primary/5",
                  )}
                  onClick={() => setSelected(item)}
                >
                  <span className="text-sm font-medium">{item.name}</span>
                  <Badge variant="secondary" className="shrink-0">
                    {item.base ? "レシピ" : "基本"}
                  </Badge>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border-strong/70 bg-card/80">
          <CardHeader className="space-y-2">
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">レシピ詳細</CardTitle>
            </div>
            {active ? (
              <CardDescription className="space-y-1 text-sm">
                <p className="font-semibold text-foreground">{active.name}</p>
                <p>{active.base ?? "ベース情報を追加してください。"}</p>
                {active.notes && (
                  <p className="text-xs text-muted-foreground">{active.notes}</p>
                )}
              </CardDescription>
            ) : (
              <CardDescription>ドリンクを選択してください。</CardDescription>
            )}
          </CardHeader>
          <CardContent className="space-y-3">
            {active ? (
              <div className="overflow-hidden rounded-lg border border-border-strong/60">
                <div className="grid grid-cols-4 bg-secondary/40 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  <span>サイズ</span>
                  <span>ショット</span>
                  <span>シロップ</span>
                  <span>ミルク/メモ</span>
                </div>
                <div className="divide-y divide-border-strong/60">
                  {active.sizes.map((size) => (
                    <div
                      key={size.size}
                      className="grid grid-cols-4 items-center px-3 py-3 text-sm"
                    >
                      <span className="font-semibold">{size.size}</span>
                      <span>{size.shots}</span>
                      <span>{size.syrup}</span>
                      <div className="flex flex-col gap-1">
                        <span>{size.milk ?? "-"}</span>
                        {size.notes && (
                          <span className="text-xs text-muted-foreground">
                            {size.notes}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex min-h-[160px] items-center justify-center rounded-lg border border-dashed border-border-strong/60 text-sm text-muted-foreground">
                ドリンクを選んでください
              </div>
            )}

            <div className="rounded-lg border border-border-strong/70 bg-background/60 p-3 text-sm text-muted-foreground">
              <div className="mb-2 flex items-center gap-2 font-semibold text-foreground">
                <Soup className="h-4 w-4 text-primary" />
                カスタム早見
              </div>
              <ul className="space-y-1">
                <li>・ライトアイス: 氷 1/2 ライン / ノンアイス: 0</li>
                <li>・ホイップ抜き: ホイップを外しフォームはそのまま</li>
                <li>・ソース追加: トッピング扱い（モカ/キャラメルなど）</li>
                <li>・Half Sweet: シロップを半分（1ポンプ→0.5）</li>
                <li>・ミルク変更: 指定ミルクでフォームを作り直す</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
