// Types and pure rules of a checkout. No Vue here.
export interface Line {
  id: string;
  name: string;
  note?: string;
  price: number;
  quantity: number;
  image?: string;
}
export interface Address {
  country: string;
  line1?: string;
  line2?: string;
  city?: string;
  region?: string;
  postal?: string;
}
export interface Card {
  number: string;
  expiry: string;
  cvc: string;
}
export interface Coupon {
  code: string;
  percent: number;
}

/** PPN, the value-added tax of Indonesia */
export const TAX_RATE = 0.11;

export const subtotal = (lines: Line[]) => lines.reduce((n, l) => n + l.price * l.quantity, 0);
export const discountOf = (coupon: Coupon | undefined, amount: number) =>
  coupon ? Math.round((amount * coupon.percent) / 100) : 0;
export const taxOf = (amount: number) => Math.round(amount * TAX_RATE);

/** what the address still needs, or "" when it is complete */
export function addressProblem(a: Address) {
  const missing = [
    !a.line1?.trim() && "the street",
    !a.city?.trim() && "the city",
    !a.postal?.trim() && "the postal code",
  ].filter(Boolean);
  if (!missing.length) return "";
  const list =
    missing.length > 1 ? `${missing.slice(0, -1).join(", ")} and ${missing.at(-1)}` : missing[0];
  return `Fill in ${list}.`;
}

/** what is wrong with the card, or "". `today` is YYYY-MM-DD; `numberOk` comes from a Luhn check */
export function cardProblem(card: Card, numberOk: boolean, today: string) {
  if (!numberOk) return "Check the card number.";
  const m = card.expiry.match(/^(\d{2})\s*\/\s*(\d{2})$/);
  if (!m || +m[1] < 1 || +m[1] > 12) return "Write the expiry date as MM/YY.";
  const [year, month] = [2000 + +m[2], +m[1]];
  const [y, mo] = today.split("-").map(Number);
  if (year < y || (year === y && month < mo)) return "The card has expired. Use another card.";
  if (!/^\d{3,4}$/.test(card.cvc)) return "The security code has 3 or 4 digits.";
  return "";
}
