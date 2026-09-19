<script setup lang="ts">
import { ref } from "vue";
import { BlessTree, type BlessTreeNode } from "blessing-ui";
const nodes: BlessTreeNode[] = [
  {
    label: "src",

    open: true,
    children: [
      {
        label: "components",

        open: true,
        children: [{ label: "BlessTree.vue", id: "tree" }, { label: "BlessTreeItem.vue" }],
      },
      { label: "index.ts", id: "index" },
    ],
  },
  { label: "docs", children: [{ label: "index.md" }] },
  { label: "README.md", href: "#readme" },
  { label: "secret.env", disabled: true },
];
const selected = ref("index");
</script>

<template>
  <div class="col" style="max-width: 320px">
    <BlessTree :nodes v-model:selected="selected" />
    <small>selected: {{ selected }}</small>
  </div>
</template>
