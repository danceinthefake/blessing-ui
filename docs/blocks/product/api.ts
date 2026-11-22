import type { Product } from "./domain";

export interface Related {
  id: string;
  name: string;
  price: number;
  was?: number;
  image: string;
  rating: number;
  reviews: number;
}
export interface ProductApi {
  product(id: string): Promise<Product>;
  related(id: string): Promise<Related[]>;
  /** puts the SKU in the cart; throws when the stock ran out meanwhile */
  addToCart(sku: string, quantity: number): Promise<void>;
}

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
export const art = (emoji: string, color: string) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600"><rect width="100%" height="100%" fill="#${color}"/><text x="50%" y="54%" font-size="280" text-anchor="middle" dominant-baseline="middle">${emoji}</text></svg>`)}`;
const shots = (color: string) => [art("👕", color), art("🏷️", color), art("🧵", color)];

/** offline adapter — replace with calls to your catalog and cart */
export const mockProductApi: ProductApi = {
  async product(id) {
    return {
      id,
      name: "Blessing tee",
      price: 189_000,
      was: 229_000,
      description:
        "A heavy cotton tee with the leaning flower on the chest. It keeps its shape after many washes, and the print does not crack.",
      details: [
        { label: "Material", value: "100% combed cotton, 220 gsm" },
        { label: "Fit", value: "Regular. Take your usual size." },
        { label: "Care", value: "Wash cold, inside out. Do not tumble dry." },
        { label: "Made in", value: "Bandung, Indonesia" },
      ],
      options: [
        {
          key: "color",
          name: "Color",
          values: [
            { value: "ink", label: "Ink", color: "#2b2b2f" },
            { value: "sakura", label: "Sakura", color: "#f3c6d3" },
            { value: "sky", label: "Sky", color: "#bcd6ef" },
          ],
        },
        {
          key: "size",
          name: "Size",
          values: ["S", "M", "L", "XL"].map((s) => ({ value: s, label: s })),
        },
      ],
      stock: {
        "ink/S": 4,
        "ink/M": 0,
        "ink/L": 7,
        "ink/XL": 2,
        "sakura/S": 3,
        "sakura/M": 5,
        "sakura/L": 0,
        "sakura/XL": 0,
        "sky/S": 0,
        "sky/M": 0,
        "sky/L": 0,
        "sky/XL": 0,
      },
      photos: { ink: shots("d9d9de"), sakura: shots("f3d9e0"), sky: shots("dbe7f4") },
      reviews: [
        {
          id: "r1",
          name: "Rina",
          stars: 5,
          date: "2026-11-10",
          text: "Thick and soft. The print still looks new after ten washes.",
        },
        {
          id: "r2",
          name: "Dimas",
          stars: 4,
          date: "2026-11-02",
          text: "Good tee. The L is a little long for me.",
        },
        {
          id: "r3",
          name: "Aya",
          stars: 5,
          date: "2026-10-28",
          text: "The sakura color is exactly like the photo.",
        },
        {
          id: "r4",
          name: "Budi",
          stars: 3,
          date: "2026-10-15",
          text: "Nice fabric, but delivery took a week.",
        },
      ],
    };
  },
  async related() {
    return [
      {
        id: "tote",
        name: "Canvas tote",
        price: 129_000,
        image: art("👜", "e6e6e6"),
        rating: 4.6,
        reviews: 31,
      },
      {
        id: "cap",
        name: "Flower cap",
        price: 149_000,
        was: 179_000,
        image: art("🧢", "dfe8f3"),
        rating: 4.3,
        reviews: 12,
      },
      {
        id: "pins",
        name: "Enamel pin set",
        price: 75_000,
        image: art("📍", "f3e1e7"),
        rating: 4.9,
        reviews: 58,
      },
    ];
  },
  async addToCart(sku) {
    await wait(500);
    if (sku === "ink/XL") throw new Error("Someone bought the last XL in Ink a moment ago.");
  },
};
