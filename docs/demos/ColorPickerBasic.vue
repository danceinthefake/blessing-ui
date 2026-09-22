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
        { value: '#a759ff', label: 'Utaha' },
        { value: '#ffa800', label: 'Orange' },
        { value: '#c0e722', label: 'Eriri' },
        '#3d3e3f',
      ]"
      label="Accent"
    />
    <BlessColorPicker model-value="#82909a" :show-value="false" disabled label="Disabled" />
  </div>
</template>
