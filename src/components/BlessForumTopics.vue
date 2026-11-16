<script setup lang="ts">
import { computed } from "vue";
import { useLabelPack } from "../composables/useLabels";
import BlessAvatar from "./BlessAvatar.vue";

defineOptions({ name: "BlessForumTopics" });
const pack = useLabelPack("BlessForumTopics");

export interface BlessForumTopic {
  id: string;
  title: string;
  href?: string;
  author: string;
  replies: number;
  views?: number;
  /** the last post: who and when, as text */
  last?: { author: string; time: string };
  pinned?: boolean;
  locked?: boolean;
  solved?: boolean;
  tags?: string[];
}

const props = withDefaults(
  defineProps<{
    topics: BlessForumTopic[];
    locale?: string;
    labels?: Partial<{
      title: string;
      pinned: string;
      locked: string;
      solved: string;
      by: (name: string) => string;
      replies: (count: string) => string;
      views: (count: string) => string;
      last: (name: string, time: string) => string;
    }>;
  }>(),
  { locale: "en" },
);

const text = computed(() => ({
  title: "Topics",
  pinned: "Pinned",
  locked: "Locked",
  solved: "Solved",
  by: (n: string) => `by ${n}`,
  replies: (n: string) => `${n} replies`,
  views: (n: string) => `${n} views`,
  last: (n: string, t: string) => `Last post by ${n}, ${t}`,
  ...pack(),
  ...props.labels,
}));
const short = computed(
  () => new Intl.NumberFormat(props.locale, { notation: "compact", maximumFractionDigits: 1 }),
);
const flags = (t: BlessForumTopic) =>
  [
    t.pinned && { key: "pinned", mark: "📌︎", word: text.value.pinned },
    t.solved && { key: "solved", mark: "✓", word: text.value.solved },
    t.locked && { key: "locked", mark: "⊘", word: text.value.locked },
  ].filter((f): f is { key: string; mark: string; word: string } => !!f);
// pinned topics first; the rest keep their order
const ordered = computed(() => [
  ...props.topics.filter((t) => t.pinned),
  ...props.topics.filter((t) => !t.pinned),
]);
</script>

<template>
  <section class="bless-forum" :aria-label="text.title">
    <ul class="bless-forum__list">
      <li
        v-for="t in ordered"
        :key="t.id"
        class="bless-forum__topic"
        :class="{ 'is-pinned': t.pinned }"
      >
        <BlessAvatar :name="t.author" alt="" size="sm" />
        <div class="bless-forum__main">
          <span v-if="flags(t).length" class="bless-forum__flags">
            <template v-for="f in flags(t)" :key="f.word"
              ><span class="bless-forum__flag" :class="`is-${f.key}`"
                ><span aria-hidden="true">{{ f.mark }}</span> {{ f.word }}</span
              >{{ " " }}</template
            >
          </span>
          <a v-if="t.href" class="bless-forum__title" :href="t.href">{{ t.title }}</a>
          <strong v-else class="bless-forum__title">{{ t.title }}</strong>
          <span class="bless-forum__meta">
            {{ text.by(t.author)
            }}<template v-for="tag in t.tags ?? []" :key="tag"> · #{{ tag }}</template>
          </span>
        </div>
        <div class="bless-forum__stats">
          <span>{{ text.replies(short.format(t.replies)) }}</span>
          <span v-if="t.views !== undefined">{{ text.views(short.format(t.views)) }}</span>
          <span v-if="t.last" class="bless-forum__last">{{
            text.last(t.last.author, t.last.time)
          }}</span>
        </div>
      </li>
    </ul>
  </section>
</template>

<style>
.bless-forum {
  font-family: var(--bless-font-sans);
  font-size: var(--bless-text-sm);
  color: var(--bless-color-text);
}
.bless-forum__list {
  display: grid;
  margin: 0;
  padding: 0;
  border-block-start: var(--bless-border-width) solid var(--bless-color-border);
  list-style: none;
}
.bless-forum__topic {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  gap: var(--bless-space-3);
  border-block-end: var(--bless-border-width) solid var(--bless-color-border);
}
/* the space sits on the children, so a list reset of the host page keeps it */
.bless-forum__topic > * {
  margin-block: var(--bless-space-3);
}
.bless-forum__topic.is-pinned {
  background: color-mix(in srgb, var(--bless-color-accent) 8%, var(--bless-color-bg));
}
.bless-forum__main {
  display: grid;
  flex: 1 1 16rem;
  gap: 2px;
  min-inline-size: 0;
}
.bless-forum__flags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--bless-space-2);
}
.bless-forum__flag {
  font-size: var(--bless-text-xs);
  font-weight: var(--bless-font-weight-bold);
}
.bless-forum__title {
  color: inherit;
  font-weight: var(--bless-font-weight-bold);
  text-decoration: none;
}
a.bless-forum__title:hover {
  text-decoration: underline;
}
a.bless-forum__title:focus-visible {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: 2px;
}
.bless-forum__meta {
  font-size: var(--bless-text-xs);
  color: var(--bless-color-text);
}
.bless-forum__stats {
  display: grid;
  flex: 0 0 11rem;
  justify-items: end;
  font-size: var(--bless-text-xs);
  font-variant-numeric: tabular-nums;
}
.bless-forum__last {
  text-align: end;
}
@media (max-width: 560px) {
  .bless-forum__stats {
    flex-basis: 100%;
    justify-items: start;
    display: flex;
    flex-wrap: wrap;
    gap: 0 var(--bless-space-2);
    margin-block-start: 0;
    padding-inline-start: calc(2rem + var(--bless-space-3));
  }
}
</style>
