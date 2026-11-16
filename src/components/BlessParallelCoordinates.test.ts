import { mount } from "@vue/test-utils";
import BlessParallelCoordinates from "./BlessParallelCoordinates.vue";

const axes = [
  { key: "plays", label: "Plays" },
  { key: "minutes", label: "Minutes", format: (v: number) => `${v} min` },
];
const data = [
  { show: "Brief", plays: 50, minutes: 20 },
  { show: "Dive", plays: 30, minutes: 60, color: "chart-4" },
];

test("BlessParallelCoordinates: an axis per measure with its own scale, a line per row, and a table", () => {
  const w = mount(BlessParallelCoordinates, {
    props: { data, name: "show", axes, label: "Shows" },
  });
  expect(w.findAll(".bless-parallel__axis")).toHaveLength(2);
  expect(w.findAll(".bless-parallel__name").map((t) => t.text())).toEqual(["Plays", "Minutes"]);
  const lines = w.findAll(".bless-parallel__line");
  expect(lines).toHaveLength(2);
  expect(lines[1]!.attributes("style")).toContain("chart-4");
  // Brief is high on plays and low on minutes: its line goes down
  const [p1, p2] = lines[0]!
    .attributes("points")!
    .split(" ")
    .map((p) => Number(p.split(",")[1]));
  expect(p2).toBeGreaterThan(p1!);
  expect(w.findAll("tbody tr").map((r) => r.text())).toEqual(["Brief5020 min", "Dive3060 min"]);
  expect(w.findAll(".bless-parallel__legend li").map((l) => l.text())).toEqual(["Brief", "Dive"]);
});
