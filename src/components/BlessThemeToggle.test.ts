import { mount } from "@vue/test-utils";
import { nextTick } from "vue";
import BlessThemeToggle from "./BlessThemeToggle.vue";
import { useTheme } from "../composables/useTheme";

beforeAll(() => {
  window.matchMedia = () =>
    ({
      matches: false,
      addEventListener() {},
      removeEventListener() {},
    }) as unknown as MediaQueryList;
});

test("useTheme applies data-theme and persists; toggle flips", async () => {
  const { set, toggle, isDark } = useTheme();
  set("dark");
  await nextTick();
  expect(document.documentElement.dataset.theme).toBe("dark");
  expect(localStorage.getItem("bless-theme")).toBe("dark");
  expect(isDark.value).toBe(true);
  toggle();
  await nextTick();
  expect(document.documentElement.dataset.theme).toBe("light");
  set("system");
  await nextTick();
  expect(document.documentElement.dataset.theme).toBeUndefined();
});

test("BlessThemeToggle switch and group", async () => {
  const s = mount(BlessThemeToggle);
  await s.find("button").trigger("click");
  await nextTick();
  expect(document.documentElement.dataset.theme).toBe("dark");
  const g = mount(BlessThemeToggle, { props: { mode: "group" } });
  expect(g.findAll("button")).toHaveLength(3);
  expect(g.findAll("button")[2].attributes("aria-pressed")).toBe("true");
  await g.findAll("button")[0].trigger("click");
  await nextTick();
  expect(document.documentElement.dataset.theme).toBe("light");
});

test("useTheme palette applies data-palette and persists; BlessPaletteToggle switches", async () => {
  const { default: BlessPaletteToggle } = await import("./BlessPaletteToggle.vue");
  const { setPalette, palette } = useTheme();
  setPalette("eriri");
  await nextTick();
  expect(document.documentElement.dataset.palette).toBe("eriri");
  expect(localStorage.getItem("bless-palette")).toBe("eriri");
  const w = mount(BlessPaletteToggle);
  expect(w.findAll("button")).toHaveLength(6);
  expect(w.find('[aria-label="Eriri"]').attributes("aria-pressed")).toBe("true");
  await w.find('[aria-label="Megumi"]').trigger("click");
  await nextTick();
  expect(palette.value).toBe("megumi");
  expect(document.documentElement.dataset.palette).toBe("megumi");
  await w.find("button").trigger("click");
  await nextTick();
  expect(document.documentElement.dataset.palette).toBeUndefined();
  expect(localStorage.getItem("bless-palette")).toBeNull();
});
