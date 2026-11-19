import type { BlessDose, BlessSleepSpan, BlessSlot, BlessVital } from "blessing-ui";

export interface Visit {
  title: string;
  date: string;
  /** start, HH:MM */
  start: string;
  minutes: number;
  doctor: { name: string; role: string };
  place: string;
}
export interface Habit {
  id: string;
  name: string;
}
export interface Day {
  vitals: BlessVital[];
  doses: BlessDose[];
  taken: string[];
  sleep: BlessSleepSpan[];
  habits: Habit[];
  done: Record<string, string[]>;
  visit: Visit | null;
}
export type { BlessSlot };

/** "09:30–10:00" from a start and a length */
export function span(start: string, minutes: number) {
  const [h, m] = start.split(":").map(Number);
  const end = h * 60 + m + minutes;
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${start}–${pad(Math.floor(end / 60) % 24)}:${pad(end % 60)}`;
}
