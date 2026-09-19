<script setup lang="ts">
import { ref } from "vue";
import { BlessLabel, BlessTreeSelect, type BlessTreeNode } from "blessing-ui";
const nodes: BlessTreeNode[] = [
  {
    label: "src",
    id: "src",
    open: true,
    children: [
      {
        label: "components",
        id: "components",
        children: [
          { label: "BlessTree.vue", id: "tree" },
          { label: "BlessTable.vue", id: "table" },
        ],
      },
      { label: "index.ts", id: "index" },
    ],
  },
  { label: "docs", id: "docs", children: [{ label: "index.md", id: "docs-index" }] },
  { label: "README.md", id: "readme" },
];
const one = ref<string>();
const many = ref<string[]>(["index"]);
</script>

<template>
  <div class="row" style="align-items: flex-start">
    <div class="col">
      <BlessLabel>Single</BlessLabel>
      <BlessTreeSelect v-model="one" :nodes placeholder="Pick a file" />
      <small>{{ one ?? "—" }}</small>
    </div>
    <div class="col">
      <BlessLabel>Multiple, leaves only</BlessLabel>
      <BlessTreeSelect v-model="many" :nodes multiple leaf-only />
      <small>{{ many }}</small>
    </div>
  </div>
</template>
