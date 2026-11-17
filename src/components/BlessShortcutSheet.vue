<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { splitShortcut } from "../composables/shortcut";
import { useLabelPack } from "../composables/useLabels";
import BlessInput from "./BlessInput.vue";
import BlessKbd from "./BlessKbd.vue";

defineOptions({ name: "BlessShortcutSheet" });
const pack = useLabelPack("BlessShortcutSheet");

export interface BlessShortcut {
  /** a combo such as `Mod+K`, or a list of combos that do the same thing; `Mod` is ⌘ on Apple and Ctrl elsewhere */
  keys: string | string[];
  description: string;
}
export interface BlessShortcutGroup {
  title: string;
  shortcuts: BlessShortcut[];
}

const props = withDefaults(
  defineProps<{
    groups: BlessShortcutGroup[];
    /** show a search box over the list */
    search?: boolean;
    labels?: Partial<{ search: string; none: string; or: string }>;
  }>(),
  { search: true },
);

const text = computed(() => ({
  search: "Search shortcuts",
  none: "No shortcuts found",
  or: "or",
  ...pack(),
  ...props.labels,
}));
const query = ref("");
// the platform is read after mount, so the server and the first client render agree
const apple = ref(false);
onMounted(() => (apple.value = /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent)));
const keyName = (k: string) =>
  k === "Mod"
    ? apple.value
      ? "⌘"
      : "Ctrl"
    : k === "Alt" && apple.value
      ? "⌥"
      : k === "Meta" && apple.value
        ? "⌘"
        : k;
const combos = (s: BlessShortcut) => (Array.isArray(s.keys) ? s.keys : [s.keys]);

const shown = computed(() => {
  const q = query.value.trim().toLowerCase();
  return props.groups
    .map((g) => ({
      ...g,
      shortcuts: q
        ? g.shortcuts.filter(
            (s) =>
              s.description.toLowerCase().includes(q) ||
              combos(s).join(" ").toLowerCase().includes(q),
          )
        : g.shortcuts,
    }))
    .filter((g) => g.shortcuts.length);
});
</script>

<template>
  <div class="bless-shortcuts">
    <BlessInput
      v-if="search"
      v-model="query"
      class="bless-shortcuts__search"
      type="search"
      size="sm"
      :aria-label="text.search"
      :placeholder="text.search"
    />
    <p v-if="!shown.length" class="bless-shortcuts__none" role="status">{{ text.none }}</p>
    <div class="bless-shortcuts__groups">
      <section v-for="g in shown" :key="g.title" class="bless-shortcuts__group">
        <p class="bless-shortcuts__title">{{ g.title }}</p>
        <dl class="bless-shortcuts__list">
          <div v-for="s in g.shortcuts" :key="s.description" class="bless-shortcuts__row">
            <dt>{{ s.description }}</dt>
            <dd>
              <template v-for="(c, i) in combos(s)" :key="c">
                <span v-if="i" class="bless-shortcuts__or">{{ text.or }}</span>
                <BlessKbd :keys="splitShortcut(c).map(keyName)" />
              </template>
            </dd>
          </div>
        </dl>
      </section>
    </div>
  </div>
</template>

<style>
.bless-shortcuts {
  display: flex;
  flex-direction: column;
  gap: var(--bless-space-4);
  font-family: var(--bless-font-sans);
  color: var(--bless-color-text);
}
.bless-shortcuts__search {
  max-inline-size: 20rem;
}
.bless-shortcuts__none {
  margin: 0;
  color: var(--bless-color-text-muted);
}
.bless-shortcuts__groups {
  columns: 18rem 2;
  column-gap: var(--bless-space-8);
}
.bless-shortcuts__group {
  break-inside: avoid;
  margin-block-end: var(--bless-space-6);
}
.bless-shortcuts__title {
  margin: 0 0 var(--bless-space-2);
  font-size: var(--bless-text-xs);
  font-weight: var(--bless-font-weight-bold);
  letter-spacing: var(--bless-tracking-wide);
  text-transform: uppercase;
  color: var(--bless-color-text-muted);
}
.bless-shortcuts__list {
  margin: 0;
}
.bless-shortcuts__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--bless-space-3);
  padding-block: var(--bless-space-2);
  border-block-end: var(--bless-border-width) solid var(--bless-color-border);
  font-size: var(--bless-text-sm);
}
.bless-shortcuts__row dd {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-end;
  gap: var(--bless-space-1);
  margin: 0;
}
.bless-shortcuts__or {
  font-size: var(--bless-text-xs);
  color: var(--bless-color-text-muted);
}
.bless-shortcuts {
  animation: bless-enter var(--bless-duration-enter) var(--bless-ease-soft);
}
</style>
