<script setup lang="ts">
import { ref } from "vue";
import { BlessSwipeDeck, type BlessSwipeDecision } from "blessing-ui";

interface Pitch {
  id: number;
  title: string;
  note: string;
}
const deck = ref<Pitch[]>([
  { id: 1, title: "Dark theme for the docs", note: "Already in. Ship a screenshot." },
  { id: 2, title: "Ten more blocks", note: "Pricing tables, a calendar page, a kanban page." },
  { id: 3, title: "A native-app wrapper", note: "Out of scope for a Vue library." },
  { id: 4, title: "Per-component CSS bundles", note: "Done in 0.1.0." },
]);
const log = ref<string[]>([]);
const note = (p: Pitch, d: BlessSwipeDecision) => log.value.unshift(`${d}: ${p.title}`);
</script>

<template>
  <div class="col" style="max-width: 360px">
    <BlessSwipeDeck v-model="deck" :row-key="(p: Pitch) => p.id" label="Pitches" @decide="note">
      <template #card="{ item }">
        <strong>{{ (item as Pitch).title }}</strong>
        <p>{{ (item as Pitch).note }}</p>
      </template>
      <template #empty>That was the last pitch.</template>
    </BlessSwipeDeck>
    <small>drag a card, or focus the deck: → accept, ← reject, ↑ skip, Backspace undo</small>
    <small v-if="log.length">{{ log[0] }}</small>
  </div>
</template>
