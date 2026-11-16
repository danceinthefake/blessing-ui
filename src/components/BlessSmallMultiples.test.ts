import { mount } from "@vue/test-utils";
import BlessSmallMultiples from "./BlessSmallMultiples.vue";

const series = [
  { label: "Brief", values: [10, 20, 30] },
  { label: "Dive", values: [5, 8], color: "chart-4" },
];

test("BlessSmallMultiples: a small chart per series on one scale, the last value, and a table", () => {
  const w = mount(BlessSmallMultiples, {
    props: { series, steps: ["Jan", "Feb", "Mar"], label: "Plays" },
  });
  const sparks = w.findAllComponents({ name: "BlessSparkline" });
  expect(sparks).toHaveLength(2);
  expect(sparks.map((s) => [s.props("min"), s.props("max")])).toEqual([
    [0, 40],
    [0, 40],
  ]);
  expect(sparks[1]!.props("color")).toBe("chart-4");
  expect(sparks[0]!.props("color")).toBe("chart-1");
  expect(w.findAll(".bless-multiples__head").map((h) => h.text())).toEqual(["Brief30", "Dive8"]);
  expect(w.find(".bless-multiples__scale").text()).toBe("All charts share one scale: 0 to 40");
  expect(w.findAll("thead th").map((t) => t.text())).toEqual(["Item", "Jan", "Feb", "Mar"]);
  expect(w.findAll("tbody tr")[1]!.text()).toBe("Dive58–");
});
