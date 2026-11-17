<script setup lang="ts">
import { computed, ref, useId } from "vue";
import { useLabelPack } from "../composables/useLabels";
import BlessToc from "./BlessToc.vue";

defineOptions({ name: "BlessKnowledgeArticle" });
const pack = useLabelPack("BlessKnowledgeArticle");

export interface BlessArticleSection {
  title: string;
  /** plain text; a blank line starts a new paragraph */
  body: string;
}

const props = defineProps<{
  title: string;
  /** the date of the last change, as text */
  updated?: string;
  sections: BlessArticleSection[];
  related?: { title: string; href: string }[];
  labels?: Partial<{
    updated: (date: string) => string;
    minutes: (n: number) => string;
    contents: string;
    helpful: string;
    yes: string;
    no: string;
    thanks: string;
    related: string;
  }>;
}>();
const emit = defineEmits<{ helpful: [yes: boolean] }>();

const text = computed(() => ({
  updated: (d: string) => `Last changed ${d}`,
  minutes: (n: number) => `${n} min read`,
  contents: "In this article",
  helpful: "Did this article help you?",
  yes: "Yes",
  no: "No",
  thanks: "Thank you. Your answer helps us make the help pages better.",
  related: "Related articles",
  ...pack(),
  ...props.labels,
}));
const id = useId();
const toc = computed(() => props.sections.map((s, i) => ({ id: `${id}-s${i}`, label: s.title })));
// about 200 words a minute, the usual pace for reading on a screen
const minutes = computed(() =>
  Math.max(1, Math.round(props.sections.reduce((n, s) => n + s.body.split(/\s+/).length, 0) / 200)),
);
const paras = (b: string) =>
  b
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
const answered = ref(false);
function vote(yes: boolean) {
  answered.value = true;
  emit("helpful", yes);
}
</script>

<template>
  <article class="bless-kb">
    <header class="bless-kb__head">
      <h2 class="bless-kb__title">{{ title }}</h2>
      <div class="bless-kb__meta">
        <span v-if="updated">{{ text.updated(updated) }}</span>
        <span>{{ text.minutes(minutes) }}</span>
      </div>
    </header>
    <BlessToc
      v-if="sections.length > 1"
      :items="toc"
      :label="text.contents"
      class="bless-kb__toc"
    />
    <section
      v-for="(s, i) in sections"
      :key="i"
      class="bless-kb__section"
      :aria-labelledby="toc[i]!.id"
    >
      <h3 :id="toc[i]!.id" class="bless-kb__heading">{{ s.title }}</h3>
      <div v-for="(p, j) in paras(s.body)" :key="j" class="bless-kb__para">{{ p }}</div>
    </section>
    <footer class="bless-kb__foot">
      <div class="bless-kb__ask" role="group" :aria-label="text.helpful">
        <template v-if="!answered">
          <span>{{ text.helpful }}</span>
          <button type="button" @click="vote(true)">{{ text.yes }}</button>
          <button type="button" @click="vote(false)">{{ text.no }}</button>
        </template>
        <span v-else role="status">✓ {{ text.thanks }}</span>
      </div>
      <nav v-if="related?.length" class="bless-kb__related" :aria-label="text.related">
        <div class="bless-kb__label" aria-hidden="true">{{ text.related }}</div>
        <ul role="list">
          <li v-for="r in related" :key="r.href">
            <a :href="r.href">{{ r.title }}</a>
          </li>
        </ul>
      </nav>
    </footer>
  </article>
</template>

<style>
.bless-kb {
  display: grid;
  gap: var(--bless-space-4);
  max-inline-size: 44rem;
  font-family: var(--bless-font-sans);
  font-size: var(--bless-text-md, 1rem);
  color: var(--bless-color-text);
}
.bless-kb__head {
  display: grid;
  gap: var(--bless-space-1);
}
/* two classes, so the heading styles of a host page do not win */
.bless-kb .bless-kb__title,
.bless-kb .bless-kb__heading {
  margin: 0;
  padding: 0;
  border: 0;
  font-weight: var(--bless-font-weight-bold);
  line-height: 1.25;
}
.bless-kb .bless-kb__title {
  font-size: var(--bless-text-2xl, 1.75rem);
}
.bless-kb .bless-kb__heading {
  font-size: var(--bless-text-lg);
}
.bless-kb__meta {
  display: flex;
  flex-wrap: wrap;
  gap: var(--bless-space-3);
  font-size: var(--bless-text-xs);
}
.bless-kb__toc {
  padding: var(--bless-space-3);
  border-inline-start: 3px solid var(--bless-color-accent);
  background: var(--bless-color-surface-2);
}
.bless-kb__section {
  display: grid;
  gap: var(--bless-space-2);
  scroll-margin-block-start: var(--bless-space-6);
}
.bless-kb__para {
  line-height: 1.65;
  white-space: pre-line;
}
.bless-kb__foot {
  display: grid;
  gap: var(--bless-space-4);
  padding-block-start: var(--bless-space-4);
  border-block-start: 2px solid var(--bless-color-text);
  font-size: var(--bless-text-sm);
}
.bless-kb__ask {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--bless-space-2);
  font-weight: var(--bless-font-weight-bold);
}
.bless-kb__ask button {
  min-inline-size: 4rem;
  min-block-size: 2.25rem;
  border: 2px solid var(--bless-color-text);
  background: var(--bless-color-bg);
  color: inherit;
  font: inherit;
  cursor: pointer;
}
.bless-kb__ask button:hover {
  background: var(--bless-color-text);
  color: var(--bless-color-bg);
}
.bless-kb a:focus-visible,
.bless-kb__ask button:focus-visible {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: 2px;
}
.bless-kb__label {
  margin-block-end: var(--bless-space-1);
  font-weight: var(--bless-font-weight-bold);
}
.bless-kb__related ul {
  display: grid;
  gap: var(--bless-space-1);
  margin: 0;
  padding: 0;
  list-style: none;
}
.bless-kb__related a {
  color: inherit;
  text-decoration: underline;
  text-underline-offset: 3px;
}
</style>
