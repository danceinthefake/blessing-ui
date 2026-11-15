// Shared parts of the plain SVG charts: round axis steps, colors, the measured width, and number text.
import { onBeforeUnmount, onMounted, ref, type Ref } from "vue";

/** Ticks at round steps (1, 2, 2.5, 5 × 10ⁿ) that cover lo..hi. The first and last tick are the axis ends. */
export function niceTicks(lo: number, hi: number, count = 5): number[] {
  if (!Number.isFinite(lo) || !Number.isFinite(hi)) return [0, 1];
  if (lo === hi) [lo, hi] = lo === 0 ? [0, 1] : lo > 0 ? [0, lo] : [lo, 0];
  const raw = (hi - lo) / Math.max(1, count);
  const mag = 10 ** Math.floor(Math.log10(raw));
  const step = [1, 2, 2.5, 5, 10].find((m) => m * mag >= raw)! * mag;
  const start = Math.floor(lo / step) * step;
  const out: number[] = [];
  // the rounding keeps 0.30000000000000004 out of the labels
  for (let v = start; ; v += step) {
    out.push(+v.toPrecision(12));
    if (v >= hi - step * 1e-9) break;
  }
  if (out.length < 2) out.push(+(start + step).toPrecision(12));
  return out;
}

/** Maps a value in the domain to a pixel in the range; a flat domain maps to the middle. */
export const scale =
  ([d0, d1]: [number, number], [r0, r1]: [number, number]) =>
  (v: number) =>
    d1 === d0 ? (r0 + r1) / 2 : r0 + ((v - d0) / (d1 - d0)) * (r1 - r0);

/** A token name (`chart-2`, `success`…) or any CSS color; else the chart colors in order. */
export const chartColor = (c: string | undefined, i: number): string => {
  const v = c ?? `chart-${(i % 5) + 1}`;
  return /^[a-z0-9-]+$/i.test(v) ? `var(--bless-color-${v})` : v;
};

export const numberText = (v: number): string => new Intl.NumberFormat().format(v);

/** The width of an element, measured after mount, so the server and the first client render agree. */
export function useWidth(box: Ref<HTMLElement | undefined>, initial = 640): Ref<number> {
  const width = ref(initial);
  let ro: ResizeObserver | undefined;
  onMounted(() => {
    const read = () => (width.value = box.value?.clientWidth || width.value);
    read();
    if (typeof ResizeObserver === "function" && box.value) {
      ro = new ResizeObserver(read);
      ro.observe(box.value);
    }
  });
  onBeforeUnmount(() => ro?.disconnect());
  return width;
}

/** Linear quantile on sorted values, as most spreadsheets compute it. */
export function quantile(sorted: number[], q: number): number {
  if (!sorted.length) return NaN;
  const at = (sorted.length - 1) * q;
  const i = Math.floor(at);
  return sorted[i]! + (sorted[Math.min(i + 1, sorted.length - 1)]! - sorted[i]!) * (at - i);
}

export interface BoxStats {
  min: number;
  q1: number;
  median: number;
  q3: number;
  max: number;
  /** values more than 1.5 × the box height away from the box */
  outliers: number[];
}

/** The five numbers of a box plot. The whiskers end at the last values inside 1.5 × IQR. */
export function boxStats(values: number[]): BoxStats | undefined {
  const s = values.filter(Number.isFinite).sort((a, b) => a - b);
  if (!s.length) return undefined;
  const q1 = quantile(s, 0.25);
  const q3 = quantile(s, 0.75);
  const fence = 1.5 * (q3 - q1);
  const inside = s.filter((v) => v >= q1 - fence && v <= q3 + fence);
  return {
    min: inside[0]!,
    q1,
    median: quantile(s, 0.5),
    q3,
    max: inside.at(-1)!,
    outliers: s.filter((v) => v < q1 - fence || v > q3 + fence),
  };
}

/** One series of a bar or line chart: `key` names the field in each row. */
export interface BlessChartSeries {
  key: string;
  label?: string;
  /** a token name or any CSS color; default: the chart colors in order */
  color?: string;
}
/** A row of data: the category or x value and one number for each series. */
export type BlessChartRow = Record<string, unknown>;

export interface HistogramBin {
  from: number;
  to: number;
  count: number;
}
/** Values counted in round bins of equal width; a bin holds `from <= v < to`, the last one `v <= to`. */
export function histogramBins(values: number[], count = 10): HistogramBin[] {
  const vs = values.filter(Number.isFinite);
  if (!vs.length) return [];
  let lo = Math.min(...vs);
  let hi = Math.max(...vs);
  if (lo === hi) [lo, hi] = [lo - 0.5, hi + 0.5];
  const edges = niceTicks(lo, hi, count);
  // the edges are round ticks; the last bin also takes a value equal to its end
  const bins = edges.slice(0, -1).map((from, i) => ({ from, to: edges[i + 1]!, count: 0 }));
  for (const v of vs) {
    const i = bins.findIndex((b, k) => v >= b.from && (v < b.to || k === bins.length - 1));
    if (i >= 0) bins[i]!.count++;
  }
  return bins;
}
