import type { BlessSlot } from "blessing-ui";
import type { Booking, Service } from "./domain";

export interface BookingApi {
  services(): Promise<Service[]>;
  /** the start times of a day for a service; a taken time comes back disabled */
  slots(service: string, date: string): Promise<BlessSlot[]>;
  /** resolves to the booking number; throws when someone took the time first */
  book(booking: Booking): Promise<string>;
}

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** offline adapter — replace with calls to your calendar backend */
export const mockBookingApi: BookingApi = {
  async services() {
    return [
      { id: "cut", name: "Haircut", minutes: 45, price: 120_000, person: "Sari" },
      { id: "color", name: "Color and cut", minutes: 120, price: 450_000, person: "Sari" },
      { id: "beard", name: "Beard trim", minutes: 30, price: 60_000, person: "Joko" },
    ];
  },
  async slots(service, date) {
    await wait(300);
    const seed = [...`${service}${date}`].reduce((n, c) => n + c.charCodeAt(0), 0);
    const times = [
      "09:00",
      "09:30",
      "10:00",
      "11:00",
      "13:00",
      "14:00",
      "15:30",
      "16:00",
      "18:00",
      "19:00",
    ];
    return times.map((time, i) => ({ time, disabled: (seed + i) % 4 === 0 }));
  },
  async book(b) {
    await wait(600);
    if (b.time === "16:00")
      throw new Error("Someone booked 16:00 a moment ago. Pick another time.");
    return `BK-${Math.floor(1000 + Math.random() * 9000)}`;
  },
};
