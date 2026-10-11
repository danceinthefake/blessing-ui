<script setup lang="ts">
import { BlessJsonViewer } from "blessing-ui";

const response = {
  id: 42,
  title: "Flat by design",
  published: true,
  tags: ["ui", "vue", "square"],
  author: { name: "Megumi", roles: ["editor", "reader"], email: null },
  metrics: Array.from({ length: 6 }, (_, i) => ({ day: i + 1, views: (i + 1) * 120 })),
};
</script>

<template>
  <BlessJsonViewer
    :value="response"
    root-label="response"
    :open-depth="2"
    :limit="4"
    label="API response"
  />
</template>
