<template>
  <BlessChart title="Time listened" description="Minutes per play" height="auto">
    <BlessBoxPlot
      :groups
      :format="(v) => `${Math.round(v * 10) / 10}`"
      label="Minutes per play, by day"
    />
  </BlessChart>
</template>

<script setup lang="ts">
import { BlessBoxPlot, BlessChart } from "blessing-ui";

// minutes that each listener stayed, in a sample of 40 plays a day; the values repeat with a small change
const day = (base: number, spread: number, long: number[] = []) => [
  ...Array.from({ length: 40 }, (_, i) =>
    Math.round(base + spread * Math.sin(i * 1.7) * ((i % 7) / 6)),
  ),
  ...long,
];
const groups = [
  { label: "Mon", values: day(18, 9) },
  { label: "Tue", values: day(21, 8, [52]) },
  { label: "Wed", values: day(16, 11) },
  { label: "Thu", values: day(24, 7, [58, 61]) },
  { label: "Fri", values: day(28, 12) },
];
</script>
