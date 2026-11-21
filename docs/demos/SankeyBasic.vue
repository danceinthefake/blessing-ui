<template>
  <BlessSankey :links :nodes :height="280" :format="(v) => `${v}k`" label="Episode 12 visitors" />
</template>

<script setup lang="ts">
import { BlessSankey, type BlessSankeyNode } from "blessing-ui";

// where the visitors of an episode page went, in thousands
const links = [
  { source: "search", target: "page", value: 42 },
  { source: "social", target: "page", value: 31 },
  { source: "direct", target: "page", value: 12 },
  { source: "page", target: "watch", value: 51 },
  { source: "page", target: "leave", value: 34 },
  { source: "watch", target: "finish", value: 38 },
  { source: "watch", target: "leave", value: 13 },
];
const nodes: BlessSankeyNode[] = [
  { id: "search", label: "Search" },
  { id: "social", label: "Social" },
  { id: "direct", label: "Direct" },
  { id: "page", label: "Episode page" },
  { id: "watch", label: "Started" },
  { id: "finish", label: "Finished", color: "success" },
  { id: "leave", label: "Left", color: "chart-5" },
];
</script>
