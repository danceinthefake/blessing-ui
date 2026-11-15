import { mount } from "@vue/test-utils";
import BlessBoxPlot from "./BlessBoxPlot.vue";

const groups = [
  { label: "Mon", values: [1, 2, 3, 4, 5, 6, 7, 8, 9, 40] },
  { label: "Tue", values: [] },
];

test("BlessBoxPlot: a box from the quartiles, whiskers, a median line, outliers, and a table", () => {
  const w = mount(BlessBoxPlot, { props: { groups, height: 222 } });
  const box = w.find(".bless-boxplot__box");
  const median = w.find(".bless-boxplot__median");
  const y = (el: typeof box, a: string) => Number(el.attributes(a));
  // the median sits inside the box
  expect(y(median, "y1")).toBeGreaterThan(y(box, "y"));
  expect(y(median, "y1")).toBeLessThan(y(box, "y") + y(box, "height"));
  expect(w.findAll(".bless-boxplot__whisker")).toHaveLength(4);
  expect(w.findAll(".bless-boxplot__out")).toHaveLength(1);
  // a group with no values gets a label but no box
  expect(w.findAll(".bless-boxplot__group")).toHaveLength(1);
  expect(w.findAll(".bless-plot__cat").map((c) => c.text())).toEqual(["Mon", "Tue"]);
  expect(w.findAll("tbody tr").map((r) => r.findAll("th, td").map((c) => c.text()))).toEqual([
    ["Mon", "1", "3.25", "5.5", "7.75", "9", "40"],
    ["Tue", "–"],
  ]);
  expect(w.find("thead").text()).toBe("GroupLowLower quartileMedianUpper quartileHighOutliers");
});
