<script setup lang="ts">
import { computed } from "vue";
import { useLabelPack } from "../composables/useLabels";

defineOptions({ name: "BlessBudgetBars" });
const pack = useLabelPack("BlessBudgetBars");

export interface BlessBudget {
  name: string;
  spent: number;
  budget: number;
}

const props = withDefaults(
  defineProps<{
    budgets: BlessBudget[];
    currency?: string;
    locale?: string;
    labels?: Partial<{
      title: string;
      of: (spent: string, budget: string) => string;
      left: (amount: string) => string;
      over: (amount: string) => string;
      total: string;
    }>;
  }>(),
  { currency: "USD", locale: "en" },
);

const text = computed(() => ({
  title: "Budget",
  of: (s: string, b: string) => `${s} of ${b}`,
  left: (a: string) => `${a} left`,
  over: (a: string) => `${a} over`,
  total: "Total",
  ...pack(),
  ...props.labels,
}));
const money = computed(
  () =>
    new Intl.NumberFormat(props.locale, {
      style: "currency",
      currency: props.currency,
      maximumFractionDigits: 0,
    }),
);
const rows = computed(() => {
  const all = [
    ...props.budgets,
    {
      name: text.value.total,
      spent: props.budgets.reduce((n, b) => n + b.spent, 0),
      budget: props.budgets.reduce((n, b) => n + b.budget, 0),
    },
  ];
  return all.map((b) => {
    const rest = b.budget - b.spent;
    return {
      ...b,
      over: rest < 0,
      share: b.budget > 0 ? Math.min(1, b.spent / b.budget) : 1,
      rest:
        rest < 0
          ? text.value.over(money.value.format(-rest))
          : text.value.left(money.value.format(rest)),
    };
  });
});
</script>

<template>
  <section class="bless-budget" :aria-label="text.title">
    <div
      v-for="(r, i) in rows"
      :key="r.name"
      class="bless-budget__row"
      :class="{ 'is-over': r.over, 'is-total': i === rows.length - 1 }"
    >
      <div class="bless-budget__line">
        <span class="bless-budget__name">{{ r.name }}</span>
        <span class="bless-budget__nums">{{
          text.of(money.format(r.spent), money.format(r.budget))
        }}</span>
      </div>
      <div class="bless-budget__track" aria-hidden="true">
        <div class="bless-budget__fill" :style="{ inlineSize: `${r.share * 100}%` }" />
      </div>
      <span class="bless-budget__rest">{{ r.rest }}</span>
    </div>
  </section>
</template>

<style>
.bless-budget {
  display: grid;
  gap: var(--bless-space-3);
  font-family: var(--bless-font-sans);
  font-size: var(--bless-text-sm);
  color: var(--bless-color-text);
}
.bless-budget__row {
  display: grid;
  gap: var(--bless-space-1);
}
.bless-budget__row.is-total {
  padding-block-start: var(--bless-space-3);
  border-block-start: var(--bless-border-width) solid var(--bless-color-border);
  font-weight: var(--bless-font-weight-bold);
}
.bless-budget__line {
  display: flex;
  justify-content: space-between;
  gap: var(--bless-space-2);
}
.bless-budget__nums,
.bless-budget__rest {
  font-variant-numeric: tabular-nums;
}
.bless-budget__rest {
  font-size: var(--bless-text-xs);
  color: var(--bless-color-text-muted);
}
.bless-budget__track {
  block-size: 0.5rem;
  background: var(--bless-color-surface-2);
}
.bless-budget__fill {
  block-size: 100%;
  background: var(--bless-color-accent);
}
/* over the budget, the bar is striped and the line says "over"; the color only repeats it */
.is-over .bless-budget__fill {
  background: repeating-linear-gradient(
    -45deg,
    var(--bless-color-danger) 0 6px,
    color-mix(in srgb, var(--bless-color-danger) 60%, var(--bless-color-bg)) 6px 12px
  );
}
.is-over .bless-budget__rest {
  color: var(--bless-color-danger-text);
  font-weight: var(--bless-font-weight-bold);
}
</style>
