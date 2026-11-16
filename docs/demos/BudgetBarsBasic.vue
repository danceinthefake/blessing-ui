<script setup lang="ts">
import { BlessBudgetBars } from "blessing-ui";

// the November budget of a small podcast
const budgets = [
  { name: "Gear", spent: 1450000, budget: 1200000 },
  { name: "Hosting", spent: 150000, budget: 150000 },
  { name: "Guests and food", spent: 420000, budget: 800000 },
  { name: "Ads", spent: 250000, budget: 1000000 },
];
</script>

<template>
  <BlessBudgetBars :budgets currency="IDR" locale="id-ID" style="max-width: 440px" />
</template>
