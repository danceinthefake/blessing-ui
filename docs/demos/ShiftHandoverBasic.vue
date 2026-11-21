<template>
  <BlessShiftHandover
    v-model:issues="issues"
    title="Night shift → Morning shift"
    by="Ana Putri, line lead · 16 Nov, 05:55"
    notes="A quiet night apart from Press 2. WO-0091 is ahead, WO-0088 waits for cables."
    :facts="[
      { label: 'Output', value: '1 840 / 2 000' },
      { label: 'Scrap', value: '23' },
      { label: 'Downtime', value: '42 min' },
    ]"
    :read-by
    @acknowledge="readBy = 'Budi Santoso, 06:02'"
  />
</template>

<script setup lang="ts">
import { ref } from "vue";
import { BlessShiftHandover, type BlessHandoverIssue } from "blessing-ui";

const issues = ref<BlessHandoverIssue[]>([
  {
    id: "1",
    text: "Press 2 jams on thin sheets. Use the 0.8 mm stock until the guide is fixed.",
    level: "stop",
    owner: "Dimas",
  },
  { id: "2", text: "Solder line runs 5% slow after the tip change.", level: "watch" },
  {
    id: "3",
    text: "Glue for the foam panels runs low. Two boxes left.",
    level: "info",
    owner: "Stores",
  },
  { id: "4", text: "Laser marker restarted at 02:10, fine since.", level: "info", closed: true },
]);
const readBy = ref<string>();
</script>
