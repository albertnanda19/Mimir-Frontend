"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, Check, Search, SearchX } from "@mynaui/icons-react";

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectFieldProps {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  ariaLabel: string;
  searchPlaceholder?: string;
  align?: "left" | "right";
  size?: "sm" | "md";
  className?: string;
}

const TRIGGER_SIZES = {
  sm: "h-8 rounded-full pl-3.5 pr-8 text-xs",
  md: "h-11 rounded-md pl-3 pr-9 text-sm",
};

export function SelectField({
  options,
  value,
  onChange,
  ariaLabel,
  searchPlaceholder = "Cari…",
  align = "left",
  size = "md",
  className = "",
}: SelectFieldProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const selected = options.find((option) => option.value === value);
  const normalizedQuery = query.trim().toLowerCase();
  const visible = options.filter(
    (option) => normalizedQuery === "" || option.label.toLowerCase().includes(normalizedQuery),
  );

  function open() {
    setQuery("");
    setActiveIndex(Math.max(0, options.findIndex((option) => option.value === value)));
    setIsOpen(true);
  }

  function close(shouldRefocus = false) {
    setIsOpen(false);
    if (shouldRefocus) triggerRef.current?.focus();
  }

  function commit(option: SelectOption) {
    onChange(option.value);
    close(true);
  }

  useEffect(() => {
    if (!isOpen) return;
    searchRef.current?.focus();
    function handlePointer(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) setIsOpen(false);
    }
    document.addEventListener("mousedown", handlePointer);
    return () => document.removeEventListener("mousedown", handlePointer);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    listRef.current
      ?.querySelector(`[data-index="${activeIndex}"]`)
      ?.scrollIntoView({ block: "nearest" });
  }, [isOpen, activeIndex]);

  function handleKeyDown(event: React.KeyboardEvent) {
    if (event.key === "Escape") {
      event.preventDefault();
      close(true);
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((index) => Math.min(index + 1, visible.length - 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((index) => Math.max(index - 1, 0));
    } else if (event.key === "Enter") {
      event.preventDefault();
      if (visible[activeIndex]) commit(visible[activeIndex]);
    }
  }

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => (isOpen ? close() : open())}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={ariaLabel}
        className={`flex w-full cursor-pointer items-center border border-line bg-subtle font-medium text-ink outline-none transition-all duration-150 hover:border-line-strong focus-visible:border-brand focus-visible:shadow-[0_0_0_3px_var(--brand-subtle)] ${TRIGGER_SIZES[size]}`}
      >
        <span className="truncate">{selected?.label ?? "Pilih…"}</span>
        <ChevronDown
          className={`absolute right-2.5 top-1/2 size-4 -translate-y-1/2 text-faint transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div
          onKeyDown={handleKeyDown}
          className={`absolute z-50 mt-2 w-64 origin-top animate-pop rounded-lg border border-line bg-surface shadow-[var(--elevation-2)] ${align === "right" ? "right-0" : "left-0"}`}
        >
          <div className="relative border-b border-line-subtle p-2">
            <Search className="pointer-events-none absolute left-4.5 top-1/2 size-4 -translate-y-1/2 text-faint" />
            <input
              ref={searchRef}
              type="text"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setActiveIndex(0);
              }}
              placeholder={searchPlaceholder}
              className="h-9 w-full rounded-md bg-subtle pl-9 pr-3 text-sm text-ink outline-none transition-all duration-150 placeholder:text-faint focus:shadow-[0_0_0_2px_var(--brand-subtle)]"
            />
          </div>

          {visible.length === 0 ? (
            <div className="flex flex-col items-center gap-2 px-4 py-6 text-center">
              <SearchX className="size-5 text-faint" />
              <p className="text-[13px] text-muted">Tidak ada hasil untuk “{query.trim()}”</p>
            </div>
          ) : (
            <ul ref={listRef} role="listbox" aria-label={ariaLabel} className="scrollbar-slim max-h-64 overflow-y-auto p-1.5">
              {visible.map((option, index) => {
                const isSelected = option.value === value;
                return (
                  <li key={option.value} role="option" aria-selected={isSelected} data-index={index}>
                    <button
                      type="button"
                      onClick={() => commit(option)}
                      onMouseEnter={() => setActiveIndex(index)}
                      className={`flex w-full cursor-pointer items-center gap-2 rounded-md px-2.5 py-2 text-left text-sm transition-colors duration-100 ${
                        index === activeIndex ? "bg-overlay text-ink" : "text-muted"
                      } ${isSelected ? "font-medium text-brand-text" : ""}`}
                    >
                      <span className="flex-1 truncate">{option.label}</span>
                      {isSelected && <Check className="size-4 shrink-0 text-brand" />}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
