import { mount } from "@vue/test-utils";
import BlessFunnel from "./BlessFunnel.vue";
import BlessRadar from "./BlessRadar.vue";
import { funnelRows } from "./funnel";
import { polygon, radarMax, spoke } from "./radar";

test("funnelRows: widths and rates against the first and the previous stage", () => {
  const rows = funnelRows([
    { label: "Visit", value: 1000 },
    { label: "Sign up", value: 420 },
    { label: "Buy", value: 21 },
  ]);
  expect(rows.map((r) => r.width)).toEqual([100, 42, 2.1]);
  expect(rows[0].ofPrev).toBeNull();
  expect(rows[1]).toMatchObject({ ofFirst: 42, ofPrev: 42 });
  expect(rows[2]).toMatchObject({ ofFirst: 2.1, ofPrev: 5 });
});

test("funnelRows: a tiny stage keeps a visible bar; zero and empty input do not break", () => {
  expect(
    funnelRows([
      { label: "a", value: 1000 },
      { label: "b", value: 1 },
    ])[1].width,
  ).toBe(2);
  const zero = funnelRows([
    { label: "a", value: 0 },
    { label: "b", value: 0 },
  ]);
  expect(zero.map((r) => r.ofPrev)).toEqual([null, 0]);
  expect(zero.every((r) => Number.isFinite(r.width))).toBe(true);
  expect(funnelRows([])).toEqual([]);
});

test("BlessFunnel: an ordered list that reads value and rate as text", () => {
  const w = mount(BlessFunnel, {
    props: {
      stages: [
        { label: "Visit", value: 1000 },
        { label: "Sign up", value: 420 },
      ],
      format: (v: number) => `${v} people`,
    },
  });
  expect(w.find("ol").attributes("aria-label")).toBe("Funnel");
  const rows = w.findAll("li").map((r) => r.text());
  expect(rows[0]).toContain("1000 people");
  expect(rows[0]).toContain("100% of the start");
  expect(rows[1]).toContain("42% of the step before");
  expect(w.find(".bless-funnel__bar").attributes("style")).toContain("100%");
});

test("spoke: 0 points up, and 1 of 4 points right", () => {
  expect(spoke(0, 4, 1, 100, 100)).toEqual({ x: 100, y: 0 });
  const right = spoke(1, 4, 1, 100, 100);
  expect(right.x).toBeCloseTo(200);
  expect(right.y).toBeCloseTo(100);
  expect(spoke(0, 4, 0, 100, 100)).toEqual({ x: 100, y: 100 });
});

test("polygon closes the path; radarMax uses max, else the biggest value, never below 1", () => {
  expect(
    polygon([
      { x: 1, y: 2 },
      { x: 3, y: 4 },
    ]),
  ).toBe("M1 2L3 4Z");
  expect(polygon([])).toBe("");
  const s = [{ name: "a", values: [3, 9, 4] }];
  expect(radarMax(s)).toBe(9);
  expect(radarMax(s, 10)).toBe(10);
  expect(radarMax([{ name: "z", values: [0, 0] }])).toBe(1);
});

test("BlessRadar: draws rings, spokes, one shape per series, and names the data for screen readers", () => {
  const w = mount(BlessRadar, {
    props: {
      axes: ["Speed", "Power", "Range"],
      series: [
        { name: "A", values: [3, 4, 5] },
        { name: "B", values: [5, 1, 2] },
      ],
      rings: 3,
      max: 5,
    },
  });
  expect(w.findAll(".bless-radar__ring")).toHaveLength(3);
  expect(w.findAll(".bless-radar__spoke")).toHaveLength(3);
  expect(w.findAll(".bless-radar__area")).toHaveLength(2);
  expect(w.findAll(".bless-radar__name").map((t) => t.text())).toEqual(["Speed", "Power", "Range"]);
  const label = w.find("svg").attributes("aria-label")!;
  expect(label).toContain("A: Speed 3, Power 4, Range 5");
  expect(label).toContain("B: Speed 5, Power 1, Range 2");
  expect(w.find(".bless-radar__legend").text()).toContain("B");
});

test("BlessRadar: values past max are held at the edge; a missing value counts as 0; one series has no legend", () => {
  const w = mount(BlessRadar, {
    props: { axes: ["a", "b", "c"], series: [{ name: "S", values: [99, 2] }], max: 4, size: 200 },
  });
  const d = w.find(".bless-radar__area").attributes("d")!;
  expect(d).not.toContain("NaN");
  expect(d.startsWith("M100 56")).toBe(true); // first spoke at the full radius, straight up
  expect(w.find(".bless-radar__legend").exists()).toBe(false);
});
