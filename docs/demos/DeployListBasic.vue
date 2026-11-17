<script setup lang="ts">
import { ref } from "vue";
import { BlessDeployList, type BlessDeploy } from "blessing-ui";

const deploys = ref<BlessDeploy[]>([
  {
    id: "d6",
    state: "building",
    env: "preview",
    commit: "9f3c2a1e77",
    message: "Add the bundle offer to the shop",
    branch: "feat/bundle",
    author: "Sari",
    time: "1 min ago",
  },
  {
    id: "d5",
    state: "failed",
    env: "production",
    commit: "7be0d41c02",
    message: "Move images to the new store",
    branch: "main",
    author: "Dimas",
    time: "25 min ago",
    duration: "1 m 12 s",
  },
  {
    id: "d4",
    state: "ready",
    env: "production",
    commit: "c41a9e0b5d",
    message: "Fix the price of the pop filter",
    branch: "main",
    author: "Ana",
    time: "2 h ago",
    duration: "58 s",
    url: "#live",
    live: true,
  },
  {
    id: "d3",
    state: "ready",
    env: "production",
    commit: "2d8f6b3a90",
    message: "New product pages",
    branch: "main",
    author: "Ana",
    time: "Yesterday",
    duration: "1 m 4 s",
    url: "#d3",
  },
  {
    id: "d2",
    state: "canceled",
    env: "preview",
    commit: "e05b7c9d12",
    message: "Try a darker header",
    branch: "test/header",
    author: "Budi",
    time: "Yesterday",
  },
]);
function rollback(id: string) {
  deploys.value = deploys.value.map((d) => ({ ...d, live: d.id === id }));
}
function redeploy(id: string) {
  const d = deploys.value.find((x) => x.id === id)!;
  deploys.value.unshift({
    ...d,
    id: `${id}-again`,
    state: "queued",
    time: "now",
    duration: undefined,
    live: false,
  });
}
</script>

<template>
  <BlessDeployList :deploys @rollback="rollback" @redeploy="redeploy" />
</template>
