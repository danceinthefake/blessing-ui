/**
 * ArrowLeft / ArrowRight swapped when the event's target renders right-to-left, so "next" keeps
 * following the reading direction. Every other key passes through.
 */
export function logicalKey(e: KeyboardEvent): string {
  if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return e.key;
  const el = (e.currentTarget ?? e.target) as Element | null;
  const rtl = !!el && getComputedStyle(el).direction === "rtl";
  return rtl ? (e.key === "ArrowLeft" ? "ArrowRight" : "ArrowLeft") : e.key;
}
