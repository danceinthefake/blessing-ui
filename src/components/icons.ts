// The built-in icons of BlessIcon (revamp 2026-11): drawn for this library on a 24px grid with a
// 2px round stroke, so they sit with the soft corners. `fill: true` icons are solid shapes.
export interface BlessIconShape {
  paths: string[];
  fill?: boolean;
}

export const blessIcons = {
  close: { paths: ["M6 6l12 12", "M18 6L6 18"] },
  check: { paths: ["M5 12.5l4.5 4.5L19 7.5"] },
  plus: { paths: ["M12 5v14", "M5 12h14"] },
  minus: { paths: ["M5 12h14"] },
  "chevron-left": { paths: ["M14.5 6l-6 6 6 6"] },
  "chevron-right": { paths: ["M9.5 6l6 6-6 6"] },
  "chevron-up": { paths: ["M6 14.5l6-6 6 6"] },
  "chevron-down": { paths: ["M6 9.5l6 6 6-6"] },
  "arrow-left": { paths: ["M19 12H5", "M11 6l-6 6 6 6"] },
  "arrow-right": { paths: ["M5 12h14", "M13 6l6 6-6 6"] },
  "arrow-up": { paths: ["M12 19V5", "M6 11l6-6 6 6"] },
  "arrow-down": { paths: ["M12 5v14", "M6 13l6 6 6-6"] },
  play: { paths: ["M8 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5z"], fill: true },
  pause: { paths: ["M7 5h3.5v14H7z", "M13.5 5H17v14h-3.5z"], fill: true },
  "skip-back": { paths: ["M5 5h2.5v14H5z", "M19 5.5v13L9.5 12z"], fill: true },
  "skip-forward": { paths: ["M16.5 5H19v14h-2.5z", "M5 5.5v13L14.5 12z"], fill: true },
  volume: { paths: ["M11 5L6 9H3v6h3l5 4V5z", "M15.5 8.5a5 5 0 0 1 0 7", "M18.5 6a9 9 0 0 1 0 12"] },
  "volume-mute": { paths: ["M11 5L6 9H3v6h3l5 4V5z", "M22 9l-6 6", "M16 9l6 6"] },
  "rotate-ccw": { paths: ["M4 12a8 8 0 1 0 2.4-5.7L4 8.5", "M4 4v4.5h4.5"] },
  "rotate-cw": { paths: ["M20 12a8 8 0 1 1-2.4-5.7L20 8.5", "M20 4v4.5h-4.5"] },
  refresh: { paths: ["M21 12a9 9 0 0 0-15.5-6.3L3 8", "M3 3v5h5", "M3 12a9 9 0 0 0 15.5 6.3L21 16", "M21 21v-5h-5"] },
  more: { paths: ["M6 12h.01", "M12 12h.01", "M18 12h.01"] },
  search: { paths: ["M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14z", "M20 20l-4-4"] },
  menu: { paths: ["M4 7h16", "M4 12h16", "M4 17h16"] },
  external: { paths: ["M14 5h5v5", "M19 5l-8 8", "M17 14v4a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1h4"] },
  // the moods: daylight, the device, golden hour, night
  sun: { paths: ["M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8z", "M12 2.5v2", "M12 19.5v2", "M4.6 4.6L6 6", "M18 18l1.4 1.4", "M2.5 12h2", "M19.5 12h2", "M4.6 19.4L6 18", "M18 6l1.4-1.4"] },
  system: { paths: ["M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16z", "M12 4v16"] },
  sunset: { paths: ["M7 15a5 5 0 0 1 10 0", "M3 15h18", "M6 19h12", "M12 4.5v3", "M5 8.5l1.5 1.5", "M19 8.5L17.5 10"] },
  moon: { paths: ["M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"] },
} satisfies Record<string, BlessIconShape>;

export type BlessIconName = keyof typeof blessIcons;
