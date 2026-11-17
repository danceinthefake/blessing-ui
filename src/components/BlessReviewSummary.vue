<script setup lang="ts">
import { computed } from "vue";
import { useLabelPack } from "../composables/useLabels";
import "./sr.css";

defineOptions({ name: "BlessReviewSummary" });
const pack = useLabelPack("BlessReviewSummary");

const props = withDefaults(
  defineProps<{
    /** the number of reviews with 5, 4, 3, 2, and 1 star, in that order */
    counts: number[];
    /** the bars are buttons that set `v-model:filter` */
    filterable?: boolean;
    /** the language of the numbers, for example `id` */
    locale?: string;
    labels?: Partial<{
      average: (score: string) => string;
      reviews: (count: number) => string;
      level: (stars: number, count: number) => string;
    }>;
  }>(),
  { filterable: true, locale: "en" },
);
/** the star level that filters the reviews, or none */
const filter = defineModel<number | undefined>("filter");

const text = computed(() => ({
  average: (s: string) => `Average ${s} out of 5 stars`,
  reviews: (n: number) => `${n} ${n === 1 ? "review" : "reviews"}`,
  level: (s: number, n: number) =>
    `${s} ${s === 1 ? "star" : "stars"}: ${n} ${n === 1 ? "review" : "reviews"}`,
  ...pack(),
  ...props.labels,
}));
const rows = computed(() =>
  [5, 4, 3, 2, 1].map((stars, i) => ({ stars, count: Math.max(0, props.counts[i] ?? 0) })),
);
const total = computed(() => rows.value.reduce((n, r) => n + r.count, 0));
const avg = computed(() =>
  total.value ? rows.value.reduce((n, r) => n + r.stars * r.count, 0) / total.value : 0,
);
const one = computed(
  () => new Intl.NumberFormat(props.locale, { minimumFractionDigits: 1, maximumFractionDigits: 1 }),
);
const count = computed(() => new Intl.NumberFormat(props.locale));
const toggle = (s: number) => (filter.value = filter.value === s ? undefined : s);
</script>

<template>
  <div class="bless-reviews">
    <div class="bless-reviews__score">
      <strong class="bless-reviews__avg" aria-hidden="true">{{ one.format(avg) }}</strong>
      <span
        class="bless-reviews__stars"
        role="img"
        :aria-label="text.average(one.format(avg))"
        :style="{ '--_fill': `${Math.round(avg * 2000) / 100}%` }"
      >
        <span aria-hidden="true">★★★★★</span>
      </span>
      <span class="bless-reviews__total">{{ text.reviews(total) }}</span>
    </div>
    <ul class="bless-stagger bless-reviews__bars">
      <li v-for="r in rows" :key="r.stars">
        <component
          :is="filterable ? 'button' : 'div'"
          :type="filterable ? 'button' : undefined"
          class="bless-reviews__row"
          :class="{
            'is-on': filter === r.stars,
            'is-off': filter !== undefined && filter !== r.stars,
          }"
          :aria-pressed="filterable ? filter === r.stars : undefined"
          @click="filterable && toggle(r.stars)"
        >
          <span class="bless-reviews__level" aria-hidden="true">{{ r.stars }} ★</span>
          <span class="bless-reviews__bar" aria-hidden="true">
            <span :style="{ inlineSize: `${total ? (r.count / total) * 100 : 0}%` }" />
          </span>
          <span class="bless-reviews__count" aria-hidden="true">{{ count.format(r.count) }}</span>
          <span class="bless-sr">{{ text.level(r.stars, r.count) }}</span>
        </component>
      </li>
    </ul>
  </div>
</template>

<style>
.bless-reviews {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--bless-space-6);
  font-family: var(--bless-font-sans);
  font-size: var(--bless-text-sm);
  color: var(--bless-color-text);
}
.bless-reviews__score {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--bless-space-1);
}
.bless-reviews__avg {
  font-size: var(--bless-text-headline);
  line-height: 1;
  font-variant-numeric: tabular-nums;
}
/* two rows of stars: the gray one, and the filled one cut at the average */
.bless-reviews__stars {
  position: relative;
  display: inline-block;
  color: var(--bless-color-border);
  font-size: var(--bless-text-lg);
  letter-spacing: 2px;
}
.bless-reviews__stars::after {
  content: "★★★★★";
  position: absolute;
  inset-block: 0;
  inset-inline-start: 0;
  inline-size: var(--_fill);
  overflow: hidden;
  color: var(--bless-color-text);
  white-space: nowrap;
}
.bless-reviews__total {
  font-size: var(--bless-text-xs);
  color: var(--bless-color-text-muted);
}
.bless-reviews__bars {
  display: grid;
  flex: 1;
  gap: 2px;
  min-inline-size: 14rem;
  margin: 0;
  padding: 0;
  list-style: none;
}
.bless-reviews__row {
  display: grid;
  grid-template-columns: 2.5rem 1fr 3rem;
  align-items: center;
  gap: var(--bless-space-2);
  inline-size: 100%;
  padding: var(--bless-space-1) var(--bless-space-1);
  border: 0;
  background: none;
  color: inherit;
  font: inherit;
  text-align: start;
}
button.bless-reviews__row {
  cursor: pointer;
}
button.bless-reviews__row:hover {
  background: var(--bless-color-surface-2);
}
button.bless-reviews__row:focus-visible {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: -2px;
}
.bless-reviews__row.is-on {
  background: var(--bless-color-surface-2);
  font-weight: var(--bless-font-weight-bold);
}
.bless-reviews__row.is-off .bless-reviews__bar span {
  background: var(--bless-color-text-muted);
}
.bless-reviews__level {
  font-size: var(--bless-text-xs);
  white-space: nowrap;
}
.bless-reviews__bar {
  block-size: 8px;
  background: var(--bless-color-surface-2);
}
.bless-reviews__row.is-on .bless-reviews__bar {
  background: var(--bless-color-bg);
}
.bless-reviews__bar span {
  display: block;
  block-size: 100%;
  background: var(--bless-color-text);
}
.bless-reviews__count {
  font-size: var(--bless-text-xs);
  color: var(--bless-color-text-muted);
  font-variant-numeric: tabular-nums;
  text-align: end;
}
</style>
