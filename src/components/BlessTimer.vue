<script lang="ts">
export interface BlessTimerPhase {
  label: string;
  seconds: number;
}
</script>

<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from "vue";
import BlessButton from "./BlessButton.vue";

defineOptions({ name: "BlessTimer" });

const props = withDefaults(
  defineProps<{
    /** `countdown` from `duration`, `stopwatch` up from 0, `interval` through `phases` */
    mode?: "countdown" | "stopwatch" | "interval";
    /** seconds, for a countdown */
    duration?: number;
    /** for `interval`: e.g. `[{ label: "Work", seconds: 25 }, { label: "Rest", seconds: 5 }]` */
    phases?: BlessTimerPhase[];
    /** how many times the phases repeat */
    rounds?: number;
    autostart?: boolean;
    /** show Start / Pause / Reset */
    controls?: boolean;
    label?: string;
    /** button text and the wording said when a phase changes or the time is up */
    labels?: Partial<{
      start: string;
      resume: string;
      pause: string;
      reset: string;
      finished: string;
      round: (round: number, rounds: number) => string;
    }>;
  }>(),
  { mode: "countdown", duration: 60, rounds: 1, controls: true, label: "Timer" },
);
const text = computed(() => ({
  start: "Start",
  resume: "Resume",
  pause: "Pause",
  reset: "Reset",
  finished: "Finished",
  round: (r: number, n: number) => `round ${r} of ${n}`,
  ...props.labels,
}));
const running = defineModel<boolean>("running", { default: false });
const emit = defineEmits<{
  finish: [];
  phase: [phase: BlessTimerPhase, index: number, round: number];
}>();

const elapsed = ref(0); // ms
const finished = ref(false);
const live = ref("");
let base = 0;
let t0 = 0;
let timer: ReturnType<typeof setInterval> | undefined;

const plan = computed<BlessTimerPhase[]>(() =>
  props.mode === "interval" ? (props.phases ?? []) : [{ label: "", seconds: props.duration }],
);
const rounds = computed(() => (props.mode === "interval" ? props.rounds : 1));
const lap = computed(() => plan.value.reduce((a, p) => a + p.seconds, 0) * 1000);
const total = computed(() => lap.value * rounds.value);

/** where the clock is: phase, round and the milliseconds left in that phase */
const at = computed(() => {
  if (props.mode === "stopwatch") return { i: 0, round: 1, left: elapsed.value };
  const e = Math.min(elapsed.value, total.value);
  const inLap = lap.value ? (e >= total.value ? lap.value : e % lap.value) : 0;
  const round = Math.min(rounds.value, Math.floor(e / (lap.value || 1)) + 1);
  let acc = 0;
  for (let i = 0; i < plan.value.length; i++) {
    const ms = plan.value[i]!.seconds * 1000;
    if (inLap < acc + ms || i === plan.value.length - 1)
      return {
        i,
        round: e >= total.value ? rounds.value : round,
        left: Math.max(0, acc + ms - inLap),
      };
    acc += ms;
  }
  return { i: 0, round: 1, left: 0 };
});
const pad = (n: number) => String(n).padStart(2, "0");
const clock = (ms: number, up: boolean) => {
  const s = up ? Math.floor(ms / 1000) : Math.ceil(ms / 1000);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  return `${h ? `${h}:${pad(m)}` : pad(m)}:${pad(s % 60)}`;
};
const display = computed(() => clock(at.value.left, props.mode === "stopwatch"));
const phase = computed(() => (props.mode === "interval" ? plan.value[at.value.i] : undefined));
const sub = computed(() =>
  phase.value ? `${phase.value.label} · ${text.value.round(at.value.round, rounds.value)}` : "",
);

function tick() {
  elapsed.value = base + (performance.now() - t0);
  if (props.mode !== "stopwatch" && elapsed.value >= total.value) {
    elapsed.value = total.value;
    stop();
    finished.value = true;
    running.value = false;
    live.value = text.value.finished;
    emit("finish");
  }
}
function stop() {
  clearInterval(timer);
  timer = undefined;
}
function begin() {
  if (timer || (props.mode !== "stopwatch" && !total.value)) return;
  if (finished.value) reset();
  base = elapsed.value;
  t0 = performance.now();
  timer = setInterval(tick, 100);
}
function start() {
  running.value = true;
}
function pause() {
  running.value = false;
}
function reset() {
  stop();
  elapsed.value = 0;
  base = 0;
  finished.value = false;
  live.value = "";
  if (running.value) begin();
}
watch(
  running,
  (r) => {
    if (r) begin();
    else if (timer) (tick(), stop());
  },
  { immediate: false },
);
if (props.autostart) running.value = true;
watch(
  () => [props.mode, props.duration, props.phases, props.rounds],
  () => reset(),
);
// announce phase changes
watch(
  () => `${at.value.i}:${at.value.round}`,
  (_, old) => {
    const p = plan.value[at.value.i];
    if (old === undefined || !p || props.mode !== "interval" || !running.value) return;
    live.value = `${p.label}, ${text.value.round(at.value.round, rounds.value)}`;
    emit("phase", p, at.value.i, at.value.round);
  },
);
onBeforeUnmount(stop);
defineExpose({ start, pause, reset, toggle: () => (running.value = !running.value) });
</script>

<template>
  <div
    class="bless-timer"
    :class="{ 'bless-timer--done': finished }"
    role="timer"
    :aria-label="label"
  >
    <span v-if="sub" class="bless-timer__phase">{{ sub }}</span>
    <span class="bless-timer__clock">{{ display }}</span>
    <span v-if="controls" class="bless-timer__controls">
      <BlessButton v-if="!running" @click="start">{{
        elapsed && !finished ? text.resume : text.start
      }}</BlessButton>
      <BlessButton v-else variant="outline" @click="pause">{{ text.pause }}</BlessButton>
      <BlessButton variant="ghost" :disabled="!elapsed" @click="reset">{{
        text.reset
      }}</BlessButton>
    </span>
    <span class="bless-timer__live" aria-live="polite">{{ live }}</span>
  </div>
</template>

<style>
.bless-timer {
  position: relative;
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  gap: var(--bless-space-2);
  font-family: var(--bless-font-sans);
  color: var(--bless-color-text);
}
.bless-timer__clock {
  font-size: calc(var(--bless-text-xl) * 1.6);
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  line-height: 1;
}
.bless-timer__phase {
  font-size: var(--bless-text-sm);
  color: var(--bless-color-text-muted);
}
.bless-timer--done .bless-timer__clock {
  color: var(--bless-color-danger-text);
}
.bless-timer__controls {
  display: inline-flex;
  gap: var(--bless-space-2);
}
.bless-timer__live {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip-path: inset(50%);
}
</style>
