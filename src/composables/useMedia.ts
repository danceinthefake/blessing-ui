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
