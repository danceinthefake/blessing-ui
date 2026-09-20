export interface Stat {
  label: string;
  value: number;
  /** fractional change vs last period, e.g. 0.12 */
  delta: number;
  format?: "number" | "currency" | "percent";
}

export const fmt = (s: Stat) =>
  s.format === "currency"
    ? new Intl.NumberFormat("ja-JP", { style: "currency", currency: "JPY" }).format(s.value)
    : s.format === "percent"
      ? `${(s.value * 100).toFixed(1)}%`
      : new Intl.NumberFormat().format(s.value);

export const fmtDelta = (d: number) => `${d >= 0 ? "+" : ""}${(d * 100).toFixed(1)}%`;
