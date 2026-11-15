import { mount } from "@vue/test-utils";
import BlessHeatmap from "./BlessHeatmap.vue";

test("BlessHeatmap: a table with headers, cells mixed by value, empty cells, and a legend", () => {
  const w = mount(BlessHeatmap, {
    props: {
      rows: ["Mon", "Tue"],
      columns: ["9", "10"],
      values: [
        [0, 50],
        [100, null],
      ],
      color: "success",
      label: "Plays",
    },
  });
  expect(w.find("caption").text()).toBe("Plays");
  expect(w.findAll("thead th").map((t) => t.text())).toEqual(["9", "10"]);
  expect(w.findAll("tbody th").map((t) => t.text())).toEqual(["Mon", "Tue"]);
  const cells = w.findAll(".bless-heatmap__cell");
  expect(cells.map((c) => c.attributes("style"))).toEqual([
    "--_m: 12%;",
    "--_m: 56%;",
    "--_m: 100%;",
    undefined,
  ]);
  expect(cells[3]!.classes()).toContain("bless-heatmap__cell--empty");
  expect(cells.map((c) => c.text())).toEqual(["0", "50", "100", "–"]);
  expect(cells[1]!.attributes("title")).toBe("Mon · 10: 50");
  expect(w.find("table").attributes("style")).toContain("var(--bless-color-success)");
  expect(w.find(".bless-heatmap__legend").text()).toBe("0100");
});

test("BlessHeatmap: one value fills its cell, and no data has no legend", () => {
  const w = mount(BlessHeatmap, { props: { rows: ["a"], columns: ["b"], values: [[7]] } });
  expect(w.find(".bless-heatmap__cell").attributes("style")).toBe("--_m: 100%;");
  const e = mount(BlessHeatmap, { props: { rows: ["a"], columns: ["b"], values: [] } });
  expect(e.find(".bless-heatmap__legend").exists()).toBe(false);
});
