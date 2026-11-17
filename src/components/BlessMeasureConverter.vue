<script lang="ts">
export type BlessMeasureKind = "length" | "mass" | "volume" | "temperature";

/** each unit in the base unit of its kind: meter, kilogram, or liter (exact by definition) */
export const MEASURES: Record<Exclude<BlessMeasureKind, "temperature">, Record<string, number>> = {
  length: {
    millimeter: 0.001,
    centimeter: 0.01,
    meter: 1,
    kilometer: 1000,
    inch: 0.0254,
    foot: 0.3048,
    yard: 0.9144,
    mile: 1609.344,
  },
  mass: { gram: 0.001, kilogram: 1, ounce: 0.028349523125, pound: 0.45359237, stone: 6.35029318 },
  volume: {
    milliliter: 0.001,
    liter: 1,
    "fluid-ounce": 0.0295735295625,
    cup: 0.2365882365,
    gallon: 3.785411784,
  },
};
const TEMPS = ["celsius", "fahrenheit", "kelvin"];

/** Converts an amount between two units of one kind; temperatures go through Celsius. */
export function convertMeasure(value: number, from: string, to: string): number {
  if (TEMPS.includes(from)) {
    const c =
      from === "fahrenheit" ? ((value - 32) * 5) / 9 : from === "kelvin" ? value - 273.15 : value;
    return to === "fahrenheit" ? (c * 9) / 5 + 32 : to === "kelvin" ? c + 273.15 : c;
  }
  const table = Object.values(MEASURES).find((t) => from in t && to in t);
  if (!table) throw new Error(`Cannot convert ${from} to ${to}`);
  return (value * table[from]!) / table[to]!;
}
</script>

<script setup lang="ts">
import { computed, watch } from "vue";
import { useLabelPack } from "../composables/useLabels";

defineOptions({ name: "BlessMeasureConverter" });
const pack = useLabelPack("BlessMeasureConverter");

const props = withDefaults(
  defineProps<{
    locale?: string;
    labels?: Partial<
      Record<BlessMeasureKind, string> & {
        kind: string;
        amount: string;
        from: string;
        to: string;
        swap: string;
        cup: string;
        kelvin: string;
      }
    >;
  }>(),
  { locale: "en" },
);
const kind = defineModel<BlessMeasureKind>("kind", { default: "length" });
const amount = defineModel<number>("amount", { default: 1 });
const from = defineModel<string>("from", { default: "kilometer" });
const to = defineModel<string>("to", { default: "mile" });

const text = computed(() => ({
  length: "Length",
  mass: "Mass",
  volume: "Volume",
  temperature: "Temperature",
  kind: "Measure",
  amount: "Amount",
  from: "From",
  to: "To",
  swap: "Swap the units",
  cup: "cups (US)",
  kelvin: "kelvins (K)",
  ...pack(),
  ...props.labels,
}));
const KINDS: BlessMeasureKind[] = ["length", "mass", "volume", "temperature"];
const PAIRS: Record<BlessMeasureKind, [string, string]> = {
  length: ["kilometer", "mile"],
  mass: ["kilogram", "pound"],
  volume: ["liter", "gallon"],
  temperature: ["celsius", "fahrenheit"],
};
const units = computed(() =>
  kind.value === "temperature" ? TEMPS : Object.keys(MEASURES[kind.value]),
);
watch(kind, (k) => {
  if (!units.value.includes(from.value) || !units.value.includes(to.value))
    [from.value, to.value] = PAIRS[k];
});
// the name of a unit in the language of the page; Intl has no kelvin, so it gets the symbol
function unitName(u: string) {
  if (u === "kelvin" || u === "cup") return text.value[u];
  const parts = new Intl.NumberFormat(props.locale, {
    style: "unit",
    unit: u,
    unitDisplay: "long",
  }).formatToParts(2);
  return parts.find((p) => p.type === "unit")?.value ?? u;
}
function show(v: number, u: string) {
  const num = new Intl.NumberFormat(props.locale, { maximumSignificantDigits: 6 });
  if (u === "kelvin") return `${num.format(v)} K`;
  if (u === "cup") return `${num.format(v)} ${unitName(u)}`;
  return new Intl.NumberFormat(props.locale, {
    style: "unit",
    unit: u,
    unitDisplay: "long",
    maximumSignificantDigits: 6,
  }).format(v);
}
const result = computed(() => {
  const v = Number(amount.value);
  return Number.isFinite(v) ? show(convertMeasure(v, from.value, to.value), to.value) : "";
});
const swap = () => ([from.value, to.value] = [to.value, from.value]);
</script>

