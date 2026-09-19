<script setup lang="ts">
import { BlessChart } from "blessing-ui";
import { VisAxis, VisGroupedBar, VisXYContainer } from "@unovis/vue";
type Pt = { x: number; a: number; b: number };
const data: Pt[] = [
  { x: 1, a: 40, b: 50 },
  { x: 2, a: 55, b: 49 },
  { x: 3, a: 68, b: 48 },
  { x: 4, a: 76, b: 44 },
  { x: 5, a: 75, b: 38 },
  { x: 6, a: 66, b: 33 },
];
</script>

<template>
  <BlessChart title="Sales" :legend="['BD', 'DVD']" height="200px" style="max-width: 560px">
    <VisXYContainer :data>
      <VisGroupedBar :x="(d: Pt) => d.x" :y="[(d: Pt) => d.a, (d: Pt) => d.b]" :barPadding="0.3" />
      <VisAxis type="x" :gridLine="false" />
      <VisAxis type="y" :numTicks="3" />
    </VisXYContainer>
  </BlessChart>
</template>
