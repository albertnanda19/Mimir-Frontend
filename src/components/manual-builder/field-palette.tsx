"use client";

import type { DraftQuestionType } from "@/types/ai-builder";
import { FIELD_GROUPS, TYPE_ICONS, TYPE_LABELS } from "@/lib/field-types";

interface FieldPaletteProps {
  onAdd: (type: DraftQuestionType) => void;
  onDragStart: (type: DraftQuestionType) => void;
  onDragEnd: () => void;
}

export function FieldPalette({ onAdd, onDragStart, onDragEnd }: FieldPaletteProps) {
  return (
    <aside
      aria-label="Palet komponen pertanyaan"
      className="flex flex-col overflow-hidden rounded-xl border border-line bg-surface shadow-[var(--elevation-1)] lg:h-full"
    >
      <header className="border-b border-line-subtle px-4 py-3">
        <h2 className="font-display text-[15px] font-medium tracking-[-0.01em] text-ink">Komponen</h2>
        <p className="mt-0.5 text-xs leading-snug text-muted">Klik atau seret ke kanvas untuk menambah.</p>
      </header>

      <div className="scrollbar-slim flex-1 overflow-y-auto p-3">
        {FIELD_GROUPS.map((group) => (
          <div key={group.label} className="mb-4 last:mb-0">
            <p className="px-1 pb-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-faint">
              {group.label}
            </p>
            <div className="grid grid-cols-2 gap-1.5 lg:grid-cols-1">
              {group.types.map((type) => {
                const Icon = TYPE_ICONS[type];
                return (
                  <button
                    key={type}
                    type="button"
                    draggable
                    onClick={() => onAdd(type)}
                    onDragStart={(event) => {
                      event.dataTransfer.effectAllowed = "copy";
                      event.dataTransfer.setData("text/plain", `palette:${type}`);
                      onDragStart(type);
                    }}
                    onDragEnd={onDragEnd}
                    className="flex cursor-grab items-center gap-2.5 rounded-md border border-transparent px-2.5 py-2 text-left text-[13px] font-medium text-muted transition-all duration-150 active:cursor-grabbing hover:border-line hover:bg-subtle hover:text-ink hover:shadow-[var(--elevation-1)] active:scale-[0.98]"
                  >
                    <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-overlay text-faint">
                      <Icon className="size-4" />
                    </span>
                    {TYPE_LABELS[type]}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}
