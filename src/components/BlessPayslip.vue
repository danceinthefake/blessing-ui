<template>
  <article class="bless-payslip">
    <header class="bless-payslip__head">
      <div>
        <h2 class="bless-payslip__title">{{ text.title }}</h2>
        <p v-if="company" class="bless-payslip__company">{{ company }}</p>
      </div>
      <dl class="bless-payslip__facts">
        <div>
          <dt>{{ text.employee }}</dt>
          <dd>
            {{ employee.name }}<template v-if="employee.id"> · {{ employee.id }}</template
            ><template v-if="employee.role"><br />{{ employee.role }}</template>
          </dd>
        </div>
        <div>
          <dt>{{ text.period }}</dt>
          <dd>{{ period }}</dd>
        </div>
        <div v-if="payDate">
          <dt>{{ text.payDate }}</dt>
          <dd>{{ payDate }}</dd>
        </div>
      </dl>
    </header>
    <div class="bless-payslip__cols">
      <table class="bless-payslip__table">
        <caption>
          {{ text.earnings }}
        </caption>
        <tbody>
          <tr v-for="l in earnings" :key="l.label">
            <th scope="row">{{ l.label }}</th>
            <td>{{ money.format(l.amount) }}</td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <th scope="row">{{ text.totalEarnings }}</th>
            <td>{{ money.format(earned) }}</td>
          </tr>
        </tfoot>
      </table>
      <table v-if="deductions.length" class="bless-payslip__table">
        <caption>
          {{ text.deductions }}
        </caption>
        <tbody>
          <tr v-for="l in deductions" :key="l.label">
            <th scope="row">{{ l.label }}</th>
            <td>−{{ money.format(l.amount) }}</td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <th scope="row">{{ text.totalDeductions }}</th>
            <td>−{{ money.format(deducted) }}</td>
          </tr>
        </tfoot>
      </table>
    </div>
    <div class="bless-payslip__net">
      <span>{{ text.net }}</span>
      <strong>{{ money.format(earned - deducted) }}</strong>
    </div>
  </article>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { moneyFormat } from "../composables/money";
import { useLabelPack } from "../composables/useLabels";

defineOptions({ name: "BlessPayslip" });
const pack = useLabelPack("BlessPayslip");

export interface BlessPayLine {
  label: string;
  amount: number;
}

const props = withDefaults(
  defineProps<{
    employee: { name: string; id?: string; role?: string };
    company?: string;
    /** the pay period, as text, for example "November 2026" */
    period: string;
    /** the pay day, as text */
    payDate?: string;
    earnings: BlessPayLine[];
    deductions?: BlessPayLine[];
    currency?: string;
    locale?: string;
    labels?: Partial<{
      title: string;
      employee: string;
      period: string;
      payDate: string;
      earnings: string;
      deductions: string;
      totalEarnings: string;
      totalDeductions: string;
      net: string;
    }>;
  }>(),
  { deductions: () => [], currency: "USD", locale: "en" },
);

const text = computed(() => ({
  title: "Payslip",
  employee: "Employee",
  period: "Period",
  payDate: "Pay day",
  earnings: "Earnings",
  deductions: "Deductions",
  totalEarnings: "Total earnings",
  totalDeductions: "Total deductions",
  net: "Net pay",
  ...pack(),
  ...props.labels,
}));
const money = computed(() => moneyFormat(props.locale, props.currency));
const sum = (l: BlessPayLine[]) => l.reduce((n, x) => n + x.amount, 0);
const earned = computed(() => sum(props.earnings));
const deducted = computed(() => sum(props.deductions));
</script>

<style>
.bless-payslip {
  display: grid;
  gap: var(--bless-space-4);
  max-inline-size: 44rem;
  padding: var(--bless-space-6);
  border: var(--bless-border-width) solid var(--bless-color-border);
  background: var(--bless-color-bg);
  font-family: var(--bless-font-sans);
  font-size: var(--bless-text-sm);
  color: var(--bless-color-text);
}
.bless-payslip__head {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: var(--bless-space-4);
}
/* two classes, so the heading styles of a host page do not win */
.bless-payslip .bless-payslip__title {
  margin: 0;
  padding: 0;
  border: 0;
  font-size: var(--bless-text-xl);
  letter-spacing: var(--bless-tracking-wide);
  text-transform: var(--bless-label-case);
}
.bless-payslip__company {
  margin: 0;
  color: var(--bless-color-text-muted);
}
.bless-payslip__facts {
  display: grid;
  gap: 2px;
  margin: 0;
}
.bless-payslip__facts div {
  display: flex;
  gap: var(--bless-space-3);
}
.bless-payslip__facts dt {
  min-inline-size: 5rem;
  color: var(--bless-color-text-muted);
}
.bless-payslip__facts dd {
  margin: 0;
  font-weight: var(--bless-font-weight-bold);
}
.bless-payslip__cols {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr));
  gap: var(--bless-space-4);
}
.bless-payslip__table {
  inline-size: 100%;
  border-collapse: collapse;
  align-self: start;
  font-variant-numeric: tabular-nums;
}
.bless-payslip__table caption {
  padding-block-end: var(--bless-space-1);
  border-block-end: 2px solid var(--bless-color-text);
  font-size: var(--bless-text-xs);
  font-weight: var(--bless-font-weight-bold);
  letter-spacing: var(--bless-tracking-wide);
  text-align: start;
  text-transform: var(--bless-label-case);
}
.bless-payslip__table th,
.bless-payslip__table td {
  padding: var(--bless-space-1) 0;
  border: 0;
  border-block-end: var(--bless-border-width) solid var(--bless-color-border);
  font-weight: var(--bless-font-weight-normal);
}
.bless-payslip__table th {
  text-align: start;
}
.bless-payslip__table td {
  text-align: end;
}
.bless-payslip__table tfoot :is(th, td) {
  font-weight: var(--bless-font-weight-bold);
}
.bless-payslip__net {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin: 0;
  padding: var(--bless-space-3) var(--bless-space-4);
  background: var(--bless-color-text);
  color: var(--bless-color-bg);
  font-variant-numeric: tabular-nums;
}
.bless-payslip__net strong {
  font-size: var(--bless-text-xl);
}
@media print {
  .bless-payslip {
    max-inline-size: none;
    border: 0;
    padding: 0;
  }
}
.bless-payslip {
  animation: bless-enter var(--bless-duration-enter) var(--bless-ease-soft);
}
</style>
