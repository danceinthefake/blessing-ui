import { mount } from "@vue/test-utils";
import BlessChordDiagram, { chordLayout } from "./BlessChordDiagram.vue";

const matrix = [
  [0, 30, 10],
  [20, 0, 0],
  [10, 0, 5],
];
const groups = [
  { key: "a", label: "Brief" },
  { key: "b", label: "Dive" },
  { key: "c", label: "Chat", color: "chart-5" },
];

test("chordLayout: arcs follow the row sums, chunks fill each arc in order", () => {
  const { groups: g, chunks } = chordLayout(matrix, 0);
  const span = (s: { a0: number; a1: number }) => s.a1 - s.a0;
  const total = Math.PI * 2;
  expect(span(g[0]!)).toBeCloseTo((40 / 75) * total, 6);
  expect(span(g[1]!)).toBeCloseTo((20 / 75) * total, 6);
  expect(span(chunks[0]![1]!)).toBeCloseTo((30 / 75) * total, 6);
  expect(chunks[0]![2]!.a0).toBeCloseTo(chunks[0]![1]!.a1, 9);
  expect(g[2]!.a1).toBeCloseTo(total, 6);
});

test("BlessChordDiagram: an arc per group, a ribbon per pair with a flow, names, and a table", () => {
  const w = mount(BlessChordDiagram, { props: { groups, matrix, label: "Listeners moving" } });
  expect(w.findAll(".bless-chord__arc")).toHaveLength(3);
  // pairs a-b, a-c, and c with itself; b-c has no flow
  expect(w.findAll(".bless-chord__ribbon")).toHaveLength(3);
  expect(w.findAll(".bless-chord__label").map((t) => t.text())).toEqual(["Brief", "Dive", "Chat"]);
  expect(w.find(".bless-chord__ribbon title").text()).toBe("Brief → Dive: 30, Dive → Brief: 20");
  expect(w.findAll(".bless-chord__arc")[2]!.attributes("style")).toContain("chart-5");
  expect(w.findAll("thead th").map((t) => t.text())).toEqual([
    "From",
    "To Brief",
    "To Dive",
    "To Chat",
  ]);
  expect(w.findAll("tbody tr")[0]!.text()).toBe("Brief03010");
});
