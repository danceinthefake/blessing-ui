import { addDays, fromISO, toISO } from "./date";

export interface DayBlock {
  start: string;
  end: string;
  count: number;
}

/** Every day from `a` to `b` inclusive, whichever comes first, as ISO strings. */
export function rangeBetween(a: string, b: string): string[] {
  const [from, to] = a <= b ? [a, b] : [b, a];
  const out: string[] = [];
  for (let d = fromISO(from), end = fromISO(to); d <= end; d = addDays(d, 1)) out.push(toISO(d));
  return out;
}

/** Runs of consecutive days in a set of dates, in order. */
export function blocks(dates: readonly string[]): DayBlock[] {
  const sorted = [...new Set(dates)].sort();
  const out: DayBlock[] = [];
  for (const iso of sorted) {
    const last = out.at(-1);
    if (last && toISO(addDays(fromISO(last.end), 1)) === iso) {
      last.end = iso;
      last.count++;
    } else out.push({ start: iso, end: iso, count: 1 });
  }
  return out;
}

/** `current` with `range` added (`set`) or removed (`clear`), skipping days `ok` refuses; sorted. */
export function applyRange(
  current: readonly string[],
  range: readonly string[],
  mode: "set" | "clear",
  ok: (iso: string) => boolean = () => true,
): string[] {
  const days = new Set(current);
  for (const iso of range) {
    if (!ok(iso)) continue;
    if (mode === "set") days.add(iso);
    else days.delete(iso);
  }
  return [...days].sort();
}
