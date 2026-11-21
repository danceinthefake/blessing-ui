<template>
  <div style="display: grid; gap: 16px">
    <BlessPrice :amount="1299000" currency="IDR" locale="id-ID" size="lg" />
    <BlessPrice :amount="899000" :was="1299000" currency="IDR" locale="id-ID" size="lg" />
    <BlessPrice :amount="4.2" :was="5" :unit-price="16.8" unit="kg" />
    <BlessPrice :amount="2.5" :unit-price="0.5" unit="100 ml" size="sm" />
  </div>
</template>

<script setup lang="ts">
import { BlessPrice } from "blessing-ui";
</script>
