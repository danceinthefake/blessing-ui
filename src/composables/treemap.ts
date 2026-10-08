export interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface TreemapNode {
  id: string;
  label: string;
  /** a leaf's size; a node with `children` is the sum of them */
  value?: number;
  children?: TreemapNode[];
  /** a token name (`chart-2`, `success`…) or any CSS colour; children inherit it */
  color?: string;
}

export const totalOf = (n: TreemapNode): number =>
  n.children?.length ? n.children.reduce((a, c) => a + totalOf(c), 0) : Math.max(0, n.value ?? 0);

/**
 * Squarified treemap (Bruls, Huijsmans, van Wijk): tiles whose areas are proportional to
 * `values`, kept close to square so they stay readable. Rects come back in the input order.
 */
export function squarify(values: readonly number[], w: number, h: number): Rect[] {
  const none = values.map(() => ({ x: 0, y: 0, w: 0, h: 0 }));
  const total = values.reduce((a, b) => a + Math.max(0, b), 0);
  if (!total || w <= 0 || h <= 0) return none;
  const order = values.map((_, i) => i).sort((a, b) => values[b]! - values[a]!);
  const area = order.map((i) => (Math.max(0, values[i]!) / total) * w * h);
  const out: Rect[] = [...none];
  let rect: Rect = { x: 0, y: 0, w, h };

  const worst = (row: number[], side: number) => {
    const s = row.reduce((a, b) => a + b, 0);
    const lo = Math.min(...row);
    const hi = Math.max(...row);
    return Math.max((side * side * hi) / (s * s), (s * s) / (side * side * lo));
  };
  const place = (start: number, row: number[]) => {
    const s = row.reduce((a, b) => a + b, 0);
    if (rect.w >= rect.h) {
      // a column down the left edge
      const cw = s / rect.h;
      let y = rect.y;
      row.forEach((a, k) => {
        const ch = a / cw;
        out[order[start + k]!] = { x: rect.x, y, w: cw, h: ch };
        y += ch;
      });
      rect = { x: rect.x + cw, y: rect.y, w: rect.w - cw, h: rect.h };
    } else {
      // a row along the top edge
      const rh = s / rect.w;
      let x = rect.x;
      row.forEach((a, k) => {
        const cw = a / rh;
        out[order[start + k]!] = { x, y: rect.y, w: cw, h: rh };
        x += cw;
      });
      rect = { x: rect.x, y: rect.y + rh, w: rect.w, h: rect.h - rh };
    }
  };

  let start = 0;
  let row: number[] = [];
  for (let i = 0; i < area.length; i++) {
    const a = area[i]!;
    if (!a) continue; // a zero-sized tile takes no room and stays at 0,0,0,0
    const side = Math.min(rect.w, rect.h);
    if (!row.length || worst([...row, a], side) <= worst(row, side)) row.push(a);
    else {
      place(start, row);
      start = i;
      row = [a];
    }
  }
  if (row.length) place(start, row);
  return out;
}

/** The tile in direction `dir` from tile `from`: the nearest centre that lies that way. */
export function neighbour(
  rects: readonly Rect[],
  from: number,
  dir: "left" | "right" | "up" | "down",
): number {
  const c = (r: Rect) => ({ x: r.x + r.w / 2, y: r.y + r.h / 2 });
  const o = c(rects[from]!);
  let best = -1;
  let min = Infinity;
  rects.forEach((r, i) => {
    if (i === from || !r.w) return;
    const p = c(r);
    const dx = p.x - o.x;
    const dy = p.y - o.y;
    const along = dir === "left" ? -dx : dir === "right" ? dx : dir === "up" ? -dy : dy;
    if (along <= 0) return;
    const across = dir === "left" || dir === "right" ? Math.abs(dy) : Math.abs(dx);
    const d = along + across * 2; // staying in line matters more than being near
    if (d < min) ((min = d), (best = i));
  });
  return best < 0 ? from : best;
}
