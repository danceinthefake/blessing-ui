import { mount } from "@vue/test-utils";
import BlessInvoice, { invoiceTotals } from "./BlessInvoice.vue";

const lines = [
  { description: "Mic", quantity: 2, price: 100, tax: 11 },
  { description: "Cable", quantity: 3, price: 10, tax: 11 },
  { description: "Repair", quantity: 1, price: 50 },
];

test("invoiceTotals: subtotal, tax by rate, and total", () => {
  expect(invoiceTotals(lines)).toEqual({ subtotal: 280, taxes: [[11, 25.3]], total: 305.3 });
});

test("BlessInvoice: parties, dates, lines, totals, paid, the amount due, and the status in words", () => {
  const w = mount(BlessInvoice, {
    props: {
      number: "INV-0042",
      issued: "2026-11-16",
      due: "2026-11-30",
      from: { name: "Home Studio", lines: ["Jl. Kemang 12"] },
      to: { name: "Radio Kita" },
      lines,
      paid: 100,
      status: "overdue",
    },
  });
  expect(w.find(".bless-invoice__status").text()).toBe("! Overdue");
  expect(w.findAll("time").map((t) => t.attributes("datetime"))).toEqual([
    "2026-11-16",
    "2026-11-30",
  ]);
  expect(
    w
      .findAll("tbody tr")[0]!
      .findAll("td")
      .map((c) => c.text()),
  ).toEqual(["Mic · Tax 11%", "2", "$100.00", "$200.00"]);
  expect(w.findAll("tfoot tr").map((r) => r.text().replace(/\s+/g, " "))).toEqual([
    "Subtotal$280.00",
    "Tax 11%$25.30",
    "Total$305.30",
    "Paid−$100.00",
    "Amount due$205.30",
  ]);
});
