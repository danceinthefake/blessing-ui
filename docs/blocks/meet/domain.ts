/** a person in the poll and the cells they are free in, each as `day HH:MM` */
export interface Person {
  id: string;
  name: string;
  free: string[];
}

/** a time that the meeting can take */
export interface Slot {
  day: string;
  /** minutes after midnight */
  start: number;
  end: number;
  free: string[];
  away: string[];
}

export const hhmm = (m: number) =>
  `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;

/** the start of each cell in a day, in minutes after midnight */
export const cells = (from: number, to: number, step: number) =>
  Array.from({ length: ((to - from) * 60) / step }, (_, i) => from * 60 + i * step);

/** how many people are free in each cell: `[time][day]`, for a heatmap */
export function counts(people: Person[], days: string[], times: number[]) {
  const sets = people.map((p) => new Set(p.free));
  return times.map((t) => days.map((d) => sets.filter((s) => s.has(`${d} ${hhmm(t)}`)).length));
}

/**
 * The best times for a meeting of `length` minutes: the most people free for all of it, then the
 * earliest. A time starts at the start of a cell and fits in the day.
 */
export function best(
  people: Person[],
  days: string[],
  times: number[],
  step: number,
  length: number,
  n = 3,
) {
  const need = Math.ceil(length / step);
  const out: Slot[] = [];
  for (const day of days)
    for (let i = 0; i + need <= times.length; i++) {
      const run = times.slice(i, i + need).map((t) => `${day} ${hhmm(t)}`);
      const ok = people.filter((p) => run.every((c) => p.free.includes(c)));
      out.push({
        day,
        start: times[i],
        end: times[i] + length,
        free: ok.map((p) => p.name),
        away: people.filter((p) => !ok.includes(p)).map((p) => p.name),
      });
    }
  // a stable sort keeps the earliest first among equals
  return out
    .filter((s) => s.free.length > 0)
    .sort((a, b) => b.free.length - a.free.length)
    .slice(0, n);
}
