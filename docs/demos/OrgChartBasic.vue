<script setup lang="ts">
import { ref } from "vue";
import { BlessOrgChart, type BlessTreeNode } from "blessing-ui";
const nodes: BlessTreeNode[] = [
  {
    label: "Tomoya",
    id: "tomoya",
    href: "Director",
    children: [
      { label: "Eriri", id: "eriri", href: "Art" },
      {
        label: "Utaha",
        id: "utaha",
        href: "Scenario",
        children: [{ label: "Izumi", id: "izumi", href: "Assistant" }],
      },
      { label: "Michiru", id: "michiru", href: "Music" },
      { label: "Megumi", id: "megumi", href: "Main heroine" },
    ],
  },
];
const selected = ref("megumi");
</script>

<template>
  <div class="col" style="max-width: none">
    <BlessOrgChart :nodes v-model:selected="selected" label="Blessing Software" />
    <small>selected: {{ selected }} · `href` is reused as the role line in the default node</small>
  </div>
</template>
