<script setup lang="ts">
import { computed } from "vue";
import { useLabelPack } from "../composables/useLabels";
import "./sr.css";

defineOptions({ name: "BlessLessonPath" });
const pack = useLabelPack("BlessLessonPath");

export interface BlessLesson {
  id: string;
  title: string;
  /** a short line under the title, for example the length */
  meta?: string;
  done?: boolean;
}

const props = defineProps<{
  /** in order; the first lesson that is not done is the current one, and the ones after it are locked */
  lessons: BlessLesson[];
  labels?: Partial<{
    title: string;
    done: string;
    current: string;
    locked: string;
    progress: (done: number, total: number) => string;
  }>;
}>();
const emit = defineEmits<{ select: [id: string] }>();

const text = computed(() => ({
  title: "Lessons",
  done: "done",
  current: "start here",
  locked: "locked",
  progress: (d: number, t: number) => `${d} of ${t} lessons done`,
  ...pack(),
  ...props.labels,
}));
const current = computed(() => props.lessons.findIndex((l) => !l.done));
const state = (i: number) =>
  props.lessons[i]!.done ? "done" : i === current.value ? "current" : "locked";
const doneCount = computed(() => props.lessons.filter((l) => l.done).length);
const MARK = { done: "✓", current: "▶", locked: "" } as const;
</script>

<template>
  <nav class="bless-path" :aria-label="text.title">
    <p class="bless-path__progress">{{ text.progress(doneCount, lessons.length) }}</p>
    <ol class="bless-stagger bless-path__list">
      <li
        v-for="(l, i) in lessons"
        :key="l.id"
        class="bless-path__item"
        :class="[`is-${state(i)}`, i % 4 === 1 ? 'is-right' : i % 4 === 3 ? 'is-left' : '']"
      >
        <button
          type="button"
          class="bless-path__node"
          :disabled="state(i) === 'locked'"
          :aria-current="state(i) === 'current' ? 'step' : undefined"
          @click="emit('select', l.id)"
        >
          <span class="bless-path__mark" aria-hidden="true">
            <svg
              v-if="state(i) === 'locked'"
              viewBox="0 0 16 16"
              width="16"
              height="16"
              fill="currentColor"
            >
              <path d="M5 7V5a3 3 0 0 1 6 0v2h1v7H4V7h1Zm1.5 0h3V5a1.5 1.5 0 0 0-3 0v2Z" />
            </svg>
            <template v-else>{{ MARK[state(i)] }}</template>
          </span>
          <span class="bless-path__text">
            <strong>{{ l.title }}</strong>
            <span class="bless-path__meta">
              {{ l.meta }}<template v-if="l.meta"> · </template>{{ text[state(i)] }}
            </span>
          </span>
        </button>
      </li>
    </ol>
  </nav>
</template>

<style>
.bless-path {
  display: grid;
  gap: var(--bless-space-3);
  max-inline-size: 26rem;
  font-family: var(--bless-font-sans);
  font-size: var(--bless-text-sm);
  color: var(--bless-color-text);
}
.bless-path__progress {
  margin: 0;
  font-weight: var(--bless-font-weight-bold);
}
.bless-path__list {
  display: grid;
  gap: var(--bless-space-4);
  margin: 0;
  padding: 0;
  list-style: none;
}
/* the nodes swing left and right, so the list reads as a path */
.bless-path__item {
  position: relative;
  display: flex;
}
/* the swing is a margin on the button, so a list reset of the host page does not remove it */
.is-right > .bless-path__node {
  margin-inline-start: 22%;
}
.is-left > .bless-path__node {
  margin-inline-start: 11%;
}
.bless-path__node {
  display: flex;
  align-items: center;
  gap: var(--bless-space-3);
  padding: 0;
  border: 0;
  background: none;
  color: inherit;
  font: inherit;
  text-align: start;
  cursor: pointer;
}
.bless-path__node:disabled {
  cursor: not-allowed;
}
.bless-path__node:focus-visible {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: 4px;
}
.bless-path__mark {
  display: grid;
  flex: none;
  place-items: center;
  inline-size: 3rem;
  block-size: 3rem;
  border: 3px solid var(--bless-color-border);
  border-radius: 50%;
  background: var(--bless-color-surface-2);
  font-size: var(--bless-text-md);
  font-weight: var(--bless-font-weight-bold);
}
.is-done .bless-path__mark {
  border-color: var(--bless-color-text);
  background: var(--bless-color-text);
  color: var(--bless-color-bg);
}
.is-current .bless-path__mark {
  border-color: var(--bless-color-accent);
  background: var(--bless-color-accent);
  color: var(--bless-color-on-accent);
  box-shadow: 0 0 0 4px color-mix(in srgb, var(--bless-color-accent) 30%, transparent);
}
.bless-path__text {
  display: grid;
}
.bless-path__meta {
  font-size: var(--bless-text-xs);
  color: var(--bless-color-text-muted);
}
.is-locked .bless-path__text strong {
  color: var(--bless-color-text-muted);
}
</style>
