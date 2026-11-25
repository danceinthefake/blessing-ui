<template>
  <div class="bless-emoji" :style="{ '--_cols': columns }">
    <input
      v-model="query"
      type="search"
      class="bless-emoji__search"
      :aria-label="text.search"
      :placeholder="text.search"
      :aria-controls="`${uid}-grid`"
      @keydown="onSearchKey"
    />
    <div
      v-if="!query"
      ref="bar"
      class="bless-emoji__groups"
      role="toolbar"
      :aria-label="text.groups"
    >
      <button
        v-for="g in groups"
        :key="g"
        type="button"
        class="bless-emoji__group"
        :aria-label="text[g]"
        :title="text[g]"
        @click="jump(g)"
      >
        <span aria-hidden="true">{{ blessEmojiGroupIcons[g] }}</span>
      </button>
    </div>
    <div :id="`${uid}-grid`" ref="grid" class="bless-emoji__grid" @keydown="onGridKey">
      <section v-for="(sec, s) in sections" :key="sec.key" class="bless-emoji__section">
        <!-- a label, not a heading: the picker must not change the outline of the page around it -->
        <div :id="`${uid}-${sec.key}`" class="bless-emoji__title">{{ sec.title }}</div>
        <div class="bless-emoji__items" role="group" :aria-labelledby="`${uid}-${sec.key}`">
          <button
            v-for="(e, i) in sec.items"
            :key="e.char"
            type="button"
            class="bless-emoji__item"
            :data-i="start(s) + i"
            :tabindex="start(s) + i === active ? 0 : -1"
            :aria-label="e.name"
            :title="e.name"
            @focus="active = start(s) + i"
            @click="pick(e)"
          >
            {{ e.char }}
          </button>
        </div>
      </section>
      <p v-if="!sections.length" class="bless-emoji__empty" role="status">{{ text.empty }}</p>
    </div>
    <!-- a title does not show on focus: the keyboard gets the name here -->
    <div v-if="shown" class="bless-emoji__preview" aria-hidden="true">
      <span class="bless-emoji__preview-char">{{ shown.char }}</span>
      <span>{{ shown.name }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, ref, useId } from "vue";
import { useLabelPack } from "../composables/useLabels";
import { useRovingFocus } from "../composables/useRovingFocus";
import { logicalKey } from "../composables/rtl";
import { readJson, writeJson } from "../composables/storage";
import { blessEmojiGroupIcons, blessEmojis, type BlessEmoji, type BlessEmojiGroup } from "./emoji";

defineOptions({ name: "BlessEmojiPicker" });
const pack = useLabelPack("BlessEmojiPicker");

const props = withDefaults(
  defineProps<{
    /** the set to offer; the default is the built-in one */
    emojis?: BlessEmoji[];
    /** emoji per row */
    columns?: number;
    /** how many recent emoji to keep; 0 hides the row */
    recentLimit?: number;
    /** keep the recent emoji in localStorage under this key (read after mount) */
    persist?: string;
    labels?: Partial<
      {
        search: string;
        groups: string;
        recent: string;
        results: string;
        empty: string;
      } & Record<BlessEmojiGroup, string>
    >;
  }>(),
  { columns: 8, recentLimit: 16 },
);
/** the chars of the recent emoji, newest first */
const recent = defineModel<string[]>("recent", { default: () => [] });
const emit = defineEmits<{ select: [emoji: BlessEmoji] }>();

const text = computed(() => ({
  search: "Search emoji",
  groups: "Emoji groups",
  recent: "Recent",
  results: "Results",
  empty: "No emoji found",
  smileys: "Smileys",
  people: "People",
  nature: "Animals and nature",
  food: "Food and drink",
  activities: "Activities",
  travel: "Travel and places",
  objects: "Objects",
  symbols: "Symbols",
  ...pack(),
  ...props.labels,
}));

const uid = useId();
const all = computed(() => props.emojis ?? blessEmojis);
const query = ref("");
type Section = { key: string; title: string; items: BlessEmoji[] };
const sections = computed<Section[]>(() => {
  const q = query.value.trim().toLowerCase();
  if (q) {
    const hits = all.value.filter(
      (e) =>
        e.name.toLowerCase().includes(q) || e.keywords?.some((k) => k.toLowerCase().includes(q)),
    );
    return hits.length ? [{ key: "results", title: text.value.results, items: hits }] : [];
  }
  const out: Section[] = [];
  const byChar = new Map(all.value.map((e) => [e.char, e]));
  const mine = recent.value.map((c) => byChar.get(c)).filter((e): e is BlessEmoji => !!e);
  if (props.recentLimit && mine.length)
    out.push({ key: "recent", title: text.value.recent, items: mine });
  for (const g of groups.value)
    out.push({ key: g, title: text.value[g], items: all.value.filter((e) => e.group === g) });
  return out;
});
const groups = computed(() => [...new Set(all.value.map((e) => e.group))] as BlessEmojiGroup[]);
const flat = computed(() => sections.value.flatMap((s) => s.items));

