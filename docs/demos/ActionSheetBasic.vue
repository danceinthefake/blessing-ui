<script setup lang="ts">
import { ref } from "vue";
import { BlessActionSheet, BlessButton, useToast } from "blessing-ui";
const { toast } = useToast();
const open = ref(false);
const grid = ref(false);
const actions = [
  { label: "Share", value: "share", icon: "⇪", description: "Copy a link" },
  { label: "Download", value: "dl", icon: "⇩" },
  { label: "Rename", value: "rename", icon: "✎" },
  { label: "Delete", value: "del", icon: "×", danger: true },
];
</script>

<template>
  <div class="row">
    <BlessButton color="accent" @click="((grid = false), (open = true))">List sheet</BlessButton>
    <BlessButton variant="outline" @click="((grid = true), (open = true))">Grid sheet</BlessButton>
    <BlessActionSheet
      v-model:open="open"
      :actions
      :grid
      title="Episode 3"
      @select="toast($event.label)"
      @cancel="toast('Cancelled')"
    />
  </div>
</template>
