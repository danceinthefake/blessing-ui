<template>
  <div style="display: grid; gap: 16px; max-width: 360px">
    <BlessSlaTimer label="First reply" due="2026-11-16T10:00:00Z" :window="120" :now met />
    <BlessSlaTimer label="Next reply" due="2026-11-16T11:00:00Z" :window="240" :now />
    <BlessSlaTimer label="Solve by" due="2026-11-16T15:30:00Z" :window="480" :now />
    <BlessSlaTimer label="Callback" due="2026-11-16T09:40:00Z" :window="60" :now />
  </div>
</template>

<script setup lang="ts">
import { BlessSlaTimer } from "blessing-ui";

// a fixed "now", so the demo looks the same on every visit
const now = "2026-11-16T10:15:00Z";
</script>
