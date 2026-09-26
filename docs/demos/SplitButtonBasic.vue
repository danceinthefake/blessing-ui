<script setup lang="ts">
import { BlessSplitButton, useToast } from "blessing-ui";
const { toast } = useToast();
const items = [
  { label: "Save as…", value: "as", shortcut: "⇧⌘S" },
  { label: "Save all", value: "all" },
  { type: "separator" as const },
  { label: "Discard", value: "discard", danger: true },
];
</script>

<template>
  <div class="row">
    <BlessSplitButton
      label="Save"
      :items
      @click="toast('Saved')"
      @select="toast('label' in $event ? $event.label : '')"
    />
    <BlessSplitButton
      label="Export"
      variant="outline"
      size="sm"
      :items
      @click="toast('Exported')"
      @select="toast('label' in $event ? $event.label : '')"
    />
  </div>
</template>
