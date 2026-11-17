<script setup lang="ts">
import { computed } from "vue";
import { useLabelPack } from "../composables/useLabels";
import BlessFacetFilter, { type BlessFacet } from "./BlessFacetFilter.vue";
import BlessPagination from "./BlessPagination.vue";
import BlessSearchResult from "./BlessSearchResult.vue";

defineOptions({ name: "BlessSearchResults" });
const pack = useLabelPack("BlessSearchResults");

export interface BlessSearchHit {
  id: string;
  title: string;
  href: string;
  snippet?: string;
  kind?: string;
  date?: string;
}

const props = withDefaults(
  defineProps<{
    query: string;
    /** the hits of this page only */
    results: BlessSearchHit[];
    /** the number of hits on all pages */
    total: number;
    pageSize?: number;
    facets?: BlessFacet[];
    sorts?: { value: string; label: string }[];
    /** a better spelling of the search, if your search engine has one */
    suggestion?: string;
    locale?: string;
    labels?: Partial<{
      count: (shown: string, total: string, query: string) => string;
      none: (query: string) => string;
      tips: string;
      sort: string;
      filters: string;
      didYouMean: string;
    }>;
  }>(),
  { pageSize: 10, facets: () => [], sorts: () => [], locale: "en" },
);
const selected = defineModel<Record<string, string[]>>("selected", { default: () => ({}) });
const sort = defineModel<string>("sort");
const page = defineModel<number>("page", { default: 1 });
const emit = defineEmits<{ suggest: [query: string] }>();

const text = computed(() => ({
  count: (s: string, t: string, q: string) => `${s} of ${t} results for “${q}”`,
  none: (q: string) => `No results for “${q}”.`,
  tips: "Check the spelling, use fewer words, or remove a filter.",
  sort: "Sort by",
  filters: "Filters",
  didYouMean: "Did you mean",
  ...pack(),
  ...props.labels,
}));
const num = computed(() => new Intl.NumberFormat(props.locale));
const pages = computed(() => Math.max(1, Math.ceil(props.total / props.pageSize)));
const shown = computed(() => {
  const a = (page.value - 1) * props.pageSize + 1;
  return `${num.value.format(a)}–${num.value.format(a + props.results.length - 1)}`;
});
</script>

<template>
  <div class="bless-results" :class="{ 'has-facets': facets.length }">
    <details v-if="facets.length" class="bless-results__facets" open>
      <summary>{{ text.filters }}</summary>
      <BlessFacetFilter v-model="selected" :facets :locale />
    </details>
    <section class="bless-results__main" :aria-label="query">
      <div class="bless-results__bar">
        <p class="bless-results__count" role="status">
          {{ total ? text.count(shown, num.format(total), query) : text.none(query) }}
        </p>
        <label v-if="sorts.length" class="bless-results__sort">
          {{ text.sort }}
          <select v-model="sort">
            <option v-for="s in sorts" :key="s.value" :value="s.value">{{ s.label }}</option>
          </select>
        </label>
      </div>
      <p v-if="suggestion" class="bless-results__suggest">
        {{ text.didYouMean }}
        <button type="button" @click="emit('suggest', suggestion)">{{ suggestion }}</button>?
      </p>
      <p v-if="!total" class="bless-results__tips">{{ text.tips }}</p>
      <ol v-else class="bless-results__list" role="list">
        <li v-for="r in results" :key="r.id">
          <BlessSearchResult v-bind="r" :query />
        </li>
      </ol>
      <BlessPagination v-if="pages > 1" v-model="page" :total="pages" />
    </section>
  </div>
</template>

<style>
.bless-results {
  display: grid;
  gap: var(--bless-space-6);
  font-family: var(--bless-font-sans);
  font-size: var(--bless-text-sm);
  color: var(--bless-color-text);
}
.bless-results.has-facets {
  grid-template-columns: minmax(12rem, 15rem) minmax(0, 1fr);
  align-items: start;
}
@media (max-width: 48rem) {
  .bless-results.has-facets {
    grid-template-columns: 1fr;
  }
}
.bless-results__facets > summary {
  margin-block-end: var(--bless-space-2);
  font-weight: var(--bless-font-weight-bold);
  cursor: pointer;
}
.bless-results__main {
  display: grid;
  gap: var(--bless-space-4);
  min-inline-size: 0;
}
.bless-results__bar {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: var(--bless-space-2);
  padding-block-end: var(--bless-space-2);
  border-block-end: 2px solid var(--bless-color-text);
}
.bless-results__count,
.bless-results__suggest,
.bless-results__tips {
  margin: 0;
}
.bless-results__count {
  font-weight: var(--bless-font-weight-bold);
}
.bless-results__sort {
  display: flex;
  align-items: center;
  gap: var(--bless-space-2);
}
.bless-results__sort select {
  min-block-size: 2.25rem;
  padding: 0 var(--bless-space-2);
  border: var(--bless-border-width) solid var(--bless-color-border);
  background: var(--bless-color-bg);
  color: inherit;
  font: inherit;
}
.bless-results__suggest button {
  padding: 0;
  border: 0;
  background: none;
  color: inherit;
  font: inherit;
  font-weight: var(--bless-font-weight-bold);
  font-style: italic;
  text-decoration: underline;
  cursor: pointer;
}
.bless-results :is(select, .bless-results__suggest button):focus-visible {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: 2px;
}
.bless-results__list {
  display: grid;
  gap: var(--bless-space-6);
  margin: 0;
  padding: 0;
  list-style: none;
}
</style>
