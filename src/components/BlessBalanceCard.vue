<template>
  <section class="bless-balance" :aria-label="label">
    <div class="bless-balance__top">
      <span class="bless-balance__label">{{ label }}</span>
      <button
        type="button"
        class="bless-balance__eye"
        :aria-pressed="masked"
        :aria-label="masked ? text.show : text.hide"
        :title="masked ? text.show : text.hide"
        @click="masked = !masked"
      >
        <svg
          viewBox="0 0 24 24"
          width="18"
          height="18"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          aria-hidden="true"
        >
          <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
          <circle cx="12" cy="12" r="3" />
          <path v-if="masked" d="M3 3l18 18" />
        </svg>
      </button>
    </div>
    <p class="bless-balance__amount">
      <template v-if="masked">
        <span aria-hidden="true">••••••</span><span class="bless-sr">{{ text.hidden }}</span>
      </template>
      <template v-else>{{ money.format(amount) }}</template>
    </p>
    <p
      v-if="change !== undefined && !masked"
      class="bless-balance__change"
      :class="change < 0 ? 'is-down' : 'is-up'"
    >
      {{ changeText }}<template v-if="period"> · {{ period }}</template>
    </p>
    <div v-if="$slots.default" class="bless-balance__actions"><slot /></div>
  </section>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useLabelPack } from "../composables/useLabels";
import { moneyFormat } from "../composables/money";
import "./sr.css";

defineOptions({ name: "BlessBalanceCard" });
const pack = useLabelPack("BlessBalanceCard");

const props = withDefaults(
  defineProps<{
    /** the name of the account, for example "Main account" */
    label: string;
    amount: number;
    /** ISO 4217 code, for example `IDR` or `USD` */
    currency?: string;
    locale?: string;
    /** the change over `period`, in the same currency */
    change?: number;
    /** the period of the change, for example "this month" */
    period?: string;
    labels?: Partial<{ show: string; hide: string; hidden: string; up: string; down: string }>;
  }>(),
  { currency: "USD", locale: "en" },
);
/** hide the amounts, for a screen that other people can see */
const masked = defineModel<boolean>("masked", { default: false });

const text = computed(() => ({
  show: "Show the balance",
  hide: "Hide the balance",
  hidden: "Hidden",
  up: "up",
  down: "down",
  ...pack(),
  ...props.labels,
}));
const money = computed(() => moneyFormat(props.locale, props.currency));
const changeText = computed(() => {
  if (props.change === undefined) return "";
  const word = props.change < 0 ? text.value.down : text.value.up;
  return `${props.change < 0 ? "−" : "+"}${money.value.format(Math.abs(props.change))} ${word}`;
});
</script>

<style>
.bless-balance {
  display: grid;
  gap: var(--bless-space-2);
  padding: var(--bless-space-4);
  border: var(--bless-border-width) solid var(--bless-color-border);
  background: var(--bless-color-bg);
  font-family: var(--bless-font-sans);
  color: var(--bless-color-text);
}
.bless-balance__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--bless-space-2);
}
.bless-balance__label {
  font-size: var(--bless-text-sm);
  color: var(--bless-color-text-muted);
}
.bless-balance__eye {
  display: inline-grid;
  place-items: center;
  inline-size: 2rem;
  block-size: 2rem;
  border: 0;
  background: none;
  color: inherit;
  cursor: pointer;
}
.bless-balance__eye:focus-visible {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: 1px;
}
.bless-balance__amount {
  margin: 0;
  font-size: var(--bless-text-xl);
  font-weight: var(--bless-font-weight-bold);
  font-variant-numeric: tabular-nums;
  line-height: var(--bless-leading-tight);
}
.bless-balance__change {
  margin: 0;
  font-size: var(--bless-text-sm);
  font-variant-numeric: tabular-nums;
}
/* the sign and the word carry the direction; the color only repeats it */
.bless-balance__change.is-down {
  color: var(--bless-color-danger-text);
}
.bless-balance__actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--bless-space-2);
  margin-block-start: var(--bless-space-2);
}
.bless-balance {
  animation: bless-enter var(--bless-duration-enter) var(--bless-ease-soft);
}
</style>
