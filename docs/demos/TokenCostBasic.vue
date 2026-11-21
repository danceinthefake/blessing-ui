<template>
  <BlessTokenCost
    model="Example model"
    :usage="{ input: 1840, cached: 12000, output: 620 }"
    :prices
  />
</template>

<script setup lang="ts">
import { BlessTokenCost } from "blessing-ui";

// made-up prices for one million tokens; use the price list of your provider
const prices = { input: 3, cached: 0.3, output: 15 };
</script>
