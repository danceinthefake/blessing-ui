<template>
  <div>
    <BlessColorSwatches v-model="color" :swatches :labels="{ label: 'Cover color' }" />
    <BlessText as="p" size="sm" style="margin-top: 12px">Cover color: {{ color }}</BlessText>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { BlessColorSwatches, BlessText } from "blessing-ui";

// the color of a show's cover, from the brand colors
const swatches = [
  { value: "#e85078", label: "Pink" },
  { value: "#ff3434", label: "Red" },
  { value: "#ffa800", label: "Orange" },
  { value: "#c0e722", label: "Lime" },
  { value: "#a759ff", label: "Purple" },
  { value: "#3d3e3f", label: "Charcoal" },
];
const color = ref<string | null>("#a759ff");
</script>
