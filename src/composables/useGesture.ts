import { onBeforeUnmount, onMounted, ref, type Ref } from "vue";

type El = Ref<HTMLElement | null | undefined>;
export type SwipeDirection = "left" | "right" | "up" | "down";
export interface PanEvent {
  dx: number;
  dy: number;
  /** start | move | end | cancel */
  phase: "start" | "move" | "end" | "cancel";
  event: PointerEvent;
}

/** Pointer-event pan: dx/dy from the press point, with pointer capture. Set `touch-action` on the element yourself. */
export function usePan(
  el: El,
  onPan: (e: PanEvent) => void,
  opts: { pointerTypes?: PointerEvent["pointerType"][] } = {},
) {
  let start: { x: number; y: number; id: number } | null = null;
  const ok = (e: PointerEvent) => !opts.pointerTypes || opts.pointerTypes.includes(e.pointerType);
  const down = (e: PointerEvent) => {
    if (!ok(e) || e.button) return;
    start = { x: e.clientX, y: e.clientY, id: e.pointerId };
    (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
    onPan({ dx: 0, dy: 0, phase: "start", event: e });
  };
  const move = (e: PointerEvent) =>
    start &&
    e.pointerId === start.id &&
    onPan({ dx: e.clientX - start.x, dy: e.clientY - start.y, phase: "move", event: e });
  const up = (phase: "end" | "cancel") => (e: PointerEvent) => {
    if (!start || e.pointerId !== start.id) return;
    onPan({ dx: e.clientX - start.x, dy: e.clientY - start.y, phase, event: e });
    start = null;
  };
  const end = up("end");
  const cancel = up("cancel");
  onMounted(() => {
    const t = el.value;
    if (!t) return;
    t.addEventListener("pointerdown", down);
    t.addEventListener("pointermove", move);
    t.addEventListener("pointerup", end);
    t.addEventListener("pointercancel", cancel);
  });
  onBeforeUnmount(() => {
    const t = el.value;
    t?.removeEventListener("pointerdown", down);
    t?.removeEventListener("pointermove", move);
    t?.removeEventListener("pointerup", end);
    t?.removeEventListener("pointercancel", cancel);
  });
}

/** Fires once per gesture when the release exceeds `threshold` px along the dominant axis. */
export function useSwipe(
  el: El,
  onSwipe: (dir: SwipeDirection, e: PanEvent) => void,
  opts: { threshold?: number; axis?: "x" | "y" | "both" } = {},
) {
  const direction = ref<SwipeDirection | undefined>();
  const th = opts.threshold ?? 40;
  usePan(el, (e) => {
    if (e.phase !== "end") return;
    const ax = Math.abs(e.dx),
      ay = Math.abs(e.dy);
    const horiz = ax >= ay;
    if ((opts.axis === "x" && !horiz) || (opts.axis === "y" && horiz)) return;
    if (Math.max(ax, ay) < th) return;
    direction.value = horiz ? (e.dx > 0 ? "right" : "left") : e.dy > 0 ? "down" : "up";
    onSwipe(direction.value, e);
  });
  return { direction };
}

/** Press and hold for `ms` without moving more than `tolerance` px. */
export function useLongPress(
  el: El,
  onHold: (e: PointerEvent) => void,
  opts: { ms?: number; tolerance?: number } = {},
) {
  const pressing = ref(false);
  let timer: ReturnType<typeof setTimeout> | undefined;
  usePan(el, (e) => {
    if (e.phase === "start") {
      pressing.value = true;
      timer = setTimeout(
        () => (pressing.value && onHold(e.event), (pressing.value = false)),
        opts.ms ?? 500,
      );
    } else if (e.phase === "move") {
      if (Math.hypot(e.dx, e.dy) > (opts.tolerance ?? 8))
        ((pressing.value = false), clearTimeout(timer));
    } else ((pressing.value = false), clearTimeout(timer));
  });
  return { pressing };
}

/** Fire `onRepeat` while held: once after `delay`, then every `interval`. For ± steppers. */
export function useTouchRepeat(
  el: El,
  onRepeat: () => void,
  opts: { delay?: number; interval?: number } = {},
) {
  let t: ReturnType<typeof setTimeout> | undefined;
  let i: ReturnType<typeof setInterval> | undefined;
  const stop = () => (clearTimeout(t), clearInterval(i));
  usePan(el, (e) => {
    if (e.phase === "start") {
      onRepeat();
      t = setTimeout(() => (i = setInterval(onRepeat, opts.interval ?? 100)), opts.delay ?? 400);
    } else if (e.phase !== "move") stop();
  });
  onBeforeUnmount(stop);
}
