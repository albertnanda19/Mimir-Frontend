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

export interface DraftQuestion {
  id: string;
  type: DraftQuestionType;
  typeLabel: string;
  label: string;
  isRequired: boolean;
  options?: string[];
  scaleHint?: string;
  logic?: string;
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
