<template>
  <article class="bless-result">
    <div class="bless-result__where">
      <span v-if="kind" class="bless-result__kind">{{ kind }}</span>
      <span class="bless-result__url">{{ crumbs }}</span>
    </div>
    <h3 class="bless-result__title">
      <a :href="href"><BlessHighlight :text="title" :query /></a>
    </h3>
    <div v-if="snippet || date" class="bless-result__snippet">
      <span v-if="date" class="bless-result__date">{{ date }} — </span
      ><BlessHighlight v-if="snippet" :text="snippet" :query />
    </div>
  </article>
</template>

<script setup lang="ts">
import { computed } from "vue";
import BlessHighlight from "./BlessHighlight.vue";

defineOptions({ name: "BlessSearchResult" });

const props = defineProps<{
  title: string;
  href: string;
  snippet?: string;
  /** the words to mark in the title and the snippet */
  query?: string | string[];
  /** for example "Help article" or "PDF" */
  kind?: string;
  /** the date as text */
  date?: string;
}>();

// the address as host › path parts, which reads better than the raw URL
const crumbs = computed(() => {
  try {
    const u = new URL(props.href, "https://x.invalid");
    const host = u.host === "x.invalid" ? "" : u.host.replace(/^www\./, "");
    return [host, ...u.pathname.split("/").filter(Boolean).map(decodeURIComponent)]
      .filter(Boolean)
      .join(" › ");
  } catch {
    return props.href;
  }
});
</script>

<style>
.bless-result {
  display: grid;
  gap: 2px;
  max-inline-size: 42rem;
  font-family: var(--bless-font-sans);
  font-size: var(--bless-text-sm);
  color: var(--bless-color-text);
}
.bless-result__where {
  display: flex;
  align-items: center;
  gap: var(--bless-space-2);
  min-inline-size: 0;
  font-size: var(--bless-text-xs);
}
.bless-result__kind {
  padding: 0 var(--bless-space-1);
  border: var(--bless-border-width) solid var(--bless-color-text);
  font-weight: var(--bless-font-weight-bold);
  white-space: nowrap;
}
.bless-result__url {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
/* two classes, so the heading styles of a host page do not win */
.bless-result .bless-result__title {
  margin: 0;
  padding: 0;
  border: 0;
  font-size: var(--bless-text-lg);
  font-weight: var(--bless-font-weight-bold);
  line-height: 1.3;
}
.bless-result__title a {
  color: inherit;
  text-decoration: underline;
  text-decoration-thickness: 1px;
  text-underline-offset: 3px;
}
.bless-result__title a:hover {
  text-decoration-thickness: 3px;
}
.bless-result__title a:focus-visible {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: 2px;
}
.bless-result__snippet {
  line-height: 1.55;
}
.bless-result__date {
  color: var(--bless-color-text-muted);
}
.bless-result {
  animation: bless-enter var(--bless-duration-enter) var(--bless-ease-soft);
}
</style>
