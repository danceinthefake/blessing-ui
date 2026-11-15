<script setup lang="ts">
import { BlessStreamgraph } from "blessing-ui";

// plays of a podcast network by topic, in thousands, month by month
const months = [
  { month: "Jan", news: 42, tech: 18, culture: 25, sport: 12 },
  { month: "Feb", news: 40, tech: 22, culture: 24, sport: 15 },
  { month: "Mar", news: 37, tech: 29, culture: 27, sport: 21 },
  { month: "Apr", news: 35, tech: 34, culture: 31, sport: 26 },
  { month: "May", news: 33, tech: 38, culture: 30, sport: 33 },
  { month: "Jun", news: 36, tech: 41, culture: 28, sport: 38 },
  { month: "Jul", news: 39, tech: 40, culture: 26, sport: 30 },
  { month: "Aug", news: 44, tech: 37, culture: 29, sport: 22 },
];
const series = [
  { key: "news", label: "News" },
  { key: "tech", label: "Tech" },
  { key: "culture", label: "Culture" },
  { key: "sport", label: "Sport" },
];
const thousands = (v: number) => `${v}k`;
</script>

<template>
  <BlessStreamgraph
    :data="months"
    x="month"
    :series
    :format="thousands"
    :labels="{ step: 'Month' }"
    label="Plays by topic, January to August"
  />
</template>
