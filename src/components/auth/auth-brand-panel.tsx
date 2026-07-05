import { Sparkles } from "@mynaui/icons-react";
import { MimirLogo } from "@/components/brand/mimir-logo";

const INSIGHT_BARS = [
  { label: "Sound system", value: 82 },
  { label: "Artis", value: 91 },
  { label: "Tiket", value: 74 },
  { label: "Venue", value: 63 },
];

export function AuthBrandPanel() {
  return (
    <aside className="relative hidden overflow-hidden bg-[var(--iron-950)] lg:flex lg:flex-col lg:justify-between lg:p-14">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background: "radial-gradient(80% 50% at 20% -5%, rgba(43,106,204,0.28) 0%, transparent 60%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-52 left-[58%] size-[560px] -translate-x-1/2 opacity-40"
        style={{
          background: "repeating-radial-gradient(circle, transparent 0 40px, rgba(122,173,240,0.5) 40px 41px)",
          maskImage: "radial-gradient(circle, #000 34%, transparent 70%)",
          WebkitMaskImage: "radial-gradient(circle, #000 34%, transparent 70%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-40"
        style={{ background: "linear-gradient(to top, rgba(10,11,15,0.9), transparent)" }}
      />

      <div className="relative">
        <MimirLogo onDark />
      </div>

      <div className="relative w-full max-w-[20rem] rounded-2xl border border-white/10 bg-white/[0.04] p-5 shadow-[0_24px_70px_-24px_rgba(0,0,0,0.8)] backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <span className="flex size-6 items-center justify-center rounded-md bg-[var(--fjord-500)]/20 text-[var(--fjord-300)]">
              <Sparkles className="size-3.5" />
            </span>
            <span className="text-sm font-medium text-white/90">Tanya Mimir</span>
          </span>
          <span className="font-mono text-[11px] text-[var(--iron-400)]">baru saja</span>
        </div>

        <p className="mt-4 rounded-lg rounded-tl-sm bg-white/5 px-3 py-2 text-[13px] leading-relaxed text-[var(--iron-200)]">
          Rangkum kepuasan responden per kategori
        </p>

        <div className="mt-4 flex flex-col gap-2.5">
          {INSIGHT_BARS.map(({ label, value }) => (
            <div key={label} className="flex items-center gap-3 text-xs">
              <span className="w-[5.5rem] shrink-0 text-[var(--iron-300)]">{label}</span>
              <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/10">
                <span
                  className="block h-full rounded-full bg-[var(--fjord-400)]"
                  style={{ width: `${value}%` }}
                />
              </span>
              <span className="w-8 text-right font-mono text-[var(--iron-300)]">{value}%</span>
            </div>
          ))}
        </div>
      </div>

      <div className="relative flex flex-col gap-4">
        <h2 className="max-w-[15ch] font-display text-[2.9rem] font-semibold leading-[1.03] tracking-[-0.03em] text-white">
          Dari pertanyaan mentah, jadi keputusan yang jernih.
        </h2>
        <p className="max-w-sm text-[15px] leading-relaxed text-[var(--iron-300)]">
          Rancang form bersama AI, kumpulkan respons, lalu ajak datamu bicara — dalam satu alur
          yang sama.
        </p>
      </div>
    </aside>
  );
}
