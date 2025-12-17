import { BottomNav } from "@/components/bottom-nav";
import type { ReactNode } from "react";

export default function TabsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      <div className="mx-auto w-full max-w-4xl px-4 py-6">{children}</div>
      <BottomNav />
    </div>
  );
}
