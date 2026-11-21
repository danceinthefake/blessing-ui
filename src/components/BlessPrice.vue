<template>
  <span class="bless-price" :class="`is-${size}`">
    <template v-if="onSale">
      <span aria-hidden="true">
        <strong class="bless-price__now">{{ money.format(amount) }}</strong>
        <s class="bless-price__was">{{ money.format(was!) }}</s>
        <span class="bless-price__off">{{ text.off(off) }}</span>
      </span>
      <span class="bless-sr"
        >{{ text.sale(money.format(amount), money.format(was!)) }}, {{ text.off(off) }}</span
      >
    </template>
    <strong v-else class="bless-price__now">{{ money.format(amount) }}</strong>
    <span v-if="unitPrice !== undefined && unit" class="bless-price__unit">
      {{ text.per(money.format(unitPrice), unit) }}
    </span>
  </span>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useLabelPack } from "../composables/useLabels";
import { moneyFormat } from "../composables/money";
import "./sr.css";

defineOptions({ name: "BlessPrice" });
const pack = useLabelPack("BlessPrice");

const props = withDefaults(
  defineProps<{
    amount: number;
    /** the price before the sale; it shows only when it is higher than `amount` */
    was?: number;
    /** the price for one unit, with `unit` */
    unitPrice?: number;
    /** the unit, for example "kg" or "100 ml" */
    unit?: string;
    currency?: string;
    locale?: string;
    size?: "sm" | "md" | "lg";
    labels?: Partial<{
      off: (percent: string) => string;
      sale: (now: string, was: string) => string;
      per: (price: string, unit: string) => string;
    }>;
  }>(),
  { currency: "USD", locale: "en", size: "md" },
);

const text = computed(() => ({
  off: (p: string) => `${p} off`,
  sale: (n: string, w: string) => `Now ${n}, was ${w}`,
  per: (p: string, u: string) => `${p} / ${u}`,
  ...pack(),
  ...props.labels,
}));
const money = computed(() => moneyFormat(props.locale, props.currency));
const onSale = computed(() => props.was !== undefined && props.was > props.amount);
const off = computed(() =>
  new Intl.NumberFormat(props.locale, { style: "percent", maximumFractionDigits: 0 }).format(
    onSale.value ? (props.was! - props.amount) / props.was! : 0,
  ),
);
</script>

<style>
.bless-price {
  display: inline-flex;
  flex-wrap: wrap;
  align-items: baseline;
  column-gap: var(--bless-space-2);
  font-family: var(--bless-font-sans);
  font-variant-numeric: tabular-nums;
  color: var(--bless-color-text);
}
.bless-price > span[aria-hidden] {
  display: inline-flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: var(--bless-space-2);
}
.bless-price__now {
  font-size: var(--bless-text-md);
}
.bless-price.is-sm .bless-price__now {
  font-size: var(--bless-text-sm);
}
.bless-price.is-lg .bless-price__now {
  font-size: var(--bless-text-xl);
}
.bless-price__was,
.bless-price__unit {
  font-size: var(--bless-text-xs);
  color: var(--bless-color-text-muted);
}
.bless-price__off {
  padding: 0 var(--bless-space-1);
  background: var(--bless-color-danger);
  color: var(--bless-color-on-accent);
  font-size: var(--bless-text-xs);
  font-weight: var(--bless-font-weight-bold);
}
.bless-price__unit {
  flex-basis: 100%;
}
</style>
