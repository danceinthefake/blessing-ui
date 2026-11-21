<template>
  <figure class="bless-picto" role="group" :aria-label="label">
    <p class="bless-picto__key">
      <span class="bless-picto__icon" aria-hidden="true"
        ><slot name="icon"
          ><svg viewBox="0 0 16 16">
            <circle cx="8" cy="4.5" r="3" />
            <path d="M2.5 15.5c0-3.6 2.5-6 5.5-6s5.5 2.4 5.5 6Z" /></svg></slot
      ></span>
      {{ text.key(fmt(unit), noun) }}
    </p>
    <ul class="bless-stagger bless-picto__rows">
      <li v-for="r in rows" :key="r.label" class="bless-picto__row" :style="{ '--_c': r.color }">
        <span class="bless-picto__label">{{ r.label }}</span>
        <span class="bless-picto__icons" aria-hidden="true">
          <span
            v-for="(f, i) in r.fills"
            :key="i"
            class="bless-picto__icon is-filled"
            :style="f < 1 ? { '--_f': `${f * 100}%` } : undefined"
            :class="{ 'is-part': f < 1 }"
          >
            <slot name="icon"
              ><svg viewBox="0 0 16 16">
                <circle cx="8" cy="4.5" r="3" />
                <path d="M2.5 15.5c0-3.6 2.5-6 5.5-6s5.5 2.4 5.5 6Z" /></svg
            ></slot>
          </span>
        </span>
        <span class="bless-picto__value">{{ fmt(r.value) }}</span>
      </li>
    </ul>
  </figure>
</template>

<script lang="ts">
export interface BlessPictogramItem {
  label: string;
  value: number;
  color?: string;
}

/** The fill of each icon for a value: whole icons are 1, the last one is the rest (0 to 1). */
export function iconFills(value: number, unit: number): number[] {
  const n = Math.max(0, value) / (unit || 1);
  const whole = Math.floor(n + 1e-9);
  const rest = +(n - whole).toFixed(4);
  return [...Array(whole).fill(1), ...(rest > 0 ? [rest] : [])];
}
</script>

<script setup lang="ts">
import { computed } from "vue";
import { useLabelPack } from "../composables/useLabels";
import { chartColor, numberText } from "./chart";

defineOptions({ name: "BlessPictogram" });
const pack = useLabelPack("BlessPictogram");

const props = withDefaults(
  defineProps<{
    data: BlessPictogramItem[];
    /** what one icon stands for */
    unit: number;
    /** the name of what you count, for example "listeners" */
    noun?: string;
    format?: (v: number) => string;
    /** names the chart for screen readers */
    label?: string;
    labels?: Partial<{ key: (unit: string, noun: string) => string }>;
  }>(),
  { noun: "", label: "Chart" },
);

const text = computed(() => ({
  key: (u: string, n: string) => `One icon = ${u}${n ? ` ${n}` : ""}`,
  ...pack(),
  ...props.labels,
}));
const fmt = computed(() => props.format ?? numberText);
const rows = computed(() =>
  props.data.map((d, i) => ({
    ...d,
    fills: iconFills(d.value, props.unit),
    color: chartColor(d.color, i),
  })),
);
</script>

<style>
.bless-picto {
  margin: 0;
  font-family: var(--bless-font-sans);
  font-size: var(--bless-text-sm);
  color: var(--bless-color-text);
}
.bless-picto__key {
  display: flex;
  align-items: center;
  gap: var(--bless-space-2);
  margin: 0 0 var(--bless-space-3);
  font-size: var(--bless-text-xs);
  color: var(--bless-color-text-muted);
}
.bless-picto__rows {
  display: grid;
  gap: var(--bless-space-3);
  margin: 0;
  padding: 0;
  list-style: none;
}
.bless-picto__row {
  display: grid;
  grid-template-columns: var(--bless-picto-label, 7rem) 1fr auto;
  align-items: center;
  gap: var(--bless-space-3);
}
.bless-picto__icons {
  display: flex;
  flex-wrap: wrap;
  gap: 2px;
}
.bless-picto__icon {
  display: inline-block;
  inline-size: var(--bless-picto-size, 18px);
  block-size: var(--bless-picto-size, 18px);
  color: var(--bless-color-text-muted);
}
.bless-picto__icon svg {
  display: block;
  inline-size: 100%;
  block-size: 100%;
  fill: currentColor;
}
.bless-picto__icon.is-filled {
  color: var(--_c);
}
/* the last icon shows the rest: a part in color, the other part faint */
.bless-picto__icon.is-part {
  -webkit-mask: linear-gradient(to right, #000 var(--_f), #0004 var(--_f));
  mask: linear-gradient(to right, #000 var(--_f), #0004 var(--_f));
}
[dir="rtl"] .bless-picto__icon.is-part {
  -webkit-mask: linear-gradient(to left, #000 var(--_f), #0004 var(--_f));
  mask: linear-gradient(to left, #000 var(--_f), #0004 var(--_f));
}
.bless-picto__value {
  font-weight: var(--bless-font-weight-bold);
  font-variant-numeric: tabular-nums;
}
</style>
