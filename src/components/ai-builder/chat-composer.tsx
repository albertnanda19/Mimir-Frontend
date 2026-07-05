"use client";

import { useRef, useState } from "react";
import { Send } from "@mynaui/icons-react";

interface ChatComposerProps {
  isBusy: boolean;
  onSend: (prompt: string) => void;
}

export function ChatComposer({ isBusy, onSend }: ChatComposerProps) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const canSend = value.trim().length > 0 && !isBusy;

  function submit() {
    const prompt = value.trim();
    if (!prompt || isBusy) return;
    onSend(prompt);
    setValue("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
  }

  function handleChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
    setValue(event.target.value);
    const el = event.target;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      submit();
    }
  }

  return (
    <div className="border-t border-line-subtle bg-surface p-3">
      <div className="flex items-end gap-2 rounded-lg border border-line bg-subtle p-2 transition-all duration-150 focus-within:border-brand focus-within:shadow-[0_0_0_3px_var(--brand-subtle)]">
        <textarea
          ref={textareaRef}
          rows={1}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Jelaskan form yang ingin kamu buat…"
          aria-label="Instruksi untuk Mimir"
          className="max-h-40 flex-1 resize-none bg-transparent px-2 py-1.5 text-sm leading-relaxed text-ink outline-none placeholder:text-faint"
        />
        <button
          type="button"
          onClick={submit}
          disabled={!canSend}
          aria-label="Kirim instruksi"
          className="flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-md bg-brand text-white shadow-[var(--elevation-1)] transition-all duration-150 hover:bg-brand-hover active:scale-95 disabled:cursor-not-allowed disabled:opacity-45"
        >
          <Send className="size-4" />
        </button>
      </div>
      <p className="mt-2 px-1 text-[11px] text-faint">
        Enter untuk kirim · Shift+Enter untuk baris baru
      </p>
    </div>
  );
}
