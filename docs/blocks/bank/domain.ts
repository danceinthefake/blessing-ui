import type { BlessTransaction } from "blessing-ui";

export interface Budget {
  name: string;
  spent: number;
  budget: number;
}
export interface Transfer {
  to: string;
  amount: number;
}

/** why a transfer cannot go, or "" when it can */
export function check(t: Transfer, balance: number) {
  if (!t.to.trim()) return "Enter who gets the money.";
  if (!(t.amount > 0)) return "Enter an amount above zero.";
  if (t.amount > balance) return "The amount is more than the balance.";
  return "";
}

/** the row that a sent transfer adds to the list */
export function toTransaction(t: Transfer, id: string, date: string): BlessTransaction {
  return {
    id,
    title: `To ${t.to.trim()}`,
    amount: -t.amount,
    date,
    category: "Transfer",
    icon: "↗",
    pending: true,
  };
}
