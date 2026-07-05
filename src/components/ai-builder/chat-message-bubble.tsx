import { GitBranch, Sparkles } from "@mynaui/icons-react";
import type { BuilderChatMessage } from "@/types/ai-builder";

export function ChatMessageBubble({ message }: { message: BuilderChatMessage }) {
  if (message.role === "user") {
    return (
      <div className="flex justify-end animate-enter">
        <p className="max-w-[85%] whitespace-pre-line rounded-2xl rounded-br-md bg-brand px-4 py-2.5 text-sm leading-relaxed text-white shadow-[var(--elevation-1)]">
          {message.content}
        </p>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-3 animate-enter">
      <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-md bg-brand text-white shadow-[var(--elevation-1)]">
        <GitBranch className="size-4" />
      </span>
      <div className="flex max-w-[85%] flex-col gap-2">
        <p className="whitespace-pre-line rounded-2xl rounded-tl-md border border-line-subtle bg-subtle px-4 py-2.5 text-sm leading-relaxed text-ink">
          {message.content}
        </p>
        {message.note && (
          <div className="flex items-start gap-2 rounded-lg bg-accent-subtle px-3.5 py-2.5 animate-enter">
            <Sparkles className="mt-0.5 size-4 shrink-0 text-accent-text" />
            <p className="text-[13px] leading-relaxed text-accent-text">
              <span className="font-semibold">Saran Mimir · </span>
              {message.note}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
