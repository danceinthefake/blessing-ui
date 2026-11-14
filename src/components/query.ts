export type BlessQueryOp =
  | "eq"
  | "neq"
  | "contains"
  | "starts"
  | "lt"
  | "lte"
  | "gt"
  | "gte"
  | "empty"
  | "notEmpty";

export interface BlessQueryField {
  /** the key in your data */
  name: string;
  label: string;
  /** sets the operators and the value control; default `text` */
  type?: "text" | "number" | "date" | "select";
  /** the choices of a `select` field */
  options?: { value: string; label: string }[];
}
export interface BlessQueryRule {
  field: string;
  op: BlessQueryOp;
  /** the text of the value control: a number or a date stays text, as the input gives it */
  value: string;
}
export interface BlessQueryGroup {
  match: "all" | "any";
  rules: (BlessQueryRule | BlessQueryGroup)[];
}

const OPS: Record<NonNullable<BlessQueryField["type"]>, BlessQueryOp[]> = {
  text: ["eq", "neq", "contains", "starts", "empty", "notEmpty"],
  number: ["eq", "neq", "lt", "lte", "gt", "gte", "empty", "notEmpty"],
  date: ["eq", "neq", "lt", "lte", "gt", "gte", "empty", "notEmpty"],
  select: ["eq", "neq", "empty", "notEmpty"],
};
export const opsFor = (f?: BlessQueryField) => OPS[f?.type ?? "text"];
/** the operators that take no value */
export const noValue = (op: BlessQueryOp) => op === "empty" || op === "notEmpty";
export const isGroup = (r: BlessQueryRule | BlessQueryGroup): r is BlessQueryGroup => "rules" in r;
