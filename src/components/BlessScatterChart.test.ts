import { mount } from "@vue/test-utils";
import BlessScatterChart from "./BlessScatterChart.vue";

const points = [
  { x: 1, y: 10, label: "A", group: "g2" },
  { x: 4, y: 40, label: "B" },
  { x: NaN, y: 5 },
];
const groups = [{ id: "g1" }, { id: "g2", label: "Two", color: "danger" }];

test("BlessScatterChart: one dot per valid point, colored by group, with axis names and a table", () => {
  const w = mount(BlessScatterChart, {
    props: { points, groups, xLabel: "Price", yLabel: "Sales" },
  });
  const dots = w.findAll("circle");
  expect(dots).toHaveLength(2);
  expect(dots.map((d) => d.attributes("r"))).toEqual(["4", "4"]);
  expect(dots[0]!.attributes("style")).toContain("var(--bless-color-danger)");
  expect(dots[1]!.attributes("style")).toContain("var(--bless-color-chart-1)");
  expect(dots[0]!.find("title").text()).toBe("A: Price 1, Sales 10");
  // further right and higher up
  expect(Number(dots[1]!.attributes("cx"))).toBeGreaterThan(Number(dots[0]!.attributes("cx")));
  expect(Number(dots[1]!.attributes("cy"))).toBeLessThan(Number(dots[0]!.attributes("cy")));
  expect(w.find("thead").text()).toBe("PointGroupPriceSales");
  expect(w.findAll("tbody tr").map((r) => r.text())).toEqual(["ATwo110", "B440"]);
});

test("BlessScatterChart: a bubble's area grows with its size, and big bubbles are drawn first", () => {
  const w = mount(BlessScatterChart, {
    props: {
      points: [
        { x: 0, y: 0, size: 1 },
        { x: 1, y: 1, size: 4 },
      ],
    },
  });
  const r = w.findAll("circle").map((d) => Number(d.attributes("r")));
  expect(r[0]).toBe(18);
  expect(r[1]).toBeCloseTo(3 + 15 * 0.5);
  expect(w.find("thead").text()).toBe("xySize");
  expect(w.find("tbody").text()).toBe("001114");
});
