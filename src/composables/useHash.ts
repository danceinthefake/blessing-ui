import { onBeforeUnmount, onMounted, ref } from "vue";

/** reactive location.hash (without '#') */
export function useHash() {
  const hash = ref("");
  const read = () => {
    hash.value = decodeURIComponent(location.hash.slice(1));
  };
  onMounted(() => {
    read();
    addEventListener("hashchange", read);
  });
  onBeforeUnmount(() => removeEventListener("hashchange", read));
  return hash;
}
