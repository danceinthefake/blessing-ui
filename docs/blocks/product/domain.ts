// Types and pure rules of a product page. No Vue here.
export interface Option {
  key: string;
  name: string;
  values: { value: string; label: string; color?: string }[];
}
export interface Review {
  id: string;
  name: string;
  stars: number;
  date: string;
  text: string;
}
export interface Product {
  id: string;
  name: string;
  price: number;
  was?: number;
  description: string;
  details: { label: string; value: string }[];
  options: Option[];
  /** units in stock per SKU; the SKU is the chosen values joined with "/" in option order */
  stock: Record<string, number>;
  /** photo URLs per color value */
  photos: Record<string, string[]>;
  reviews: Review[];
}
export type Selection = Record<string, string>;

export const skuOf = (p: Product, sel: Selection) => p.options.map((o) => sel[o.key]).join("/");

/** a value is sold out when every SKU that has it is at 0, given the other choices made so far */
export function soldOut(p: Product, sel: Selection, key: string, value: string) {
  const want = { ...sel, [key]: value };
  return !Object.entries(p.stock).some(
    ([sku, n]) =>
      n > 0 && p.options.every((o, i) => !want[o.key] || sku.split("/")[i] === want[o.key]),
  );
}

/** what the shopper must still choose, or "" */
export function missing(p: Product, sel: Selection) {
  const o = p.options.find((o) => !sel[o.key]);
  return o ? `Choose a ${o.name.toLowerCase()}.` : "";
}

/** counts per star, from 5 down to 1, as BlessReviewSummary wants them */
export const starCounts = (reviews: Review[]) =>
  [5, 4, 3, 2, 1].map((s) => reviews.filter((r) => r.stars === s).length);
