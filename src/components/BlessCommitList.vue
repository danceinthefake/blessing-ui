<script setup lang="ts">
import { computed } from "vue";
import { useLabelPack } from "../composables/useLabels";
import BlessAvatar from "./BlessAvatar.vue";
import BlessCopyButton from "./BlessCopyButton.vue";
import "./sr.css";

defineOptions({ name: "BlessCommitList" });
const pack = useLabelPack("BlessCommitList");

export interface BlessCommit {
  sha: string;
  /** the first line of the message */
  title: string;
  author: string;
  /** milliseconds since 1970 or an ISO date */
  time: number | string;
  added?: number;
  removed?: number;
  url?: string;
}

const props = withDefaults(
  defineProps<{
    commits: BlessCommit[];
    locale?: string;
    /** an IANA time zone for the days; set it when you render on a server */
    timeZone?: string;
    labels?: Partial<{
      day: (date: string) => string;
      changes: (added: number, removed: number) => string;
      copy: string;
      copied: string;
    }>;
  }>(),
  { locale: "en" },
);

const text = computed(() => ({
  day: (d: string) => `Commits on ${d}`,
  changes: (a: number, r: number) => `${a} lines added, ${r} lines removed`,
  copy: "Copy",
  copied: "Copied",
  ...pack(),
  ...props.labels,
}));
const dayFmt = computed(
  () => new Intl.DateTimeFormat(props.locale, { dateStyle: "medium", timeZone: props.timeZone }),
);
const timeFmt = computed(
  () =>
    new Intl.DateTimeFormat(props.locale, {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: props.timeZone,
    }),
);
const days = computed(() => {
  const m = new Map<string, BlessCommit[]>();
  for (const c of [...props.commits].sort((a, b) => +new Date(b.time) - +new Date(a.time))) {
    const k = dayFmt.value.format(new Date(c.time));
    m.set(k, [...(m.get(k) ?? []), c]);
  }
  return [...m];
});
const num = computed(() => new Intl.NumberFormat(props.locale));
</script>

<template>
  <div class="bless-commits">
    <section v-for="[day, list] in days" :key="day" :aria-label="text.day(day)">
      <div class="bless-commits__day" aria-hidden="true">{{ text.day(day) }}</div>
      <ol class="bless-stagger bless-commits__list" role="list">
        <li v-for="c in list" :key="c.sha">
          <div class="bless-commits__row">
            <BlessAvatar :name="c.author" size="sm" />
            <span class="bless-commits__main">
              <a v-if="c.url" :href="c.url" class="bless-commits__title">{{ c.title }}</a>
              <span v-else class="bless-commits__title">{{ c.title }}</span>
              <span class="bless-commits__meta"
                >{{ c.author }} · {{ timeFmt.format(new Date(c.time)) }}</span
              >
            </span>
            <span v-if="c.added != null || c.removed != null" class="bless-commits__diff">
              <span aria-hidden="true" class="is-add">+{{ num.format(c.added ?? 0) }}</span>
              <span aria-hidden="true" class="is-del">−{{ num.format(c.removed ?? 0) }}</span>
              <span class="bless-sr">{{ text.changes(c.added ?? 0, c.removed ?? 0) }}</span>
            </span>
            <span class="bless-commits__sha">
              <code>{{ c.sha.slice(0, 7) }}</code>
              <BlessCopyButton :value="c.sha" size="sm" variant="ghost">
                <template #default="{ copied }"
                  >{{ copied ? text.copied : text.copy
                  }}<span class="bless-sr">{{ ` ${c.sha.slice(0, 7)}` }}</span></template
                >
              </BlessCopyButton>
            </span>
          </div>
        </li>
      </ol>
    </section>
  </div>
</template>

<style>
.bless-commits {
  display: grid;
  gap: var(--bless-space-4);
  font-family: var(--bless-font-sans);
  font-size: var(--bless-text-sm);
  color: var(--bless-color-text);
}
.bless-commits__day {
  margin-block-end: var(--bless-space-2);
  font-size: var(--bless-text-xs);
  font-weight: var(--bless-font-weight-bold);
}
.bless-commits__list {
  display: grid;
  margin: 0;
  padding: 0;
  list-style: none;
  border: var(--bless-border-width) solid var(--bless-color-border);
}
.bless-commits__list li + li {
  border-block-start: var(--bless-border-width) solid var(--bless-color-border);
}
.bless-commits__row {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto auto;
  align-items: center;
  gap: var(--bless-space-3);
  padding: var(--bless-space-2) var(--bless-space-3);
}
@media (max-width: 36rem) {
  .bless-commits__diff {
    display: none;
  }
  .bless-commits__row {
    grid-template-columns: auto minmax(0, 1fr) auto;
  }
}
.bless-commits__main {
  display: grid;
  min-inline-size: 0;
}
.bless-commits__title {
  overflow: hidden;
  color: inherit;
  font-weight: var(--bless-font-weight-bold);
  text-overflow: ellipsis;
  white-space: nowrap;
}
a.bless-commits__title:focus-visible {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: 2px;
}
.bless-commits__meta {
  font-size: var(--bless-text-xs);
}
.bless-commits__diff {
  display: flex;
  gap: var(--bless-space-2);
  font-size: var(--bless-text-xs);
  font-weight: var(--bless-font-weight-bold);
  font-variant-numeric: tabular-nums;
}
.bless-commits__diff .is-del {
  color: var(--bless-color-danger-text);
}
.bless-commits__sha {
  display: flex;
  align-items: center;
  gap: var(--bless-space-1);
}
.bless-commits__sha code {
  font-family: var(--bless-font-mono, ui-monospace, monospace);
}
</style>
