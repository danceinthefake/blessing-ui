import { mount } from "@vue/test-utils";
import BlessControlChart, { controlLimits } from "./BlessControlChart.vue";

test("controlLimits: the mean and the mean ± 3 sample standard deviations", () => {
  const c = controlLimits([2, 4, 4, 4, 5, 5, 7, 9]);
  expect(c.mean).toBe(5);
  expect(c.ucl).toBeCloseTo(5 + 3 * Math.sqrt(32 / 7), 6);
});

test("BlessControlChart: out-of-control points are diamonds, counted in words, and in the table", () => {
  const w = mount(BlessControlChart, {
    props: {
      values: [10, 10.1, 9.9, 10, 12, 10],
      ucl: 10.5,
      lcl: 9.5,
      center: 10,
      unit: "mm",
      points: ["a", "b", "c", "d", "e", "f"],
    },
  });
  expect(w.findAll("rect.is-out")).toHaveLength(1);
  expect(w.findAll("circle")).toHaveLength(5);
  expect(w.find("figcaption").text()).toContain("1 point is out of control.");
  expect(w.find(".bless-spc__limits").text()).toBe(
    "Mean 10 mm · Upper limit 10.5 mm · Lower limit 9.5 mm",
  );
  const rows = w.findAll("tbody tr");
  expect(rows[4]!.text().replace(/\s+/g, " ")).toBe("e12 mmout of control");
  const ok = mount(BlessControlChart, { props: { values: [1, 1.1, 0.9] } });
  expect(ok.find("figcaption").text()).toContain("All points are within the control limits.");
});
