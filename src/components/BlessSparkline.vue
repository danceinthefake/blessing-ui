<script setup lang="ts">
import { computed } from "vue";

defineOptions({ name: "BlessSparkline" });

const props = withDefaults(
  defineProps<{
    data: number[];
    /** `line`, `bar`, or `winloss` (every value drawn as a same-height win above or loss below the middle) */
    type?: "line" | "bar" | "winloss";
    width?: number;
    height?: number;
    /** a token name (`chart-2`, `success`, `danger`…) or any CSS colour */
    color?: string;
    /** colour of values below zero in `bar` and `winloss` */
    negativeColor?: string;
    /** line only: shade the area under the line */
    fill?: boolean;
    /** line only: a dot on the last value */
    dot?: boolean;
    /** what is plotted; read with the summary by screen readers */
    label?: string;
    /** text for one value in the summary, e.g. `(v) => v + " ms"` */
    format?: (v: number) => string;
  }>(),
  { type: "line", width: 120, height: 28, color: "chart-1", negativeColor: "danger" },
);

const PAD = 2;
const values = computed(() => props.data.filter((v) => Number.isFinite(v)));
const lo = computed(() => Math.min(...values.value, props.type === "line" ? Infinity : 0));
const hi = computed(() => Math.max(...values.value, props.type === "line" ? -Infinity : 0));
const span = computed(() => hi.value - lo.value || 1);
const y = (v: number) =>
  +(props.height - PAD - ((v - lo.value) / span.value) * (props.height - PAD * 2)).toFixed(2);
const colour = (c: string) => (/^[a-z0-9-]+$/i.test(c) ? `var(--bless-color-${c})` : c);

const points = computed(() => {
  const n = values.value.length;
  const w = props.width - PAD * 2;
  return values.value.map((v, i) => ({
    x: +(PAD + (n === 1 ? w / 2 : (i / (n - 1)) * w)).toFixed(2),
    y: y(v),
  }));
});
const line = computed(() => points.value.map((p, i) => `${i ? "L" : "M"}${p.x} ${p.y}`).join(""));
const area = computed(() => {
  const p = points.value;
  return p.length > 1
    ? `${line.value}L${p.at(-1)!.x} ${props.height - PAD}L${p[0]!.x} ${props.height - PAD}Z`
    : "";
});
const last = computed(() => points.value.at(-1));

/** bars grow from the zero line (bar) or from the middle (winloss) */
const bars = computed(() => {
  const n = values.value.length;
  if (!n) return [];
  const slot = (props.width - PAD * 2) / n;
  const w = Math.max(1, slot - Math.min(2, slot * 0.25));
  const mid = props.type === "winloss" ? props.height / 2 : y(0);
  return values.value.map((v, i) => {
    const top =
      props.type === "winloss" ? (v > 0 ? PAD : v < 0 ? mid : mid - 0.5) : Math.min(y(v), mid);
    const h =
      props.type === "winloss"
        ? v === 0
          ? 1
          : props.height / 2 - PAD
        : Math.max(1, Math.abs(y(v) - mid));
    return {
      x: +(PAD + i * slot + (slot - w) / 2).toFixed(2),
      y: +top.toFixed(2),
      w: +w.toFixed(2),
      h: +h.toFixed(2),
      neg: v < 0,
    };
  });
});

const fmt = computed(() => props.format ?? ((v: number) => String(v)));
const summary = computed(() => {
  const v = values.value;
  const name = props.label ?? "Trend";
  if (!v.length) return `${name}: no data`;
  if (props.type === "winloss") {
    const wins = v.filter((x) => x > 0).length;
    const losses = v.filter((x) => x < 0).length;
    return `${name}: ${wins} up, ${losses} down of ${v.length}`;
  }
  return `${name}: ${v.length} values, from ${fmt.value(v[0]!)} to ${fmt.value(v.at(-1)!)}, low ${fmt.value(Math.min(...v))}, high ${fmt.value(Math.max(...v))}`;
});
</script>

<template>
  <svg
    class="bless-sparkline"
    :class="`bless-sparkline--${type}`"
    role="img"
    :aria-label="summary"
    :width
    :height
    :viewBox="`0 0 ${width} ${height}`"
    :style="{ '--_c': colour(color), '--_n': colour(negativeColor) }"
  >
    <template v-if="type === 'line'">
      <path v-if="fill && area" class="bless-sparkline__area" :d="area" />
      <path v-if="points.length > 1" class="bless-sparkline__line" :d="line" />
      <circle
        v-if="(dot || points.length === 1) && last"
        class="bless-sparkline__dot"
        :cx="last.x"
        :cy="last.y"
        r="2.5"
      />
    </template>
    <template v-else>
      <line
        v-if="type === 'winloss'"
        class="bless-sparkline__mid"
        :x1="PAD"
        :x2="width - PAD"
        :y1="height / 2"
        :y2="height / 2"
      />
      <rect
        v-for="(b, i) in bars"
        :key="i"
        class="bless-sparkline__bar"
        :class="{ 'bless-sparkline__bar--neg': b.neg }"
        :x="b.x"
        :y="b.y"
        :width="b.w"
        :height="b.h"
      />
    </template>
  </svg>
</template>

<style>
.bless-sparkline {
  display: inline-block;
  vertical-align: middle;
  overflow: visible;
  color: var(--_c);
}
.bless-sparkline__line {
  fill: none;
  stroke: var(--_c);
  stroke-width: 1.5;
  stroke-linejoin: round;
  stroke-linecap: round;
}
.bless-sparkline__area {
  fill: color-mix(in srgb, var(--_c) 18%, transparent);
}
.bless-sparkline__dot,
.bless-sparkline__bar {
  fill: var(--_c);
}
.bless-sparkline__bar--neg {
  fill: var(--_n);
}
.bless-sparkline__mid {
  stroke: var(--bless-color-border);
  stroke-width: 1;
}
</style>
