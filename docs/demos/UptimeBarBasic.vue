<script setup lang="ts">
import { BlessUptimeBar, type BlessUptimeItem } from "blessing-ui";

const fmt = new Intl.DateTimeFormat("en", { month: "short", day: "numeric" });
const end = Date.UTC(2026, 9, 12);
// 60 days: mostly up, a few bad days, no data before monitoring started
const items: BlessUptimeItem[] = Array.from({ length: 60 }, (_, i) => ({
  label: fmt.format(end - (59 - i) * 86_400_000),
  status: i < 4 ? "none" : i === 23 ? "down" : i === 24 || i === 47 ? "degraded" : "up",
}));
</script>

<template>
  <div style="width: 100%">
    <BlessUptimeBar :items="items" />
    <div class="row" style="justify-content: space-between; margin-top: 8px; font-size: 0.85em">
      <span>60 days ago</span><span>Today</span>
    </div>
  </div>
</template>
