<script lang="ts">
export type BlessSleepStage = "awake" | "rem" | "light" | "deep";
export interface BlessSleepSpan {
  stage: BlessSleepStage;
  /** HH:MM; a time before the first start is the next day */
  start: string;
  end: string;
}
const toMin = (t: string) => {
  const [h, m] = t.split(":").map(Number) as [number, number];
  return h * 60 + m;
};
/** Minutes from the first start, so a night that crosses midnight stays in order. */
export function sleepSpans(spans: BlessSleepSpan[]) {
  const first = spans[0] ? toMin(spans[0].start) : 0;
  const at = (t: string) => {
    const m = toMin(t);
    return m < first ? m + 1440 - first : m - first;
  };
  return spans.map((s) => {
    const from = at(s.start);
    let to = at(s.end);
    if (to < from) to += 1440;
    return { ...s, from, to };
  });
}
</script>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useLabelPack } from "../composables/useLabels";
import { chartColor, scale, useWidth } from "./chart";

defineOptions({ name: "BlessSleepChart" });
const pack = useLabelPack("BlessSleepChart");

const props = withDefaults(
  defineProps<{
    spans: BlessSleepSpan[];
    height?: number;
    labels?: Partial<
      Record<BlessSleepStage, string> & {
        title: string;
        total: (time: string) => string;
        hours: (h: number, m: number) => string;
      }
    >;
  }>(),
  { height: 180 },
);

const text = computed(() => ({
  title: "Sleep",
  awake: "Awake",
  rem: "REM",
  light: "Light",
  deep: "Deep",
  total: (t: string) => `Asleep ${t}`,
  hours: (h: number, m: number) => (h ? `${h} h ${m} min` : `${m} min`),
  ...pack(),
  ...props.labels,
}));
// awake on top, deep at the bottom, as sleep apps draw it
const ROWS: BlessSleepStage[] = ["awake", "rem", "light", "deep"];
const COLOR: Record<BlessSleepStage, string> = {
  awake: "chart-4",
  rem: "chart-2",
  light: "chart-1",
  deep: "chart-3",
};
const box = ref<HTMLElement>();
const width = useWidth(box);
const PAD = { l: 56, r: 8, t: 8, b: 22 };
const list = computed(() => sleepSpans(props.spans));
const end = computed(() => Math.max(1, ...list.value.map((s) => s.to)));
const x = computed(() => scale([0, end.value], [PAD.l, width.value - PAD.r]));
const rowH = computed(() => (props.height - PAD.t - PAD.b) / ROWS.length);
const y = (s: BlessSleepStage) => PAD.t + ROWS.indexOf(s) * rowH.value;
const dur = (m: number) => text.value.hours(Math.floor(m / 60), Math.round(m % 60));
const totals = computed(() =>
  ROWS.map((s) => ({
    stage: s,
    min: list.value.filter((x) => x.stage === s).reduce((n, x) => n + x.to - x.from, 0),
  })),
);
const asleep = computed(() =>
  totals.value.filter((t) => t.stage !== "awake").reduce((n, t) => n + t.min, 0),
);
// a tick at each full hour of the clock
const ticks = computed(() => {
  const [h, m] = (props.spans[0]?.start ?? "00:00").split(":").map(Number) as [number, number];
  const start = h * 60 + m;
  const out: { at: number; label: string }[] = [];
  for (let k = (60 - (start % 60)) % 60; k <= end.value; k += 60)
    out.push({ at: k, label: `${String(Math.floor((start + k) / 60) % 24).padStart(2, "0")}:00` });
  return out;
});
const summary = computed(
  () =>
    `${text.value.total(dur(asleep.value))}. ${totals.value.map((t) => `${text.value[t.stage]} ${dur(t.min)}`).join(", ")}.`,
);
</script>

<template>
  <figure class="bless-sleep">
    <div ref="box" class="bless-sleep__box">
      <svg :width="width" :height="height" role="img" :aria-label="`${text.title}: ${summary}`">
        <g v-for="s in ROWS" :key="s">
          <line
            :x1="PAD.l"
            :x2="width - PAD.r"
            :y1="y(s) + rowH"
            :y2="y(s) + rowH"
            class="bless-sleep__grid"
          />
          <text :x="PAD.l - 6" :y="y(s) + rowH / 2" class="bless-sleep__row">{{ text[s] }}</text>
        </g>
        <rect
          v-for="(s, i) in list"
          :key="i"
          :x="x(s.from)"
          :y="y(s.stage) + 3"
          :width="Math.max(1, x(s.to) - x(s.from))"
          :height="rowH - 6"
          :fill="chartColor(COLOR[s.stage], 0)"
        />
        <text v-for="t in ticks" :key="t.at" :x="x(t.at)" :y="height - 6" class="bless-sleep__tick">
          {{ t.label }}
        </text>
      </svg>
    </div>
    <figcaption class="bless-sleep__totals">
      <strong>{{ text.total(dur(asleep)) }}</strong>
      <span v-for="t in totals" :key="t.stage" class="bless-sleep__total">
        <span
          class="bless-sleep__key"
          :style="{ background: chartColor(COLOR[t.stage], 0) }"
          aria-hidden="true"
        />
        {{ text[t.stage] }} {{ dur(t.min) }}
      </span>
    </figcaption>
  </figure>
</template>

<style>
.bless-sleep {
  display: grid;
  gap: var(--bless-space-2);
  margin: 0;
  font-family: var(--bless-font-sans);
  color: var(--bless-color-text);
}
.bless-sleep__box {
  inline-size: 100%;
}
.bless-sleep__box svg {
  display: block;
}
.bless-sleep__grid {
  stroke: var(--bless-color-border);
}
.bless-sleep__row,
.bless-sleep__tick {
  fill: var(--bless-color-text);
  font-size: 11px;
  dominant-baseline: middle;
}
.bless-sleep__row {
  text-anchor: end;
}
.bless-sleep__tick {
  text-anchor: middle;
  font-variant-numeric: tabular-nums;
}
.bless-sleep__totals {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--bless-space-1) var(--bless-space-4);
  font-size: var(--bless-text-sm);
}
.bless-sleep__total {
  display: inline-flex;
  align-items: center;
  gap: var(--bless-space-1);
  font-variant-numeric: tabular-nums;
}
.bless-sleep__key {
  inline-size: 0.75rem;
  block-size: 0.75rem;
}
</style>
