<script setup lang="ts">
import { ref } from "vue";
import { BlessContextChips, BlessPromptInput, type BlessContextItem } from "blessing-ui";

const items = ref<BlessContextItem[]>([
  { id: "1", label: "launch-plan.pdf", kind: "file", detail: "3.1k tokens" },
  { id: "2", label: "Pricing — Studio mic", kind: "page", detail: "900 tokens" },
  { id: "3", label: "Lines 40–88 of checkout.ts", kind: "selection" },
  { id: "4", label: "cover-draft.png", kind: "image" },
]);
let n = 5;
const add = () =>
  items.value.push({ id: String(n), label: `notes-${n++}.md`, kind: "file", detail: "400 tokens" });
const remove = (id: string) => (items.value = items.value.filter((i) => i.id !== id));
const draft = ref("");
</script>

<template>
  <div style="display: grid; gap: 8px; max-width: 40rem">
    <BlessContextChips :items addable @add="add" @remove="remove" />
    <BlessPromptInput v-model="draft" />
  </div>
</template>
