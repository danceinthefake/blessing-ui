import type { BlessTimeEntry } from "blessing-ui";

const HOUR = 3_600_000;
const DAY = 24 * HOUR;

/** one day of the week: the hours, split into normal hours and overtime, and the overtime factor */
export interface Day {
  date: string;
  /** 0 Monday to 6 Sunday */
  weekday: number;
  hours: number;
  regular: number;
  overtime: number;
  /** overtime hours times their multiples, for the pay */
  paid: number;
}

/** the hourly wage: one 173rd of the monthly pay (PP 35/2021) */
export const hourly = (monthly: number) => monthly / 173;

// overtime multiples of PP 35/2021, for a week of 5 days of 8 hours
/** on a work day: the first hour at 1.5 times, each next hour at 2 times */
export const workdayPaid = (h: number) => Math.min(h, 1) * 1.5 + Math.max(0, h - 1) * 2;
/** on a rest day: the first 8 hours at 2 times, the 9th at 3 times, the 10th and 11th at 4 times */
export const restDayPaid = (h: number) =>
  Math.min(h, 8) * 2 + Math.min(Math.max(h - 8, 0), 1) * 3 + Math.min(Math.max(h - 9, 0), 2) * 4;

/** the 7 days from `monday`, with the hours of the entries that start on each day at `offset` minutes from UTC */
export function week(entries: BlessTimeEntry[], monday: string, offset: number): Day[] {
  const start = Date.parse(`${monday}T00:00:00Z`) - offset * 60_000;
  return Array.from({ length: 7 }, (_, weekday) => {
    const from = start + weekday * DAY;
    const hours =
      entries
        .filter((e) => e.start >= from && e.start < from + DAY)
        .reduce((n, e) => n + (e.end - e.start), 0) / HOUR;
    const work = weekday < 5;
    const regular = work ? Math.min(hours, 8) : 0;
    const overtime = hours - regular;
    return {
      date: new Date(from + offset * 60_000).toISOString().slice(0, 10),
      weekday,
      hours,
      regular,
      overtime,
      paid: work ? workdayPaid(overtime) : restDayPaid(overtime),
    };
  });
}

/** the overtime pay of the days, in whole rupiah */
export const overtimePay = (days: Day[], monthly: number) =>
  Math.round(days.reduce((n, d) => n + d.paid, 0) * hourly(monthly));
