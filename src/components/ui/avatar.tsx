const PALETTE = ["bg-[var(--fjord-600)]", "bg-[var(--ymir-500)]", "bg-[var(--rune-600)]", "bg-[var(--fenrir-500)]", "bg-[var(--iron-600)]"];

function initials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function tone(name: string): string {
  const sum = [...name].reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return PALETTE[sum % PALETTE.length];
}

export function Avatar({ name, className = "size-16 text-xl" }: { name: string; className?: string }) {
  return (
    <span
      className={`inline-flex items-center justify-center rounded-full font-medium text-white ${tone(name)} ${className}`}
    >
      {initials(name)}
    </span>
  );
}
