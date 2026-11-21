<template>
  <div class="bless-payments">
    <p class="bless-payments__totals">
      {{ text.totals(money.format(total), money.format(interest)) }}
    </p>
    <div class="bless-payments__scroll" tabindex="0" role="region" :aria-label="text.title">
      <table class="bless-payments__table">
        <thead>
          <tr>
            <th scope="col">{{ text.number }}</th>
            <th scope="col">{{ text.month }}</th>
            <th scope="col">{{ text.payment }}</th>
            <th scope="col">{{ text.principal }}</th>
            <th scope="col">{{ text.interest }}</th>
            <th scope="col">{{ text.balance }}</th>
          </tr>
        </thead>
        <tbody class="bless-stagger">
          <tr v-for="r in rows" :key="r.n" :class="{ 'is-paid': r.n <= paid }">
            <th scope="row">
              {{ r.n
              }}<span v-if="r.n <= paid" class="bless-payments__paid"> ✓ {{ text.paid }}</span>
            </th>
            <td>{{ monthName.format(new Date(`${r.month}-01T00:00:00Z`)) }}</td>
            <td>{{ money.format(r.payment) }}</td>
            <td>{{ money.format(r.principal) }}</td>
            <td>{{ money.format(r.interest) }}</td>
            <td>{{ money.format(r.balance) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script lang="ts">
export interface BlessPaymentRow {
  n: number;
  /** YYYY-MM */
  month: string;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
}
/**
 * The schedule of a loan with equal monthly payments: the annuity formula
 * P · r / (1 − (1 + r)^−n), with r the monthly rate. A rate of 0 splits the principal evenly.
 */
export function amortize(principal: number, yearlyRate: number, months: number, start: string) {
  const r = yearlyRate / 100 / 12;
  const pay = r === 0 ? principal / months : (principal * r) / (1 - (1 + r) ** -months);
  const [y, m] = start.split("-").map(Number) as [number, number];
  const rows: BlessPaymentRow[] = [];
  let balance = principal;
  for (let i = 0; i < months; i++) {
    const interest = balance * r;
    // the last payment takes what is left, so the balance ends at exactly 0
    const part = i === months - 1 ? balance : pay - interest;
    balance -= part;
    const d = new Date(Date.UTC(y, m - 1 + i, 1));
    rows.push({
      n: i + 1,
      month: d.toISOString().slice(0, 7),
      payment: part + interest,
      principal: part,
      interest,
      balance: Math.max(0, balance),
    });
  }
  return rows;
}
</script>

<script setup lang="ts">
import { computed } from "vue";
import { useLabelPack } from "../composables/useLabels";
import { moneyFormat } from "../composables/money";

defineOptions({ name: "BlessPaymentSchedule" });
const pack = useLabelPack("BlessPaymentSchedule");

const props = withDefaults(
  defineProps<{
    principal: number;
    /** the yearly interest rate in percent */
    rate: number;
    months: number;
    /** the month of the first payment, YYYY-MM */
    start: string;
    /** how many payments are already paid */
    paid?: number;
    currency?: string;
    locale?: string;
    labels?: Partial<{
      title: string;
      number: string;
      month: string;
      payment: string;
      principal: string;
      interest: string;
      balance: string;
      paid: string;
      totals: (paid: string, interest: string) => string;
    }>;
  }>(),
  { paid: 0, currency: "USD", locale: "en" },
);

const text = computed(() => ({
  title: "Payment schedule",
  number: "No.",
  month: "Month",
  payment: "Payment",
  principal: "Principal",
  interest: "Interest",
  balance: "Balance",
  paid: "paid",
  totals: (p: string, i: string) => `You pay ${p} in all, of which ${i} is interest.`,
  ...pack(),
  ...props.labels,
}));
const rows = computed(() => amortize(props.principal, props.rate, props.months, props.start));
const money = computed(() => moneyFormat(props.locale, props.currency));
const monthName = computed(
  () => new Intl.DateTimeFormat(props.locale, { month: "short", year: "numeric", timeZone: "UTC" }),
);
const total = computed(() => rows.value.reduce((n, r) => n + r.payment, 0));
const interest = computed(() => rows.value.reduce((n, r) => n + r.interest, 0));
</script>

<style>
.bless-payments {
  display: grid;
  gap: var(--bless-space-3);
  font-family: var(--bless-font-sans);
  font-size: var(--bless-text-sm);
  color: var(--bless-color-text);
}
.bless-payments__totals {
  margin: 0;
  font-weight: var(--bless-font-weight-bold);
}
.bless-payments__scroll {
  max-block-size: 22rem;
  overflow: auto;
  border: var(--bless-border-width) solid var(--bless-color-border);
}
.bless-payments__scroll:focus-visible {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: 1px;
}
.bless-payments__table {
  inline-size: 100%;
  border-collapse: collapse;
  font-variant-numeric: tabular-nums;
}
.bless-payments__table th,
.bless-payments__table td {
  padding: var(--bless-space-1) var(--bless-space-3);
  border: 0;
  border-block-end: var(--bless-border-width) solid var(--bless-color-border);
  text-align: end;
  white-space: nowrap;
}
.bless-payments__table thead th {
  position: sticky;
  inset-block-start: 0;
  background: var(--bless-color-bg);
  font-size: var(--bless-text-xs);
  color: var(--bless-color-text-muted);
  font-weight: var(--bless-font-weight-normal);
}
.bless-payments__table tbody th {
  text-align: start;
  font-weight: var(--bless-font-weight-normal);
}
/* a paid row says so in words; the gray only repeats it */
.bless-payments__table .is-paid td {
  color: var(--bless-color-text-muted);
}
.bless-payments__paid {
  font-size: var(--bless-text-xs);
  font-weight: var(--bless-font-weight-bold);
}
</style>
