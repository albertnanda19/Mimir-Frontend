"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { CheckCircle, XCircle, DangerTriangle, InfoCircle, X } from "@mynaui/icons-react";
import {
  dismissToast,
  getServerToasts,
  getToasts,
  removeToast,
  subscribeToasts,
  type ToastItem,
  type ToastVariant,
} from "@/lib/toast";

type ToastPosition =
  | "top-left"
  | "top-center"
  | "top-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right";

const POSITION_CLASSES: Record<ToastPosition, string> = {
  "top-left": "top-4 left-4 items-start",
  "top-center": "top-4 left-1/2 -translate-x-1/2 items-center",
  "top-right": "top-4 right-4 items-end",
  "bottom-left": "bottom-4 left-4 items-start",
  "bottom-center": "bottom-4 left-1/2 -translate-x-1/2 items-center",
  "bottom-right": "bottom-4 right-4 items-end",
};

const VARIANT_STYLES: Record<
  ToastVariant,
  { icon: typeof CheckCircle; strip: string; chip: string }
> = {
  success: { icon: CheckCircle, strip: "bg-success", chip: "bg-success-subtle text-success-text" },
  error: { icon: XCircle, strip: "bg-danger", chip: "bg-danger-subtle text-danger-text" },
  warning: { icon: DangerTriangle, strip: "bg-warning", chip: "bg-warning-subtle text-warning-text" },
  info: { icon: InfoCircle, strip: "bg-brand", chip: "bg-brand-subtle text-brand-text" },
};

export function Toaster({ position = "bottom-right" }: { position?: ToastPosition }) {
  const toasts = useSyncExternalStore(subscribeToasts, getToasts, getServerToasts);
  if (toasts.length === 0) return null;

  const isTop = position.startsWith("top");
  return (
    <div
      aria-live="polite"
      className={`pointer-events-none fixed z-[60] flex w-[356px] max-w-[calc(100vw-32px)] ${
        isTop ? "flex-col-reverse" : "flex-col"
      } ${POSITION_CLASSES[position]}`}
    >
      {toasts.map((item) => (
        <ToastCard key={item.id} item={item} isTop={isTop} />
      ))}
    </div>
  );
}

function ToastCard({ item, isTop }: { item: ToastItem; isTop: boolean }) {
  const [dragX, setDragX] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [exitX, setExitX] = useState(0);
  const dragStart = useRef({ x: 0, time: 0 });

  useEffect(() => {
    if (item.exiting || dragging || hovered) return;
    const timer = setTimeout(() => dismissToast(item.id), item.duration);
    return () => clearTimeout(timer);
  }, [item.id, item.duration, item.exiting, dragging, hovered]);

  function handlePointerDown(event: React.PointerEvent<HTMLDivElement>) {
    event.currentTarget.setPointerCapture(event.pointerId);
    dragStart.current = { x: event.clientX, time: Date.now() };
    setDragging(true);
  }

  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (!dragging) return;
    setDragX(event.clientX - dragStart.current.x);
  }

  function handlePointerUp() {
    if (!dragging) return;
    setDragging(false);
    const elapsed = Math.max(Date.now() - dragStart.current.time, 1);
    const velocity = Math.abs(dragX) / elapsed;
    if (Math.abs(dragX) > 80 || (Math.abs(dragX) > 24 && velocity > 0.5)) {
      setExitX(Math.sign(dragX) * 400);
      dismissToast(item.id);
    } else {
      setDragX(0);
    }
  }

  function handleTransitionEnd(event: React.TransitionEvent<HTMLDivElement>) {
    if (event.target === event.currentTarget && item.exiting) removeToast(item.id);
  }

  const { icon: Icon, strip, chip } = VARIANT_STYLES[item.variant];
  return (
    <div
      onTransitionEnd={handleTransitionEnd}
      className={`grid w-full transition-[grid-template-rows,opacity] duration-200 ease-[var(--ease-enter)] ${
        item.exiting ? "grid-rows-[0fr] opacity-0" : "grid-rows-[1fr] opacity-100"
      }`}
    >
      <div className={`min-h-0 overflow-hidden ${isTop ? "pb-2.5" : "pt-2.5"}`}>
        <div
          role={item.variant === "error" ? "alert" : "status"}
          onPointerDown={handlePointerDown}
          onPointerEnter={() => setHovered(true)}
          onPointerLeave={() => setHovered(false)}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          style={{
            transform: `translateX(${item.exiting ? exitX : dragX}px)`,
            opacity: dragging ? Math.max(1 - Math.abs(dragX) / 240, 0.2) : undefined,
            transition: dragging ? "none" : undefined,
            touchAction: "pan-y",
            ["--toast-enter-y" as string]: isTop ? "-16px" : "16px",
          }}
          className={`animate-toast-in pointer-events-auto relative flex w-full cursor-grab select-none items-start gap-3 overflow-hidden rounded-lg border border-line bg-surface py-3 pl-4 pr-2.5 shadow-[var(--elevation-3)] transition-[transform,opacity] duration-300 ease-[var(--ease-spring)] active:cursor-grabbing ${
            item.exiting ? "opacity-0" : ""
          }`}
        >
          <span aria-hidden className={`absolute inset-y-0 left-0 w-[3px] ${strip}`} />
          <span className={`mt-px flex size-7 shrink-0 items-center justify-center rounded-md ${chip}`}>
            <Icon className="size-4" />
          </span>
          <div className="flex-1 pt-0.5">
            {item.title && (
              <p className="font-display text-[13.5px] font-medium tracking-[-0.01em] text-ink">
                {item.title}
              </p>
            )}
            <p className="text-[13px] leading-relaxed text-muted">{item.message}</p>
          </div>
          <button
            type="button"
            onClick={() => dismissToast(item.id)}
            aria-label="Tutup notifikasi"
            className="flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-md text-faint transition-colors duration-150 hover:bg-overlay hover:text-ink"
          >
            <X className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
