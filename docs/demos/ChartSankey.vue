<script setup lang="ts">
import { BlessChart } from "blessing-ui";
import { VisSankey, VisSingleContainer } from "@unovis/vue";

type Node = { id: string };
type Link = { source: string; target: string; value: number };
const data = {
  nodes: [
    { id: "Visits" },
    { id: "Docs" },
    { id: "Blog" },
    { id: "Install" },
    { id: "Leave" },
  ] as Node[],
  links: [
    { source: "Visits", target: "Docs", value: 60 },
    { source: "Visits", target: "Blog", value: 40 },
    { source: "Docs", target: "Install", value: 35 },
    { source: "Docs", target: "Leave", value: 25 },
    { source: "Blog", target: "Install", value: 10 },
    { source: "Blog", target: "Leave", value: 30 },
  ] as Link[],
};
</script>

<template>
  <BlessChart
    title="Where visits go"
    description="Docs sends more people to install than the blog does"
    height="260px"
    style="max-width: 560px"
  >
    <VisSingleContainer :data>
      <VisSankey :label="(n: Node) => n.id" :nodeWidth="14" />
    </VisSingleContainer>
  </BlessChart>
</template>
