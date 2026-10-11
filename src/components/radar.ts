export interface BlessRadarSeries {
  name: string;
  /** one value per axis, in the order of `axes` */
  values: number[];
  /** a token name (`chart-2`…) or any CSS color. Default: the next chart color. */
  color?: string;
}

export interface Pt {
  x: number;
  y: number;
}

/** The point on spoke `i` of `n`, at `frac` (0 to 1) of the radius. Spoke 0 points up. */
export function spoke(i: number, n: number, frac: number, r: number, c: number): Pt {
  const a = (i / n) * Math.PI * 2 - Math.PI / 2;
  return {
    x: +(c + Math.cos(a) * r * frac).toFixed(2),
    y: +(c + Math.sin(a) * r * frac).toFixed(2),
  };
}

/** A closed path through points. */
export const polygon = (pts: Pt[]) =>
  pts.length ? `M${pts.map((p) => `${p.x} ${p.y}`).join("L")}Z` : "";

/** The scale top: `max` when given, else the biggest value, never below 1. */
export function radarMax(series: BlessRadarSeries[], max?: number): number {
  if (max !== undefined) return max;
  const vals = series.flatMap((s) => s.values.filter(Number.isFinite));
  return Math.max(1, ...vals);
}
