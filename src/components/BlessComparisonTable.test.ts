import { mount } from "@vue/test-utils";
import BlessComparisonTable from "./BlessComparisonTable.vue";

const plans = [
  { key: "free", label: "Free", note: "$0" },
  { key: "pro", label: "Pro", note: "$9 a month", highlight: true },
];
const rows = [
  { label: "Hosting", group: true },
  { label: "Storage", values: { free: "1 GB", pro: "50 GB" } },
  { label: "Transcripts", values: { free: false, pro: true } },
  { label: "Custom domain", values: { pro: true } },
];

test("BlessComparisonTable: plans as columns, group rows, and yes and no in words", () => {
  const w = mount(BlessComparisonTable, { props: { plans, rows } });
  expect(w.findAll("thead th").map((t) => t.text())).toEqual([
    "Feature",
    "Free$0",
    "Pro$9 a month",
  ]);
  expect(w.findAll("thead th")[2]!.classes()).toContain("is-highlight");
  const group = w.find(".bless-cmptable__group th");
  expect(group.text()).toBe("Hosting");
  expect(group.attributes("colspan")).toBe("3");
  const body = w.findAll("tbody tr:not(.bless-cmptable__group)").map((r) => r.text());
  expect(body).toEqual([
    "Storage1 GB50 GB",
    "Transcripts–Not includedIncluded",
    "Custom domain–Not includedIncluded",
  ]);
  expect(w.find("caption").text()).toBe("Compare plans");
});

test("BlessComparisonTable: labels translate", () => {
  const w = mount(BlessComparisonTable, { props: { plans, rows, labels: { yes: "Termasuk" } } });
  expect(w.findAll("tbody tr")[2]!.text()).toContain("Termasuk");
});
