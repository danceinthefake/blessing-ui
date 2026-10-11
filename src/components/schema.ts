/**
 * The part of Standard Schema (https://standardschema.dev) that a form needs. Zod, Valibot,
 * ArkType, and others implement it, so none of them is a dependency of this library.
 */
export interface BlessSchema<Out = unknown> {
  readonly "~standard": {
    validate(value: unknown): BlessSchemaResult<Out> | Promise<BlessSchemaResult<Out>>;
  };
}

export type BlessSchemaResult<Out> =
  | { readonly value: Out; readonly issues?: undefined }
  | { readonly issues: ReadonlyArray<BlessIssue> };

export interface BlessIssue {
  readonly message: string;
  readonly path?: ReadonlyArray<PropertyKey | { readonly key: PropertyKey }>;
}

/** Form data as a plain object. A name that repeats (checkboxes, multiple selects) becomes an array. */
export function formValues(
  data: FormData,
): Record<string, FormDataEntryValue | FormDataEntryValue[]> {
  const out: Record<string, FormDataEntryValue | FormDataEntryValue[]> = {};
  for (const [k, v] of data.entries()) {
    const prev = out[k];
    out[k] = prev === undefined ? v : Array.isArray(prev) ? [...prev, v] : [prev, v];
  }
  return out;
}

/**
 * Issues as one message per field, keyed by the first step of the path (the `name` of the control).
 * An issue with no path is keyed `""`: it belongs to the whole form. The first message wins.
 */
export function issuesToErrors(issues: ReadonlyArray<BlessIssue>): Record<string, string> {
  const out: Record<string, string> = {};
  for (const i of issues) {
    const first = i.path?.[0];
    const key = first === undefined ? "" : String(typeof first === "object" ? first.key : first);
    out[key] ??= i.message;
  }
  return out;
}
