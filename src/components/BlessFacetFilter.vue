<template>
  <div class="bless-facets" role="group" :aria-label="text.title">
    <div class="bless-facets__top">
      <strong>{{ text.title }}</strong>
      <button v-if="active" type="button" class="bless-facets__clear" @click="clearAll">
        {{ text.clearAll(active) }}
      </button>
    </div>
    <fieldset v-for="f in facets" :key="f.id" class="bless-facets__set">
      <legend class="bless-facets__legend">{{ f.label }}</legend>
      <button
        v-if="selected[f.id]?.length"
        type="button"
        class="bless-facets__clear bless-facets__one"
        :aria-label="`${text.clear}: ${f.label}`"
        @click="clear(f.id)"
      >
        {{ text.clear }}
      </button>
      <label
        v-for="o in f.options"
        :key="o.value"
        class="bless-facets__option"
        :class="{ 'is-empty': o.count === 0 && !has(f.id, o.value) }"
      >
        <input
          type="checkbox"
          :checked="has(f.id, o.value)"
          :disabled="o.count === 0 && !has(f.id, o.value)"
          @change="flip(f.id, o.value, ($event.target as HTMLInputElement).checked)"
        />
        <span class="bless-facets__name">{{ o.label }}</span>
        <span v-if="o.count !== undefined" class="bless-facets__count">{{ o.count }}</span>
      </label>
    </fieldset>
    <fieldset v-if="priceRange" class="bless-facets__set">
      <legend class="bless-facets__legend">{{ text.price }}</legend>
      <div class="bless-facets__range">
        <label class="bless-facets__end">
          <span>{{ text.min }}</span>
          <span class="bless-facets__money">
            <span aria-hidden="true">{{ symbol }}</span>
            <input
              type="number"
              inputmode="decimal"
              min="0"
              :value="price[0] ?? ''"
              @change="setPrice(0, ($event.target as HTMLInputElement).value)"
            />
          </span>
        </label>
        <span aria-hidden="true">–</span>
        <label class="bless-facets__end">
          <span>{{ text.max }}</span>
          <span class="bless-facets__money">
            <span aria-hidden="true">{{ symbol }}</span>
            <input
              type="number"
              inputmode="decimal"
              min="0"
              :value="price[1] ?? ''"
              @change="setPrice(1, ($event.target as HTMLInputElement).value)"
            />
          </span>
        </label>
      </div>
    </fieldset>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useLabelPack } from "../composables/useLabels";

defineOptions({ name: "BlessFacetFilter" });
const pack = useLabelPack("BlessFacetFilter");

export interface BlessFacet {
  id: string;
  label: string;
  options: { value: string; label: string; count?: number }[];
}

const props = withDefaults(
  defineProps<{
    facets: BlessFacet[];
    /** show a price range with two fields */
    priceRange?: boolean;
    currency?: string;
    locale?: string;
    labels?: Partial<{
      title: string;
      price: string;
      min: string;
      max: string;
      clear: string;
      clearAll: (count: number) => string;
    }>;
  }>(),
  { currency: "USD", locale: "en" },
);
/** the chosen values of each facet, by facet id */
const selected = defineModel<Record<string, string[]>>({ default: () => ({}) });
/** [lowest, highest]; an empty end is undefined */
const price = defineModel<[number | undefined, number | undefined]>("price", {
  default: () => [undefined, undefined],
});

const text = computed(() => ({
  title: "Filters",
  price: "Price",
  min: "Lowest",
  max: "Highest",
  clear: "Clear",
  clearAll: (n: number) => `Clear all (${n})`,
  ...pack(),
  ...props.labels,
}));
const symbol = computed(
  () =>
    new Intl.NumberFormat(props.locale, { style: "currency", currency: props.currency })
      .formatToParts(0)
      .find((p) => p.type === "currency")?.value ?? props.currency,
);
const active = computed(
  () =>
    Object.values(selected.value).reduce((n, v) => n + v.length, 0) +
    (price.value[0] !== undefined || price.value[1] !== undefined ? 1 : 0),
);
const has = (f: string, v: string) => selected.value[f]?.includes(v) ?? false;
function flip(f: string, v: string, on: boolean) {
  const now = selected.value[f] ?? [];
  selected.value = { ...selected.value, [f]: on ? [...now, v] : now.filter((x) => x !== v) };
}
const clear = (f: string) => (selected.value = { ...selected.value, [f]: [] });
function clearAll() {
  selected.value = {};
  price.value = [undefined, undefined];
}
function setPrice(i: 0 | 1, raw: string) {
  const n = raw === "" ? undefined : Number(raw);
  const next = [...price.value] as [number | undefined, number | undefined];
  next[i] = n !== undefined && Number.isFinite(n) ? n : undefined;
  price.value = next;
}
</script>

<style>
.bless-facets {
  display: grid;
  gap: var(--bless-space-4);
  font-family: var(--bless-font-sans);
  font-size: var(--bless-text-sm);
  color: var(--bless-color-text);
}
.bless-facets__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--bless-space-2);
}
.bless-facets__clear {
  padding: 0;
  border: 0;
  background: none;
  color: inherit;
  font: inherit;
  font-size: var(--bless-text-xs);
  text-decoration: underline;
  cursor: pointer;
}
.bless-facets__clear:focus-visible,
.bless-facets__option input:focus-visible,
.bless-facets__money input:focus-visible {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: 2px;
}
.bless-facets__set {
  position: relative;
  display: grid;
  gap: var(--bless-space-1);
  min-inline-size: 0;
  margin: 0;
  padding: var(--bless-space-3) 0 0;
  border: 0;
  border-block-start: var(--bless-border-width) solid var(--bless-color-border);
}
.bless-facets__legend {
  float: left;
  inline-size: 100%;
  margin-block-end: var(--bless-space-2);
  padding: 0;
  font-weight: var(--bless-font-weight-bold);
}
.bless-facets__one {
  position: absolute;
  inset-block-start: var(--bless-space-3);
  inset-inline-end: 0;
}
.bless-facets__option {
  display: flex;
  align-items: center;
  gap: var(--bless-space-2);
  min-block-size: 1.75rem;
  cursor: pointer;
}
.bless-facets__option input {
  inline-size: 1rem;
  block-size: 1rem;
  accent-color: var(--bless-color-accent);
}
.bless-facets__name {
  flex: 1;
}
.bless-facets__count {
  font-size: var(--bless-text-xs);
  color: var(--bless-color-text-muted);
  font-variant-numeric: tabular-nums;
}
.bless-facets__option.is-empty {
  color: var(--bless-color-text-muted);
  cursor: default;
}
.bless-facets__range {
  display: flex;
  align-items: end;
  gap: var(--bless-space-2);
}
.bless-facets__end {
  display: grid;
  flex: 1;
  gap: var(--bless-space-1);
  font-size: var(--bless-text-xs);
  color: var(--bless-color-text-muted);
}
.bless-facets__money {
  display: flex;
  align-items: center;
  gap: var(--bless-space-1);
  padding-inline-start: var(--bless-space-2);
  border: var(--bless-border-width) solid var(--bless-color-border);
  color: var(--bless-color-text);
}
.bless-facets__money input {
  inline-size: 100%;
  min-inline-size: 0;
  min-block-size: 2.25rem;
  border: 0;
  background: none;
  color: inherit;
  font: inherit;
  font-size: var(--bless-text-sm);
}
</style>
