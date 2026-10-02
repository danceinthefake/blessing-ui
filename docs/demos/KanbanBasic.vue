<script setup lang="ts">
import { ref } from "vue";
import { BlessKanban, type BlessKanbanColumn } from "blessing-ui";

interface Task {
  id: number;
  title: string;
}
const board = ref<BlessKanbanColumn<Task>[]>([
  {
    id: "todo",
    title: "To do",
    items: [
      { id: 1, title: "Write the changelog" },
      { id: 2, title: "Check RTL on the drawer" },
      { id: 3, title: "Update screenshots" },
    ],
  },
  { id: "doing", title: "Doing", limit: 2, items: [{ id: 4, title: "Review the Tour page" }] },
  { id: "done", title: "Done", items: [{ id: 5, title: "Publish 0.1.0" }] },
]);
</script>

<template>
  <div class="col">
    <BlessKanban v-model="board" :row-key="(t: Task) => t.id" label="Release board">
      <template #card="{ item }">{{ (item as Task).title }}</template>
    </BlessKanban>
    <small
      >drag a grip, or focus it, press Space, then the arrow keys; "Doing" holds two cards</small
    >
  </div>
</template>
