import { mount } from "@vue/test-utils";
import BlessRoseChart from "./BlessRoseChart.vue";

const data = [
  { label: "Mon", value: 100 },
  { label: "Tue", value: 25 },
  { label: "Wed", value: 0 },
  { label: "Thu", value: 50, color: "chart-3" },
];

test("BlessRoseChart: one wedge per item, the area follows the value, labels around, and a table", () => {
  const w = mount(BlessRoseChart, { props: { data, label: "Plays by day" } });
  const wedges = w.findAll(".bless-rose__wedge");
  expect(wedges).toHaveLength(4);
  // the arc radius: the full value reaches the edge, a quarter of it reaches half the radius
  const radius = (i: number) => Number(wedges[i]!.attributes("d")!.match(/A([\d.]+)/)?.[1]);
  expect(radius(0)).toBeCloseTo(112, 0);
  expect(radius(1)).toBeCloseTo(56, 0);
  expect(wedges[2]!.attributes("d")).toBe("");
  expect(wedges[3]!.attributes("style")).toContain("chart-3");
  expect(w.findAll(".bless-rose__label").map((t) => t.text())).toEqual([
    "Mon",
    "Tue",
    "Wed",
    "Thu",
  ]);
  expect(w.findAll("tbody tr").map((r) => r.text())).toEqual(["Mon100", "Tue25", "Wed0", "Thu50"]);
  expect(w.find("caption").text()).toBe("Plays by day");
});
