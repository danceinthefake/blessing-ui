<script setup lang="ts">
import { computed } from "vue";
import { useLabelPack } from "../composables/useLabels";
import "./sr.css";

defineOptions({ name: "BlessOrderHistory" });
const pack = useLabelPack("BlessOrderHistory");

export type BlessOrderStatus = "processing" | "shipped" | "delivered" | "cancelled";
export interface BlessPastOrder {
  id: string;
  /** the number that the buyer sees, for example "#10421" */
  number: string;
  /** when, as text */
  date: string;
  status: BlessOrderStatus;
  total: number;
  items: { name: string; quantity: number; image?: string }[];
  /** the page of the order */
  href?: string;
}

const props = withDefaults(
  defineProps<{
    orders: BlessPastOrder[];
    currency?: string;
    locale?: string;
    labels?: Partial<
      Record<BlessOrderStatus, string> & {
        title: string;
        again: string;
        view: string;
        items: (count: number) => string;
        more: (count: number) => string;
      }
    >;
  }>(),
  { currency: "USD", locale: "en" },
);
const emit = defineEmits<{ again: [id: string] }>();

const text = computed(() => ({
  title: "Orders",
  processing: "Processing",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
  again: "Buy again",
  view: "View order",
  items: (n: number) => (n === 1 ? "1 item" : `${n} items`),
  more: (n: number) => `+${n}`,
  ...pack(),
  ...props.labels,
}));
const MARK: Record<BlessOrderStatus, string> = {
  processing: "…",
  shipped: "→",
  delivered: "✓",
  cancelled: "✕",
};
const money = computed(
  () => new Intl.NumberFormat(props.locale, { style: "currency", currency: props.currency }),
);
const count = (o: BlessPastOrder) => o.items.reduce((n, i) => n + i.quantity, 0);
</script>

<template>
  <section class="bless-orders" :aria-label="text.title">
    <article v-for="o in orders" :key="o.id" class="bless-orders__order" :class="`is-${o.status}`">
      <header class="bless-orders__head">
        <h3 class="bless-orders__number">{{ o.number }}</h3>
        <span class="bless-orders__date">{{ o.date }}</span>
        <span class="bless-orders__status">
          <span aria-hidden="true">{{ MARK[o.status] }}</span> {{ text[o.status] }}
        </span>
      </header>
      <div class="bless-orders__body">
        <div
          class="bless-orders__thumbs"
          role="img"
          :aria-label="o.items.map((i) => `${i.quantity} × ${i.name}`).join(', ')"
        >
          <span v-for="(it, k) in o.items.slice(0, 3)" :key="k" class="bless-orders__thumb">
            <img v-if="it.image" :src="it.image" alt="" />
            <span v-else>{{ it.name.charAt(0) }}</span>
          </span>
          <span v-if="o.items.length > 3" class="bless-orders__thumb is-more">
            {{ text.more(o.items.length - 3) }}
          </span>
        </div>
        <div class="bless-orders__sum">
          <span>{{ text.items(count(o)) }}</span>{{ " " }}
          <strong>{{ money.format(o.total) }}</strong>
        </div>
      </div>
      <footer class="bless-orders__actions">
        <a v-if="o.href" class="bless-orders__link" :href="o.href">
          {{ text.view }}{{ " " }}<span class="bless-sr">{{ o.number }}</span>
        </a>
        <button
          v-if="o.status !== 'processing'"
          type="button"
          class="bless-orders__again"
          @click="emit('again', o.id)"
        >
          {{ text.again }}{{ " " }}<span class="bless-sr">{{ o.number }}</span>
        </button>
      </footer>
    </article>
  </section>
</template>

<style>
.bless-orders {
  display: grid;
  gap: var(--bless-space-3);
  font-family: var(--bless-font-sans);
  font-size: var(--bless-text-sm);
  color: var(--bless-color-text);
}
.bless-orders__order {
  display: grid;
  gap: var(--bless-space-3);
  padding: var(--bless-space-3) var(--bless-space-4);
  border: var(--bless-border-width) solid var(--bless-color-border);
}
.bless-orders__head {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: var(--bless-space-2) var(--bless-space-3);
}
.bless-orders__number {
  margin: 0;
  font-size: var(--bless-text-md);
}
.bless-orders__date {
  color: var(--bless-color-text-muted);
  font-size: var(--bless-text-xs);
}
.bless-orders__status {
  margin-inline-start: auto;
  padding: 0 var(--bless-space-2);
  border: var(--bless-border-width) solid currentColor;
  font-size: var(--bless-text-xs);
  font-weight: var(--bless-font-weight-bold);
}
.is-cancelled .bless-orders__status {
  color: var(--bless-color-danger-text);
}
.is-delivered .bless-orders__status {
  background: var(--bless-color-text);
  color: var(--bless-color-bg);
  border-color: var(--bless-color-text);
}
.bless-orders__body {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--bless-space-3);
}
.bless-orders__thumbs {
  display: flex;
  gap: var(--bless-space-1);
}
.bless-orders__thumb {
  display: grid;
  place-items: center;
  inline-size: 3rem;
  block-size: 3rem;
  overflow: hidden;
  background: var(--bless-color-surface-2);
  font-weight: var(--bless-font-weight-bold);
}
.bless-orders__thumb img {
  inline-size: 100%;
  block-size: 100%;
  object-fit: cover;
}
.bless-orders__thumb.is-more {
  font-size: var(--bless-text-xs);
}
.bless-orders__sum {
  display: grid;
  justify-items: end;
  font-variant-numeric: tabular-nums;
}
.bless-orders__sum span {
  font-size: var(--bless-text-xs);
  color: var(--bless-color-text-muted);
}
.bless-orders__actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--bless-space-3);
}
.bless-orders__actions:empty {
  display: none;
}
.bless-orders__link,
.bless-orders__again {
  padding: var(--bless-space-1) var(--bless-space-3);
  border: var(--bless-border-width) solid var(--bless-color-border);
  background: var(--bless-color-bg);
  color: inherit;
  font: inherit;
  font-size: var(--bless-text-xs);
  text-decoration: none;
  cursor: pointer;
}
.bless-orders__link:focus-visible,
.bless-orders__again:focus-visible {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: 2px;
}
</style>
