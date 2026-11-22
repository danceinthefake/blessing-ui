// Types and pure rules of past orders. No Vue here.
export interface Item {
  id: string;
  name: string;
  quantity: number;
  /** the price of one */
  price: number;
}
export interface Update {
  time: string;
  text: string;
  place?: string;
}
export interface Order {
  id: string;
  number: string;
  /** YYYY-MM-DD */
  placed: string;
  delivered?: string;
  status: "processing" | "shipped" | "delivered" | "cancelled";
  items: Item[];
  shipping: number;
  /** 0 ordered, 1 packed, 2 shipped, 3 out for delivery, 4 delivered */
  stage: number;
  updates: Update[];
  carrier?: string;
  tracking?: string;
  /** the number of a return, after one is asked for */
  returned?: string;
}

export const RETURN_DAYS = 30;
export const total = (o: Order) => o.items.reduce((n, i) => n + i.quantity * i.price, o.shipping);

/** the last day to ask for a return, YYYY-MM-DD, or undefined before delivery */
export function returnUntil(o: Order) {
  if (!o.delivered) return undefined;
  const d = new Date(`${o.delivered}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + RETURN_DAYS);
  return d.toISOString().slice(0, 10);
}
export const canReturn = (o: Order, today: string) =>
  o.status === "delivered" && !o.returned && today <= (returnUntil(o) ?? "");
export const canCancel = (o: Order) => o.status === "processing";
