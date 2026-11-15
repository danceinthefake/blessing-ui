import { mount } from "@vue/test-utils";
import BlessDumbbell from "./BlessDumbbell.vue";

const data = [
  { label: "Downloads", start: 40, end: 55 },
  { label: "Churn", start: 12, end: 9 },
];

test("BlessDumbbell: two dots and a bar per row, a legend, and a table with the change", () => {
  const w = mount(BlessDumbbell, { props: { data, label: "Q3 to Q4" } });
  expect(w.findAll(".bless-dumbbell__row")).toHaveLength(2);
  expect(w.findAll(".bless-dumbbell__start")).toHaveLength(2);
  expect(w.find(".bless-dumbbell__legend").text()).toBe("BeforeAfter");
  const rows = w.findAll("tbody tr").map((r) => r.text());
  expect(rows).toEqual(["Downloads4055+15", "Churn129−3"]);
  expect(w.find("caption").text()).toBe("Q3 to Q4");
});

test("BlessDumbbell: the end dot is right of the start dot for a rise, and labels translate", () => {
  const w = mount(BlessDumbbell, {
    props: { data, labels: { start: "Rencana", end: "Aktual" } },
  });
  const x = (s: string) => Number(w.find(s).attributes("cx"));
  expect(x(".bless-dumbbell__end")).toBeGreaterThan(x(".bless-dumbbell__start"));
  expect(w.findAll("thead th")[1]!.text()).toBe("Rencana");
});
