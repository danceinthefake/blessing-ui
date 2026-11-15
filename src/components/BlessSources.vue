<script setup lang="ts">
import { computed, useId } from "vue";
import { useLabelPack } from "../composables/useLabels";

defineOptions({ name: "BlessSources" });
const pack = useLabelPack("BlessSources");

export interface BlessSource {
  title: string;
  url: string;
  /** the name of the site; default: the host of the URL without `www.` */
  site?: string;
  /** a short quote or summary of what the reply takes from it */
  snippet?: string;
}

const props = defineProps<{
  sources: BlessSource[];
  /** the start of the ids of the items: item 2 is `<id>-2`, so a mark `[2]` in the reply can link to `#<id>-2` */
  id?: string;
  labels?: Partial<{ title: string }>;
}>();

const text = computed(() => ({ title: "Sources", ...pack(), ...props.labels }));
const auto = useId();
const base = computed(() => props.id ?? `bless-src-${auto}`);
const host = (url: string) => {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
};
</script>

<template>
  <section class="bless-sources" :aria-labelledby="`${base}-title`">
    <p :id="`${base}-title`" class="bless-sources__title">{{ text.title }}</p>
    <ol class="bless-sources__list">
      <li
        v-for="(s, i) in sources"
        :id="`${base}-${i + 1}`"
        :key="s.url + i"
        class="bless-sources__item"
      >
        <span class="bless-sources__num" aria-hidden="true">{{ i + 1 }}</span>
        <div class="bless-sources__main">
          <a class="bless-sources__link" :href="s.url">{{ s.title }}</a>
          <span class="bless-sources__site">{{ s.site ?? host(s.url) }}</span>
          <p v-if="s.snippet" class="bless-sources__snippet">{{ s.snippet }}</p>
        </div>
      </li>
    </ol>
  </section>
</template>

<style>
.bless-sources {
  font-family: var(--bless-font-sans);
  font-size: var(--bless-text-sm);
  color: var(--bless-color-text);
}
.bless-sources__title {
  margin: 0 0 var(--bless-space-2);
  font-size: var(--bless-text-xs);
  font-weight: var(--bless-font-weight-bold);
  letter-spacing: var(--bless-tracking-wide);
  text-transform: uppercase;
  color: var(--bless-color-text-muted);
}
.bless-sources__list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(14rem, 1fr));
  gap: var(--bless-space-2);
  margin: 0;
  padding: 0;
  list-style: none;
}
.bless-sources__item {
  display: flex;
  gap: var(--bless-space-2);
  padding: var(--bless-space-2) var(--bless-space-3);
  border: var(--bless-border-width) solid var(--bless-color-border);
  border-radius: var(--bless-radius-plate);
  scroll-margin-block: var(--bless-space-8);
}
/* a mark in the reply that links here lights the item up */
.bless-sources__item:target {
  border-color: var(--bless-color-accent);
  background: var(--bless-color-accent-soft);
}
.bless-sources__num {
  flex: none;
  display: inline-grid;
  place-items: center;
  inline-size: 1.4rem;
  block-size: 1.4rem;
  background: var(--bless-color-surface-2);
  font-size: var(--bless-text-xs);
  font-weight: var(--bless-font-weight-bold);
  font-variant-numeric: tabular-nums;
}
.bless-sources__main {
  display: flex;
  flex-direction: column;
  min-inline-size: 0;
}
.bless-sources__link {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: var(--bless-color-text);
  font-weight: var(--bless-font-weight-bold);
  text-decoration: none;
}
.bless-sources__link:hover {
  text-decoration: underline;
}
.bless-sources__link:focus-visible {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: 2px;
}
.bless-sources__site {
  font-size: var(--bless-text-xs);
  color: var(--bless-color-text-muted);
}
/* put this class on the [1] links in the reply */
.bless-source-mark {
  display: inline-grid;
  place-items: center;
  min-inline-size: 1.2em;
  margin-inline: 0.1em;
  padding-inline: 0.25em;
  vertical-align: super;
  background: var(--bless-color-surface-2);
  color: var(--bless-color-text);
  font-size: 0.7em;
  font-weight: var(--bless-font-weight-bold);
  line-height: 1.5;
  text-decoration: none;
}
.bless-source-mark:hover {
  background: var(--bless-color-accent-soft);
}
.bless-source-mark:focus-visible {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: 1px;
}
.bless-sources__snippet {
  display: -webkit-box;
  margin: var(--bless-space-1) 0 0;
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  font-size: var(--bless-text-xs);
  color: var(--bless-color-text-muted);
}
</style>
