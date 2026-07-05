import type { FormDraft } from "@/types/ai-builder";

const DRAFT_KEY = "mimir.form-draft";

export function saveDraft(draft: FormDraft): void {
  try {
    sessionStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
  } catch {}
}

export function clearDraft(): void {
  try {
    sessionStorage.removeItem(DRAFT_KEY);
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
