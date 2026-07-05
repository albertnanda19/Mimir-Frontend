import { Sparkles, ChartLine, Globe } from "@mynaui/icons-react";
import { MimirLogo } from "@/components/brand/mimir-logo";

const HIGHLIGHTS = [
  {
    icon: Sparkles,
    title: "Bangun form dari satu kalimat",
    body: "Deskripsikan kebutuhanmu, Mimir menyusun pertanyaan dan logikanya.",
  },
  {
    icon: ChartLine,
    title: "Tanya Mimir soal datamu",
    body: "Minta grafik, ringkasan, dan pengelompokan jawaban lewat percakapan.",
  },
  {
    icon: Globe,
    title: "Respons masuk secara real-time",
    body: "Pantau jawaban baru langsung dari dasbor tanpa perlu menyegarkan.",
  },
];

export function AuthBrandPanel() {
  return (
    <aside className="relative hidden overflow-hidden bg-[var(--iron-900)] lg:flex lg:flex-col lg:justify-between lg:p-12">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          background:
            "radial-gradient(120% 80% at 15% 0%, rgba(43,106,204,0.35) 0%, transparent 55%), radial-gradient(90% 70% at 100% 100%, rgba(204,128,16,0.18) 0%, transparent 50%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.06] [animation:drift_16s_linear_infinite_alternate]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, #fff 0 1px, transparent 1px 40px), repeating-linear-gradient(0deg, #fff 0 1px, transparent 1px 40px)",
        }}
      />

      <div className="relative">
        <MimirLogo onDark />
      </div>

      <div className="relative flex flex-col gap-10">
        <div className="flex flex-col gap-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--fjord-300)]">
            Sumur kebijaksanaan
          </p>
          <h2 className="max-w-md font-display text-[2.75rem] font-semibold leading-[1.05] tracking-[-0.025em] text-white">
            Form pintar, data yang bisa diajak bicara.
          </h2>
        </div>

        <ul className="flex flex-col gap-5">
          {HIGHLIGHTS.map(({ icon: Icon, title, body }) => (
            <li key={title} className="flex gap-3.5">
              <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-md bg-white/10 text-[var(--fjord-300)] ring-1 ring-inset ring-white/10">
                <Icon className="size-[18px]" />
              </span>
              <div className="flex flex-col gap-0.5">
                <p className="text-sm font-medium text-white">{title}</p>
                <p className="text-[13px] leading-relaxed text-[var(--iron-300)]">{body}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <p className="relative font-mono text-xs text-[var(--iron-400)]">
        Yggdrasil · 100% free tier
      </p>
    </aside>
  );
}
