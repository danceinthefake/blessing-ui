<template>
  <header class="bless-article">
    <p v-if="topic" class="bless-article__topic">
      <a v-if="topicHref" :href="topicHref">{{ topic }}</a>
      <template v-else>{{ topic }}</template>
    </p>
    <component :is="`h${level}`" class="bless-article__title">{{ title }}</component>
    <p v-if="summary" class="bless-article__summary">{{ summary }}</p>
    <div v-if="author || date || minutes" class="bless-article__meta">
      <BlessAvatar v-if="author" :name="author.name" :src="author.avatar" alt="" size="sm" />
      <span class="bless-article__lines">
        <span v-if="author" class="bless-article__author">
          <a v-if="author.href" :href="author.href">{{ text.by(author.name) }}</a>
          <template v-else>{{ text.by(author.name) }}</template>
        </span>
        <span class="bless-article__when">
          <time v-if="date" :datetime="date">{{ day(date) }}</time>
          <template v-if="date && minutes"> · </template>
          <span v-if="minutes">{{ text.read(minutes) }}</span>
          <template v-if="updated">
            · <time :datetime="updated">{{ text.updated(day(updated)) }}</time>
          </template>
        </span>
      </span>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useLabelPack } from "../composables/useLabels";
import BlessAvatar from "./BlessAvatar.vue";

defineOptions({ name: "BlessArticleHeader" });
const pack = useLabelPack("BlessArticleHeader");

const props = withDefaults(
  defineProps<{
    title: string;
    /** the topic above the title, for example "Gear" */
    topic?: string;
    topicHref?: string;
    /** one or two lines under the title */
    summary?: string;
    author?: { name: string; avatar?: string; href?: string };
    /** YYYY-MM-DD */
    date?: string;
    /** YYYY-MM-DD of the last change */
    updated?: string;
    /** minutes to read */
    minutes?: number;
    /** the heading level of the title */
    level?: 1 | 2 | 3;
    locale?: string;
    labels?: Partial<{
      by: (name: string) => string;
      read: (minutes: number) => string;
      updated: (date: string) => string;
    }>;
  }>(),
  { level: 1, locale: "en" },
);

const text = computed(() => ({
  by: (n: string) => `By ${n}`,
  read: (m: number) => `${m} min read`,
  updated: (d: string) => `Updated ${d}`,
  ...pack(),
  ...props.labels,
}));
const day = (iso: string) =>
  new Intl.DateTimeFormat(props.locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${iso}T00:00:00Z`));
</script>

<style>
.bless-article {
  display: grid;
  gap: var(--bless-space-3);
  font-family: var(--bless-font-sans);
  color: var(--bless-color-text);
}
.bless-article__topic {
  margin: 0;
  font-size: var(--bless-text-xs);
  font-weight: var(--bless-font-weight-bold);
  letter-spacing: var(--bless-tracking-wide);
  text-transform: var(--bless-label-case);
}
.bless-article__topic a,
.bless-article__author a {
  color: inherit;
}
.bless-article__topic a:focus-visible,
.bless-article__author a:focus-visible {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: 2px;
}
/* two classes, so the heading styles of a host page do not win */
.bless-article .bless-article__title {
  margin: 0;
  padding: 0;
  border: 0;
  font-family: var(--bless-font-serif);
  font-size: var(--bless-text-xl);
  font-weight: 400;
  letter-spacing: -0.015em;
  line-height: var(--bless-leading-tight);
}
.bless-article__summary {
  margin: 0;
  font-size: var(--bless-text-lg);
  line-height: 1.45;
  color: var(--bless-color-text-muted);
}
.bless-article__meta {
  display: flex;
  align-items: center;
  gap: var(--bless-space-2);
  padding-block-start: var(--bless-space-3);
  border-block-start: var(--bless-border-width) solid var(--bless-color-border);
}
.bless-article__lines {
  display: grid;
  font-size: var(--bless-text-sm);
}
.bless-article__author {
  font-weight: var(--bless-font-weight-bold);
}
.bless-article__when {
  font-size: var(--bless-text-xs);
  color: var(--bless-color-text-muted);
}
</style>
