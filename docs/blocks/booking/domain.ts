// Types and pure rules of a booking. No Vue here.
export interface Service {
  id: string;
  name: string;
  minutes: number;
  price: number;
  person: string;
}
export interface Details {
  name: string;
  email: string;
  note: string;
}
export interface Booking extends Details {
  service: string;
  date: string;
  time: string;
}

/** the studio is closed on Sundays and on days that have passed. Dates are YYYY-MM-DD */
export const closed = (iso: string, today: string) =>
  iso < today || new Date(`${iso}T00:00:00Z`).getUTCDay() === 0;

/** "14:30" plus 45 minutes is "15:15" */
export function endOf(time: string, minutes: number) {
  const [h, m] = time.split(":").map(Number);
  const t = h * 60 + m + minutes;
  return `${String(Math.floor(t / 60)).padStart(2, "0")}:${String(t % 60).padStart(2, "0")}`;
}
