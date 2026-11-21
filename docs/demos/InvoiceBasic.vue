<template>
  <BlessInvoice
    number="INV-2026-0042"
    issued="2026-11-16"
    due="2026-11-30"
    status="sent"
    :from="{
      name: 'Home Studio',
      lines: ['Jl. Kemang Raya 12', 'Jakarta Selatan 12730', 'NPWP 01.234.567.8-901.000'],
    }"
    :to="{ name: 'Radio Kita', lines: ['Jl. Cikini Raya 7', 'Jakarta Pusat 10330'] }"
    :lines="[
      { description: 'Sponsored episode, 30-second read', quantity: 2, price: 1500000, tax: 11 },
      { description: 'Studio time, per hour', quantity: 3, price: 350000, tax: 11 },
      { description: 'Travel to the guest', quantity: 1, price: 150000 },
    ]"
    :paid="1000000"
    notes="Pay by bank transfer to BCA 123 456 7890, Home Studio. Thank you!"
    currency="IDR"
    locale="id-ID"
  />
</template>

<script setup lang="ts">
import { BlessInvoice } from "blessing-ui";
</script>
