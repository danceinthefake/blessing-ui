// Shared parts of the transcript and the chapter list: a time as a clock, and the current item.

/** Seconds as `m:ss`, or `h:mm:ss` from one hour. */
export function clockText(seconds: number): string {
  const s = Math.max(0, Math.floor(seconds));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const ss = String(s % 60).padStart(2, "0");
  return h ? `${h}:${String(m).padStart(2, "0")}:${ss}` : `${m}:${ss}`;
}

/** The last item that starts at or before `time`, or -1. With an `end`, an item stops being current after it. */
export function currentIndex(items: { start: number; end?: number }[], time: number): number {
  let at = -1;
  for (let i = 0; i < items.length; i++) if (items[i]!.start <= time) at = i;
  const it = items[at];
  return it && it.end !== undefined && time >= it.end ? -1 : at;
}
