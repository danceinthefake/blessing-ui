import type { BlessDeliveryDay } from "blessing-ui";
import type { Address, Card, Coupon, Line } from "./domain";

export interface Order {
  lines: Line[];
  address: Address;
  window: string;
  card: Card;
  coupon?: string;
}
export interface CheckoutApi {
  cart(): Promise<Line[]>;
  deliveryDays(): Promise<BlessDeliveryDay[]>;
  /** throws with a reason the shopper can act on */
  coupon(code: string): Promise<Coupon>;
  /** resolves to the order number; throws when the bank declines */
  place(order: Order): Promise<string>;
}

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
const art = (emoji: string, color: string) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96"><rect width="100%" height="100%" fill="#${color}"/><text x="50%" y="54%" font-size="48" text-anchor="middle" dominant-baseline="middle">${emoji}</text></svg>`)}`;

/** offline adapter — replace with calls to your shop backend and payment provider */
export const mockCheckoutApi: CheckoutApi = {
  async cart() {
    return [
      {
        id: "tee",
        name: "Blessing tee",
        note: "Sakura, M",
        price: 189_000,
        quantity: 2,
        image: art("👕", "f3d9e0"),
      },
      {
        id: "tote",
        name: "Canvas tote",
        note: "Ink",
        price: 129_000,
        quantity: 1,
        image: art("👜", "e6e6e6"),
      },
      {
        id: "pins",
        name: "Enamel pin set",
        price: 75_000,
        quantity: 1,
        image: art("📍", "dfe8f3"),
      },
    ];
  },
  async deliveryDays() {
    const day = (n: number) => new Date(Date.UTC(2026, 10, 23 + n)).toISOString().slice(0, 10);
    return [0, 1, 2].map((n) => ({
      date: day(n),
      windows: [
        {
          id: `${n}-am`,
          start: "09:00",
          end: "12:00",
          fee: n === 0 ? 30_000 : 15_000,
          full: n === 0,
        },
        { id: `${n}-pm`, start: "13:00", end: "17:00", fee: n === 0 ? 30_000 : 15_000 },
        { id: `${n}-ev`, start: "18:00", end: "21:00", fee: n === 2 ? 0 : 20_000 },
      ],
    }));
  },
  async coupon(code) {
    await wait(500);
    if (code === "BLESS10") return { code, percent: 10 };
    throw new Error(`The code ${code} does not exist or has expired`);
  },
  async place(order) {
    await wait(800);
    if (order.card.number.replace(/\D/g, "").endsWith("0002"))
      throw new Error("The bank declined the card. Use another card.");
    return `BL-${Math.floor(100000 + Math.random() * 900000)}`;
  },
};
