<script setup lang="ts">
import { BlessWorldClock } from "blessing-ui";

// where the hosts and the editors of a show live
const zones = [
  { zone: "Asia/Jakarta", label: "Jakarta studio" },
  "Asia/Tokyo",
  "Europe/Berlin",
  { zone: "America/New_York", label: "New York editor" },
  "America/Los_Angeles",
];
</script>

<template>
  <BlessWorldClock :zones />
</template>
