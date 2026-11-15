import { mount } from "@vue/test-utils";
import BlessRadialBar from "./BlessRadialBar.vue";

test("BlessRadialBar: a ring per item from the outside in, filled to its share, with a legend", () => {
  const w = mount(BlessRadialBar, {
    props: {
      label: "Goals this week",
      data: [
        { label: "Episodes", value: 3, max: 4 },
        { label: "Clips", value: 12, max: 10, color: "chart-4" },
        { label: "Posts", value: 0 },
      ],
    },
  });
  const fills = w.findAll(".bless-radialbar__fill");
  expect(fills).toHaveLength(2); // nothing to fill for 0
  expect(fills[0]!.attributes("stroke-dasharray")).toBe("75 100");
  expect(fills[1]!.attributes("stroke-dasharray")).toBe("100 100");
  expect(fills[1]!.attributes("style")).toContain("chart-4");
  const r = w.findAll(".bless-radialbar__track").map((t) => Number(t.attributes("r")));
  expect(r[0]).toBeGreaterThan(r[1]!);
  expect(w.findAll(".bless-radialbar__legend li").map((l) => l.text())).toEqual([
    "Episodes75% · 3 / 4",
    "Clips100% · 12 / 10",
    "Posts0% · 0 / 100",
  ]);
  expect(w.attributes("aria-label")).toBe("Goals this week");
});

test("BlessRadialBar: rings that do not fit in the circle are left out of the drawing only", () => {
  const data = Array.from({ length: 6 }, (_, i) => ({ label: `g${i}`, value: 50 }));
  const w = mount(BlessRadialBar, { props: { data } });
  expect(w.findAll(".bless-radialbar__track")).toHaveLength(4);
  expect(w.findAll(".bless-radialbar__legend li")).toHaveLength(6);
});
