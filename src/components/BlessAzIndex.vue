<script setup lang="ts">
import { computed, useId } from "vue";
import { useLabelPack } from "../composables/useLabels";
import "./sr.css";

defineOptions({ name: "BlessAzIndex" });
const pack = useLabelPack("BlessAzIndex");

export interface BlessAzItem {
  label: string;
  href?: string;
}

const props = withDefaults(
  defineProps<{
    items: BlessAzItem[];
    /** the letters of the bar; names that start with another sign go under "#" */
    letters?: string;
    locale?: string;
    labels?: Partial<{ letters: string; other: string }>;
  }>(),
  { letters: "ABCDEFGHIJKLMNOPQRSTUVWXYZ", locale: "en" },
);

const text = computed(() => ({
  letters: "Jump to a letter",
  other: "Other",
  ...pack(),
  ...props.labels,
}));
const id = useId();
const bar = computed(() => [...props.letters, "#"]);
// the first letter without its accent, so "Évian" goes under E
const keyOf = (s: string) => {
  const c = s.trim().normalize("NFD").replace(/\p{M}/gu, "").charAt(0).toUpperCase();
  return props.letters.includes(c) && c ? c : "#";
};
const groups = computed(() => {
  const coll = new Intl.Collator(props.locale, { sensitivity: "base", numeric: true });
  const m = new Map<string, BlessAzItem[]>();
  for (const it of [...props.items].sort((a, b) => coll.compare(a.label, b.label))) {
    const k = keyOf(it.label);
    m.set(k, [...(m.get(k) ?? []), it]);
  }
  return bar.value.filter((l) => m.has(l)).map((l) => ({ letter: l, list: m.get(l)! }));
});
const has = computed(() => new Set(groups.value.map((g) => g.letter)));
const anchor = (l: string) => `${id}-${l === "#" ? "other" : l}`;
</script>

<template>
  <div class="bless-az">
    <nav class="bless-az__bar" :aria-label="text.letters">
      <ul role="list">
        <li v-for="l in bar" :key="l">
          <a v-if="has.has(l)" :href="`#${anchor(l)}`">{{ l }}</a>
          <span v-else aria-hidden="true">{{ l }}</span>
        </li>
      </ul>
    </nav>
    <section
      v-for="g in groups"
      :id="anchor(g.letter)"
      :key="g.letter"
      class="bless-az__group"
      :aria-labelledby="`${anchor(g.letter)}-h`"
    >
      <h3 :id="`${anchor(g.letter)}-h`" class="bless-az__letter">
        <span aria-hidden="true">{{ g.letter }}</span>
        <span v-if="g.letter === '#'" class="bless-sr">{{ text.other }}</span>
        <span v-else class="bless-sr">{{ g.letter }}</span>
      </h3>
      <ul class="bless-az__list" role="list">
        <li v-for="it in g.list" :key="it.label">
          <a v-if="it.href" :href="it.href">{{ it.label }}</a>
          <span v-else>{{ it.label }}</span>
        </li>
      </ul>
    </section>
  </div>
</template>

<style>
.bless-az {
  display: grid;
  gap: var(--bless-space-4);
  font-family: var(--bless-font-sans);
  font-size: var(--bless-text-sm);
  color: var(--bless-color-text);
}
.bless-az__bar {
  position: sticky;
  /* a page with a fixed header sets --bless-az-top to its height */
  inset-block-start: var(--bless-az-top, 0);
  z-index: 1;
  padding-block: var(--bless-space-2);
  background: var(--bless-color-bg);
}
.bless-az__bar ul {
  display: flex;
  flex-wrap: wrap;
  gap: 2px;
  margin: 0;
  padding: 0;
  list-style: none;
}
.bless-az__bar :is(a, span) {
  display: grid;
  place-items: center;
  inline-size: 2rem;
  block-size: 2rem;
  font-weight: var(--bless-font-weight-bold);
}
.bless-az__bar a {
  border: var(--bless-border-width) solid var(--bless-color-text);
  color: inherit;
  text-decoration: none;
}
.bless-az__bar a:hover {
  background: var(--bless-color-text);
  color: var(--bless-color-bg);
}
.bless-az a:focus-visible {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: 2px;
}
/* a letter without names stays in its place, dim and dashed */
.bless-az__bar span {
  border: var(--bless-border-width) dashed var(--bless-color-border);
  color: var(--bless-color-text-muted);
}
.bless-az__group {
  display: grid;
  grid-template-columns: 3rem minmax(0, 1fr);
  gap: var(--bless-space-3);
  padding-block-start: var(--bless-space-3);
  border-block-start: 2px solid var(--bless-color-text);
  scroll-margin-block-start: calc(var(--bless-az-top, 0px) + 3.5rem);
}
/* two classes, so the heading styles of a host page do not win */
.bless-az .bless-az__letter {
  margin: 0;
  padding: 0;
  border: 0;
  font-size: var(--bless-text-2xl, 1.75rem);
  line-height: 1;
}
.bless-az__list {
  columns: 14rem auto;
  column-gap: var(--bless-space-6);
  margin: 0;
  padding: 0;
  list-style: none;
}
.bless-az__list li {
  padding-block: 3px;
  break-inside: avoid;
}
.bless-az__list a {
  color: inherit;
  text-decoration: underline;
  text-underline-offset: 3px;
}
</style>
