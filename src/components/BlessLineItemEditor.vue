<script lang="ts">
export interface BlessLineItem {
  id: string;
  product: string;
  quantity: number;
  /** for example "pcs" or "hour" */
  unit?: string;
  /** the price of one, before discount and tax */
  price: number;
  /** the discount in percent */
  discount?: number;
  /** the tax in percent */
  tax?: number;
}
/** The net amount of one line: quantity × price, less the discount. */
export const lineNet = (l: BlessLineItem) => l.quantity * l.price * (1 - (l.discount ?? 0) / 100);
/** Totals of the lines: gross, discount, net, tax, and total. */
export function lineTotals(lines: BlessLineItem[]) {
  const gross = lines.reduce((n, l) => n + l.quantity * l.price, 0);
  const net = lines.reduce((n, l) => n + lineNet(l), 0);
  const tax = lines.reduce((n, l) => n + (lineNet(l) * (l.tax ?? 0)) / 100, 0);
  return { gross, discount: gross - net, net, tax, total: net + tax };
}
</script>

<script setup lang="ts">
import { computed, nextTick, ref } from "vue";
import { moneyFormat } from "../composables/money";
import { useLabelPack } from "../composables/useLabels";

defineOptions({ name: "BlessLineItemEditor" });
const pack = useLabelPack("BlessLineItemEditor");

const props = withDefaults(
  defineProps<{
    currency?: string;
    locale?: string;
    /** units to pick from */
    units?: string[];
    labels?: Partial<{
      title: string;
      product: string;
      quantity: string;
      unit: string;
      price: string;
      discount: string;
      tax: string;
      amount: string;
      add: string;
      remove: (row: number) => string;
      field: (what: string, row: number) => string;
      subtotal: string;
      discounts: string;
      taxes: string;
      total: string;
    }>;
  }>(),
  { currency: "USD", locale: "en", units: () => ["pcs", "hour", "box", "kg"] },
);
const lines = defineModel<BlessLineItem[]>({ default: () => [] });

const text = computed(() => ({
  title: "Lines",
  product: "Product",
  quantity: "Qty",
  unit: "Unit",
  price: "Price",
  discount: "Disc. %",
  tax: "Tax %",
  amount: "Amount",
  add: "Add a line",
  remove: (r: number) => `Remove line ${r}`,
  field: (w: string, r: number) => `${w}, line ${r}`,
  subtotal: "Subtotal",
  discounts: "Discounts",
  taxes: "Tax",
  total: "Total",
  ...pack(),
  ...props.labels,
}));
const money = computed(() => moneyFormat(props.locale, props.currency));
const totals = computed(() => lineTotals(lines.value));
const patch = (id: string, p: Partial<BlessLineItem>) =>
  (lines.value = lines.value.map((l) => (l.id === id ? { ...l, ...p } : l)));
const num = (e: Event) => Math.max(0, (e.target as HTMLInputElement).valueAsNumber || 0);
const box = ref<HTMLElement>();
let seq = 0;
function add() {
  const id = `l${Date.now().toString(36)}${seq++}`;
  const last = lines.value.at(-1);
  lines.value = [
    ...lines.value,
    { id, product: "", quantity: 1, unit: last?.unit ?? props.units[0], price: 0, tax: last?.tax },
  ];
  nextTick(() => box.value?.querySelector<HTMLInputElement>(`[data-line="${id}"] input`)?.focus());
}
const remove = (id: string) => (lines.value = lines.value.filter((l) => l.id !== id));
</script>

