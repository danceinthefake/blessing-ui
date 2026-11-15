import { mount } from "@vue/test-utils";
import BlessWaterfallChart from "./BlessWaterfallChart.vue";

const steps = [
  { label: "Start", value: 100, total: false },
  { label: "Ads", value: 40 },
  { label: "Hosting", value: -60 },
  { label: "End", total: true },
];

test("BlessWaterfallChart: each step from the sum before it, a total from zero, links, and a table", () => {
  const w = mount(BlessWaterfallChart, { props: { steps, height: 220 } });
  const bars = w.findAll("rect");
  expect(bars.map((b) => b.classes().find((c) => c.startsWith("bless-waterfall__bar--")))).toEqual([
    "bless-waterfall__bar--up",
    "bless-waterfall__bar--up",
    "bless-waterfall__bar--down",
    "bless-waterfall__bar--total",
  ]);
  const top = (i: number) => Number(bars[i]!.attributes("y"));
  const bottom = (i: number) => top(i) + Number(bars[i]!.attributes("height"));
  // Ads starts where Start ends; Hosting comes down from the top of Ads; End goes up from zero to 80
  expect(bottom(1)).toBeCloseTo(top(0));
  expect(top(2)).toBeCloseTo(top(1));
  expect(bottom(3)).toBeCloseTo(bottom(0));
  expect(top(3)).toBeCloseTo(bottom(2));
  expect(w.findAll(".bless-waterfall__link")).toHaveLength(3);
  expect(bars.map((b) => b.find("title").text())).toEqual([
    "Start: +100",
    "Ads: +40",
    "Hosting: -60",
    "End: 80",
  ]);
  expect(w.findAll("tbody tr").map((r) => r.text())).toEqual([
    "Start+100100",
    "Ads+40140",
    "Hosting-6080",
    "End–80",
  ]);
  expect(w.find("thead").text()).toBe("StepChangeTotal");
});
