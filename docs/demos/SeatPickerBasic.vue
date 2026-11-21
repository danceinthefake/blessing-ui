<template>
  <BlessSeatPicker v-model="chosen" :rows :zones :max="6" />
</template>

<script setup lang="ts">
import { ref } from "vue";
import { BlessSeatPicker, type BlessSeat, type BlessSeatRow } from "blessing-ui";

// a small hall for a live recording: 6 rows of 10 seats with an aisle in the middle
const zones = [
  { key: "front", label: "Front", price: 35 },
  { key: "middle", label: "Middle", price: 25 },
  { key: "back", label: "Back", price: 15 },
];
const taken = new Set(["A4", "A5", "B6", "C2", "C3", "D8", "E5", "E6", "F1"]);
const rows: BlessSeatRow[] = "ABCDEF".split("").map((label, r) => {
  const seat = (n: number): BlessSeat => ({
    id: `${label}${n}`,
    zone: r < 2 ? "front" : r < 4 ? "middle" : "back",
    taken: taken.has(`${label}${n}`),
  });
  const seats: (BlessSeat | null)[] = [1, 2, 3, 4, 5].map(seat);
  return { label, seats: [...seats, null, ...[6, 7, 8, 9, 10].map(seat)] };
});
const chosen = ref<string[]>(["C5", "C6"]);
</script>
