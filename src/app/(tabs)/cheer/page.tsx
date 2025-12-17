"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";

export default function CheerPage() {
  const [showVideo, setShowVideo] = useState(false);

  return (
    <main className="space-y-4 pb-6">
      <header className="space-y-1">
        <p className="text-sm text-muted-foreground">ひなこ専用・元気チャージ</p>
        <h1 className="text-3xl font-semibold tracking-tight">しんどいときは深呼吸</h1>
      </header>

      <Card className="border-border-strong/70 bg-card/80">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg">元気出る動画</CardTitle>
            <CardDescription>ボタンを押して、ひと息つこう。</CardDescription>
          </div>
          <Button variant="default" className="gap-2" onClick={() => setShowVideo(true)}>
            <Play className="h-4 w-4" />
            見る
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          {showVideo && (
            <div className="overflow-hidden rounded-xl border border-border-strong/70 bg-background/70">
              <video
                src="/hinako-cheer.mp4"
                poster="/hinako-cheer.jpg"
                controls
                playsInline
                className="w-full"
              />
            </div>
          )}
          <p className="text-sm text-muted-foreground">
            動画を再生して、深呼吸しながら少し休もう。自動再生はブラウザで制限されることがあります。
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
