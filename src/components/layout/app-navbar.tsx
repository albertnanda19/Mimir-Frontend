"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Grid, FileText, ChartLine, Plus } from "@mynaui/icons-react";
import { MimirLogo } from "@/components/brand/mimir-logo";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { UserMenu } from "@/components/layout/user-menu";
import type { AppUser } from "@/types/auth";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: Grid },
  { href: "/forms", label: "Form saya", icon: FileText },
  { href: "/analytics", label: "Analitik", icon: ChartLine },
];

export function AppNavbar({ user }: { user: AppUser | null }) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-line-subtle bg-surface/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-[80rem] items-center justify-between gap-4 px-4 sm:px-8">
        <Link href="/dashboard" className="shrink-0">
          <MimirLogo />
        </Link>

        <nav className="hidden items-center gap-1 rounded-full border border-line bg-subtle p-1 md:flex">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`flex cursor-pointer items-center gap-2 rounded-full px-3.5 py-1.5 text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? "bg-surface text-ink shadow-[var(--elevation-1)]"
                    : "text-muted hover:bg-overlay hover:text-ink"
                }`}
              >
                <Icon className="size-4" />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <Link
            href="/dashboard"
            className="hidden h-9 cursor-pointer items-center gap-1.5 rounded-md bg-brand px-3.5 text-sm font-medium text-white shadow-[var(--elevation-1)] transition-all duration-150 hover:bg-brand-hover hover:shadow-[var(--elevation-2)] active:scale-[0.98] sm:inline-flex"
          >
            <Plus className="size-4" />
            Buat Mimir
          </Link>
          <ThemeToggle />
          {user && <UserMenu user={user} />}
        </div>
      </div>
    </header>
  );
}
