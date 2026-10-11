export type RelativeUnit = "second" | "minute" | "hour" | "day" | "month" | "year";

const MIN = 60;
const HOUR = 3600;
const DAY = 86400;
const MONTH = DAY * 30.4375;
const YEAR = DAY * 365.25;

/**
 * Picks the unit and the whole number for `Intl.RelativeTimeFormat`.
 * `seconds` is the signed distance from now: negative is the past.
 */
export function relativeParts(seconds: number): [number, RelativeUnit] {
  const a = Math.abs(seconds);
  const sign = seconds < 0 ? -1 : 1;
  const [n, unit]: [number, RelativeUnit] =
    a < MIN
      ? [a, "second"]
      : a < HOUR
        ? [a / MIN, "minute"]
        : a < DAY
          ? [a / HOUR, "hour"]
          : a < MONTH
            ? [a / DAY, "day"]
            : a < YEAR
              ? [a / MONTH, "month"]
              : [a / YEAR, "year"];
  const whole = Math.round(n);
  return [whole === 0 ? 0 : sign * whole, unit];
}

/** How long to wait before the text can change, in ms. */
export function refreshEvery(seconds: number): number {
  const a = Math.abs(seconds);
  return a < MIN ? 5_000 : a < HOUR ? 30_000 : a < DAY ? 300_000 : 3_600_000;
}

export const toDate = (v: Date | number | string): Date => (v instanceof Date ? v : new Date(v));
