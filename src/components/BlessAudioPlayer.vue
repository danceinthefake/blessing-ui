<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from "vue";
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
    playLabel?: string;
    pauseLabel?: string;
  }>(),
  { color: "accent", playLabel: "Play", pauseLabel: "Pause" },
);

/** index of the current track */
const index = defineModel<number>({ default: 0 });
const emit = defineEmits<{
  play: [track: BlessTrack];
  pause: [track: BlessTrack];
  ended: [track: BlessTrack];
}>();

const audio = ref<HTMLAudioElement>();
const playing = ref(false);
const time = ref(0);
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
  if (a.paused) a.play();
  else a.pause();
}

function select(i: number) {
  if (i === index.value) return toggle();
  index.value = i;
  playing.value = true;
}

function seek(e: MouseEvent) {
  const a = audio.value;
  if (!a || !duration.value) return;
  const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
  a.currentTime = ((e.clientX - r.left) / r.width) * duration.value;
}

function onEnded() {
  emit("ended", current.value);
  if (index.value < props.tracks.length - 1) {
    index.value++;
    playing.value = true;
  } else playing.value = false;
}

// when track changes while playing, load and resume
watch(index, () => {
  time.value = 0;
  duration.value = 0;
  const a = audio.value;
  if (!a) return;
  a.load();
  if (playing.value) a.play().catch(() => (playing.value = false));
});

onBeforeUnmount(() => audio.value?.pause());
</script>

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
      @timeupdate="time = audio!.currentTime"
      @durationchange="duration = audio!.duration"
      @ended="onEnded"
    />

    <div v-if="current" class="bless-audio__now">
      <BlessSkew
        as="button"
        :color="playing ? color : 'text'"
        type="button"
        class="bless-audio__toggle"
        :aria-label="playing ? pauseLabel : playLabel"
        :aria-pressed="playing"
        @click="toggle"
      >
        <span aria-hidden="true">{{ playing ? "❚❚" : "▶" }}</span>
      </BlessSkew>
      <div class="bless-audio__meta">
        <span class="bless-audio__title">{{ current.title }}</span>
        <span v-if="current.artist" class="bless-audio__artist">{{ current.artist }}</span>
      </div>
      <span class="bless-audio__time">{{ fmt(time) }} / {{ fmt(duration) }}</span>
      <div
        class="bless-audio__bar"
        role="progressbar"
        :aria-valuenow="Math.round(progress)"
        aria-valuemin="0"
        aria-valuemax="100"
        @click="seek"
      >
        <div class="bless-audio__fill" :style="{ width: `${progress}%` }" />
      </div>
    </div>

    <ol v-if="tracks.length > 1" class="bless-audio__list">
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

<style>
.bless-audio {
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
  transition: opacity var(--bless-duration-slow) var(--bless-ease-in-out);
}
.bless-audio__toggle:hover {
  opacity: var(--bless-hover-opacity);
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
  height: 6px;
  background: var(--bless-color-bg);
  cursor: pointer;
  transform: skewX(var(--bless-skew));
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
  text-align: left;
  cursor: pointer;
  transition: opacity var(--bless-duration-slow) var(--bless-ease-in-out);
}
.bless-audio__track:hover {
  opacity: var(--bless-hover-opacity);
}
.bless-audio__track:focus-visible {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: -2px;
}
.bless-audio__track--current {
  color: var(--_c);
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
