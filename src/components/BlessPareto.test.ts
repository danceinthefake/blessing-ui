import { mount } from "@vue/test-utils";
import BlessPareto, { paretoRows } from "./BlessPareto.vue";

const data = [
  { label: "Echo", value: 10 },
  { label: "Noise", value: 50 },
  { label: "Clipping", value: 30 },
  { label: "Nothing", value: 0 },
  { label: "Pops", value: 10 },
];

test("paretoRows: high to low, zero dropped, with the running share", () => {
  expect(paretoRows(data).map((r) => [r.label, r.running])).toEqual([
    ["Noise", 0.5],
    ["Clipping", 0.8],
    ["Echo", 0.9],
    ["Pops", 1],
  ]);
});

test("BlessPareto: the bars up to the cut are full, the rest lighter, with a line and a table", () => {
  const w = mount(BlessPareto, { props: { data, label: "Problems in episode 41" } });
  const bars = w.findAll(".bless-plot__mark");
  expect(bars.map((b) => b.classes().includes("is-rest"))).toEqual([false, false, true, true]);
  expect(w.find(".bless-pareto__line").attributes("points")!.split(" ")).toHaveLength(4);
  expect(w.findAll(".bless-pareto__dot")).toHaveLength(4);
  expect(w.findAll("tbody tr").map((r) => r.text())).toEqual([
    "Noise5050%",
    "Clipping3080%",
    "Echo1090%",
    "Pops10100%",
  ]);
});

test("BlessPareto: a different cut, and labels translate", () => {
  const w = mount(BlessPareto, { props: { data, cut: 0.5, labels: { running: "Kumulatif" } } });
  expect(w.findAll(".bless-plot__mark:not(.is-rest)")).toHaveLength(1);
  expect(w.findAll("thead th")[2]!.text()).toBe("Kumulatif");
});
