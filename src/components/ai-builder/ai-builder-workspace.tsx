"use client";

import { useEffect, useRef, useState } from "react";
import type { BuilderChatMessage, FormDraft } from "@/types/ai-builder";
import { generateBuilderReply } from "@/lib/ai-builder-dummy";
import { ChatPanel } from "@/components/ai-builder/chat-panel";
import { FormPreviewPanel } from "@/components/ai-builder/form-preview-panel";

export function AiBuilderWorkspace() {
  const [messages, setMessages] = useState<BuilderChatMessage[]>([]);
  const [draft, setDraft] = useState<FormDraft | null>(null);
  const [isThinking, setIsThinking] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const streamRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(
    () => () => {
      if (streamRef.current) clearInterval(streamRef.current);
    },
    [],
  );

  async function handleSend(prompt: string) {
    setMessages((prev) => [...prev, { id: `m_${Date.now()}`, role: "user", content: prompt }]);
    setIsThinking(true);

    const { reply, note, draft: nextDraft } = await generateBuilderReply(prompt, draft);
    const words = reply.split(" ");
    const messageId = `m_${Date.now()}`;

    setIsThinking(false);
    setIsStreaming(true);
    setDraft(nextDraft);
    setMessages((prev) => [...prev, { id: messageId, role: "mimir", content: "" }]);

    let count = 0;
    streamRef.current = setInterval(() => {
      count += 1;
      const isDone = count >= words.length;
      setMessages((prev) =>
        prev.map((message) =>
          message.id === messageId
            ? { ...message, content: words.slice(0, count).join(" "), note: isDone ? note : undefined }
            : message,
        ),
      );
      if (isDone) {
        if (streamRef.current) clearInterval(streamRef.current);
        streamRef.current = null;
        setIsStreaming(false);
      }
    }, 28);
  }

  function handleReorder(from: number, to: number) {
    setDraft((prev) => {
      if (!prev || from === to || to < 0 || to >= prev.questions.length) return prev;
      const questions = [...prev.questions];
      const [moved] = questions.splice(from, 1);
      questions.splice(to, 0, moved);
      return { ...prev, questions };
    });
  }

  return (
    <div className="grid flex-1 gap-4 animate-enter lg:min-h-0 lg:grid-cols-2">
      <ChatPanel
        messages={messages}
        isThinking={isThinking}
        isBusy={isThinking || isStreaming}
        onSend={handleSend}
      />
      <FormPreviewPanel draft={draft} isGenerating={isThinking} onReorder={handleReorder} />
    </div>
  );
}
