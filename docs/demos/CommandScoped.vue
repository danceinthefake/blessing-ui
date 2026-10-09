<script setup lang="ts">
import { ref } from "vue";
import { BlessCommand, type BlessCommandItem } from "blessing-ui";

const items: BlessCommandItem[] = [
  { value: "home", label: "Home", group: "Pages", icon: "⌂" },
  { value: "billing", label: "Billing", group: "Pages", icon: "¤" },
  { value: "settings", label: "Settings", group: "Pages", icon: "⚙", shortcut: "G S" },
  { value: "ayu", label: "Ayu Lestari", group: "People", keywords: ["design"] },
  { value: "budi", label: "Budi Santoso", group: "People", keywords: ["engineering"] },
  { value: "bug", label: "bug", group: "Tags" },
  { value: "idea", label: "idea", group: "Tags" },
];
const history = ref<string[]>([]);
const last = ref("nothing yet");
</script>

<template>
  <div class="col" style="max-width: none">
    <BlessCommand
      v-model:history="history"
      inline
      recent
      persist="docs-demo"
      :items
      :scopes="[
        { key: '@', group: 'People' },
        { key: '#', group: 'Tags', label: 'Tag' },
      ]"
      @select="(it) => (last = it.label)"
    />
    <p style="margin: 0" aria-live="polite">Chose: {{ last }}</p>
  </div>
</template>
