<script setup lang="ts">
import { ref } from "vue";
import { BlessLineItemEditor, type BlessLineItem } from "blessing-ui";

// a quote for a small studio setup
const lines = ref<BlessLineItem[]>([
  {
    id: "1",
    product: "USB microphone, cardioid",
    quantity: 2,
    unit: "pcs",
    price: 899000,
    discount: 5,
    tax: 11,
  },
  { id: "2", product: "Foam panels, pack of 12", quantity: 3, unit: "box", price: 240000, tax: 11 },
  { id: "3", product: "Setup and room tuning", quantity: 4, unit: "hour", price: 350000, tax: 11 },
]);
</script>

<template>
  <BlessLineItemEditor v-model="lines" currency="IDR" locale="id-ID" />
</template>
