<script setup lang="ts">
import { BlessOrderBook } from "blessing-ui";

// a made-up market
const bids = [
  { price: 1839.5, size: 1.2 },
  { price: 1839.0, size: 3.4 },
  { price: 1838.25, size: 0.8 },
  { price: 1837.5, size: 5.1 },
  { price: 1836.0, size: 2.6 },
  { price: 1835.75, size: 7.3 },
];
const asks = [
  { price: 1840.25, size: 0.9 },
  { price: 1840.75, size: 2.2 },
  { price: 1841.5, size: 4.0 },
  { price: 1842.0, size: 1.5 },
  { price: 1843.25, size: 6.2 },
  { price: 1844.0, size: 3.3 },
];
</script>

<template>
  <BlessOrderBook :bids :asks :depth="6" style="max-width: 360px" />
</template>
