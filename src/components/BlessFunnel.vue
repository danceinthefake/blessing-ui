<script setup lang="ts">
import { computed } from "vue";
import { funnelRows } from "./funnel";
import type { BlessFunnelStage } from "./funnel";

defineOptions({ name: "BlessFunnel" });

const props = withDefaults(
  defineProps<{
    /** the stages from widest to narrowest, for example visits, sign-ups, purchases */
    stages: BlessFunnelStage[];
    /** text for one value, for example `(v) => v.toLocaleString()` */
    format?: (v: number) => string;
    /** a token name (`chart-2`, `success`…) or any CSS color */
    color?: string;
    /** names the funnel for screen readers */
    label?: string;
    /** words for the rates: `ofPrev(n)` and `ofFirst(n)` */
    labels?: Partial<{ ofPrev: (n: string) => string; ofFirst: (n: string) => string }>;
  }>(),
  { color: "chart-1", label: "Funnel" },
);

const fmt = (v: number) => (props.format ?? String)(v);
const text = computed(() => ({
  ofPrev: (n: string) => `${n}% of the step before`,
  ofFirst: (n: string) => `${n}% of the start`,
  ...props.labels,
}));
const rows = computed(() => funnelRows(props.stages));
const colour = computed(() =>
  /^[a-z0-9-]+$/i.test(props.color) ? `var(--bless-color-${props.color})` : props.color,
);
</script>

<template>
  <ol class="bless-funnel" :aria-label="label" :style="{ '--_c': colour }">
    <li v-for="r in rows" :key="r.label" class="bless-funnel__row">
      <span class="bless-funnel__label">{{ r.label }}</span>
      <span class="bless-funnel__track" aria-hidden="true"
        ><span class="bless-funnel__bar" :style="{ inlineSize: `${r.width}%` }"
      /></span>
      <span class="bless-funnel__value">{{ fmt(r.value) }}</span>
      <span class="bless-funnel__rate">{{
        r.ofPrev === null ? text.ofFirst("100") : text.ofPrev(String(r.ofPrev))
      }}</span>
    </li>
  </ol>
</template>

<style>
.bless-funnel {
  display: grid;
  gap: var(--bless-space-3);
  margin: 0;
  padding: 0;
  list-style: none;
  font-family: var(--bless-font-sans);
  color: var(--bless-color-text);
}
.bless-funnel__row {
  display: grid;
  grid-template-columns: minmax(6rem, 1fr) 3fr auto;
  align-items: center;
  gap: var(--bless-space-1) var(--bless-space-3);
}
.bless-funnel__label {
  font-size: var(--bless-text-sm);
  font-weight: var(--bless-font-weight-bold);
  letter-spacing: var(--bless-tracking-wide);
  text-transform: uppercase;
}
.bless-funnel__track {
  display: flex;
  justify-content: center;
  block-size: 24px;
}
.bless-funnel__bar {
  display: block;
  block-size: 100%;
  background: var(--_c);
  transition: inline-size var(--bless-duration-slow) var(--bless-ease-out);
}
.bless-funnel__value {
  font-size: var(--bless-text-lg);
  font-weight: var(--bless-font-weight-thin);
  font-variant-numeric: tabular-nums;
  text-align: end;
}
.bless-funnel__rate {
  grid-column: 2 / -1;
  font-size: var(--bless-text-xs);
  color: var(--bless-color-text-muted);
  font-variant-numeric: tabular-nums;
}
@media (max-width: 480px) {
  .bless-funnel__row {
    grid-template-columns: 1fr auto;
  }
  .bless-funnel__track,
  .bless-funnel__rate {
    grid-column: 1 / -1;
  }
}
</style>
