"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { UserCircle, Logout, ChevronDown } from "@mynaui/icons-react";
import { Avatar } from "@/components/ui/avatar";
import { createClient } from "@/lib/supabase/client";
import type { AppUser } from "@/types/auth";

export function UserMenu({ user }: { user: AppUser }) {
  const router = useRouter();
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

  async function handleSignOut() {
    await createClient().auth.signOut();
    router.replace("/login");
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        className="flex cursor-pointer items-center gap-1.5 rounded-full border border-line bg-surface p-0.5 pr-2 transition-all duration-150 hover:border-line-strong hover:bg-overlay"
      >
        <Avatar name={user.name} className="size-8 text-xs" />
        <ChevronDown
          className={`size-4 text-faint transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div
          role="menu"
          className="absolute right-0 z-50 mt-2 w-60 origin-top-right animate-pop rounded-lg border border-line bg-surface p-1.5 shadow-[var(--elevation-2)]"
        >
          <div className="flex items-center gap-3 px-2.5 py-2">
            <Avatar name={user.name} className="size-10 text-sm" />
            <div className="flex min-w-0 flex-col">
              <span className="truncate text-sm font-medium text-ink">{user.name}</span>
              <span className="truncate text-xs text-faint">{user.email}</span>
            </div>
          </div>

          <div className="my-1 h-px bg-line-subtle" />

          <Link
            href="/profile"
            onClick={() => setIsOpen(false)}
            role="menuitem"
            className="flex cursor-pointer items-center gap-2.5 rounded-md px-2.5 py-2 text-sm font-medium text-muted transition-colors duration-100 hover:bg-overlay hover:text-ink"
          >
            <UserCircle className="size-[18px]" />
            Profil
          </Link>

          <button
            type="button"
            onClick={handleSignOut}
            role="menuitem"
            className="flex w-full cursor-pointer items-center gap-2.5 rounded-md px-2.5 py-2 text-sm font-medium text-muted transition-colors duration-100 hover:bg-danger-subtle hover:text-danger-text"
          >
            <Logout className="size-[18px]" />
            Keluar
          </button>
        </div>
      )}
    </div>
  );
}