// one tab stop in the grid; the arrows move it
const active = ref(0);
const shown = computed(() => flat.value[Math.min(active.value, flat.value.length - 1)]);
const grid = ref<HTMLElement>();
const buttons = () => Array.from(grid.value?.querySelectorAll<HTMLElement>("[data-i]") ?? []);
function focusAt(i: number) {
  active.value = i;
  nextTick(() => {
    const el = buttons()[i];
    el?.focus();
    el?.scrollIntoView?.({ block: "nearest" });
  });
}
/** [section, index in it] of a flat index */
function locate(i: number): [number, number] {
  let n = i;
  for (const [s, sec] of sections.value.entries()) {
    if (n < sec.items.length) return [s, n];
    n -= sec.items.length;
  }
  return [0, 0];
}
const start = (s: number) => sections.value.slice(0, s).reduce((n, sec) => n + sec.items.length, 0);
function onGridKey(e: KeyboardEvent) {
  const cols = props.columns;
  const last = flat.value.length - 1;
  const [s, i] = locate(active.value);
  const len = sections.value[s]!.items.length;
  let next: number | undefined;
  switch (logicalKey(e)) {
    case "ArrowRight":
      next = Math.min(active.value + 1, last);
      break;
    case "ArrowLeft":
      next = Math.max(active.value - 1, 0);
      break;
    case "ArrowDown":
      // the next row, or the first row of the next section, in the same column
      if (i + cols < len) next = active.value + cols;
      else if (s + 1 < sections.value.length)
        next = start(s + 1) + Math.min(i % cols, sections.value[s + 1]!.items.length - 1);
      break;
    case "ArrowUp":
      if (i - cols >= 0) next = active.value - cols;
      else if (s > 0) {
        const prev = sections.value[s - 1]!.items.length;
        next = start(s - 1) + Math.min(Math.floor((prev - 1) / cols) * cols + (i % cols), prev - 1);
      }
      break;
    case "Home":
      next = 0;
      break;
    case "End":
      next = last;
      break;
  }
  if (next === undefined) return;
  e.preventDefault();
  focusAt(next);
}
function onSearchKey(e: KeyboardEvent) {
  if (e.key === "ArrowDown" && flat.value.length) {
    e.preventDefault();
    focusAt(0);
  } else if (e.key === "Enter" && flat.value.length) {
    e.preventDefault();
    pick(flat.value[0]!);
  }
}
function jump(g: string) {
  const s = sections.value.findIndex((sec) => sec.key === g);
  if (s >= 0) focusAt(start(s));
}

const storeKey = computed(() => (props.persist ? `bless-emoji:${props.persist}` : null));
function pick(e: BlessEmoji) {
  emit("select", e);
  if (!props.recentLimit) return;
  // from the local copy: a controlled v-model shows the new list only after the parent re-renders
  const next = [e.char, ...recent.value.filter((c) => c !== e.char)].slice(0, props.recentLimit);
  recent.value = next;
  if (storeKey.value) writeJson(storeKey.value, next);
}
onMounted(() => {
  // read after mount, so a server-rendered page and its first client render agree
  const saved = storeKey.value ? readJson(storeKey.value) : null;
  if (Array.isArray(saved) && !recent.value.length)
    recent.value = saved.filter((v): v is string => typeof v === "string");
});

const bar = ref<HTMLElement>();
useRovingFocus(bar);
</script>

<style>
.bless-emoji {
  box-sizing: border-box;
  display: grid;
  gap: var(--bless-space-2);
  inline-size: calc(var(--_cols) * 36px + 2 * var(--bless-space-2) + 2 * var(--bless-border-width));
  max-inline-size: 100%;
  padding: var(--bless-space-2);
  border: var(--bless-border-width) solid var(--bless-color-border);
  background: var(--bless-color-bg);
  font-family: var(--bless-font-sans);
  color: var(--bless-color-text);
}
.bless-emoji__search {
  box-sizing: border-box;
  inline-size: 100%;
  padding: var(--bless-space-2);
  border: 0;
  border-block-end: var(--bless-border-width) solid var(--bless-color-text-muted);
  background: transparent;
  color: inherit;
  font: inherit;
}
.bless-emoji__search:focus-visible {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: 1px;
}
.bless-emoji__groups {
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: minmax(0, 1fr);
}
.bless-emoji__group,
.bless-emoji__item {
  display: grid;
  place-items: center;
  /* square, and narrower than 36px when the picker has less room, as on a phone */
  min-inline-size: 0;
  max-inline-size: 36px;
  inline-size: 100%;
  aspect-ratio: 1;
  padding: 0;
  border: 0;
  background: transparent;
  font-size: 1.25rem;
  line-height: 1;
  cursor: pointer;
}
.bless-emoji__group:hover,
.bless-emoji__item:hover {
  background: var(--bless-color-surface);
}
.bless-emoji__group:focus-visible,
.bless-emoji__item:focus-visible {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: -2px;
}
.bless-emoji__grid {
  block-size: var(--bless-emoji-height, 260px);
  overflow-y: auto;
  overscroll-behavior: contain;
}
.bless-emoji__title {
  position: sticky;
  inset-block-start: 0;
  margin: 0;
  padding: var(--bless-space-1) 0;
  background: var(--bless-color-bg);
  font-size: var(--bless-text-xs);
  font-weight: var(--bless-font-weight-bold);
  letter-spacing: var(--bless-tracking-wide);
  text-transform: var(--bless-label-case);
  color: var(--bless-color-text-muted);
}
.bless-emoji__items {
  display: grid;
  grid-template-columns: repeat(var(--_cols), minmax(0, 1fr));
}
.bless-emoji__empty {
  margin: var(--bless-space-4) 0;
  text-align: center;
  color: var(--bless-color-text-muted);
}
.bless-emoji__preview {
  display: flex;
  align-items: center;
  gap: var(--bless-space-2);
  min-block-size: 28px;
  padding-block-start: var(--bless-space-2);
  border-block-start: var(--bless-border-width) solid var(--bless-color-rule);
  font-size: var(--bless-text-sm);
  color: var(--bless-color-text-muted);
}
.bless-emoji__preview-char {
  font-size: 1.25rem;
}
</style>
