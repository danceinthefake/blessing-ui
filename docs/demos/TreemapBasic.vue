<script setup lang="ts">
import { ref } from "vue";
import { BlessTreemap, type BlessTreemapNode } from "blessing-ui";

const data: BlessTreemapNode[] = [
  {
    id: "src",
    label: "src",
    children: [
      { id: "components", label: "components", value: 940 },
      { id: "composables", label: "composables", value: 210 },
      { id: "types", label: "types", value: 64 },
    ],
  },
  {
    id: "docs",
    label: "docs",
    children: [
      { id: "pages", label: "pages", value: 520 },
      { id: "demos", label: "demos", value: 380 },
    ],
  },
  { id: "e2e", label: "e2e", value: 160 },
  { id: "scripts", label: "scripts", value: 38 },
  { id: "config", label: "config", value: 22 },
];
const path = ref<string[]>([]);
const picked = ref("");
</script>

<template>
  <div class="col" style="max-width: none">
    <BlessTreemap
      v-model:path="path"
      :data
      :height="300"
      label="Repository"
      :format="(v: number) => `${v} KB`"
      @select="(n) => (picked = n.label)"
    />
    <p style="margin: 0">Last picked: {{ picked || "nothing yet" }}</p>
  </div>
</template>
