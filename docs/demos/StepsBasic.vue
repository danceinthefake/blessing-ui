<script setup lang="ts">
import { ref } from "vue";
import { BlessButton, BlessSteps } from "blessing-ui";
const step = ref(1);
const steps = [
  { label: "Cart", description: "3 items" },
  { label: "Shipping" },
  { label: "Payment" },
  { label: "Done" },
];
</script>

<template>
  <div class="col" style="max-width: 640px">
    <BlessSteps v-model="step" :steps clickable />
    <div class="row">
      <BlessButton size="sm" variant="outline" :disabled="step === 0" @click="step--"
        >Back</BlessButton
      >
      <BlessButton size="sm" color="accent" :disabled="step === steps.length - 1" @click="step++"
        >Next</BlessButton
      >
    </div>
    <BlessSteps :model-value="2" :steps="steps.slice(0, 3)" orientation="vertical" />
  </div>
</template>
