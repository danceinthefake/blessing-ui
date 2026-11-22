import type { BlessApprovalStep, BlessTimeEntry } from "blessing-ui";

export interface TimesheetApi {
  load(): Promise<{
    entries: BlessTimeEntry[];
    /** the monthly base pay, in rupiah */
    monthly: number;
    /** overtime pay of the earlier weeks of the month */
    earlier: number;
  }>;
  save(entries: BlessTimeEntry[]): Promise<void>;
  /** sends the week to the team lead and resolves to the approval steps */
  submit(monday: string): Promise<BlessApprovalStep[]>;
}

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
// Jakarta times on a day of the week of 16 November 2026
const entry = (id: string, day: number, task: string, from: string, to: string): BlessTimeEntry => {
  const at = (hhmm: string) => Date.parse(`2026-11-${16 + day}T${hhmm}:00+07:00`);
  return { id, task, start: at(from), end: at(to) };
};

/** offline adapter — replace with calls to your HR system */
export const mockTimesheetApi: TimesheetApi = {
  async load() {
    await wait(200);
    return {
      monthly: 7_500_000,
      earlier: 260_116,
      entries: [
        entry("a", 0, "Packing", "09:00", "12:00"),
        entry("b", 0, "Customer emails", "13:00", "17:30"),
        entry("c", 1, "Packing", "09:00", "12:00"),
        entry("d", 1, "Stock count", "13:00", "19:00"),
        entry("e", 2, "Photos for the bundle page", "09:00", "12:00"),
        entry("f", 2, "Packing", "13:00", "17:00"),
        entry("g", 3, "Packing", "08:00", "12:00"),
        entry("h", 3, "Year-end orders", "13:00", "20:00"),
        entry("i", 4, "Customer emails", "09:00", "12:00"),
        entry("j", 4, "Packing", "13:00", "16:00"),
        entry("k", 5, "Market stall", "10:00", "13:00"),
      ],
    };
  },
  async save() {
    await wait(100);
  },
  async submit() {
    await wait(500);
    return [
      {
        id: "lead",
        title: "Team lead",
        rule: "all",
        approvers: [{ name: "Bayu Nugroho", decision: "pending" }],
      },
      {
        id: "hr",
        title: "Payroll",
        rule: "any",
        approvers: [
          { name: "Lia Hartono", decision: "pending" },
          { name: "Ken Tan", decision: "pending" },
        ],
      },
    ];
  },
};
