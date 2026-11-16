<script setup lang="ts">
import { computed } from "vue";
import { useLabelPack } from "../composables/useLabels";

defineOptions({ name: "BlessTransactionList" });
const pack = useLabelPack("BlessTransactionList");

export interface BlessTransaction {
  id: string;
  title: string;
  /** money in is positive, money out is negative */
  amount: number;
  /** YYYY-MM-DD */
  date: string;
  category?: string;
  /** an emoji or a short text for the category */
  icon?: string;
  pending?: boolean;
}

const props = withDefaults(
  defineProps<{
    transactions: BlessTransaction[];
    currency?: string;
    locale?: string;
    labels?: Partial<{ title: string; pending: string; total: (sum: string) => string }>;
  }>(),
  { currency: "USD", locale: "en" },
);

const text = computed(() => ({
  title: "Transactions",
  pending: "pending",
  total: (s: string) => `Day total ${s}`,
  ...pack(),
  ...props.labels,
}));
const money = computed(
  () => new Intl.NumberFormat(props.locale, { style: "currency", currency: props.currency }),
);
// the sign is always written, so money in and out do not rest on the color
const signed = (n: number) => `${n < 0 ? "−" : "+"}${money.value.format(Math.abs(n))}`;
const dayName = computed(
  () =>
    new Intl.DateTimeFormat(props.locale, {
      weekday: "short",
      day: "numeric",
      month: "short",
      timeZone: "UTC",
    }),
);
// newest day first; the rows keep their order inside a day
const days = computed(() => {
  const map = new Map<string, BlessTransaction[]>();
  for (const t of props.transactions) map.set(t.date, [...(map.get(t.date) ?? []), t]);
  return [...map.entries()]
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([date, rows]) => ({
      date,
      name: dayName.value.format(new Date(`${date}T00:00:00Z`)),
      total: rows.reduce((n, r) => n + r.amount, 0),
      rows,
    }));
});
</script>

<template>
  <section class="bless-txns" :aria-label="text.title">
    <div v-for="d in days" :key="d.date" class="bless-txns__day">
      <h3 class="bless-txns__head">
        <span>{{ d.name }}</span>
        <span class="bless-txns__total">{{ text.total(signed(d.total)) }}</span>
      </h3>
      <ul class="bless-txns__list">
        <li v-for="t in d.rows" :key="t.id" class="bless-txns__row">
          <span class="bless-txns__icon" aria-hidden="true">{{ t.icon ?? t.title.charAt(0) }}</span>
          <span class="bless-txns__main">
            <span class="bless-txns__title">{{ t.title }}</span>
            <span v-if="t.category || t.pending" class="bless-txns__meta">
              {{ t.category }}<template v-if="t.category && t.pending"> · </template
              ><span v-if="t.pending" class="bless-txns__pending">{{ text.pending }}</span>
            </span>
          </span>
          <span class="bless-txns__amount" :class="{ 'is-in': t.amount > 0 }">{{
            signed(t.amount)
          }}</span>
        </li>
      </ul>
    </div>
  </section>
</template>

<style>
.bless-txns {
  display: grid;
  gap: var(--bless-space-4);
  font-family: var(--bless-font-sans);
  font-size: var(--bless-text-sm);
  color: var(--bless-color-text);
}
.bless-txns__head {
  display: flex;
  justify-content: space-between;
  gap: var(--bless-space-2);
  margin: 0 0 var(--bless-space-1);
  padding-block-end: var(--bless-space-1);
  border-block-end: var(--bless-border-width) solid var(--bless-color-border);
  font-size: var(--bless-text-xs);
  font-weight: var(--bless-font-weight-bold);
  letter-spacing: var(--bless-tracking-wide);
  text-transform: uppercase;
}
.bless-txns__total {
  font-variant-numeric: tabular-nums;
  text-transform: none;
  letter-spacing: 0;
}
.bless-txns__list {
  display: grid;
  margin: 0;
  padding: 0;
  list-style: none;
}
.bless-txns__row {
  display: flex;
  align-items: center;
  gap: var(--bless-space-3);
  min-block-size: 3rem;
}
.bless-txns__icon {
  display: grid;
  flex: none;
  place-items: center;
  inline-size: 2.25rem;
  block-size: 2.25rem;
  border-radius: 50%;
  background: var(--bless-color-surface-2);
  font-weight: var(--bless-font-weight-bold);
}
.bless-txns__main {
  display: grid;
  flex: 1;
  min-inline-size: 0;
}
.bless-txns__title {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.bless-txns__meta {
  font-size: var(--bless-text-xs);
  color: var(--bless-color-text-muted);
}
.bless-txns__pending {
  font-style: italic;
}
.bless-txns__amount {
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}
.bless-txns__amount.is-in {
  font-weight: var(--bless-font-weight-bold);
}
</style>
