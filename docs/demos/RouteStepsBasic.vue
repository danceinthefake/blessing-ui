<template>
  <BlessRouteSteps :steps :current />
  <div style="display: flex; gap: 8px; margin-top: 12px">
    <BlessButton variant="outline" :disabled="current === 0" @click="current--">Back</BlessButton>
    <BlessButton :disabled="current === steps.length - 1" @click="current++">Next step</BlessButton>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { BlessButton, BlessRouteSteps, type BlessRouteStep } from "blessing-ui";

const steps: BlessRouteStep[] = [
  { turn: "start", text: "Head south on Jalan Medan Merdeka Barat", distance: 450, duration: 90 },
  {
    turn: "slight-right",
    text: "Keep right onto Jalan M.H. Thamrin",
    distance: 2100,
    duration: 360,
  },
  {
    turn: "roundabout",
    text: "At the Bundaran HI roundabout, take the second exit",
    distance: 300,
    duration: 60,
  },
  {
    turn: "straight",
    text: "Continue onto Jalan Jenderal Sudirman",
    distance: 3200,
    duration: 540,
  },
  { turn: "left", text: "Turn left onto Jalan Asia Afrika", distance: 650, duration: 150 },
  { turn: "arrive", text: "Arrive at Senayan, on the right", distance: 0, duration: 0 },
];
const current = ref(1);
</script>
