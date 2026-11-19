import { match, type City } from "./domain";

export interface TripApi {
  search(query: string): Promise<City[]>;
}

const days = (from: number, w: City["days"][number]["weather"][], hi: number, lo: number) =>
  w.map((weather, i) => ({
    date: `2026-11-${from + i}`,
    weather,
    high: hi + (i % 2),
    low: lo - (i % 2),
    rain: weather === "rain" || weather === "storm" ? 70 : undefined,
  }));

const cities: City[] = [
  {
    id: "tokyo",
    name: "Tokyo",
    kind: "City",
    address: "Japan",
    zone: "Asia/Tokyo",
    center: [35.66, 139.76],
    now: { temp: 14, weather: "clear", humidity: 52, wind: 9 },
    days: days(19, ["clear", "partly-cloudy", "cloudy", "rain", "clear"], 16, 8),
    pins: [
      { id: "bigsight", lat: 35.6298, lng: 139.7942, label: "Tokyo Big Sight" },
      { id: "akiba", lat: 35.6984, lng: 139.7731, label: "Akihabara" },
      { id: "ikebukuro", lat: 35.7295, lng: 139.7109, label: "Ikebukuro" },
    ],
  },
  {
    id: "kyoto",
    name: "Kyoto",
    kind: "City",
    address: "Japan",
    zone: "Asia/Tokyo",
    center: [35.0, 135.77],
    now: { temp: 12, weather: "partly-cloudy", humidity: 60, wind: 6 },
    days: days(19, ["partly-cloudy", "cloudy", "rain", "rain", "clear"], 15, 6),
    pins: [
      { id: "fushimi", lat: 34.9671, lng: 135.7727, label: "Fushimi Inari" },
      { id: "kiyomizu", lat: 34.9949, lng: 135.785, label: "Kiyomizu-dera" },
    ],
  },
  {
    id: "jakarta",
    name: "Jakarta",
    kind: "City",
    address: "Indonesia",
    zone: "Asia/Jakarta",
    center: [-6.19, 106.82],
    now: { temp: 31, weather: "storm", humidity: 78, wind: 12 },
    days: days(19, ["storm", "rain", "partly-cloudy", "clear", "cloudy"], 32, 26),
    pins: [
      { id: "monas", lat: -6.1754, lng: 106.8272, label: "Monas" },
      { id: "kota", lat: -6.1352, lng: 106.8133, label: "Kota Tua" },
    ],
  },
];

/** offline adapter: three cities; a real one calls a geocoder and a weather service */
export const mockTripApi: TripApi = {
  async search(query) {
    return match(cities, query);
  },
};
