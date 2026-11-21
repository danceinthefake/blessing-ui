<template>
  <BlessQuotaUsage :quotas style="max-width: 420px">
    <template #footer>
      <BlessButton size="sm" variant="outline">Upgrade the plan</BlessButton>
    </template>
  </BlessQuotaUsage>
</template>

<script setup lang="ts">
import { BlessButton, BlessQuotaUsage } from "blessing-ui";

// the limits of a hosting plan for a podcast
const quotas = [
  { label: "Audio storage", used: 38.6, limit: 100, unit: "GB" },
  { label: "Team seats", used: 4, limit: 5 },
  { label: "Transcript minutes", used: 600, limit: 600, unit: "min" },
  { label: "Downloads this month", used: 124_300, limit: 250_000 },
];
</script>