<template>
  <div ref="box" class="bless-lines">
    <div class="bless-lines__scroll" role="region" :aria-label="text.title" tabindex="0">
      <table class="bless-lines__table">
        <thead>
          <tr>
            <th scope="col">{{ text.product }}</th>
            <th scope="col">{{ text.quantity }}</th>
            <th scope="col">{{ text.unit }}</th>
            <th scope="col">{{ text.price }}</th>
            <th scope="col">{{ text.discount }}</th>
            <th scope="col">{{ text.tax }}</th>
            <th scope="col">{{ text.amount }}</th>
            <td></td>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(l, i) in lines" :key="l.id" :data-line="l.id">
            <td>
              <input
                class="is-text"
                :value="l.product"
                :aria-label="text.field(text.product, i + 1)"
                @change="patch(l.id, { product: ($event.target as HTMLInputElement).value })"
              />
            </td>
            <td>
              <input
                type="number"
                min="0"
                step="any"
                :value="l.quantity"
                :aria-label="text.field(text.quantity, i + 1)"
                @change="patch(l.id, { quantity: num($event) })"
              />
            </td>
            <td>
              <select
                :value="l.unit"
                :aria-label="text.field(text.unit, i + 1)"
                @change="patch(l.id, { unit: ($event.target as HTMLSelectElement).value })"
              >
                <option v-for="u in units" :key="u" :value="u">{{ u }}</option>
              </select>
            </td>
            <td>
              <input
                type="number"
                min="0"
                step="any"
                :value="l.price"
                :aria-label="text.field(text.price, i + 1)"
                @change="patch(l.id, { price: num($event) })"
              />
            </td>
            <td>
              <input
                type="number"
                min="0"
                max="100"
                step="any"
                :value="l.discount ?? 0"
                :aria-label="text.field(text.discount, i + 1)"
                @change="patch(l.id, { discount: Math.min(100, num($event)) })"
              />
            </td>
            <td>
              <input
                type="number"
                min="0"
                max="100"
                step="any"
                :value="l.tax ?? 0"
                :aria-label="text.field(text.tax, i + 1)"
                @change="patch(l.id, { tax: Math.min(100, num($event)) })"
              />
            </td>
            <td class="bless-lines__amount">{{ money.format(lineNet(l)) }}</td>
            <td>
              <button
                type="button"
                class="bless-lines__x"
                :aria-label="text.remove(i + 1)"
                :title="text.remove(i + 1)"
                @click="remove(l.id)"
              >
                ✕
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <button type="button" class="bless-lines__add" @click="add">+ {{ text.add }}</button>
    <dl class="bless-lines__totals" aria-live="polite">
      <div>
        <dt>{{ text.subtotal }}</dt>
        <dd>{{ money.format(totals.gross) }}</dd>
      </div>
      <div v-if="totals.discount">
        <dt>{{ text.discounts }}</dt>
        <dd>−{{ money.format(totals.discount) }}</dd>
      </div>
      <div>
        <dt>{{ text.taxes }}</dt>
        <dd>{{ money.format(totals.tax) }}</dd>
      </div>
      <div class="is-total">
        <dt>{{ text.total }}</dt>
        <dd>{{ money.format(totals.total) }}</dd>
      </div>
    </dl>
  </div>
</template>

<style>
.bless-lines {
  display: grid;
  gap: var(--bless-space-3);
  font-family: var(--bless-font-sans);
  font-size: var(--bless-text-sm);
  color: var(--bless-color-text);
}
.bless-lines__scroll {
  overflow-x: auto;
  border: var(--bless-border-width) solid var(--bless-color-border);
}
.bless-lines__scroll:focus-visible {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: 2px;
}
.bless-lines__table {
  inline-size: 100%;
  border-collapse: collapse;
  font-variant-numeric: tabular-nums;
}
.bless-lines__table th,
.bless-lines__table td {
  padding: var(--bless-space-1);
  border: 0;
  border-block-end: var(--bless-border-width) solid var(--bless-color-border);
  text-align: end;
  white-space: nowrap;
}
.bless-lines__table th:first-child,
.bless-lines__table td:first-child {
  text-align: start;
}
.bless-lines__table thead th {
  background: var(--bless-color-surface-2);
  font-size: var(--bless-text-xs);
  font-weight: var(--bless-font-weight-bold);
}
.bless-lines__table input,
.bless-lines__table select {
  inline-size: 5.5rem;
  min-block-size: 2.25rem;
  padding: 0 var(--bless-space-2);
  border: var(--bless-border-width) solid var(--bless-color-border);
  background: var(--bless-color-bg);
  color: inherit;
  font: inherit;
  text-align: end;
}
.bless-lines__table input.is-text {
  inline-size: 100%;
  min-inline-size: 12rem;
  text-align: start;
}
.bless-lines__table select {
  inline-size: auto;
  text-align: start;
}
.bless-lines__table input:focus-visible,
.bless-lines__table select:focus-visible,
.bless-lines__x:focus-visible,
.bless-lines__add:focus-visible {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: 1px;
}
.bless-lines__amount {
  font-weight: var(--bless-font-weight-bold);
}
.bless-lines__x {
  inline-size: 2rem;
  block-size: 2rem;
  border: 0;
  background: none;
  color: var(--bless-color-text-muted);
  cursor: pointer;
}
.bless-lines__add {
  justify-self: start;
  padding: var(--bless-space-1) var(--bless-space-3);
  border: var(--bless-border-width) dashed var(--bless-color-border);
  background: none;
  color: inherit;
  font: inherit;
  cursor: pointer;
}
.bless-lines__totals {
  display: grid;
  justify-self: end;
  gap: var(--bless-space-1);
  min-inline-size: 16rem;
  margin: 0;
  font-variant-numeric: tabular-nums;
}
.bless-lines__totals div {
  display: flex;
  justify-content: space-between;
  gap: var(--bless-space-4);
}
.bless-lines__totals dd {
  margin: 0;
}
.bless-lines__totals .is-total {
  padding-block-start: var(--bless-space-1);
  border-block-start: 2px solid var(--bless-color-text);
  font-size: var(--bless-text-md);
  font-weight: var(--bless-font-weight-bold);
}
</style>
