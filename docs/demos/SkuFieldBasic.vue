<template>
  <div style="display: grid; gap: 20px">
    <!-- try 4006381333931 (valid) and 4006381333932 (a wrong check digit) -->
    <BlessSkuField v-model="barcode" clear-on-scan @scan="(c) => scans.unshift(c)" />
    <BlessSkuField v-model="sku" kind="sku" @scan="(c) => scans.unshift(c)" />
    <p v-if="scans.length">Scans: {{ scans.join(", ") }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { BlessSkuField } from "blessing-ui";

const barcode = ref("");
const sku = ref("MIC-USB-01");
const scans = ref<string[]>([]);
</script>
