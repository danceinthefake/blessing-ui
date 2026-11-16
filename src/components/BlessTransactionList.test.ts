import { mount } from "@vue/test-utils";
import BlessTransactionList from "./BlessTransactionList.vue";

const norm = (s: string) => s.replace(/\s+/g, " ").trim();

test("BlessTransactionList: newest day first, a day total, signs, categories, and pending", () => {
  const w = mount(BlessTransactionList, {
    props: {
      transactions: [
        { id: "a", title: "Coffee", amount: -4.5, date: "2026-11-14", category: "Food" },
        { id: "b", title: "Client pay", amount: 300, date: "2026-11-16", category: "Income" },
        { id: "c", title: "Cables", amount: -20, date: "2026-11-16", pending: true },
      ],
    },
  });
  const days = w.findAll(".bless-txns__day");
  expect(days.map((d) => norm(d.find(".bless-txns__head").text()))).toEqual([
    "Mon, Nov 16 Day total +$280.00",
    "Sat, Nov 14 Day total −$4.50",
  ]);
  const rows = days[0]!.findAll(".bless-txns__row");
  expect(rows[0]!.find(".bless-txns__amount").text()).toBe("+$300.00");
  expect(rows[0]!.find(".bless-txns__amount").classes()).toContain("is-in");
  expect(rows[1]!.find(".bless-txns__amount").text()).toBe("−$20.00");
  expect(rows[1]!.find(".bless-txns__meta").text()).toBe("pending");
  expect(rows[1]!.find(".bless-txns__icon").text()).toBe("C");
});
