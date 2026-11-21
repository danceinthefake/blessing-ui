<template>
  <section class="bless-stores" :aria-label="text.title">
    <input
      v-model="query"
      class="bless-stores__search"
      type="search"
      :aria-label="text.search"
      :placeholder="text.search"
    />
    <p class="bless-stores__none" role="status">{{ shown.length ? "" : text.none }}</p>
    <ul class="bless-stores__list">
      <li
        v-for="s in shown"
        :key="s.id"
        class="bless-stores__store"
        :class="{ 'is-selected': selected === s.id }"
      >
        <label class="bless-stores__pick">
          <input v-model="selected" type="radio" :name="`${id}-store`" :value="s.id" />
          <span class="bless-stores__main">
            <strong class="bless-stores__name">{{ s.name }}</strong>
            <span class="bless-stores__address">{{ s.address }}</span>
            <span class="bless-stores__meta">
              <template v-if="s.distance !== undefined">{{
                text.away(km.format(s.distance))
              }}</template>
              <template v-if="s.distance !== undefined && (s.open !== undefined || s.hours)">
                ·
              </template>
              <span
                v-if="s.open !== undefined"
                class="bless-stores__state"
                :class="s.open ? 'is-open' : 'is-closed'"
              >
                {{ s.open ? text.open : text.closed }}</span
              ><template v-if="s.hours"> · {{ s.hours }}</template>
            </span>
          </span>
        </label>
        <span v-if="s.directions || s.phone" class="bless-stores__links">
          <a v-if="s.directions" :href="s.directions" target="_blank" rel="noopener"
            >{{ text.directions }}<span class="bless-sr">: {{ s.name }}</span></a
          >
          <a v-if="s.phone" :href="`tel:${s.phone.replace(/[^\d+]/g, '')}`"
            >{{ text.call }}<span class="bless-sr">: {{ s.name }}</span></a
          >
        </span>
      </li>
    </ul>
  </section>
</template>

<script setup lang="ts">
import { computed, ref, useId } from "vue";
import { useLabelPack } from "../composables/useLabels";
import "./sr.css";

defineOptions({ name: "BlessStoreLocator" });
const pack = useLabelPack("BlessStoreLocator");

export interface BlessStore {
  id: string;
  name: string;
  address: string;
  /** the distance from the buyer, in km */
  distance?: number;
  /** the hours of today, as text */
  hours?: string;
  open?: boolean;
  phone?: string;
  /** a link to the directions, in the map service of your choice */
  directions?: string;
}

const props = withDefaults(
  defineProps<{
    stores: BlessStore[];
    locale?: string;
    labels?: Partial<{
      title: string;
      search: string;
      open: string;
      closed: string;
      directions: string;
      call: string;
      none: string;
      away: (distance: string) => string;
    }>;
  }>(),
  { locale: "en" },
);
/** the id of the chosen store, for pickup */
const selected = defineModel<string>();

const text = computed(() => ({
  title: "Stores",
  search: "Search by name or address",
  open: "Open now",
  closed: "Closed",
  directions: "Directions",
  call: "Call",
  none: "No store matches the search.",
  away: (d: string) => `${d} away`,
  ...pack(),
  ...props.labels,
}));
const id = useId();
const query = ref("");
const km = computed(
  () =>
    new Intl.NumberFormat(props.locale, {
      style: "unit",
      unit: "kilometer",
      maximumFractionDigits: 1,
    }),
);
// nearest first; stores without a distance go last
const shown = computed(() => {
  const q = query.value.trim().toLowerCase();
  return props.stores
    .filter((s) => !q || `${s.name} ${s.address}`.toLowerCase().includes(q))
    .sort((a, b) => (a.distance ?? Infinity) - (b.distance ?? Infinity));
});
</script>

<style>
.bless-stores {
  display: grid;
  gap: var(--bless-space-3);
  font-family: var(--bless-font-sans);
  font-size: var(--bless-text-sm);
  color: var(--bless-color-text);
}
.bless-stores__search {
  min-block-size: 2.5rem;
  padding: 0 var(--bless-space-3);
  border: var(--bless-border-width) solid var(--bless-color-border);
  background: var(--bless-color-bg);
  color: inherit;
  font: inherit;
}
.bless-stores__search:focus-visible,
.bless-stores__pick input:focus-visible,
.bless-stores__links a:focus-visible {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: 2px;
}
.bless-stores__none:empty {
  display: none;
}
.bless-stores__none {
  margin: 0;
  color: var(--bless-color-text-muted);
}
.bless-stores__list {
  display: grid;
  gap: var(--bless-space-2);
  margin: 0;
  padding: 0;
  list-style: none;
}
.bless-stores__store {
  display: grid;
  gap: var(--bless-space-2);
  border: var(--bless-border-width) solid var(--bless-color-border);
}
.bless-stores__store.is-selected {
  border-color: var(--bless-color-text);
  box-shadow: inset 3px 0 0 var(--bless-color-accent);
}
.bless-stores__pick {
  display: flex;
  align-items: flex-start;
  gap: var(--bless-space-3);
  padding: var(--bless-space-3) var(--bless-space-3) 0;
  cursor: pointer;
}
.bless-stores__pick input {
  margin-block-start: 3px;
  accent-color: var(--bless-color-accent);
}
.bless-stores__main {
  display: grid;
  gap: 2px;
}
.bless-stores__address,
.bless-stores__meta {
  font-size: var(--bless-text-xs);
  color: var(--bless-color-text-muted);
}
.bless-stores__state.is-open {
  color: var(--bless-color-text);
  font-weight: var(--bless-font-weight-bold);
}
.bless-stores__links {
  display: flex;
  gap: var(--bless-space-4);
  padding: 0 var(--bless-space-3) var(--bless-space-3) calc(var(--bless-space-3) * 2 + 1rem);
  font-size: var(--bless-text-xs);
}
.bless-stores__links a {
  color: inherit;
}
</style>
