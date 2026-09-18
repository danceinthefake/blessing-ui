import { computed, ref, watchEffect } from "vue";

export type BlessTheme = "light" | "dark" | "system";

const KEY = "bless-theme";
const theme = ref<BlessTheme>("system");
const systemDark = ref(false);
let booted = false;

function boot() {
  if (booted || typeof window === "undefined") return;
  booted = true;
  try {
    const saved = localStorage.getItem(KEY) as BlessTheme | null;
    if (saved === "light" || saved === "dark" || saved === "system") theme.value = saved;
  } catch {}
  const mql = matchMedia("(prefers-color-scheme: dark)");
  systemDark.value = mql.matches;
  mql.addEventListener("change", (e) => (systemDark.value = e.matches));
  watchEffect(() => {
    const root = document.documentElement;
    if (theme.value === "system") root.removeAttribute("data-theme");
    else root.setAttribute("data-theme", theme.value);
    try {
      localStorage.setItem(KEY, theme.value);
    } catch {}
  });
}

/** light | dark | system; persisted, applied as data-theme on <html> */
export function useTheme() {
  boot();
  const isDark = computed(
    () => theme.value === "dark" || (theme.value === "system" && systemDark.value),
  );
  const set = (t: BlessTheme) => (theme.value = t);
  const toggle = () => set(isDark.value ? "light" : "dark");
  return { theme, isDark, set, toggle };
}
