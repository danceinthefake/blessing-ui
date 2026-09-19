<script setup lang="ts">
import { BlessChart } from "blessing-ui";
import { VisAxis, VisCrosshair, VisLine, VisTooltip, VisXYContainer } from "@unovis/vue";
type Pt = { x: number; a: number; b: number };
const data: Pt[] = Array.from({ length: 12 }, (_, i) => ({
  x: i + 1,
  a: Math.round(40 + 30 * Math.sin(i / 2) + i * 2),
  b: Math.round(30 + 20 * Math.cos(i / 3) + i),
}));
const x = (d: Pt) => d.x;
const y = [(d: Pt) => d.a, (d: Pt) => d.b];
</script>

<template>
  <BlessChart
    title="Views"
    description="per episode, two seasons"
    :legend="['Season 1', 'Season 2']"
    style="max-width: 560px"
  >
    <VisXYContainer :data :margin="{ top: 8, right: 8 }">
      <VisLine :x :y :lineWidth="1.5" />
      <VisAxis type="x" :tickFormat="(v: number) => `第${v}話`" :gridLine="false" />
      <VisAxis type="y" :numTicks="4" />
      <VisCrosshair :template="(d: Pt) => `#${d.x}: ${d.a} / ${d.b}`" />
      <VisTooltip />
    </VisXYContainer>
  </BlessChart>
</template>
