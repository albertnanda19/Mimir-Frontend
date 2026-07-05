"use client";

import { useState } from "react";
import { Moon, Sun } from "@mynaui/icons-react";

function currentTheme(): "light" | "dark" {
  if (typeof document === "undefined") return "light";
  return document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">(currentTheme);

  function handleToggle() {
    const next = theme === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("mimir.theme", next);
    setTheme(next);
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-label={theme === "dark" ? "Mode terang" : "Mode gelap"}
      className="flex size-9 cursor-pointer items-center justify-center rounded-full border border-line bg-surface text-muted transition-all duration-150 hover:border-line-strong hover:bg-overlay hover:text-ink active:scale-90"
    >
      {theme === "dark" ? <Sun className="size-[18px]" /> : <Moon className="size-[18px]" />}
    </button>
  );
}
