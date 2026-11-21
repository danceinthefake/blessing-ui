<template>
  <BlessMarquee class="bless-ticker" :speed :label="text.title">
    <span v-for="t in items" :key="t.symbol" class="bless-ticker__item">
      <strong class="bless-ticker__symbol">{{ t.symbol }}</strong>{{ " " }}
      <span class="bless-ticker__price">{{ price.format(t.price) }}</span>{{ " " }}
      <span
        class="bless-ticker__change"
        :class="t.change < 0 ? 'is-down' : t.change > 0 ? 'is-up' : ''"
      >
        <span aria-hidden="true">{{ t.change < 0 ? "▼" : t.change > 0 ? "▲" : "■" }}</span>
        {{ pct.format(t.change / 100) }}
      </span>
    </span>
  </BlessMarquee>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useLabelPack } from "../composables/useLabels";
import BlessMarquee from "./BlessMarquee.vue";

defineOptions({ name: "BlessPriceTicker" });
const pack = useLabelPack("BlessPriceTicker");

export interface BlessTick {
  symbol: string;
  price: number;
  /** the change in percent, for example `-1.25` */
  change: number;
}

const props = withDefaults(
  defineProps<{
    items: BlessTick[];
    /** ISO 4217 code; without it, the price is a plain number */
    currency?: string;
    locale?: string;
    /** px per second */
    speed?: number;
    labels?: Partial<{ title: string }>;
  }>(),
  { locale: "en", speed: 40 },
);

const text = computed(() => ({ title: "Prices", ...pack(), ...props.labels }));
const price = computed(
  () =>
    new Intl.NumberFormat(props.locale, {
      ...(props.currency ? { style: "currency", currency: props.currency } : {}),
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }),
);
const pct = computed(
  () =>
    new Intl.NumberFormat(props.locale, {
      style: "percent",
      signDisplay: "exceptZero",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }),
);
</script>

<style>
.bless-ticker {
  font-family: var(--bless-font-sans);
  font-size: var(--bless-text-sm);
  font-variant-numeric: tabular-nums;
}
.bless-ticker__item {
  display: inline-flex;
  align-items: baseline;
  gap: var(--bless-space-2);
  padding-inline: var(--bless-space-4);
  border-inline-end: var(--bless-border-width) solid var(--bless-color-border);
  white-space: nowrap;
}
.bless-ticker__change {
  font-size: var(--bless-text-xs);
}
/* the arrow and the sign carry the direction; the color only repeats it */
.bless-ticker__change.is-down {
  color: var(--bless-color-danger-text);
}
.bless-ticker__change.is-up {
  font-weight: var(--bless-font-weight-bold);
}
.bless-ticker {
  animation: bless-enter var(--bless-duration-enter) var(--bless-ease-soft);
}
</style>
