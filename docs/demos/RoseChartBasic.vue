<script setup lang="ts">
import { BlessRoseChart } from "blessing-ui";

// plays of the show by month, in thousands: listening goes up in the rainy months
const months = [
  { label: "Jan", value: 62 },
  { label: "Feb", value: 58 },
  { label: "Mar", value: 49 },
  { label: "Apr", value: 41 },
  { label: "May", value: 33 },
  { label: "Jun", value: 28 },
  { label: "Jul", value: 26 },
  { label: "Aug", value: 30 },
  { label: "Sep", value: 37 },
  { label: "Oct", value: 45 },
  { label: "Nov", value: 57 },
  { label: "Dec", value: 66, color: "chart-2" },
];
const thousands = (v: number) => `${v}k`;
</script>

<template>
  <BlessRoseChart :data="months" :format="thousands" label="Plays by month" />
</template>
