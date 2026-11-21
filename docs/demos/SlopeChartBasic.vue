<template>
  <BlessSlopeChart
    :data="shows"
    :format="thousands"
    :labels="{ start: 'Friday release', end: 'Monday release', item: 'Show' }"
    label="Weekly plays before and after the new release day"
    style="max-width: 560px"
  />
</template>

<script setup lang="ts">
import { BlessSlopeChart } from "blessing-ui";

// average weekly plays of each show, in thousands, before and after the new release day
const shows = [
  { label: "Morning Brief", start: 42, end: 51 },
  { label: "Deep Dive", start: 36, end: 33 },
  { label: "Weekend Chat", start: 29, end: 18 },
  { label: "Tech Corner", start: 21, end: 31 },
  { label: "Local News", start: 14, end: 15 },
];
const thousands = (v: number) => `${v}k`;
</script>
