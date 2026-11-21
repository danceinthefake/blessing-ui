<template>
  <div class="bless-folio">
    <div class="bless-folio__bar">
      <div class="bless-folio__filters" role="group" :aria-label="text.filter">
        <button type="button" :aria-pressed="!filter" @click="filter = ''">{{ text.all }}</button>
        <button
          v-for="k in kinds"
          :key="k"
          type="button"
          :aria-pressed="filter === k"
          @click="filter = k"
        >
          {{ k }}
        </button>
      </div>
      <span class="bless-folio__count" role="status">{{ text.count(shown.length) }}</span>
    </div>
    <ul class="bless-stagger bless-folio__grid" role="list">
      <li v-for="w in shown" :key="w.id">
        <component :is="w.href ? 'a' : 'div'" :href="w.href" class="bless-folio__card">
          <img :src="w.image" :alt="w.imageAlt ?? ''" class="bless-folio__image" loading="lazy" />
          <span class="bless-folio__caption">
            <span class="bless-folio__title">{{ w.title }}</span>
            <span class="bless-folio__meta"
              >{{ w.kind }}<template v-if="w.year"> · {{ w.year }}</template></span
            >
          </span>
        </component>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useLabelPack } from "../composables/useLabels";

defineOptions({ name: "BlessPortfolioGrid" });
const pack = useLabelPack("BlessPortfolioGrid");

export interface BlessWork {
  id: string;
  title: string;
  /** the kind of work, which makes the filter buttons */
  kind: string;
  image: string;
  /** describe the image; leave empty when the title says enough */
  imageAlt?: string;
  href?: string;
  year?: string | number;
}

const props = defineProps<{
  works: BlessWork[];
  labels?: Partial<{ filter: string; all: string; count: (n: number) => string }>;
}>();
/** the kind to show; an empty string shows all */
const filter = defineModel<string>("filter", { default: "" });

const text = computed(() => ({
  filter: "Show",
  all: "All",
  count: (n: number) => (n === 1 ? "1 work" : `${n} works`),
  ...pack(),
  ...props.labels,
}));
const kinds = computed(() => [...new Set(props.works.map((w) => w.kind))]);
const shown = computed(() =>
  filter.value ? props.works.filter((w) => w.kind === filter.value) : props.works,
);
</script>

<style>
.bless-folio {
  display: grid;
  gap: var(--bless-space-4);
  font-family: var(--bless-font-sans);
  font-size: var(--bless-text-sm);
  color: var(--bless-color-text);
}
.bless-folio__bar {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: var(--bless-space-2);
}
.bless-folio__filters {
  display: flex;
  flex-wrap: wrap;
  gap: var(--bless-space-1);
}
.bless-folio__filters button {
  min-block-size: 2.25rem;
  padding: 0 var(--bless-space-3);
  border: 2px solid var(--bless-color-text);
  background: var(--bless-color-bg);
  color: inherit;
  font: inherit;
  font-weight: var(--bless-font-weight-bold);
  cursor: pointer;
}
.bless-folio__filters button[aria-pressed="true"] {
  background: var(--bless-color-text);
  color: var(--bless-color-bg);
}
.bless-folio :is(button, a):focus-visible {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: 2px;
}
.bless-folio__count {
  font-size: var(--bless-text-xs);
}
.bless-folio__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(13rem, 1fr));
  gap: var(--bless-space-4);
  margin: 0;
  padding: 0;
  list-style: none;
}
.bless-folio__card {
  display: grid;
  gap: var(--bless-space-2);
  color: inherit;
  text-decoration: none;
}
.bless-folio__image {
  display: block;
  inline-size: 100%;
  aspect-ratio: 4 / 3;
  object-fit: cover;
  transition: opacity var(--bless-duration-fast, 0.15s);
}
a.bless-folio__card:hover .bless-folio__image {
  opacity: 0.85;
}
a.bless-folio__card:hover .bless-folio__title {
  text-decoration: underline;
}
.bless-folio__caption {
  display: grid;
}
.bless-folio__title {
  font-weight: var(--bless-font-weight-bold);
}
.bless-folio__meta {
  font-size: var(--bless-text-xs);
}
@media (prefers-reduced-motion: reduce) {
  .bless-folio__image {
    transition: none;
  }
}
</style>
