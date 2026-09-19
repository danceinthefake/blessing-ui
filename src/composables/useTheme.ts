import { computed, ref, watchEffect } from "vue";

export type BlessTheme = "light" | "dark" | "system";
/** accent family; undefined = the default Blessing pink-red */
export type BlessPalette = "megumi" | "utaha" | "izumi" | "michiru" | "eriri";
export const blessPalettes: { name: BlessPalette; color: string }[] = [
  { name: "megumi", color: "#e85078" },
  { name: "utaha", color: "#e03028" },
  { name: "izumi", color: "#4090d0" },
  { name: "michiru", color: "#b878b0" },
  { name: "eriri", color: "#c8e018" },
];

const KEY = "bless-theme";
const PKEY = "bless-palette";
const theme = ref<BlessTheme>("system");
const palette = ref<BlessPalette | undefined>();
const systemDark = ref(false);
let booted = false;

function boot() {
  if (booted || typeof window === "undefined") return;
  booted = true;
  try {
    const saved = localStorage.getItem(KEY) as BlessTheme | null;
    if (saved === "light" || saved === "dark" || saved === "system") theme.value = saved;
    const p = localStorage.getItem(PKEY);
    if (p && blessPalettes.some((x) => x.name === p)) palette.value = p as BlessPalette;
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
  watchEffect(() => {
    const root = document.documentElement;
    if (palette.value) root.setAttribute("data-palette", palette.value);
    else root.removeAttribute("data-palette");
    try {
      if (palette.value) localStorage.setItem(PKEY, palette.value);
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
  const setPalette = (p: BlessPalette | undefined) => (palette.value = p);
  return { theme, isDark, set, toggle, palette, setPalette };
}
