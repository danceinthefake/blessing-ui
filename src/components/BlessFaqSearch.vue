<template>
  <div class="bless-faq">
    <BlessInput
      v-model="query"
      class="bless-faq__search"
      type="search"
      :aria-label="text.search"
      :placeholder="text.search"
    />
    <p class="bless-faq__count" role="status">
      {{ query.trim() ? (shown.length ? text.count(shown.length, items.length) : text.none) : "" }}
    </p>
    <details
      v-for="f in shown"
      :key="f.i"
      class="bless-faq__item"
      :open="isOpen(f.i)"
      @toggle="toggle(f.i, $event)"
    >
      <summary class="bless-faq__question">
        <template v-for="(p, k) in markParts(f.question, query)" :key="k">
          <mark v-if="p.hit" class="bless-faq__mark">{{ p.text }}</mark>
          <template v-else>{{ p.text }}</template>
        </template>
      </summary>
      <p class="bless-faq__answer">
        <template v-for="(p, k) in markParts(f.answer, query)" :key="k">
          <mark v-if="p.hit" class="bless-faq__mark">{{ p.text }}</mark>
          <template v-else>{{ p.text }}</template>
        </template>
      </p>
    </details>
  </div>
</template>

<script lang="ts">
export interface BlessFaq {
  question: string;
  answer: string;
}

/** The text split into parts, with the parts that match the query marked; the case does not matter. */
export function markParts(text: string, query: string): { text: string; hit: boolean }[] {
  const q = query.trim();
  if (!q) return [{ text, hit: false }];
  const re = new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
  return text
    .split(re)
    .filter(Boolean)
    .map((t) => ({ text: t, hit: t.toLowerCase() === q.toLowerCase() }));
}
</script>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useLabelPack } from "../composables/useLabels";
import BlessInput from "./BlessInput.vue";

defineOptions({ name: "BlessFaqSearch" });
const pack = useLabelPack("BlessFaqSearch");

const props = defineProps<{
  items: BlessFaq[];
  labels?: Partial<{
    search: string;
    none: string;
    count: (shown: number, total: number) => string;
  }>;
}>();

const text = computed(() => ({
  search: "Search the questions",
  none: "No question matches. Try other words.",
  count: (s: number, t: number) => `${s} of ${t} questions`,
  ...pack(),
  ...props.labels,
}));
const query = ref("");
const opened = ref(new Set<number>());
const shown = computed(() => {
  const q = query.value.trim().toLowerCase();
  return props.items
    .map((f, i) => ({ ...f, i }))
    .filter(
      (f) => !q || f.question.toLowerCase().includes(q) || f.answer.toLowerCase().includes(q),
    );
});
// while a search runs, every match is open; without one, the reader opens and closes them
const isOpen = (i: number) => (query.value.trim() ? true : opened.value.has(i));
function toggle(i: number, e: Event) {
  if (query.value.trim()) return;
  const now = (e.target as HTMLDetailsElement).open;
  const s = new Set(opened.value);
  if (now) s.add(i);
  else s.delete(i);
  opened.value = s;
}
</script>

<style>
.bless-faq {
  display: grid;
  font-family: var(--bless-font-sans);
  font-size: var(--bless-text-sm);
  color: var(--bless-color-text);
}
.bless-faq__search {
  margin-block-end: var(--bless-space-2);
}
.bless-faq__count {
  min-block-size: 1.2em;
  margin: 0 0 var(--bless-space-2);
  font-size: var(--bless-text-xs);
  color: var(--bless-color-text-muted);
}
.bless-faq__item {
  border-block-end: var(--bless-border-width) solid var(--bless-color-border);
}
.bless-faq__question {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--bless-space-3);
  padding: var(--bless-space-3) 0;
  font-weight: var(--bless-font-weight-bold);
  cursor: pointer;
  list-style: none;
}
.bless-faq__question::-webkit-details-marker {
  display: none;
}
.bless-faq__question::after {
  content: "";
  flex: none;
  inline-size: 7px;
  block-size: 7px;
  border-inline-end: 1.5px solid currentColor;
  border-block-end: 1.5px solid currentColor;
  rotate: 45deg;
  transition: rotate var(--bless-duration-fast) var(--bless-ease-out);
}
.bless-faq__item[open] > .bless-faq__question::after {
  rotate: -135deg;
}
.bless-faq__question:focus-visible {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: 2px;
}
.bless-faq__answer {
  margin: 0;
  padding: 0 0 var(--bless-space-3);
  line-height: 1.6;
  color: var(--bless-color-text);
}
.bless-faq__mark {
  background: color-mix(in srgb, var(--bless-color-accent) 22%, var(--bless-color-bg));
  color: inherit;
  font-weight: var(--bless-font-weight-bold);
}
@media (prefers-reduced-motion: reduce) {
  .bless-faq__question::after {
    transition: none;
  }
}
</style>
