<script setup lang="ts">
import { computed, nextTick, ref, useId } from "vue";
import { useLabelPack } from "../composables/useLabels";

defineOptions({ name: "BlessEligibilityCheck" });
const pack = useLabelPack("BlessEligibilityCheck");

export interface BlessEligibilityQuestion {
  id: string;
  text: string;
  hint?: string;
  /** each answer leads to another question or to an outcome, by id */
  options: { label: string; next: string }[];
}
export interface BlessEligibilityOutcome {
  id: string;
  title: string;
  body?: string;
  eligible: boolean;
  href?: string;
  cta?: string;
}

const props = defineProps<{
  /** the first question in the list is the start */
  questions: BlessEligibilityQuestion[];
  outcomes: BlessEligibilityOutcome[];
  labels?: Partial<{
    question: (n: number) => string;
    next: string;
    back: string;
    restart: string;
    pick: string;
    yes: string;
    no: string;
  }>;
}>();
const emit = defineEmits<{ result: [outcome: string, answers: Record<string, string>] }>();

const text = computed(() => ({
  question: (n: number) => `Question ${n}`,
  next: "Continue",
  back: "Back",
  restart: "Start again",
  pick: "Choose an answer.",
  yes: "You can apply",
  no: "You cannot apply",
  ...pack(),
  ...props.labels,
}));
const id = useId();
// the questions answered so far, with the index of the answer
const path = ref<{ q: string; a: number }[]>([]);
const at = ref(props.questions[0]?.id ?? "");
const choice = ref<number>();
const error = ref(false);
const head = ref<HTMLElement>();
const question = computed(() => props.questions.find((q) => q.id === at.value));
const outcome = computed(() => props.outcomes.find((o) => o.id === at.value));
async function go(to: string) {
  at.value = to;
  error.value = false;
  await nextTick();
  head.value?.focus();
}
function next() {
  if (choice.value == null) {
    error.value = true;
    return;
  }
  const q = question.value!;
  path.value.push({ q: q.id, a: choice.value });
  const to = q.options[choice.value]!.next;
  choice.value = undefined;
  go(to);
  if (props.outcomes.some((o) => o.id === to))
    emit(
      "result",
      to,
      Object.fromEntries(path.value.map((p) => [p.q, questionOf(p.q)!.options[p.a]!.label])),
    );
}
const questionOf = (qid: string) => props.questions.find((q) => q.id === qid);
function back() {
  const last = path.value.pop();
  if (!last) return;
  choice.value = last.a;
  go(last.q);
}
function restart() {
  path.value = [];
  choice.value = undefined;
  go(props.questions[0]?.id ?? "");
}
</script>

<template>
  <div class="bless-elig">
    <form v-if="question" class="bless-elig__form" novalidate @submit.prevent="next">
      <fieldset
        class="bless-elig__set"
        :aria-describedby="error ? `${id}-err` : question.hint ? `${id}-hint` : undefined"
      >
        <legend class="bless-elig__legend">
          <span class="bless-elig__count">{{ text.question(path.length + 1) }}</span>
          <span ref="head" tabindex="-1" class="bless-elig__q">{{ question.text }}</span>
        </legend>
        <div v-if="question.hint" :id="`${id}-hint`" class="bless-elig__hint">
          {{ question.hint }}
        </div>
        <div v-if="error" :id="`${id}-err`" class="bless-elig__error">{{ text.pick }}</div>
        <label v-for="(o, i) in question.options" :key="i" class="bless-elig__option">
          <input v-model="choice" type="radio" :name="`${id}-${question.id}`" :value="i" />
          {{ o.label }}
        </label>
      </fieldset>
      <div class="bless-elig__actions">
        <button type="submit" class="is-main">{{ text.next }}</button>
        <button v-if="path.length" type="button" @click="back">{{ text.back }}</button>
      </div>
    </form>
    <section
      v-else-if="outcome"
      class="bless-elig__result"
      :class="outcome.eligible ? 'is-yes' : 'is-no'"
    >
      <div class="bless-elig__verdict">
        <span aria-hidden="true">{{ outcome.eligible ? "✓" : "✕" }}</span>
        {{ outcome.eligible ? text.yes : text.no }}
      </div>
      <h3 ref="head" tabindex="-1" class="bless-elig__title">{{ outcome.title }}</h3>
      <div v-if="outcome.body" class="bless-elig__body">{{ outcome.body }}</div>
      <div class="bless-elig__actions">
        <a v-if="outcome.href" :href="outcome.href" class="is-main">{{
          outcome.cta ?? outcome.title
        }}</a>
        <button type="button" @click="back">{{ text.back }}</button>
        <button type="button" @click="restart">{{ text.restart }}</button>
      </div>
    </section>
  </div>
