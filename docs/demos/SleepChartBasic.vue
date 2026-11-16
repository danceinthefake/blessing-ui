<script setup lang="ts">
import { BlessSleepChart, type BlessSleepSpan } from "blessing-ui";

// one night from a sleep tracker
const spans: BlessSleepSpan[] = [
  { stage: "awake", start: "23:05", end: "23:20" },
  { stage: "light", start: "23:20", end: "23:55" },
  { stage: "deep", start: "23:55", end: "01:05" },
  { stage: "light", start: "01:05", end: "01:40" },
  { stage: "rem", start: "01:40", end: "02:10" },
  { stage: "light", start: "02:10", end: "03:00" },
  { stage: "deep", start: "03:00", end: "03:45" },
  { stage: "awake", start: "03:45", end: "03:55" },
  { stage: "light", start: "03:55", end: "04:50" },
  { stage: "rem", start: "04:50", end: "05:35" },
  { stage: "light", start: "05:35", end: "06:20" },
  { stage: "awake", start: "06:20", end: "06:30" },
];
</script>

<template>
  <BlessSleepChart :spans />
</template>
