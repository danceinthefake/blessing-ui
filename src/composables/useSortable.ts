import { ref, type Ref } from "vue";

/** `arr` with the item at `from` moved to `to` (a copy). */
export function moveItem<T>(arr: readonly T[], from: number, to: number): T[] {
  const a = arr.slice();
  a.splice(to, 0, ...a.splice(from, 1));
  return a;
}

/** Index of the rect whose centre is closest to the point; works for lists and grids alike. */
export function nearestIndex(rects: readonly DOMRect[], x: number, y: number): number {
  let best = 0;
  let min = Infinity;
  rects.forEach((r, i) => {
    const d = (r.left + r.width / 2 - x) ** 2 + (r.top + r.height / 2 - y) ** 2;
    if (d < min) ((min = d), (best = i));
  });
  return best;
}

/**
 * Pointer-drag reorder over the children of `root` that match `selector`. Bind `grab` /
 * `track` / `drop` / `cancel` to the drag handle's pointer events and set `touch-action: none`
 * on it; `onMove(from, to)` fires once, on release.
 */
export function useSortable(
  root: Ref<HTMLElement | null | undefined>,
  onMove: (from: number, to: number) => void,
  selector = "[data-sortable-item]",
) {
  const drag = ref<number | null>(null);
  const over = ref<number | null>(null);
  const reset = () => (drag.value = over.value = null);
  return {
    drag,
    over,
    grab(i: number, e: PointerEvent) {
      if (e.button) return;
      (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
      drag.value = over.value = i;
    },
    track(e: PointerEvent) {
      if (drag.value == null) return;
      const els = root.value?.querySelectorAll<HTMLElement>(selector) ?? [];
      over.value = nearestIndex(
        Array.from(els, (el) => el.getBoundingClientRect()),
        e.clientX,
        e.clientY,
      );
    },
    drop() {
      if (drag.value != null && over.value != null && over.value !== drag.value)
        onMove(drag.value, over.value);
      reset();
    },
    cancel: reset,
  };
}
