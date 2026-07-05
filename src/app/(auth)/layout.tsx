import type { ReactNode } from "react";
import { AuthBrandPanel } from "@/components/auth/auth-brand-panel";
import { MimirLogo } from "@/components/brand/mimir-logo";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="grid min-h-dvh lg:grid-cols-[1.1fr_1fr]">
      <AuthBrandPanel />
      <main className="relative flex flex-col px-5 py-6 sm:px-8">
        <div className="flex items-center justify-between lg:justify-end">
          <span className="lg:hidden">
            <MimirLogo />
          </span>
          <ThemeToggle />
        </div>
        <div className="flex flex-1 items-center justify-center py-10">
          <div className="w-full max-w-[26rem] animate-enter">{children}</div>
        </div>
      </main>
    </div>
  );
}
