<template>
  <div style="max-width: 420px">
    <BlessVersionHistory v-model:selected="selected" :versions @restore="(id) => (restored = id)" />
    <BlessText as="p" size="sm" style="margin-top: 12px">
      Looking at: {{ selected
      }}<template v-if="restored"> · restore asked for {{ restored }}</template>
    </BlessText>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { BlessText, BlessVersionHistory, type BlessVersion } from "blessing-ui";

// the saved versions of the show notes of episode 41
const versions = ref<BlessVersion[]>([
  {
    id: "v5",
    label: "Ready to publish",
    author: "Ana Putri",
    time: "16 Nov, 10:12",
    summary: "Fixed two links",
    added: 2,
    removed: 2,
  },
  {
    id: "v4",
    author: "Budi Santoso",
    time: "15 Nov, 21:40",
    summary: "Added the chapters",
    added: 14,
    removed: 0,
  },
  {
    id: "v3",
    author: "Ana Putri",
    time: "15 Nov, 18:05",
    summary: "Shorter intro",
    added: 3,
    removed: 11,
  },
  { id: "v2", author: "Citra Dewi", time: "14 Nov, 16:30", added: 40, removed: 6 },
  {
    id: "v1",
    label: "First draft",
    author: "Ana Putri",
    time: "14 Nov, 09:00",
    added: 58,
    removed: 0,
  },
]);
const selected = ref("v5");
const restored = ref<string>();
</script>
