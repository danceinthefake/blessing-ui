<template>
  <BlessButton @click="open = true">Open the cart</BlessButton>
  <BlessCartDrawer
    v-model="lines"
    v-model:open="open"
    currency="IDR"
    locale="id-ID"
    @checkout="open = false"
  />
</template>

<script setup lang="ts">
import { ref } from "vue";
import { BlessButton, BlessCartDrawer, type BlessCartLine } from "blessing-ui";
import { art } from "./_data";

const open = ref(false);
const lines = ref<BlessCartLine[]>([
  {
    id: "mic",
    name: "USB microphone",
    price: 899000,
    quantity: 1,
    image: art("🎙️", "f3e1e7"),
    variant: "Black",
  },
  {
    id: "foam",
    name: "Foam panels, pack of 12",
    price: 240000,
    quantity: 2,
    image: art("🧱", "e6e6e6"),
  },
  { id: "cable", name: "XLR cable, 3 m", price: 85000, quantity: 1, image: art("🔌", "e8f3df") },
]);
</script>
