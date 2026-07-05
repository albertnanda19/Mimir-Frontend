"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { GitBranch, Sparkles, X } from "@mynaui/icons-react";
import type { BuilderChatMessage } from "@/types/ai-builder";
import { ChatMessageBubble } from "@/components/ai-builder/chat-message-bubble";
import { ChatComposer } from "@/components/ai-builder/chat-composer";

const QUICK_PROMPTS = [
  "Tambahkan pertanyaan email di akhir form",
  "Buatkan kuesioner evaluasi konser musik",
];

interface BuilderChatWidgetProps {
  messages: BuilderChatMessage[];
  isThinking: boolean;
  isBusy: boolean;
  onSend: (prompt: string) => void;
}

export function BuilderChatWidget({ messages, isThinking, isBusy, onSend }: BuilderChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [isOpen, messages, isThinking]);

  return createPortal(
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-3">
      {isOpen && (
        <section
          aria-label="Chat dengan Mimir"
          className="flex h-[min(34rem,calc(100dvh-8rem))] w-[min(24rem,calc(100vw-2.5rem))] origin-bottom-right flex-col overflow-hidden rounded-xl border border-line bg-surface shadow-[var(--elevation-3)] animate-pop"
        >
          <header className="flex items-center justify-between gap-3 border-b border-line-subtle px-4 py-3">
            <div className="flex items-center gap-2.5">
              <span className="flex size-8 items-center justify-center rounded-md bg-brand text-white shadow-[var(--elevation-1)]">
                <GitBranch className="size-4" />
              </span>
              <div className="flex flex-col">
                <span className="font-display text-[15px] font-medium tracking-[-0.01em] text-ink">Mimir</span>
                <span className="flex items-center gap-1.5 text-xs text-muted">
                  <span className={`size-1.5 rounded-full ${isBusy ? "animate-pulse bg-accent" : "bg-success"}`} />
                  {isBusy ? "Sedang menyusun…" : "Siap membantu"}
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Tutup chat"
              className="flex size-8 cursor-pointer items-center justify-center rounded-md text-faint transition-colors duration-150 hover:bg-overlay hover:text-ink"
            >
              <X className="size-[18px]" />
            </button>
          </header>

          <div ref={scrollRef} className="scrollbar-slim flex-1 overflow-y-auto p-4">
            {messages.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center gap-4 text-center animate-enter">
                <span className="flex size-11 items-center justify-center rounded-xl bg-brand-subtle text-brand-text">
                  <Sparkles className="size-5" />
                </span>
                <p className="max-w-[15rem] text-[13px] leading-relaxed text-muted">
                  Minta Mimir mengubah formmu — hasilnya langsung diterapkan ke kanvas.
                </p>
                <div className="flex w-full flex-col gap-1.5">
                  {QUICK_PROMPTS.map((prompt) => (
                    <button
                      key={prompt}
                      type="button"
                      onClick={() => onSend(prompt)}
                      className="cursor-pointer rounded-lg border border-line bg-subtle px-3 py-2 text-left text-xs leading-snug text-muted transition-all duration-150 hover:border-brand hover:bg-brand-subtle hover:text-brand-text"
                    >
                      “{prompt}”
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-3.5">
                {messages.map((message) => (
                  <ChatMessageBubble key={message.id} message={message} />
                ))}
                {isThinking && (
                  <div className="flex items-start gap-3 animate-enter">
                    <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-md bg-brand text-white shadow-[var(--elevation-1)]">
                      <GitBranch className="size-4" />
                    </span>
                    <span className="flex items-center gap-1.5 rounded-2xl rounded-tl-md border border-line-subtle bg-subtle px-4 py-3.5">
                      <span className="size-1.5 animate-bounce rounded-full bg-faint" />
                      <span className="size-1.5 animate-bounce rounded-full bg-faint [animation-delay:120ms]" />
                      <span className="size-1.5 animate-bounce rounded-full bg-faint [animation-delay:240ms]" />
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>

          <ChatComposer isBusy={isBusy} onSend={onSend} />
        </section>
      )}

      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        aria-label={isOpen ? "Tutup chat Mimir" : "Buka chat Mimir"}
        aria-expanded={isOpen}
        className="flex h-12 cursor-pointer items-center gap-2 rounded-full bg-brand px-4 text-sm font-medium text-white shadow-[var(--elevation-3)] transition-all duration-200 ease-[var(--ease-spring)] hover:bg-brand-hover hover:scale-105 active:scale-95"
      >
        {isOpen ? <X className="size-5" /> : <Sparkles className="size-5" />}
        {!isOpen && "Chat Mimir"}
      </button>
    </div>,
    document.body,
  );
}
