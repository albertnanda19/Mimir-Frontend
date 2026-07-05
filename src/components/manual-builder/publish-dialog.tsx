"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle, Copy, GitBranch, Send } from "@mynaui/icons-react";
import type { FormDraft } from "@/types/ai-builder";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function toSlug(title: string): string {
  return (
    title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-")
      .slice(0, 48) || "form-baru"
  );
}

interface PublishDialogProps {
  draft: FormDraft;
  onClose: () => void;
}

export function PublishDialog({ draft, onClose }: PublishDialogProps) {
  const [isPublishing, setIsPublishing] = useState(false);
  const [isPublished, setIsPublished] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const link = `https://mimir.app/f/${toSlug(draft.title)}`;
  const logicCount = draft.questions.filter((question) => question.logic).length;
  const requiredCount = draft.questions.filter((question) => question.isRequired).length;

  async function handlePublish() {
    setIsPublishing(true);
    await wait(1200);
    setIsPublishing(false);
    setIsPublished(true);
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(link);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  }

  return (
    <Modal title={isPublished ? "Form terbit" : "Publikasikan form"} onClose={onClose} maxWidthClass="max-w-md">
      {isPublished ? (
        <div className="flex flex-col items-center gap-5 py-2 text-center animate-enter">
          <span className="flex size-14 items-center justify-center rounded-full bg-success-subtle text-success-text">
            <CheckCircle className="size-8" />
          </span>
          <div className="flex flex-col gap-1">
            <h3 className="font-display text-lg font-semibold tracking-[-0.015em] text-ink">
              “{draft.title}” sudah tayang
            </h3>
            <p className="text-sm leading-relaxed text-muted">
              Bagikan tautan ini kepada responden. Data yang masuk langsung muncul di dashboard.
            </p>
          </div>
          <div className="flex w-full items-center gap-2 rounded-lg border border-line bg-subtle p-2 pl-3">
            <span className="flex-1 truncate text-left font-mono text-[13px] text-muted">{link}</span>
            <button
              type="button"
              onClick={handleCopy}
              className={`flex h-8 shrink-0 cursor-pointer items-center gap-1.5 rounded-md px-2.5 text-xs font-medium transition-all duration-150 ${
                isCopied ? "bg-success-subtle text-success-text" : "bg-surface text-muted shadow-[var(--elevation-1)] hover:text-ink"
              }`}
            >
              {isCopied ? <CheckCircle className="size-3.5" /> : <Copy className="size-3.5" />}
              {isCopied ? "Tersalin" : "Salin"}
            </button>
          </div>
          <Link
            href="/dashboard"
            className="inline-flex h-10 w-full cursor-pointer items-center justify-center rounded-md bg-brand text-sm font-medium text-white shadow-[var(--elevation-1)] transition-all duration-150 hover:bg-brand-hover active:scale-[0.98]"
          >
            Kembali ke dashboard
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          <p className="text-sm leading-relaxed text-muted">
            Periksa ringkasan berikut sebelum form dibagikan ke responden.
          </p>
          <div className="flex flex-col gap-2 rounded-lg border border-line bg-subtle p-4">
            <p className="font-display text-[15px] font-medium tracking-[-0.01em] text-ink">{draft.title}</p>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-[13px] text-muted">
              <span>{draft.questions.length} pertanyaan</span>
              <span>{requiredCount} wajib diisi</span>
              {logicCount > 0 && (
                <span className="inline-flex items-center gap-1 text-accent-text">
                  <GitBranch className="size-3.5" />
                  {logicCount} logika kondisional
                </span>
              )}
            </div>
            <p className="mt-1 truncate font-mono text-xs text-faint">{link}</p>
          </div>
          <Button onClick={handlePublish} isLoading={isPublishing} leadingIcon={<Send className="size-4" />}>
            {isPublishing ? "Menerbitkan…" : "Publikasikan sekarang"}
          </Button>
        </div>
      )}
    </Modal>
  );
}
