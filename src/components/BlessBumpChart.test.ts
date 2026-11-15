import { mount } from "@vue/test-utils";
import BlessBumpChart, { bumpRanks } from "./BlessBumpChart.vue";

const data = [
  { week: "W1", a: 10, b: 30, c: 20 },
  { week: "W2", a: 40, b: 30, c: 30 },
];
const series = [
  { key: "a", label: "Alpha" },
  { key: "b", label: "Beta" },
  { key: "c", label: "Gamma", color: "chart-5" },
];

test("bumpRanks: high first, ties share a rank, and lower ranks the smallest first", () => {
  expect(bumpRanks(data, ["a", "b", "c"])).toEqual([
    { b: 1, c: 2, a: 3 },
    { a: 1, b: 2, c: 2 },
  ]);
  expect(bumpRanks([{ t: 5, u: 9 }], ["t", "u"], true)).toEqual([{ t: 1, u: 2 }]);
});

test("BlessBumpChart: a line per series with a dot per step, the name at the end, and a table of ranks", () => {
  const w = mount(BlessBumpChart, { props: { data, x: "week", series, label: "Top shows" } });
  const lines = w.findAll(".bless-bump__line");
  expect(lines).toHaveLength(3);
  expect(lines[0]!.findAll("circle")).toHaveLength(2);
  expect(lines[2]!.attributes("style")).toContain("chart-5");
  expect(lines.map((l) => l.find(".bless-bump__name").text())).toEqual(["Alpha", "Beta", "Gamma"]);
  // Alpha goes from #3 to #1, so its line goes up
  const ys = lines[0]!.findAll("circle").map((c) => Number(c.attributes("cy")));
  expect(ys[1]).toBeLessThan(ys[0]!);
  expect(w.findAll("tbody tr").map((r) => r.text())).toEqual([
    "W1#3 (10)#1 (30)#2 (20)",
    "W2#1 (40)#2 (30)#2 (30)",
  ]);
  expect(w.find("caption").text()).toBe("Top shows");
});
