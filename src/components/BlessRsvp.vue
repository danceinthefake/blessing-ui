<script setup lang="ts">
import { computed } from "vue";
import { useLabelPack } from "../composables/useLabels";
import BlessAvatarGroup, { type BlessAvatarGroupItem } from "./BlessAvatarGroup.vue";
import "./sr.css";

defineOptions({ name: "BlessRsvp" });
const pack = useLabelPack("BlessRsvp");

export type BlessRsvpAnswer = "yes" | "maybe" | "no";

const props = withDefaults(
  defineProps<{
    /** the answers of the other people, without the reader */
    counts?: Partial<Record<BlessRsvpAnswer, number>>;
    /** some of the people who go, for the faces */
    going?: BlessAvatarGroupItem[];
    /** the question, for example the name of the event */
    label?: string;
    labels?: Partial<
      Record<BlessRsvpAnswer, string> & {
        question: string;
        you: string;
        goingCount: (n: number) => string;
      }
    >;
  }>(),
  { counts: () => ({}), going: () => [] },
);
/** the answer of the reader; a second click on it clears it */
const answer = defineModel<BlessRsvpAnswer | undefined>();

const text = computed(() => ({
  yes: "Going",
  maybe: "Maybe",
  no: "Can't go",
  question: "Are you going?",
  you: "you",
  goingCount: (n: number) => `${n} going`,
  ...pack(),
  ...props.labels,
}));
const ANSWERS: BlessRsvpAnswer[] = ["yes", "maybe", "no"];
// the counts come without the reader, so the answer of the reader adds one
const count = (a: BlessRsvpAnswer) => (props.counts[a] ?? 0) + (answer.value === a ? 1 : 0);
const pick = (a: BlessRsvpAnswer) => (answer.value = answer.value === a ? undefined : a);
</script>

<template>
  <div class="bless-rsvp" role="group" :aria-label="label ?? text.question">
    <p class="bless-rsvp__question" aria-hidden="true">{{ label ?? text.question }}</p>
    <div class="bless-rsvp__answers">
      <button
        v-for="a in ANSWERS"
        :key="a"
        type="button"
        class="bless-rsvp__answer"
        :class="`is-${a}`"
        :aria-pressed="answer === a"
        @click="pick(a)"
      >
        <span class="bless-rsvp__label">{{ text[a] }}</span>
        <span class="bless-rsvp__count">{{ count(a) }}</span>
      </button>
    </div>
    <div v-if="going.length || count('yes')" class="bless-rsvp__going">
      <BlessAvatarGroup
        v-if="going.length"
        :items="answer === 'yes' ? [{ name: text.you }, ...going] : going"
        :max="5"
        size="sm"
      />
      <span class="bless-rsvp__total">{{ text.goingCount(count("yes")) }}</span>
    </div>
  </div>
</template>

<style>
.bless-rsvp {
  display: grid;
  gap: var(--bless-space-3);
  font-family: var(--bless-font-sans);
  font-size: var(--bless-text-sm);
  color: var(--bless-color-text);
}
.bless-rsvp__question {
  margin: 0;
  font-weight: var(--bless-font-weight-bold);
}
.bless-rsvp__answers {
  display: flex;
  flex-wrap: wrap;
  gap: var(--bless-space-2);
}
.bless-rsvp__answer {
  display: inline-flex;
  align-items: center;
  gap: var(--bless-space-2);
  min-block-size: 2.25rem;
  padding: 0 var(--bless-space-3);
  border: var(--bless-border-width) solid var(--bless-color-border);
  background: var(--bless-color-bg);
  color: inherit;
  font: inherit;
  cursor: pointer;
}
.bless-rsvp__answer:hover {
  border-color: var(--bless-color-text);
}
.bless-rsvp__answer:focus-visible {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: 2px;
}
/* the answer of the reader is filled, not only tinted */
.bless-rsvp__answer[aria-pressed="true"] {
  border-color: var(--bless-color-text);
  background: var(--bless-color-text);
  color: var(--bless-color-bg);
  font-weight: var(--bless-font-weight-bold);
}
.bless-rsvp__count {
  min-inline-size: 1.5em;
  padding: 0 var(--bless-space-1);
  background: var(--bless-color-surface-2);
  color: var(--bless-color-text);
  font-size: var(--bless-text-xs);
  font-variant-numeric: tabular-nums;
  text-align: center;
}
.bless-rsvp__going {
  display: flex;
  align-items: center;
  gap: var(--bless-space-2);
}
.bless-rsvp__total {
  color: var(--bless-color-text-muted);
}
</style>
