<script setup lang="ts">
import { computed, ref } from "vue";
import { BlessShortcutRecorder } from "blessing-ui";

const search = ref("Ctrl+K");
const save = ref("Ctrl+S");
const sidebar = ref("");
const rows = [
  { name: "Search", model: search },
  { name: "Save", model: save },
  { name: "Toggle sidebar", model: sidebar },
];
// every recorder sees what the other two use
const taken = computed(
  () => (me: string) =>
    Object.fromEntries(
      rows.filter((r) => r.name !== me && r.model.value).map((r) => [r.model.value, r.name]),
    ),
);
</script>

<template>
  <div class="col" style="gap: 1rem; max-width: 420px">
    <div v-for="r in rows" :key="r.name" class="row">
      <span style="min-width: 8rem">{{ r.name }}</span>
      <BlessShortcutRecorder v-model="r.model.value" :label="r.name" :taken="taken(r.name)" />
    </div>
    <small>click a field, press the combo you want; Esc cancels, Backspace clears</small>
  </div>
</template>
