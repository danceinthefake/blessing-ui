<script lang="ts">
export interface BlessVital {
  id: string;
  label: string;
  /** a number, or text such as "120/80" for blood pressure */
  value: number | string;
  unit?: string;
  /** the normal range of a number value, [low, high] */
  normal?: [number, number];
  /** when it was taken, as text */
  time?: string;
}
/** Where a number sits against its normal range. */
export function vitalState(v: BlessVital): "low" | "high" | "normal" | undefined {
  if (typeof v.value !== "number" || !v.normal) return undefined;
  return v.value < v.normal[0] ? "low" : v.value > v.normal[1] ? "high" : "normal";
}
</script>

<script setup lang="ts">
import { computed } from "vue";
import { useLabelPack } from "../composables/useLabels";

defineOptions({ name: "BlessVitalsPanel" });
const pack = useLabelPack("BlessVitalsPanel");

const props = withDefaults(
  defineProps<{
    vitals: BlessVital[];
    locale?: string;
    labels?: Partial<{
      title: string;
      low: string;
      high: string;
      normal: string;
      range: (low: string, high: string) => string;
    }>;
  }>(),
  { locale: "en" },
);

const text = computed(() => ({
  title: "Vital signs",
  low: "Low",
  high: "High",
  normal: "Normal",
  range: (l: string, h: string) => `normal ${l}–${h}`,
  ...pack(),
  ...props.labels,
}));
const num = computed(() => new Intl.NumberFormat(props.locale, { maximumFractionDigits: 1 }));
const show = (v: number | string) => (typeof v === "number" ? num.value.format(v) : v);
// the bar spans the normal range with a quarter of its width on each side
function place(v: BlessVital) {
  if (typeof v.value !== "number" || !v.normal) return undefined;
  const [lo, hi] = v.normal;
  const pad = (hi - lo) / 2;
  const min = lo - pad;
  const max = hi + pad;
  const at = (n: number) => Math.min(100, Math.max(0, ((n - min) / (max - min)) * 100));
  return { from: at(lo), to: at(hi), value: at(v.value) };
}
const MARK = { low: "▼", high: "▲", normal: "✓" } as const;
</script>

<template>
  <section class="bless-vitals" :aria-label="text.title">
    <ul class="bless-vitals__grid">
      <li
        v-for="v in vitals"
        :key="v.id"
        class="bless-vitals__card"
        :class="vitalState(v) && `is-${vitalState(v)}`"
      >
        <span class="bless-vitals__label">{{ v.label }}</span>
        <span class="bless-vitals__value">
          {{ show(v.value)
          }}<template v-if="v.unit"
            >{{ " " }}<span class="bless-vitals__unit">{{ v.unit }}</span></template
          >
        </span>
        <span v-if="vitalState(v)" class="bless-vitals__state">
          <span aria-hidden="true">{{ MARK[vitalState(v)!] }}</span> {{ text[vitalState(v)!] }}
        </span>
        <span v-if="place(v)" class="bless-vitals__bar" aria-hidden="true">
          <span
            class="bless-vitals__band"
            :style="{
              insetInlineStart: `${place(v)!.from}%`,
              inlineSize: `${place(v)!.to - place(v)!.from}%`,
            }"
          />
          <span class="bless-vitals__dot" :style="{ insetInlineStart: `${place(v)!.value}%` }" />
        </span>
        <span class="bless-vitals__meta">
          <template v-if="v.normal">{{
            text.range(num.format(v.normal[0]), num.format(v.normal[1]))
          }}</template
          ><template v-if="v.normal && v.time"> · </template>{{ v.time }}
        </span>
      </li>
    </ul>
  </section>
</template>

<style>
.bless-vitals {
  font-family: var(--bless-font-sans);
  font-size: var(--bless-text-sm);
  color: var(--bless-color-text);
}
.bless-vitals__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(11rem, 1fr));
  gap: var(--bless-space-3);
  margin: 0;
  padding: 0;
  list-style: none;
}
.bless-vitals__card {
  display: grid;
  align-content: start;
  gap: var(--bless-space-1);
  border: var(--bless-border-width) solid var(--bless-color-border);
}
/* the space sits on the children, so a list reset of the host page keeps it */
.bless-vitals__card > * {
  margin-inline: var(--bless-space-3);
}
.bless-vitals__card > :first-child {
  margin-block-start: var(--bless-space-3);
}
.bless-vitals__card > :last-child {
  margin-block-end: var(--bless-space-3);
}
/* out of range: a thick edge, a mark, and a word; the color only repeats them */
.bless-vitals__card.is-low,
.bless-vitals__card.is-high {
  border: 2px solid var(--bless-color-danger);
}
.bless-vitals__label {
  font-size: var(--bless-text-xs);
  color: var(--bless-color-text-muted);
}
.bless-vitals__value {
  font-size: var(--bless-text-xl);
  font-weight: var(--bless-font-weight-bold);
  font-variant-numeric: tabular-nums;
  line-height: var(--bless-leading-tight);
}
.bless-vitals__unit {
  font-size: var(--bless-text-sm);
  font-weight: var(--bless-font-weight-normal);
  color: var(--bless-color-text-muted);
}
.bless-vitals__state {
  font-size: var(--bless-text-xs);
  font-weight: var(--bless-font-weight-bold);
}
.is-low .bless-vitals__state,
.is-high .bless-vitals__state {
  color: var(--bless-color-danger-text);
}
.bless-vitals__bar {
  position: relative;
  block-size: 6px;
  margin-block: var(--bless-space-1);
  background: var(--bless-color-surface-2);
}
.bless-vitals__band {
  position: absolute;
  inset-block: 0;
  background: color-mix(in srgb, var(--bless-color-success) 45%, var(--bless-color-surface-2));
}
.bless-vitals__dot {
  position: absolute;
  inset-block-start: -4px;
  inline-size: 4px;
  block-size: 14px;
  margin-inline-start: -2px;
  background: var(--bless-color-text);
}
.bless-vitals__meta {
  font-size: var(--bless-text-xs);
  color: var(--bless-color-text-muted);
}
</style>
