<template>
  <BlessGradebook v-model="scores" :students :assignments editable />
</template>

<script setup lang="ts">
import { ref } from "vue";
import { BlessGradebook, type BlessScores } from "blessing-ui";

const students = [
  { id: "ana", name: "Ana Putri" },
  { id: "budi", name: "Budi Santoso" },
  { id: "cici", name: "Cici Lestari" },
  { id: "dimas", name: "Dimas Pratama" },
];
const assignments = [
  { id: "q1", title: "Quiz 1", max: 20 },
  { id: "lab", title: "Mic lab" },
  { id: "q2", title: "Quiz 2", max: 20 },
  { id: "proj", title: "Final mix" },
];
const scores = ref<BlessScores>({
  ana: { q1: 18, lab: 92, q2: 17, proj: 88 },
  budi: { q1: 12, lab: 70, q2: 9 },
  cici: { q1: 20, lab: 95, q2: 19, proj: 97 },
  dimas: { q1: 8, q2: 11, proj: 64 },
});
</script>
