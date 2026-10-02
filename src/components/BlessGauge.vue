<script lang="ts">
export interface BlessGaugeZone {
  /** the zone runs up to this value; zones are sorted by it */
  to: number;
  /** a token name (`success`, `warning`, `danger`, `chart-1`…) or any CSS colour */
  color?: string;
  /** said after the value when the needle is in this zone: "Normal", "Too hot" */
  label?: string;
}
</script>

<script setup lang="ts">
import { computed } from "vue";

defineOptions({ name: "BlessGauge" });

const props = withDefaults(
  defineProps<{
    value: number;
    min?: number;
    max?: number;
    zones?: BlessGaugeZone[];
    variant?: "arc" | "linear";
    /** what is measured: names the meter for screen readers and shows under the number */
    label?: string;
    /** text for the value, e.g. `(v) => v + " °C"` */
    format?: (v: number) => string;
  }>(),
  { min: 0, max: 100, variant: "arc", label: "Gauge" },
);

const span = computed(() => props.max - props.min || 1);
/** 0..1 along the scale */
const frac = (v: number) => Math.min(1, Math.max(0, (v - props.min) / span.value));
const t = computed(() => frac(props.value));
const text = computed(() => (props.format ?? String)(props.value));
const color = (c?: string) =>
  !c ? "currentColor" : /^[a-z0-9-]+$/i.test(c) ? `var(--bless-color-${c})` : c;

const bands = computed(() => {
  const zs = [...(props.zones ?? [])].sort((a, b) => a.to - b.to);
  let from = 0;
  return zs.map((z) => {
    const to = frac(z.to);
    const band = { from, to, color: color(z.color) };
    from = to;
    return band;
  });
});
const zone = computed(() => {
  const zs = [...(props.zones ?? [])].sort((a, b) => a.to - b.to);
  return zs.find((z) => props.value <= z.to) ?? zs.at(-1);
});

// arc geometry: a half circle, left (0) over the top to right (1)
const CX = 100;
const CY = 100;
const R = 80;
const pt = (f: number, r = R) => ({
  x: +(CX - r * Math.cos(f * Math.PI)).toFixed(2),
  y: +(CY - r * Math.sin(f * Math.PI)).toFixed(2),
});
const arc = (a: number, b: number) => {
  const p = pt(a);
  const q = pt(b);
  return `M${p.x} ${p.y}A${R} ${R} 0 0 1 ${q.x} ${q.y}`;
};
const needle = computed(() => ({ a: pt(t.value, R - 22), b: pt(t.value, R + 10) }));
</script>

<template>
  <div
    class="bless-gauge"
    :class="`bless-gauge--${variant}`"
    role="meter"
    :aria-label="label"
    :aria-valuemin="min"
    :aria-valuemax="max"
    :aria-valuenow="Math.min(max, Math.max(min, value))"
    :aria-valuetext="zone?.label ? `${text}, ${zone.label}` : text"
  >
    <svg v-if="variant === 'arc'" class="bless-gauge__svg" viewBox="0 0 200 118" aria-hidden="true">
      <path class="bless-gauge__track" :d="arc(0, 1)" />
      <path
        v-for="(b, i) in bands"
        :key="i"
        class="bless-gauge__band"
        :d="arc(b.from, b.to)"
        :style="{ stroke: b.color }"
      />
      <line
        class="bless-gauge__needle"
        :x1="needle.a.x"
        :y1="needle.a.y"
        :x2="needle.b.x"
        :y2="needle.b.y"
      />
    </svg>
    <div v-else class="bless-gauge__bar" aria-hidden="true">
      <span
        v-for="(b, i) in bands"
        :key="i"
        class="bless-gauge__seg"
        :style="{
          left: `${b.from * 100}%`,
          width: `${(b.to - b.from) * 100}%`,
          background: b.color,
        }"
      ></span>
      <span class="bless-gauge__mark" :style="{ left: `${t * 100}%` }"></span>
    </div>
    <div class="bless-gauge__read">
      <strong class="bless-gauge__value">{{ text }}</strong>
      <span class="bless-gauge__label">{{ label }}</span>
    </div>
  </div>
</template>

<style>
.bless-gauge {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  gap: var(--bless-space-1);
  width: 100%;
  max-width: 240px;
  font-family: var(--bless-font-sans);
  color: var(--bless-color-text);
}
.bless-gauge--linear {
  align-items: stretch;
  max-width: 320px;
}
.bless-gauge__svg {
  width: 100%;
  height: auto;
  overflow: visible;
}
.bless-gauge__track,
.bless-gauge__band {
  fill: none;
  stroke-width: 14;
}
.bless-gauge__track {
  stroke: var(--bless-color-border);
}
.bless-gauge__band {
  opacity: 0.85;
}
.bless-gauge__needle {
  stroke: var(--bless-color-text);
  stroke-width: 5;
  stroke-linecap: butt;
}
.bless-gauge__bar {
  position: relative;
  height: 14px;
  background: var(--bless-color-border);
}
.bless-gauge__seg {
  position: absolute;
  inset-block: 0;
  opacity: 0.85;
}
.bless-gauge__mark {
  position: absolute;
  inset-block: -4px;
  width: 4px;
  translate: -50% 0;
  background: var(--bless-color-text);
  outline: 1px solid var(--bless-color-bg);
}
.bless-gauge__read {
  display: flex;
  flex-direction: column;
  align-items: center;
  line-height: 1.2;
}
.bless-gauge--arc .bless-gauge__read {
  margin-top: calc(var(--bless-space-8) * -1);
}
.bless-gauge__value {
  font-size: var(--bless-text-xl);
  font-variant-numeric: tabular-nums;
}
.bless-gauge__label {
  font-size: var(--bless-text-xs);
  color: var(--bless-color-text-muted);
}
</style>
