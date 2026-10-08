/** A mark on an image. All numbers are fractions (0–1) of the image, so they survive any size. */
export interface Region {
  id: string;
  x: number;
  y: number;
  /** present on a box, absent on a pin */
  w?: number;
  h?: number;
  label: string;
}

/** the smallest side of a box, as a fraction of the image */
export const MIN_SIDE = 0.02;
export const isBox = (r: Region): r is Region & { w: number; h: number } =>
  r.w != null && r.h != null;
const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));
const round = (n: number) => Math.round(n * 10000) / 10000;

/** The box between two points, kept inside the image. */
export function boxFrom(a: { x: number; y: number }, b: { x: number; y: number }) {
  const x1 = clamp(Math.min(a.x, b.x), 0, 1);
  const y1 = clamp(Math.min(a.y, b.y), 0, 1);
  const x2 = clamp(Math.max(a.x, b.x), 0, 1);
  const y2 = clamp(Math.max(a.y, b.y), 0, 1);
  return { x: round(x1), y: round(y1), w: round(x2 - x1), h: round(y2 - y1) };
}

/** `r` moved by (dx, dy), stopping at the image edges. */
export function moveRegion(r: Region, dx: number, dy: number): Region {
  const w = r.w ?? 0;
  const h = r.h ?? 0;
  return { ...r, x: round(clamp(r.x + dx, 0, 1 - w)), y: round(clamp(r.y + dy, 0, 1 - h)) };
}

/** A box grown by (dw, dh) from its top-left corner; a pin is returned as it is. */
export function resizeRegion(r: Region, dw: number, dh: number): Region {
  if (!isBox(r)) return r;
  return {
    ...r,
    w: round(clamp(r.w + dw, MIN_SIDE, 1 - r.x)),
    h: round(clamp(r.h + dh, MIN_SIDE, 1 - r.y)),
  };
}

/** The first `r1`, `r2`… not already used. */
export function nextId(regions: readonly Region[]): string {
  const used = new Set(regions.map((r) => r.id));
  let n = 1;
  while (used.has(`r${n}`)) n++;
  return `r${n}`;
}
