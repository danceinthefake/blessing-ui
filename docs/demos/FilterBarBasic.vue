<script setup lang="ts">
import { computed, ref } from "vue";
import { BlessFilterBar, BlessText, type BlessQueryField, type BlessQueryRule } from "blessing-ui";

const fields: BlessQueryField[] = [
  { name: "title", label: "Title" },
  {
    name: "status",
    label: "Status",
    type: "select",
    options: [
      { value: "live", label: "Live" },
      { value: "draft", label: "Draft" },
      { value: "scheduled", label: "Scheduled" },
    ],
  },
  { name: "plays", label: "Plays", type: "number" },
  { name: "published", label: "Published", type: "date" },
];
const rules = ref<BlessQueryRule[]>([
  { field: "status", op: "eq", value: "live" },
  { field: "plays", op: "gt", value: "1000" },
]);
const json = computed(() => JSON.stringify(rules.value));
</script>

<template>
  <div>
    <BlessFilterBar v-model="rules" :fields />
    <BlessText as="p" size="xs" style="margin-top: 12px; font-family: var(--bless-font-mono)">{{
      json
    }}</BlessText>
  </div>
</template>
