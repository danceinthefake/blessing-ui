<template>
  <BlessCurrencyConverter
    v-model:amount="amount"
    v-model:from="from"
    v-model:to="to"
    :rates
    updated="16 Nov 2026, 09:00"
  />
</template>

<script setup lang="ts">
import { ref } from "vue";
import { BlessCurrencyConverter } from "blessing-ui";

// sample rates for one US dollar; a real page loads them from a rates service
const rates = { USD: 1, EUR: 0.93, IDR: 16250, JPY: 154.2, SGD: 1.34, GBP: 0.79 };
const amount = ref(250);
const from = ref("USD");
const to = ref("IDR");
</script>
