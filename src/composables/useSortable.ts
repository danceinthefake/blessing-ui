import { onBeforeUnmount, ref, type Ref } from "vue";
import { useAutoScroll } from "./useAutoScroll";

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

/** one list of a group: lists sharing a `group` name accept each other's items */
export interface SortableMember {
  root: Ref<HTMLElement | null | undefined>;
  list: () => unknown[];
  set: (v: unknown[]) => void;
  /** where an item coming from another list would land: the nearest item and which side of it */
  drop: Ref<{ index: number; after: boolean } | null>;
  /** items run top to bottom (a list) rather than left to right (a grid) */
  vertical: () => boolean;
  label: () => string;
  /** take over a keyboard-held item at `index`, with focus */
  adopt: (index: number) => void;
  /** put focus on the grip at `index` */
  focus: (index: number) => void;
  /** say something in this list's live region (where focus is, after a hand-over) */
  say: (message: string) => void;
}
const groups = new Map<string, Set<SortableMember>>();
let session: (() => void) | null = null;

/** Register a list in a group; returns the function that leaves it. */
export function joinGroup(name: string, m: SortableMember): () => void {
  if (!groups.has(name)) groups.set(name, new Set());
  groups.get(name)!.add(m);
  return () => {
    groups.get(name)?.delete(m);
    if (!groups.get(name)?.size) groups.delete(name);
  };
}
/** The lists of a group in document order, so "next" means the one after in the page. */
export function membersOf(name: string): SortableMember[] {
  return [...(groups.get(name) ?? [])].sort((a, b) => {
    const x = a.root.value;
    const y = b.root.value;
    if (!x || !y) return 0;
    return x.compareDocumentPosition(y) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1;
  });
}
/** Where a point would drop into a list: next to the nearest item, or slot 0 when it is empty. */
export function slotAt(m: SortableMember, x: number, y: number, selector = "[data-sortable-item]") {
  const els = Array.from(m.root.value?.querySelectorAll<HTMLElement>(selector) ?? []);
  if (!els.length) return { index: 0, after: false };
  const rects = els.map((el) => el.getBoundingClientRect());
  const index = nearestIndex(rects, x, y);
  const r = rects[index]!;
  const after = m.vertical() ? y > r.top + r.height / 2 : x > r.left + r.width / 2;
  return { index, after };
}
/** Move the item at `index` of `from` into `to` at `at`; both lists are replaced, not mutated. */
export function transfer(from: SortableMember, index: number, to: SortableMember, at: number) {
  const src = from.list().slice();
  const [item] = src.splice(index, 1);
  const dst = to.list().slice();
  dst.splice(at, 0, item);
  from.set(src);
  to.set(dst);
  return item;
}
/** Remember every list of the group; the returned `restore` puts them all back (Esc). */
export function snapshotGroup(name: string) {
  const snaps = membersOf(name).map((m) => [m, m.list().slice()] as const);
  session = () => snaps.forEach(([m, l]) => m.set(l));
  return session;
}
export const restoreGroup = () => {
  session?.();
  session = null;
};

export interface SortableGroup {
  name: () => string | undefined;
  self: SortableMember;
  /** the item at `from` was dropped on another list, to land at `at` there */
  onTransfer: (from: number, to: SortableMember, at: number) => void;
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
  group?: SortableGroup,
) {
  const drag = ref<number | null>(null);
  const over = ref<number | null>(null);
  let at = { x: 0, y: 0 };
  // a held item near the top or bottom of the window keeps scrolling the page, and the slot is found again
  const auto = useAutoScroll(
    () => null,
    () => place(at.x, at.y),
  );
  onBeforeUnmount(auto.stop);
  const reset = () => {
    auto.stop();
    drag.value = over.value = null;
  };
  function place(x: number, y: number) {
    if (drag.value == null) return;
    const g = group?.name();
    if (g) {
      const others = membersOf(g).filter((m) => m !== group!.self);
      others.forEach((m) => (m.drop.value = null));
      const target = others.find((m) => {
        const r = m.root.value?.getBoundingClientRect();
        return r && x >= r.left && x <= r.right && y >= r.top && y <= r.bottom;
      });
      if (target) {
        target.drop.value = slotAt(target, x, y, selector);
        over.value = null;
        return;
      }
    }
    const els = root.value?.querySelectorAll<HTMLElement>(selector) ?? [];
    over.value = nearestIndex(
      Array.from(els, (el) => el.getBoundingClientRect()),
      x,
      y,
    );
  }
  return {
    drag,
    over,
    grab(i: number, e: PointerEvent) {
      if (e.button) return;
      (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
      drag.value = over.value = i;
      at = { x: e.clientX, y: e.clientY };
      auto.point(e.clientX, e.clientY);
      auto.start();
    },
    track(e: PointerEvent) {
      at = { x: e.clientX, y: e.clientY };
      auto.point(e.clientX, e.clientY);
      place(e.clientX, e.clientY);
    },
    drop() {
      const g = group?.name();
      const others = g ? membersOf(g).filter((m) => m !== group!.self) : [];
      const target = others.find((m) => m.drop.value);
      if (drag.value != null && target?.drop.value) {
        const { index, after } = target.drop.value;
        group!.onTransfer(drag.value, target, index + (after ? 1 : 0));
      } else if (drag.value != null && over.value != null && over.value !== drag.value)
        onMove(drag.value, over.value);
      others.forEach((m) => (m.drop.value = null));
      reset();
    },
    cancel() {
      const g = group?.name();
      if (g) membersOf(g).forEach((m) => (m.drop.value = null));
      reset();
    },
  };
}
