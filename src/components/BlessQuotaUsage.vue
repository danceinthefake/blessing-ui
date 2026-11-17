<script setup lang="ts">
import { computed } from "vue";
import { useLabelPack } from "../composables/useLabels";

defineOptions({ name: "BlessQuotaUsage" });
const pack = useLabelPack("BlessQuotaUsage");

export interface BlessQuota {
  label: string;
  used: number;
  limit: number;
  /** after the numbers, for example "GB" or "seats" */
  unit?: string;
}

const props = withDefaults(
  defineProps<{
    quotas: BlessQuota[];
    /** the share at which a bar warns */
    warn?: number;
    /** the language of the numbers */
    locale?: string;
    labels?: Partial<{
      of: (used: string, limit: string) => string;
      almost: string;
      full: string;
    }>;
  }>(),
  { warn: 0.8, locale: "en" },
);

const text = computed(() => ({
  of: (u: string, l: string) => `${u} of ${l}`,
  almost: "Almost full",
  full: "Limit reached",
  ...pack(),
  ...props.labels,
}));
const num = computed(() => new Intl.NumberFormat(props.locale, { maximumFractionDigits: 1 }));
const rows = computed(() =>
  props.quotas.map((q) => {
    const share = q.limit > 0 ? q.used / q.limit : 0;
    const level = share >= 1 ? "full" : share >= props.warn ? "almost" : "ok";
    const unit = q.unit ? ` ${q.unit}` : "";
    const of = text.value.of(num.value.format(q.used), `${num.value.format(q.limit)}${unit}`);
    return { ...q, share, level, of, note: level === "ok" ? "" : text.value[level] };
  }),
);
</script>

<template>
  <div class="bless-quota">
    <div v-for="q in rows" :key="q.label" class="bless-quota__row" :class="`is-${q.level}`">
      <div class="bless-quota__head">
        <span class="bless-quota__label">{{ q.label }}</span>
        <span class="bless-quota__of">{{ q.of }}</span>
      </div>
      <div
        class="bless-quota__track"
        role="meter"
        :aria-label="q.label"
        aria-valuemin="0"
        :aria-valuemax="q.limit"
        :aria-valuenow="Math.min(q.used, q.limit)"
        :aria-valuetext="[q.of, q.note].filter(Boolean).join(', ')"
      >
        <span
          class="bless-quota__bar"
          :style="{ inlineSize: `${Math.min(100, q.share * 100)}%` }"
        />
      </div>
      <span v-if="q.note" class="bless-quota__note" aria-hidden="true">{{ q.note }}</span>
    </div>
    <div v-if="$slots.footer" class="bless-quota__footer"><slot name="footer" /></div>
  </div>
</template>

<style>
.bless-quota {
  display: grid;
  gap: var(--bless-space-4);
  font-family: var(--bless-font-sans);
  font-size: var(--bless-text-sm);
  color: var(--bless-color-text);
}
.bless-quota__row {
  display: grid;
  gap: var(--bless-space-1);
}
.bless-quota__head {
  display: flex;
  justify-content: space-between;
  gap: var(--bless-space-3);
}
.bless-quota__label {
  font-weight: var(--bless-font-weight-bold);
}
.bless-quota__of {
  color: var(--bless-color-text-muted);
  font-variant-numeric: tabular-nums;
}
.bless-quota__track {
  block-size: 8px;
  background: var(--bless-color-surface-2);
}
.bless-quota__bar {
  display: block;
  block-size: 100%;
  background: var(--bless-color-accent);
}
.is-almost .bless-quota__bar {
  background: var(--bless-color-warning);
}
.is-full .bless-quota__bar {
  background: var(--bless-color-danger);
}
/* near the end, a word says so, so the color is not the only sign */
.bless-quota__note {
  font-size: var(--bless-text-xs);
  font-weight: var(--bless-font-weight-bold);
}
.is-full .bless-quota__note {
  color: var(--bless-color-danger-text);
}
.bless-quota__footer {
  padding-block-start: var(--bless-space-1);
}
.bless-quota__bar {
  transform-box: fill-box;
  transform-origin: 0 50%;
  --_gx: var(--bless-grow);
  --_gy: 1;
  animation: bless-grow var(--bless-duration-draw) var(--bless-ease-soft) backwards;
}
.bless-quota__bar:dir(rtl) {
  transform-origin: 100% 50%;
}
</style>
