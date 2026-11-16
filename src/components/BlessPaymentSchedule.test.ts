import { mount } from "@vue/test-utils";
import BlessPaymentSchedule, { amortize } from "./BlessPaymentSchedule.vue";

test("amortize: equal payments, the balance ends at 0, and the months roll over the year", () => {
  const rows = amortize(1200, 12, 12, "2026-11");
  // P·r/(1−(1+r)^−n) with r = 1%
  expect(rows[0]!.payment).toBeCloseTo(106.62, 2);
  expect(rows[0]!.interest).toBeCloseTo(12, 6);
  expect(rows.at(-1)!.balance).toBe(0);
  expect(rows.map((r) => r.month).slice(0, 3)).toEqual(["2026-11", "2026-12", "2027-01"]);
  const sum = rows.reduce((n, r) => n + r.principal, 0);
  expect(sum).toBeCloseTo(1200, 6);
  expect(amortize(300, 0, 3, "2026-01").map((r) => r.payment)).toEqual([100, 100, 100]);
});

test("BlessPaymentSchedule: totals, the rows, and paid rows marked in words", () => {
  const w = mount(BlessPaymentSchedule, {
    props: { principal: 300, rate: 0, months: 3, start: "2026-11", paid: 1 },
  });
  expect(w.find(".bless-payments__totals").text()).toBe(
    "You pay $300.00 in all, of which $0.00 is interest.",
  );
  const rows = w.findAll("tbody tr");
  expect(rows).toHaveLength(3);
  expect(rows[0]!.classes()).toContain("is-paid");
  expect(rows[0]!.find("th").text()).toBe("1 ✓ paid");
  expect(rows[1]!.findAll("td").map((c) => c.text())).toEqual([
    "Dec 2026",
    "$100.00",
    "$100.00",
    "$0.00",
    "$100.00",
  ]);
});
