<template>
  <BlessButton
    size="sm"
    variant="outline"
    style="margin-bottom: 12px"
    @click="box?.loadText(sample)"
  >
    Try a sample file
  </BlessButton>
  <BlessCsvImport ref="box" :fields @import="(rows) => (done = rows.length)" />
  <p v-if="done !== undefined" style="margin-top: 12px">Imported {{ done }} rows.</p>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { BlessButton, BlessCsvImport } from "blessing-ui";

const fields = [
  { key: "sku", label: "SKU", required: true },
  { key: "name", label: "Product name", required: true },
  { key: "stock", label: "Stock" },
  { key: "price", label: "Price" },
];
// a sample file: the column names differ from the fields, and one row has no SKU
const sample = `Product Name,sku,On hand,Unit price
"USB microphone, cardioid",MIC-001,12,899000
XLR cable 3 m,CBL-003,40,85000
Foam panel pack,,6,240000
Pop filter,ACC-010,25,45000`;
const box = ref<InstanceType<typeof BlessCsvImport>>();
const done = ref<number>();
</script>
