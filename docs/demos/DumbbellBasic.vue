<script setup lang="ts">
import { BlessDumbbell } from "blessing-ui";

// how the shows of a network changed after a new release schedule, in thousands of plays a week
const shows = [
  { label: "Morning Brief", start: 42, end: 58 },
  { label: "Deep Dive", start: 31, end: 36 },
  { label: "Weekend Chat", start: 27, end: 22 },
  { label: "Tech Corner", start: 18, end: 29 },
  { label: "Local News", start: 15, end: 14 },
];
const thousands = (v: number) => `${v}k`;
</script>

<template>
  <BlessDumbbell
    :data="shows"
    :format="thousands"
    :labels="{ start: 'Old schedule', end: 'New schedule', row: 'Show' }"
    label="Weekly plays before and after the new schedule"
    style="max-width: 560px"
  />
</template>
