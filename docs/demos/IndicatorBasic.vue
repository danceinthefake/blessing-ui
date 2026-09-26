<script setup lang="ts">
import { ref } from "vue";
import { BlessAvatar, BlessButton, BlessIndicator } from "blessing-ui";
const unread = ref(3);
</script>

<template>
  <div class="row" style="gap: 24px">
    <BlessIndicator :value="unread" :label="`${unread} unread`"
      ><BlessButton variant="outline" @click="unread++">Inbox</BlessButton></BlessIndicator
    >
    <BlessIndicator :value="120" color="danger" label="120 alerts"
      ><BlessButton variant="outline">Alerts</BlessButton></BlessIndicator
    >
    <BlessIndicator :value="true" color="success" position="bottom-right" label="online"
      ><BlessAvatar name="Megumi Kato"
    /></BlessIndicator>
    <BlessIndicator :value="0" label="0 drafts"
      ><BlessButton variant="ghost">Drafts</BlessButton></BlessIndicator
    >
  </div>
</template>
