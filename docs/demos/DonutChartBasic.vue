<script setup lang="ts">
import { ref } from "vue";
import { BlessDonutChart, BlessStack, BlessSwitch } from "blessing-ui";

// where the storage of a podcast team goes, in GB
const data = [
  { label: "Raw audio", value: 412 },
  { label: "Video", value: 268 },
  { label: "Episodes", value: 96 },
  { label: "Artwork", value: 31 },
];
const pie = ref(false);
</script>

<template>
  <BlessStack :gap="4">
    <BlessSwitch v-model="pie">Pie</BlessSwitch>
    <BlessDonutChart :data :pie :format="(v) => `${v} GB`" label="Storage by type" />
  </BlessStack>
</template>
