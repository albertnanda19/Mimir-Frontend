"use client";

import { useEffect, useRef } from "react";
import { GitBranch, Sparkles } from "@mynaui/icons-react";
import type { BuilderChatMessage } from "@/types/ai-builder";
import { SUGGESTION_PROMPTS } from "@/lib/ai-builder-dummy";
import { ChatMessageBubble } from "@/components/ai-builder/chat-message-bubble";
import { ChatComposer } from "@/components/ai-builder/chat-composer";

interface ChatPanelProps {
  messages: BuilderChatMessage[];
  isThinking: boolean;
  isBusy: boolean;
  onSend: (prompt: string) => void;
}

export function ChatPanel({ messages, isThinking, isBusy, onSend }: ChatPanelProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isThinking]);

  return (
    <section
      aria-label="Percakapan dengan Mimir"
      className="flex h-[72dvh] min-h-0 flex-col overflow-hidden rounded-xl border border-line bg-surface shadow-[var(--elevation-1)] lg:h-auto"
    >
      <header className="flex items-center gap-3 border-b border-line-subtle px-5 py-3.5">
        <span className="flex size-8 items-center justify-center rounded-md bg-brand text-white shadow-[var(--elevation-1)]">
          <GitBranch className="size-4" />
        </span>
        <div className="flex flex-col">
          <span className="font-display text-[15px] font-medium tracking-[-0.01em] text-ink">Mimir</span>
          <span className="flex items-center gap-1.5 text-xs text-muted">
            <span className={`size-1.5 rounded-full ${isBusy ? "animate-pulse bg-accent" : "bg-success"}`} />
            {isBusy ? "Sedang menyusun form…" : "Siap membantu"}
          </span>
        </div>
      </header>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-5">
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-6 text-center animate-enter">
            <span className="flex size-14 items-center justify-center rounded-2xl bg-brand-subtle text-brand-text">
              <Sparkles className="size-7" />
            </span>
            <div className="flex flex-col gap-1.5">
              <h2 className="font-display text-xl font-semibold tracking-[-0.015em] text-ink">
                Ceritakan form yang kamu butuhkan
              </h2>
              <p className="max-w-sm text-sm leading-relaxed text-muted">
                Tulis dalam bahasa sehari-hari — Mimir menyusun pertanyaan, tipe input, sampai logika kondisionalnya.
              </p>
            </div>
            <div className="flex w-full max-w-md flex-col gap-2">
              {SUGGESTION_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => onSend(prompt)}
                  className="cursor-pointer rounded-lg border border-line bg-subtle px-4 py-3 text-left text-[13px] leading-snug text-muted transition-all duration-150 hover:-translate-y-0.5 hover:border-brand hover:bg-brand-subtle hover:text-brand-text hover:shadow-[var(--elevation-1)]"
                >
                  “{prompt}”
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
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
  );
}
