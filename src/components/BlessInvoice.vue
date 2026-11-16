<script lang="ts">
export interface BlessInvoiceLine {
  description: string;
  quantity: number;
  /** the price of one, without tax */
  price: number;
  /** the tax in percent, for example 11 */
  tax?: number;
}
export type BlessInvoiceStatus = "draft" | "sent" | "paid" | "overdue";
export interface BlessInvoiceParty {
  name: string;
  /** the address and other lines */
  lines?: string[];
}
/** Totals of invoice lines: the subtotal, the tax for each rate, and the total. */
export function invoiceTotals(lines: BlessInvoiceLine[]) {
  const subtotal = lines.reduce((n, l) => n + l.quantity * l.price, 0);
  const taxes = new Map<number, number>();
  for (const l of lines)
    if (l.tax) taxes.set(l.tax, (taxes.get(l.tax) ?? 0) + (l.quantity * l.price * l.tax) / 100);
  const tax = [...taxes.values()].reduce((n, t) => n + t, 0);
  return { subtotal, taxes: [...taxes.entries()].sort(([a], [b]) => a - b), total: subtotal + tax };
}
</script>

<script setup lang="ts">
import { computed } from "vue";
import { moneyFormat } from "../composables/money";
import { useLabelPack } from "../composables/useLabels";

defineOptions({ name: "BlessInvoice" });
const pack = useLabelPack("BlessInvoice");

const props = withDefaults(
  defineProps<{
    number: string;
    /** YYYY-MM-DD */
    issued: string;
    due?: string;
    from: BlessInvoiceParty;
    to: BlessInvoiceParty;
    lines: BlessInvoiceLine[];
    status?: BlessInvoiceStatus;
    /** what is already paid */
    paid?: number;
    notes?: string;
    currency?: string;
    locale?: string;
    labels?: Partial<
      Record<BlessInvoiceStatus, string> & {
        invoice: string;
        from: string;
        to: string;
        issued: string;
        due: string;
        item: string;
        quantity: string;
        price: string;
        amount: string;
        subtotal: string;
        tax: (rate: number) => string;
        total: string;
        paidAmount: string;
        balance: string;
      }
    >;
  }>(),
  { status: "draft", paid: 0, currency: "USD", locale: "en" },
);

