<script setup lang="ts">
import { BlessSmallMultiples } from "blessing-ui";

// weekly plays of eight shows over twelve weeks, in thousands
const series = [
  { label: "Morning Brief", values: [42, 44, 43, 47, 49, 48, 51, 50, 53, 52, 55, 57] },
  { label: "Deep Dive", values: [38, 36, 37, 35, 34, 36, 33, 34, 32, 33, 31, 30] },
  { label: "Weekend Chat", values: [21, 22, 25, 24, 28, 31, 29, 33, 35, 34, 38, 41] },
  { label: "Tech Corner", values: [18, 19, 18, 20, 19, 21, 22, 21, 23, 22, 24, 23] },
  { label: "Local News", values: [12, 12, 13, 12, 14, 13, 13, 14, 15, 14, 15, 15] },
  { label: "Sport Talk", values: [9, 14, 8, 16, 10, 18, 9, 17, 11, 19, 10, 20] },
  { label: "Book Club", values: [7, 7, 8, 8, 8, 9, 9, 10, 10, 11, 11, 12] },
  { label: "Music Notes", values: [15, 14, 12, 11, 10, 9, 9, 8, 7, 7, 6, 6] },
];
const steps = Array.from({ length: 12 }, (_, i) => `W${i + 1}`);
const thousands = (v: number) => `${v}k`;
</script>

<template>
  <BlessSmallMultiples :series :steps :format="thousands" label="Weekly plays of each show" />
</template>
