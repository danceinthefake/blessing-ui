<script setup lang="ts">
import { BlessParallelCoordinates } from "blessing-ui";

// five shows on four measures; each measure has its own scale
const shows = [
  { show: "Morning Brief", plays: 51, minutes: 24, finish: 81, rating: 4.6 },
  { show: "Deep Dive", plays: 33, minutes: 67, finish: 58, rating: 4.8 },
  { show: "Weekend Chat", plays: 18, minutes: 44, finish: 49, rating: 4.1 },
  { show: "Tech Corner", plays: 31, minutes: 30, finish: 72, rating: 4.4 },
  { show: "Local News", plays: 15, minutes: 12, finish: 88, rating: 3.9 },
];
const axes = [
  { key: "plays", label: "Plays", format: (v: number) => `${v}k` },
  { key: "minutes", label: "Length", format: (v: number) => `${v} min` },
  { key: "finish", label: "Finish rate", format: (v: number) => `${v}%` },
  { key: "rating", label: "Rating" },
];
</script>

<template>
  <BlessParallelCoordinates :data="shows" name="show" :axes label="Shows on four measures" />
</template>
