export type DraftQuestionType =
  | "short_text"
  | "paragraph"
  | "email"
  | "phone"
  | "number"
  | "multiple_choice"
  | "checkbox"
  | "dropdown"
  | "likert"
  | "rating"
  | "date"
  | "file_upload"
  | "signature";

export type LogicOperator =
  | "gt"
  | "gte"
  | "lt"
  | "lte"
  | "eq"
  | "selected"
  | "not_selected"
  | "filled";

export interface LogicRule {
  id: string;
  questionId: string;
  operator: LogicOperator;
  value: string;
}

export interface QuestionLogic {
  combinator: "and" | "or";
  rules: LogicRule[];
}

export interface DraftQuestion {
  id: string;
  type: DraftQuestionType;
  typeLabel: string;
  label: string;
  isRequired: boolean;
  options?: string[];
  scaleHint?: string;
  logic?: QuestionLogic;
}

export interface FormDraft {
  title: string;
  description: string;
  questions: DraftQuestion[];
}

export interface BuilderChatMessage {
  id: string;
  role: "user" | "mimir";
  content: string;
  note?: string;
}

export interface BuilderReply {
  reply: string;
  note?: string;
  draft: FormDraft;
}
