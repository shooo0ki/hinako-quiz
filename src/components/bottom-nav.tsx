"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, ClipboardList, Home, User, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { href: "/", label: "ダッシュボード", icon: Home },
  { href: "/recipes", label: "レシピ", icon: BookOpen },
  { href: "/quiz", label: "クイズ", icon: Zap },
  { href: "/logs", label: "ログ", icon: ClipboardList },
  { href: "/me", label: "自分", icon: User },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-border/80 bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex h-16 max-w-4xl items-center justify-around px-2 pb-[env(safe-area-inset-bottom)]">
        {tabs.map((tab) => {
          const isActive =
            pathname === tab.href ||
            (tab.href !== "/" && pathname.startsWith(`${tab.href}/`));
          const Icon = tab.icon;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 rounded-lg px-3 py-2 text-xs font-medium transition",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground",
              )}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon
                className={cn(
                  "h-5 w-5",
                  isActive ? "text-primary" : "text-muted-foreground",
                )}
              />
              <span className="leading-none">{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
