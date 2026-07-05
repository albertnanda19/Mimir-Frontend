"use client";

interface ToggleSwitchProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export function ToggleSwitch({ label, checked, onChange }: ToggleSwitchProps) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-3 select-none">
      <span className="text-sm font-medium text-ink">{label}</span>
      <span className="relative inline-flex shrink-0">
        <input
          type="checkbox"
          checked={checked}
          onChange={(event) => onChange(event.target.checked)}
          className="peer sr-only"
        />
        <span className="block h-5 w-9 rounded-full bg-line transition-colors duration-200 peer-checked:bg-brand peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-brand after:absolute after:left-0.5 after:top-0.5 after:size-4 after:rounded-full after:bg-white after:shadow-[0_1px_3px_rgba(0,0,0,0.2)] after:transition-transform after:duration-200 after:ease-[var(--ease-spring)] peer-checked:after:translate-x-4" />
      </span>
    </label>
  );
}
