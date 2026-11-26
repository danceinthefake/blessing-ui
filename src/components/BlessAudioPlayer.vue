<template>
  <div class="bless-audio" :class="`bless-audio--${color}`">
    <audio
      ref="audio"
      :src="current?.src"
      preload="metadata"
      @play="
        playing = true;
        emit('play', current);
      "
      @pause="
        playing = false;
        emit('pause', current);
      "
      @timeupdate="onTime"
      @durationchange="duration = audio!.duration"
      @loadedmetadata="onMeta"
      @ended="onEnded"
    />

    <div v-if="current" class="bless-audio__now">
      <BlessSkew
        as="button"
        :color="playing ? color : 'text'"
        type="button"
        class="bless-audio__toggle"
        :aria-label="text.play"
        :aria-pressed="playing"
        @click="toggle"
      >
        <BlessIcon :name="playing ? 'pause' : 'play'" size="sm" />
      </BlessSkew>
      <div class="bless-audio__meta">
        <span class="bless-audio__title">{{ current.title }}</span>
        <span v-if="current.artist" class="bless-audio__artist">{{ current.artist }}</span>
      </div>
      <span class="bless-audio__time">{{ fmt(time) }} / {{ fmt(duration) }}</span>
      <div class="bless-audio__bar">
        <div class="bless-audio__fill" :style="{ width: `${progress}%` }" />
        <input
          type="range"
          class="bless-audio__seek"
          min="0"
          :max="duration || 0"
          step="1"
          :value="time"
          :disabled="!duration"
          :aria-label="text.seek"
          :aria-valuetext="`${fmt(time)} of ${fmt(duration)}`"
          @input="seek"
        />
      </div>
    </div>

    <ol role="list" v-if="tracks.length > 1" class="bless-audio__list">
      <li v-for="(t, i) in tracks" :key="t.src">
        <button
          type="button"
          class="bless-audio__track"
          :class="{ 'bless-audio__track--current': i === index }"
          :aria-current="i === index ? 'true' : undefined"
          @click="select(i)"
        >
          <span class="bless-audio__num">{{ String(i + 1).padStart(2, "0") }}</span>
          <span class="bless-audio__track-title">{{ t.title }}</span>
          <span v-if="i === index && playing" class="bless-audio__eq" aria-hidden="true"
            ><i /><i /><i
          /></span>
        </button>
      </li>
    </ol>
  </div>
</template>

<script setup lang="ts">
import { useLabelPack } from "../composables/useLabels";
import { computed, onBeforeUnmount, ref, watch } from "vue";
import BlessIcon from "./BlessIcon.vue";
import BlessSkew from "./BlessSkew.vue";

defineOptions({ name: "BlessAudioPlayer" });

export interface BlessTrack {
  src: string;
  title: string;
  artist?: string;
}

const props = withDefaults(
  defineProps<{
    tracks: BlessTrack[];
    color?: "text" | "accent" | "danger";
    labels?: Partial<{ play: string; seek: string }>;
  }>(),
  { color: "accent" },
);
const pack = useLabelPack("BlessAudioPlayer");
const text = computed(() => ({
  play: "Play",
  seek: "Seek",
  ...pack(),
  ...props.labels,
}));

/** index of the current track */
const index = defineModel<number>({ default: 0 });
const emit = defineEmits<{
  play: [track: BlessTrack];
  pause: [track: BlessTrack];
  ended: [track: BlessTrack];
}>();

const audio = ref<HTMLAudioElement>();
/** whether it plays; write it to start or stop, for example from an episode list */
const playing = defineModel<boolean>("playing", { default: false });
/** the time in the current track, in seconds; write it to seek, for example from chapters */
const time = defineModel<number>("time", { default: 0 });
const duration = ref(0);
const current = computed(() => props.tracks[index.value]);
const progress = computed(() => (duration.value ? (time.value / duration.value) * 100 : 0));

