<script setup lang="ts">
import { ref } from "vue";
import { BlessMachineBoard, type BlessMachine } from "blessing-ui";

const machines: BlessMachine[] = [
  {
    id: "p1",
    name: "Press 1",
    state: "running",
    minutes: 214,
    job: "WO-0091 · Desk mic kit",
    reading: "92 pcs/h",
  },
  { id: "p2", name: "Press 2", state: "down", minutes: 18, job: "WO-0088 · USB-C cable kit" },
  { id: "c1", name: "CNC mill", state: "setup", minutes: 35, job: "WO-0093 · Metal body" },
  {
    id: "s1",
    name: "Solder line",
    state: "running",
    minutes: 61,
    job: "WO-0091 · USB board",
    reading: "240 pcs/h",
  },
  { id: "pk", name: "Packing", state: "idle", minutes: 9 },
  { id: "l2", name: "Laser marker", state: "offline" },
];
const picked = ref("");
</script>

<template>
  <BlessMachineBoard :machines @select="(id) => (picked = id)" />
  <p v-if="picked" style="margin-top: 12px">Open machine: {{ picked }}</p>
</template>
