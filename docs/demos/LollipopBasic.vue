<template>
  <BlessLollipop
    :data="episodes"
    sort
    :format="minutes"
    label="Average minutes listened, by episode"
    style="max-width: 560px"
  />
</template>

<script setup lang="ts">
import { BlessLollipop } from "blessing-ui";

// average minutes that listeners stayed in each episode; the newest one stands out
const episodes = [
  { label: "Ep. 32", value: 31 },
  { label: "Ep. 33", value: 28 },
  { label: "Ep. 34", value: 35 },
  { label: "Ep. 35", value: 22 },
  { label: "Ep. 36", value: 38 },
  { label: "Ep. 37", value: 30 },
  { label: "Ep. 38", value: 26 },
  { label: "Ep. 39", value: 33 },
  { label: "Ep. 40", value: 36 },
  { label: "Ep. 41", value: 42, color: "chart-2" },
];
const minutes = (v: number) => `${v} min`;
</script>
