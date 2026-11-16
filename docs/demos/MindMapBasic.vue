<script setup lang="ts">
import { BlessMindMap } from "blessing-ui";

const root = {
  label: "Studio mic launch",
  children: [
    {
      label: "Product",
      children: [{ label: "USB-C mic" }, { label: "Desk stand" }, { label: "Pop filter" }],
    },
    { label: "Price", children: [{ label: "Rp 1.2 million" }, { label: "Bundle offer" }] },
    { label: "Content", children: [{ label: "Sound test video" }, { label: "Podcast guests" }] },
    {
      label: "Shops",
      children: [{ label: "Online store" }, { label: "Marketplaces" }, { label: "Music shops" }],
    },
    { label: "Dates", children: [{ label: "Beta in March" }, { label: "Launch in May" }] },
  ],
};
</script>

<template>
  <BlessMindMap :root />
</template>
