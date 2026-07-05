import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Spinner } from "@mynaui/icons-react";

type Variant = "solid" | "outline" | "ghost";

const VARIANTS: Record<Variant, string> = {
  solid:
    "bg-brand text-white border border-brand hover:bg-brand-hover hover:border-brand-hover shadow-[var(--elevation-1)] hover:shadow-[var(--elevation-2)]",
  outline:
    "bg-transparent text-ink border border-line hover:bg-brand-subtle hover:border-brand",
  ghost: "bg-transparent text-muted border border-transparent hover:bg-overlay hover:text-ink",
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  isLoading?: boolean;
  leadingIcon?: ReactNode;
  children: ReactNode;
}

export function Button({
  variant = "solid",
  isLoading = false,
  leadingIcon,
  children,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      disabled={disabled || isLoading}
      className={`inline-flex h-11 w-full items-center justify-center gap-2 rounded-md px-5 text-sm font-medium tracking-[-0.01em] transition-all duration-150 ease-[var(--ease-spring)] cursor-pointer select-none active:translate-y-px active:scale-[0.99] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:cursor-not-allowed disabled:opacity-45 disabled:active:translate-y-0 ${VARIANTS[variant]} ${className}`}
    >
      {isLoading ? (
        <Spinner className="size-4 animate-spin" aria-hidden />
      ) : (
        leadingIcon
      )}
      {children}
    </button>
  );
}
