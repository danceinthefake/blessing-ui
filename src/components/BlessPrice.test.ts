import { mount } from "@vue/test-utils";
import BlessPrice from "./BlessPrice.vue";

test("BlessPrice: a plain price, and a unit price", () => {
  const w = mount(BlessPrice, { props: { amount: 4.5, unitPrice: 9, unit: "kg" } });
  expect(w.find(".bless-price__now").text()).toBe("$4.50");
  expect(w.find(".bless-price__was").exists()).toBe(false);
  expect(w.find(".bless-price__unit").text()).toBe("$9.00 / kg");
});

test("BlessPrice: a sale shows the old price, the percent off, and a sentence for screen readers", () => {
  const w = mount(BlessPrice, { props: { amount: 75, was: 100 } });
  expect(w.find(".bless-price__was").text()).toBe("$100.00");
  expect(w.find(".bless-price__off").text()).toBe("25% off");
  expect(w.find(".bless-sr").text()).toBe("Now $75.00, was $100.00, 25% off");
  // a "was" price that is not higher is no sale
  const same = mount(BlessPrice, { props: { amount: 75, was: 75 } });
  expect(same.find(".bless-price__off").exists()).toBe(false);
});
