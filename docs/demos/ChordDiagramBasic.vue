<template>
  <BlessChordDiagram :groups :matrix :format="hundreds" label="Listeners moving between shows" />
</template>

<script setup lang="ts">
import { BlessChordDiagram } from "blessing-ui";

// listeners who also play another show of the network, in hundreds:
// matrix[i][j] is the listeners of show i who went on to show j last month
const groups = [
  { key: "brief", label: "Morning Brief" },
  { key: "dive", label: "Deep Dive" },
  { key: "chat", label: "Weekend Chat" },
  { key: "tech", label: "Tech Corner" },
];
const matrix = [
  [0, 42, 18, 25],
  [30, 0, 12, 20],
  [15, 9, 0, 6],
  [28, 22, 4, 0],
];
const hundreds = (v: number) => `${v * 100}`;
</script>
