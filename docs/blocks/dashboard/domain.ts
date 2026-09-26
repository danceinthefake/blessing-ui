export interface Stat {
  label: string;
  value: number;
  /** fractional change vs last period, e.g. 0.12 */
  delta: number;
  format?: "number" | "currency" | "percent";
}

// one fixed locale: the page is rendered at build time and again in the browser, and a locale
// left to the environment would format "18,902" on one and "18.902" on the other
const LOCALE = "ja-JP";
export const fmt = (s: Stat) =>
  s.format === "currency"
    ? new Intl.NumberFormat(LOCALE, { style: "currency", currency: "JPY" }).format(s.value)
    : s.format === "percent"
      ? `${(s.value * 100).toFixed(1)}%`
      : new Intl.NumberFormat(LOCALE).format(s.value);

export const fmtDelta = (d: number) => `${d >= 0 ? "+" : ""}${(d * 100).toFixed(1)}%`;
