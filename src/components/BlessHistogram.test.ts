import { mount } from "@vue/test-utils";
import BlessHistogram from "./BlessHistogram.vue";

test("BlessHistogram: a bar per bin with values, edges on the axis, and a table of counts", () => {
  const w = mount(BlessHistogram, {
    props: {
      values: [1, 2, 2, 3, 9, 10],
      bins: 5,
      format: (v: number) => `${v}m`,
      color: "danger",
    },
  });
  // the empty bins draw no bar
  const bars = w.findAll("rect");
  expect(bars.map((b) => b.find("title").text())).toEqual(["0m–2m: 1", "2m–4m: 3", "8m–10m: 2"]);
  expect(Number(bars[1]!.attributes("height")) / Number(bars[0]!.attributes("height"))).toBeCloseTo(
    3,
  );
  const ticks = w.findAll(".bless-plot__tick").map((t) => t.text());
  expect(ticks).toEqual(expect.arrayContaining(["0m", "2m", "4m", "6m", "8m", "10m"]));
  expect(w.find("figure").attributes("style")).toContain("var(--bless-color-danger)");
  expect(w.findAll("tbody tr").map((r) => r.text())).toEqual([
    "0m–2m1",
    "2m–4m3",
    "4m–6m0",
    "6m–8m0",
    "8m–10m2",
  ]);
  expect(w.find("thead").text()).toBe("RangeCount");
});

test("BlessHistogram: no values draws an empty chart", () => {
  const w = mount(BlessHistogram, { props: { values: [] } });
  expect(w.findAll("rect")).toHaveLength(0);
  expect(w.findAll("tbody tr")).toHaveLength(0);
});
