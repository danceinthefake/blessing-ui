<script setup lang="ts">
import { ref } from "vue";
import { BlessQueryBuilder, type BlessQueryField, type BlessQueryGroup } from "blessing-ui";

const fields: BlessQueryField[] = [
  { name: "title", label: "Title" },
  { name: "episodes", label: "Episodes", type: "number" },
  { name: "aired", label: "Aired", type: "date" },
  {
    name: "studio",
    label: "Studio",
    type: "select",
    options: [
      { value: "a1", label: "A-1 Pictures" },
      { value: "clover", label: "CloverWorks" },
    ],
  },
];
const query = ref<BlessQueryGroup>({
  match: "all",
  rules: [
    { field: "studio", op: "eq", value: "a1" },
    {
      match: "any",
      rules: [
        { field: "episodes", op: "gte", value: "12" },
        { field: "aired", op: "gt", value: "2015-01-01" },
      ],
    },
  ],
});
</script>

<template>
  <div class="col" style="max-width: 44rem">
    <BlessQueryBuilder v-model="query" :fields />
    <pre style="margin: 0; font-size: 12px">{{ JSON.stringify(query) }}</pre>
  </div>
</template>
