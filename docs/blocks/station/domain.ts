import type {
  BlessDowntimeReason,
  BlessInstructionStep,
  BlessQualityItem,
  BlessWorkOrderState,
} from "blessing-ui";

export interface Order {
  number: string;
  product: string;
  target: number;
  station: string;
  due: string;
  state: BlessWorkOrderState;
  good: number;
  scrap: number;
}
export interface Job {
  order: Order;
  steps: BlessInstructionStep[];
  checks: BlessQualityItem[];
  reasons: BlessDowntimeReason[];
}

/** a checked unit counts as good or as scrap; the order is done at its target */
export function count(o: Order, passed: boolean): Order {
  const next = { ...o, good: o.good + (passed ? 1 : 0), scrap: o.scrap + (passed ? 0 : 1) };
  return next.good >= next.target ? { ...next, state: "done" } : next;
}
