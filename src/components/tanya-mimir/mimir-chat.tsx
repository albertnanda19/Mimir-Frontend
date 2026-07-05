"use client";

import { useEffect, useRef, useState } from "react";
import { GitBranch, Sparkles } from "@mynaui/icons-react";
import type { FormResponses } from "@/lib/responses-data";
import type { AnalysisMessage } from "@/types/tanya-mimir";
import { analyzeData, ANALYSIS_PROMPTS } from "@/lib/tanya-mimir-dummy";
import { ChatComposer } from "@/components/ai-builder/chat-composer";
import { AnalysisChartCard } from "@/components/tanya-mimir/analysis-chart";
import { CleanupCard, ClusterList, StatsGrid } from "@/components/tanya-mimir/analysis-attachments";

function MimirAvatar() {
  return (
    <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-md bg-brand text-white shadow-[var(--elevation-1)]">
      <GitBranch className="size-4" />
    </span>
  );
}

export function MimirChat({ data }: { data: FormResponses }) {
  const [messages, setMessages] = useState<AnalysisMessage[]>([]);
  const [isThinking, setIsThinking] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const streamRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isBusy = isThinking || isStreaming;

  useEffect(
    () => () => {
      if (streamRef.current) clearInterval(streamRef.current);
    },
    [],
  );

  const messageCountRef = useRef(0);
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const isNewMessage = messages.length !== messageCountRef.current;
    messageCountRef.current = messages.length;
    if (isNewMessage || isThinking) {
      el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
    } else {
      el.scrollTop = el.scrollHeight;
    }
  }, [messages, isThinking]);

  async function handleSend(prompt: string) {
    if (isBusy) return;
    setMessages((prev) => [...prev, { id: crypto.randomUUID(), role: "user", content: prompt }]);
    setIsThinking(true);

    const { reply, ...attachments } = await analyzeData(prompt, data);
    const words = reply.split(" ");
    const messageId = crypto.randomUUID();

    setIsThinking(false);
    setIsStreaming(true);
    setMessages((prev) => [...prev, { id: messageId, role: "mimir", content: "" }]);

    let count = 0;
    streamRef.current = setInterval(() => {
      count += 1;
      const isDone = count >= words.length;
      setMessages((prev) =>
        prev.map((message) =>
          message.id === messageId
            ? {
                ...message,
                content: words.slice(0, count).join(" "),
                ...(isDone ? attachments : {}),
              }
            : message,
        ),
      );
      if (isDone) {
        if (streamRef.current) clearInterval(streamRef.current);
        streamRef.current = null;
        setIsStreaming(false);
      }
    }, 26);
  }

  return (
    <section
      aria-label="Tanya Mimir — analisis data"
      className="flex h-[72dvh] flex-col overflow-hidden rounded-xl border border-line bg-surface shadow-[var(--elevation-1)] animate-enter"
    >
      <header className="flex items-center gap-3 border-b border-line-subtle px-5 py-3.5">
        <MimirAvatar />
        <div className="flex flex-col">
          <span className="font-display text-[15px] font-medium tracking-[-0.01em] text-ink">Tanya Mimir</span>
          <span className="flex items-center gap-1.5 text-xs text-muted">
            <span className={`size-1.5 rounded-full ${isBusy ? "animate-pulse bg-accent" : "bg-success"}`} />
            {isBusy ? "Sedang menganalisis…" : `Terhubung ke ${data.rows.length.toLocaleString("id-ID")} respons`}
          </span>
        </div>
      </header>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-5">
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-6 text-center animate-enter">
            <span className="flex size-14 items-center justify-center rounded-2xl bg-accent-subtle text-accent-text">
              <Sparkles className="size-7" />
            </span>
            <div className="flex flex-col gap-1.5">
              <h2 className="font-display text-xl font-semibold tracking-[-0.015em] text-ink">
                Mengobrol dengan datamu
              </h2>
              <p className="max-w-sm text-sm leading-relaxed text-muted">
                Minta grafik, ringkasan, pengelompokan jawaban teks, sampai pembersihan data — cukup dengan bahasa
                sehari-hari.
              </p>
            </div>
            <div className="flex w-full max-w-md flex-wrap justify-center gap-2">
              {ANALYSIS_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => handleSend(prompt)}
                  className="cursor-pointer rounded-full border border-line bg-subtle px-3.5 py-2 text-[13px] leading-snug text-muted transition-all duration-150 hover:-translate-y-0.5 hover:border-brand hover:bg-brand-subtle hover:text-brand-text hover:shadow-[var(--elevation-1)]"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {messages.map((message) =>
              message.role === "user" ? (
                <div key={message.id} className="flex justify-end animate-enter">
                  <p className="max-w-[85%] rounded-2xl rounded-br-md bg-brand px-4 py-2.5 text-sm leading-relaxed text-white shadow-[var(--elevation-1)]">
                    {message.content}
                  </p>
                </div>
              ) : (
                <div key={message.id} className="flex items-start gap-3 animate-enter">
                  <MimirAvatar />
                  <div className="flex w-full max-w-[85%] flex-col gap-3">
                    <p className="w-fit whitespace-pre-line rounded-2xl rounded-tl-md border border-line-subtle bg-subtle px-4 py-2.5 text-sm leading-relaxed text-ink">
                      {message.content}
                    </p>
                    {message.chart && <AnalysisChartCard chart={message.chart} />}
                    {message.stats && <StatsGrid stats={message.stats} />}
                    {message.clusters && <ClusterList clusters={message.clusters} />}
                    {message.cleanup && <CleanupCard cleanup={message.cleanup} />}
                  </div>
                </div>
              ),
            )}
            {isThinking && (
              <div className="flex items-start gap-3 animate-enter">
                <MimirAvatar />
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

      <ChatComposer isBusy={isBusy} onSend={handleSend} placeholder="Tanyakan apa saja tentang datamu…" />
    </section>
  );
}
