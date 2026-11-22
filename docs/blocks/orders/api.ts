import type { Order } from "./domain";

export interface OrdersApi {
  list(): Promise<Order[]>;
  cancel(id: string): Promise<void>;
  /** puts the items of the order in the cart */
  buyAgain(id: string): Promise<void>;
  /** resolves to the number of the return */
  requestReturn(
    id: string,
    items: { id: string; quantity: number }[],
    reason: string,
  ): Promise<string>;
}

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** offline adapter — replace with calls to your shop backend */
export const mockOrdersApi: OrdersApi = {
  async list() {
    await wait(200);
    return [
      {
        id: "10442",
        number: "#10442",
        placed: "2026-11-21",
        status: "processing",
        stage: 0,
        shipping: 15_000,
        items: [{ id: "mug", name: "Stoneware mug", quantity: 2, price: 85_000 }],
        updates: [],
      },
      {
        id: "10431",
        number: "#10431",
        placed: "2026-11-18",
        status: "shipped",
        stage: 3,
        shipping: 15_000,
        carrier: "Kilat Express",
        tracking: "KX 4471 2290",
        items: [
          { id: "kettle", name: "Pour-over kettle", quantity: 1, price: 420_000 },
          { id: "filter", name: "Paper filters (100)", quantity: 3, price: 45_000 },
        ],
        updates: [
          { time: "22 Nov, 08:10", text: "Out for delivery", place: "Bandung" },
          { time: "21 Nov, 19:42", text: "At the local hub", place: "Bandung" },
          { time: "20 Nov, 06:15", text: "Shipped", place: "Jakarta" },
        ],
      },
      {
        id: "10398",
        number: "#10398",
        placed: "2026-11-06",
        delivered: "2026-11-10",
        status: "delivered",
        stage: 4,
        shipping: 0,
        carrier: "Kilat Express",
        tracking: "KX 4410 8812",
        items: [
          { id: "grinder", name: "Hand grinder", quantity: 1, price: 650_000 },
          { id: "beans", name: "House beans, 250 g", quantity: 2, price: 95_000 },
          { id: "scale", name: "Kitchen scale", quantity: 1, price: 210_000 },
        ],
        updates: [
          { time: "10 Nov, 14:02", text: "Delivered. Left at the front door.", place: "Bandung" },
        ],
      },
      {
        id: "10215",
        number: "#10215",
        placed: "2026-09-01",
        delivered: "2026-09-04",
        status: "delivered",
        stage: 4,
        shipping: 15_000,
        items: [{ id: "dripper", name: "Ceramic dripper", quantity: 1, price: 180_000 }],
        updates: [{ time: "4 Sep, 11:30", text: "Delivered", place: "Bandung" }],
      },
      {
        id: "10190",
        number: "#10190",
        placed: "2026-08-20",
        status: "cancelled",
        stage: 0,
        shipping: 15_000,
        items: [{ id: "tray", name: "Serving tray", quantity: 1, price: 120_000 }],
        updates: [],
      },
    ];
  },
  async cancel() {
    await wait(500);
  },
  async buyAgain() {
    await wait(300);
  },
  async requestReturn() {
    await wait(600);
    return `R-${Math.floor(1000 + Math.random() * 9000)}`;
  },
};
