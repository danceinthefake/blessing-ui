<template>
  <BlessVitalsPanel :vitals />
</template>

<script setup lang="ts">
import { BlessVitalsPanel, type BlessVital } from "blessing-ui";

// sample readings for a demo; the ranges are for an adult at rest
const vitals: BlessVital[] = [
  { id: "hr", label: "Heart rate", value: 112, unit: "bpm", normal: [60, 100], time: "08:10" },
  { id: "bp", label: "Blood pressure", value: "118/76", unit: "mmHg", time: "08:10" },
  { id: "spo2", label: "Oxygen", value: 97, unit: "%", normal: [95, 100], time: "08:10" },
  {
    id: "temp",
    label: "Temperature",
    value: 36.8,
    unit: "°C",
    normal: [36.1, 37.2],
    time: "07:45",
  },
  { id: "rr", label: "Breathing", value: 11, unit: "/min", normal: [12, 20], time: "08:10" },
];
</script>
