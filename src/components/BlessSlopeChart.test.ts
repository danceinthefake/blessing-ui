import { mount } from "@vue/test-utils";
import BlessSlopeChart from "./BlessSlopeChart.vue";

const data = [
  { label: "Brief", start: 40, end: 55 },
  { label: "Chat", start: 30, end: 22 },
  { label: "Tech", start: 20, end: 35, color: "chart-4" },
];

test("BlessSlopeChart: a line per item, a fall dashed and gray, the names, and a table with the change", () => {
  const w = mount(BlessSlopeChart, { props: { data, label: "Plays" } });
  const lines = w.findAll(".bless-slope__line");
  expect(lines).toHaveLength(3);
  expect(lines[1]!.classes()).toContain("is-down");
  expect(lines[1]!.attributes("style")).toContain("text-muted");
  expect(lines[0]!.attributes("style")).toContain("chart-1");
  expect(lines[2]!.attributes("style")).toContain("chart-4");
  // a rise goes up: the end is higher on the screen
  const l = lines[0]!.find("line");
  expect(Number(l.attributes("y2"))).toBeLessThan(Number(l.attributes("y1")));
  expect(w.findAll(".bless-slope__col").map((c) => c.text())).toEqual(["Before", "After"]);
  expect(w.findAll("tbody tr").map((r) => r.text())).toEqual([
    "Brief4055+15",
    "Chat3022−8",
    "Tech2035+15",
  ]);
});

test("BlessSlopeChart: labels translate", () => {
  const w = mount(BlessSlopeChart, { props: { data, labels: { start: "2025", end: "2026" } } });
  expect(w.findAll(".bless-slope__col").map((c) => c.text())).toEqual(["2025", "2026"]);
});
