import type { BlessRecurrence, BlessRsvpAnswer } from "blessing-ui";

/** an event as a calendar app stores it: a wall time in the zone it was made in, like iCalendar */
export interface CalEvent {
  id: string;
  title: string;
  /** the first day, `YYYY-MM-DD`, in `zone` */
  date: string;
  /** minutes after midnight in `zone`; none for an all-day event */
  start?: number;
  minutes?: number;
  zone: string;
  repeat?: BlessRecurrence;
  place?: string;
  color?: string;
  going?: { name: string }[];
  answer?: BlessRsvpAnswer;
}

/** one time an event happens, in the zone you look from */
export interface Occurrence {
  id: string;
  event: CalEvent;
  date: string;
  start?: number;
  end?: number;
}

const DAY = 86_400_000;
const ms = (iso: string) => Date.parse(`${iso}T00:00:00Z`);
const iso = (t: number) => new Date(t).toISOString().slice(0, 10);
export const addDays = (d: string, n: number) => iso(ms(d) + n * DAY);
/** 0 Monday to 6 Sunday, as in BlessRecurrence */
const weekday = (d: string) => (new Date(ms(d)).getUTCDay() + 6) % 7;

/** the days in [from, to] that the event happens on, as wall days in its own zone */
export function days(e: CalEvent, from: string, to: string): string[] {
  const r = e.repeat;
  if (!r) return e.date >= from && e.date <= to ? [e.date] : [];
  const last = r.end.type === "until" && r.end.until < to ? r.end.until : to;
  const [y0, m0, d0] = e.date.split("-").map(Number);
  const hits = (d: string) => {
    const [y, m, dd] = d.split("-").map(Number);
    const n = r.interval || 1;
    switch (r.freq) {
      case "daily":
        return Math.round((ms(d) - ms(e.date)) / DAY) % n === 0;
      case "weekly": {
        const weeks = Math.floor((ms(d) - ms(addDays(e.date, -weekday(e.date)))) / (7 * DAY));
        return (
          weeks % n === 0 && (r.days?.length ? r.days : [weekday(e.date)]).includes(weekday(d))
        );
      }
      case "monthly":
        return dd === d0 && ((y - y0) * 12 + m - m0) % n === 0;
      case "yearly":
        return dd === d0 && m === m0 && (y - y0) % n === 0;
    }
  };
  // ponytail: a day-by-day walk from the first day; fine for years of a month view, a jump table if not
  const out: string[] = [];
  let count = 0;
  for (let d = e.date; d <= last; d = addDays(d, 1)) {
    if (!hits(d)) continue;
    if (r.end.type === "count" && ++count > r.end.count) break;
    if (d >= from) out.push(d);
  }
  return out;
}

/** the offset of `zone` from UTC at the moment `t`, in ms */
function offset(zone: string, t: number) {
  const p = Object.fromEntries(
    new Intl.DateTimeFormat("en-US", {
      timeZone: zone,
      hourCycle: "h23",
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    })
      .formatToParts(t)
      .map((x) => [x.type, Number(x.value)]),
  );
  return Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute) - Math.floor(t / 60_000) * 60_000;
}

/** a wall time in a zone as a moment. Two passes, so a day that changes the clock lands right */
export function toMoment(date: string, minutes: number, zone: string) {
  const wall = ms(date) + minutes * 60_000;
  const first = wall - offset(zone, wall);
  return wall - offset(zone, first);
}

/** a moment as a wall day and minutes in a zone */
export function inZone(t: number, zone: string) {
  const local = t + offset(zone, t);
  return { date: iso(local), minutes: Math.round((local % DAY) / 60_000) };
}

/** each time the events happen in [from, to], seen from `zone` */
export function occurrences(events: CalEvent[], from: string, to: string, zone: string) {
  const out: Occurrence[] = [];
  // a day early and late: a zone change can move an event over midnight
  for (const e of events)
    for (const d of days(e, addDays(from, -1), addDays(to, 1))) {
      if (e.start === undefined) {
        if (d >= from && d <= to) out.push({ id: `${e.id}@${d}`, event: e, date: d });
        continue;
      }
      const at = inZone(toMoment(d, e.start, e.zone), zone);
      if (at.date < from || at.date > to) continue;
      out.push({
        id: `${e.id}@${d}`,
        event: e,
        date: at.date,
        start: at.minutes,
        end: Math.min(at.minutes + (e.minutes ?? 60), 24 * 60),
      });
    }
  return out.sort((a, b) => a.date.localeCompare(b.date) || (a.start ?? -1) - (b.start ?? -1));
}

/** the timed events that overlap a new one on its day, seen from `zone` */
export function clashes(next: CalEvent, events: CalEvent[], zone: string) {
  const [mine] = occurrences([next], next.date, next.date, zone);
  if (mine?.start === undefined) return [];
  return occurrences(events, next.date, next.date, zone).filter(
    (o) => o.start !== undefined && o.start < mine.end! && mine.start! < o.end!,
  );
}

const DAY_NAMES = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
/** a rule in words, for example "Every 2 weeks on Thursday" */
export function describe(r: BlessRecurrence) {
  const unit = { daily: "day", weekly: "week", monthly: "month", yearly: "year" }[r.freq];
  const every = r.interval > 1 ? `Every ${r.interval} ${unit}s` : `Every ${unit}`;
  const on =
    r.freq === "weekly" && r.days?.length
      ? r.days.length === 5 && r.days.every((d) => d < 5)
        ? " on weekdays"
        : ` on ${r.days.map((d) => DAY_NAMES[d]).join(", ")}`
      : "";
  const end =
    r.end.type === "count"
      ? `, ${r.end.count} times`
      : r.end.type === "until"
        ? `, until ${r.end.until}`
        : "";
  return every + on + end;
}

/** minutes after midnight as HH:MM */
export const hhmm = (m: number) =>
  `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
