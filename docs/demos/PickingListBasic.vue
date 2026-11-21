<template>
  <BlessPickingList v-model="lines" order="Order SO-2026-0417" @finish="complete = true" />
  <p v-if="complete" style="margin-top: 12px">Take the tote to packing.</p>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { BlessPickingList, type BlessPickLine } from "blessing-ui";

// try scanning MIC-USB-01, then a code that is not on the list
const lines = ref<BlessPickLine[]>([
  {
    id: "1",
    sku: "CBL-XLR-03",
    name: "XLR cable, 3 m",
    location: "B-04-1",
    quantity: 3,
    picked: 3,
  },
  { id: "2", sku: "MIC-USB-01", name: "USB microphone", location: "A-01-2", quantity: 2 },
  { id: "3", sku: "ACC-POP-10", name: "Pop filter", location: "A-02-1", quantity: 2, picked: 1 },
  { id: "4", sku: "FOM-PNL-12", name: "Foam panels, pack of 12", location: "C-11-3", quantity: 1 },
]);
const complete = ref(false);
</script>
