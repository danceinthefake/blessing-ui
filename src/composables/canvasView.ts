export interface CanvasView {
  /** where the world's origin sits inside the viewport, px */
  x: number;
  y: number;
  zoom: number;
}

export const clampZoom = (z: number, min: number, max: number) => Math.min(max, Math.max(min, z));

/** The world point under a viewport point (px relative to the viewport's top-left). */
export const toWorld = (v: CanvasView, px: number, py: number) => ({
  x: (px - v.x) / v.zoom,
  y: (py - v.y) / v.zoom,
});

/** Zoom by `factor` keeping the world point under (`px`, `py`) where it is. */
export function zoomAt(
  v: CanvasView,
  factor: number,
  px: number,
  py: number,
  min: number,
  max: number,
): CanvasView {
  const zoom = clampZoom(v.zoom * factor, min, max);
  const k = zoom / v.zoom;
  return { zoom, x: px - (px - v.x) * k, y: py - (py - v.y) * k };
}

/** The view that shows a world rectangle centred in a viewport of `w` × `h`, with `pad` px around. */
export function fitRect(
  r: { x: number; y: number; width: number; height: number },
  w: number,
  h: number,
  min: number,
  max: number,
  pad = 32,
): CanvasView {
  const zoom = clampZoom(
    Math.min((w - pad * 2) / (r.width || 1), (h - pad * 2) / (r.height || 1)),
    min,
    max,
  );
  return {
    zoom,
    x: (w - r.width * zoom) / 2 - r.x * zoom,
    y: (h - r.height * zoom) / 2 - r.y * zoom,
  };
}
