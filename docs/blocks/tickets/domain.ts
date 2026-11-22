import type { BlessSeatRow, BlessSeatZone } from "blessing-ui";

/** the price of the chosen seats, by the zone of each seat */
export function subtotal(ids: string[], rows: BlessSeatRow[], zones: BlessSeatZone[]) {
  const price = new Map(zones.map((z) => [z.key, z.price]));
  return rows
    .flatMap((r) => r.seats)
    .filter((s) => s && ids.includes(s.id))
    .reduce((n, s) => n + (price.get(s!.zone ?? "") ?? 0), 0);
}

/** the service fee: 5 percent, rounded to the nearest 1,000 */
export const fee = (amount: number) => Math.round((amount * 0.05) / 1000) * 1000;

/**
 * The best `n` free seats side by side in a zone: the front row that has them, then the seats
 * nearest the middle of the row. An aisle (a gap in the row) breaks a run.
 */
export function bestSeats(rows: BlessSeatRow[], zone: string, n: number): string[] | undefined {
  for (const row of rows) {
    const middle = (row.seats.length - 1) / 2;
    let best: { ids: string[]; off: number } | undefined;
    for (let i = 0; i + n <= row.seats.length; i++) {
      const run = row.seats.slice(i, i + n);
      if (!run.every((s) => s && !s.taken && s.zone === zone)) continue;
      const off = Math.abs(i + (n - 1) / 2 - middle);
      if (!best || off < best.off) best = { ids: run.map((s) => s!.id), off };
    }
    if (best) return best.ids;
  }
  return undefined;
}

/** the rows with these seats marked as taken */
export const markTaken = (rows: BlessSeatRow[], ids: string[]): BlessSeatRow[] =>
  rows.map((r) => ({
    ...r,
    seats: r.seats.map((s) => (s && ids.includes(s.id) ? { ...s, taken: true } : s)),
  }));
