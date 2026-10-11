export type BlessCardBrand =
  | "visa"
  | "mastercard"
  | "amex"
  | "discover"
  | "jcb"
  | "diners"
  | "unionpay"
  | "unknown";

const inRange = (d: string, n: number, lo: number, hi: number) => {
  const v = Number(d.slice(0, n));
  return d.length >= n && v >= lo && v <= hi;
};

/** The card network, from the leading digits (the IIN ranges). */
export function cardBrand(digits: string): BlessCardBrand {
  const d = digits.replace(/\D/g, "");
  if (/^3[47]/.test(d)) return "amex";
  if (/^4/.test(d)) return "visa";
  if (/^5[1-5]/.test(d) || inRange(d, 4, 2221, 2720)) return "mastercard";
  if (/^(6011|65)/.test(d) || inRange(d, 3, 644, 649)) return "discover";
  if (inRange(d, 4, 3528, 3589)) return "jcb";
  if (/^3(0[0-5]|[68])/.test(d)) return "diners";
  if (/^62/.test(d)) return "unionpay";
  return "unknown";
}

/** Groups of digits per brand: Amex is 4-6-5, Diners 4-6-4, the rest 4-4-4-4. */
const GROUPS: Partial<Record<BlessCardBrand, number[]>> = { amex: [4, 6, 5], diners: [4, 6, 4] };
const MAX: Partial<Record<BlessCardBrand, number>> = { amex: 15, diners: 14, unionpay: 19 };

export const cardMax = (brand: BlessCardBrand) => MAX[brand] ?? 16;

/** Digits only, cut to the longest number the brand allows. */
export function cardDigits(input: string): string {
  const d = input.replace(/\D/g, "");
  return d.slice(0, cardMax(cardBrand(d)));
}

/** Digits split into the groups that print on the card. */
export function formatCard(digits: string): string {
  const groups = GROUPS[cardBrand(digits)] ?? [4, 4, 4, 4, 3];
  const out: string[] = [];
  let at = 0;
  for (const g of groups) {
    if (at >= digits.length) break;
    out.push(digits.slice(at, at + g));
    at += g;
  }
  return out.join(" ");
}

/** The Luhn check: true when the digits can be a real card number. */
export function luhn(digits: string): boolean {
  if (!/^\d{12,19}$/.test(digits)) return false;
  let sum = 0;
  for (let i = 0; i < digits.length; i++) {
    let n = Number(digits[digits.length - 1 - i]);
    if (i % 2) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    sum += n;
  }
  return sum % 10 === 0;
}

/** Where the caret goes in the formatted text after `count` digits. */
export function caretAfterDigits(formatted: string, count: number): number {
  if (count <= 0) return 0;
  let seen = 0;
  for (let i = 0; i < formatted.length; i++)
    if (/\d/.test(formatted[i]) && ++seen === count) return i + 1;
  return formatted.length;
}
