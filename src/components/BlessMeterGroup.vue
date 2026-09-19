<script setup lang="ts">
import { computed } from "vue";

defineOptions({ name: "BlessMeterGroup" });

export interface BlessMeterSegment {
  label: string;
  value: number;
  /** token colour name or any CSS colour */
  color?: string;
}

const props = withDefaults(
  defineProps<{
    segments: BlessMeterSegment[];
    max?: number;
    label?: string;
    /** show the legend */
    legend?: boolean;
    format?: (v: number) => string;
    orientation?: "horizontal" | "vertical";
  }>(),
  { label: "Usage", legend: true, orientation: "horizontal" },
);
const palette = ["chart-1", "chart-2", "chart-3", "chart-4", "chart-5"];
const total = computed(() => props.max ?? props.segments.reduce((a, s) => a + s.value, 0));
const col = (s: BlessMeterSegment, i: number) => {
  const c = s.color ?? palette[i % palette.length];
  return /^[a-z0-9-]+$/i.test(c) ? `var(--bless-color-${c})` : c;
};
const pct = (s: BlessMeterSegment) => (total.value ? (s.value / total.value) * 100 : 0);
const fmt = (v: number) => (props.format ?? String)(v);
</script>

<template>
  <div class="bless-metergroup" :class="`bless-metergroup--${orientation}`">
    <div
      class="bless-metergroup__bar"
      role="meter"
      :aria-label="label"
      :aria-valuenow="segments.reduce((a, s) => a + s.value, 0)"
      aria-valuemin="0"
      :aria-valuemax="total"
    >
      <span
        v-for="(s, i) in segments"
        :key="s.label"
        class="bless-metergroup__seg"
        :style="{ '--_p': `${pct(s)}%`, background: col(s, i) }"
        :title="`${s.label}: ${fmt(s.value)}`"
      />
    </div>
    <ul v-if="legend" class="bless-metergroup__legend">
      <li v-for="(s, i) in segments" :key="s.label" :style="{ '--_c': col(s, i) }">
        <slot name="legend" :segment="s" :percent="pct(s)">
          <span class="bless-metergroup__name">{{ s.label }}</span>
          <span class="bless-metergroup__val">{{ fmt(s.value) }} · {{ pct(s).toFixed(0) }}%</span>
        </slot>
      </li>
    </ul>
  </div>
</template>

<style>
.bless-metergroup {
  display: flex;
  flex-direction: column;
  gap: var(--bless-space-2);
  font-family: var(--bless-font-sans);
  color: var(--bless-color-text);
}
.bless-metergroup--vertical {
  flex-direction: row;
  align-items: stretch;
}
.bless-metergroup__bar {
  display: flex;
  height: 10px;
  overflow: hidden;
  background: var(--bless-color-surface);
  transform: skewX(var(--bless-skew));
}
.bless-metergroup--vertical .bless-metergroup__bar {
  flex-direction: column;
  width: 10px;
  height: auto;
  min-height: 120px;
  transform: none;
}
.bless-metergroup__seg {
  flex: 0 0 var(--_p);
  transition: flex-basis var(--bless-duration-slow) var(--bless-ease-out);
}
.bless-metergroup__legend {
  display: flex;
  flex-wrap: wrap;
  gap: var(--bless-space-1) var(--bless-space-4);
  margin: 0;
  padding: 0;
  list-style: none;
  font-size: var(--bless-text-xs);
}
.bless-metergroup--vertical .bless-metergroup__legend {
  flex-direction: column;
}
.bless-metergroup__legend > li {
  display: inline-flex;
  align-items: center;
  gap: var(--bless-space-2);
}
.bless-metergroup__legend > li::before {
  content: "";
  width: 10px;
  height: 10px;
  background: var(--_c);
  transform: skewX(var(--bless-skew));
}
.bless-metergroup__name {
  font-weight: var(--bless-font-weight-bold);
  letter-spacing: var(--bless-tracking-wide);
}
.bless-metergroup__val {
  color: var(--bless-color-text-muted);
}
</style>
