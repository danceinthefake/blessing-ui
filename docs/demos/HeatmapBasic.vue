<template>
  <BlessHeatmap
    :rows
    :columns
    :values
    :format="(v) => `${v} plays`"
    label="Plays by weekday and hour"
  />
</template>

<script setup lang="ts">
import { BlessHeatmap } from "blessing-ui";

// plays of a podcast by weekday and hour, from 6:00 to 23:00; mornings and evenings are busy
const rows = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const hours = Array.from({ length: 18 }, (_, i) => i + 6);
const columns = hours.map(String);
const peak = (h: number, at: number, w: number) => Math.exp(-((h - at) ** 2) / w);
const values = rows.map((_, d) =>
  hours.map((h) => {
    const weekend = d >= 5;
    const v = (weekend ? 30 : 80) * peak(h, 8, 2) + (weekend ? 90 : 60) * peak(h, 21, 4) + 10;
    return Math.round(v + ((d * 7 + h * 3) % 11));
  }),
);
</script>
