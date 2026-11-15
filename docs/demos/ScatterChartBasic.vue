<script setup lang="ts">
import { BlessChart, BlessScatterChart, type BlessScatterPoint } from "blessing-ui";

// podcast shows: episodes a month, listeners per episode (thousands), and the size of the archive
const points: BlessScatterPoint[] = [
  { label: "Morning Kopi", x: 20, y: 4.2, size: 340, group: "news" },
  { label: "Kabar Kota", x: 22, y: 6.8, size: 410, group: "news" },
  { label: "Dapur Kita", x: 4, y: 9.1, size: 120, group: "life" },
  { label: "Jalan Sore", x: 8, y: 5.4, size: 210, group: "life" },
  { label: "Kode Santai", x: 2, y: 12.6, size: 64, group: "tech" },
  { label: "Startup Talk", x: 6, y: 7.9, size: 150, group: "tech" },
  { label: "Bola Malam", x: 12, y: 8.3, size: 260, group: "life" },
];
const groups = [
  { id: "news", label: "News" },
  { id: "life", label: "Life" },
  { id: "tech", label: "Tech" },
];
</script>

<template>
  <BlessChart
    title="Shows"
    description="Bubble size: episodes in the archive"
    :legend="groups.map((g) => g.label)"
    height="auto"
  >
    <BlessScatterChart
      :points
      :groups
      x-label="Episodes a month"
      y-label="Listeners (k)"
      label="Shows by output and listeners"
    />
  </BlessChart>
</template>
