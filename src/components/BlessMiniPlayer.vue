<template>
  <section class="bless-mini" :class="{ 'is-docked': docked }" :aria-label="text.title">
    <input
      class="bless-mini__seek"
      type="range"
      min="0"
      :max="duration"
      step="1"
      :value="position"
      :aria-label="text.position"
      :aria-valuetext="text.time(clock(position), clock(duration))"
      :style="{ '--_at': `${share}%` }"
      @input="position = ($event.target as HTMLInputElement).valueAsNumber"
    />
    <div class="bless-mini__row">
      <button type="button" class="bless-mini__track" @click="emit('open')">
        <span class="bless-sr">{{ text.open }}: </span>
        <span class="bless-mini__art"><img v-if="image" :src="image" alt="" /></span>
        <span class="bless-mini__text">
          <span class="bless-mini__title">{{ title }}</span>{{ " "
          }}<span v-if="artist" class="bless-mini__artist">{{ artist }}</span>
        </span>
      </button>
      <span class="bless-mini__time" aria-hidden="true"
        >{{ clock(position) }} / {{ clock(duration) }}</span
      >
      <div class="bless-mini__controls">
        <button type="button" :aria-label="text.previous" @click="emit('previous')">
          <svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor" aria-hidden="true">
            <path d="M3 2h2v12H3zM14 2v12L6 8z" />
          </svg>
        </button>
        <button
          type="button"
          class="is-main"
          :aria-label="playing ? text.pause : text.play"
          @click="playing = !playing"
        >
          {{ playing ? "❚❚" : "▶" }}
        </button>
        <button type="button" :aria-label="text.next" @click="emit('next')">
          <svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor" aria-hidden="true">
            <path d="M11 2h2v12h-2zM2 2v12l8-6z" />
          </svg>
        </button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useLabelPack } from "../composables/useLabels";
import "./sr.css";

defineOptions({ name: "BlessMiniPlayer" });
const pack = useLabelPack("BlessMiniPlayer");

const props = withDefaults(
  defineProps<{
    title: string;
    artist?: string;
    image?: string;
    /** the length in seconds */
    duration: number;
    /** stick to the bottom of the screen */
    docked?: boolean;
    labels?: Partial<{
      title: string;
      play: string;
      pause: string;
      previous: string;
      next: string;
      open: string;
      position: string;
      time: (now: string, total: string) => string;
    }>;
  }>(),
  {},
);
const playing = defineModel<boolean>("playing", { default: false });
/** where the track is, in seconds */
const position = defineModel<number>("position", { default: 0 });
const emit = defineEmits<{ previous: []; next: []; open: [] }>();

const text = computed(() => ({
  title: "Player",
  play: "Play",
  pause: "Pause",
  previous: "Previous",
  next: "Next",
  open: "Open the full player",
  position: "Position",
  time: (n: string, t: string) => `${n} of ${t}`,
  ...pack(),
  ...props.labels,
}));
const clock = (s: number) => {
  const m = Math.floor(s / 60);
  return `${m}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
};
const share = computed(() => (props.duration ? (position.value / props.duration) * 100 : 0));
</script>

<style>
.bless-mini {
  display: grid;
  border: var(--bless-border-width) solid var(--bless-color-border);
  background: var(--bless-color-bg);
  font-family: var(--bless-font-sans);
  font-size: var(--bless-text-sm);
  color: var(--bless-color-text);
}
.bless-mini.is-docked {
  position: sticky;
  inset-block-end: 0;
  z-index: var(--bless-z-nav);
  box-shadow: 0 -4px 12px rgb(0 0 0 / 0.12);
}
/* a thin native range across the top; it grows while it has the focus */
.bless-mini__seek {
  inline-size: 100%;
  block-size: 4px;
  margin: 0;
  appearance: none;
  background: linear-gradient(
    to right,
    var(--bless-color-accent) var(--_at),
    var(--bless-color-surface-2) var(--_at)
  );
  cursor: pointer;
}
.bless-mini__seek:hover,
.bless-mini__seek:focus-visible {
  block-size: 8px;
}
.bless-mini__seek:focus-visible {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: 2px;
}
.bless-mini__seek::-webkit-slider-thumb {
  appearance: none;
  inline-size: 12px;
  block-size: 12px;
  border-radius: 50%;
  background: var(--bless-color-text);
}
.bless-mini__seek::-moz-range-thumb {
  inline-size: 12px;
  block-size: 12px;
  border: 0;
  border-radius: 50%;
  background: var(--bless-color-text);
}
.bless-mini__row {
  display: flex;
  align-items: center;
  gap: var(--bless-space-3);
  padding: var(--bless-space-2) var(--bless-space-3);
}
.bless-mini__track {
  display: flex;
  flex: 1;
  align-items: center;
  gap: var(--bless-space-2);
  min-inline-size: 0;
  padding: 0;
  border: 0;
  background: none;
  color: inherit;
  font: inherit;
  text-align: start;
  cursor: pointer;
}
.bless-mini__art {
  flex: none;
  inline-size: 2.5rem;
  block-size: 2.5rem;
  overflow: hidden;
  background: var(--bless-color-surface-2);
}
.bless-mini__art img {
  inline-size: 100%;
  block-size: 100%;
  object-fit: cover;
}
.bless-mini__text {
  display: grid;
  min-inline-size: 0;
}
.bless-mini__title,
.bless-mini__artist {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.bless-mini__title {
  font-weight: var(--bless-font-weight-bold);
}
.bless-mini__artist {
  font-size: var(--bless-text-xs);
  color: var(--bless-color-text-muted);
}
.bless-mini__time {
  font-size: var(--bless-text-xs);
  color: var(--bless-color-text-muted);
  font-variant-numeric: tabular-nums;
}
.bless-mini__controls {
  display: flex;
  gap: var(--bless-space-1);
}
.bless-mini__controls button {
  inline-size: 2.25rem;
  block-size: 2.25rem;
  border: 0;
  background: none;
  color: inherit;
  font: inherit;
  cursor: pointer;
}
.bless-mini__controls button.is-main {
  border-radius: 50%;
  background: var(--bless-color-text);
  color: var(--bless-color-bg);
}
.bless-mini__track:focus-visible,
.bless-mini__controls button:focus-visible {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: 2px;
}
@media (max-width: 480px) {
  .bless-mini__time {
    display: none;
  }
}
</style>
