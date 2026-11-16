import { mount } from "@vue/test-utils";
import BlessOrderHistory, { type BlessPastOrder } from "./BlessOrderHistory.vue";

const items = (n: number) => Array.from({ length: n }, (_, i) => ({ name: `P${i}`, quantity: 1 }));
const orders: BlessPastOrder[] = [
  {
    id: "a",
    number: "#1",
    date: "1 Nov",
    status: "delivered",
    total: 20,
    items: items(5),
    href: "/o/1",
  },
  {
    id: "b",
    number: "#2",
    date: "9 Nov",
    status: "processing",
    total: 5,
    items: [{ name: "Cable", quantity: 2 }],
  },
];

test("BlessOrderHistory: status in words, up to three pictures and a count, the total, and actions named with the number", async () => {
  const w = mount(BlessOrderHistory, { props: { orders } });
  const [a, b] = w.findAll(".bless-orders__order");
  expect(a!.find(".bless-orders__status").text()).toBe("✓ Delivered");
  expect(a!.findAll(".bless-orders__thumb").map((t) => t.text())).toEqual(["P", "P", "P", "+2"]);
  expect(a!.find(".bless-orders__thumbs").attributes("aria-label")).toContain("1 × P0, 1 × P1");
  expect(a!.find(".bless-orders__sum").text().replace(/\s+/g, " ")).toBe("5 items $20.00");
  expect(a!.find(".bless-orders__link").text()).toBe("View order #1");
  await a!.find(".bless-orders__again").trigger("click");
  expect(w.emitted("again")).toEqual([["a"]]);
  // an order in progress cannot be bought again yet, and has no page here
  expect(b!.find(".bless-orders__again").exists()).toBe(false);
  expect(b!.find(".bless-orders__sum span").text()).toBe("2 items");
});
