<script lang="ts">
export interface BlessTokenUsage {
  input: number;
  output: number;
  /** input tokens read from the cache, often at a lower price; they are not part of `input` */
  cached?: number;
}
/** prices for one million tokens */
export interface BlessTokenPrices {
  input: number;
  output: number;
  cached?: number;
}

/** The cost of each kind of token and the total, from prices for one million tokens. */
export function tokenCost(u: BlessTokenUsage, p: BlessTokenPrices) {
  const input = (u.input * p.input) / 1e6;
  const cached = ((u.cached ?? 0) * (p.cached ?? p.input)) / 1e6;
  const output = (u.output * p.output) / 1e6;
  return { input, cached, output, total: input + cached + output };
}
</script>

<script setup lang="ts">
import { computed } from "vue";
import { useLabelPack } from "../composables/useLabels";

defineOptions({ name: "BlessTokenCost" });
const pack = useLabelPack("BlessTokenCost");

const props = withDefaults(
  defineProps<{
    usage: BlessTokenUsage;
    prices: BlessTokenPrices;
    /** the model, for the caption */
    model?: string;
    currency?: string;
    locale?: string;
    labels?: Partial<{
      caption: (model?: string) => string;
      kind: string;
      tokens: string;
      price: string;
      cost: string;
      input: string;
      cached: string;
      output: string;
      total: string;
    }>;
  }>(),
  { currency: "USD", locale: "en" },
);

const text = computed(() => ({
  caption: (m?: string) => (m ? `Cost of the request, ${m}` : "Cost of the request"),
  kind: "Tokens",
  tokens: "Count",
  price: "Price per million",
  cost: "Cost",
  input: "Input",
  cached: "Cached input",
  output: "Output",
  total: "Total",
  ...pack(),
  ...props.labels,
}));
const cost = computed(() => tokenCost(props.usage, props.prices));
const num = computed(() => new Intl.NumberFormat(props.locale));
// a value that fits in cents shows as usual; a smaller one keeps three digits that count,
// such as $0.00425, so it does not show as $0.00
function money(v: number) {
  const cents = Math.abs(Math.round(v * 100) - v * 100) < 1e-6;
  return new Intl.NumberFormat(props.locale, {
    style: "currency",
    currency: props.currency,
    ...(cents ? {} : { maximumSignificantDigits: 3 }),
  }).format(v);
}
const rows = computed(() => [
  {
    key: "input" as const,
    n: props.usage.input,
    price: props.prices.input,
    cost: cost.value.input,
  },
  ...(props.usage.cached
    ? [
        {
          key: "cached" as const,
          n: props.usage.cached,
          price: props.prices.cached ?? props.prices.input,
          cost: cost.value.cached,
        },
      ]
    : []),
  {
    key: "output" as const,
    n: props.usage.output,
    price: props.prices.output,
    cost: cost.value.output,
  },
]);
const allTokens = computed(() => rows.value.reduce((a, r) => a + r.n, 0));
</script>

<template>
  <table class="bless-tokens">
    <caption>
      {{ text.caption(model) }}
    </caption>
    <thead>
      <tr>
        <th scope="col">{{ text.kind }}</th>
        <th scope="col" class="is-num">{{ text.tokens }}</th>
        <th scope="col" class="is-num">{{ text.price }}</th>
        <th scope="col" class="is-num">{{ text.cost }}</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="r in rows" :key="r.key">
        <th scope="row">{{ text[r.key] }}</th>
        <td class="is-num">{{ num.format(r.n) }}</td>
        <td class="is-num">{{ money(r.price) }}</td>
        <td class="is-num">{{ money(r.cost) }}</td>
      </tr>
    </tbody>
    <tfoot>
      <tr>
        <th scope="row">{{ text.total }}</th>
        <td class="is-num">{{ num.format(allTokens) }}</td>
        <td />
        <td class="is-num">{{ money(cost.total) }}</td>
      </tr>
    </tfoot>
  </table>
</template>

<style>
.bless-tokens {
  inline-size: 100%;
  max-inline-size: 36rem;
  border-collapse: collapse;
  font-family: var(--bless-font-sans);
  font-size: var(--bless-text-sm);
  color: var(--bless-color-text);
  font-variant-numeric: tabular-nums;
}
.bless-tokens caption {
  padding-block-end: var(--bless-space-2);
  font-weight: var(--bless-font-weight-bold);
  text-align: start;
}
.bless-tokens :is(th, td) {
  padding: var(--bless-space-2);
  border-block-end: var(--bless-border-width) solid var(--bless-color-border);
  text-align: start;
}
.bless-tokens thead th {
  font-size: var(--bless-text-xs);
}
.bless-tokens tbody th {
  font-weight: var(--bless-font-weight-normal);
}
.bless-tokens .is-num {
  text-align: end;
}
.bless-tokens tfoot :is(th, td) {
  border-block-start: 2px solid var(--bless-color-text);
  border-block-end: 0;
  font-weight: var(--bless-font-weight-bold);
}
.bless-tokens {
  animation: bless-enter var(--bless-duration-enter) var(--bless-ease-soft);
}
</style>
