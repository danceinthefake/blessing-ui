import { stockState, type BlessPickLine, type BlessStockItem } from "blessing-ui";

export interface Item extends BlessStockItem {
  /** the GS1 number on the pack */
  barcode: string;
  location: string;
}

export interface Order {
  id: string;
  customer: string;
  lines: { sku: string; quantity: number }[];
}

/** the lines to pick for an order, with the name and the shelf from the stock */
export function pickLines(order: Order, items: Item[]): BlessPickLine[] {
  return order.lines.map((l, i) => {
    const item = items.find((x) => x.sku === l.sku)!;
    return {
      id: `${order.id}-${i}`,
      sku: l.sku,
      name: item.name,
      location: item.location,
      quantity: l.quantity,
    };
  });
}

/** the stock after an order leaves: off the shelf, and no longer promised */
export const ship = (items: Item[], order: Order): Item[] =>
  items.map((x) => {
    const q = order.lines.filter((l) => l.sku === x.sku).reduce((n, l) => n + l.quantity, 0);
    return q ? { ...x, onHand: x.onHand - q, reserved: Math.max(0, (x.reserved ?? 0) - q) } : x;
  });

/** the stock after a delivery: `count` more of the item with this barcode, or a problem */
export function receive(items: Item[], barcode: string, count: number) {
  const item = items.find((x) => x.barcode === barcode);
  if (!item) return { problem: `${barcode} is not in the stock list. Add the item first.` };
  if (!Number.isInteger(count) || count < 1) return { problem: "Count at least 1." };
  return {
    item,
    items: items.map((x) => (x === item ? { ...x, onHand: x.onHand + count } : x)),
  };
}

/** what to order: each item at or below its reorder point, up to three times that point */
export const reorder = (items: Item[]) =>
  items
    .map((x) => ({ item: x, quantity: x.reorderAt * 3 - stockState(x).available }))
    .filter((r) => stockState(r.item).state !== "ok" && r.quantity > 0);
