import { mount } from "@vue/test-utils";
import BlessQuotaUsage from "./BlessQuotaUsage.vue";

const quotas = [
  { label: "Storage", used: 12.4, limit: 50, unit: "GB" },
  { label: "Seats", used: 9, limit: 10 },
  { label: "Minutes", used: 640, limit: 600, unit: "min" },
];

test("BlessQuotaUsage: a meter per limit with the use in words, and a word near the end", () => {
  const w = mount(BlessQuotaUsage, {
    props: { quotas },
    slots: { footer: "<a href='#'>Upgrade</a>" },
  });
  const rows = w.findAll(".bless-quota__row");
  expect(rows.map((r) => r.classes().find((c) => c.startsWith("is-")))).toEqual([
    "is-ok",
    "is-almost",
    "is-full",
  ]);
  const m = rows[0]!.find("[role=meter]");
  expect(m.attributes()).toMatchObject({
    "aria-label": "Storage",
    "aria-valuemax": "50",
    "aria-valuenow": "12.4",
    "aria-valuetext": "12.4 of 50 GB",
  });
  expect(rows[1]!.find("[role=meter]").attributes("aria-valuetext")).toBe("9 of 10, Almost full");
  expect(rows[2]!.find(".bless-quota__note").text()).toBe("Limit reached");
  expect(rows[2]!.find(".bless-quota__bar").attributes("style")).toContain("inline-size: 100%");
  expect(rows[2]!.find("[role=meter]").attributes("aria-valuenow")).toBe("600");
  expect(w.find(".bless-quota__footer a").text()).toBe("Upgrade");
});

test("BlessQuotaUsage: another warn share, and labels translate", () => {
  const w = mount(BlessQuotaUsage, {
    props: {
      quotas: [quotas[1]!],
      warn: 0.95,
      labels: { of: (u: string, l: string) => `${u} dari ${l}` },
    },
  });
  expect(w.find(".bless-quota__row").classes()).toContain("is-ok");
  expect(w.find(".bless-quota__of").text()).toBe("9 dari 10");
});
