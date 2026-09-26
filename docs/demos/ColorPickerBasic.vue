<script setup lang="ts">
import { ref } from "vue";
import { BlessColorPicker } from "blessing-ui";
const color = ref("#e85078");
</script>

<template>
  <div class="col">
    <BlessColorPicker
      v-model="color"
      :swatches="[
        { value: '#e85078', label: 'Megumi' },
        { value: '#e03028', label: 'Utaha' },
        { value: '#4090d0', label: 'Izumi' },
        { value: '#b878b0', label: 'Michiru' },
        { value: '#c8e018', label: 'Eriri' },
        { value: '#3d3e3f', label: 'Ink' },
      ]"
      label="Accent"
    />
    <BlessColorPicker model-value="#82909a" :show-value="false" disabled label="Disabled" />
  </div>
</template>
