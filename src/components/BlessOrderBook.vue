<template>
  <table class="bless-book" :aria-label="text.title">
    <thead>
      <tr>
        <th scope="col"><span class="bless-sr">{{ text.ask }} / {{ text.bid }}</span></th>
        <th scope="col">{{ text.price }}</th>
        <th scope="col">{{ text.size }}</th>
        <th scope="col">{{ text.total }}</th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="r in askRows"
        :key="`a${r.price}`"
        class="bless-book__row is-ask"
        :style="{ '--_depth': bar(r.total) }"
      >
        <th scope="row" class="bless-book__side">{{ text.ask }}</th>
        <td class="bless-book__price">{{ num.format(r.price) }}</td>
        <td>{{ qty.format(r.size) }}</td>
        <td>{{ qty.format(r.total) }}</td>
      </tr>
      <tr v-if="book.spread !== undefined" class="bless-book__spread">
        <td colspan="4">
          {{ text.spread(num.format(book.spread), pct.format(book.spread / book.mid!)) }}
        </td>
      </tr>
      <tr
        v-for="r in book.bids"
        :key="`b${r.price}`"
        class="bless-book__row is-bid"
        :style="{ '--_depth': bar(r.total) }"
      >
        <th scope="row" class="bless-book__side">{{ text.bid }}</th>
        <td class="bless-book__price">{{ num.format(r.price) }}</td>
        <td>{{ qty.format(r.size) }}</td>
        <td>{{ qty.format(r.total) }}</td>
      </tr>
    </tbody>
  </table>
</template>

<script lang="ts">
export interface BlessBookLevel {
  price: number;
  size: number;
}
/** Sorts each side from the best price outward and adds the running total of the size. */
export function bookSides(bids: BlessBookLevel[], asks: BlessBookLevel[], depth: number) {
  const run = (ls: BlessBookLevel[]) => {
    let sum = 0;
    return ls.slice(0, depth).map((l) => ({ ...l, total: (sum += l.size) }));
  };
  const b = run([...bids].sort((x, y) => y.price - x.price));
  const a = run([...asks].sort((x, y) => x.price - y.price));
  const spread = a[0] && b[0] ? a[0].price - b[0].price : undefined;
  return {
    bids: b,
    asks: a,
    spread,
    mid: a[0] && b[0] ? (a[0].price + b[0].price) / 2 : undefined,
  };
}
</script>

<script setup lang="ts">
import { computed } from "vue";
import { useLabelPack } from "../composables/useLabels";
import "./sr.css";

defineOptions({ name: "BlessOrderBook" });
const pack = useLabelPack("BlessOrderBook");

const props = withDefaults(
  defineProps<{
    bids: BlessBookLevel[];
    asks: BlessBookLevel[];
    /** rows on each side */
    depth?: number;
    /** decimals of the price */
    precision?: number;
    locale?: string;
    labels?: Partial<{
      title: string;
      price: string;
      size: string;
      total: string;
      ask: string;
      bid: string;
      spread: (value: string, percent: string) => string;
    }>;
  }>(),
  { depth: 8, precision: 2, locale: "en" },
);

const text = computed(() => ({
  title: "Order book",
  price: "Price",
  size: "Size",
  total: "Total",
  ask: "Ask",
  bid: "Bid",
  spread: (v: string, p: string) => `Spread ${v} (${p})`,
  ...pack(),
  ...props.labels,
}));
const book = computed(() => bookSides(props.bids, props.asks, props.depth));
const max = computed(() =>
  Math.max(book.value.bids.at(-1)?.total ?? 0, book.value.asks.at(-1)?.total ?? 0, 1),
);
const num = computed(
  () =>
    new Intl.NumberFormat(props.locale, {
      minimumFractionDigits: props.precision,
      maximumFractionDigits: props.precision,
    }),
);
const qty = computed(() => new Intl.NumberFormat(props.locale, { maximumFractionDigits: 4 }));
const pct = computed(
  () => new Intl.NumberFormat(props.locale, { style: "percent", maximumFractionDigits: 3 }),
);
// asks show with the best (lowest) price next to the spread, so their order flips
const askRows = computed(() => [...book.value.asks].reverse());
const bar = (total: number) => `${(total / max.value) * 100}%`;
</script>

<style>
.bless-book {
  inline-size: 100%;
  border-collapse: collapse;
  font-family: var(--bless-font-sans);
  font-size: var(--bless-text-xs);
  font-variant-numeric: tabular-nums;
  color: var(--bless-color-text);
}
.bless-book th,
.bless-book td {
  padding: 3px var(--bless-space-2);
  border: 0;
  text-align: end;
}
.bless-book thead th {
  color: var(--bless-color-text-muted);
  font-weight: var(--bless-font-weight-normal);
}
/* the side is a word in the first column; the color of the price only repeats it */
.bless-book__side {
  inline-size: 1%;
  text-align: start !important;
  font-weight: var(--bless-font-weight-bold);
  white-space: nowrap;
}
/* the depth bar grows from the end of the row, behind the numbers */
.bless-book__row {
  background: linear-gradient(to left, var(--_tint) var(--_depth), transparent var(--_depth));
}
.bless-book__row.is-ask {
  --_tint: color-mix(in srgb, var(--bless-color-danger) 14%, transparent);
}
.bless-book__row.is-bid {
  --_tint: color-mix(in srgb, var(--bless-color-success) 18%, transparent);
}
.is-ask .bless-book__price {
  color: var(--bless-color-danger-text);
}
.bless-book__spread td {
  padding-block: var(--bless-space-2);
  border-block: var(--bless-border-width) solid var(--bless-color-border);
  text-align: center;
  font-weight: var(--bless-font-weight-bold);
}
</style>
