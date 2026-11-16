<script setup lang="ts">
import { ref } from "vue";
import { BlessReturnRequest, type BlessReturnPayload } from "blessing-ui";
import { art } from "./_data";

// the items of order #10204
const items = [
  { id: "mic", name: "USB microphone", quantity: 1, price: 899000, image: art("🎙️", "f3e1e7") },
  { id: "cable", name: "XLR cable, 3 m", quantity: 3, price: 85000, image: art("🔌", "e8f3df") },
  {
    id: "foam",
    name: "Foam panels, pack of 12",
    quantity: 2,
    price: 240000,
    image: art("🧱", "e6e6e6"),
  },
];
const sent = ref<BlessReturnPayload>();
</script>

<template>
  <BlessReturnRequest :items currency="IDR" locale="id-ID" @submit="(p) => (sent = p)" />
  <pre v-if="sent" style="margin-top: 12px">{{ sent }}</pre>
</template>
