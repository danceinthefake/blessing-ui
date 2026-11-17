<script setup lang="ts">
import { BlessCommitList, type BlessCommit } from "blessing-ui";

// times in UTC; the time-zone prop keeps the server and the browser in step
const commits: BlessCommit[] = [
  {
    sha: "9f3c2a1e77d04b",
    title: "Add the bundle offer to the shop",
    author: "Sari Wulandari",
    time: "2026-11-17T08:12:00Z",
    added: 184,
    removed: 12,
    url: "#9f3c2a1",
  },
  {
    sha: "7be0d41c02a9e1",
    title: "Move images to the new store",
    author: "Dimas Pratama",
    time: "2026-11-17T03:40:00Z",
    added: 42,
    removed: 97,
    url: "#7be0d41",
  },
  {
    sha: "c41a9e0b5d6f22",
    title: "Fix the price of the pop filter",
    author: "Ana Putri",
    time: "2026-11-16T10:05:00Z",
    added: 2,
    removed: 2,
    url: "#c41a9e0",
  },
  {
    sha: "2d8f6b3a907c11",
    title: "New product pages for the studio range",
    author: "Ana Putri",
    time: "2026-11-16T06:30:00Z",
    added: 1240,
    removed: 310,
    url: "#2d8f6b3",
  },
];
</script>

<template>
  <BlessCommitList :commits time-zone="Asia/Jakarta" />
</template>
