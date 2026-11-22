import type { BlessTicketPriority, BlessTicketStatus } from "blessing-ui";

export interface Message {
  id: string;
  from: string;
  role: "customer" | "agent" | "note";
  /** an ISO time */
  at: string;
  body: string;
}

export interface Ticket {
  id: string;
  number: string;
  subject: string;
  customer: { name: string; email: string };
  priority: BlessTicketPriority;
  status: BlessTicketStatus;
  created: string;
  messages: Message[];
}

/** the open hours of the team: days 0 (Monday) to 6, minutes after midnight, minutes from UTC */
export interface Hours {
  days: number[];
  open: number;
  close: number;
  offset: number;
}

/** the time limits, in open minutes, for each priority */
export const TARGETS: Record<BlessTicketPriority, { reply: number; resolve: number }> = {
  urgent: { reply: 60, resolve: 4 * 60 },
  high: { reply: 4 * 60, resolve: 2 * 8 * 60 },
  normal: { reply: 8 * 60, resolve: 5 * 8 * 60 },
  low: { reply: 2 * 8 * 60, resolve: 10 * 8 * 60 },
};

const MIN = 60_000;
const DAY = 86_400_000;

/** the moment after `minutes` of open hours from `start`; time outside the hours does not count */
export function addOpenMinutes(start: number, minutes: number, h: Hours): number {
  let local = start + h.offset * MIN;
  let left = minutes * MIN;
  // ponytail: a day-by-day walk; at most a few weeks for these limits
  for (;;) {
    const day = Math.floor(local / DAY);
    // 1 January 1970 was a Thursday: day 3 when Monday is 0
    if (h.days.includes((day + 3) % 7)) {
      const from = Math.max(local, day * DAY + h.open * MIN);
      const to = day * DAY + h.close * MIN;
      if (from < to) {
        if (left <= to - from) return from + left - h.offset * MIN;
        left -= to - from;
      }
    }
    local = (day + 1) * DAY;
  }
}

/** the first-reply and resolve deadlines of a ticket, and whether each is met */
export function deadlines(t: Ticket, h: Hours) {
  const start = Date.parse(t.created);
  const target = TARGETS[t.priority];
  return {
    reply: new Date(addOpenMinutes(start, target.reply, h)).toISOString(),
    replied: t.messages.some((m) => m.role === "agent"),
    resolve: new Date(addOpenMinutes(start, target.resolve, h)).toISOString(),
    resolved: t.status === "solved",
  };
}

/** the next deadline that is not met yet, or none */
export function nextDeadline(t: Ticket, h: Hours) {
  const d = deadlines(t, h);
  return !d.replied ? d.reply : !d.resolved ? d.resolve : undefined;
}

/** the queue: the tickets in the view, the nearest unmet deadline first, met ones last */
export function queue(tickets: Ticket[], solved: boolean, h: Hours) {
  const key = (t: Ticket) => nextDeadline(t, h) ?? "~";
  return tickets
    .filter((t) => (t.status === "solved") === solved)
    .sort((a, b) => key(a).localeCompare(key(b)));
}
