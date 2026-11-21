<template>
  <BlessPriceTicker :items currency="USD" />
</template>

<script setup lang="ts">
import { BlessPriceTicker } from "blessing-ui";

// made-up symbols and prices
const items = [
  { symbol: "HMST", price: 1840, change: 2.35 },
  { symbol: "RDIO", price: 412.5, change: -1.1 },
  { symbol: "MICS", price: 96.2, change: 0.4 },
  { symbol: "WAVE", price: 2210, change: -3.05 },
  { symbol: "CAST", price: 58.75, change: 0 },
  { symbol: "LOUD", price: 731, change: 5.6 },
];
</script>
