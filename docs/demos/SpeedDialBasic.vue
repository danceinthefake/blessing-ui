<script setup lang="ts">
import { BlessSpeedDial, useToast } from "blessing-ui";
const { toast } = useToast();
const actions = [
  { label: "New post", value: "post", icon: "✎" },
  { label: "Upload", value: "up", icon: "⇪", color: "accent" as const },
  { label: "Delete", value: "del", icon: "×", color: "danger" as const },
];
</script>

<template>
  <div class="row" style="gap: 48px; align-items: flex-end; min-height: 200px">
    <BlessSpeedDial :actions inline @select="toast($event.label)" />
    <BlessSpeedDial :actions direction="right" color="text" inline @select="toast($event.label)" />
  </div>
</template>
