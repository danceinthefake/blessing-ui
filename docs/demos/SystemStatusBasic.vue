<template>
  <BlessSystemStatus :parts updated="2 minutes ago" style="max-width: 560px" />
</template>

<script setup lang="ts">
import { BlessSystemStatus, type BlessServicePart } from "blessing-ui";

const parts: BlessServicePart[] = [
  { name: "Website", status: "operational" },
  {
    name: "Audio uploads",
    status: "partial",
    description: "Files over 500 MB fail. A fix is on the way.",
  },
  { name: "Player and feeds", status: "operational" },
  { name: "Transcripts", status: "degraded", description: "New transcripts take up to an hour." },
  { name: "Statistics", status: "maintenance", description: "Back at 12:00 WIB." },
];
</script>
