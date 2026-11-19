import type { BlessTransaction } from "blessing-ui";
import type { Budget, Transfer } from "./domain";

export interface BankApi {
  balance(): Promise<number>;
  transactions(): Promise<BlessTransaction[]>;
  budgets(): Promise<Budget[]>;
  /** resolves false when the PIN is wrong */
  send(t: Transfer, pin: string): Promise<boolean>;
}

/** offline adapter; the PIN is 1984 */
export const mockBankApi: BankApi = {
  async balance() {
    return 18_450_000;
  },
  async transactions() {
    return [
      {
        id: "t5",
        title: "Sales: Comiket winter",
        amount: 6_200_000,
        date: "2026-11-18",
        category: "Income",
        icon: "💼",
      },
      {
        id: "t4",
        title: "Print shop: volume 2",
        amount: -2_850_000,
        date: "2026-11-17",
        category: "Print",
        icon: "📚",
      },
      {
        id: "t3",
        title: "Studio rent",
        amount: -1_500_000,
        date: "2026-11-15",
        category: "Rent",
        icon: "🏠",
      },
      {
        id: "t2",
        title: "Tablet pen",
        amount: -420_000,
        date: "2026-11-14",
        category: "Gear",
        icon: "🖊️",
      },
      {
        id: "t1",
        title: "Sponsor: Icy Tail",
        amount: 1_000_000,
        date: "2026-11-12",
        category: "Income",
        icon: "🎸",
      },
    ];
  },
  async budgets() {
    return [
      { name: "Print", spent: 2_850_000, budget: 3_000_000 },
      { name: "Gear", spent: 420_000, budget: 300_000 },
      { name: "Rent", spent: 1_500_000, budget: 1_500_000 },
      { name: "Food at events", spent: 180_000, budget: 600_000 },
    ];
  },
  async send(_t, pin) {
    return pin === "1984";
  },
};
