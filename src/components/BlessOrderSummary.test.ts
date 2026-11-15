import { mount } from "@vue/test-utils";
import BlessOrderSummary from "./BlessOrderSummary.vue";

const lines = [
  { id: 1, name: "Mic stand", price: 25, quantity: 2, note: "Black" },
  { id: 2, name: "Pop filter", price: 9.5, quantity: 1 },
];

test("BlessOrderSummary: lines, then the subtotal, discount, shipping, tax, and total", () => {
  const w = mount(BlessOrderSummary, {
    props: { lines, discount: 10, discountLabel: "STUDIO10", shipping: 0, tax: 4.4 },
    slots: { footer: "<button>Pay</button>" },
  });
  expect(w.findAll(".bless-ordersum__line").map((l) => l.text())).toEqual([
    "Mic standBlackQty 2$50.00",
    "Pop filterQty 1$9.50",
  ]);
  expect(w.findAll(".bless-ordersum__sums > div").map((d) => d.text())).toEqual([
    "Subtotal$59.50",
    "Discount (STUDIO10)−$10.00",
    "ShippingFree",
    "Tax$4.40",
    "Total$53.90",
  ]);
  expect(w.find(".bless-ordersum__footer button").text()).toBe("Pay");
  expect(w.attributes("aria-label")).toBe("Order summary");
});

test("BlessOrderSummary: no shipping hides the row, another currency and locale, and labels translate", () => {
  const w = mount(BlessOrderSummary, {
    props: {
      lines: [{ id: 1, name: "Kaos", price: 150000, quantity: 1 }],
      currency: "IDR",
      locale: "id",
      labels: { total: "Jumlah" },
    },
  });
  const rows = w.findAll(".bless-ordersum__sums > div").map((d) => d.text().replace(/\s/g, " "));
  expect(rows).toHaveLength(2);
  expect(rows[1]).toBe("JumlahRp 150.000");
});
