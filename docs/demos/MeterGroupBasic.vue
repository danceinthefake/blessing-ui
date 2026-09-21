<script setup lang="ts">
import { BlessMeterGroup } from "blessing-ui";
const segs = [
  { label: "Video", value: 42 },
  { label: "Images", value: 18 },
  { label: "Docs", value: 9 },
  { label: "Other", value: 6, color: "text-muted" },
];
</script>

<template>
  <div class="col" style="max-width: 480px">
    <BlessMeterGroup :segments="segs" :max="100" label="Storage" :format="(v) => `${v} GB`" />
    <BlessMeterGroup
      :segments="segs.slice(0, 3)"
      label="Votes"
      orientation="vertical"
      style="margin-top: 16px"
    />
  </div>
</template>
