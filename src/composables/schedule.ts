import { addDays, fromISO, toISO } from "./date";

/** An event on one day. `start` and `end` are minutes after midnight, local time, `start < end`. */
export interface ScheduleEvent {
  id: string;
  title: string;
  /** `YYYY-MM-DD` */
  date: string;
  start: number;
  end: number;
}

export const snapTo = (m: number, step: number) => Math.round(m / step) * step;
const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));

/** `540` -> "09:00" (24 h), or the locale's style with `locale`. */
export function fmtTime(minutes: number, locale?: string): string {
  const d = new Date(2000, 0, 1, Math.floor(minutes / 60) % 24, minutes % 60);
  return locale
    ? new Intl.DateTimeFormat(locale, { hour: "numeric", minute: "2-digit" }).format(d)
    : `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

/** The first day of the week (`weekStart` 0 = Sunday, 1 = Monday) that contains `iso`. */
export function weekOf(iso: string, weekStart: 0 | 1): string {
  const d = fromISO(iso);
  return toISO(addDays(d, -((d.getDay() - weekStart + 7) % 7)));
}

/**
 * Side-by-side columns for events that overlap: an event gets a `lane` (0, 1, …) and the number of
 * `lanes` its cluster of overlapping events needs, so each is drawn `1 / lanes` wide.
 */
export function layoutDay(
  events: readonly ScheduleEvent[],
): Map<string, { lane: number; lanes: number }> {
  const out = new Map<string, { lane: number; lanes: number }>();
  const sorted = [...events].sort((a, b) => a.start - b.start || a.end - b.end);
  let cluster: { id: string; lane: number }[] = [];
  let ends: number[] = []; // end of the last event in each lane
  let reach = -Infinity;
  const flush = () => {
    for (const c of cluster) out.set(c.id, { lane: c.lane, lanes: ends.length });
    cluster = [];
    ends = [];
  };
  for (const e of sorted) {
    if (e.start >= reach) flush();
    let lane = ends.findIndex((end) => end <= e.start);
    if (lane < 0) lane = ends.length;
    ends[lane] = e.end;
    cluster.push({ id: e.id, lane });
    reach = Math.max(reach, e.end);
  }
  flush();
  return out;
}

/** `e` shifted by `minutes` and `days`, keeping its length and staying inside [lo, hi]. */
export function moveEvent(
  e: ScheduleEvent,
  minutes: number,
  days: number,
  lo: number,
  hi: number,
): ScheduleEvent {
  const len = e.end - e.start;
  const start = clamp(e.start + minutes, lo, Math.max(lo, hi - len));
  return {
    ...e,
    date: days ? toISO(addDays(fromISO(e.date), days)) : e.date,
    start,
    end: start + len,
  };
}

/** `e` with its end moved by `minutes`: at least `min` long, and not past `hi`. */
export function resizeEvent(
  e: ScheduleEvent,
  minutes: number,
  min: number,
  hi: number,
): ScheduleEvent {
  return { ...e, end: clamp(e.end + minutes, e.start + min, Math.max(e.start + min, hi)) };
}

export function nextEventId(events: readonly ScheduleEvent[]): string {
  const used = new Set(events.map((e) => e.id));
  let n = 1;
  while (used.has(`e${n}`)) n++;
  return `e${n}`;
}
