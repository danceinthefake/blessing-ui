<script setup lang="ts">
import { computed } from "vue";
import { useLabelPack } from "../composables/useLabels";
import BlessButton from "./BlessButton.vue";
import BlessFileInput from "./BlessFileInput.vue";

defineOptions({ name: "BlessAssignment" });
const pack = useLabelPack("BlessAssignment");

const props = defineProps<{
  title: string;
  /** the due date as text */
  due?: string;
  points?: number;
  instructions?: string;
  /** when the work was handed in, as text; leave it out before that */
  submitted?: string;
  late?: boolean;
  /** the grade as text, for example "88 / 100" or "A-" */
  grade?: string;
  feedback?: string;
  accept?: string;
  labels?: Partial<{
    due: (when: string) => string;
    points: (n: number) => string;
    todo: string;
    done: string;
    late: string;
    graded: string;
    yourWork: string;
    drop: string;
    submit: string;
    submittedAt: (when: string) => string;
    grade: string;
    feedback: string;
  }>;
}>();
const files = defineModel<File[]>({ default: () => [] });
const emit = defineEmits<{ submit: [files: File[]] }>();

const text = computed(() => ({
  due: (w: string) => `Due ${w}`,
  points: (n: number) => `${n} points`,
  todo: "To do",
  done: "Handed in",
  late: "Handed in late",
  graded: "Graded",
  yourWork: "Your work",
  drop: "Drop your files here or click to pick them",
  submit: "Hand in",
  submittedAt: (w: string) => `Handed in ${w}`,
  grade: "Grade",
  feedback: "Feedback",
  ...pack(),
  ...props.labels,
}));
const state = computed(() =>
  props.grade ? "graded" : props.submitted ? (props.late ? "late" : "done") : "todo",
);
</script>

<template>
  <article class="bless-assign">
    <header class="bless-assign__head">
      <h3 class="bless-assign__title">{{ title }}</h3>
      <span class="bless-assign__state" :class="`is-${state}`">{{ text[state] }}</span>
      <div class="bless-assign__facts">
        <span v-if="due">{{ text.due(due) }}</span>
        <span v-if="points != null">{{ text.points(points) }}</span>
      </div>
    </header>
    <div v-if="instructions" class="bless-assign__text">{{ instructions }}</div>
    <section v-if="grade" class="bless-assign__grade" :aria-label="text.grade">
      <div class="bless-assign__score">
        <span>{{ text.grade }}</span>
        <strong>{{ grade }}</strong>
      </div>
      <div v-if="feedback" class="bless-assign__feedback">
        <span>{{ text.feedback }}</span>
        <div>{{ feedback }}</div>
      </div>
    </section>
    <section class="bless-assign__work" :aria-label="text.yourWork">
      <div class="bless-assign__label" aria-hidden="true">{{ text.yourWork }}</div>
      <template v-if="submitted">
        <div>✓ {{ text.submittedAt(submitted) }}</div>
        <ul v-if="files.length" class="bless-assign__files" role="list">
          <li v-for="f in files" :key="f.name">{{ f.name }}</li>
        </ul>
      </template>
      <template v-else>
        <BlessFileInput v-model="files" multiple :accept :label="text.drop" />
        <BlessButton :disabled="!files.length" @click="emit('submit', files)">
          {{ text.submit }}
        </BlessButton>
      </template>
    </section>
  </article>
</template>

<style>
.bless-assign {
  display: grid;
  gap: var(--bless-space-4);
  max-inline-size: 40rem;
  padding: var(--bless-space-4);
  border: var(--bless-border-width) solid var(--bless-color-border);
  font-family: var(--bless-font-sans);
  font-size: var(--bless-text-sm);
  color: var(--bless-color-text);
}
.bless-assign__head {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: var(--bless-space-1) var(--bless-space-3);
  align-items: start;
}
/* two classes, so the heading styles of a host page do not win */
.bless-assign .bless-assign__title {
  margin: 0;
  padding: 0;
  border: 0;
  font-size: var(--bless-text-lg);
  font-weight: var(--bless-font-weight-bold);
}
.bless-assign__state {
  padding: 2px var(--bless-space-2);
  border: 2px solid var(--bless-color-text);
  font-size: var(--bless-text-xs);
  font-weight: var(--bless-font-weight-bold);
  white-space: nowrap;
}
.bless-assign__state.is-todo {
  border-style: dashed;
}
.bless-assign__state.is-late {
  border-color: var(--bless-color-danger);
  color: var(--bless-color-danger-text);
}
.bless-assign__state.is-graded {
  background: var(--bless-color-text);
  color: var(--bless-color-bg);
}
.bless-assign__facts {
  display: flex;
  flex-wrap: wrap;
  gap: var(--bless-space-3);
  grid-column: 1 / -1;
  font-size: var(--bless-text-xs);
}
.bless-assign__text {
  line-height: 1.6;
  white-space: pre-line;
}
.bless-assign__grade {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: var(--bless-space-4);
  padding: var(--bless-space-3);
  background: var(--bless-color-surface-2);
}
.bless-assign__score,
.bless-assign__feedback {
  display: grid;
  align-content: start;
  gap: 2px;
}
.bless-assign__score span,
.bless-assign__feedback span,
.bless-assign__label {
  font-size: var(--bless-text-xs);
  font-weight: var(--bless-font-weight-bold);
}
.bless-assign__score strong {
  font-size: var(--bless-text-xl);
  font-variant-numeric: tabular-nums;
}
.bless-assign__work {
  display: grid;
  justify-items: start;
  gap: var(--bless-space-2);
  padding-block-start: var(--bless-space-3);
  border-block-start: var(--bless-border-width) solid var(--bless-color-border);
}
.bless-assign__work > .bless-file {
  justify-self: stretch;
}
.bless-assign__files {
  margin: 0;
  padding-inline-start: var(--bless-space-4);
}
.bless-assign {
  animation: bless-enter var(--bless-duration-enter) var(--bless-ease-soft);
}
</style>
