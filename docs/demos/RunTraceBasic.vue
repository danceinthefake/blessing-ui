<template>
  <BlessRunTrace :steps />
</template>

<script setup lang="ts">
import { BlessRunTrace, type BlessTraceStep } from "blessing-ui";

const steps: BlessTraceStep[] = [
  {
    id: "1",
    name: "Plan the answer",
    kind: "model",
    status: "ok",
    start: 0,
    duration: 1400,
    input: "Which mic is best for a podcast in a small room?",
    output: "Search the catalog for dynamic mics, then check stock.",
    children: [
      {
        id: "2",
        name: "search_catalog",
        kind: "tool",
        status: "ok",
        start: 1400,
        duration: 620,
        input: '{ "query": "dynamic mic", "limit": 5 }',
        output: "5 products",
      },
      {
        id: "3",
        name: "check_stock",
        kind: "tool",
        status: "error",
        start: 2020,
        duration: 3000,
        input: '{ "sku": "MIC-USB-01" }',
        output: "Timeout after 3 s",
      },
      {
        id: "4",
        name: "check_stock",
        kind: "tool",
        status: "ok",
        start: 5020,
        duration: 410,
        input: '{ "sku": "MIC-USB-01" }',
        output: "12 in stock",
      },
    ],
  },
  {
    id: "5",
    name: "Write the answer",
    kind: "model",
    status: "running",
    start: 5430,
    duration: 1900,
  },
];
</script>
