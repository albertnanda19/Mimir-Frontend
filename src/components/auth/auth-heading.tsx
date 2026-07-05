export function AuthHeading({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="flex flex-col gap-2">
      <h1 className="font-display text-[1.75rem] font-semibold tracking-[-0.02em] text-ink">{title}</h1>
      <p className="text-[15px] leading-relaxed text-muted">{subtitle}</p>
    </div>
  );
}
