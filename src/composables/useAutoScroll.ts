/**
 * Pixels to scroll per frame for a pointer at `pos` on an axis running from `min` to `max`:
 * 0 in the middle, growing to ±`top` as it nears either end (negative = toward `min`).
 */
export function edgeSpeed(pos: number, min: number, max: number, edge = 48, top = 18): number {
  if (max - min < edge * 2) return 0; // too small to have a calm middle
  if (pos < min + edge) return -Math.min(top, Math.ceil(((min + edge - pos) / edge) * top));
  if (pos > max - edge) return Math.min(top, Math.ceil(((pos - (max - edge)) / edge) * top));
  return 0;
}

/**
 * While a drag is held near the edge of `box` (sideways) or of the window (up and down), keep
 * scrolling it; `onScroll` fires after each nudge so the drop target can be worked out again.
 * Call `point` from the pointer-move handler, `start` on grab and `stop` on drop or cancel.
 */
export function useAutoScroll(box: () => HTMLElement | null | undefined, onScroll: () => void) {
  let raf = 0;
  let x = 0;
  let y = 0;
  const tick = () => {
    let moved = false;
    const el = box();
    if (el) {
      const r = el.getBoundingClientRect();
      const dx = edgeSpeed(x, r.left, r.right);
      const was = el.scrollLeft;
      if (dx) el.scrollLeft += dx;
      moved ||= el.scrollLeft !== was;
    }
    const dy = edgeSpeed(y, 0, window.innerHeight);
    if (dy) {
      const was = window.scrollY;
      window.scrollBy(0, dy);
      moved ||= window.scrollY !== was;
    }
    if (moved) onScroll();
    raf = requestAnimationFrame(tick);
  };
  return {
    point(px: number, py: number) {
      x = px;
      y = py;
    },
    start() {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(tick);
    },
    stop() {
      cancelAnimationFrame(raf);
      raf = 0;
    },
  };
}
