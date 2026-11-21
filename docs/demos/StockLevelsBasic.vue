<template>
  <BlessStockLevels :items />
</template>

<script setup lang="ts">
import { BlessStockLevels, type BlessStockItem } from "blessing-ui";

const items: BlessStockItem[] = [
  {
    sku: "MIC-USB-01",
    name: "USB microphone",
    location: "Shelf A1",
    onHand: 42,
    reserved: 6,
    reorderAt: 10,
    unit: "pcs",
  },
  {
    sku: "CBL-XLR-03",
    name: "XLR cable, 3 m",
    location: "Shelf B4",
    onHand: 18,
    reserved: 9,
    reorderAt: 12,
    unit: "pcs",
  },
  {
    sku: "FOM-PNL-12",
    name: "Foam panels, pack of 12",
    location: "Store room",
    onHand: 2,
    reserved: 2,
    reorderAt: 4,
    unit: "box",
  },
  {
    sku: "ACC-POP-10",
    name: "Pop filter",
    location: "Shelf A2",
    onHand: 31,
    reorderAt: 8,
    unit: "pcs",
  },
  {
    sku: "HPH-CLS-02",
    name: "Closed headphones",
    location: "Shelf A3",
    onHand: 7,
    reserved: 1,
    reorderAt: 6,
    unit: "pcs",
  },
];
</script>
