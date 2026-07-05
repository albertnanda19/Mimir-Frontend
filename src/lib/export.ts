import type { DraftQuestion } from "@/types/ai-builder";
import type { ResponseRow } from "@/lib/responses-data";

const META_HEADERS = ["No", "Waktu masuk", "Durasi"];

function buildTable(questions: DraftQuestion[], rows: ResponseRow[]): string[][] {
  const header = [...META_HEADERS, ...questions.map((question) => question.label)];
  const body = rows.map((row, index) => [
    String(index + 1),
    row.submittedAtLabel,
    row.durationLabel,
    ...questions.map((question) => row.answers[question.id] ?? ""),
  ]);
  return [header, ...body];
}

function csvCell(value: string): string {
  return /[",\n;]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value;
}

export function toCsv(questions: DraftQuestion[], rows: ResponseRow[]): string {
  const table = buildTable(questions, rows);
  return `﻿${table.map((line) => line.map(csvCell).join(",")).join("\r\n")}`;
}

function xmlEscape(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function toExcelXml(title: string, questions: DraftQuestion[], rows: ResponseRow[]): string {
  const table = buildTable(questions, rows);
  const xmlRows = table
    .map(
      (line, index) =>
        `<Row${index === 0 ? ' ss:StyleID="header"' : ""}>${line
          .map((cell) => `<Cell><Data ss:Type="String">${xmlEscape(cell)}</Data></Cell>`)
          .join("")}</Row>`,
    )
    .join("");
  return `<?xml version="1.0" encoding="UTF-8"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">
<Styles><Style ss:ID="header"><Font ss:Bold="1"/></Style></Styles>
<Worksheet ss:Name="${xmlEscape(title.slice(0, 30))}"><Table>${xmlRows}</Table></Worksheet>
</Workbook>`;
}

export function downloadFile(fileName: string, mime: string, content: string): void {
  const url = URL.createObjectURL(new Blob([content], { type: mime }));
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName;
  anchor.click();
  URL.revokeObjectURL(url);
}
