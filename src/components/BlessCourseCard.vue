<template>
  <article class="bless-course">
    <img v-if="image" :src="image" :alt="imageAlt" class="bless-course__image" />
    <div class="bless-course__body">
      <h3 class="bless-course__title">
        <a v-if="href" :href="href">{{ title }}</a>
        <template v-else>{{ title }}</template>
      </h3>
      <div v-if="teacher" class="bless-course__teacher">{{ text.by(teacher) }}</div>
      <ul class="bless-course__facts" role="list">
        <li v-if="lessons != null">{{ text.lessons(lessons) }}</li>
        <li v-if="duration">{{ duration }}</li>
        <li v-if="level">{{ text.level }}: {{ level }}</li>
      </ul>
      <div v-if="pct != null" class="bless-course__progress">
        <div class="bless-course__bar" aria-hidden="true">
          <span :style="{ inlineSize: `${pct}%` }" />
        </div>
        <span>{{ pct === 100 ? `✓ ${text.finished}` : text.done(pct) }}</span>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useLabelPack } from "../composables/useLabels";

defineOptions({ name: "BlessCourseCard" });
const pack = useLabelPack("BlessCourseCard");

const props = withDefaults(
  defineProps<{
    title: string;
    href?: string;
    image?: string;
    /** describe the image; leave empty when the title says enough */
    imageAlt?: string;
    teacher?: string;
    lessons?: number;
    /** the length as text, for example "6 h 30 min" */
    duration?: string;
    level?: string;
    /** the share of the course that the learner did, 0 to 100; leave it out before they start */
    progress?: number;
    labels?: Partial<{
      by: (name: string) => string;
      lessons: (n: number) => string;
      level: string;
      done: (pct: number) => string;
      finished: string;
    }>;
  }>(),
  { imageAlt: "" },
);

const text = computed(() => ({
  by: (n: string) => `by ${n}`,
  lessons: (n: number) => (n === 1 ? "1 lesson" : `${n} lessons`),
  level: "Level",
  done: (p: number) => `${p}% done`,
  finished: "Finished",
  ...pack(),
  ...props.labels,
}));
const pct = computed(() =>
  props.progress == null ? undefined : Math.round(Math.min(100, Math.max(0, props.progress))),
);
</script>

<style>
.bless-course {
  position: relative;
  display: grid;
  grid-template-rows: auto 1fr;
  max-inline-size: 20rem;
  border: var(--bless-border-width) solid var(--bless-color-border);
  background: var(--bless-color-bg);
  font-family: var(--bless-font-sans);
  font-size: var(--bless-text-sm);
  color: var(--bless-color-text);
}
.bless-course:has(a:hover) {
  border-color: var(--bless-color-text);
}
.bless-course__image {
  display: block;
  inline-size: 100%;
  aspect-ratio: 16 / 9;
  object-fit: cover;
}
.bless-course__body {
  display: grid;
  align-content: start;
  gap: var(--bless-space-2);
  padding: var(--bless-space-3);
}
/* two classes, so the heading styles of a host page do not win */
.bless-course .bless-course__title {
  margin: 0;
  padding: 0;
  border: 0;
  font-size: var(--bless-text-md);
  font-weight: var(--bless-font-weight-bold);
  line-height: 1.3;
}
.bless-course__title a {
  color: inherit;
  text-decoration: none;
}
/* the whole card takes the click of the title link */
.bless-course__title a::after {
  content: "";
  position: absolute;
  inset: 0;
}
.bless-course__title a:focus-visible {
  outline: none;
}
.bless-course:has(a:focus-visible) {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: 2px;
}
.bless-course__teacher {
  font-size: var(--bless-text-xs);
}
.bless-course__facts {
  display: flex;
  flex-wrap: wrap;
  gap: var(--bless-space-1) var(--bless-space-3);
  margin: 0;
  padding: 0;
  list-style: none;
  font-size: var(--bless-text-xs);
}
.bless-course__facts li + li::before {
  content: "·";
  margin-inline-end: var(--bless-space-3);
}
.bless-course__progress {
  display: grid;
  gap: var(--bless-space-1);
  font-size: var(--bless-text-xs);
  font-weight: var(--bless-font-weight-bold);
}
.bless-course__bar {
  block-size: 6px;
  background: var(--bless-color-surface-2);
}
.bless-course__bar span {
  display: block;
  block-size: 100%;
  background: var(--bless-color-accent);
}
.bless-course {
  animation: bless-enter var(--bless-duration-enter) var(--bless-ease-soft);
}
</style>
