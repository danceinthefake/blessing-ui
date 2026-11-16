import { mount } from "@vue/test-utils";
import BlessProductCard from "./BlessProductCard.vue";

test("BlessProductCard: the name links, the rating reads in words, the price, and add", async () => {
  const w = mount(BlessProductCard, {
    props: {
      name: "Mic arm",
      href: "/p/arm",
      price: 30,
      was: 40,
      rating: 4.56,
      reviews: 12,
      badge: "New",
    },
  });
  expect(w.find(".bless-product__name a").attributes("href")).toBe("/p/arm");
  expect(w.find(".bless-product__badge").text()).toBe("New");
  expect(w.find(".bless-product__rating [aria-hidden]").text()).toBe("★ 4.6 (12)");
  expect(w.find(".bless-product__rating .bless-sr").text()).toBe("Rated 4.6 out of 5, 12 reviews");
  expect(w.find(".bless-price__off").text()).toBe("25% off");
  const add = w.find(".bless-product__add");
  expect(add.text()).toBe("Add to cart: Mic arm");
  await add.trigger("click");
  expect(w.emitted("add")).toHaveLength(1);
});

test("BlessProductCard: sold out disables add and says so on the image", () => {
  const w = mount(BlessProductCard, { props: { name: "Cable", price: 5, soldOut: true } });
  expect(w.find(".bless-product__badge").text()).toBe("Sold out");
  expect(w.find(".bless-product__add").attributes("disabled")).toBeDefined();
  expect(w.find(".bless-product__name a").exists()).toBe(false);
});
