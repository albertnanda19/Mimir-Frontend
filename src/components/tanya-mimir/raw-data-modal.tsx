"use client";

import type { DraftQuestion } from "@/types/ai-builder";
import type { ResponseRow } from "@/lib/responses-data";
import { Modal } from "@/components/ui/modal";

interface RawDataModalProps {
  title: string;
  rows: ResponseRow[];
  questions: DraftQuestion[];
  onClose: () => void;
}

export function RawDataModal({ title, rows, questions, onClose }: RawDataModalProps) {
  return (
    <Modal title={title} onClose={onClose} maxWidthClass="max-w-4xl">
      <div className="flex flex-col gap-3">
        <p className="text-[13px] text-muted">
          <span className="font-mono text-ink">{rows.length.toLocaleString("id-ID")}</span> respons mentah di
          balik angka ini.
        </p>
        <div className="overflow-hidden rounded-lg border border-line">
          <div className="max-h-[55dvh] overflow-auto">
            <table className="w-full border-collapse text-sm">
              <thead className="sticky top-0 z-10 bg-subtle text-left">
                <tr className="border-b border-line">
                  <th className="whitespace-nowrap px-4 py-2.5 font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-faint">
                    #
                  </th>
                  <th className="whitespace-nowrap px-4 py-2.5 text-xs font-semibold text-muted">Waktu masuk</th>
                  <th className="whitespace-nowrap px-4 py-2.5 text-xs font-semibold text-muted">Durasi</th>
                  {questions.map((question) => (
                    <th
                      key={question.id}
                      className="max-w-52 truncate whitespace-nowrap px-4 py-2.5 text-xs font-semibold text-muted"
                    >
                      {question.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, index) => (
                  <tr
                    key={row.id}
                    className="border-b border-line-subtle transition-colors duration-100 last:border-b-0 hover:bg-overlay"
                  >
                    <td className="whitespace-nowrap px-4 py-2.5 font-mono text-xs text-faint">{index + 1}</td>
                    <td className="whitespace-nowrap px-4 py-2.5 font-mono text-xs text-muted">
                      {row.submittedAtLabel}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2.5 font-mono text-xs text-muted">
                      {row.durationLabel}
                    </td>
                    {questions.map((question) => {
                      const answer = row.answers[question.id];
                      return (
                        <td key={question.id} className="max-w-52 truncate px-4 py-2.5 text-ink">
                          {answer || <span className="text-faint">—</span>}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Modal>
  );
}
