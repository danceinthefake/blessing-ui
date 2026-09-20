import { onBeforeUnmount, onMounted, ref, type Ref } from "vue";

/** element size via ResizeObserver */
export function useResizeObserver(el: Ref<HTMLElement | null | undefined>) {
  const width = ref(0);
  const height = ref(0);
  let ro: ResizeObserver | undefined;
  onMounted(() => {
    if (!el.value || typeof ResizeObserver === "undefined") return;
    ro = new ResizeObserver(([e]) => {
      if (!e) return;
      width.value = e.contentRect.width;
      height.value = e.contentRect.height;
    });
    ro.observe(el.value);
  });
  onBeforeUnmount(() => ro?.disconnect());
  return { width, height };
}

/** Fullscreen API on an element (or the document) */
export function useFullscreen(el?: Ref<HTMLElement | null | undefined>) {
  const active = ref(false);
  const sync = () => (active.value = !!document.fullscreenElement);
  onMounted(() => (sync(), document.addEventListener("fullscreenchange", sync)));
  onBeforeUnmount(() => document.removeEventListener("fullscreenchange", sync));
  const enter = () => (el?.value ?? document.documentElement).requestFullscreen?.();
  const exit = () => document.fullscreenElement && document.exitFullscreen();
  const toggle = () => (active.value ? exit() : enter());
  return { active, enter, exit, toggle };
}

/** document.visibilityState as a ref */
export function useVisibility() {
  const visible = ref(true);
  const sync = () => (visible.value = document.visibilityState === "visible");
  onMounted(() => (sync(), document.addEventListener("visibilitychange", sync)));
  onBeforeUnmount(() => document.removeEventListener("visibilitychange", sync));
  return { visible };
}

/** scroll position + direction of the window or an element */
export function useScroll(el?: Ref<HTMLElement | null | undefined>) {
  const x = ref(0);
  const y = ref(0);
  const direction = ref<"up" | "down" | null>(null);
  let last = 0;
  const target = () => el?.value ?? window;
  const read = () => {
    const t = el?.value;
    x.value = t ? t.scrollLeft : window.scrollX;
    y.value = t ? t.scrollTop : window.scrollY;
    direction.value = y.value > last ? "down" : y.value < last ? "up" : direction.value;
    last = y.value;
  };
  onMounted(() => (read(), target().addEventListener("scroll", read, { passive: true })));
  onBeforeUnmount(() => target().removeEventListener("scroll", read));
  return { x, y, direction };
}
