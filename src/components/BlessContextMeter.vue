<script setup lang="ts">
import { computed, ref } from "vue";
import { useLabelPack } from "../composables/useLabels";
import { chartColor } from "./chart";
import BlessPopover from "./BlessPopover.vue";

defineOptions({ name: "BlessContextMeter" });
const pack = useLabelPack("BlessContextMeter");

export interface BlessContextPart {
  /** for example "System", "Chat", or "Files" */
  label: string;
  tokens: number;
  /** a token name or any CSS color; default: the chart colors in order */
  color?: string;
}

const props = withDefaults(
  defineProps<{
    /** the parts of the context that use tokens */
    parts: BlessContextPart[];
    /** the size of the context window, in tokens */
    max: number;
    /** the share at which the ring turns to the warning color */
    warn?: number;
    labels?: Partial<{
      title: string;
      free: string;
      /** the name of the button, with the used tokens, the window, and the share as text */ used: (
        used: string,
        max: string,
        share: string,
      ) => string;
    }>;
  }>(),
  { warn: 0.8 },
);

const text = computed(() => ({
  title: "Context window",
  free: "Free",
  used: (u: string, m: string, s: string) => `${s} of the context used: ${u} of ${m} tokens`,
  ...pack(),
  ...props.labels,
}));
const tokens = new Intl.NumberFormat(undefined, { notation: "compact", maximumFractionDigits: 1 });
const pct = new Intl.NumberFormat(undefined, { style: "percent", maximumFractionDigits: 0 });

const used = computed(() => props.parts.reduce((n, p) => n + Math.max(0, p.tokens), 0));
const share = computed(() => (props.max > 0 ? Math.min(1, used.value / props.max) : 0));
const level = computed(() =>
  share.value >= 0.95 ? "danger" : share.value >= props.warn ? "warning" : "ok",
);
const rows = computed(() =>
  props.parts.map((p, i) => ({
    ...p,
    color: chartColor(p.color, i),
    share: props.max > 0 ? p.tokens / props.max : 0,
  })),
);
const open = ref(false);
const R = 7;
const C = 2 * Math.PI * R;
</script>

<template>
  <BlessPopover v-model:open="open" placement="top" :title="text.title" class="bless-ctx__panel">
    <template #trigger>
      <button
        type="button"
        class="bless-ctx"
        :class="`bless-ctx--${level}`"
        :aria-label="text.used(tokens.format(used), tokens.format(max), pct.format(share))"
        :aria-expanded="open"
      >
        <svg viewBox="0 0 18 18" width="18" height="18" aria-hidden="true">
          <circle class="bless-ctx__track" cx="9" cy="9" :r="R" />
          <circle
            class="bless-ctx__fill"
            cx="9"
            cy="9"
            :r="R"
            :stroke-dasharray="`${share * C} ${C}`"
          />
        </svg>
        <span class="bless-ctx__pct" aria-hidden="true">{{ pct.format(share) }}</span>
      </button>
    </template>
    <div class="bless-ctx__bar" aria-hidden="true">
      <span
        v-for="r in rows"
        :key="r.label"
        :style="{ inlineSize: `${r.share * 100}%`, background: r.color }"
      />
    </div>
    <dl class="bless-ctx__list">
      <div v-for="r in rows" :key="r.label">
        <dt><i :style="{ background: r.color }" aria-hidden="true" />{{ r.label }}</dt>
        <dd>{{ tokens.format(r.tokens) }}</dd>
      </div>
      <div>
        <dt><i class="is-free" aria-hidden="true" />{{ text.free }}</dt>
        <dd>{{ tokens.format(Math.max(0, max - used)) }}</dd>
      </div>
    </dl>
    <p class="bless-ctx__sum">{{ tokens.format(used) }} / {{ tokens.format(max) }}</p>
  </BlessPopover>
</template>

<style>
.bless-ctx {
  display: inline-flex;
  align-items: center;
  gap: var(--bless-space-1);
  padding: var(--bless-space-1) var(--bless-space-2);
  border: 0;
  background: none;
  color: var(--bless-color-text-muted);
  font-family: var(--bless-font-sans);
  font-size: var(--bless-text-xs);
  font-variant-numeric: tabular-nums;
  cursor: pointer;
  --_c: var(--bless-color-text);
}
.bless-ctx:hover {
  color: var(--bless-color-text);
}
.bless-ctx:focus-visible {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: 2px;
}
.bless-ctx--warning {
  --_c: var(--bless-color-warning);
}
.bless-ctx--danger {
  --_c: var(--bless-color-danger);
}
.bless-ctx svg {
  rotate: -90deg;
}
.bless-ctx__track,
.bless-ctx__fill {
  fill: none;
  stroke-width: 3;
}
.bless-ctx__track {
  stroke: var(--bless-color-surface-2);
}
.bless-ctx__fill {
  stroke: var(--_c);
}
.bless-ctx__panel {
  min-inline-size: 15rem;
  font-size: var(--bless-text-sm);
}
.bless-ctx__bar {
  display: flex;
  block-size: 8px;
  margin-block: var(--bless-space-2);
  overflow: hidden;
  background: var(--bless-color-surface-2);
}
.bless-ctx__list {
  display: grid;
  gap: var(--bless-space-1);
  margin: 0;
}
.bless-ctx__list div {
  display: flex;
  justify-content: space-between;
  gap: var(--bless-space-4);
}
.bless-ctx__list dt {
  display: inline-flex;
  align-items: center;
  gap: var(--bless-space-2);
}
.bless-ctx__list i {
  inline-size: 10px;
  block-size: 10px;
}
.bless-ctx__list i.is-free {
  background: var(--bless-color-surface-2);
  outline: 1px solid var(--bless-color-border);
}
.bless-ctx__list dd {
  margin: 0;
  font-variant-numeric: tabular-nums;
}
.bless-ctx__sum {
  margin: var(--bless-space-2) 0 0;
  padding-block-start: var(--bless-space-2);
  border-block-start: var(--bless-border-width) solid var(--bless-color-border);
  font-weight: var(--bless-font-weight-bold);
  font-variant-numeric: tabular-nums;
  text-align: end;
}
</style>
