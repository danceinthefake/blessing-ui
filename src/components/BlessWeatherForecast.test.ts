import { mount } from "@vue/test-utils";
import BlessWeatherForecast from "./BlessWeatherForecast.vue";

test("BlessWeatherForecast: now, facts, days with words for screen readers, and the range bar", () => {
  const w = mount(BlessWeatherForecast, {
    props: {
      place: "Jakarta",
      temp: 31.4,
      weather: "partly-cloudy",
      feelsLike: 36,
      humidity: 74,
      wind: 12,
      days: [
        { date: "2026-11-17", weather: "storm", high: 33, low: 25, rain: 80 },
        { date: "2026-11-18", weather: "clear", high: 34, low: 26 },
      ],
    },
  });
  expect(w.find("section").attributes("aria-label")).toBe("Jakarta");
  expect(w.find(".bless-weather__temp").text()).toBe("31°C");
  expect(w.find(".bless-weather__word").text()).toBe("Partly cloudy");
  expect(w.findAll(".bless-weather__facts dd").map((d) => d.text())).toEqual([
    "36°C",
    "74%",
    "12 km/h",
  ]);
  const day = w.find(".bless-weather__day");
  expect(day.find(".bless-weather__name").text()).toBe("Tue");
  expect(day.findAll(".bless-sr").map((s) => s.text())).toEqual([
    "Thunderstorm",
    "low 25°C, high 33°C",
  ]);
  expect(day.find(".bless-weather__rain").text()).toBe("80% rain");
  expect(day.find(".bless-weather__bar span").attributes("style")).toContain(
    "inset-inline: 0% 11.1111%",
  );
  expect(w.findAll("svg").length).toBe(3);
});
