/** A crop box as fractions (0..1) of the displayed image: left, top, right, bottom. */
export interface CropBox {
  l: number;
  t: number;
  r: number;
  b: number;
}

export const MIN = 0.05;
const clamp = (v: number, lo: number, hi: number) => Math.min(Math.max(v, lo), hi);

/**
 * Largest centred box covering `fill` of the image. `ratio` is width / height in fractions
 * (pixel aspect × image height / image width); 0 means free.
 */
export function initialBox(ratio: number, fill = 0.9): CropBox {
  let w = fill;
  let h = fill;
  if (ratio > 0) ratio > 1 ? (h = w / ratio) : (w = h * ratio);
  return { l: (1 - w) / 2, t: (1 - h) / 2, r: (1 + w) / 2, b: (1 + h) / 2 };
}

/** Shift the whole box by (dx, dy) fractions, stopping at the image edge. */
export function moveBox(box: CropBox, dx: number, dy: number): CropBox {
  const w = box.r - box.l;
  const h = box.b - box.t;
  const l = clamp(box.l + dx, 0, 1 - w);
  const t = clamp(box.t + dy, 0, 1 - h);
  return { l, t, r: l + w, b: t + h };
}

/**
 * Drag the handle `h` ("n", "se", …) to the point (x, y). The opposite edges stay put; with a
 * `ratio` (corners only) the box keeps its shape by giving up the longer side.
 */
export function resizeBox(box: CropBox, h: string, x: number, y: number, ratio = 0): CropBox {
  const o = { ...box };
  if (h.includes("w")) o.l = clamp(x, 0, box.r - MIN);
  if (h.includes("e")) o.r = clamp(x, box.l + MIN, 1);
  if (h.includes("n")) o.t = clamp(y, 0, box.b - MIN);
  if (h.includes("s")) o.b = clamp(y, box.t + MIN, 1);
  if (ratio > 0 && h.length === 2) {
    const w = o.r - o.l;
    const hh = o.b - o.t;
    const nw = w / hh > ratio ? hh * ratio : w;
    const nh = w / hh > ratio ? hh : w / ratio;
    if (h.includes("e")) o.r = o.l + nw;
    else o.l = o.r - nw;
    if (h.includes("s")) o.b = o.t + nh;
    else o.t = o.b - nh;
  }
  return o;
}

/** Grow (+) or shrink (−) around the centre by `d` of the image, keeping shape and staying inside. */
export function scaleBox(box: CropBox, d: number): CropBox {
  const w = box.r - box.l;
  const h = box.b - box.t;
  const k = clamp((Math.min(w, h) + d) / Math.min(w, h), MIN / Math.min(w, h), 1 / Math.max(w, h));
  const nw = w * k;
  const nh = h * k;
  const cx = clamp((box.l + box.r) / 2, nw / 2, 1 - nw / 2);
  const cy = clamp((box.t + box.b) / 2, nh / 2, 1 - nh / 2);
  return { l: cx - nw / 2, t: cy - nh / 2, r: cx + nw / 2, b: cy + nh / 2 };
}
