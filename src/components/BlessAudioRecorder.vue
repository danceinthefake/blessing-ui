<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from "vue";
import { micLevel } from "../composables/micLevel";
import { useLabelPack } from "../composables/useLabels";
import BlessButton from "./BlessButton.vue";

defineOptions({ name: "BlessAudioRecorder" });
const pack = useLabelPack("BlessAudioRecorder");

const props = withDefaults(
  defineProps<{
    /** stop by itself after this many seconds */
    maxDuration?: number;
    /** a type for MediaRecorder, for example `audio/webm`; used when the browser supports it */
    mimeType?: string;
    /** level bars drawn while recording */
    bars?: number;
    labels?: Partial<{
      record: string;
      pause: string;
      resume: string;
      stop: string;
      again: string;
      recording: string;
      paused: string;
      done: string;
      unavailable: string;
    }>;
  }>(),
  { bars: 40 },
);
const emit = defineEmits<{
  /** the recording, when it stops */
  record: [audio: Blob];
  /** no microphone, no permission, or no MediaRecorder */
  error: [error: unknown];
}>();

const text = computed(() => ({
  record: "Record",
  pause: "Pause",
  resume: "Resume",
  stop: "Stop",
  again: "Record again",
  recording: "Recording",
  paused: "Paused",
  done: "Recorded",
  unavailable: "The microphone is not available",
  ...pack(),
  ...props.labels,
}));

type State = "idle" | "recording" | "paused" | "done" | "unavailable";
const state = ref<State>("idle");
const ms = ref(0);
const levels = ref<number[]>([]);
const url = ref<string>();

let stream: MediaStream | undefined;
let rec: MediaRecorder | undefined;
let stopMeter = () => {};
let tick: ReturnType<typeof setInterval> | undefined;
let last = 0;

function release() {
  clearInterval(tick);
  stopMeter();
  stream?.getTracks().forEach((t) => t.stop());
  stream = undefined;
}
// draw the loudness of the last moment as a bar, while recording
function meter(s: MediaStream) {
  stopMeter = micLevel(s, (l) => {
    if (state.value === "recording") levels.value = [...levels.value, l].slice(-props.bars);
  });
}

async function start() {
  try {
    stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const type =
      props.mimeType && MediaRecorder.isTypeSupported?.(props.mimeType)
        ? props.mimeType
        : undefined;
    rec = new MediaRecorder(stream, type ? { mimeType: type } : undefined);
  } catch (e) {
    release();
    state.value = "unavailable";
    emit("error", e);
    return;
  }
  const chunks: Blob[] = [];
  rec.ondataavailable = (e) => e.data.size && chunks.push(e.data);
  rec.onstop = () => {
    const blob = new Blob(chunks, { type: rec?.mimeType || chunks[0]?.type });
    url.value = URL.createObjectURL(blob);
    state.value = "done";
    emit("record", blob);
  };
  levels.value = [];
  ms.value = 0;
  rec.start();
  state.value = "recording";
  meter(stream);
  last = Date.now();
  tick = setInterval(() => {
    const now = Date.now();
    if (state.value === "recording") ms.value += now - last;
    last = now;
    if (props.maxDuration && ms.value >= props.maxDuration * 1000) stop();
  }, 200);
}
function pause() {
  rec?.pause();
  state.value = "paused";
}
function resume() {
  rec?.resume();
  last = Date.now();
  state.value = "recording";
}
function stop() {
  release();
  rec?.stop();
}
function again() {
  if (url.value) URL.revokeObjectURL(url.value);
  url.value = undefined;
  void start();
}
onBeforeUnmount(() => {
  if (rec && rec.state !== "inactive") {
    rec.onstop = null;
    rec.stop();
  }
  release();
  if (url.value) URL.revokeObjectURL(url.value);
});

const clock = computed(() => {
  const s = Math.floor(ms.value / 1000);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
});
const status = computed(() =>
  state.value === "recording"
    ? text.value.recording
    : state.value === "paused"
      ? text.value.paused
      : state.value === "done"
        ? `${text.value.done} ${clock.value}`
        : state.value === "unavailable"
          ? text.value.unavailable
          : "",
);
</script>

<template>
  <div class="bless-rec" :class="`bless-rec--${state}`">
    <div class="bless-rec__controls">
      <BlessButton v-if="state === 'idle' || state === 'unavailable'" @click="start">
        <span class="bless-rec__dot" aria-hidden="true" />{{ text.record }}
      </BlessButton>
      <template v-else-if="state === 'recording' || state === 'paused'">
        <BlessButton v-if="state === 'recording'" variant="outline" @click="pause">
          {{ text.pause }}
        </BlessButton>
        <BlessButton v-else variant="outline" @click="resume">{{ text.resume }}</BlessButton>
        <BlessButton @click="stop">{{ text.stop }}</BlessButton>
      </template>
      <BlessButton v-else variant="outline" @click="again">{{ text.again }}</BlessButton>
      <span v-if="state !== 'idle' && state !== 'unavailable'" class="bless-rec__clock">
        {{ clock }}
      </span>
    </div>
    <div
      v-if="state === 'recording' || state === 'paused'"
      class="bless-rec__levels"
      aria-hidden="true"
    >
      <span
        v-for="(l, i) in levels"
        :key="i"
        class="bless-rec__bar"
        :style="{ blockSize: `${Math.max(6, l * 100)}%` }"
      />
    </div>
    <audio v-if="url" class="bless-rec__audio" :src="url" controls />
    <p class="bless-rec__status" role="status">{{ status }}</p>
  </div>
</template>

<style>
.bless-rec {
  display: grid;
  gap: var(--bless-space-2);
  font-family: var(--bless-font-sans);
  color: var(--bless-color-text);
}
.bless-rec__controls {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--bless-space-2);
}
.bless-rec__dot {
  display: inline-block;
  inline-size: 8px;
  block-size: 8px;
  margin-inline-end: var(--bless-space-2);
  background: var(--bless-color-danger);
}
.bless-rec__clock {
  font-size: var(--bless-text-lg);
  font-weight: var(--bless-font-weight-thin);
  font-variant-numeric: tabular-nums;
}
.bless-rec__levels {
  display: flex;
  align-items: center;
  gap: 2px;
  block-size: 40px;
}
.bless-rec__bar {
  flex: 0 0 3px;
  background: var(--bless-color-accent);
}
.bless-rec--paused .bless-rec__bar {
  background: var(--bless-color-text-muted);
}
.bless-rec__audio {
  inline-size: 100%;
  max-inline-size: 28rem;
}
.bless-rec__status {
  margin: 0;
  min-block-size: 1.25em;
  font-size: var(--bless-text-sm);
  color: var(--bless-color-text-muted);
}
.bless-rec--unavailable .bless-rec__status {
  color: var(--bless-color-danger-text);
}
</style>
