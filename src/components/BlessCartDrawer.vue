<script setup lang="ts">
import { computed } from "vue";
import { useLabelPack } from "../composables/useLabels";
import BlessButton from "./BlessButton.vue";
import BlessSheet from "./BlessSheet.vue";

defineOptions({ name: "BlessCartDrawer" });
const pack = useLabelPack("BlessCartDrawer");

export interface BlessCartLine {
  id: string;
  name: string;
  /** the price of one */
  price: number;
  quantity: number;
  image?: string;
  /** the chosen variant, for example "Black, M" */
  variant?: string;
}

const props = withDefaults(
  defineProps<{
    currency?: string;
    locale?: string;
    /** the most of one line a buyer can take */
    max?: number;
    labels?: Partial<{
      title: (count: number) => string;
      empty: string;
      subtotal: string;
      note: string;
      checkout: string;
      remove: (name: string) => string;
      less: (name: string) => string;
      more: (name: string) => string;
      quantity: (name: string) => string;
    }>;
  }>(),
  { currency: "USD", locale: "en", max: 99 },
);
const open = defineModel<boolean>("open", { default: false });
const lines = defineModel<BlessCartLine[]>({ default: () => [] });
const emit = defineEmits<{ checkout: [] }>();

const text = computed(() => ({
  title: (n: number) => `Cart (${n})`,
  empty: "Your cart is empty.",
  subtotal: "Subtotal",
  note: "Shipping and taxes are added at checkout.",
  checkout: "Check out",
  remove: (n: string) => `Remove ${n}`,
  less: (n: string) => `One less ${n}`,
  more: (n: string) => `One more ${n}`,
  quantity: (n: string) => `Quantity of ${n}`,
  ...pack(),
  ...props.labels,
}));
const money = computed(
  () => new Intl.NumberFormat(props.locale, { style: "currency", currency: props.currency }),
);
const count = computed(() => lines.value.reduce((n, l) => n + l.quantity, 0));
const subtotal = computed(() => lines.value.reduce((n, l) => n + l.price * l.quantity, 0));
const setQty = (id: string, q: number) =>
  (lines.value = lines.value.map((l) =>
    l.id === id ? { ...l, quantity: Math.min(props.max, Math.max(1, q)) } : l,
  ));
const remove = (id: string) => (lines.value = lines.value.filter((l) => l.id !== id));
</script>

<template>
  <BlessSheet v-model="open" side="right" class="bless-cart" :title="text.title(count)">
    <p v-if="!lines.length" class="bless-cart__empty">{{ text.empty }}</p>
    <ul v-else class="bless-cart__lines">
      <li v-for="l in lines" :key="l.id" class="bless-cart__line">
        <img v-if="l.image" class="bless-cart__img" :src="l.image" alt="" />
        <div class="bless-cart__info">
          <span class="bless-cart__name">{{ l.name }}</span>
          <span v-if="l.variant" class="bless-cart__variant">{{ l.variant }}</span>
          <div class="bless-cart__qty">
            <button
              type="button"
              :aria-label="text.less(l.name)"
              :disabled="l.quantity <= 1"
              @click="setQty(l.id, l.quantity - 1)"
            >
              −
            </button>
            <input
              type="number"
              inputmode="numeric"
              min="1"
              :max
              :value="l.quantity"
              :aria-label="text.quantity(l.name)"
              @change="setQty(l.id, ($event.target as HTMLInputElement).valueAsNumber || 1)"
            />
            <button
              type="button"
              :aria-label="text.more(l.name)"
              :disabled="l.quantity >= max"
              @click="setQty(l.id, l.quantity + 1)"
            >
              +
            </button>
          </div>
        </div>
        <div class="bless-cart__end">
          <span class="bless-cart__sum">{{ money.format(l.price * l.quantity) }}</span>
          <button
            type="button"
            class="bless-cart__remove"
            :aria-label="text.remove(l.name)"
            :title="text.remove(l.name)"
            @click="remove(l.id)"
          >
            ✕
          </button>
        </div>
      </li>
    </ul>
    <template #footer>
      <div class="bless-cart__foot">
        <div class="bless-cart__total">
          <span>{{ text.subtotal }}</span>
          <strong>{{ money.format(subtotal) }}</strong>
        </div>
        <p class="bless-cart__note">{{ text.note }}</p>
        <BlessButton block :disabled="!lines.length" @click="emit('checkout')">{{
          text.checkout
        }}</BlessButton>
      </div>
    </template>
  </BlessSheet>
</template>

<style>
.bless-cart__empty {
  margin: 0;
  padding: var(--bless-space-6) 0;
  text-align: center;
  color: var(--bless-color-text-muted);
}
.bless-cart__lines {
  display: grid;
  margin: 0;
  padding: 0;
  list-style: none;
}
.bless-cart__line {
  display: flex;
  gap: var(--bless-space-3);
  padding-block: var(--bless-space-3);
  border-block-end: var(--bless-border-width) solid var(--bless-color-border);
}
.bless-cart__img {
  flex: none;
  inline-size: 4rem;
  block-size: 4rem;
  object-fit: cover;
  background: var(--bless-color-surface-2);
}
.bless-cart__info {
  display: grid;
  flex: 1;
  align-content: start;
  gap: var(--bless-space-1);
  min-inline-size: 0;
  font-size: var(--bless-text-sm);
}
.bless-cart__name {
  font-weight: var(--bless-font-weight-bold);
}
.bless-cart__variant {
  font-size: var(--bless-text-xs);
  color: var(--bless-color-text-muted);
}
.bless-cart__qty {
  display: inline-flex;
  justify-self: start;
  border: var(--bless-border-width) solid var(--bless-color-border);
}
.bless-cart__qty button,
.bless-cart__qty input {
  inline-size: 2rem;
  block-size: 2rem;
  border: 0;
  background: none;
  color: inherit;
  font: inherit;
  text-align: center;
}
.bless-cart__qty input {
  inline-size: 2.5rem;
  border-inline: var(--bless-border-width) solid var(--bless-color-border);
  -moz-appearance: textfield;
  appearance: textfield;
}
.bless-cart__qty input::-webkit-inner-spin-button {
  display: none;
}
.bless-cart__qty button {
  cursor: pointer;
}
.bless-cart__qty button:disabled {
  opacity: 0.4;
  cursor: default;
}
.bless-cart__qty :focus-visible,
.bless-cart__remove:focus-visible {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: -2px;
}
.bless-cart__end {
  display: grid;
  justify-items: end;
  align-content: space-between;
  font-size: var(--bless-text-sm);
  font-variant-numeric: tabular-nums;
}
.bless-cart__remove {
  inline-size: 2rem;
  block-size: 2rem;
  border: 0;
  background: none;
  color: var(--bless-color-text-muted);
  cursor: pointer;
}
.bless-cart__foot {
  display: grid;
  gap: var(--bless-space-2);
}
.bless-cart__total {
  display: flex;
  justify-content: space-between;
  font-size: var(--bless-text-md);
  font-variant-numeric: tabular-nums;
}
.bless-cart__note {
  margin: 0;
  font-size: var(--bless-text-xs);
  color: var(--bless-color-text-muted);
}
</style>
