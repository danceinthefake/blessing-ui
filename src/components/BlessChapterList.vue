<script setup lang="ts">
import { computed } from "vue";
import { useLabelPack } from "../composables/useLabels";
import { clockText, currentIndex } from "./media";

defineOptions({ name: "BlessChapterList" });
const pack = useLabelPack("BlessChapterList");

export interface BlessChapter {
  /** the start, in seconds */
  start: number;
  title: string;
}

const props = withDefaults(
  defineProps<{
    chapters: BlessChapter[];
    /** the time of the media now, in seconds */
    time?: number;
    /** the length of the media, in seconds; it gives the last chapter its length */
    duration?: number;
    labels?: Partial<{ title: string; length: (minutes: number) => string }>;
  }>(),
  { time: 0 },
);
const emit = defineEmits<{ seek: [seconds: number] }>();

const text = computed(() => ({
  title: "Chapters",
  length: (m: number) => (m < 1 ? "< 1 min" : `${m} min`),
  ...pack(),
  ...props.labels,
}));
const rows = computed(() =>
  props.chapters.map((c, i) => {
    const end = props.chapters[i + 1]?.start ?? props.duration;
    return { ...c, end, minutes: end === undefined ? undefined : Math.round((end - c.start) / 60) };
  }),
);
const when = (c: { start: number; minutes?: number }) =>
  c.minutes === undefined
    ? clockText(c.start)
    : `${clockText(c.start)} · ${text.value.length(c.minutes)}`;
const current = computed(() => currentIndex(props.chapters, props.time));
// how far the media is inside the current chapter, 0 to 1
const progress = computed(() => {
  const r = rows.value[current.value];
  return r?.end ? Math.min(1, (props.time - r.start) / (r.end - r.start || 1)) : 0;
});
</script>

<template>
  <nav class="bless-chapters" :aria-label="text.title">
    <ol class="bless-chapters__list">
      <li v-for="(c, i) in rows" :key="c.start">
        <button
          type="button"
          class="bless-chapters__item"
          :class="{ 'is-current': i === current }"
          :aria-current="i === current ? 'true' : undefined"
          @click="emit('seek', c.start)"
        >
          <span class="bless-chapters__num" aria-hidden="true">{{ i + 1 }}</span>
          <span class="bless-chapters__title">{{ c.title }}</span>
          <span class="bless-chapters__time">{{ when(c) }}</span>
          <span
            v-if="i === current"
            class="bless-chapters__progress"
            :style="{ inlineSize: `${progress * 100}%` }"
            aria-hidden="true"
          />
        </button>
      </li>
    </ol>
  </nav>
</template>

<style>
.bless-chapters {
  font-family: var(--bless-font-sans);
  font-size: var(--bless-text-sm);
  color: var(--bless-color-text);
}
.bless-chapters__list {
  margin: 0;
  padding: 0;
  list-style: none;
}
.bless-chapters__item {
  position: relative;
  display: grid;
  grid-template-columns: 1.6rem 1fr auto;
  align-items: center;
  gap: var(--bless-space-3);
  inline-size: 100%;
  padding: var(--bless-space-2) var(--bless-space-3);
  border: 0;
  border-block-end: var(--bless-border-width) solid var(--bless-color-border);
  background: none;
  color: inherit;
  font: inherit;
  text-align: start;
  cursor: pointer;
}
.bless-chapters__item:hover {
  background: var(--bless-color-surface-2);
}
.bless-chapters__item:focus-visible {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: -2px;
}
.bless-chapters__num {
  font-size: var(--bless-text-xs);
  color: var(--bless-color-text-muted);
  font-variant-numeric: tabular-nums;
}
.bless-chapters__time {
  font-size: var(--bless-text-xs);
  color: var(--bless-color-text-muted);
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}
/* the current chapter is bold, with a filled number and a line that grows as it plays */
.bless-chapters__item.is-current {
  font-weight: var(--bless-font-weight-bold);
}
.is-current .bless-chapters__num {
  display: inline-grid;
  place-items: center;
  block-size: 1.4rem;
  background: var(--bless-color-text);
  color: var(--bless-color-bg);
  font-weight: var(--bless-font-weight-bold);
}
.bless-chapters__progress {
  position: absolute;
  inset-block-end: -1px;
  inset-inline-start: 0;
  block-size: 2px;
  background: var(--bless-color-accent);
}
</style>
