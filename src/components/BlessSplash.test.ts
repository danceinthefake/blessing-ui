import { mount } from "@vue/test-utils";
import { nextTick } from "vue";
import BlessSplash from "./BlessSplash.vue";

beforeEach(() => {
  localStorage.clear();
  window.matchMedia = () =>
    ({
      matches: false,
      addEventListener() {},
      removeEventListener() {},
    }) as unknown as MediaQueryList;
});

test("shows, skip dismisses and persists once-key", async () => {
  const w = mount(BlessSplash, { props: { once: "seen", duration: 0 }, slots: { default: "hi" } });
  await nextTick();
  expect(w.find(".bless-splash").exists()).toBe(true);
  await w.find(".bless-splash__skip").trigger("click");
  expect(w.emitted("done")).toHaveLength(1);
  expect(localStorage.getItem("seen")).toBe("1");

  const again = mount(BlessSplash, { props: { once: "seen" } });
  await nextTick();
  expect(again.find(".bless-splash").exists()).toBe(false);
});

test("auto-dismiss after duration; reduced motion skips entirely", async () => {
  vi.useFakeTimers();
  const w = mount(BlessSplash, { props: { duration: 100 } });
  await nextTick();
  expect(w.find(".bless-splash").exists()).toBe(true);
  vi.advanceTimersByTime(150);
  expect(w.emitted("done")).toHaveLength(1);
  vi.useRealTimers();

  window.matchMedia = () =>
    ({
      matches: true,
      addEventListener() {},
      removeEventListener() {},
    }) as unknown as MediaQueryList;
  const r = mount(BlessSplash);
  await nextTick();
  expect(r.find(".bless-splash").exists()).toBe(false);
  expect(r.emitted("done")).toHaveLength(1);
});
