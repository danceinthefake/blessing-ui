import { onBeforeUnmount, onMounted, ref } from "vue";

/** reactive matchMedia; defaults to the single Blessing breakpoint */
export function useMedia(query = "(max-width: 800px)") {
  const matches = ref(false);
  let mql: MediaQueryList | undefined;
  const update = () => {
    matches.value = mql?.matches ?? false;
  };
  onMounted(() => {
    mql = window.matchMedia(query);
    update();
    mql.addEventListener("change", update);
  });
  onBeforeUnmount(() => mql?.removeEventListener("change", update));
  return matches;
}

/** true when the user asked for reduced motion (false outside a browser) */
export const reducedMotion = () =>
  typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;

/** "smooth" unless the user asked for reduced motion */
export const scrollBehavior = (b: ScrollBehavior = "smooth"): ScrollBehavior =>
  reducedMotion() ? "auto" : b;
