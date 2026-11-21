<template>
  <div>
    <BlessModelPicker v-model="model" :models />
    <BlessText as="p" size="sm" style="margin-top: 12px">Model id: {{ model }}</BlessText>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { BlessModelPicker, BlessText } from "blessing-ui";

const models = [
  {
    id: "swift",
    name: "Swift",
    description: "Quick answers for short questions",
    speed: 3,
    cost: 1,
  },
  {
    id: "studio",
    name: "Studio",
    description: "Good at show notes and titles",
    speed: 2,
    cost: 2,
    tags: ["default"],
  },
  {
    id: "deep",
    name: "Deep",
    description: "Reads whole transcripts and images",
    speed: 1,
    cost: 3,
    tags: ["vision", "new"],
  },
  { id: "legacy", name: "Legacy", description: "Turned off for this workspace", disabled: true },
];
const model = ref("studio");
</script>
