/** Offset of item `i` of `n` from the centre, laid out clockwise from the top. */
export function polar(i: number, n: number, radius: number) {
  const a = (i / n) * 2 * Math.PI - Math.PI / 2;
  return {
    x: Math.round(Math.cos(a) * radius * 100) / 100,
    y: Math.round(Math.sin(a) * radius * 100) / 100,
  };
}

/**
 * Which of `n` sectors a point (dx, dy from the centre) lies in, sector 0 centred on the top;
 * `null` inside the `dead` radius, where nothing is aimed at yet.
 */
export function sectorAt(dx: number, dy: number, n: number, dead = 24): number | null {
  if (!n || Math.hypot(dx, dy) < dead) return null;
  const turn = (Math.atan2(dy, dx) + Math.PI / 2 + 2 * Math.PI) % (2 * Math.PI); // 0 at the top, clockwise
  return Math.round((turn / (2 * Math.PI)) * n) % n;
}

/** Centre moved so a circle of `half` px stays `pad` inside a `w` x `h` box. */
export function keepInside(x: number, y: number, half: number, w: number, h: number, pad = 8) {
  const lo = half + pad;
  return {
    x: Math.min(Math.max(x, lo), Math.max(lo, w - lo)),
    y: Math.min(Math.max(y, lo), Math.max(lo, h - lo)),
  };
}
