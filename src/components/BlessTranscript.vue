<script setup lang="ts">
import { computed, nextTick, ref, watch } from "vue";
import { reducedMotion } from "../composables/useMedia";
import { useLabelPack } from "../composables/useLabels";
import { clockText, currentIndex } from "./media";

defineOptions({ name: "BlessTranscript" });
const pack = useLabelPack("BlessTranscript");

export interface BlessCue {
  /** the start, in seconds */
  start: number;
  /** the end, in seconds; default: the start of the next line */
  end?: number;
  text: string;
  speaker?: string;
}

const props = withDefaults(
  defineProps<{
    cues: BlessCue[];
    /** the time of the media now, in seconds */
    time?: number;
    /** keep the current line in view while the media plays */
    follow?: boolean;
    labels?: Partial<{ title: string; seek: (time: string) => string }>;
  }>(),
  { time: 0, follow: true },
);
const emit = defineEmits<{ seek: [seconds: number] }>();

const text = computed(() => ({
  title: "Transcript",
  seek: (t: string) => `Play from ${t}`,
  ...pack(),
  ...props.labels,
}));
const current = computed(() => currentIndex(props.cues, props.time));
const box = ref<HTMLElement>();
watch(current, async (i) => {
  if (!props.follow || i < 0 || !box.value) return;
  await nextTick();
  const row = box.value.querySelector<HTMLElement>(`[data-cue="${i}"]`);
  if (!row) return;
  // scroll the box only, never the page
  const top = row.offsetTop - box.value.clientHeight / 2 + row.offsetHeight / 2;
  box.value.scrollTo({ top, behavior: reducedMotion() ? "auto" : "smooth" });
});
</script>

<template>
  <div ref="box" class="bless-transcript" role="region" :aria-label="text.title" tabindex="0">
    <ol class="bless-transcript__list">
      <li
        v-for="(c, i) in cues"
        :key="i"
        :data-cue="i"
        class="bless-transcript__cue"
        :class="{ 'is-current': i === current, 'is-past': current >= 0 && i < current }"
        :aria-current="i === current ? 'time' : undefined"
      >
        <p v-if="c.speaker && c.speaker !== cues[i - 1]?.speaker" class="bless-transcript__speaker">
          {{ c.speaker }}
        </p>
        <div class="bless-transcript__line">
          <button
            type="button"
            class="bless-transcript__time"
            :aria-label="text.seek(clockText(c.start))"
            @click="emit('seek', c.start)"
          >
            {{ clockText(c.start) }}
          </button>
          <span class="bless-transcript__text">{{ c.text }}</span>
        </div>
      </li>
    </ol>
  </div>
</template>

<style>
.bless-transcript {
  max-block-size: var(--bless-transcript-height, 20rem);
  overflow-y: auto;
  font-family: var(--bless-font-sans);
  font-size: var(--bless-text-sm);
  color: var(--bless-color-text);
  overscroll-behavior: contain;
}
.bless-transcript:focus-visible {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: 2px;
}
.bless-transcript__list {
  position: relative;
  margin: 0;
  padding: 0;
  list-style: none;
}
.bless-transcript__speaker {
  margin: var(--bless-space-3) 0 var(--bless-space-1);
  font-size: var(--bless-text-xs);
  font-weight: var(--bless-font-weight-bold);
  letter-spacing: var(--bless-tracking-wide);
  text-transform: uppercase;
  color: var(--bless-color-text-muted);
}
.bless-transcript__line {
  display: flex;
  gap: var(--bless-space-3);
  padding: var(--bless-space-1) var(--bless-space-2);
  border-inline-start: 3px solid transparent;
  line-height: 1.6;
}
.is-past .bless-transcript__text {
  color: var(--bless-color-text-muted);
}
/* the current line has a bar and bold words, so it shows without color too */
.is-current .bless-transcript__line {
  border-inline-start-color: var(--bless-color-accent);
  background: var(--bless-color-surface-2);
}
.is-current .bless-transcript__time {
  color: var(--bless-color-text);
}
.is-current .bless-transcript__text {
  font-weight: var(--bless-font-weight-bold);
}
.bless-transcript__time {
  flex: none;
  align-self: flex-start;
  min-inline-size: 3.2em;
  padding: 0;
  border: 0;
  background: none;
  color: var(--bless-color-text-muted);
  font: inherit;
  font-size: var(--bless-text-xs);
  font-variant-numeric: tabular-nums;
  line-height: 1.6rem;
  text-align: start;
  cursor: pointer;
}
.bless-transcript__time:hover {
  color: var(--bless-color-text);
  text-decoration: underline;
}
.bless-transcript__time:focus-visible {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: 2px;
}
.bless-transcript {
  animation: bless-enter var(--bless-duration-enter) var(--bless-ease-soft);
}
</style>
