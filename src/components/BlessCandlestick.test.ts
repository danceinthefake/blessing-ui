import { mount } from "@vue/test-utils";
import BlessCandlestick from "./BlessCandlestick.vue";

const data = [
  { label: "Mon", open: 10, high: 14, low: 9, close: 13 },
  { label: "Tue", open: 13, high: 13.5, low: 8, close: 9 },
];

test("BlessCandlestick: a candle per period, rising ones hollow, and a table for screen readers", () => {
  const w = mount(BlessCandlestick, { props: { data, label: "Price" } });
  const c = w.findAll(".bless-candles__candle");
  expect(c).toHaveLength(2);
  expect(c[0]!.classes()).toContain("is-up");
  expect(c[1]!.classes()).not.toContain("is-up");
  expect(c[0]!.attributes("style")).toContain("var(--bless-color-success)");
  expect(c[1]!.attributes("style")).toContain("var(--bless-color-danger)");
  expect(w.find("svg").attributes("aria-hidden")).toBe("true");
  expect(w.find("caption").text()).toBe("Price");
  expect(w.findAll("tbody tr")[1]!.text()).toBe("Tue1313.589");
});

test("BlessCandlestick: the axis covers the lows and highs, and labels translate", () => {
  const w = mount(BlessCandlestick, { props: { data, labels: { open: "Buka" } } });
  const ticks = w.findAll("g > text.bless-plot__tick").map((t) => Number(t.text()));
  expect(ticks[0]).toBeLessThanOrEqual(8);
  expect(ticks.at(-1)).toBeGreaterThanOrEqual(14);
  expect(w.findAll("thead th")[1]!.text()).toBe("Buka");
});
