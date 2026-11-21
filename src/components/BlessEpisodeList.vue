<template>
  <section class="bless-episodes" :aria-label="text.title">
    <ol class="bless-stagger bless-episodes__list" role="list">
      <li
        v-for="e in episodes"
        :key="e.id"
        class="bless-episodes__item"
        :class="{ 'is-current': e.id === current, 'is-watched': (e.progress ?? 0) >= 0.95 }"
        :aria-current="e.id === current ? 'true' : undefined"
      >
        <button
          type="button"
          class="bless-episodes__thumb"
          :aria-label="text.play(e.number, e.title)"
          @click="emit('play', e.id)"
        >
          <img v-if="e.image" :src="e.image" alt="" loading="lazy" />
          <span class="bless-episodes__play" aria-hidden="true">▶</span>
          <span v-if="(e.progress ?? 0) > 0" class="bless-episodes__bar" aria-hidden="true">
            <span :style="{ inlineSize: `${Math.min(1, e.progress!) * 100}%` }" />
          </span>
        </button>
        <div class="bless-episodes__body">
          <h4 class="bless-episodes__title">
            <span class="bless-episodes__num">{{ e.number }}.</span> {{ e.title }}
          </h4>
          <p class="bless-episodes__meta">
            {{ text.length(e.minutes)
            }}<template v-if="state(e)"> · <strong>{{ state(e) }}</strong></template>
          </p>
          <p v-if="e.summary" class="bless-episodes__summary">{{ e.summary }}</p>
        </div>
      </li>
    </ol>
  </section>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useLabelPack } from "../composables/useLabels";

defineOptions({ name: "BlessEpisodeList" });
const pack = useLabelPack("BlessEpisodeList");

export interface BlessEpisode {
  id: string;
  number: number;
  title: string;
  /** the length in minutes */
  minutes: number;
  summary?: string;
  image?: string;
  /** how much is watched, 0 to 1 */
  progress?: number;
}

const props = defineProps<{
  episodes: BlessEpisode[];
  /** the id of the episode that plays now */
  current?: string;
  labels?: Partial<{
    title: string;
    play: (n: number, title: string) => string;
    length: (minutes: number) => string;
    left: (minutes: number) => string;
    watched: string;
    playing: string;
  }>;
}>();
const emit = defineEmits<{ play: [id: string] }>();

const text = computed(() => ({
  title: "Episodes",
  play: (n: number, t: string) => `Play episode ${n}: ${t}`,
  length: (m: number) => `${m} min`,
  left: (m: number) => `${m} min left`,
  watched: "Watched",
  playing: "Playing now",
  ...pack(),
  ...props.labels,
}));
// the progress as words: watched near the end, or the minutes left
const state = (e: BlessEpisode) => {
  if (e.id === props.current) return text.value.playing;
  const p = e.progress ?? 0;
  if (p >= 0.95) return text.value.watched;
  if (p > 0) return text.value.left(Math.max(1, Math.round(e.minutes * (1 - p))));
  return "";
};
</script>

<style>
.bless-episodes {
  font-family: var(--bless-font-sans);
  font-size: var(--bless-text-sm);
  color: var(--bless-color-text);
}
.bless-episodes__list {
  display: grid;
  margin: 0;
  padding: 0;
  list-style: none;
}
.bless-episodes__item {
  display: flex;
  gap: var(--bless-space-3);
  border-block-end: var(--bless-border-width) solid var(--bless-color-border);
}
/* the space sits on the children, so a list reset of the host page keeps it */
.bless-episodes__item > * {
  margin-block: var(--bless-space-3);
}
.bless-episodes__item.is-current {
  box-shadow: inset 4px 0 0 var(--bless-color-accent);
}
.bless-episodes__item.is-current > :first-child {
  margin-inline-start: var(--bless-space-3);
}
.bless-episodes__thumb {
  position: relative;
  flex: none;
  inline-size: 9rem;
  aspect-ratio: 16 / 9;
  padding: 0;
  overflow: hidden;
  border: 0;
  background: var(--bless-color-surface-2);
  cursor: pointer;
}
.bless-episodes__thumb img {
  inline-size: 100%;
  block-size: 100%;
  object-fit: cover;
}
.bless-episodes__thumb:focus-visible {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: 2px;
}
.bless-episodes__play {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  color: #fff;
  font-size: var(--bless-text-lg);
  text-shadow: 0 1px 4px rgb(0 0 0 / 0.6);
}
.bless-episodes__bar {
  position: absolute;
  inset: auto 0 0;
  block-size: 4px;
  background: rgb(0 0 0 / 0.4);
}
.bless-episodes__bar span {
  display: block;
  block-size: 100%;
  background: var(--bless-color-accent);
}
.bless-episodes__body {
  display: grid;
  align-content: start;
  gap: 2px;
  min-inline-size: 0;
}
.bless-episodes__title {
  margin: 0;
  font-size: var(--bless-text-sm);
}
.bless-episodes__num {
  font-variant-numeric: tabular-nums;
}
.bless-episodes__meta {
  margin: 0;
  font-size: var(--bless-text-xs);
  color: var(--bless-color-text-muted);
}
.bless-episodes__meta strong {
  color: var(--bless-color-text);
}
.bless-episodes__summary {
  display: -webkit-box;
  margin: 0;
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  font-size: var(--bless-text-xs);
  line-height: 1.45;
}
@media (max-width: 480px) {
  .bless-episodes__thumb {
    inline-size: 6.5rem;
  }
}
</style>
