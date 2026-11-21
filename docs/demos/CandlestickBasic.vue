<template>
  <BlessCandlestick :data="days" :format="money" label="Share price, 3 to 14 November" />
</template>

<script setup lang="ts">
import { BlessCandlestick } from "blessing-ui";

// the price of one share over two weeks of trading days
const days = [
  { label: "3 Nov", open: 120, high: 126, low: 118, close: 124 },
  { label: "4 Nov", open: 124, high: 128, low: 121, close: 122 },
  { label: "5 Nov", open: 122, high: 123, low: 115, close: 116 },
  { label: "6 Nov", open: 116, high: 120, low: 113, close: 119 },
  { label: "7 Nov", open: 119, high: 125, low: 118, close: 125 },
  { label: "10 Nov", open: 125, high: 131, low: 124, close: 130 },
  { label: "11 Nov", open: 130, high: 132, low: 126, close: 127 },
  { label: "12 Nov", open: 127, high: 129, low: 122, close: 123 },
  { label: "13 Nov", open: 123, high: 128, low: 121, close: 127 },
  { label: "14 Nov", open: 127, high: 134, low: 126, close: 133 },
];
const money = (v: number) => `$${v}`;
</script>
