<script setup lang="ts">
import { computed, nextTick, ref } from "vue";
import { useLabelPack } from "../composables/useLabels";
import BlessButton from "./BlessButton.vue";

defineOptions({ name: "BlessFlashcards" });
const pack = useLabelPack("BlessFlashcards");

export interface BlessFlashcard {
  front: string;
  back: string;
}

const props = defineProps<{
  cards: BlessFlashcard[];
  labels?: Partial<{
    flip: string;
    know: string;
    again: string;
    restart: string;
    progress: (n: number, total: number) => string;
    done: (known: number, total: number) => string;
  }>;
}>();
const emit = defineEmits<{ finish: [known: number, total: number] }>();

const text = computed(() => ({
  flip: "Show the answer",
  know: "I know it",
  again: "Again",
  restart: "Start again",
  progress: (n: number, t: number) => `Card ${n} of ${t}`,
  done: (k: number, t: number) => `You knew ${k} of ${t} at the first try.`,
  ...pack(),
  ...props.labels,
}));
// the queue holds card indexes; "Again" puts a card at the end, so it comes back
const queue = ref(props.cards.map((_, i) => i));
const missed = ref(new Set<number>());
const flipped = ref(false);
const seen = ref(0);
const card = computed(() => props.cards[queue.value[0]!]);
const root = ref<HTMLElement>();
const focusCard = () =>
  nextTick(() =>
    root.value?.querySelector<HTMLElement>(".bless-flash__card, .bless-flash__end")?.focus(),
  );
function answer(know: boolean) {
  const [i, ...rest] = queue.value;
  if (i === undefined) return;
  if (!know) missed.value.add(i);
  queue.value = know ? rest : [...rest, i];
  if (know) seen.value++;
  flipped.value = false;
  if (!queue.value.length)
    emit("finish", props.cards.length - missed.value.size, props.cards.length);
  focusCard();
}
function restart() {
  queue.value = props.cards.map((_, i) => i);
  missed.value = new Set();
  flipped.value = false;
  seen.value = 0;
  focusCard();
}
</script>

<template>
  <div ref="root" class="bless-flash">
    <template v-if="card">
      <p class="bless-flash__progress">{{ text.progress(seen + 1, cards.length) }}</p>
      <button
        type="button"
        class="bless-flash__card"
        :class="{ 'is-flipped': flipped }"
        :aria-pressed="flipped"
        :aria-label="flipped ? undefined : text.flip"
        @click="flipped = !flipped"
      >
        <span class="bless-flash__face">{{ card.front }}</span>
        <span v-if="flipped" class="bless-flash__back" aria-live="polite">{{ card.back }}</span>
      </button>
      <div class="bless-flash__actions">
        <template v-if="flipped">
          <BlessButton size="sm" variant="outline" @click="answer(false)">{{
            text.again
          }}</BlessButton>
          <BlessButton size="sm" @click="answer(true)">{{ text.know }}</BlessButton>
        </template>
        <BlessButton v-else size="sm" variant="outline" @click="flipped = true">{{
          text.flip
        }}</BlessButton>
      </div>
    </template>
    <div v-else class="bless-flash__end" tabindex="-1">
      <p class="bless-flash__score">{{ text.done(cards.length - missed.size, cards.length) }}</p>
      <BlessButton size="sm" variant="outline" @click="restart">{{ text.restart }}</BlessButton>
    </div>
  </div>
</template>

<style>
.bless-flash {
  display: grid;
  gap: var(--bless-space-3);
  max-inline-size: 30rem;
  font-family: var(--bless-font-sans);
  color: var(--bless-color-text);
}
.bless-flash__progress {
  margin: 0;
  font-size: var(--bless-text-xs);
  color: var(--bless-color-text-muted);
}
.bless-flash__card {
  display: grid;
  place-content: center;
  gap: var(--bless-space-3);
  min-block-size: 11rem;
  padding: var(--bless-space-6);
  border: var(--bless-border-width) solid var(--bless-color-border);
  box-shadow: 4px 4px 0 var(--bless-color-border);
  background: var(--bless-color-bg);
  color: inherit;
  font: inherit;
  text-align: center;
  cursor: pointer;
}
.bless-flash__card:focus-visible,
.bless-flash__end:focus-visible {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: 2px;
}
.bless-flash__face {
  font-size: var(--bless-text-lg);
  font-weight: var(--bless-font-weight-bold);
}
/* the answer shows under the question, split by a line */
.bless-flash__back {
  padding-block-start: var(--bless-space-3);
  border-block-start: var(--bless-border-width) dashed var(--bless-color-border);
  font-size: var(--bless-text-md);
}
.bless-flash__actions {
  display: flex;
  justify-content: center;
  gap: var(--bless-space-2);
}
.bless-flash__end {
  display: grid;
  justify-items: start;
  gap: var(--bless-space-3);
  padding: var(--bless-space-4);
  border: var(--bless-border-width) solid var(--bless-color-border);
}
.bless-flash__score {
  margin: 0;
  font-size: var(--bless-text-lg);
  font-weight: var(--bless-font-weight-bold);
}
</style>
