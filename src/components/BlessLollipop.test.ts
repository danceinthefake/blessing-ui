import { mount } from "@vue/test-utils";
import BlessLollipop from "./BlessLollipop.vue";

const data = [
  { label: "Echo", value: 12 },
  { label: "Noise", value: 40, color: "danger" },
  { label: "Pops", value: 25 },
];

test("BlessLollipop: a stick and a dot per item, the value at the end, and a table", () => {
  const w = mount(BlessLollipop, { props: { data, label: "Problems" } });
  const rows = w.findAll(".bless-lollipop__row");
  expect(rows).toHaveLength(3);
  expect(rows.map((r) => r.find(".bless-plot__cat").text())).toEqual(["Echo", "Noise", "Pops"]);
  expect(rows[1]!.attributes("style")).toContain("var(--bless-color-danger)");
  const line = rows[1]!.find("line");
  expect(Number(line.attributes("x2"))).toBeGreaterThan(Number(line.attributes("x1")));
  expect(rows[1]!.find("circle").attributes("cx")).toBe(line.attributes("x2"));
  expect(w.findAll("tbody tr").map((r) => r.text())).toEqual(["Echo12", "Noise40", "Pops25"]);
});

test("BlessLollipop: sort puts the items high first, and labels translate", () => {
  const w = mount(BlessLollipop, { props: { data, sort: true, labels: { value: "Nilai" } } });
  expect(w.findAll(".bless-plot__cat").map((t) => t.text())).toEqual(["Noise", "Pops", "Echo"]);
  expect(w.findAll("thead th")[1]!.text()).toBe("Nilai");
});
