import { mount } from "@vue/test-utils";
import BlessDonutChart from "./BlessDonutChart.vue";

const data = [
  { label: "Audio", value: 30 },
  { label: "Video", value: 10, color: "danger" },
  { label: "None", value: 0 },
];

test("BlessDonutChart: a dash per slice in order, the total in the center, and a legend with shares", () => {
  const w = mount(BlessDonutChart, { props: { data, label: "Storage" } });
  const slices = w.findAll(".bless-donut__slice");
  expect(slices).toHaveLength(2);
  expect(slices[0]!.attributes("stroke-dasharray")).toBe("74.4 25.6");
  expect(slices[0]!.attributes("stroke-dashoffset")).toBe("0");
  expect(slices[1]!.attributes("stroke-dashoffset")).toBe("-75");
  expect(slices[1]!.attributes("style")).toContain("var(--bless-color-danger)");
  expect(w.find(".bless-donut__center").text()).toBe("40Total");
  expect(w.findAll("li").map((l) => l.text())).toEqual(["Audio3075%", "Video1025%", "None00%"]);
  expect(w.attributes("aria-label")).toBe("Storage");
  expect(w.find("svg").attributes("aria-hidden")).toBe("true");
});

test("BlessDonutChart: one slice is the full ring, and a pie has no hole and no total", async () => {
  const w = mount(BlessDonutChart, { props: { data: [{ label: "All", value: 5 }], pie: true } });
  expect(w.find(".bless-donut__slice").attributes("stroke-dasharray")).toBe("100 0");
  expect(w.find(".bless-donut__slice").attributes("stroke-width")).toBe("40");
  expect(w.find(".bless-donut__center").exists()).toBe(false);
});
