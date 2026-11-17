<script lang="ts">
export interface BlessBomPart {
  id: string;
  name: string;
  sku?: string;
  /** how many go into one of the parent */
  quantity: number;
  unit?: string;
  /** the cost of one, for a part with no children */
  cost?: number;
  children?: BlessBomPart[];
}
/** The raw parts (leaves) needed for `count` of the top item, with their total quantity and cost. */
export function bomNeeds(parts: BlessBomPart[], count = 1) {
  const need = new Map<string, { part: BlessBomPart; quantity: number }>();
  const walk = (list: BlessBomPart[], times: number) => {
    for (const p of list) {
      const q = times * p.quantity;
      if (p.children?.length) walk(p.children, q);
      else {
        const key = p.sku ?? p.id;
        need.set(key, { part: p, quantity: (need.get(key)?.quantity ?? 0) + q });
      }
    }
  };
  walk(parts, count);
  const list = [...need.values()];
  return { list, cost: list.reduce((n, x) => n + x.quantity * (x.part.cost ?? 0), 0) };
}
</script>

<script setup lang="ts">
import { computed, ref } from "vue";
import { moneyFormat } from "../composables/money";
import { useLabelPack } from "../composables/useLabels";

defineOptions({ name: "BlessBillOfMaterials" });
const pack = useLabelPack("BlessBillOfMaterials");

const props = withDefaults(
  defineProps<{
    /** the product at the top */
    product: string;
    parts: BlessBomPart[];
    currency?: string;
    locale?: string;
    labels?: Partial<{
      title: string;
      build: string;
      per: (q: string) => string;
      total: (q: string) => string;
      cost: (amount: string) => string;
      open: (name: string) => string;
    }>;
  }>(),
  { currency: "USD", locale: "en" },
);
/** how many of the product to build */
const count = defineModel<number>("count", { default: 1 });

const text = computed(() => ({
  title: "Bill of materials",
  build: "Units to build",
  per: (q: string) => `${q} each`,
  total: (q: string) => `${q} in all`,
  cost: (a: string) => `Parts cost ${a}`,
  open: (n: string) => `Parts of ${n}`,
  ...pack(),
  ...props.labels,
}));
const money = computed(() => moneyFormat(props.locale, props.currency));
const num = computed(() => new Intl.NumberFormat(props.locale, { maximumFractionDigits: 3 }));
const needs = computed(() => bomNeeds(props.parts, count.value));
// all groups start open
const closed = ref(new Set<string>());
const flip = (id: string) => {
  const s = new Set(closed.value);
  if (s.has(id)) s.delete(id);
  else s.add(id);
  closed.value = s;
};
interface Row {
  part: BlessBomPart;
  depth: number;
  total: number;
}
// a flat list of the open rows, with the depth and the total for the units to build
const rows = computed(() => {
  const out: Row[] = [];
  const walk = (list: BlessBomPart[], depth: number, times: number) => {
    for (const p of list) {
      const total = times * p.quantity;
      out.push({ part: p, depth, total });
      if (p.children?.length && !closed.value.has(p.id)) walk(p.children, depth + 1, total);
    }
  };
  walk(props.parts, 0, count.value);
  return out;
});
const qty = (n: number, unit?: string) =>
  unit ? `${num.value.format(n)} ${unit}` : num.value.format(n);
</script>

<template>
  <section class="bless-bom" :aria-label="text.title">
    <div class="bless-bom__head">
      <strong class="bless-bom__product">{{ product }}</strong>
      <label class="bless-bom__count">
        <span>{{ text.build }}</span>
        <input
          type="number"
          min="1"
          step="1"
          :value="count"
          @change="
            count = Math.max(1, Math.round(($event.target as HTMLInputElement).valueAsNumber) || 1)
          "
        />
      </label>
    </div>
    <ul class="bless-stagger bless-bom__list" role="list">
      <li
        v-for="r in rows"
        :key="`${r.part.id}-${r.depth}`"
        class="bless-bom__row"
        :style="{ '--_depth': r.depth }"
      >
        <button
          v-if="r.part.children?.length"
          type="button"
          class="bless-bom__toggle"
          :aria-expanded="!closed.has(r.part.id)"
          :aria-label="text.open(r.part.name)"
          @click="flip(r.part.id)"
        >
          {{ closed.has(r.part.id) ? "▸" : "▾" }}
        </button>
        <span v-else class="bless-bom__leaf" aria-hidden="true">·</span>
        <span class="bless-bom__name">
          {{ r.part.name
          }}<template v-if="r.part.sku"
            >{{ " " }}<span class="bless-bom__sku">{{ r.part.sku }}</span></template
          >
        </span>
        <span class="bless-bom__per">{{ text.per(qty(r.part.quantity, r.part.unit)) }}</span>
        <span class="bless-bom__total">{{ text.total(qty(r.total, r.part.unit)) }}</span>
      </li>
    </ul>
    <p class="bless-bom__cost" role="status">{{ text.cost(money.format(needs.cost)) }}</p>
  </section>
</template>

<style>
.bless-bom {
  display: grid;
  gap: var(--bless-space-2);
  font-family: var(--bless-font-sans);
  font-size: var(--bless-text-sm);
  color: var(--bless-color-text);
}
.bless-bom__head {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: var(--bless-space-2);
}
.bless-bom__product {
  font-size: var(--bless-text-md);
}
.bless-bom__count {
  display: inline-flex;
  align-items: center;
  gap: var(--bless-space-2);
  font-size: var(--bless-text-xs);
}
.bless-bom__count input {
  inline-size: 5rem;
  min-block-size: 2.25rem;
  padding: 0 var(--bless-space-2);
  border: var(--bless-border-width) solid var(--bless-color-border);
  background: var(--bless-color-bg);
  color: inherit;
  font: inherit;
  font-size: var(--bless-text-sm);
}
.bless-bom__list {
  display: grid;
  margin: 0;
  padding: 0;
  border: var(--bless-border-width) solid var(--bless-color-border);
  list-style: none;
}
.bless-bom__row {
  display: grid;
  grid-template-columns: 1.75rem 1fr auto auto;
  align-items: center;
  gap: var(--bless-space-3);
  border-block-end: var(--bless-border-width) solid var(--bless-color-border);
  font-variant-numeric: tabular-nums;
}
/* the indent sits on the first cell, so a list reset of the host page keeps it */
.bless-bom__row > :first-child {
  margin-inline-start: calc(var(--bless-space-2) + var(--_depth) * 1.25rem);
}
.bless-bom__row > * {
  margin-block: var(--bless-space-1);
}
.bless-bom__row > :last-child {
  margin-inline-end: var(--bless-space-3);
}
.bless-bom__toggle {
  inline-size: 1.75rem;
  block-size: 1.75rem;
  border: 0;
  background: none;
  color: inherit;
  cursor: pointer;
}
.bless-bom__toggle:focus-visible,
.bless-bom__count input:focus-visible {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: 1px;
}
.bless-bom__leaf {
  text-align: center;
  color: var(--bless-color-text-muted);
}
.bless-bom__name {
  min-inline-size: 0;
}
.bless-bom__sku {
  font-family: var(--bless-font-mono, ui-monospace, monospace);
  font-size: var(--bless-text-xs);
  color: var(--bless-color-text-muted);
}
.bless-bom__per {
  font-size: var(--bless-text-xs);
  color: var(--bless-color-text-muted);
}
.bless-bom__total {
  font-weight: var(--bless-font-weight-bold);
}
.bless-bom__cost {
  margin: 0;
  justify-self: end;
  font-size: var(--bless-text-md);
  font-weight: var(--bless-font-weight-bold);
}
</style>
