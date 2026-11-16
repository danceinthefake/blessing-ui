import { mount } from "@vue/test-utils";
import BlessPriceTicker from "./BlessPriceTicker.vue";

test("BlessPriceTicker: symbol, price, and change with an arrow and a sign, in a marquee", () => {
  const w = mount(BlessPriceTicker, {
    props: {
      currency: "USD",
      items: [
        { symbol: "AAA", price: 12.5, change: 1.2 },
        { symbol: "BBB", price: 3, change: -0.456 },
        { symbol: "CCC", price: 7, change: 0 },
      ],
    },
  });
  expect(w.find(".bless-marquee").attributes("aria-label")).toBe("Prices");
  const items = w.findAll(".bless-marquee__run")[0]!.findAll(".bless-ticker__item");
  expect(items.map((i) => i.text().replace(/\s+/g, " "))).toEqual([
    "AAA $12.50 ▲ +1.20%",
    "BBB $3.00 ▼ -0.46%",
    "CCC $7.00 ■ 0.00%",
  ]);
  expect(items[1]!.find(".bless-ticker__change").classes()).toContain("is-down");
});
