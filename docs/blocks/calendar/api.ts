import type { BlessRsvpAnswer } from "blessing-ui";
import type { CalEvent } from "./domain";

export interface CalendarApi {
  events(): Promise<CalEvent[]>;
  create(event: Omit<CalEvent, "id">): Promise<CalEvent>;
  answer(id: string, answer: BlessRsvpAnswer | undefined): Promise<void>;
}

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
const JKT = "Asia/Jakarta";

/** offline adapter — replace with calls to your calendar server (CalDAV, Google, or your own) */
export const mockCalendarApi: CalendarApi = {
  async events() {
    await wait(200);
    return [
      {
        id: "standup",
        title: "Standup",
        date: "2026-11-02",
        start: 9 * 60,
        minutes: 30,
        zone: JKT,
        repeat: { freq: "weekly", interval: 1, days: [0, 1, 2, 3, 4], end: { type: "never" } },
        place: "Room Merapi",
      },
      {
        id: "review",
        title: "Design review",
        date: "2026-11-05",
        start: 14 * 60,
        minutes: 60,
        zone: JKT,
        repeat: { freq: "weekly", interval: 2, days: [3], end: { type: "never" } },
        color: "chart-2",
        place: "Online",
      },
      {
        id: "tokyo",
        title: "Call with the Tokyo team",
        date: "2026-11-25",
        start: 10 * 60,
        minutes: 45,
        zone: "Asia/Tokyo",
        color: "chart-3",
        place: "Online",
      },
      {
        id: "rent",
        title: "Rent due",
        date: "2026-09-01",
        zone: JKT,
        repeat: { freq: "monthly", interval: 1, end: { type: "never" } },
        color: "chart-4",
      },
      {
        id: "dinner",
        title: "Team dinner",
        date: "2026-11-27",
        start: 18 * 60 + 30,
        minutes: 120,
        zone: JKT,
        color: "chart-5",
        place: "Warung Senja, Jl. Riau 5",
        going: [{ name: "Rina" }, { name: "Joko" }, { name: "Sari" }],
      },
    ];
  },
  async create(event) {
    await wait(400);
    return { ...event, id: `e${Date.now()}` };
  },
  async answer() {
    await wait(200);
  },
};
