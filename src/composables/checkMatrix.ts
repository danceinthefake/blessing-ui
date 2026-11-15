// A grid of check boxes kept as `{ row: [columns that are on] }`, shared by the notification settings
// and the permission matrix.

export type CheckMatrix = Record<string, string[]>;

export const isOn = (m: CheckMatrix, row: string, col: string) => !!m[row]?.includes(col);

/** A copy with one cell turned on or off. */
export function setCell(m: CheckMatrix, row: string, col: string, on: boolean): CheckMatrix {
  const cur = new Set(m[row] ?? []);
  if (on) cur.add(col);
  else cur.delete(col);
  return { ...m, [row]: [...cur] };
}

/** A copy with one column turned on or off in every given row. */
export function setColumn(m: CheckMatrix, rows: string[], col: string, on: boolean): CheckMatrix {
  return rows.reduce((acc, r) => setCell(acc, r, col, on), m);
}

/** `true` if every row has the column, `false` if none has it, and `"mixed"` between. */
export function columnState(m: CheckMatrix, rows: string[], col: string): boolean | "mixed" {
  const n = rows.filter((r) => isOn(m, r, col)).length;
  return n === 0 ? false : n === rows.length ? true : "mixed";
}
