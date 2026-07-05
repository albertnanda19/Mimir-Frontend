import type {
  DraftQuestion,
  DraftQuestionType,
  LogicOperator,
  LogicRule,
  QuestionLogic,
} from "@/types/ai-builder";

export const SCALE_KINDS: DraftQuestionType[] = ["rating", "likert", "number"];
export const CHOICE_KINDS: DraftQuestionType[] = ["multiple_choice", "checkbox", "dropdown"];

export const OPERATOR_LABELS: Record<LogicOperator, string> = {
  gt: "lebih dari",
  gte: "minimal",
  lt: "kurang dari",
  lte: "maksimal",
  eq: "sama dengan",
  selected: "memilih",
  not_selected: "tidak memilih",
  filled: "diisi",
};

export function operatorsFor(type: DraftQuestionType): LogicOperator[] {
  if (SCALE_KINDS.includes(type)) return ["lt", "lte", "eq", "gte", "gt"];
  if (CHOICE_KINDS.includes(type)) return ["selected", "not_selected"];
  return ["filled", "eq"];
}

export function needsValue(operator: LogicOperator): boolean {
  return operator !== "filled";
}

export function createRule(source: DraftQuestion): LogicRule {
  return {
    id: `r_${crypto.randomUUID().slice(0, 8)}`,
    questionId: source.id,
    operator: operatorsFor(source.type)[0],
    value: CHOICE_KINDS.includes(source.type) ? (source.options?.[0] ?? "") : "",
  };
}

function truncate(label: string): string {
  return label.length > 42 ? `${label.slice(0, 42).trimEnd()}…` : label;
}

export function formatLogic(
  logic: QuestionLogic | undefined,
  questions: DraftQuestion[],
): string | null {
  if (!logic || !Array.isArray(logic.rules) || logic.rules.length === 0) return null;
  const parts = logic.rules
    .map((rule) => {
      const source = questions.find((question) => question.id === rule.questionId);
      if (!source) return null;
      const value = needsValue(rule.operator) && rule.value ? ` ${rule.value}` : "";
      return `“${truncate(source.label)}” ${OPERATOR_LABELS[rule.operator]}${value}`;
    })
    .filter((part): part is string => part !== null);
  if (parts.length === 0) return null;
  return `Tampil jika ${parts.join(logic.combinator === "and" ? " dan " : " atau ")}`;
}
