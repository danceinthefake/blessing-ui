import type { BlessIncidentStatus, BlessServiceState, BlessUptimeStatus } from "blessing-ui";

export type Impact = "minor" | "major" | "critical";

/** a part of the service that has its own state, for example "Payments" */
export interface Part {
  id: string;
  name: string;
  description?: string;
  /** the first day that we watched it, `YYYY-MM-DD` */
  since: string;
}

export interface Update {
  status: BlessIncidentStatus;
  /** an ISO time */
  at: string;
  text: string;
}

export interface Incident {
  id: string;
  title: string;
  impact: Impact;
  /** the ids of the parts that it affects */
  parts: string[];
  start: string;
  /** no end: it is open */
  end?: string;
  /** newest first */
  updates: Update[];
}

export interface Maintenance {
  id: string;
  title: string;
  parts: string[];
  start: string;
  end: string;
  text: string;
}

const MIN = 60_000;
const DAY = 86_400_000;
const t = (iso: string) => Date.parse(iso);
const ms = (day: string) => Date.parse(`${day}T00:00:00Z`);
const RANK: Impact[] = ["minor", "major", "critical"];
const STATE: Record<Impact, BlessServiceState> = {
  minor: "degraded",
  major: "partial",
  critical: "major",
};
const hurts = (i: Incident) => i.impact !== "minor";

// ponytail: a fixed offset from UTC, because Jakarta has no clock change. For a zone with one,
// use the two-pass toMoment of the calendar block
/** the day of a moment, `YYYY-MM-DD`, at `offset` minutes from UTC */
export const dayOf = (at: number, offset: number) =>
  new Date(at + offset * MIN).toISOString().slice(0, 10);
const startOf = (day: string, offset: number) => ms(day) - offset * MIN;

/** the state of a part now: the worst open incident on it, or maintenance that runs now */
export function stateOf(
  part: string,
  incidents: Incident[],
  maintenance: Maintenance[],
  now: number,
): BlessServiceState {
  const open = incidents.filter((i) => !i.end && i.parts.includes(part));
  if (open.length)
    return STATE[open.map((i) => i.impact).sort((a, b) => RANK.indexOf(b) - RANK.indexOf(a))[0]];
  const working = maintenance.some(
    (m) => m.parts.includes(part) && t(m.start) <= now && now < t(m.end),
  );
  return working ? "maintenance" : "operational";
}

/** how long in [from, to] a major or critical incident was open on the part; overlaps count once */
function downTime(part: string, incidents: Incident[], from: number, to: number, now: number) {
  const spans = incidents
    .filter((i) => hurts(i) && i.parts.includes(part))
    .map((i) => [Math.max(from, t(i.start)), Math.min(to, i.end ? t(i.end) : now)])
    .filter(([a, b]) => b > a)
    .sort((x, y) => x[0] - y[0]);
  let down = 0;
  let reach = from;
  for (const [a, b] of spans) {
    if (b <= reach) continue;
    down += b - Math.max(a, reach);
    reach = b;
  }
  return down;
}

/** one segment for each of the last `n` days, oldest first */
export function daysOf(
  part: Part,
  incidents: Incident[],
  now: number,
  n: number,
  offset: number,
): { date: string; status: BlessUptimeStatus }[] {
  const today = dayOf(now, offset);
  return Array.from({ length: n }, (_, k) => {
    const date = new Date(ms(today) - (n - 1 - k) * DAY).toISOString().slice(0, 10);
    if (date < part.since) return { date, status: "none" as const };
    const from = startOf(date, offset);
    const to = Math.min(from + DAY, now);
    const hits = incidents.filter(
      (i) => i.parts.includes(part.id) && t(i.start) < to && (i.end ? t(i.end) : now) > from,
    );
    const status = hits.some(hurts) ? "down" : hits.length ? "degraded" : "up";
    return { date, status };
  });
}

/** the share of the last `n` days that the part had no major or critical incident, 0 to 1 */
export function uptime(part: Part, incidents: Incident[], now: number, n: number, offset: number) {
  const today = startOf(dayOf(now, offset), offset);
  const from = Math.max(today - (n - 1) * DAY, startOf(part.since, offset));
  if (now <= from) return 1;
  return 1 - downTime(part.id, incidents, from, now, now) / (now - from);
}

/** the closed incidents of the last `n` days by the day they started, newest first */
export function history(incidents: Incident[], now: number, n: number, offset: number) {
  const first = dayOf(now - (n - 1) * DAY, offset);
  const out = new Map<string, Incident[]>();
  for (const i of [...incidents].sort((a, b) => t(b.start) - t(a.start))) {
    const day = dayOf(t(i.start), offset);
    if (!i.end || day < first) continue;
    out.set(day, [...(out.get(day) ?? []), i]);
  }
  return [...out].map(([date, list]) => ({ date, incidents: list }));
}

/** maintenance that did not end yet, soonest first */
export const planned = (maintenance: Maintenance[], now: number) =>
  maintenance.filter((m) => t(m.end) > now).sort((a, b) => t(a.start) - t(b.start));

export function checkEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) ? "" : "Type an email address.";
}
