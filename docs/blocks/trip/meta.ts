export default {
  title: "Trip",
  group: "Everyday",
  order: 25,
  summary:
    "A trip helper: search a city, then see its weather for five days, the time there next to the time at home, and the places to visit on a map. Each part does one small job.",
  components: [
    "BlessPlaceSearch",
    "BlessWeatherForecast",
    "BlessWorldClock",
    "BlessMapPins",
    "BlessText",
  ],
  height: "980px",
};
