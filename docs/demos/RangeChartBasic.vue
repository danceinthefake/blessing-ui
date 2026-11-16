<script setup lang="ts">
import { BlessRangeChart } from "blessing-ui";

// the shortest and the longest episode of each show, with the average, in minutes
const shows = [
  { label: "Morning Brief", low: 18, high: 32, value: 24 },
  { label: "Deep Dive", low: 48, high: 96, value: 67 },
  { label: "Weekend Chat", low: 35, high: 58, value: 44 },
  { label: "Tech Corner", low: 22, high: 41, value: 30 },
  { label: "Local News", low: 9, high: 15, value: 12 },
];
const minutes = (v: number) => `${v} min`;
</script>

<template>
  <BlessRangeChart
    :data="shows"
    :format="minutes"
    :labels="{ item: 'Show', low: 'Shortest', high: 'Longest', value: 'Average' }"
    label="Episode length of each show"
    style="max-width: 560px"
  />
</template>
