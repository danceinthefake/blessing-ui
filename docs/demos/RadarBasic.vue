<script setup lang="ts">
import { BlessRadar } from "blessing-ui";

const axes = ["Speed", "Reach", "Safety", "Comfort", "Cost"];
const series = [
  { name: "Tram", values: [3, 4, 5, 4, 3] },
  { name: "Bus", values: [2, 5, 3, 3, 5] },
];
</script>

<template>
  <BlessRadar :axes="axes" :series="series" :max="5" label="Transit options" />
</template>
