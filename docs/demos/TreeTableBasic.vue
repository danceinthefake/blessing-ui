<script setup lang="ts">
import { ref } from "vue";
import { BlessBadge, BlessTreeTable } from "blessing-ui";
type Row = { id: string; name: string; size: string; kind: "dir" | "file"; children?: Row[] };
const rows: Row[] = [
  {
    id: "src",
    name: "src",
    size: "48 KB",
    kind: "dir",
    children: [
      {
        id: "components",
        name: "components",
        size: "40 KB",
        kind: "dir",
        children: [
          { id: "tree", name: "BlessTree.vue", size: "4 KB", kind: "file" },
          { id: "table", name: "BlessTable.vue", size: "6 KB", kind: "file" },
        ],
      },
      { id: "index", name: "index.ts", size: "8 KB", kind: "file" },
    ],
  },
  {
    id: "docs",
    name: "docs",
    size: "120 KB",
    kind: "dir",
    children: [{ id: "md", name: "index.md", size: "2 KB", kind: "file" }],
  },
  { id: "readme", name: "README.md", size: "12 KB", kind: "file" },
];
const expanded = ref<string[]>(["src"]);
</script>

<template>
  <div class="col" style="max-width: 560px">
    <BlessTreeTable
      :rows
      :columns="[
        { key: 'name', label: 'Name', header: true },
        { key: 'kind', label: 'Kind' },
        { key: 'size', label: 'Size', align: 'right' },
      ]"
      row-key="id"
      v-model:expanded="expanded"
      striped
    >
      <template #cell-kind="{ value }"
        ><BlessBadge :color="value === 'dir' ? 'text' : 'info'">{{ value }}</BlessBadge></template
      >
    </BlessTreeTable>
    <small>expanded: {{ expanded }}</small>
  </div>
</template>
