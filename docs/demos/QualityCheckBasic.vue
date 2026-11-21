<template>
  <BlessQualityCheck
    v-model="results"
    :items
    @submit="
      (_, ok) => (verdict = ok ? 'Saved: the unit passes.' : 'Saved: the unit goes to rework.')
    "
  />
  <p v-if="verdict" style="margin-top: 12px">{{ verdict }}</p>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { BlessQualityCheck, type BlessQualityItem, type BlessQualityResult } from "blessing-ui";

const items: BlessQualityItem[] = [
  { id: "length", label: "Body length", min: 119.5, max: 120.5, unit: "mm" },
  { id: "noise", label: "Noise floor", max: -70, unit: "dB" },
  { id: "screws", label: "All six screws tight" },
  { id: "finish", label: "No scratches on the body" },
];
const results = ref<BlessQualityResult>({ length: { value: 120.1 }, screws: { pass: true } });
const verdict = ref("");
</script>
