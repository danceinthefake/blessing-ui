export interface BlessQuestionChoice {
  value: string;
  label: string;
  description?: string;
}

export interface BlessQuestion {
  name: string;
  title: string;
  description?: string;
  type: "single" | "multiple" | "freeform";
  choices?: BlessQuestionChoice[];
  required?: boolean;
  skippable?: boolean;
  placeholder?: string;
}

export type BlessAnswers = Record<string, string | string[] | undefined>;
