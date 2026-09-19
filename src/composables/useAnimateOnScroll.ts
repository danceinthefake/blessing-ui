import { onBeforeUnmount, onMounted, ref, type Ref } from "vue";

/**
 * `visible` flips when `el` enters the viewport; pair with a CSS transition on
 * `[data-visible]` or bind the ref to a class. `once` keeps it true after the first entry.
 */
export function useAnimateOnScroll(
  el: Ref<HTMLElement | undefined | null>,
  opts: { threshold?: number; rootMargin?: string; once?: boolean } = {},
) {
  const visible = ref(false);
  let io: IntersectionObserver | undefined;
  onMounted(() => {
    if (!el.value || typeof IntersectionObserver === "undefined")
      return void (visible.value = true);
    io = new IntersectionObserver(
      ([e]) => {
        if (!e) return;
        if (e.isIntersecting) {
          visible.value = true;
          if (opts.once ?? true) io?.disconnect();
        } else if (!(opts.once ?? true)) visible.value = false;
      },
      { threshold: opts.threshold ?? 0.15, rootMargin: opts.rootMargin },
    );
    io.observe(el.value);
  });
  onBeforeUnmount(() => io?.disconnect());
  return { visible };
}
