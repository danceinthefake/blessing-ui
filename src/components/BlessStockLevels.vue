<script lang="ts">
export interface BlessStockItem {
  sku: string;
  name: string;
  /** the warehouse or the shelf */
  location?: string;
  onHand: number;
  /** promised to orders, not free */
  reserved?: number;
  /** at or below this many free, order more */
  reorderAt: number;
  unit?: string;
}
export type BlessStockState = "ok" | "low" | "out";
/** The free stock and its state against the reorder point. */
export function stockState(i: BlessStockItem): { available: number; state: BlessStockState } {
  const available = Math.max(0, i.onHand - (i.reserved ?? 0));
  return { available, state: available === 0 ? "out" : available <= i.reorderAt ? "low" : "ok" };
}
</script>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useLabelPack } from "../composables/useLabels";

defineOptions({ name: "BlessStockLevels" });
const pack = useLabelPack("BlessStockLevels");

const props = withDefaults(
  defineProps<{
    items: BlessStockItem[];
    locale?: string;
    labels?: Partial<
      Record<BlessStockState, string> & {
        title: string;
        sku: string;
        item: string;
        location: string;
        onHand: string;
        reserved: string;
        available: string;
        reorder: string;
        state: string;
        onlyLow: string;
        count: (low: number, total: number) => string;
      }
    >;
  }>(),
  { locale: "en" },
);

const text = computed(() => ({
  title: "Stock levels",
  sku: "SKU",
  item: "Item",
  location: "Location",
  onHand: "On hand",
  reserved: "Reserved",
  available: "Available",
  reorder: "Reorder at",
  state: "State",
  ok: "In stock",
  low: "Low",
  out: "Out of stock",
  onlyLow: "Show only items to reorder",
  count: (l: number, t: number) => `${l} of ${t} items need a reorder`,
  ...pack(),
  ...props.labels,
}));
const num = computed(() => new Intl.NumberFormat(props.locale));
const onlyLow = ref(false);
const ORDER: Record<BlessStockState, number> = { out: 0, low: 1, ok: 2 };
// the worst first, so what needs action is on top
const rows = computed(() =>
  props.items
    .map((i) => ({ ...i, ...stockState(i) }))
    .filter((r) => !onlyLow.value || r.state !== "ok")
    .sort((a, b) => ORDER[a.state] - ORDER[b.state]),
);
const lowCount = computed(() => props.items.filter((i) => stockState(i).state !== "ok").length);
const MARK: Record<BlessStockState, string> = { ok: "✓", low: "!", out: "✕" };
</script>

<template>
  <div class="bless-stock">
    <div class="bless-stock__bar">
      <p class="bless-stock__count" role="status">{{ text.count(lowCount, items.length) }}</p>
      <label class="bless-stock__filter">
        <input v-model="onlyLow" type="checkbox" />
        {{ text.onlyLow }}
      </label>
    </div>
    <div class="bless-stock__scroll" role="region" :aria-label="text.title" tabindex="0">
      <table class="bless-stock__table">
        <thead>
          <tr>
            <th scope="col">{{ text.sku }}</th>
            <th scope="col">{{ text.item }}</th>
            <th scope="col">{{ text.location }}</th>
            <th scope="col">{{ text.onHand }}</th>
            <th scope="col">{{ text.reserved }}</th>
            <th scope="col">{{ text.available }}</th>
            <th scope="col">{{ text.reorder }}</th>
            <th scope="col">{{ text.state }}</th>
          </tr>
        </thead>
        <tbody class="bless-stagger">
          <tr v-for="r in rows" :key="r.sku" :class="`is-${r.state}`">
            <td class="bless-stock__sku">{{ r.sku }}</td>
            <th scope="row">{{ r.name }}</th>
            <td>{{ r.location ?? "—" }}</td>
            <td>{{ num.format(r.onHand) }}</td>
            <td>{{ num.format(r.reserved ?? 0) }}</td>
            <td class="bless-stock__free">
              {{ r.unit ? `${num.format(r.available)} ${r.unit}` : num.format(r.available) }}
            </td>
            <td>{{ num.format(r.reorderAt) }}</td>
            <td class="bless-stock__state">
              <span aria-hidden="true">{{ MARK[r.state] }}</span> {{ text[r.state] }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style>
.bless-stock {
  display: grid;
  gap: var(--bless-space-2);
  font-family: var(--bless-font-sans);
  font-size: var(--bless-text-sm);
  color: var(--bless-color-text);
}
.bless-stock__bar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: var(--bless-space-2);
}
.bless-stock__count {
  margin: 0;
  font-weight: var(--bless-font-weight-bold);
}
.bless-stock__filter {
  display: inline-flex;
  align-items: center;
  gap: var(--bless-space-2);
  cursor: pointer;
}
.bless-stock__filter input {
  accent-color: var(--bless-color-accent);
}
.bless-stock__filter input:focus-visible,
.bless-stock__scroll:focus-visible {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: 2px;
}
.bless-stock__scroll {
  overflow-x: auto;
  border: var(--bless-border-width) solid var(--bless-color-border);
}
.bless-stock__table {
  inline-size: 100%;
  border-collapse: collapse;
  font-variant-numeric: tabular-nums;
}
.bless-stock__table th,
.bless-stock__table td {
  padding: var(--bless-space-2);
  border: 0;
  border-block-end: var(--bless-border-width) solid var(--bless-color-border);
  text-align: end;
  white-space: nowrap;
}
.bless-stock__table :is(th, td):nth-child(-n + 3),
.bless-stock__table :is(th, td):last-child {
  text-align: start;
}
.bless-stock__table thead th {
  background: var(--bless-color-surface-2);
  font-size: var(--bless-text-xs);
}
.bless-stock__table tbody th {
  font-weight: var(--bless-font-weight-bold);
}
.bless-stock__sku {
  font-family: var(--bless-font-mono, ui-monospace, monospace);
  font-size: var(--bless-text-xs);
}
.bless-stock__free {
  font-weight: var(--bless-font-weight-bold);
}
/* low and out have a mark, a word, and an edge; the color only repeats them */
.bless-stock__table tr.is-low {
  box-shadow: inset 4px 0 0 var(--bless-color-text);
}
.bless-stock__table tr.is-out {
  box-shadow: inset 4px 0 0 var(--bless-color-danger);
}
.bless-stock__state {
  font-weight: var(--bless-font-weight-bold);
}
.is-out .bless-stock__state {
  color: var(--bless-color-danger-text);
}
</style>