const text = computed(() => ({
  invoice: "Invoice",
  from: "From",
  to: "Bill to",
  issued: "Issued",
  due: "Due",
  item: "Item",
  quantity: "Qty",
  price: "Price",
  amount: "Amount",
  subtotal: "Subtotal",
  tax: (r: number) => `Tax ${r}%`,
  total: "Total",
  paidAmount: "Paid",
  balance: "Amount due",
  draft: "Draft",
  sent: "Sent",
  paid: "Paid",
  overdue: "Overdue",
  ...pack(),
  ...props.labels,
}));
const money = computed(() => moneyFormat(props.locale, props.currency));
const totals = computed(() => invoiceTotals(props.lines));
const day = (iso: string) =>
  new Intl.DateTimeFormat(props.locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${iso}T00:00:00Z`));
const MARK: Record<BlessInvoiceStatus, string> = { draft: "○", sent: "→", paid: "✓", overdue: "!" };
</script>

<template>
  <article class="bless-invoice" :class="`is-${status}`">
    <header class="bless-invoice__head">
      <div>
        <h2 class="bless-invoice__title">{{ text.invoice }}</h2>
        <p class="bless-invoice__number">{{ number }}</p>
      </div>
      <p class="bless-invoice__status">
        <span aria-hidden="true">{{ MARK[status] }}</span> {{ text[status] }}
      </p>
    </header>
    <div class="bless-invoice__parties">
      <section>
        <h3 class="bless-invoice__label">{{ text.from }}</h3>
        <p>
          <strong>{{ from.name }}</strong
          ><template v-for="l in from.lines ?? []" :key="l"><br />{{ l }}</template>
        </p>
      </section>
      <section>
        <h3 class="bless-invoice__label">{{ text.to }}</h3>
        <p>
          <strong>{{ to.name }}</strong
          ><template v-for="l in to.lines ?? []" :key="l"><br />{{ l }}</template>
        </p>
      </section>
      <dl class="bless-invoice__dates">
        <div>
          <dt>{{ text.issued }}</dt>
          <dd><time :datetime="issued">{{ day(issued) }}</time></dd>
        </div>
        <div v-if="due">
          <dt>{{ text.due }}</dt>
          <dd><time :datetime="due">{{ day(due) }}</time></dd>
        </div>
      </dl>
    </div>
    <div class="bless-invoice__scroll">
      <table class="bless-invoice__table">
        <thead>
          <tr>
            <th scope="col">{{ text.item }}</th>
            <th scope="col">{{ text.quantity }}</th>
            <th scope="col">{{ text.price }}</th>
            <th scope="col">{{ text.amount }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(l, i) in lines" :key="i">
            <td>
              {{ l.description
              }}<span v-if="l.tax" class="bless-invoice__rate"> · {{ text.tax(l.tax) }}</span>
            </td>
            <td>{{ l.quantity }}</td>
            <td>{{ money.format(l.price) }}</td>
            <td>{{ money.format(l.quantity * l.price) }}</td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <th scope="row" colspan="3">{{ text.subtotal }}</th>
            <td>{{ money.format(totals.subtotal) }}</td>
          </tr>
          <tr v-for="[rate, amount] in totals.taxes" :key="rate">
            <th scope="row" colspan="3">{{ text.tax(rate) }}</th>
            <td>{{ money.format(amount) }}</td>
          </tr>
          <tr class="is-total">
            <th scope="row" colspan="3">{{ text.total }}</th>
            <td>{{ money.format(totals.total) }}</td>
          </tr>
          <tr v-if="paid">
            <th scope="row" colspan="3">{{ text.paidAmount }}</th>
            <td>−{{ money.format(paid) }}</td>
          </tr>
          <tr class="is-due">
            <th scope="row" colspan="3">{{ text.balance }}</th>
            <td>{{ money.format(Math.max(0, totals.total - paid)) }}</td>
          </tr>
        </tfoot>
      </table>
    </div>
    <p v-if="notes" class="bless-invoice__notes">{{ notes }}</p>
  </article>
</template>

<style>
.bless-invoice {
  display: grid;
  gap: var(--bless-space-4);
  max-inline-size: 48rem;
  padding: var(--bless-space-6);
  border: var(--bless-border-width) solid var(--bless-color-border);
  background: var(--bless-color-bg);
  font-family: var(--bless-font-sans);
  font-size: var(--bless-text-sm);
  color: var(--bless-color-text);
}
.bless-invoice p {
  margin: 0;
}
.bless-invoice__head {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--bless-space-3);
}
/* two classes, so the heading styles of a host page do not win */
.bless-invoice .bless-invoice__title {
  margin: 0;
  padding: 0;
  border: 0;
  font-size: var(--bless-text-xl);
  letter-spacing: var(--bless-tracking-wide);
  text-transform: uppercase;
}
.bless-invoice__number {
  font-family: var(--bless-font-mono, ui-monospace, monospace);
}
.bless-invoice__status {
  padding: var(--bless-space-1) var(--bless-space-3);
  border: 2px solid currentColor;
  font-weight: var(--bless-font-weight-bold);
  text-transform: uppercase;
}
.is-overdue .bless-invoice__status {
  color: var(--bless-color-danger-text);
}
.is-paid .bless-invoice__status {
  background: var(--bless-color-text);
  color: var(--bless-color-bg);
  border-color: var(--bless-color-text);
}
.bless-invoice__parties {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(12rem, 1fr));
  gap: var(--bless-space-4);
}
.bless-invoice .bless-invoice__label {
  margin: 0 0 var(--bless-space-1);
  padding: 0;
  border: 0;
  font-size: var(--bless-text-xs);
  font-weight: var(--bless-font-weight-bold);
  letter-spacing: var(--bless-tracking-wide);
  text-transform: uppercase;
  color: var(--bless-color-text-muted);
}
.bless-invoice__parties p {
  line-height: 1.5;
}
.bless-invoice__dates {
  display: grid;
  gap: var(--bless-space-1);
  margin: 0;
}
.bless-invoice__dates div {
  display: flex;
  justify-content: space-between;
  gap: var(--bless-space-2);
}
.bless-invoice__dates dt {
  color: var(--bless-color-text-muted);
}
.bless-invoice__dates dd {
  margin: 0;
  font-weight: var(--bless-font-weight-bold);
}
.bless-invoice__scroll {
  overflow-x: auto;
}
.bless-invoice__table {
  inline-size: 100%;
  border-collapse: collapse;
  font-variant-numeric: tabular-nums;
}
.bless-invoice__table th,
.bless-invoice__table td {
  padding: var(--bless-space-2);
  border: 0;
  border-block-end: var(--bless-border-width) solid var(--bless-color-border);
  text-align: end;
}
.bless-invoice__table thead th {
  border-block-end: 2px solid var(--bless-color-text);
  font-size: var(--bless-text-xs);
  text-transform: uppercase;
}
.bless-invoice__table :is(th, td):first-child {
  text-align: start;
}
.bless-invoice__table tfoot th {
  font-weight: var(--bless-font-weight-normal);
  text-align: end !important;
}
.bless-invoice__table tfoot tr.is-total :is(th, td) {
  border-block-start: 2px solid var(--bless-color-text);
  font-weight: var(--bless-font-weight-bold);
}
.bless-invoice__table tfoot tr.is-due :is(th, td) {
  font-size: var(--bless-text-md);
  font-weight: var(--bless-font-weight-bold);
}
.bless-invoice__rate {
  font-size: var(--bless-text-xs);
  color: var(--bless-color-text-muted);
}
.bless-invoice__notes {
  padding: var(--bless-space-3);
  background: var(--bless-color-surface-2);
  line-height: 1.5;
}
@media print {
  .bless-invoice {
    max-inline-size: none;
    border: 0;
    padding: 0;
    color: #000;
    background: #fff;
  }
}
</style>
