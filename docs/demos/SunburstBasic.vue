<script setup lang="ts">
import { BlessSunburst } from "blessing-ui";

// where the money of a small podcast studio goes in one year, in thousands of dollars
const budget = [
  {
    id: "prod",
    label: "Production",
    children: [
      { id: "prod-edit", label: "Editing", value: 42 },
      { id: "prod-gear", label: "Gear", value: 18 },
      { id: "prod-room", label: "Studio rent", value: 24 },
    ],
  },
  {
    id: "people",
    label: "Hosts and guests",
    children: [
      { id: "people-hosts", label: "Hosts", value: 60 },
      { id: "people-guests", label: "Guest travel", value: 12 },
    ],
  },
  {
    id: "growth",
    label: "Growth",
    children: [
      { id: "growth-ads", label: "Ads", value: 20 },
      { id: "growth-social", label: "Social clips", value: 9 },
    ],
  },
  { id: "hosting", label: "Hosting", value: 6 },
];
const money = (v: number) => `${v}k`;
</script>

<template>
  <BlessSunburst :data="budget" :format="money" label="Yearly budget" />
</template>
