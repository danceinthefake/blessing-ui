import type { BlessSlot, Day } from "./domain";

export interface HealthApi {
  today(): Promise<Day>;
  /** free times on the day of the visit */
  slots(date: string): Promise<BlessSlot[]>;
  reschedule(start: string): Promise<void>;
}

/** offline adapter */
export const mockHealthApi: HealthApi = {
  async today() {
    return {
      vitals: [
        { id: "hr", label: "Heart rate", value: 72, unit: "bpm", normal: [60, 100], time: "07:40" },
        { id: "bp", label: "Blood pressure", value: "121/79", unit: "mmHg", time: "07:40" },
        { id: "spo2", label: "Oxygen", value: 98, unit: "%", normal: [95, 100], time: "07:40" },
        { id: "steps", label: "Steps", value: 2140, unit: "so far", time: "10:05" },
      ],
      doses: [
        {
          id: "d1",
          medicine: "Vitamin D",
          amount: "1 capsule",
          time: "07:30",
          note: "with breakfast",
        },
        { id: "d2", medicine: "Iron", amount: "1 tablet", time: "13:00" },
        { id: "d3", medicine: "Magnesium", amount: "200 mg", time: "21:30", note: "before sleep" },
      ],
      taken: ["d1"],
      sleep: [
        { stage: "awake", start: "00:40", end: "00:55" },
        { stage: "light", start: "00:55", end: "01:40" },
        { stage: "deep", start: "01:40", end: "02:50" },
        { stage: "rem", start: "02:50", end: "03:25" },
        { stage: "light", start: "03:25", end: "04:40" },
        { stage: "deep", start: "04:40", end: "05:20" },
        { stage: "rem", start: "05:20", end: "06:10" },
        { stage: "awake", start: "06:10", end: "06:20" },
      ],
      habits: [
        { id: "walk", name: "Walk 20 minutes" },
        { id: "water", name: "Drink 8 glasses of water" },
        { id: "screens", name: "No screens after midnight" },
      ],
      done: {
        walk: ["2026-11-13", "2026-11-14", "2026-11-16", "2026-11-17", "2026-11-18"],
        water: ["2026-11-14", "2026-11-15", "2026-11-18", "2026-11-19"],
        screens: ["2026-11-15"],
      },
      visit: {
        title: "Wrist check",
        date: "2026-11-24",
        start: "09:30",
        minutes: 30,
        doctor: { name: "Dr. Sari Wibowo", role: "Hand and wrist" },
        place: "Klinik Sehat, Jl. Cikini Raya 7, Jakarta",
      },
    };
  },
  async slots() {
    return ["08:30", "09:00", "09:30", "10:30", "13:00", "14:30", "16:00"].map((time) => ({
      time,
      disabled: time === "10:30",
    }));
  },
  async reschedule() {},
};