</template>

<style>
.bless-elig {
  max-inline-size: 36rem;
  font-family: var(--bless-font-sans);
  font-size: var(--bless-text-sm);
  color: var(--bless-color-text);
}
.bless-elig__form,
.bless-elig__result {
  display: grid;
  gap: var(--bless-space-4);
}
.bless-elig__set {
  display: grid;
  gap: var(--bless-space-2);
  margin: 0;
  padding: 0;
  border: 0;
}
.bless-elig__legend {
  display: grid;
  gap: var(--bless-space-1);
  margin-block-end: var(--bless-space-2);
  padding: 0;
}
.bless-elig__count {
  font-size: var(--bless-text-xs);
}
.bless-elig__q {
  font-size: var(--bless-text-xl);
  font-weight: var(--bless-font-weight-bold);
  line-height: 1.25;
}
.bless-elig :is(.bless-elig__q, .bless-elig__title):focus {
  outline: none;
}
.bless-elig__hint {
  margin-block-end: var(--bless-space-1);
}
.bless-elig__error {
  padding-inline-start: var(--bless-space-2);
  border-inline-start: 4px solid var(--bless-color-danger);
  color: var(--bless-color-danger-text);
  font-weight: var(--bless-font-weight-bold);
}
.bless-elig__option {
  display: flex;
  align-items: center;
  gap: var(--bless-space-3);
  padding: var(--bless-space-3);
  border: 2px solid var(--bless-color-border);
  cursor: pointer;
}
.bless-elig__option:has(input:checked) {
  border-color: var(--bless-color-text);
  background: var(--bless-color-surface-2);
}
.bless-elig__option input {
  inline-size: 1.3rem;
  block-size: 1.3rem;
  margin: 0;
  accent-color: var(--bless-color-accent);
}
.bless-elig__option:has(input:focus-visible) {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: 2px;
}
.bless-elig__actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--bless-space-2);
}
.bless-elig__actions :is(a, button) {
  display: inline-grid;
  place-items: center;
  min-block-size: 2.75rem;
  padding: 0 var(--bless-space-4);
  border: 2px solid var(--bless-color-text);
  background: var(--bless-color-bg);
  color: inherit;
  font: inherit;
  font-weight: var(--bless-font-weight-bold);
  text-decoration: none;
  cursor: pointer;
}
.bless-elig__actions .is-main {
  border-color: var(--bless-color-accent);
  background: var(--bless-color-accent);
  color: var(--bless-color-on-accent);
}
.bless-elig__actions :is(a, button):focus-visible {
  outline: 2px solid var(--bless-color-text);
  outline-offset: 2px;
}
.bless-elig__verdict {
  display: flex;
  align-items: center;
  gap: var(--bless-space-2);
  padding: var(--bless-space-2) var(--bless-space-3);
  border: 2px solid var(--bless-color-text);
  font-size: var(--bless-text-md);
  font-weight: var(--bless-font-weight-bold);
}
.is-yes > .bless-elig__verdict {
  background: var(--bless-color-text);
  color: var(--bless-color-bg);
}
.is-no > .bless-elig__verdict {
  border-color: var(--bless-color-danger);
  color: var(--bless-color-danger-text);
}
/* two classes, so the heading styles of a host page do not win */
.bless-elig .bless-elig__title {
  margin: 0;
  padding: 0;
  border: 0;
  font-size: var(--bless-text-xl);
  font-weight: var(--bless-font-weight-bold);
}
.bless-elig__body {
  line-height: 1.6;
  white-space: pre-line;
}
</style>
