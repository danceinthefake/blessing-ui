<template>
  <BlessOrderHistory
    :orders
    currency="IDR"
    locale="id-ID"
    style="max-width: 560px"
    @again="(id) => (again = id)"
  />
  <p v-if="again" style="margin-top: 12px">Buy again: {{ again }}</p>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { BlessOrderHistory, type BlessPastOrder } from "blessing-ui";
import { art } from "./_data";

const mic = { name: "USB microphone", quantity: 1, image: art("🎙️", "f3e1e7") };
const foam = { name: "Foam panels", quantity: 2, image: art("🧱", "e6e6e6") };
const cable = { name: "XLR cable", quantity: 3, image: art("🔌", "e8f3df") };
const stand = { name: "Desk stand", quantity: 1, image: art("🗜️", "efe6d8") };
const filter = { name: "Pop filter", quantity: 1, image: art("⭕", "e3e0f3") };

const orders: BlessPastOrder[] = [
  {
    id: "o3",
    number: "#10431",
    date: "15 Nov 2026",
    status: "processing",
    total: 1145000,
    items: [mic, foam],
    href: "#o3",
  },
  {
    id: "o2",
    number: "#10388",
    date: "2 Nov 2026",
    status: "shipped",
    total: 255000,
    items: [cable],
    href: "#o2",
  },
  {
    id: "o1",
    number: "#10204",
    date: "12 Oct 2026",
    status: "delivered",
    total: 1530000,
    items: [mic, cable, stand, filter, foam],
    href: "#o1",
  },
  {
    id: "o0",
    number: "#10150",
    date: "1 Oct 2026",
    status: "cancelled",
    total: 85000,
    items: [filter],
  },
];
const again = ref<string>();
</script>
