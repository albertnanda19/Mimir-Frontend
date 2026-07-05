"use client";

import { useEffect, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { X } from "@mynaui/icons-react";

interface ModalProps {
  title: string;
  onClose: () => void;
  children: ReactNode;
  maxWidthClass?: string;
}

export function Modal({ title, onClose, children, maxWidthClass = "max-w-xl" }: ModalProps) {
  useEffect(() => {
    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Tutup dialog"
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-black/50 backdrop-blur-[2px]"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={`relative flex max-h-[85dvh] w-full ${maxWidthClass} flex-col overflow-hidden rounded-xl border border-line bg-surface shadow-[var(--elevation-3)] animate-pop`}
      >
        <header className="flex items-center justify-between gap-3 border-b border-line-subtle px-5 py-3.5">
          <h2 className="font-display text-[15px] font-medium tracking-[-0.01em] text-ink">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup"
            className="flex size-8 cursor-pointer items-center justify-center rounded-md text-faint transition-colors duration-150 hover:bg-overlay hover:text-ink"
          >
            <X className="size-[18px]" />
          </button>
        </header>
        <div className="flex-1 overflow-y-auto p-5">{children}</div>
      </div>
    </div>,
    document.body,
  );
}
