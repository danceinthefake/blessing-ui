<template>
  <div class="bless-sla" :class="`is-${state}`">
    <div class="bless-sla__line">
      <span class="bless-sla__label">{{ label }}</span>
      <span class="bless-sla__time">
        <span aria-hidden="true">{{ MARK[state] }}</span> {{ words
        }}<template v-if="state === 'warning'"> · {{ text.atRisk }}</template>
      </span>
    </div>
    <div v-if="!met" class="bless-sla__track" aria-hidden="true">
      <span :style="{ inlineSize: `${share * 100}%` }" />
    </div>
  </div>
</template>

<script lang="ts">
/** Minutes from `now` to `due`; negative when the time is up. */
export function minutesLeft(due: string, now: string | number): number {
  const n = typeof now === "number" ? now : Date.parse(now);
  return Math.floor((Date.parse(due) - n) / 60000);
}
</script>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { useLabelPack } from "../composables/useLabels";

defineOptions({ name: "BlessSlaTimer" });
const pack = useLabelPack("BlessSlaTimer");

const props = withDefaults(
  defineProps<{
    /** what the time limit is for, for example "First reply" */
    label: string;
    /** the deadline, as an ISO date and time */
    due: string;
    /** the length of the whole window in minutes, for the bar */
    window?: number;
    /** below this many minutes, the timer warns */
    warn?: number;
    /** the time now, as an ISO date and time; without it, the clock of the reader after mount */
    now?: string;
    /** the work is done: the timer stops and says so */
    met?: boolean;
    labels?: Partial<{
      left: (time: string) => string;
      over: (time: string) => string;
      met: string;
      atRisk: string;
      time: (h: number, m: number) => string;
    }>;
  }>(),
  { window: 480, warn: 60 },
);

const text = computed(() => ({
  left: (t: string) => `${t} left`,
  over: (t: string) => `Overdue by ${t}`,
  met: "Met",
  atRisk: "At risk",
  time: (h: number, m: number) => (h ? (m ? `${h} h ${m} min` : `${h} h`) : `${m} min`),
  ...pack(),
  ...props.labels,
}));
// the clock of the reader is known only in the browser; it ticks each half minute
const clock = ref<number>();
let timer: ReturnType<typeof setInterval> | undefined;
onMounted(() => {
  if (props.now) return;
  clock.value = Date.now();
  timer = setInterval(() => (clock.value = Date.now()), 30000);
});
onBeforeUnmount(() => timer && clearInterval(timer));
const left = computed(() => {
  const n = props.now ?? clock.value;
  return n === undefined ? undefined : minutesLeft(props.due, n);
});
const state = computed(() =>
  props.met
    ? "met"
    : left.value === undefined
      ? "wait"
      : left.value < 0
        ? "breached"
        : left.value <= props.warn
          ? "warning"
          : "ok",
);
const span = (m: number) => text.value.time(Math.floor(Math.abs(m) / 60), Math.abs(m) % 60);
const words = computed(() => {
  if (props.met) return text.value.met;
  if (left.value === undefined) return "";
  return left.value < 0 ? text.value.over(span(left.value)) : text.value.left(span(left.value));
});
const share = computed(() =>
  left.value === undefined ? 0 : Math.min(1, Math.max(0, left.value / props.window)),
);
const MARK = { ok: "◷", warning: "!", breached: "✕", met: "✓", wait: "◷" } as const;
</script>

<style>
.bless-sla {
  display: grid;
  gap: var(--bless-space-1);
  font-family: var(--bless-font-sans);
  font-size: var(--bless-text-sm);
  color: var(--bless-color-text);
}
.bless-sla__line {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: var(--bless-space-2);
}
.bless-sla__label {
  font-size: var(--bless-text-xs);
  color: var(--bless-color-text-muted);
}
.bless-sla__time {
  font-weight: var(--bless-font-weight-bold);
  font-variant-numeric: tabular-nums;
}
.bless-sla__track {
  block-size: 6px;
  background: var(--bless-color-surface-2);
}
.bless-sla__track span {
  display: block;
  block-size: 100%;
  background: var(--bless-color-text);
}
/* at risk: a striped bar and the words; breached: red with the words */
.bless-sla.is-warning .bless-sla__track span {
  background: repeating-linear-gradient(
    -45deg,
    var(--bless-color-text) 0 5px,
    color-mix(in srgb, var(--bless-color-text) 45%, var(--bless-color-bg)) 5px 10px
  );
}
.bless-sla.is-breached .bless-sla__time {
  color: var(--bless-color-danger-text);
}
.bless-sla.is-breached .bless-sla__track {
  background: var(--bless-color-danger);
}
</style>
