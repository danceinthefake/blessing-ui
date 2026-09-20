import { vi } from "vitest";
import { nextTick } from "vue";

test("useTheme: persisted palette/shape survive boot and land after hydration (microtask)", async () => {
  vi.resetModules();
  localStorage.setItem("bless-palette", "utaha");
  localStorage.setItem("bless-shape", "rounded");
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
  expect(t.shape.value).toBe("sharp");
  expect(localStorage.getItem("bless-palette")).toBe("utaha");
  await Promise.resolve();
  await nextTick();
  expect(t.palette.value).toBe("utaha");
  expect(t.shape.value).toBe("rounded");
  expect(document.documentElement.dataset.shape).toBe("rounded");
  t.setShape("sharp");
  await nextTick();
  expect(localStorage.getItem("bless-shape")).toBeNull();
  localStorage.clear();
});
