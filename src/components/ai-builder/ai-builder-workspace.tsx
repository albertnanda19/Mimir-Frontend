"use client";

import { useState } from "react";
import type { FormDraft } from "@/types/ai-builder";
import { useBuilderChat } from "@/hooks/use-builder-chat";
import { ChatPanel } from "@/components/ai-builder/chat-panel";
import { FormPreviewPanel } from "@/components/ai-builder/form-preview-panel";

export function AiBuilderWorkspace() {
  const [draft, setDraft] = useState<FormDraft | null>(null);
  const { messages, isThinking, isBusy, send } = useBuilderChat(draft, setDraft);

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
      <ChatPanel messages={messages} isThinking={isThinking} isBusy={isBusy} onSend={send} />
      <FormPreviewPanel draft={draft} isGenerating={isThinking} onReorder={handleReorder} />
    </div>
  );
}
