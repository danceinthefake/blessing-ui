<template>
  <BlessOrderSummary
    :lines
    :discount="7.8"
    discount-label="LISTENER10"
    :shipping="0"
    :tax="5.83"
    style="max-width: 380px"
  >
    <template #footer="{ total }">
      <BlessButton block>Pay {{ `$${total.toFixed(2)}` }}</BlessButton>
    </template>
  </BlessOrderSummary>
</template>

<script setup lang="ts">
import { BlessButton, BlessOrderSummary } from "blessing-ui";

const lines = [
  { id: 1, name: "Home Studio hoodie", note: "Size M · Black", price: 48, quantity: 1 },
  { id: 2, name: "Pop filter", price: 12, quantity: 2 },
  { id: 3, name: "Sticker pack", note: "Season one", price: 6, quantity: 1 },
];
</script>