function fmt(s: number) {
  if (!Number.isFinite(s)) return "0:00";
  return `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
}

function toggle() {
  const a = audio.value;
  if (!a) return;
  if (a.paused) a.play().catch(() => (playing.value = false)); // blocked autoplay, bad source
  else a.pause();
}

function select(i: number) {
  if (i === index.value) return toggle();
  index.value = i;
  playing.value = true;
}

// seeking is a native range over the bar, so the keyboard can seek too (arrows, Home / End)
function seek(e: Event) {
  const a = audio.value;
  if (a && duration.value) a.currentTime = Number((e.target as HTMLInputElement).value);
}

function onEnded() {
  emit("ended", current.value);
  if (index.value < props.tracks.length - 1) {
    index.value++;
    playing.value = true;
  } else playing.value = false;
}

// a time from outside is a seek. Before the metadata loads, the browser drops a seek, so keep it
let pending: number | null = null;
function onTime() {
  if (pending === null) time.value = audio.value!.currentTime;
}
function onMeta() {
  if (pending !== null) audio.value!.currentTime = pending;
  pending = null;
}
// one watcher sees the source and the time together: with a new source, a new time is where the
// parent wants it to start, and an unchanged time means "from 0"
watch(
  [() => current.value?.src, time],
  ([src, t], [oldSrc, oldT]) => {
    const a = audio.value;
    if (!a) return;
    if (src !== oldSrc) {
      duration.value = 0;
      pending = t !== oldT ? t : 0;
      if (pending === 0) time.value = 0;
      a.load();
      if (playing.value) a.play().catch(() => (playing.value = false));
    } else if (a.readyState < 1) pending = t;
    else if (Math.abs(a.currentTime - t) > 0.5) a.currentTime = t;
  },
  { flush: "post" },
);

watch(
  playing,
  (p) => {
    const a = audio.value;
    if (!a) return;
    if (p && a.paused) a.play().catch(() => (playing.value = false));
    else if (!p && !a.paused) a.pause();
  },
  { flush: "post" },
);

onBeforeUnmount(() => audio.value?.pause());
</script>

<style>
.bless-audio {
  border-radius: var(--bless-radius);
  --_c: var(--bless-color-accent);
  font-family: var(--bless-font-sans);
  color: var(--bless-color-text);
}
.bless-audio--text {
  --_c: var(--bless-color-text);
}
.bless-audio--danger {
  --_c: var(--bless-color-danger);
}
.bless-audio__now {
  display: grid;
  grid-template-columns: auto 1fr auto;
  grid-template-areas: "toggle meta time" "bar bar bar";
  align-items: center;
  gap: var(--bless-space-2) var(--bless-space-4);
  padding: var(--bless-space-4);
  background: var(--bless-color-surface);
}
.bless-audio__toggle {
  grid-area: toggle;
  width: 48px;
  height: 40px;
  padding: 0;
  border: 0;
  font-size: var(--bless-text-sm);
  cursor: pointer;
  transition:
    opacity var(--bless-duration-slow) var(--bless-ease-in-out),
    var(--bless-lean-transition);
}
.bless-audio__toggle:hover {
  transform: skewX(var(--bless-skew)) translateY(var(--bless-hover-lift));
  box-shadow: var(--bless-shadow-sm);
}
.bless-audio__toggle:focus-visible {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: 2px;
}
.bless-audio__meta {
  grid-area: meta;
  display: flex;
  flex-direction: column;
  gap: var(--bless-space-1);
  min-width: 0;
}
.bless-audio__title {
  font-weight: var(--bless-font-weight-bold);
  font-size: var(--bless-text-md);
  line-height: var(--bless-leading-none);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.bless-audio__artist {
  font-size: var(--bless-text-xs);
  color: var(--bless-color-text-muted);
}
.bless-audio__time {
  grid-area: time;
  font-size: var(--bless-text-xs);
  font-weight: var(--bless-font-weight-bold);
  letter-spacing: var(--bless-tracking-wide);
  font-variant-numeric: tabular-nums;
}
.bless-audio__bar {
  grid-area: bar;
  position: relative;
  height: 6px;
  background: var(--bless-color-bg);
  cursor: pointer;
  transform: skewX(var(--bless-skew));
}
/* the native range does the work; the skewed bar is what you see */
.bless-audio__seek {
  position: absolute;
  inset: -6px 0;
  width: 100%;
  margin: 0;
  opacity: 0;
  cursor: pointer;
}
.bless-audio__bar:has(.bless-audio__seek:focus-visible) {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: 3px;
}
.bless-audio__fill {
  height: 100%;
  background: var(--_c);
  transition: width var(--bless-duration-fast) linear;
}
.bless-audio__list {
  margin: 0;
  padding: 0;
  list-style: none;
}
.bless-audio__track {
  display: flex;
  align-items: center;
  gap: var(--bless-space-3);
  width: 100%;
  padding: var(--bless-space-3) var(--bless-space-4);
  border: 0;
  border-bottom: var(--bless-border-width) solid var(--bless-color-border);
  background: transparent;
  color: inherit;
  font: inherit;
  font-size: var(--bless-text-sm);
  text-align: start;
  cursor: pointer;
  transition:
    opacity var(--bless-duration-slow) var(--bless-ease-in-out),
    var(--bless-lean-transition);
}
.bless-audio__track:hover {
  background: var(--bless-color-hover);
}
.bless-audio__track:focus-visible {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: -2px;
}
.bless-audio__track--current {
  color: var(--bless-color-accent-text);
  font-weight: var(--bless-font-weight-bold);
}
.bless-audio__num {
  font-size: var(--bless-text-xs);
  color: var(--bless-color-text-muted);
  font-variant-numeric: tabular-nums;
}
.bless-audio__track-title {
  flex: 1;
}
.bless-audio__eq {
  display: inline-flex;
  gap: 2px;
  align-items: flex-end;
  height: 12px;
}
.bless-audio__eq i {
  width: 3px;
  background: var(--_c);
  animation: bless-eq 0.8s var(--bless-ease-in-out) infinite alternate;
}
.bless-audio__eq i:nth-child(2) {
  animation-delay: 0.2s;
}
.bless-audio__eq i:nth-child(3) {
  animation-delay: 0.4s;
}
@keyframes bless-eq {
  from {
    height: 3px;
  }
  to {
    height: 12px;
  }
}
@media (prefers-reduced-motion: reduce) {
  .bless-audio__eq i {
    animation: none;
    height: 8px;
  }
}
</style>
