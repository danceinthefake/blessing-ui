<script setup lang="ts">
import { BlessOpeningHours, type BlessWeekHours } from "blessing-ui";

// the hours of a small recording studio in Jakarta, Monday first
const day = [{ open: "09:00", close: "18:00" }];
const hours: BlessWeekHours = [
  day,
  day,
  day,
  day,
  [{ open: "09:00", close: "22:00" }],
  [
    { open: "10:00", close: "14:00" },
    { open: "19:00", close: "01:00" },
  ],
  [],
];
</script>

<template>
  <BlessOpeningHours :hours time-zone="Asia/Jakarta" style="max-width: 340px" />
</template>
