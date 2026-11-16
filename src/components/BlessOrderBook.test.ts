import { mount } from "@vue/test-utils";
import BlessOrderBook, { bookSides } from "./BlessOrderBook.vue";

const bids = [
  { price: 99, size: 2 },
  { price: 100, size: 1 },
  { price: 98, size: 5 },
];
const asks = [
  { price: 102, size: 3 },
  { price: 101, size: 1 },
];

test("bookSides: best price first, running totals, spread, and mid", () => {
  const b = bookSides(bids, asks, 2);
  expect(b.bids).toEqual([
    { price: 100, size: 1, total: 1 },
    { price: 99, size: 2, total: 3 },
  ]);
  expect(b.asks.map((a) => a.total)).toEqual([1, 4]);
  expect(b.spread).toBe(1);
  expect(b.mid).toBe(100.5);
});

test("BlessOrderBook: asks above with the best next to the spread, bids below, side words, depth bars", () => {
  const w = mount(BlessOrderBook, { props: { bids, asks } });
  const rows = w.findAll("tbody tr");
  expect(rows.map((r) => r.text().replace(/\s+/g, " ").trim())).toEqual([
    "Ask102.0034",
    "Ask101.0011",
    "Spread 1.00 (0.995%)",
    "Bid100.0011",
    "Bid99.0023",
    "Bid98.0058",
  ]);
  // the biggest total fills the bar
  expect(rows[5]!.attributes("style")).toContain("--_depth: 100%");
  expect(rows[0]!.attributes("style")).toContain("--_depth: 50%");
  expect(w.find("table").attributes("aria-label")).toBe("Order book");
});
