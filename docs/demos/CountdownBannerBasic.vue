<template>
  <BlessCountdownBanner :to="start" title="Live recording of episode 50" label="Next event">
    <template #action>
      <BlessButton size="sm" variant="outline" href="#">Get a ticket</BlessButton>
    </template>
  </BlessCountdownBanner>
</template>

<script setup lang="ts">
import { BlessButton, BlessCountdownBanner } from "blessing-ui";

// the live recording starts three days and a bit from the moment the page opens
const start = Date.now() + ((3 * 24 + 5) * 60 + 42) * 60_000;
</script>
