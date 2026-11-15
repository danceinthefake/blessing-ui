import { mount } from "@vue/test-utils";
import BlessPyramid from "./BlessPyramid.vue";

const data = [
  { label: "18–24", left: 20, right: 10 },
  { label: "25–34", left: 40, right: 30 },
];

test("BlessPyramid: two bars per row on one scale, a legend, and a table for screen readers", () => {
  const w = mount(BlessPyramid, {
    props: { data, label: "Listeners by age", labels: { left: "Men", right: "Women" } },
  });
  const rows = w.findAll(".bless-pyramid__row");
  expect(rows).toHaveLength(2);
  const bars = rows[0]!.findAll(".bless-pyramid__bar");
  expect(bars[0]!.attributes("style")).toContain("--_w: 0.5");
  expect(bars[1]!.attributes("style")).toContain("--_w: 0.25");
  expect(w.find(".bless-pyramid__legend").text()).toBe("MenWomen");
  expect(w.attributes("style")).toContain("var(--bless-color-chart-2)");
  expect(w.findAll("tbody tr").map((r) => r.text())).toEqual(["18–242010", "25–344030"]);
  expect(w.find("caption").text()).toBe("Listeners by age");
});

test("BlessPyramid: the format and the default words", () => {
  const w = mount(BlessPyramid, { props: { data, format: (v: number) => `${v}%` } });
  expect(w.find(".bless-pyramid__value").text()).toBe("20%");
  expect(w.findAll("thead th").map((t) => t.text())).toEqual(["Group", "Left", "Right"]);
});
