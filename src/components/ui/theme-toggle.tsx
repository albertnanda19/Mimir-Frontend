"use client";

import { Moon, Sun } from "@mynaui/icons-react";
import { useIsDarkTheme } from "@/hooks/use-is-dark-theme";

export function ThemeToggle() {
  const isDark = useIsDarkTheme();

  function handleToggle() {
    const next = isDark ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("mimir.theme", next);
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-label={isDark ? "Mode terang" : "Mode gelap"}
      className="flex size-9 cursor-pointer items-center justify-center rounded-full border border-line bg-surface text-muted transition-all duration-150 hover:border-line-strong hover:bg-overlay hover:text-ink active:scale-90"
    >
      {isDark ? <Sun className="size-[18px]" /> : <Moon className="size-[18px]" />}
    </button>
  );
}
