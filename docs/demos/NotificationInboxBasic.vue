<script setup lang="ts">
import { ref } from "vue";
import { BlessNotificationInbox, type BlessNotice } from "blessing-ui";

// your server owns the list. The inbox only reports what the person did.
const items = ref<BlessNotice[]>([
  { id: "1", title: "Megumi replied to your comment", body: "“Flat is fine.”", time: "2 min ago" },
  { id: "2", title: "Build passed", time: "1 h ago", href: "https://example.com/build" },
  { id: "3", title: "Eriri invited you to a board", time: "Yesterday" },
  { id: "4", title: "Weekly report is ready", time: "Monday", read: true },
]);
const read = (id: string) => (items.value.find((i) => i.id === id)!.read = true);
const readAll = () => items.value.forEach((i) => (i.read = true));
const dismiss = (id: string) => (items.value = items.value.filter((i) => i.id !== id));
</script>

<template>
  <div style="display: flex; justify-content: flex-end; min-height: 3rem">
    <BlessNotificationInbox :items="items" @read="read" @read-all="readAll" @dismiss="dismiss" />
  </div>
</template>
