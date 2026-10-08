<script setup lang="ts">
import { ref } from "vue";
import { BlessDock, type BlessDockItem } from "blessing-ui";

const items: BlessDockItem[] = [
  { id: "mail", label: "Mail", icon: "✉", badge: 3 },
  { id: "chat", label: "Chat", icon: "☻" },
  { id: "files", label: "Files", icon: "▤" },
  { id: "maps", label: "Maps", icon: "⌖" },
  { id: "music", label: "Music", icon: "♪" },
  { id: "off", label: "Trash", icon: "✕", disabled: true },
];
const opened = ref("nothing yet");
</script>

<template>
  <div class="col" style="max-width: none">
    <div class="row" style="align-items: flex-end; min-height: 120px; gap: 48px">
      <BlessDock :items label="Apps" @select="(i) => (opened = i.label)" />
      <BlessDock
        :items="items.slice(0, 4)"
        position="left"
        label="Side apps"
        @select="(i) => (opened = i.label)"
      />
    </div>
    <p style="margin: 0" aria-live="polite">Opened: {{ opened }}</p>
  </div>
</template>
