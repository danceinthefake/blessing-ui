<script setup lang="ts">
import { computed } from "vue";
import { useLabelPack } from "../composables/useLabels";

defineOptions({ name: "BlessTrendList" });
const pack = useLabelPack("BlessTrendList");

export interface BlessTrend {
  id: string;
  /** the topic or tag, for example "#homestudio" */
  topic: string;
  /** a short line above the topic, for example "Music · Trending" */
  category?: string;
  /** how many posts talk about it */
  posts?: number;
  href?: string;
}

const props = withDefaults(
  defineProps<{
    trends: BlessTrend[];
    locale?: string;
    labels?: Partial<{ title: string; posts: (count: string) => string }>;
  }>(),
  { locale: "en" },
);

const text = computed(() => ({
  title: "Trending now",
  posts: (n: string) => `${n} posts`,
  ...pack(),
  ...props.labels,
}));
const short = computed(
  () => new Intl.NumberFormat(props.locale, { notation: "compact", maximumFractionDigits: 1 }),
);
</script>

<template>
  <section class="bless-trends" :aria-label="text.title">
    <h3 class="bless-trends__title">{{ text.title }}</h3>
    <ol class="bless-trends__list">
      <li v-for="(t, i) in trends" :key="t.id" class="bless-trends__item">
        <span class="bless-trends__rank" aria-hidden="true">{{ i + 1 }}</span>
        <span class="bless-trends__body">
          <span v-if="t.category" class="bless-trends__category">{{ t.category }}</span>
          <a v-if="t.href" class="bless-trends__topic" :href="t.href">{{ t.topic }}</a>
          <strong v-else class="bless-trends__topic">{{ t.topic }}</strong>
          <span v-if="t.posts !== undefined" class="bless-trends__posts">{{
            text.posts(short.format(t.posts))
          }}</span>
        </span>
      </li>
    </ol>
  </section>
</template>

<style>
.bless-trends {
  font-family: var(--bless-font-sans);
  font-size: var(--bless-text-sm);
  color: var(--bless-color-text);
}
.bless-trends__title {
  margin: 0 0 var(--bless-space-2);
  font-size: var(--bless-text-md);
}
.bless-trends__list {
  display: grid;
  margin: 0;
  padding: 0;
  list-style: none;
}
.bless-trends__item {
  display: flex;
  gap: var(--bless-space-3);
  border-block-end: var(--bless-border-width) solid var(--bless-color-border);
}
/* the space sits on the children, so a list reset of the host page keeps it */
.bless-trends__item > * {
  padding-block: var(--bless-space-2);
}
.bless-trends__rank {
  flex: none;
  inline-size: 1.5rem;
  font-size: var(--bless-text-lg);
  font-weight: var(--bless-font-weight-bold);
  color: var(--bless-color-text-muted);
  font-variant-numeric: tabular-nums;
}
.bless-trends__body {
  display: grid;
  min-inline-size: 0;
}
.bless-trends__category,
.bless-trends__posts {
  font-size: var(--bless-text-xs);
  color: var(--bless-color-text-muted);
}
.bless-trends__topic {
  overflow: hidden;
  color: inherit;
  font-weight: var(--bless-font-weight-bold);
  text-decoration: none;
  text-overflow: ellipsis;
  white-space: nowrap;
}
a.bless-trends__topic:hover {
  text-decoration: underline;
}
a.bless-trends__topic:focus-visible {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: 2px;
}
</style>
