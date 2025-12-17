import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck } from "lucide-react";

export default function MePage() {
  return (
    <main className="space-y-4">
      <header className="space-y-1">
        <p className="text-sm text-muted-foreground">ひなこ専用・設定</p>
        <h1 className="text-3xl font-semibold tracking-tight">自分の設定</h1>
      </header>

      <Card className="border-border-strong/70 bg-card/80">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <ShieldCheck className="h-5 w-5 text-primary" />
            個人用アプリ
          </CardTitle>
          <CardDescription>オフライン利用・ローカル保存のみ</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>今後ここにテーマ切替、データエクスポートなどを追加できます。</p>
        </CardContent>
      </Card>
    </main>
  );
}
