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
