import type { Item, Order } from "./domain";

export interface WarehouseApi {
  load(): Promise<{ items: Item[]; orders: Order[] }>;
  /** marks the order as shipped and takes it off the stock */
  ship(orderId: string): Promise<void>;
  receive(sku: string, count: number): Promise<void>;
  /** sends a purchase order to the supplier and resolves to its number */
  purchase(lines: { sku: string; quantity: number }[]): Promise<string>;
}

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
const item = (
  sku: string,
  barcode: string,
  name: string,
  location: string,
  onHand: number,
  reserved: number,
  reorderAt: number,
): Item => ({ sku, barcode, name, location, onHand, reserved, reorderAt });
let po = 41;

/** offline adapter — replace with calls to your stock system */
export const mockWarehouseApi: WarehouseApi = {
  async load() {
    await wait(200);
    return {
      items: [
        item("TEA-JAS-100", "8991002001015", "Jasmine tea, 100 g", "A-01-1", 40, 2, 15),
        item("TEA-OOL-100", "8991002001022", "Oolong tea, 100 g", "A-01-2", 12, 4, 10),
        item("TEA-GIN-050", "8991002001039", "Ginger tea, 50 g", "A-02-1", 3, 3, 8),
        item("HON-KAL-250", "8991002002012", "Kaliandra honey, 250 g", "B-03-2", 22, 1, 6),
        item("BOX-GFT-003", "8991002003019", "Gift box for three", "C-01-1", 9, 1, 5),
        item("CUP-CER-001", "8991002004016", "Ceramic cup", "C-02-4", 30, 2, 10),
      ],
      orders: [
        {
          id: "10451",
          customer: "Rina Wulandari",
          lines: [
            { sku: "HON-KAL-250", quantity: 1 },
            { sku: "TEA-JAS-100", quantity: 2 },
            { sku: "BOX-GFT-003", quantity: 1 },
          ],
        },
        {
          id: "10452",
          customer: "Dimas Pratama",
          lines: [
            { sku: "CUP-CER-001", quantity: 2 },
            { sku: "TEA-OOL-100", quantity: 2 },
          ],
        },
      ],
    };
  },
  async ship() {
    await wait(400);
  },
  async receive() {
    await wait(150);
  },
  async purchase() {
    await wait(500);
    return `PO-${String(++po).padStart(4, "0")}`;
  },
};
