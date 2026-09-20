import { computed, ref, watchEffect } from "vue";

export type BlessTheme = "light" | "dark" | "system";
/** accent family; undefined = Megumi, the default */
export type BlessPalette = "megumi" | "utaha" | "izumi" | "michiru" | "eriri" | "tomoya";
export const blessPalettes: { name: BlessPalette; color: string }[] = [
  { name: "megumi", color: "#e85078" }, // default: no data-palette attribute
  { name: "utaha", color: "#e03028" },
  { name: "izumi", color: "#4090d0" },
  { name: "michiru", color: "#b878b0" },
  { name: "eriri", color: "#c8e018" },
  { name: "tomoya", color: "#5870f8" },
];

const KEY = "bless-theme";
const PKEY = "bless-palette";
const theme = ref<BlessTheme>("system");
const palette = ref<BlessPalette>("megumi");
const systemDark = ref(false);
let booted = false;
let loaded = false; // persisted values read; until then the effects below must not write defaults over them

function boot() {
  if (booted || typeof window === "undefined") return;
  booted = true;
  // Persisted choices land in a microtask: after a server-rendered page has hydrated (so the
  // toggles' aria-pressed/title match the HTML), still before first paint on a client-only app.
  queueMicrotask(() => {
    try {
      const saved = localStorage.getItem(KEY) as BlessTheme | null;
      if (saved === "light" || saved === "dark" || saved === "system") theme.value = saved;
      const p = localStorage.getItem(PKEY);
      if (p && blessPalettes.some((x) => x.name === p)) palette.value = p as BlessPalette;
    } catch {}
    loaded = true;
  });
  const mql = matchMedia("(prefers-color-scheme: dark)");
  systemDark.value = mql.matches;
  mql.addEventListener("change", (e) => (systemDark.value = e.matches));
  watchEffect(() => {
    const root = document.documentElement;
    if (theme.value === "system") root.removeAttribute("data-theme");
    else root.setAttribute("data-theme", theme.value);
    if (!loaded) return;
    try {
      localStorage.setItem(KEY, theme.value);
    } catch {}
  });
  watchEffect(() => {
    const root = document.documentElement;
    const p = palette.value === "megumi" ? undefined : palette.value;
    if (p) root.setAttribute("data-palette", p);
    else root.removeAttribute("data-palette");
    if (!loaded) return;
    try {
      if (p) localStorage.setItem(PKEY, p);
      else localStorage.removeItem(PKEY);
    } catch {}
  });
}

/** light | dark | system + palette; persisted, applied as data-theme / data-palette on <html> */
export function useTheme() {
  boot();
  const isDark = computed(
    () => theme.value === "dark" || (theme.value === "system" && systemDark.value),
  );
  const set = (t: BlessTheme) => (theme.value = t);
  const toggle = () => set(isDark.value ? "light" : "dark");
  const setPalette = (p: BlessPalette | undefined) => (palette.value = p ?? "megumi");
  return { theme, isDark, set, toggle, palette, setPalette };
}
