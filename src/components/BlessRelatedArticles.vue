<script setup lang="ts">
import { computed, useId } from "vue";
import { useLabelPack } from "../composables/useLabels";

defineOptions({ name: "BlessRelatedArticles" });
const pack = useLabelPack("BlessRelatedArticles");

export interface BlessRelatedArticle {
  id: string;
  title: string;
  href: string;
  image?: string;
  topic?: string;
  /** minutes to read */
  minutes?: number;
}

const props = withDefaults(
  defineProps<{
    articles: BlessRelatedArticle[];
    /** the heading level of the title of the block */
    level?: 2 | 3 | 4;
    labels?: Partial<{ title: string; read: (minutes: number) => string }>;
  }>(),
  { level: 2 },
);

const text = computed(() => ({
  title: "Read next",
  read: (m: number) => `${m} min read`,
  ...pack(),
  ...props.labels,
}));
const uid = useId();
</script>

<template>
  <section class="bless-related" :aria-labelledby="`${uid}-title`">
    <component :is="`h${level}`" :id="`${uid}-title`" class="bless-related__title">{{
      text.title
    }}</component>
    <ul class="bless-related__list">
      <li v-for="a in articles" :key="a.id" class="bless-related__item">
        <article class="bless-related__card">
          <div class="bless-related__media">
            <img v-if="a.image" :src="a.image" alt="" loading="lazy" />
          </div>
          <div class="bless-related__body">
            <span v-if="a.topic" class="bless-related__topic">{{ a.topic }}</span>
            <a class="bless-related__link" :href="a.href">{{ a.title }}</a>
            <span v-if="a.minutes" class="bless-related__time">{{ text.read(a.minutes) }}</span>
          </div>
        </article>
      </li>
    </ul>
  </section>
</template>

<style>
.bless-related {
  display: grid;
  gap: var(--bless-space-3);
  font-family: var(--bless-font-sans);
  font-size: var(--bless-text-sm);
  color: var(--bless-color-text);
}
.bless-related__title {
  margin: 0;
  font-size: var(--bless-text-md);
}
.bless-related__list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(12rem, 1fr));
  gap: var(--bless-space-3);
  margin: 0;
  padding: 0;
  list-style: none;
}
/* the whole card takes the click of the title link; the focus ring shows on the card */
.bless-related__card {
  position: relative;
  display: grid;
  block-size: 100%;
  border: var(--bless-border-width) solid var(--bless-color-border);
}
.bless-related__card:has(:focus-visible) {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: 2px;
}
.bless-related__media {
  aspect-ratio: 16 / 9;
  background: var(--bless-color-surface-2);
}
.bless-related__media img {
  inline-size: 100%;
  block-size: 100%;
  object-fit: cover;
}
.bless-related__body {
  display: grid;
  align-content: start;
  gap: var(--bless-space-1);
  padding: var(--bless-space-3);
}
.bless-related__topic,
.bless-related__time {
  font-size: var(--bless-text-xs);
  color: var(--bless-color-text-muted);
}
.bless-related__topic {
  font-weight: var(--bless-font-weight-bold);
  text-transform: uppercase;
  letter-spacing: var(--bless-tracking-wide);
}
.bless-related__link {
  color: inherit;
  font-weight: var(--bless-font-weight-bold);
  line-height: var(--bless-leading-tight);
  text-decoration: none;
}
.bless-related__link::after {
  content: "";
  position: absolute;
  inset: 0;
}
.bless-related__link:focus-visible {
  outline: none;
}
.bless-related__card:hover .bless-related__link {
  text-decoration: underline;
}
</style>
