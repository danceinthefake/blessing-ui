import type { BlessMapPin, BlessPlace, BlessWeatherDay } from "blessing-ui";

export interface City extends BlessPlace {
  zone: string;
  center: [number, number];
  now: { temp: number; weather: BlessWeatherDay["weather"]; humidity: number; wind: number };
  days: BlessWeatherDay[];
  pins: BlessMapPin[];
}

/** cities whose name or country starts a word with the query */
export function match(cities: City[], query: string) {
  const q = query.trim().toLowerCase();
  return cities.filter((c) =>
    `${c.name} ${c.address ?? ""}`
      .toLowerCase()
      .split(/[\s,]+/)
      .some((w) => w.startsWith(q)),
  );
}
