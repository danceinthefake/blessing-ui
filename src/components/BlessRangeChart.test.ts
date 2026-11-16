import { mount } from "@vue/test-utils";
import BlessRangeChart from "./BlessRangeChart.vue";

const data = [
  { label: "Mon", low: 20, high: 50, value: 35 },
  { label: "Tue", low: 30, high: 40 },
];

test("BlessRangeChart: a bar from low to high, a mark, and a table", () => {
  const w = mount(BlessRangeChart, { props: { data, label: "Minutes per day" } });
  const rows = w.findAll(".bless-rangechart__row");
  expect(rows).toHaveLength(2);
  const bar = rows[0]!.find("rect");
  const x = Number(bar.attributes("x"));
  const mark = Number(rows[0]!.find(".bless-rangechart__mark").attributes("x1"));
  expect(mark).toBeGreaterThan(x);
  expect(mark).toBeLessThan(x + Number(bar.attributes("width")));
  expect(rows[1]!.find(".bless-rangechart__mark").exists()).toBe(false);
  expect(w.findAll("tbody tr").map((r) => r.text())).toEqual(["Mon205035", "Tue3040–"]);
});

test("BlessRangeChart: no mark column without marks, and labels translate", () => {
  const w = mount(BlessRangeChart, { props: { data: [data[1]!], labels: { low: "Rendah" } } });
  expect(w.findAll("thead th").map((t) => t.text())).toEqual(["Item", "Rendah", "High"]);
});
