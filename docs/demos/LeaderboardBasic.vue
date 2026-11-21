<template>
  <BlessLeaderboard
    :rows
    :me="8"
    :limit="5"
    :format="episodes"
    label="Top listeners in November"
    style="max-width: 480px"
  />
</template>

<script setup lang="ts">
import { BlessLeaderboard } from "blessing-ui";

// listeners who finished the most episodes this month; `previous` is their place last month
const rows = [
  { id: 1, name: "Rara", score: 48, previous: 2 },
  { id: 2, name: "Yusuf", score: 52, previous: 1 },
  { id: 3, name: "Mei", score: 41, previous: 5 },
  { id: 4, name: "Tono", score: 41, previous: 3 },
  { id: 5, name: "Lina", score: 37 },
  { id: 6, name: "Arif", score: 30, previous: 4 },
  { id: 7, name: "Sari", score: 26, previous: 6 },
  { id: 8, name: "You", score: 19, previous: 11 },
  { id: 9, name: "Dewa", score: 12, previous: 8 },
];
const episodes = (v: number) => `${v} ep.`;
</script>
