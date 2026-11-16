import { mount } from "@vue/test-utils";
import BlessStockLevels, { stockState } from "./BlessStockLevels.vue";

test("stockState: free stock, out at zero, low at or below the reorder point", () => {
  expect(stockState({ sku: "a", name: "", onHand: 10, reserved: 4, reorderAt: 5 })).toEqual({
    available: 6,
    state: "ok",
  });
  expect(stockState({ sku: "a", name: "", onHand: 10, reserved: 5, reorderAt: 5 }).state).toBe(
    "low",
  );
  expect(stockState({ sku: "a", name: "", onHand: 3, reserved: 5, reorderAt: 5 })).toEqual({
    available: 0,
    state: "out",
  });
});

const items = [
  { sku: "MIC-1", name: "Mic", onHand: 40, reorderAt: 10, location: "A1" },
  { sku: "CBL-3", name: "Cable", onHand: 8, reserved: 2, reorderAt: 10, unit: "pcs" },
  { sku: "FOM-2", name: "Foam", onHand: 0, reorderAt: 5 },
];

test("BlessStockLevels: worst first, state in words, the count, and the low filter", async () => {
  const w = mount(BlessStockLevels, { props: { items } });
  expect(w.findAll("tbody th").map((t) => t.text())).toEqual(["Foam", "Cable", "Mic"]);
  expect(w.findAll(".bless-stock__state").map((s) => s.text())).toEqual([
    "✕ Out of stock",
    "! Low",
    "✓ In stock",
  ]);
  expect(w.findAll(".bless-stock__free")[1]!.text()).toBe("6 pcs");
  expect(w.find("[role=status]").text()).toBe("2 of 3 items need a reorder");
  await w.find("input[type=checkbox]").setValue(true);
  expect(w.findAll("tbody tr")).toHaveLength(2);
});
