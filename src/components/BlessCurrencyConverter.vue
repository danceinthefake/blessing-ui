<template>
  <div class="bless-fx">
    <div class="bless-fx__row">
      <label class="bless-fx__field">
        <span class="bless-fx__label">{{ text.amount }}</span>
        <input
          class="bless-fx__input"
          type="number"
          inputmode="decimal"
          min="0"
          step="any"
          :value="amount"
          @input="amount = ($event.target as HTMLInputElement).valueAsNumber || 0"
        />
      </label>
      <label class="bless-fx__field">
        <span class="bless-fx__label">{{ text.from }}</span>
        <select v-model="from" class="bless-fx__input">
          <option v-for="c in codes" :key="c" :value="c">{{ c }} · {{ name(c) }}</option>
        </select>
      </label>
      <button
        type="button"
        class="bless-fx__swap"
        :aria-label="text.swap"
        :title="text.swap"
        @click="swap"
      >
        ⇄
      </button>
      <label class="bless-fx__field">
        <span class="bless-fx__label">{{ text.to }}</span>
        <select v-model="to" class="bless-fx__input">
          <option v-for="c in codes" :key="c" :value="c">{{ c }} · {{ name(c) }}</option>
        </select>
      </label>
    </div>
    <output class="bless-fx__result" :aria-label="text.result" aria-live="polite">
      {{ fmt(to, amount * rate) }}
    </output>
    <p class="bless-fx__rate">
      {{ fmt(from, 1) }} = {{ fmt(to, rate)
      }}<template v-if="updated"> · {{ text.updated(updated) }}</template>
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useLabelPack } from "../composables/useLabels";
import { moneyFormat } from "../composables/money";

defineOptions({ name: "BlessCurrencyConverter" });
const pack = useLabelPack("BlessCurrencyConverter");

const props = withDefaults(
  defineProps<{
    /** units of each currency for one unit of a common base, for example `{ USD: 1, IDR: 16250 }` */
    rates: Record<string, number>;
    locale?: string;
    /** when the rates were last updated, as text */
    updated?: string;
    labels?: Partial<{
      amount: string;
      from: string;
      to: string;
      swap: string;
      result: string;
      updated: (when: string) => string;
    }>;
  }>(),
  { locale: "en" },
);
const amount = defineModel<number>("amount", { default: 1 });
const from = defineModel<string>("from", { default: "USD" });
const to = defineModel<string>("to", { default: "EUR" });

const text = computed(() => ({
  amount: "Amount",
  from: "From",
  to: "To",
  swap: "Swap the currencies",
  result: "Result",
  updated: (w: string) => `Rates of ${w}`,
  ...pack(),
  ...props.labels,
}));
const codes = computed(() => Object.keys(props.rates).sort());
const rate = computed(() => (props.rates[to.value] ?? NaN) / (props.rates[from.value] ?? NaN));
const fmt = (code: string, n: number) =>
  Number.isFinite(n) ? moneyFormat(props.locale, code).format(n) : "—";
const name = (code: string) =>
  new Intl.DisplayNames([props.locale], { type: "currency" }).of(code) ?? code;
function swap() {
  [from.value, to.value] = [to.value, from.value];
}
</script>

<style>
.bless-fx {
  display: grid;
  gap: var(--bless-space-3);
  max-inline-size: 40rem;
  font-family: var(--bless-font-sans);
  font-size: var(--bless-text-sm);
  color: var(--bless-color-text);
}
.bless-fx__row {
  display: grid;
  grid-template-columns: minmax(7rem, 1fr) minmax(9rem, 1.4fr) auto minmax(9rem, 1.4fr);
  align-items: end;
  gap: var(--bless-space-2);
}
@media (max-width: 560px) {
  .bless-fx__row {
    grid-template-columns: 1fr auto;
  }
  .bless-fx__row > :first-child {
    grid-column: 1 / -1;
  }
}
.bless-fx__field {
  display: grid;
  gap: var(--bless-space-1);
  min-inline-size: 0;
}
.bless-fx__label {
  font-size: var(--bless-text-xs);
  color: var(--bless-color-text-muted);
}
.bless-fx__input {
  inline-size: 100%;
  min-block-size: 2.5rem;
  padding: 0 var(--bless-space-2);
  border: var(--bless-border-width) solid var(--bless-color-border);
  background: var(--bless-color-bg);
  color: inherit;
  font: inherit;
  font-variant-numeric: tabular-nums;
}
.bless-fx__input:focus-visible,
.bless-fx__swap:focus-visible {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: 1px;
}
.bless-fx__swap {
  inline-size: 2.5rem;
  block-size: 2.5rem;
  border: var(--bless-border-width) solid var(--bless-color-border);
  background: var(--bless-color-bg);
  color: inherit;
  font-size: var(--bless-text-lg);
  cursor: pointer;
}
.bless-fx__result {
  font-size: var(--bless-text-xl);
  font-weight: var(--bless-font-weight-bold);
  font-variant-numeric: tabular-nums;
}
.bless-fx__rate {
  margin: 0;
  font-size: var(--bless-text-xs);
  color: var(--bless-color-text-muted);
  font-variant-numeric: tabular-nums;
}
</style>
