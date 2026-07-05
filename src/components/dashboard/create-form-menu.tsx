"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Plus, Sparkles, Grid, ChevronDown } from "@mynaui/icons-react";
import { clearDraft } from "@/lib/draft-store";

const OPTIONS = [
  {
    href: "/forms/new?mode=ai",
    icon: Sparkles,
    title: "Buat dengan bantuan Mimir",
    body: "Jelaskan kebutuhanmu, AI menyusun formnya.",
  },
  {
    href: "/forms/new?mode=manual",
    icon: Grid,
    title: "Buat dari nol",
    body: "Rakit sendiri lewat manual builder.",
  },
];

export function CreateFormMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    function handlePointer(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) setIsOpen(false);
    }
    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape") setIsOpen(false);
    }
    document.addEventListener("mousedown", handlePointer);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handlePointer);
      document.removeEventListener("keydown", handleKey);
    };
  }, [isOpen]);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-md bg-brand px-4 text-sm font-medium text-white shadow-[var(--elevation-1)] transition-all duration-150 hover:bg-brand-hover hover:shadow-[var(--elevation-2)] active:scale-[0.98]"
      >
        <Plus className="size-4" />
        Buat Mimir baru
        <ChevronDown className={`size-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div
          role="menu"
          className="absolute right-0 z-50 mt-2 w-80 origin-top-right animate-pop rounded-lg border border-line bg-surface p-1.5 shadow-[var(--elevation-2)]"
        >
          {OPTIONS.map(({ href, icon: Icon, title, body }) => (
            <Link
              key={href}
              href={href}
              onClick={() => {
                clearDraft();
                setIsOpen(false);
              }}
              role="menuitem"
              className="flex cursor-pointer items-start gap-3 rounded-md p-2.5 transition-colors duration-100 hover:bg-overlay"
            >
              <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-brand-subtle text-brand-text">
                <Icon className="size-[18px]" />
              </span>
              <span className="flex flex-col gap-0.5">
                <span className="text-sm font-medium text-ink">{title}</span>
                <span className="text-[13px] leading-snug text-muted">{body}</span>
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
