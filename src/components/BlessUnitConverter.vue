<template>
  <div class="bless-units">
    <div class="bless-units__row">
      <label class="bless-units__field">
        <span>{{ text.amount }}</span>
        <input
          type="number"
          min="0"
          step="any"
          :value="amount"
          @input="amount = Math.max(0, ($event.target as HTMLInputElement).valueAsNumber || 0)"
        />
      </label>
      <label class="bless-units__field">
        <span>{{ text.from }}</span>
        <select :value="fromUnit?.id" @change="from = ($event.target as HTMLSelectElement).value">
          <option v-for="u in units" :key="u.id" :value="u.id">{{ u.name }}</option>
        </select>
      </label>
      <button
        type="button"
        class="bless-units__swap"
        :aria-label="text.swap"
        :title="text.swap"
        @click="swap"
      >
        ⇄
      </button>
      <label class="bless-units__field">
        <span>{{ text.to }}</span>
        <select :value="toUnit?.id" @change="to = ($event.target as HTMLSelectElement).value">
          <option v-for="u in units" :key="u.id" :value="u.id">{{ u.name }}</option>
        </select>
      </label>
    </div>
    <output class="bless-units__result" :aria-label="text.result" aria-live="polite">
      {{ num.format(amount) }} {{ fromUnit?.name }} =
      <strong>{{ num.format(result) }} {{ toUnit?.name }}</strong>
    </output>
    <p class="bless-units__split"><span>{{ text.split }}:</span> {{ splitText }}</p>
  </div>
</template>

<script lang="ts">
export interface BlessUnit {
  id: string;
  name: string;
  /** how many of the base unit are in one of this unit */
  perBase: number;
}
/**
 * Splits an amount of base units into the largest whole units first, for example
 * 293 pieces into 2 cartons (144), 0 boxes, 5 pieces; zero parts are left out.
 */
export function splitUnits(base: number, units: BlessUnit[]) {
  let rest = Math.round(base * 1e6) / 1e6;
  const parts: { unit: BlessUnit; count: number }[] = [];
  for (const u of [...units].sort((a, b) => b.perBase - a.perBase)) {
    const count = Math.floor(rest / u.perBase + 1e-9);
    if (count > 0) {
      parts.push({ unit: u, count });
      rest -= count * u.perBase;
    }
  }
  return { parts, rest: Math.round(rest * 1e6) / 1e6 };
}
</script>

<script setup lang="ts">
import { computed } from "vue";
import { useLabelPack } from "../composables/useLabels";

defineOptions({ name: "BlessUnitConverter" });
const pack = useLabelPack("BlessUnitConverter");

const props = withDefaults(
  defineProps<{
    units: BlessUnit[];
    locale?: string;
    labels?: Partial<{
      amount: string;
      from: string;
      to: string;
      swap: string;
      result: string;
      split: string;
    }>;
  }>(),
  { locale: "en" },
);
const amount = defineModel<number>("amount", { default: 1 });
const from = defineModel<string>("from");
const to = defineModel<string>("to");

const text = computed(() => ({
  amount: "Amount",
  from: "From",
  to: "To",
  swap: "Swap the units",
  result: "Result",
  split: "In whole units",
  ...pack(),
  ...props.labels,
}));
const num = computed(() => new Intl.NumberFormat(props.locale, { maximumFractionDigits: 3 }));
const byId = (id?: string) => props.units.find((u) => u.id === id);
const fromUnit = computed(() => byId(from.value) ?? props.units[0]);
const toUnit = computed(() => byId(to.value) ?? props.units.at(-1));
const base = computed(() => amount.value * (fromUnit.value?.perBase ?? 1));
const result = computed(() => (toUnit.value ? base.value / toUnit.value.perBase : 0));
const split = computed(() => splitUnits(base.value, props.units));
const splitText = computed(() => {
  const parts = split.value.parts.map((p) => `${num.value.format(p.count)} ${p.unit.name}`);
  const smallest = [...props.units].sort((a, b) => a.perBase - b.perBase)[0];
  if (split.value.rest > 0 && smallest)
    parts.push(`${num.value.format(split.value.rest / smallest.perBase)} ${smallest.name}`);
  return parts.join(", ") || "0";
});
function swap() {
  const f = fromUnit.value?.id;
  from.value = toUnit.value?.id;
  to.value = f;
}
</script>

<style>
.bless-units {
  display: grid;
  gap: var(--bless-space-3);
  max-inline-size: 36rem;
  font-family: var(--bless-font-sans);
  font-size: var(--bless-text-sm);
  color: var(--bless-color-text);
}
.bless-units__row {
  display: grid;
  grid-template-columns: minmax(6rem, 1fr) minmax(7rem, 1.3fr) auto minmax(7rem, 1.3fr);
  align-items: end;
  gap: var(--bless-space-2);
}
@media (max-width: 480px) {
  .bless-units__row {
    grid-template-columns: 1fr auto;
  }
  .bless-units__row > :first-child {
    grid-column: 1 / -1;
  }
}
.bless-units__field {
  display: grid;
  gap: var(--bless-space-1);
  min-inline-size: 0;
  font-size: var(--bless-text-xs);
  color: var(--bless-color-text-muted);
}
.bless-units__field input,
.bless-units__field select {
  inline-size: 100%;
  min-block-size: 2.5rem;
  padding: 0 var(--bless-space-2);
  border: var(--bless-border-width) solid var(--bless-color-border);
  background: var(--bless-color-bg);
  color: var(--bless-color-text);
  font: inherit;
  font-size: var(--bless-text-sm);
}
.bless-units__swap {
  inline-size: 2.5rem;
  block-size: 2.5rem;
  border: var(--bless-border-width) solid var(--bless-color-border);
  background: var(--bless-color-bg);
  color: inherit;
  font-size: var(--bless-text-lg);
  cursor: pointer;
}
.bless-units__field input:focus-visible,
.bless-units__field select:focus-visible,
.bless-units__swap:focus-visible {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: 1px;
}
.bless-units__result {
  font-size: var(--bless-text-lg);
  font-variant-numeric: tabular-nums;
}
.bless-units__split {
  margin: 0;
  padding: var(--bless-space-2) var(--bless-space-3);
  background: var(--bless-color-surface-2);
}
.bless-units__split span {
  font-weight: var(--bless-font-weight-bold);
}
</style>
