import { vi } from "vitest";
import { nextTick } from "vue";

test("useTheme: persisted palette survives boot and lands after hydration (microtask)", async () => {
  vi.resetModules();
  localStorage.setItem("bless-palette", "utaha");
  window.matchMedia = () =>
    ({
      matches: false,
      addEventListener() {},
      removeEventListener() {},
    }) as unknown as MediaQueryList;
  const { useTheme } = await import("./useTheme");
  const t = useTheme();
  // synchronous: still the SSR-safe defaults, and the stored values were not clobbered
  expect(t.palette.value).toBe("megumi");
  expect(localStorage.getItem("bless-palette")).toBe("utaha");
  await Promise.resolve();
  await nextTick();
  expect(t.palette.value).toBe("utaha");
  expect(document.documentElement.dataset.palette).toBe("utaha");
  t.setPalette("megumi");
  await nextTick();
  expect(localStorage.getItem("bless-palette")).toBeNull();
  localStorage.clear();
});
