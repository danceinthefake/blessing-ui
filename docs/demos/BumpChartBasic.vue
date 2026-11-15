<script setup lang="ts">
import { BlessBumpChart } from "blessing-ui";

// weekly plays of five shows, in thousands; the chart ranks them for each week
const weeks = [
  { week: "W1", brief: 52, dive: 41, chat: 38, tech: 22, local: 18 },
  { week: "W2", brief: 49, dive: 44, chat: 31, tech: 29, local: 17 },
  { week: "W3", brief: 47, dive: 39, chat: 28, tech: 41, local: 21 },
  { week: "W4", brief: 50, dive: 36, chat: 24, tech: 46, local: 26 },
  { week: "W5", brief: 44, dive: 38, chat: 27, tech: 51, local: 30 },
  { week: "W6", brief: 42, dive: 40, chat: 33, tech: 48, local: 35 },
];
const series = [
  { key: "brief", label: "Morning Brief" },
  { key: "dive", label: "Deep Dive" },
  { key: "chat", label: "Weekend Chat" },
  { key: "tech", label: "Tech Corner" },
  { key: "local", label: "Local News" },
];
const thousands = (v: number) => `${v}k`;
</script>

<template>
  <BlessBumpChart
    :data="weeks"
    x="week"
    :series
    :format="thousands"
    :labels="{ step: 'Week' }"
    label="Rank of each show by weekly plays"
  />
</template>
