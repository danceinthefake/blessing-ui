<template>
  <BlessBillOfMaterials
    v-model:count="count"
    product="Desk mic kit"
    :parts
    currency="IDR"
    locale="id-ID"
    style="max-width: 640px"
  />
</template>

<script setup lang="ts">
import { ref } from "vue";
import { BlessBillOfMaterials, type BlessBomPart } from "blessing-ui";

// a desk microphone kit that the studio builds and sells
const parts: BlessBomPart[] = [
  {
    id: "mic",
    name: "Microphone unit",
    sku: "ASM-MIC",
    quantity: 1,
    children: [
      {
        id: "capsule",
        name: "Condenser capsule",
        sku: "CAP-16",
        quantity: 1,
        unit: "pcs",
        cost: 185000,
      },
      { id: "board", name: "USB board", sku: "PCB-USB", quantity: 1, unit: "pcs", cost: 96000 },
      { id: "body", name: "Metal body", sku: "BDY-AL", quantity: 1, unit: "pcs", cost: 72000 },
      { id: "screw", name: "M2 screw", sku: "SCR-M2", quantity: 6, unit: "pcs", cost: 400 },
    ],
  },
  {
    id: "stand",
    name: "Desk stand",
    sku: "ASM-STD",
    quantity: 1,
    children: [
      { id: "base", name: "Weighted base", sku: "BAS-01", quantity: 1, unit: "pcs", cost: 41000 },
      { id: "screw2", name: "M2 screw", sku: "SCR-M2", quantity: 2, unit: "pcs", cost: 400 },
    ],
  },
  { id: "cable", name: "USB-C cable, 2 m", sku: "CBL-USBC", quantity: 1, unit: "pcs", cost: 18000 },
];
const count = ref(25);
</script>
