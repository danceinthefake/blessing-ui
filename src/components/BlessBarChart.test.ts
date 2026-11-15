import { mount } from "@vue/test-utils";
import BlessBarChart from "./BlessBarChart.vue";

const data = [
  { month: "Jan", web: 40, app: 20 },
  { month: "Feb", web: 60, app: -10 },
];
const series = [
  { key: "web", label: "Web" },
  { key: "app", color: "success" },
];
const nums = (el: { attributes: (n: string) => string | undefined }, n: string) =>
  Number(el.attributes(n));

test("BlessBarChart: one bar per series per category, from zero, with round ticks and a table", () => {
  const w = mount(BlessBarChart, { props: { data, x: "month", series, height: 200 } });
  const bars = w.findAll("rect");
  expect(bars).toHaveLength(4);
  expect(bars.map((b) => b.find("title").text())).toEqual([
    "Jan · Web: 40",
    "Jan · app: 20",
    "Feb · Web: 60",
    "Feb · app: -10",
  ]);
  expect(bars[1]!.attributes("style")).toContain("var(--bless-color-success)");
  // Web in Feb is three times as tall as app in Jan, and the negative bar hangs below zero
  expect(nums(bars[2]!, "height") / nums(bars[1]!, "height")).toBeCloseTo(3);
  expect(nums(bars[3]!, "y")).toBeCloseTo(nums(bars[0]!, "y") + nums(bars[0]!, "height"));
  expect(w.findAll(".bless-plot__tick").map((t) => t.text())).toEqual([
    "-20",
    "0",
    "20",
    "40",
    "60",
  ]);
  expect(w.find("svg").attributes("aria-hidden")).toBe("true");
  expect(w.findAll("tbody tr").map((r) => r.text())).toEqual(["Jan4020", "Feb60-10"]);
  expect(w.find("thead").text()).toBe("CategoryWebapp");
});

test("BlessBarChart: stacked bars sit on each other, and horizontal bars grow along x", async () => {
  const w = mount(BlessBarChart, {
    props: {
      data: [{ k: "A", a: 10, b: 30 }],
      x: "k",
      series: [{ key: "a" }, { key: "b" }],
      stacked: true,
    },
  });
  const [a, b] = w.findAll("rect");
  expect(nums(a!, "x")).toBe(nums(b!, "x"));
  expect(nums(b!, "y") + nums(b!, "height")).toBeCloseTo(nums(a!, "y"));
  await w.setProps({ horizontal: true, stacked: false, format: (v: number) => `${v}%` });
  const [h1, h2] = w.findAll("rect");
  expect(nums(h2!, "width") / nums(h1!, "width")).toBeCloseTo(3);
  expect(nums(h1!, "x")).toBe(nums(h2!, "x"));
  expect(w.find("tbody").text()).toBe("A10%30%");
});
