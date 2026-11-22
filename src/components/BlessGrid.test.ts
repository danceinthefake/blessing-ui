import { mount } from "@vue/test-utils";
import BlessGrid from "./BlessGrid.vue";

const cols = (props: Record<string, unknown>) =>
  (mount(BlessGrid, { props }).element as HTMLElement).style.gridTemplateColumns;

test("BlessGrid: columns alone is a fixed count that cannot overflow", () => {
  expect(cols({ columns: 3 })).toBe("repeat(3, minmax(0px, 1fr))");
});

test("BlessGrid: min alone fits as many columns as the width holds", () => {
  expect(cols({ min: "12rem" })).toBe("repeat(auto-fit, minmax(min(12rem, 100%), 1fr))");
  // the default narrowest column
  expect(cols({})).toContain("min(16rem, 100%)");
});

test("BlessGrid: columns and min give at most that many, never narrower than min", () => {
  const t = cols({ columns: 4, min: "10rem", gap: 2 });
  expect(t).toContain("max(min(10rem, 100%)");
  expect(t).toContain("(100% - 3 * var(--bless-space-2)) / 4");
});

test("BlessGrid: tag, gap, and align", () => {
  const w = mount(BlessGrid, { props: { as: "ul", gap: 8, align: "start" } });
  expect(w.element.tagName).toBe("UL");
  const s = (w.element as HTMLElement).style;
  expect(s.gap).toBe("var(--bless-space-8)");
  expect(s.alignItems).toBe("start");
});
