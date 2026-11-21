<template>
  <BlessBanner class="bless-countdown" v-bind="$attrs">
    <span class="bless-countdown__title">{{ title }}</span>
    <span v-if="live" class="bless-countdown__live">{{ text.live }}</span>
    <template v-else>
      <span class="bless-countdown__in" aria-hidden="true">{{ text.startsIn }}</span>
      <span class="bless-countdown__clock" aria-hidden="true">
        <template v-if="parts">
          <span v-for="(p, i) in parts" :key="i" class="bless-countdown__part">
            <b>{{ String(p.v).padStart(2, "0") }}</b>{{ p.u }}
          </span>
        </template>
        <span v-else class="bless-countdown__part"><b>--</b></span>
      </span>
      <!-- the date is in the zone of the reader, so it shows after mount with the clock -->
      <span v-if="parts" class="bless-sr">{{ text.startsAt(when) }}</span>
    </template>
    <template v-if="$slots.action" #action><slot name="action" /></template>
  </BlessBanner>
</template>

<script lang="ts">
/** Whole days, hours, minutes, and seconds in a span of milliseconds; a span in the past is all zero. */
export function splitSpan(ms: number): { d: number; h: number; m: number; s: number } {
  const t = Math.max(0, Math.floor(ms / 1000));
  return {
    d: Math.floor(t / 86400),
    h: Math.floor((t % 86400) / 3600),
    m: Math.floor((t % 3600) / 60),
    s: t % 60,
  };
}
</script>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { useLabelPack } from "../composables/useLabels";
import BlessBanner from "./BlessBanner.vue";
import "./sr.css";

defineOptions({ name: "BlessCountdownBanner", inheritAttrs: false });
const pack = useLabelPack("BlessCountdownBanner");

const props = withDefaults(
  defineProps<{
    /** the start of the event: a Date, a timestamp in ms, or a date string */
    to: Date | number | string;
    /** what starts, for example "Live recording of episode 50" */
    title: string;
    /** the language of the date for screen readers */
    locale?: string;
    /** a fixed "now", for example in a test; with it the clock does not run */
    now?: Date | number;
    labels?: Partial<{
      startsIn: string;
      live: string;
      startsAt: (date: string) => string;
      days: string;
      hours: string;
      minutes: string;
      seconds: string;
    }>;
  }>(),
  { locale: "en" },
);
const emit = defineEmits<{ start: [] }>();

const text = computed(() => ({
  startsIn: "Starts in",
  live: "Live now",
  startsAt: (d: string) => `Starts ${d}`,
  days: "d",
  hours: "h",
  minutes: "m",
  seconds: "s",
  ...pack(),
  ...props.labels,
}));
const target = computed(() => +new Date(props.to));
// "now" is known only in the browser, so the clock runs after mount, or not at all with a fixed `now`
const ms = ref<number>();
let timer: ReturnType<typeof setInterval> | undefined;
onMounted(() => {
  if (props.now !== undefined) return;
  ms.value = Date.now();
  timer = setInterval(() => {
    const was = ms.value! < target.value;
    ms.value = Date.now();
    if (was && ms.value >= target.value) emit("start");
  }, 1000);
});
onBeforeUnmount(() => clearInterval(timer));
const at = computed(() => (props.now !== undefined ? +props.now : ms.value));
const live = computed(() => at.value !== undefined && at.value >= target.value);
const parts = computed(() => {
  if (at.value === undefined) return undefined;
  const p = splitSpan(target.value - at.value);
  return [
    { v: p.d, u: text.value.days },
    { v: p.h, u: text.value.hours },
    { v: p.m, u: text.value.minutes },
    { v: p.s, u: text.value.seconds },
  ].filter((x, i) => i > 0 || x.v > 0);
});
const when = computed(() =>
  new Intl.DateTimeFormat(props.locale, { dateStyle: "full", timeStyle: "short" }).format(
    target.value,
  ),
);
</script>

<style>
.bless-countdown .bless-banner__body {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--bless-space-1) var(--bless-space-3);
}
.bless-countdown__title {
  font-weight: var(--bless-font-weight-bold);
}
.bless-countdown__clock {
  display: inline-flex;
  gap: var(--bless-space-2);
  font-variant-numeric: tabular-nums;
}
.bless-countdown__part b {
  margin-inline-end: 1px;
  font-size: 1.15em;
}
/* live: a word and a dot, so the change does not rest on color */
.bless-countdown__live {
  display: inline-flex;
  align-items: center;
  gap: var(--bless-space-1);
  font-weight: var(--bless-font-weight-bold);
  text-transform: uppercase;
  letter-spacing: var(--bless-tracking-wide);
}
.bless-countdown__live::before {
  content: "";
  inline-size: 8px;
  block-size: 8px;
  border-radius: 50%;
  background: currentColor;
}
</style>
