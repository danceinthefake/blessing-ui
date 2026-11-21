<template>
  <BlessWeatherForecast
    place="Jakarta"
    :temp="31"
    weather="partly-cloudy"
    :feels-like="36"
    :humidity="74"
    :wind="12"
    :days
  />
</template>

<script setup lang="ts">
import { BlessWeatherForecast, type BlessWeatherDay } from "blessing-ui";

const days: BlessWeatherDay[] = [
  { date: "2026-11-17", weather: "storm", high: 32, low: 25, rain: 80 },
  { date: "2026-11-18", weather: "rain", high: 31, low: 25, rain: 65 },
  { date: "2026-11-19", weather: "partly-cloudy", high: 33, low: 26, rain: 20 },
  { date: "2026-11-20", weather: "clear", high: 34, low: 26 },
  { date: "2026-11-21", weather: "cloudy", high: 32, low: 25, rain: 10 },
];
</script>
