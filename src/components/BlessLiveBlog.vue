<template>
  <section class="bless-live" :aria-label="text.title">
    <div class="bless-live__head">
      <span v-if="live" class="bless-live__badge"
        ><span class="bless-live__dot" aria-hidden="true" />{{ text.live }}</span
      >
      <button v-if="waiting.length" type="button" class="bless-live__new" @click="reveal">
        ↑ {{ text.show(waiting.length) }}
      </button>
      <span class="bless-sr" role="status">{{
        waiting.length ? text.show(waiting.length) : ""
      }}</span>
    </div>
    <ol ref="list" class="bless-stagger bless-live__list" role="list">
      <li
        v-for="u in [...pinned, ...rest]"
        :key="u.id"
        class="bless-live__update"
        :class="{ 'is-pinned': u.pinned, 'is-key': u.key }"
        tabindex="-1"
      >
        <div class="bless-live__card">
          <div class="bless-live__meta">
            <time class="bless-live__time">{{ u.time }}</time>
            <span v-if="u.pinned" class="bless-live__tag">{{ text.pinned }}</span>
            <span v-if="u.key" class="bless-live__tag is-key">★ {{ text.key }}</span>
          </div>
          <h3 v-if="u.title" class="bless-live__title">{{ u.title }}</h3>
          <p class="bless-live__body">{{ u.body }}</p>
        </div>
      </li>
    </ol>
  </section>
</template>

<script setup lang="ts">
import { computed, nextTick, ref, watch } from "vue";
import { useLabelPack } from "../composables/useLabels";
import "./sr.css";

defineOptions({ name: "BlessLiveBlog" });
const pack = useLabelPack("BlessLiveBlog");

export interface BlessLiveUpdate {
  id: string;
  /** when, as text, for example "14:32" */
  time: string;
  title?: string;
  body: string;
  /** stays on top */
  pinned?: boolean;
  /** a key moment, marked in the list */
  key?: boolean;
}

const props = defineProps<{
  /** newest first */
  updates: BlessLiveUpdate[];
  /** the event is still going on */
  live?: boolean;
  labels?: Partial<{
    title: string;
    live: string;
    pinned: string;
    key: string;
    show: (count: number) => string;
  }>;
}>();

const text = computed(() => ({
  title: "Live updates",
  live: "Live",
  pinned: "Pinned",
  key: "Key moment",
  show: (n: number) => (n === 1 ? "Show 1 new update" : `Show ${n} new updates`),
  ...pack(),
  ...props.labels,
}));
// updates that came while the reader reads wait behind a button, so the page does not jump
const shown = ref(new Set(props.updates.map((u) => u.id)));
// the first updates to load are the page itself, not news: show them at once
watch(
  () => props.updates.length,
  (n) => n && !shown.value.size && (shown.value = new Set(props.updates.map((u) => u.id))),
);
const waiting = computed(() => props.updates.filter((u) => !shown.value.has(u.id)));
watch(
  () => props.updates.length,
  () => {
    // updates removed from the list do not count
    shown.value = new Set([...shown.value].filter((id) => props.updates.some((u) => u.id === id)));
  },
);
const list = ref<HTMLElement>();
function reveal() {
  shown.value = new Set(props.updates.map((u) => u.id));
  nextTick(() =>
    list.value?.querySelector<HTMLElement>(".bless-live__update:not(.is-pinned)")?.focus(),
  );
}
const visible = computed(() => props.updates.filter((u) => shown.value.has(u.id)));
const pinned = computed(() => visible.value.filter((u) => u.pinned));
const rest = computed(() => visible.value.filter((u) => !u.pinned));
</script>

<style>
.bless-live {
  display: grid;
  gap: var(--bless-space-3);
  font-family: var(--bless-font-sans);
  font-size: var(--bless-text-sm);
  color: var(--bless-color-text);
}
.bless-live__head {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--bless-space-3);
}
.bless-live__badge {
  display: inline-flex;
  align-items: center;
  gap: var(--bless-space-1);
  padding: 2px var(--bless-space-2);
  background: var(--bless-color-danger);
  color: #fff;
  font-size: var(--bless-text-xs);
  font-weight: var(--bless-font-weight-bold);
  letter-spacing: var(--bless-tracking-wide);
  text-transform: uppercase;
}
.bless-live__dot {
  inline-size: 0.5rem;
  block-size: 0.5rem;
  border-radius: 50%;
  background: currentColor;
}
@media (prefers-reduced-motion: no-preference) {
  .bless-live__dot {
    animation: bless-live-pulse 1.6s ease-in-out infinite;
  }
}
@keyframes bless-live-pulse {
  50% {
    opacity: 0.3;
  }
}
.bless-live__new {
  padding: var(--bless-space-1) var(--bless-space-3);
  border: 0;
  background: var(--bless-color-text);
  color: var(--bless-color-bg);
  font: inherit;
  font-weight: var(--bless-font-weight-bold);
  cursor: pointer;
}
.bless-live__new:focus-visible {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: 2px;
}
.bless-live__list {
  display: grid;
  margin: 0;
  padding: 0;
  list-style: none;
  border-inline-start: 2px solid var(--bless-color-border);
}
/* the space sits on a div, so a list or p reset of the host page keeps it */
.bless-live__card {
  display: grid;
  gap: var(--bless-space-1);
  padding: var(--bless-space-3) var(--bless-space-4);
}
.bless-live__update {
  border-block-end: var(--bless-border-width) solid var(--bless-color-border);
}
.bless-live__update:focus {
  outline: none;
}
.bless-live__update.is-pinned {
  background: color-mix(in srgb, var(--bless-color-accent) 8%, var(--bless-color-bg));
}
.bless-live__update.is-key {
  box-shadow: inset 4px 0 0 var(--bless-color-accent);
}
.bless-live__meta {
  display: flex;
  flex-wrap: wrap;
  gap: var(--bless-space-2);
  font-size: var(--bless-text-xs);
}
.bless-live__time {
  font-weight: var(--bless-font-weight-bold);
  font-variant-numeric: tabular-nums;
}
.bless-live__tag {
  font-weight: var(--bless-font-weight-bold);
}
.bless-live .bless-live__title {
  margin: 0;
  font-size: var(--bless-text-md);
}
.bless-live__body {
  margin: 0;
  line-height: 1.55;
}
</style>
