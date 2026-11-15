import { mount } from "@vue/test-utils";
import BlessStreamgraph from "./BlessStreamgraph.vue";

const data = [
  { month: "Jan", news: 4, tech: 2 },
  { month: "Feb", news: 2, tech: 6 },
];
const series = [
  { key: "news", label: "News" },
  { key: "tech", label: "Tech", color: "chart-4" },
];

test("BlessStreamgraph: a stream per series around the center, a legend, and a table", () => {
  const w = mount(BlessStreamgraph, {
    props: { data, x: "month", series, label: "Plays by topic" },
  });
  const areas = w.findAll(".bless-stream__area");
  expect(areas).toHaveLength(2);
  // drawn from the bottom of the stack: the last series first
  expect(areas[0]!.attributes("style")).toContain("chart-4");
  expect(areas[0]!.attributes("d")).toMatch(/^M.+Z$/);
  expect(w.findAll(".bless-stream__legend li").map((l) => l.text())).toEqual(["News", "Tech"]);
  expect(w.findAll("tbody tr").map((r) => r.text())).toEqual(["Jan42", "Feb26"]);
  expect(w.findAll("text.bless-plot__tick").map((t) => t.text())).toEqual(["Jan", "Feb"]);
});

test("BlessStreamgraph: the stack is centered on the middle line", () => {
  const w = mount(BlessStreamgraph, {
    props: { data: [{ m: "a", v: 10 }], x: "m", series: [{ key: "v" }], height: 222 },
  });
  // one step: top at +5, bottom at -5, the same distance around the middle of the plot (4 to 200, so 102)
  const ys = w
    .find(".bless-stream__area")
    .attributes("d")!
    .match(/,([\d.]+)/g)!
    .map((s) => Number(s.slice(1)));
  expect(ys[0]! + ys[1]!).toBeCloseTo(204, 0);
  expect(w.find("thead th").text()).toBe("Step");
});
