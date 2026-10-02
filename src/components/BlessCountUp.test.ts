import { mount } from "@vue/test-utils";
import { nextTick } from "vue";
import BlessCountUp from "./BlessCountUp.vue";

beforeEach(() => vi.useFakeTimers());
afterEach(() => vi.useRealTimers());

const visual = (w: ReturnType<typeof mount>) => w.find(".bless-countup__visual").text();
const final = (w: ReturnType<typeof mount>) => w.find(".bless-countup__final").text();

test("counts from 0 to the value and lands exactly on it", async () => {
  const w = mount(BlessCountUp, { props: { value: 1000, duration: 500, locale: "en" } });
  expect(visual(w)).toBe("0");
  await vi.advanceTimersByTimeAsync(250);
  const mid = Number(visual(w).replace(/,/g, ""));
  expect(mid).toBeGreaterThan(500); // ease-out: past halfway at half time
  expect(mid).toBeLessThan(1000);
  await vi.advanceTimersByTimeAsync(400);
  expect(visual(w)).toBe("1,000");
});

test("a whole-number target never shows fractions on the way", async () => {
  const w = mount(BlessCountUp, { props: { value: 1000, duration: 500, locale: "en" } });
  for (let i = 0; i < 12; i++) {
    await vi.advanceTimersByTimeAsync(40);
    expect(visual(w)).not.toContain(".");
  }
});

test("screen readers get the final value at once, not the count", async () => {
  const w = mount(BlessCountUp, { props: { value: 1234, locale: "en" } });
  expect(final(w)).toBe("1,234");
  expect(w.find(".bless-countup__visual").attributes("aria-hidden")).toBe("true");
});

test("a new value counts on from where it is; appear=false starts at the value", async () => {
  const w = mount(BlessCountUp, {
    props: { value: 10, appear: false, duration: 100, locale: "en" },
  });
  expect(visual(w)).toBe("10");
  await w.setProps({ value: 20 });
  await vi.advanceTimersByTimeAsync(200);
  expect(visual(w)).toBe("20");
  expect(final(w)).toBe("20");
});

test("Intl options format the number; zero duration jumps", async () => {
  const w = mount(BlessCountUp, {
    props: { value: 0.5, duration: 0, options: { style: "percent" }, locale: "en", appear: false },
  });
  expect(visual(w)).toBe("50%");
  await w.setProps({ value: 0.75 });
  await nextTick();
  expect(visual(w)).toBe("75%");
});

test("reduced motion jumps straight to the value", async () => {
  vi.stubGlobal("matchMedia", () => ({ matches: true }));
  const w = mount(BlessCountUp, { props: { value: 99, locale: "en" } });
  await nextTick();
  expect(visual(w)).toBe("99");
  vi.unstubAllGlobals();
});

test("odometer rolls each digit in its own column, keeping separators", () => {
  const w = mount(BlessCountUp, {
    props: { value: 1234, odometer: true, appear: false, locale: "en" },
  });
  const reels = w.findAll(".bless-countup__reel");
  expect(reels.map((r) => r.attributes("style"))).toEqual([
    "--bless-digit: 1;",
    "--bless-digit: 2;",
    "--bless-digit: 3;",
    "--bless-digit: 4;",
  ]);
  expect(visual(w)).toContain(",");
  expect(reels[0].findAll("i")).toHaveLength(10);
});
