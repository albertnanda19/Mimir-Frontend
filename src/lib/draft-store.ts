import type { FormDraft } from "@/types/ai-builder";

const DRAFT_KEY = "mimir.form-draft";
const DRAFT_ID_KEY = "mimir.form-draft-id";
const ARCHIVE_KEY = "mimir.form-drafts";
const ARCHIVE_LIMIT = 20;

export interface ArchivedDraft {
  id: string;
  updatedAt: string;
  draft: FormDraft;
}

function currentDraftId(): string {
  let id = sessionStorage.getItem(DRAFT_ID_KEY);
  if (!id) {
    id = `d_${crypto.randomUUID().slice(0, 8)}`;
    sessionStorage.setItem(DRAFT_ID_KEY, id);
  }
  return id;
}

let archiveTimer: ReturnType<typeof setTimeout> | null = null;
let pendingArchive: FormDraft | null = null;

if (typeof window !== "undefined") {
  window.addEventListener("pagehide", () => {
    if (!pendingArchive) return;
    try {
      writeArchive(pendingArchive);
      pendingArchive = null;
    } catch {}
  });
}

function writeArchive(draft: FormDraft): void {
  const raw = localStorage.getItem(ARCHIVE_KEY);
  const list: ArchivedDraft[] = raw ? (JSON.parse(raw) as ArchivedDraft[]) : [];
  const entry: ArchivedDraft = { id: currentDraftId(), updatedAt: new Date().toISOString(), draft };
  const index = list.findIndex((item) => item.id === entry.id);
  if (index === -1) {
    list.unshift(entry);
  } else {
    list[index] = entry;
  }
  localStorage.setItem(ARCHIVE_KEY, JSON.stringify(list.slice(0, ARCHIVE_LIMIT)));
}

function archiveDraft(draft: FormDraft): void {
  if (draft.questions.length === 0) return;
  pendingArchive = draft;
  if (archiveTimer) clearTimeout(archiveTimer);
  archiveTimer = setTimeout(() => {
    archiveTimer = null;
    try {
      writeArchive(draft);
      pendingArchive = null;
    } catch {}
  }, 500);
}

export function loadArchivedDrafts(): ArchivedDraft[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(ARCHIVE_KEY);
    return raw ? (JSON.parse(raw) as ArchivedDraft[]) : [];
  } catch {
    return [];
  }
}

export function saveDraft(draft: FormDraft): void {
  try {
    sessionStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
    archiveDraft(draft);
  } catch {}
}

export function clearDraft(): void {
  try {
    sessionStorage.removeItem(DRAFT_KEY);
    sessionStorage.removeItem(DRAFT_ID_KEY);
  } catch {}
}

export function loadDraft(): FormDraft | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(DRAFT_KEY);
    return raw ? (JSON.parse(raw) as FormDraft) : null;
  } catch {
    return null;
  }
}
