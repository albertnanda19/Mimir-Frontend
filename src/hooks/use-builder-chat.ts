"use client";

import { useEffect, useRef, useState } from "react";
import type { BuilderChatMessage, FormDraft } from "@/types/ai-builder";
import { generateBuilderReply } from "@/lib/ai-builder-dummy";

export function useBuilderChat(
  draft: FormDraft | null,
  onDraft: (draft: FormDraft) => void,
) {
  const [messages, setMessages] = useState<BuilderChatMessage[]>([]);
  const [isThinking, setIsThinking] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const streamRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const draftRef = useRef(draft);

  useEffect(() => {
    draftRef.current = draft;
  }, [draft]);

  useEffect(
    () => () => {
      if (streamRef.current) clearInterval(streamRef.current);
    },
    [],
  );

  async function send(prompt: string) {
    setMessages((prev) => [...prev, { id: `m_${Date.now()}`, role: "user", content: prompt }]);
    setIsThinking(true);

    const { reply, note, draft: nextDraft } = await generateBuilderReply(prompt, draftRef.current);
    const words = reply.split(" ");
    const messageId = `m_${Date.now()}`;

    setIsThinking(false);
    setIsStreaming(true);
    onDraft(nextDraft);
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

  return { messages, isThinking, isBusy: isThinking || isStreaming, send };
}
