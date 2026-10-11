const UNIT = { h: 3600, m: 60, s: 1 } as const;

/**
 * Text to seconds. Accepts `1:30:00`, `1:30` and unit text such as `1h 30m`, `90s` or `1.5h`.
 * Two colon parts are minutes and seconds when `seconds` is true, and hours and minutes otherwise.
 * Returns `null` for text that is not a duration.
 */
export function parseDuration(text: string, seconds = true): number | null {
  const t = text.trim().toLowerCase();
  if (!t) return null;
  if (/^\d+(:\d{1,2}){1,2}$/.test(t)) {
    const p = t.split(":").map(Number);
    if (p.slice(1).some((n) => n > 59)) return null;
    if (p.length === 3) return p[0] * 3600 + p[1] * 60 + p[2];
    return seconds ? p[0] * 60 + p[1] : p[0] * 3600 + p[1] * 60;
  }
  const re = /(\d+(?:\.\d+)?)\s*([hms])/g;
  let total = 0;
  let used = 0;
  for (const m of t.matchAll(re)) {
    total += Number(m[1]) * UNIT[m[2] as keyof typeof UNIT];
    used += m[0].length;
  }
  // everything but spaces must be part of a number and unit pair
  if (!used || used !== t.replace(/\s/g, "").length) return null;
  return Math.round(total);
}

/** Seconds to `h:mm:ss`, or `h:mm` when `seconds` is false (the seconds are dropped). */
export function formatDuration(total: number, seconds = true): string {
  const s = Math.max(0, Math.round(total));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const pad = (n: number) => String(n).padStart(2, "0");
  return seconds ? `${h}:${pad(m)}:${pad(s % 60)}` : `${h}:${pad(m)}`;
}
