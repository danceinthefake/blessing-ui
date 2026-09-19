<script setup lang="ts">
import { ref } from "vue";
import { BlessButton, BlessInput, BlessTour, type BlessTourStep } from "blessing-ui";
const open = ref(false);
const steps: BlessTourStep[] = [
  { title: "Welcome", text: "Three quick stops. Esc skips at any time." },
  {
    target: "#tour-search",
    title: "Search",
    text: "Filter episodes by title or air date.",
    placement: "bottom",
  },
  {
    target: "#tour-save",
    title: "Save",
    text: "Everything auto-saves; this forces it.",
    placement: "top",
  },
];
</script>

<template>
  <div class="col" style="max-width: 480px">
    <BlessButton color="accent" @click="open = true">Start tour</BlessButton>
    <BlessInput id="tour-search" placeholder="search…" />
    <div><BlessButton id="tour-save" variant="outline">Save</BlessButton></div>
    <BlessTour v-model:open="open" :steps />
  </div>
</template>
