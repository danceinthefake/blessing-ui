<script setup lang="ts">
import { ref } from "vue";
import { BlessGauge, BlessSlider } from "blessing-ui";

const load = ref(72);
const temp = ref(4);
const zones = [
  { to: 60, color: "success", label: "Fine" },
  { to: 85, color: "warning", label: "Busy" },
  { to: 100, color: "danger", label: "Overloaded" },
];
</script>

<template>
  <div class="col" style="gap: 1.5rem; max-width: 320px">
    <BlessGauge :value="load" :zones label="CPU load" :format="(v: number) => `${v}%`" />
    <BlessSlider v-model="load" :min="0" :max="100" aria-label="CPU load" />
    <BlessGauge
      :value="temp"
      :min="-20"
      :max="40"
      variant="linear"
      label="Fridge"
      :format="(v: number) => `${v} °C`"
      :zones="[
        { to: 0, color: 'info', label: 'Freezing' },
        { to: 5, color: 'success', label: 'Cold enough' },
        { to: 40, color: 'danger', label: 'Too warm' },
      ]"
    />
    <BlessSlider v-model="temp" :min="-20" :max="40" aria-label="Fridge temperature" />
  </div>
</template>
