// Types and pure rules of a billing account. No Vue here.
export interface Plan {
  id: string;
  name: string;
  /** the price of one month */
  price: number;
  seats: number;
  /** storage in GB */
  storage: number;
}
export interface Usage {
  seats: number;
  storage: number;
}
export interface Line {
  description: string;
  quantity: number;
  price: number;
  tax?: number;
}
export interface Bill {
  number: string;
  /** YYYY-MM-DD */
  issued: string;
  due: string;
  lines: Line[];
  status: "draft" | "sent" | "paid" | "overdue";
}
export interface Account {
  plans: Plan[];
  plan: string;
  /** the next renewal, YYYY-MM-DD */
  renews: string;
  /** after a cancel: the last day of the plan */
  ends?: string;
  usage: Usage;
  card: { brand: string; last4: string; expires: string };
  bills: Bill[];
}

/** why the account cannot move to a plan, or "" when it fits */
export function moveProblem(plan: Plan, usage: Usage) {
  const over = [
    usage.seats > plan.seats && `${usage.seats - plan.seats} of ${usage.seats} seats`,
    usage.storage > plan.storage && `${usage.storage - plan.storage} GB of files`,
  ].filter(Boolean);
  return over.length
    ? `${plan.name} holds ${plan.seats} seats and ${plan.storage} GB. Remove ${over.join(" and ")} first.`
    : "";
}
