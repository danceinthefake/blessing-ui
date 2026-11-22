import type { BlessSeatRow, BlessSeatZone } from "blessing-ui";

export interface Show {
  title: string;
  venue: string;
  /** an ISO time */
  starts: string;
}

export interface TicketsApi {
  load(): Promise<{ show: Show; rows: BlessSeatRow[]; zones: BlessSeatZone[] }>;
  /** holds the seats for payment, or names the seats that someone took first */
  hold(ids: string[]): Promise<{ taken: string[] }>;
  /** pays for held seats and resolves to a code for each */
  pay(ids: string[]): Promise<{ seat: string; code: string }[]>;
}

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
const ZONE = (row: string) =>
  "AB".includes(row) ? "front" : "CDE".includes(row) ? "middle" : "back";
// seats that people took before you came; C4 goes while you choose
const TAKEN = ["A6", "A7", "A8", "A9", "B7", "B8", "C5", "C6", "C7", "C8", "C9", "C10", "F1", "F2"];
let late = ["C4"];

/** offline adapter — replace with calls to your box office */
export const mockTicketsApi: TicketsApi = {
  async load() {
    await wait(200);
    const rows: BlessSeatRow[] = [..."ABCDEFGH"].map((label) => ({
      label,
      // 7 seats, an aisle, 7 seats
      seats: Array.from({ length: 15 }, (_, i) => {
        if (i === 7) return null;
        const number = i < 7 ? i + 1 : i;
        const id = `${label}${number}`;
        return { id, number, zone: ZONE(label), taken: TAKEN.includes(id) };
      }),
    }));
    return {
      show: {
        title: "Senja Sessions, live",
        venue: "Teater Kecil, Jakarta",
        starts: "2026-12-12T12:30:00Z",
      },
      zones: [
        { key: "front", label: "Front", price: 450_000 },
        { key: "middle", label: "Middle", price: 300_000 },
        { key: "back", label: "Back", price: 150_000 },
      ],
      rows,
    };
  },
  async hold(ids) {
    await wait(400);
    const taken = ids.filter((id) => late.includes(id));
    late = late.filter((id) => !taken.includes(id));
    return { taken };
  },
  async pay(ids) {
    await wait(600);
    return ids.map((seat, i) => ({
      seat,
      code: `SNJ-1212-${seat}-${(4071 + i * 7).toString(36).toUpperCase()}`,
    }));
  },
};
