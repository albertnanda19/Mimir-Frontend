"use client";

import { useState, type InputHTMLAttributes, type ReactNode } from "react";
import { Eye, EyeOff } from "@mynaui/icons-react";

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  name: string;
  icon?: ReactNode;
  error?: string;
}

export function TextField({ label, name, icon, error, type = "text", className = "", ...props }: TextFieldProps) {
  const [isRevealed, setIsRevealed] = useState(false);
  const isPassword = type === "password";
  const resolvedType = isPassword && isRevealed ? "text" : type;

  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[13px] font-medium tracking-[-0.01em] text-muted">{label}</span>
      <div className="relative">
        {icon && (
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-faint [&>svg]:size-[18px]">
            {icon}
          </span>
        )}
        <input
          {...props}
          id={name}
          name={name}
          type={resolvedType}
          className={`h-11 w-full rounded-md border bg-surface text-sm text-ink outline-none transition-all duration-150 placeholder:text-faint hover:border-line-strong focus:border-brand focus:shadow-[0_0_0_3px_var(--brand-subtle)] ${icon ? "pl-10" : "pl-3"} ${isPassword ? "pr-11" : "pr-3"} ${error ? "border-danger focus:shadow-[0_0_0_3px_var(--danger-subtle)]" : "border-line"} ${className}`}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setIsRevealed((v) => !v)}
            aria-label={isRevealed ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
            className="absolute right-1 top-1/2 flex size-9 -translate-y-1/2 cursor-pointer items-center justify-center rounded-md text-faint transition-colors duration-150 hover:bg-overlay hover:text-ink"
          >
            {isRevealed ? <EyeOff className="size-[18px]" /> : <Eye className="size-[18px]" />}
          </button>
        )}
      </div>
      {error && <span className="text-xs text-danger-text">{error}</span>}
    </label>
  );
}
