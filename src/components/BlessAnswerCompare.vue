<script setup lang="ts">
import { computed } from "vue";
import { useLabelPack } from "../composables/useLabels";

defineOptions({ name: "BlessAnswerCompare" });
const pack = useLabelPack("BlessAnswerCompare");

export type BlessAnswerVote = "a" | "b" | "tie" | "bad";
export interface BlessComparedAnswer {
  text: string;
  /** the model or the setting behind the answer; hidden until the vote when `blind` is on */
  source?: string;
}

const props = withDefaults(
  defineProps<{
    prompt?: string;
    answers: [BlessComparedAnswer, BlessComparedAnswer];
    /** hide the sources until the person votes, so the names do not sway the vote */
    blind?: boolean;
    labels?: Partial<
      Record<BlessAnswerVote, string> & {
        prompt: string;
        answer: (letter: string) => string;
        question: string;
        thanks: string;
      }
    >;
  }>(),
  { blind: true },
);
const vote = defineModel<BlessAnswerVote | null>({ default: null });

const text = computed(() => ({
  a: "A is better",
  b: "B is better",
  tie: "Both are good",
  bad: "Both are bad",
  prompt: "Prompt",
  answer: (l: string) => `Answer ${l}`,
  question: "Which answer is better?",
  thanks: "Thank you. Your vote helps make the answers better.",
  ...pack(),
  ...props.labels,
}));
const VOTES: BlessAnswerVote[] = ["a", "b", "tie", "bad"];
const show = computed(() => !props.blind || vote.value != null);
const won = (i: number) => (vote.value === "a" && i === 0) || (vote.value === "b" && i === 1);
</script>

<template>
  <div class="bless-ab">
    <div v-if="prompt" class="bless-ab__prompt">
      <span class="bless-ab__label">{{ text.prompt }}</span>
      <div>{{ prompt }}</div>
    </div>
    <div class="bless-ab__pair">
      <section
        v-for="(a, i) in answers"
        :key="i"
        class="bless-ab__answer"
        :class="{ 'is-won': won(i) }"
        :aria-label="text.answer(i ? 'B' : 'A')"
      >
        <div class="bless-ab__head">
          <span class="bless-ab__letter">{{ text.answer(i ? "B" : "A") }}</span>
          <span v-if="show && a.source" class="bless-ab__source">{{ a.source }}</span>
          <span v-if="won(i)" class="bless-ab__won" aria-hidden="true">✓</span>
        </div>
        <div class="bless-ab__text">{{ a.text }}</div>
      </section>
    </div>
    <div class="bless-ab__vote" role="group" :aria-label="text.question">
      <span class="bless-ab__question" aria-hidden="true">{{ text.question }}</span>
      <button
        v-for="v in VOTES"
        :key="v"
        type="button"
        :aria-pressed="vote === v"
        @click="vote = v"
      >
        {{ text[v] }}
      </button>
    </div>
    <p class="bless-ab__thanks" role="status">{{ vote ? text.thanks : "" }}</p>
  </div>
</template>

<style>
.bless-ab {
  display: grid;
  gap: var(--bless-space-3);
  font-family: var(--bless-font-sans);
  font-size: var(--bless-text-sm);
  color: var(--bless-color-text);
}
.bless-ab__prompt {
  display: grid;
  gap: 2px;
  padding: var(--bless-space-2) var(--bless-space-3);
  background: var(--bless-color-surface-2);
}
.bless-ab__label {
  font-size: var(--bless-text-xs);
  font-weight: var(--bless-font-weight-bold);
}
.bless-ab__pair {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr));
  gap: var(--bless-space-3);
}
.bless-ab__answer {
  display: grid;
  align-content: start;
  gap: var(--bless-space-2);
  padding: var(--bless-space-3);
  border: 2px solid var(--bless-color-border);
}
.bless-ab__answer.is-won {
  border-color: var(--bless-color-accent);
  border-width: 3px;
}
.bless-ab__head {
  display: flex;
  align-items: center;
  gap: var(--bless-space-2);
}
.bless-ab__letter {
  font-weight: var(--bless-font-weight-bold);
}
.bless-ab__source {
  padding: 0 var(--bless-space-1);
  border: var(--bless-border-width) solid var(--bless-color-text);
  font-size: var(--bless-text-xs);
}
.bless-ab__won {
  margin-inline-start: auto;
  font-weight: var(--bless-font-weight-bold);
}
.bless-ab__text {
  line-height: 1.6;
  white-space: pre-wrap;
}
.bless-ab__vote {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--bless-space-2);
}
.bless-ab__question {
  font-weight: var(--bless-font-weight-bold);
}
.bless-ab__vote button {
  min-block-size: 2.25rem;
  padding: 0 var(--bless-space-3);
  border: 2px solid var(--bless-color-text);
  background: var(--bless-color-bg);
  color: inherit;
  font: inherit;
  font-weight: var(--bless-font-weight-bold);
  cursor: pointer;
}
.bless-ab__vote button[aria-pressed="true"] {
  background: var(--bless-color-text);
  color: var(--bless-color-bg);
}
.bless-ab__vote button:focus-visible {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: 2px;
}
.bless-ab__thanks {
  margin: 0;
  font-size: var(--bless-text-xs);
}
.bless-ab__thanks:empty {
  display: none;
}
.bless-ab {
  animation: bless-enter var(--bless-duration-enter) var(--bless-ease-soft);
}
</style>
