import type { BlessOption } from "./select";

/** Offset from UTC in minutes for a zone at a moment, from `Intl` (DST-aware). */
export function zoneOffset(zone: string, at: Date): number {
  const part = new Intl.DateTimeFormat("en", { timeZone: zone, timeZoneName: "longOffset" })
    .formatToParts(at)
    .find((p) => p.type === "timeZoneName")?.value;
  const m = /GMT([+-])(\d{2}):(\d{2})/.exec(part ?? "");
  return m ? (m[1] === "-" ? -1 : 1) * (Number(m[2]) * 60 + Number(m[3])) : 0;
}

/** `UTC+7`, `UTC-3:30`, `UTC` */
export function offsetText(minutes: number): string {
  if (!minutes) return "UTC";
  const a = Math.abs(minutes);
  const mm = a % 60;
  return `UTC${minutes < 0 ? "-" : "+"}${Math.floor(a / 60)}${mm ? `:${String(mm).padStart(2, "0")}` : ""}`;
}

/** Every IANA zone the runtime knows, or `[]` where `Intl.supportedValuesOf` is missing. */
export function allZones(): string[] {
  try {
    return (Intl as unknown as { supportedValuesOf(k: string): string[] }).supportedValuesOf(
      "timeZone",
    );
  } catch {
    return [];
  }
}

/** Options like `Asia/Jakarta (UTC+7)`, sorted west to east, then by name. */
export function zoneOptions(zones: string[], at: Date): BlessOption<string>[] {
  return zones
    .map((z) => ({ z, off: zoneOffset(z, at) }))
    .sort((a, b) => a.off - b.off || a.z.localeCompare(b.z))
    .map(({ z, off }) => ({ value: z, label: `${z.replaceAll("_", " ")} (${offsetText(off)})` }));
}

/** The zone of this device, for example `Asia/Jakarta`. */
export const localZone = () => Intl.DateTimeFormat().resolvedOptions().timeZone;
