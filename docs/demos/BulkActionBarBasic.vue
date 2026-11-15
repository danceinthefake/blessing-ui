<script setup lang="ts">
import { ref } from "vue";
import { BlessBulkActionBar, BlessButton, BlessCheckbox, BlessStack } from "blessing-ui";

const episodes = ref(
  [
    "Ep. 36 · Microphones",
    "Ep. 37 · Guests",
    "Ep. 38 · Editing",
    "Ep. 39 · Sponsors",
    "Ep. 40 · Live show",
  ].map((title, i) => ({ id: i, title })),
);
const picked = ref<number[]>([]);
const toggle = (id: number, on: boolean) =>
  (picked.value = on ? [...picked.value, id] : picked.value.filter((x) => x !== id));
function remove() {
  episodes.value = episodes.value.filter((e) => !picked.value.includes(e.id));
  picked.value = [];
}
</script>

<template>
  <div style="max-width: 480px">
    <BlessStack :gap="2">
      <BlessCheckbox
        v-for="e in episodes"
        :key="e.id"
        :model-value="picked.includes(e.id)"
        @update:model-value="toggle(e.id, !!$event)"
      >
        {{ e.title }}
      </BlessCheckbox>
    </BlessStack>
    <div style="height: 72px" />
    <BlessBulkActionBar :count="picked.length" @clear="picked = []">
      <BlessButton size="sm" variant="ghost" @click="picked = []">Archive</BlessButton>
      <BlessButton size="sm" variant="ghost" @click="remove">Delete</BlessButton>
    </BlessBulkActionBar>
  </div>
</template>
