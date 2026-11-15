import { mount } from "@vue/test-utils";
import BlessWaffle, { waffleCells } from "./BlessWaffle.vue";

test("waffleCells: whole cells that add up to 100, the largest remainders round up", () => {
  expect(waffleCells([1, 1, 1])).toEqual([34, 33, 33]);
  expect(waffleCells([50, 30, 20])).toEqual([50, 30, 20]);
  expect(waffleCells([0, 0])).toEqual([0, 0]);
  expect(waffleCells([2, -1, 2])).toEqual([50, 0, 50]);
});

test("BlessWaffle: 100 cells colored by share, and a visible legend with the share and value", () => {
  const w = mount(BlessWaffle, {
    props: {
      label: "Listeners by app",
      data: [
        { label: "Spotify", value: 620 },
        { label: "Apple", value: 280, color: "chart-4" },
        { label: "Other", value: 100 },
      ],
    },
  });
  const cells = w.findAll(".bless-waffle__cell");
  expect(cells).toHaveLength(100);
  expect(cells.filter((c) => c.attributes("style")?.includes("chart-4"))).toHaveLength(28);
  expect(w.attributes("aria-label")).toBe("Listeners by app");
  expect(w.findAll(".bless-waffle__legend li").map((l) => l.text())).toEqual([
    "Spotify62% · 620",
    "Apple28% · 280",
    "Other10% · 100",
  ]);
});

test("BlessWaffle: no data leaves 100 empty cells", () => {
  const w = mount(BlessWaffle, { props: { data: [] } });
  expect(w.findAll(".bless-waffle__cell.is-empty")).toHaveLength(100);
});
