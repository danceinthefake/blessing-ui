import type { Person, Slot } from "./domain";

export interface MeetApi {
  poll(): Promise<{ title: string; days: string[]; people: Person[] }>;
  /** keeps the free times of one person */
  saveFree(id: string, free: string[]): Promise<void>;
  /** books the time and sends the invitations */
  book(slot: Slot): Promise<void>;
}

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
/** the cells from `from` to `to` (HH:MM, not included) on a day */
function span(day: string, from: string, to: string) {
  const m = (s: string) => Number(s.slice(0, 2)) * 60 + Number(s.slice(3));
  const out: string[] = [];
  for (let t = m(from); t < m(to); t += 30)
    out.push(
      `${day} ${String(Math.floor(t / 60)).padStart(2, "0")}:${String(t % 60).padStart(2, "0")}`,
    );
  return out;
}

/** offline adapter — replace with calls to your calendar service */
export const mockMeetApi: MeetApi = {
  async poll() {
    await wait(200);
    return {
      title: "Bundle page review",
      days: ["Mon 23", "Tue 24", "Wed 25"],
      people: [
        {
          id: "sari",
          name: "Sari",
          free: [...span("Mon 23", "13:00", "15:00"), ...span("Tue 24", "09:00", "12:00")],
        },
        {
          id: "bayu",
          name: "Bayu",
          free: [
            ...span("Mon 23", "09:00", "14:30"),
            ...span("Tue 24", "10:00", "11:30"),
            ...span("Wed 25", "14:00", "17:00"),
          ],
        },
        {
          id: "dewi",
          name: "Dewi",
          free: [
            ...span("Mon 23", "13:30", "17:00"),
            ...span("Tue 24", "10:30", "16:00"),
            ...span("Wed 25", "09:00", "12:00"),
          ],
        },
        {
          id: "rina",
          name: "Rina",
          free: [...span("Tue 24", "09:00", "11:00"), ...span("Wed 25", "09:00", "17:00")],
        },
      ],
    };
  },
  async saveFree() {
    await wait(100);
  },
  async book() {
    await wait(500);
  },
};