<template>
  <div class="bless-measure">
    <div class="bless-measure__kinds" role="group" :aria-label="text.kind">
      <button
        v-for="k in KINDS"
        :key="k"
        type="button"
        :aria-pressed="kind === k"
        @click="kind = k"
      >
        {{ text[k] }}
      </button>
    </div>
    <div class="bless-measure__row">
      <label class="bless-measure__field">
        <span>{{ text.amount }}</span>
        <input v-model.number="amount" type="number" step="any" inputmode="decimal" />
      </label>
      <label class="bless-measure__field">
        <span>{{ text.from }}</span>
        <select v-model="from">
          <option v-for="u in units" :key="u" :value="u">{{ unitName(u) }}</option>
        </select>
      </label>
      <button type="button" class="bless-measure__swap" :aria-label="text.swap" @click="swap">
        ⇄
      </button>
      <label class="bless-measure__field">
        <span>{{ text.to }}</span>
        <select v-model="to">
          <option v-for="u in units" :key="u" :value="u">{{ unitName(u) }}</option>
        </select>
      </label>
    </div>
    <output class="bless-measure__result" aria-live="polite">{{ result }}</output>
  </div>
</template>

<style>
.bless-measure {
  display: grid;
  gap: var(--bless-space-3);
  max-inline-size: 40rem;
  font-family: var(--bless-font-sans);
  font-size: var(--bless-text-sm);
  color: var(--bless-color-text);
}
.bless-measure__kinds {
  display: flex;
  flex-wrap: wrap;
}
.bless-measure button,
.bless-measure input,
.bless-measure select {
  min-block-size: 2.5rem;
  padding: 0 var(--bless-space-3);
  border: var(--bless-border-width) solid var(--bless-color-border);
  background: var(--bless-color-bg);
  color: inherit;
  font: inherit;
}
.bless-measure button {
  cursor: pointer;
}
.bless-measure__kinds button + button {
  border-inline-start: 0;
}
.bless-measure__kinds button[aria-pressed="true"] {
  background: var(--bless-color-text);
  color: var(--bless-color-bg);
}
.bless-measure :is(button, input, select):focus-visible {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: 2px;
}
.bless-measure__row {
  display: grid;
  grid-template-columns: minmax(6rem, 1fr) minmax(8rem, 1.4fr) auto minmax(8rem, 1.4fr);
  align-items: end;
  gap: var(--bless-space-2);
}
@media (max-width: 36rem) {
  .bless-measure__row {
    grid-template-columns: 1fr auto;
  }
  .bless-measure__row > :first-child {
    grid-column: 1 / -1;
  }
}
.bless-measure__field {
  display: grid;
  gap: var(--bless-space-1);
  min-inline-size: 0;
  font-size: var(--bless-text-xs);
  font-weight: var(--bless-font-weight-bold);
}
.bless-measure__field :is(input, select) {
  min-inline-size: 0;
  font-size: var(--bless-text-sm);
  font-weight: var(--bless-font-weight-normal);
}
.bless-measure__swap {
  font-size: var(--bless-text-lg);
}
.bless-measure__result {
  font-size: var(--bless-text-xl);
  font-weight: var(--bless-font-weight-bold);
  font-variant-numeric: tabular-nums;
}
</style>
