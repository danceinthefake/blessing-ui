// Five-field cron: minute hour day-of-month month day-of-week. Each field takes `*`, numbers,
// ranges `a-b`, lists `a,b`, and steps `*/n` or `a-b/n`. Names such as MON are not read.

const RANGES: [number, number][] = [
  [0, 59],
  [0, 23],
  [1, 31],
  [1, 12],
  [0, 7], // 0 and 7 are both Sunday
];

/** the values one field allows, or null when the text is not valid */
export function cronField(text: string, field: number): Set<number> | null {
  const [lo, hi] = RANGES[field]!;
  const out = new Set<number>();
  for (const part of text.split(",")) {
    const m = /^(\*|(\d+)(?:-(\d+))?)(?:\/(\d+))?$/.exec(part);
    if (!m) return null;
    const step = m[4] ? Number(m[4]) : 1;
    let a = m[1] === "*" ? lo : Number(m[2]);
    // "5/15" means from 5 to the end, as in most cron programs
    let b = m[1] === "*" ? hi : m[3] ? Number(m[3]) : m[4] ? hi : a;
    if (step < 1 || a < lo || b > hi || a > b) return null;
    for (; a <= b; a += step) out.add(field === 4 && a === 7 ? 0 : a);
  }
  return out;
}

/** the next times that match, after `from`; empty when the expression is not valid */
export function blessCronNext(expr: string, from = new Date(), count = 1): Date[] {
  const parts = expr.trim().split(/\s+/);
  if (parts.length !== 5) return [];
  const sets = parts.map((p, i) => cronField(p, i));
  if (sets.some((s) => !s)) return [];
  const [min, hour, dom, mon, dow] = sets as Set<number>[];
  // with both day fields set, a day that matches either one runs, as in Vixie cron
  const domAll = parts[2] === "*";
  const dowAll = parts[4] === "*";
  const dayOk = (d: Date) =>
    domAll && dowAll
      ? true
      : domAll
        ? dow!.has(d.getDay())
        : dowAll
          ? dom!.has(d.getDate())
          : dom!.has(d.getDate()) || dow!.has(d.getDay());

  const out: Date[] = [];
  const t = new Date(from);
  t.setSeconds(0, 0);
  t.setMinutes(t.getMinutes() + 1);
  const end = from.getTime() + 5 * 366 * 864e5; // a 31 February never matches: give up after 5 years
  while (out.length < count && t.getTime() <= end) {
    if (!mon!.has(t.getMonth() + 1)) {
      t.setMonth(t.getMonth() + 1, 1);
      t.setHours(0, 0);
    } else if (!dayOk(t)) {
      t.setDate(t.getDate() + 1);
      t.setHours(0, 0);
    } else if (!hour!.has(t.getHours())) {
      t.setHours(t.getHours() + 1, 0);
    } else if (!min!.has(t.getMinutes())) {
      t.setMinutes(t.getMinutes() + 1);
    } else {
      out.push(new Date(t));
      t.setMinutes(t.getMinutes() + 1);
    }
  }
  return out;
}
