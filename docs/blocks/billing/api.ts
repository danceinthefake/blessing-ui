import type { Account } from "./domain";

export interface BillingApi {
  load(): Promise<Account>;
  changePlan(plan: string): Promise<void>;
  /** resolves to the last day of the plan */
  cancel(): Promise<string>;
  resume(): Promise<void>;
  /** pays an invoice with the card on file */
  pay(invoice: string): Promise<void>;
}

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
const hosting = (month: string, price: number) => [
  { description: `Team plan, ${month}`, quantity: 1, price, tax: 11 },
  { description: "Extra seat", quantity: 2, price: 49_000, tax: 11 },
];

/** offline adapter — replace with calls to your billing backend */
export const mockBillingApi: BillingApi = {
  async load() {
    await wait(200);
    return {
      plans: [
        { id: "starter", name: "Starter", price: 149_000, seats: 3, storage: 10 },
        { id: "team", name: "Team", price: 490_000, seats: 10, storage: 100 },
        { id: "business", name: "Business", price: 1_490_000, seats: 50, storage: 1000 },
      ],
      plan: "team",
      renews: "2026-12-01",
      usage: { seats: 7, storage: 64 },
      card: { brand: "Visa", last4: "4242", expires: "08/2028" },
      bills: [
        {
          number: "INV-2026-011",
          issued: "2026-11-01",
          due: "2026-11-15",
          lines: hosting("November", 490_000),
          status: "overdue",
        },
        {
          number: "INV-2026-010",
          issued: "2026-10-01",
          due: "2026-10-15",
          lines: hosting("October", 490_000),
          status: "paid",
        },
        {
          number: "INV-2026-009",
          issued: "2026-09-01",
          due: "2026-09-15",
          lines: hosting("September", 490_000),
          status: "paid",
        },
      ],
    };
  },
  async changePlan() {
    await wait(400);
  },
  async cancel() {
    await wait(400);
    return "2026-11-30";
  },
  async resume() {
    await wait(400);
  },
  async pay() {
    await wait(700);
  },
};
