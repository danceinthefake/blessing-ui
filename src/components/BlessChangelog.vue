<script setup lang="ts">
import { computed } from "vue";
import { fromISO } from "../composables/date";
import { useLabelPack } from "../composables/useLabels";

defineOptions({ name: "BlessChangelog" });
const pack = useLabelPack("BlessChangelog");

export type BlessChangeType = "added" | "changed" | "deprecated" | "removed" | "fixed" | "security";
export interface BlessRelease {
  version: string;
  /** `YYYY-MM-DD` */
  date?: string;
  /** a short name for the release, after the version */
  title?: string;
  changes: { type: BlessChangeType; text: string }[];
}

const props = withDefaults(
  defineProps<{
    /** newest first */
    releases: BlessRelease[];
    /** the heading level of each release, to fit the page */
    level?: 2 | 3 | 4 | 5;
    locale?: string;
    labels?: Partial<Record<BlessChangeType, string>>;
  }>(),
  { level: 3, locale: "en" },
);

const text = computed(() => ({
  added: "Added",
  changed: "Changed",
  deprecated: "Deprecated",
  removed: "Removed",
  fixed: "Fixed",
  security: "Security",
  ...pack(),
  ...props.labels,
}));
// the groups in the order of Keep a Changelog
const ORDER: BlessChangeType[] = ["added", "changed", "deprecated", "removed", "fixed", "security"];
const groups = (r: BlessRelease) =>
  ORDER.map((type) => ({ type, items: r.changes.filter((c) => c.type === type) })).filter(
    (g) => g.items.length,
  );
const dateText = computed(
  () => new Intl.DateTimeFormat(props.locale, { day: "numeric", month: "long", year: "numeric" }),
);
</script>

<template>
  <div class="bless-changelog">
    <article v-for="r in releases" :key="r.version" class="bless-changelog__release">
      <header class="bless-changelog__head">
        <component :is="`h${level}`" class="bless-changelog__version">
          {{ r.version }}<template v-if="r.title"> · {{ r.title }}</template>
        </component>
        <time v-if="r.date" class="bless-changelog__date" :datetime="r.date">{{
          dateText.format(fromISO(r.date))
        }}</time>
      </header>
      <section v-for="g in groups(r)" :key="g.type" class="bless-changelog__group">
        <span class="bless-changelog__type" :class="`bless-changelog__type--${g.type}`">{{
          text[g.type]
        }}</span>
        <ul class="bless-changelog__list">
          <li v-for="(c, i) in g.items" :key="i">{{ c.text }}</li>
        </ul>
      </section>
    </article>
  </div>
</template>

<style>
.bless-changelog {
  display: flex;
  flex-direction: column;
  font-family: var(--bless-font-sans);
  color: var(--bless-color-text);
}
.bless-changelog__release {
  display: flex;
  flex-direction: column;
  gap: var(--bless-space-3);
  padding-block: var(--bless-space-6);
  border-block-start: var(--bless-border-width) solid var(--bless-color-border);
}
.bless-changelog__release:first-child {
  padding-block-start: 0;
  border-block-start: 0;
}
.bless-changelog__head {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: var(--bless-space-1) var(--bless-space-3);
}
.bless-changelog__version {
  margin: 0;
  font-size: var(--bless-text-lg);
  font-weight: var(--bless-font-weight-bold);
}
.bless-changelog__date {
  font-size: var(--bless-text-sm);
  color: var(--bless-color-text-muted);
}
.bless-changelog__group {
  display: grid;
  grid-template-columns: 6.5rem 1fr;
  gap: var(--bless-space-3);
  align-items: start;
}
.bless-changelog__type {
  justify-self: start;
  padding: 1px var(--bless-space-2);
  border-inline-start: 3px solid var(--_c, var(--bless-color-text-muted));
  background: var(--bless-color-surface-2);
  font-size: var(--bless-text-xs);
  font-weight: var(--bless-font-weight-bold);
  letter-spacing: var(--bless-tracking-wide);
  text-transform: uppercase;
}
.bless-changelog__type--added {
  --_c: var(--bless-color-success);
}
.bless-changelog__type--changed {
  --_c: var(--bless-color-info);
}
.bless-changelog__type--deprecated,
.bless-changelog__type--removed {
  --_c: var(--bless-color-warning);
}
.bless-changelog__type--fixed {
  --_c: var(--bless-color-chart-1);
}
.bless-changelog__type--security {
  --_c: var(--bless-color-danger);
}
.bless-changelog__list {
  display: flex;
  flex-direction: column;
  gap: var(--bless-space-1);
  margin: 0;
  padding-inline-start: 1.1em;
  font-size: var(--bless-text-sm);
  line-height: var(--bless-leading-normal);
}
@media (max-width: 480px) {
  .bless-changelog__group {
    grid-template-columns: 1fr;
    gap: var(--bless-space-1);
  }
}
</style>
