<script setup lang="ts">
import { ref } from "vue";
import { BlessNodeGraph, type BlessGraphEdge, type BlessGraphNode } from "blessing-ui";

const nodes = ref<BlessGraphNode[]>([
  { id: "src", x: 20, y: 60, label: "Source" },
  { id: "lint", x: 280, y: 0, label: "Lint" },
  { id: "test", x: 280, y: 120, label: "Test" },
  { id: "ship", x: 540, y: 60, label: "Ship" },
]);
const edges = ref<BlessGraphEdge[]>([
  { from: "src", to: "lint" },
  { from: "src", to: "test" },
  { from: "lint", to: "ship" },
]);
const selected = ref<string | null>(null);
const name = (id: string) => nodes.value.find((n) => n.id === id)?.label;
</script>

<template>
  <div class="col" style="max-width: none">
    <BlessNodeGraph
      v-model:nodes="nodes"
      v-model:edges="edges"
      v-model:selected="selected"
      :snap="10"
      acyclic
      label="Build pipeline"
      style="height: 320px"
    />
    <p style="margin: 0">
      {{ edges.map((e) => `${name(e.from)} → ${name(e.to)}`).join(", ") || "No links" }}
    </p>
  </div>
</template>
