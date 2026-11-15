<script setup lang="ts">
import { computed } from "vue";
import { useLabelPack } from "../composables/useLabels";

defineOptions({ name: "BlessOrderSummary" });
const pack = useLabelPack("BlessOrderSummary");

export interface BlessOrderLine {
  id: string | number;
  name: string;
  /** the price of one, in the currency of the order */
  price: number;
  quantity: number;
  /** a short line under the name, for example "Size M · Black" */
  note?: string;
  image?: string;
}

const props = withDefaults(
  defineProps<{
    lines: BlessOrderLine[];
    /** an ISO code, for example `IDR` */
    currency?: string;
    /** the language of the money, for example `id` */
    locale?: string;
    /** the money off, as a positive amount */
    discount?: number;
    /** the name of the discount, for example the code */
    discountLabel?: string;
    /** the cost of shipping; 0 shows "Free", and none hides the row */
    shipping?: number;
    tax?: number;
    labels?: Partial<{
      title: string;
      subtotal: string;
      discount: string;
      shipping: string;
      free: string;
      tax: string;
      total: string;
      quantity: (n: number) => string;
    }>;
  }>(),
  { currency: "USD", locale: "en" },
);

const text = computed(() => ({
  title: "Order summary",
  subtotal: "Subtotal",
  discount: "Discount",
  shipping: "Shipping",
  free: "Free",
  tax: "Tax",
  total: "Total",
  quantity: (n: number) => `Qty ${n}`,
  ...pack(),
  ...props.labels,
}));
const money = computed(
  () => new Intl.NumberFormat(props.locale, { style: "currency", currency: props.currency }),
);
const subtotal = computed(() => props.lines.reduce((n, l) => n + l.price * l.quantity, 0));
const total = computed(
  () =>
    Math.max(0, subtotal.value - (props.discount ?? 0)) + (props.shipping ?? 0) + (props.tax ?? 0),
);
</script>

<template>
  <section class="bless-ordersum" :aria-label="text.title">
    <p class="bless-ordersum__title">{{ text.title }}</p>
    <ul class="bless-ordersum__lines">
      <li v-for="l in lines" :key="l.id" class="bless-ordersum__line">
        <img v-if="l.image" class="bless-ordersum__img" :src="l.image" alt="" width="48" height="48" />
        <div class="bless-ordersum__what">
          <span class="bless-ordersum__name">{{ l.name }}</span>
          <span v-if="l.note" class="bless-ordersum__note">{{ l.note }}</span>
          <span class="bless-ordersum__qty">{{ text.quantity(l.quantity) }}</span>
        </div>
        <span class="bless-ordersum__price">{{ money.format(l.price * l.quantity) }}</span>
      </li>
    </ul>
    <dl class="bless-ordersum__sums">
      <div>
        <dt>{{ text.subtotal }}</dt>
        <dd>{{ money.format(subtotal) }}</dd>
      </div>
      <div v-if="discount" class="is-discount">
        <dt>{{ text.discount }}<template v-if="discountLabel"> ({{ discountLabel }})</template></dt>
        <dd>−{{ money.format(discount) }}</dd>
      </div>
      <div v-if="shipping !== undefined">
        <dt>{{ text.shipping }}</dt>
        <dd>{{ shipping === 0 ? text.free : money.format(shipping) }}</dd>
      </div>
      <div v-if="tax">
        <dt>{{ text.tax }}</dt>
        <dd>{{ money.format(tax) }}</dd>
      </div>
      <div class="bless-ordersum__total">
        <dt>{{ text.total }}</dt>
        <dd>{{ money.format(total) }}</dd>
      </div>
    </dl>
    <div v-if="$slots.footer" class="bless-ordersum__footer"><slot name="footer" :total /></div>
  </section>
</template>

<style>
.bless-ordersum {
  display: flex;
  flex-direction: column;
  gap: var(--bless-space-3);
  padding: var(--bless-space-4);
  border: var(--bless-border-width) solid var(--bless-color-border);
  border-radius: var(--bless-radius-plate);
  font-family: var(--bless-font-sans);
  font-size: var(--bless-text-sm);
  color: var(--bless-color-text);
}
.bless-ordersum__title {
  margin: 0;
  font-size: var(--bless-text-md);
  font-weight: var(--bless-font-weight-bold);
}
.bless-ordersum__lines {
  display: grid;
  gap: var(--bless-space-3);
  margin: 0;
  padding: 0 0 var(--bless-space-3);
  border-block-end: var(--bless-border-width) solid var(--bless-color-border);
  list-style: none;
}
.bless-ordersum__line {
  display: flex;
  align-items: flex-start;
  gap: var(--bless-space-3);
}
.bless-ordersum__img {
  flex: none;
  object-fit: cover;
  background: var(--bless-color-surface-2);
}
.bless-ordersum__what {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-inline-size: 0;
}
.bless-ordersum__note,
.bless-ordersum__qty {
  font-size: var(--bless-text-xs);
  color: var(--bless-color-text-muted);
}
.bless-ordersum__price,
.bless-ordersum__sums dd {
  margin: 0;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}
.bless-ordersum__sums {
  display: grid;
  gap: var(--bless-space-2);
  margin: 0;
}
.bless-ordersum__sums div {
  display: flex;
  justify-content: space-between;
  gap: var(--bless-space-4);
}
.bless-ordersum__sums dt {
  color: var(--bless-color-text-muted);
}
.bless-ordersum__sums .is-discount dd {
  color: var(--bless-color-text);
  font-weight: var(--bless-font-weight-bold);
}
.bless-ordersum__total {
  padding-block-start: var(--bless-space-2);
  border-block-start: var(--bless-border-width) solid var(--bless-color-border);
  font-size: var(--bless-text-md);
  font-weight: var(--bless-font-weight-bold);
}
.bless-ordersum__total dt {
  color: var(--bless-color-text);
}
</style>
