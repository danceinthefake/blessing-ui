<template>
  <div ref="root" class="bless-quiz">
    <div v-if="done" class="bless-quiz__end">
      <p class="bless-quiz__score bless-quiz__focus" tabindex="-1">
        {{ text.score(right, questions.length) }}
      </p>
      <BlessButton size="sm" variant="outline" @click="restart">{{ text.restart }}</BlessButton>
    </div>
    <form v-else-if="q" class="bless-quiz__card" @submit.prevent="checked ? next() : check()">
      <p class="bless-quiz__progress">{{ text.progress(at + 1, questions.length) }}</p>
      <fieldset class="bless-quiz__set">
        <legend class="bless-quiz__question bless-quiz__focus" tabindex="-1">
          {{ q.question }}
        </legend>
        <label
          v-for="(c, i) in q.choices"
          :key="i"
          class="bless-quiz__choice"
          :class="{
            'is-right': checked && i === q.answer,
            'is-wrong': checked && i === pick && i !== q.answer,
          }"
        >
          <input
            v-model="pick"
            type="radio"
            :name="`${uid}-q${at}`"
            :value="i"
            :disabled="checked"
          />
          <span>{{ c }}</span>
          <span v-if="checked && i === q.answer" class="bless-quiz__mark" aria-hidden="true"
            >✓</span
          >
          <span v-else-if="checked && i === pick" class="bless-quiz__mark" aria-hidden="true"
            >✕</span
          >
        </label>
      </fieldset>
      <div class="bless-quiz__feedback" role="status">
        <template v-if="checked">
          <strong>{{ pick === q.answer ? text.right : text.wrong(q.choices[q.answer]!) }}</strong>
          <p v-if="q.explain" class="bless-quiz__explain">{{ q.explain }}</p>
        </template>
      </div>
      <BlessButton type="submit" size="sm" :disabled="pick === undefined">
        {{ !checked ? text.check : at + 1 >= questions.length ? text.finish : text.next }}
      </BlessButton>
    </form>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, ref, useId } from "vue";
import { useLabelPack } from "../composables/useLabels";
import BlessButton from "./BlessButton.vue";

defineOptions({ name: "BlessQuiz" });
const pack = useLabelPack("BlessQuiz");

export interface BlessQuizQuestion {
  question: string;
  choices: string[];
  /** the index of the right choice */
  answer: number;
  /** why the right choice is right */
  explain?: string;
}

const props = defineProps<{
  questions: BlessQuizQuestion[];
  labels?: Partial<{
    check: string;
    next: string;
    finish: string;
    restart: string;
    right: string;
    wrong: (answer: string) => string;
    progress: (n: number, total: number) => string;
    score: (right: number, total: number) => string;
  }>;
}>();
const emit = defineEmits<{ finish: [right: number, total: number] }>();

const text = computed(() => ({
  check: "Check",
  next: "Next question",
  finish: "See the score",
  restart: "Start again",
  right: "Right!",
  wrong: (a: string) => `Not this one. The answer is: ${a}`,
  progress: (n: number, t: number) => `Question ${n} of ${t}`,
  score: (r: number, t: number) => `You got ${r} of ${t} right.`,
  ...pack(),
  ...props.labels,
}));
const uid = useId();
const at = ref(0);
const pick = ref<number>();
const checked = ref(false);
const right = ref(0);
const done = ref(false);
const q = computed(() => props.questions[at.value]);
const root = ref<HTMLElement>();
const focusTop = () =>
  nextTick(() => root.value?.querySelector<HTMLElement>(".bless-quiz__focus")?.focus());
function check() {
  if (pick.value === undefined || checked.value) return;
  checked.value = true;
  if (pick.value === q.value!.answer) right.value++;
}
function next() {
  if (at.value + 1 >= props.questions.length) {
    done.value = true;
    emit("finish", right.value, props.questions.length);
  } else {
    at.value++;
    pick.value = undefined;
    checked.value = false;
  }
  focusTop();
}
function restart() {
  at.value = 0;
  pick.value = undefined;
  checked.value = false;
  right.value = 0;
  done.value = false;
  focusTop();
}
</script>

<style>
.bless-quiz {
  max-inline-size: 34rem;
  font-family: var(--bless-font-sans);
  font-size: var(--bless-text-sm);
  color: var(--bless-color-text);
}
.bless-quiz__card,
.bless-quiz__end {
  display: grid;
  justify-items: start;
  gap: var(--bless-space-3);
  padding: var(--bless-space-4);
  border: var(--bless-border-width) solid var(--bless-color-border);
}
.bless-quiz__progress {
  margin: 0;
  font-size: var(--bless-text-xs);
  color: var(--bless-color-text-muted);
}
.bless-quiz__set {
  display: grid;
  gap: var(--bless-space-2);
  inline-size: 100%;
  margin: 0;
  padding: 0;
  border: 0;
}
.bless-quiz__question {
  margin-block-end: var(--bless-space-2);
  padding: 0;
  font-size: var(--bless-text-md);
  font-weight: var(--bless-font-weight-bold);
}
.bless-quiz__focus:focus {
  outline: none;
}
.bless-quiz__choice {
  display: flex;
  align-items: center;
  gap: var(--bless-space-2);
  padding: var(--bless-space-2) var(--bless-space-3);
  border: var(--bless-border-width) solid var(--bless-color-border);
  cursor: pointer;
}
.bless-quiz__choice:has(:checked) {
  border-color: var(--bless-color-text);
}
.bless-quiz__choice:has(:focus-visible) {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: 2px;
}
.bless-quiz__choice input {
  accent-color: var(--bless-color-accent);
}
/* right and wrong have a mark and a thick edge, not only a color */
.bless-quiz__choice.is-right {
  border: 2px solid var(--bless-color-success);
}
.bless-quiz__choice.is-wrong {
  border: 2px dashed var(--bless-color-danger);
}
.bless-quiz__mark {
  margin-inline-start: auto;
  font-weight: var(--bless-font-weight-bold);
}
.bless-quiz__feedback:empty {
  display: none;
}
.bless-quiz__explain {
  margin: var(--bless-space-1) 0 0;
  line-height: 1.5;
}
.bless-quiz__score {
  margin: 0;
  font-size: var(--bless-text-lg);
  font-weight: var(--bless-font-weight-bold);
}
.bless-quiz {
  animation: bless-enter var(--bless-duration-enter) var(--bless-ease-soft);
}
</style>
