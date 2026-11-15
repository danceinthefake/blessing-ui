import { mount } from "@vue/test-utils";
import BlessSunburst from "./BlessSunburst.vue";

const data = [
  {
    id: "eng",
    label: "Engineering",
    children: [
      { id: "eng-pay", label: "Pay", value: 60 },
      { id: "eng-tools", label: "Tools", value: 15 },
    ],
  },
  { id: "ops", label: "Operations", value: 25, color: "chart-3" },
  { id: "none", label: "Empty", value: 0 },
];

test("BlessSunburst: a ring for each level, children inherit the color, and a table by path", () => {
  const w = mount(BlessSunburst, { props: { data, label: "Budget" } });
  const segs = w.findAll(".bless-sunburst__seg");
  expect(segs).toHaveLength(4); // the empty part draws nothing
  expect(segs[0]!.attributes("style")).toContain("var(--bless-color-chart-1)");
  expect(segs[1]!.attributes("style")).toContain("var(--bless-color-chart-1)");
  expect(segs[1]!.attributes("style")).toContain("--_k: 72%");
  expect(segs[3]!.attributes("style")).toContain("var(--bless-color-chart-3)");
  expect(w.find(".bless-sunburst__center").text()).toBe("100Total");
  const rows = w.findAll("tbody tr").map((r) => r.text());
  expect(rows[1]).toBe("Engineering › Pay6060%");
  expect(w.find("caption").text()).toBe("Budget");
});

test("BlessSunburst: one part is a full ring, and labels translate", () => {
  const w = mount(BlessSunburst, {
    props: { data: [{ id: "a", label: "All", value: 5 }], labels: { total: "Jumlah" } },
  });
  expect(w.find(".bless-sunburst__seg").attributes("d")).toMatch(/A98 98 0 1 1/);
  expect(w.find(".bless-sunburst__center").text()).toBe("5Jumlah");
});
