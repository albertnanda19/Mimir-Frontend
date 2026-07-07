export type ToastVariant = "success" | "error" | "warning" | "info";

export interface ToastItem {
  id: number;
  variant: ToastVariant;
  message: string;
  title?: string;
  duration: number;
  exiting: boolean;
}

interface ToastOptions {
  title?: string;
  duration?: number;
}

const MAX_VISIBLE = 3;
const EMPTY: ToastItem[] = [];

let toasts: ToastItem[] = EMPTY;
let nextId = 1;
const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) listener();
}

function push(variant: ToastVariant, message: string, options?: ToastOptions) {
  const active = toasts.filter((t) => !t.exiting);
  if (active.length >= MAX_VISIBLE) dismissToast(active[0].id);
  toasts = [
    ...toasts,
    {
      id: nextId++,
      variant,
      message,
      title: options?.title,
      duration: options?.duration ?? (variant === "error" ? 8000 : 5000),
      exiting: false,
    },
  ];
  emit();
}

export function dismissToast(id: number) {
  toasts = toasts.map((t) => (t.id === id ? { ...t, exiting: true } : t));
  emit();
}

export function removeToast(id: number) {
  toasts = toasts.filter((t) => t.id !== id);
  emit();
}

export function subscribeToasts(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getToasts() {
  return toasts;
}

export function getServerToasts() {
  return EMPTY;
}

export const toast = {
  success: (message: string, options?: ToastOptions) => push("success", message, options),
  error: (message: string, options?: ToastOptions) => push("error", message, options),
  warning: (message: string, options?: ToastOptions) => push("warning", message, options),
  info: (message: string, options?: ToastOptions) => push("info", message, options),
  dismiss: dismissToast,
};
