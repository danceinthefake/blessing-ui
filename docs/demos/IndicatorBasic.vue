<script setup lang="ts">
import { BlessAvatar, BlessButton, BlessIndicator } from "blessing-ui";
</script>

<template>
  <div class="row" style="gap: 24px">
    <BlessIndicator :value="3"><BlessButton variant="outline">Inbox</BlessButton></BlessIndicator>
    <BlessIndicator :value="120" color="danger"
      ><BlessButton variant="outline">Alerts</BlessButton></BlessIndicator
    >
    <BlessIndicator :value="true" color="success" position="bottom-right"
      ><BlessAvatar name="Megumi Kato"
    /></BlessIndicator>
    <BlessIndicator :value="7" color="text" position="top-left"
      ><BlessAvatar name="Eriri" square
    /></BlessIndicator>
    <BlessIndicator :value="0"><BlessButton variant="ghost">none</BlessButton></BlessIndicator>
  </div>
</template>
