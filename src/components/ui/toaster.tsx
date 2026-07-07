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
  { icon: typeof CheckCircle; label: string; accent: string; subtle: string; text: string }
> = {
  success: {
    icon: CheckCircle,
    label: "Berhasil",
    accent: "var(--success-default)",
    subtle: "var(--success-subtle)",
    text: "var(--success-text)",
  },
  error: {
    icon: XCircle,
    label: "Gagal",
    accent: "var(--danger-default)",
    subtle: "var(--danger-subtle)",
    text: "var(--danger-text)",
  },
  warning: {
    icon: DangerTriangle,
    label: "Perhatian",
    accent: "var(--warning-default)",
    subtle: "var(--warning-subtle)",
    text: "var(--warning-text)",
  },
  info: {
    icon: InfoCircle,
    label: "Informasi",
    accent: "var(--brand-default)",
    subtle: "var(--brand-subtle)",
    text: "var(--brand-text)",
  },
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
  const [timerCycle, setTimerCycle] = useState(0);
  const [exitX, setExitX] = useState(0);
  const dragStart = useRef({ x: 0, time: 0 });

  useEffect(() => {
    if (item.exiting || dragging || hovered) return;
    const timer = setTimeout(() => dismissToast(item.id), item.duration);
    return () => clearTimeout(timer);
  }, [item.id, item.duration, item.exiting, dragging, hovered, timerCycle]);

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
      setTimerCycle((cycle) => cycle + 1);
    }
  }

  function handleTransitionEnd(event: React.TransitionEvent<HTMLDivElement>) {
    if (event.target === event.currentTarget && item.exiting) removeToast(item.id);
  }

  const { icon: Icon, label, accent, subtle, text } = VARIANT_STYLES[item.variant];
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
          onPointerLeave={() => {
            setHovered(false);
            setTimerCycle((cycle) => cycle + 1);
          }}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          style={{
            transform: `translateX(${item.exiting ? exitX : dragX}px)`,
            opacity: dragging ? Math.max(1 - Math.abs(dragX) / 240, 0.2) : undefined,
            transition: dragging ? "none" : undefined,
            touchAction: "pan-y",
            background: `linear-gradient(105deg, ${subtle}, var(--bg-surface) 42%)`,
            ["--toast-enter-y" as string]: isTop ? "-16px" : "16px",
          }}
          className={`animate-toast-in group pointer-events-auto relative flex w-full cursor-grab select-none items-center gap-3.5 overflow-hidden rounded-xl bg-surface py-3.5 pl-4 pr-2.5 shadow-[var(--elevation-4)] transition-[transform,opacity] duration-300 ease-[var(--ease-spring)] active:cursor-grabbing ${
            item.exiting ? "opacity-0" : ""
          }`}
        >
          <span
            aria-hidden
            className="absolute inset-y-2.5 left-0 w-[2.5px] rounded-r-full"
            style={{ background: `linear-gradient(to bottom, transparent, ${accent} 30%, ${accent} 70%, transparent)` }}
          />
          <span aria-hidden className="relative flex size-9 shrink-0 items-center justify-center">
            <span
              className="absolute size-[25px] rotate-45 rounded-[7px] border bg-surface"
              style={{ borderColor: accent, backgroundColor: subtle }}
            />
            <Icon className="relative size-[17px]" style={{ color: text }} strokeWidth={2} />
          </span>
          <div className="flex min-w-0 flex-1 flex-col gap-0.5 py-0.5">
            <p
              className="font-display text-[10.5px] font-semibold uppercase tracking-[0.14em]"
              style={{ color: text }}
            >
              {item.title ?? label}
            </p>
            <p className="text-[13px] leading-snug text-ink">{item.message}</p>
          </div>
          <button
            type="button"
            onClick={() => dismissToast(item.id)}
            aria-label="Tutup notifikasi"
            className="flex size-7 shrink-0 cursor-pointer items-center justify-center self-start rounded-md text-faint opacity-0 transition-[color,opacity] duration-150 hover:text-ink focus-visible:opacity-100 group-hover:opacity-100"
          >
            <X className="size-4" />
          </button>
          <span
            aria-hidden
            key={timerCycle}
            className="absolute inset-x-0 bottom-0 h-[2px] origin-left"
            style={{
              background: `linear-gradient(to right, ${accent}, transparent)`,
              animation: `toast-ember ${item.duration}ms linear forwards`,
              animationPlayState: hovered || dragging || item.exiting ? "paused" : "running",
              opacity: 0.75,
            }}
          />
        </div>
      </div>
    </div>
  );
}
