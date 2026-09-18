import { mount } from "@vue/test-utils";
import BlessChart from "./BlessChart.vue";

test("BlessChart: figure with header, plot slot, palette legend", () => {
  const w = mount(BlessChart, {
    props: { title: "Views", description: "last 7d", legend: ["S1", "S2"] },
    slots: { default: '<svg class="x" />' },
  });
  expect(w.element.tagName).toBe("FIGURE");
  expect(w.find("figcaption strong").text()).toBe("Views");
  expect(w.find(".bless-chart__plot svg.x").exists()).toBe(true);
  const items = w.findAll(".bless-chart__legend li");
  expect(items).toHaveLength(2);
  expect(items[1].attributes("style")).toContain("--bless-color-chart-2");
});
