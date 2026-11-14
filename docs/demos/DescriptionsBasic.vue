<script setup lang="ts">
import { BlessBadge, BlessDescriptions } from "blessing-ui";

const items = [
  { label: "Title", value: "Saenai Heroine no Sodatekata" },
  { label: "Studio", value: "A-1 Pictures" },
  { label: "Episodes", value: 12 },
  { label: "Aired", value: "January – March 2015" },
  { label: "Status", value: "aired" },
  { label: "Source", value: "Light novel" },
  { label: "Director" },
];
</script>

<template>
  <div class="col" style="max-width: none; gap: 24px">
    <BlessDescriptions :items :columns="3">
      <template #value="{ item }">
        <BlessBadge v-if="item.label === 'Status'" color="success">{{ item.value }}</BlessBadge>
        <template v-else>{{ item.value ?? "—" }}</template>
      </template>
    </BlessDescriptions>
    <BlessDescriptions :items="items.slice(0, 5)" :columns="2" bordered />
  </div>
</template>
