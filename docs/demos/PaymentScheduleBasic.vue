<script setup lang="ts">
import { BlessPaymentSchedule } from "blessing-ui";
</script>

<template>
  <!-- a loan of Rp 24,000,000 for studio gear: 9.5% a year over 12 months, 3 payments made -->
  <BlessPaymentSchedule
    :principal="24000000"
    :rate="9.5"
    :months="12"
    start="2026-09"
    :paid="3"
    currency="IDR"
    locale="id-ID"
  />
</template>
