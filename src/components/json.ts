import type { BlessTreeNode } from "./tree";

export interface JsonNodeOptions {
  /** levels below the root that start open (default 1) */
  openDepth?: number;
  /** children shown per object or array before a "… n more" line (default 100) */
  limit?: number;
  /** longest string shown before it is cut (default 120) */
  maxString?: number;
}

const isObj = (v: unknown): v is Record<string, unknown> => typeof v === "object" && v !== null;

/** One line for a value that has no children: `"text"`, `12`, `true`, `null`. */
export function jsonPreview(v: unknown, maxString = 120): string {
  if (typeof v === "string") {
    const s = v.length > maxString ? `${v.slice(0, maxString)}…` : v;
    return JSON.stringify(s);
  }
  if (typeof v === "bigint") return `${v}n`;
  if (v === undefined) return "undefined";
  if (typeof v === "function" || typeof v === "symbol") return String(v);
  return String(JSON.stringify(v));
}

/** Turns any value into tree nodes: objects and arrays become branches, the rest become leaves. */
export function jsonToNodes(
  value: unknown,
  label = "root",
  opts: JsonNodeOptions = {},
): BlessTreeNode[] {
  const { openDepth = 1, limit = 100, maxString = 120 } = opts;
  const seen = new WeakSet<object>();
  const build = (key: string, v: unknown, depth: number, path: string): BlessTreeNode => {
    if (!isObj(v)) return { id: path, label: `${key}: ${jsonPreview(v, maxString)}` };
    if (seen.has(v)) return { id: path, label: `${key}: [circular]` };
    seen.add(v);
    const isArr = Array.isArray(v);
    const entries = isArr ? v.map((x, i) => [String(i), x] as const) : Object.entries(v);
    const kids = entries.slice(0, limit).map(([k, x]) => build(k, x, depth + 1, `${path}/${k}`));
    if (entries.length > limit)
      kids.push({ id: `${path}/…`, label: `… ${entries.length - limit} more`, disabled: true });
    seen.delete(v); // a value used twice is fine; only a loop back to an ancestor is circular
    const size = isArr ? `[${entries.length}]` : `{${entries.length}}`;
    return {
      id: path,
      label: `${key}: ${size}`,
      children: kids.length ? kids : undefined,
      open: depth < openDepth,
    };
  };
  return [build(label, value, 0, "$")];
}
