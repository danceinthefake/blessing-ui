<script setup lang="ts">
import { ref } from "vue";
import { BlessMedicationSchedule, type BlessDose } from "blessing-ui";

// a sample plan; "now" is fixed so the demo looks the same on every visit
const doses: BlessDose[] = [
  { id: "m1", medicine: "Metformin", amount: "500 mg", time: "07:30", note: "with breakfast" },
  { id: "m2", medicine: "Amlodipine", amount: "1 tablet", time: "07:30" },
  { id: "m3", medicine: "Metformin", amount: "500 mg", time: "19:00", note: "with dinner" },
  { id: "m4", medicine: "Vitamin D", amount: "1 capsule", time: "21:00" },
];
const taken = ref(["m2"]);
</script>

<template>
  <BlessMedicationSchedule v-model="taken" :doses now="10:15" style="max-width: 420px" />
</template>
