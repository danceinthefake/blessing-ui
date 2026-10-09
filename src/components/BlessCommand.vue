<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, useId, watch } from "vue";
import BlessKbd from "./BlessKbd.vue";
import BlessModal from "./BlessModal.vue";

defineOptions({ name: "BlessCommand" });

export interface BlessCommandScope {
  /** the character that starts it when typed first: `@`, `#`, `>` */
  key: string;
  /** the `group` of the items it searches */
  group: string;
  /** what it is called in the chip and the hint; defaults to the group */
  label?: string;
}

export interface BlessCommandItem {
  label: string;
  value: string;
  group?: string;
  keywords?: string[];
  shortcut?: string;
  icon?: string;
  disabled?: boolean;
}

const props = withDefaults(
  defineProps<{
    items: BlessCommandItem[];
    placeholder?: string;
    /** accessible name of the search input */
    label?: string;
    emptyText?: string;
    /** bind ⌘K / Ctrl+K to open */
    hotkey?: boolean;
    /** render inline instead of inside a modal */
    inline?: boolean;
    filter?: (item: BlessCommandItem, query: string) => boolean;
    /** prefixes that narrow the search to one group: `[{ key: "@", group: "People" }]` */
    scopes?: BlessCommandScope[];
    /** put the items chosen before at the top while the search is empty */
    recent?: boolean;
    recentLimit?: number;
    /** keep the history in localStorage under this key (read after mount) */
    persist?: string;
    labels?: Partial<{
      recent: string;
      scope: (label: string) => string;
      clearScope: string;
      scopeHint: (parts: string[]) => string;
    }>;
  }>(),
  {
    placeholder: "Type a command…",
    label: "Search commands",
    emptyText: "No results.",
    hotkey: true,
    recentLimit: 5,
  },
);
const text = computed(() => ({
  recent: "Recent",
  scope: (l: string) => `Only in ${l}`,
  clearScope: "Search everywhere",
  scopeHint: (parts: string[]) => `Type ${parts.join(", ")}`,
  ...props.labels,
}));

const open = defineModel<boolean>("open", { default: false });
/** values of the items chosen so far, most recent first */
const history = defineModel<string[]>("history", { default: () => [] });
const emit = defineEmits<{ select: [item: BlessCommandItem] }>();

const id = useId();
const query = ref("");
const active = ref(0);
const input = ref<HTMLInputElement>();

const defaultFilter = (it: BlessCommandItem, q: string) => {
  const hay = [it.label, ...(it.keywords ?? [])].join(" ").toLowerCase();
  return q.split(/\s+/).every((w) => hay.includes(w));
};
// --- scopes: a leading key ("@") narrows the search to one group ---
const scope = ref<BlessCommandScope | null>(null);
watch(query, (q) => {
  if (scope.value || !props.scopes?.length) return;
  const hit = props.scopes.find((s) => q.startsWith(s.key));
  if (hit) {
    scope.value = hit;
    query.value = q.slice(hit.key.length).replace(/^\s+/, "");
  }
});
const scopeName = (s: BlessCommandScope) => s.label ?? s.group;
function clearScope() {
  scope.value = null;
  nextTick(() => input.value?.focus());
}
const scopeHint = computed(() =>
  props.scopes?.length && !scope.value
    ? text.value.scopeHint(props.scopes.map((s) => `${s.key} ${scopeName(s)}`))
    : "",
);

const results = computed(() => {
  const q = query.value.trim().toLowerCase();
  const f = props.filter ?? defaultFilter;
  const pool = scope.value
    ? props.items.filter((it) => it.group === scope.value!.group)
    : props.items;
  return pool.filter((it) => !q || f(it, q));
});
// the Recent group: only while nothing is typed and no scope is chosen
const recents = computed(() => {
  if (!props.recent || query.value.trim() || scope.value) return [];
  return history.value
    .map((v) => props.items.find((it) => it.value === v && !it.disabled))
    .filter((it): it is BlessCommandItem => !!it)
    .slice(0, props.recentLimit);
});
interface Section {
  key: string;
  label: string;
  items: BlessCommandItem[];
  recent: boolean;
}
const sections = computed<Section[]>(() => {
  const m = new Map<string, BlessCommandItem[]>();
  for (const it of results.value) m.set(it.group ?? "", [...(m.get(it.group ?? "") ?? []), it]);
  const out: Section[] = [...m.entries()].map(([g, items]) => ({
    key: g,
    label: g,
    items,
    recent: false,
  }));
  if (recents.value.length)
    out.unshift({ key: "\0recent", label: text.value.recent, items: recents.value, recent: true });
  return out;
});
const flat = computed(() => sections.value.flatMap((s) => s.items));
// the same item can be listed twice (recent, then in its group), so a row's id says which
const rowId = (it: BlessCommandItem, recent: boolean) => `${id}-${recent ? "r-" : ""}${it.value}`;
// the keyboard position is a place in `flat`, so it also knows which listing it is in
const activeId = computed(() => {
  let n = 0;
  for (const s of sections.value)
    for (const it of s.items) if (n++ === active.value) return rowId(it, s.recent);
  return undefined;
});
const offset = (si: number) => sections.value.slice(0, si).reduce((a, s) => a + s.items.length, 0);

// a new result list starts on its first item that can be chosen
watch(
  results,
  () =>
    (active.value = Math.max(
      0,
      flat.value.findIndex((it) => !it.disabled),
    )),
);
watch(
  scope,
  () =>
    (active.value = Math.max(
      0,
      flat.value.findIndex((it) => !it.disabled),
    )),
);
watch(open, (o) => {
  if (o) {
    query.value = "";
    scope.value = null;
    nextTick(() => nextTick(() => input.value?.focus()));
  }
});

function move(d: number) {
  const n = flat.value.length;
  if (!n) return;
  let i = active.value;
  for (let k = 0; k < n; k++) {
    i = (i + d + n) % n;
    if (!flat.value[i].disabled) break;
  }
  active.value = i;
  nextTick(() =>
    document.getElementById(activeId.value ?? "")?.scrollIntoView?.({ block: "nearest" }),
  );
}
const storeKey = computed(() => (props.persist ? `bless-command:${props.persist}` : null));
function remember(it: BlessCommandItem) {
  if (!props.recent) return;
  const next = [it.value, ...history.value.filter((v) => v !== it.value)].slice(0, 20);
  history.value = next;
  try {
    // from the local copy: a controlled v-model shows the new list only after the parent re-renders
    if (storeKey.value) localStorage.setItem(storeKey.value, JSON.stringify(next));
  } catch {
    /* blocked storage: the history lasts for this visit only */
  }
}
function choose(it = flat.value[active.value]) {
  if (!it || it.disabled) return;
  remember(it);
  emit("select", it);
  if (!props.inline) open.value = false;
}
function onKey(e: KeyboardEvent) {
  if (e.key === "ArrowDown") {
    e.preventDefault();
    move(1);
  } else if (e.key === "ArrowUp") {
    e.preventDefault();
    move(-1);
  } else if (e.key === "Enter") {
    e.preventDefault();
    choose();
  } else if (e.key === "Backspace" && !query.value && scope.value) {
    e.preventDefault();
    scope.value = null;
  } else if (e.key === "Home") {
    e.preventDefault();
    active.value = 0;
  } else if (e.key === "End") {
    e.preventDefault();
    active.value = flat.value.length - 1;
  }
}
function onHotkey(e: KeyboardEvent) {
  // leave ⌘K alone where it already means something: rich-text editors use it for links
  const t = e.target as HTMLElement | null;
  if (t?.closest?.('[contenteditable]:not([contenteditable="false"])')) return;
  if (props.hotkey && !props.inline && (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
    e.preventDefault();
    open.value = !open.value;
  }
}
onMounted(() => {
  addEventListener("keydown", onHotkey);
  // the stored history is read after mount, so a server-rendered page and its first client render agree
  try {
    const raw = storeKey.value && localStorage.getItem(storeKey.value);
    const saved = raw ? (JSON.parse(raw) as unknown) : null;
    if (Array.isArray(saved) && !history.value.length)
      history.value = saved.filter((v): v is string => typeof v === "string");
  } catch {
    /* damaged or blocked storage: start empty */
  }
});
onBeforeUnmount(() => removeEventListener("keydown", onHotkey));
</script>

<template>
  <component
    :is="inline ? 'div' : BlessModal"
    v-bind="
      inline
        ? {}
        : { modelValue: open, 'onUpdate:modelValue': (v: boolean) => (open = v), size: 'md' }
    "
    class="bless-command"
    :class="{ 'bless-command--inline': inline }"
  >
    <div class="bless-command__box">
      <div class="bless-command__search bless-lean--field">
        <span class="bless-command__icon" aria-hidden="true">⌕</span>
        <button
          v-if="scope"
          type="button"
          class="bless-command__scope"
          :title="text.clearScope"
          :aria-label="`${text.scope(scopeName(scope))}. ${text.clearScope}`"
          @click="clearScope"
        >
          {{ scopeName(scope) }} <span aria-hidden="true">×</span>
        </button>
        <input
          ref="input"
          v-model="query"
          type="text"
          class="bless-command__input"
          :placeholder
          role="combobox"
          :aria-label="scope ? `${label}: ${text.scope(scopeName(scope))}` : label"
          aria-autocomplete="list"
          :aria-expanded="true"
          :aria-controls="`${id}-list`"
          :aria-activedescendant="activeId"
          :aria-describedby="scopeHint ? `${id}-hint` : undefined"
          autocomplete="off"
          spellcheck="false"
          @keydown="onKey"
        />
        <BlessKbd v-if="!inline">Esc</BlessKbd>
      </div>
      <p v-if="scopeHint" :id="`${id}-hint`" class="bless-command__hint">{{ scopeHint }}</p>
      <div :id="`${id}-list`" class="bless-command__list" role="listbox" :aria-label="label">
        <div
          v-for="(s, si) in sections"
          :key="s.key"
          role="group"
          :aria-labelledby="s.label ? `${id}-g-${si}` : undefined"
          class="bless-command__section"
        >
          <div v-if="s.label" :id="`${id}-g-${si}`" class="bless-command__group" aria-hidden="true">
            {{ s.label }}
          </div>
          <div
            v-for="(it, k) in s.items"
            :key="it.value"
            :id="rowId(it, s.recent)"
            class="bless-command__item"
            :class="{ 'bless-command__item--active': active === offset(si) + k }"
            role="option"
            :aria-selected="active === offset(si) + k"
            :aria-disabled="it.disabled || undefined"
            @mousemove="active = offset(si) + k"
            @click="choose(it)"
          >
            <span class="bless-command__mark" aria-hidden="true">{{ it.icon ?? "" }}</span>
            <span class="bless-command__label"
              ><slot name="item" :item="it">{{ it.label }}</slot></span
            >
            <BlessKbd v-if="it.shortcut" class="bless-command__shortcut">{{
              it.shortcut
            }}</BlessKbd>
          </div>
        </div>
      </div>
      <p class="bless-command__empty" role="status">{{ flat.length ? "" : emptyText }}</p>
      <div v-if="$slots.footer" class="bless-command__footer"><slot name="footer" /></div>
    </div>
  </component>
</template>

<style>
.bless-command .bless-modal__body {
  padding: 0;
}
.bless-command .bless-modal__close {
  display: none;
}
.bless-command .bless-modal__panel {
  --_w: 560px;
}
.bless-command--inline {
  border: var(--bless-border-width) solid var(--bless-color-border);
  background: var(--bless-color-bg);
}
.bless-command__box {
  border-radius: var(--bless-radius);
  display: flex;
  flex-direction: column;
  font-family: var(--bless-font-sans);
  color: var(--bless-color-text);
}
.bless-command__search {
  border-radius: var(--bless-radius-plate);
  display: flex;
  align-items: center;
  gap: var(--bless-space-3);
  padding: var(--bless-space-3) var(--bless-space-4);
  border-bottom: var(--bless-border-width) solid var(--bless-color-border);
}
.bless-command__icon {
  font-size: var(--bless-text-lg);
  color: var(--bless-color-text-muted);
  transform: skewX(var(--bless-skew-counter)) rotate(-45deg);
}
.bless-command__input {
  flex: 1;
  min-width: 0;
  border: 0;
  background: transparent;
  font: inherit;
  font-size: var(--bless-text-md);
  color: inherit;
  outline: 0;
}
.bless-command__input::placeholder {
  color: var(--bless-color-text-muted);
}
.bless-command__list {
  max-height: 320px;
  overflow-y: auto;
  padding: var(--bless-space-2) 0;
  scrollbar-width: thin;
}
.bless-command__empty:empty {
  display: none;
}
.bless-command__empty {
  margin: 0;
  padding: var(--bless-space-6);
  text-align: center;
  font-size: var(--bless-text-sm);
  color: var(--bless-color-text-muted);
}
.bless-command__scope {
  flex: none;
  padding: 0 var(--bless-space-2);
  background: var(--bless-color-accent);
  border: 0;
  color: var(--bless-color-on-accent);
  font: inherit;
  font-size: var(--bless-text-xs);
  cursor: pointer;
}
.bless-command__scope:focus-visible {
  outline: 2px solid var(--bless-color-text);
  outline-offset: 2px;
}
.bless-command__hint {
  margin: 0;
  padding: var(--bless-space-1) var(--bless-space-3);
  color: var(--bless-color-text-muted);
  font-size: var(--bless-text-xs);
}
.bless-command__group {
  padding: var(--bless-space-2) var(--bless-space-4) var(--bless-space-1);
  font-size: var(--bless-text-2xs);
  font-weight: var(--bless-font-weight-bold);
  letter-spacing: var(--bless-tracking-wider);
  text-transform: uppercase;
  color: var(--bless-color-text-muted);
}
.bless-command__item {
  display: flex;
  align-items: center;
  gap: var(--bless-space-3);
  padding: var(--bless-space-2) var(--bless-space-4);
  font-size: var(--bless-text-sm);
  cursor: pointer;
}
/* attention, not a choice: ink on a surface */
.bless-command__item--active {
  background: var(--bless-color-surface);
}
.bless-command__item[aria-disabled="true"] {
  opacity: 0.4;
  cursor: not-allowed;
}
.bless-command__mark {
  width: 1.2em;
  flex: none;
  text-align: center;
}
.bless-command__label {
  flex: 1;
}
.bless-command__footer {
  display: flex;
  gap: var(--bless-space-4);
  padding: var(--bless-space-2) var(--bless-space-4);
  border-top: var(--bless-border-width) solid var(--bless-color-border);
  font-size: var(--bless-text-xs);
  color: var(--bless-color-text-muted);
}
/* parallelogram field; content counter-skews so text stays upright */
.bless-command__search {
  transform: skewX(var(--bless-skew));
}
.bless-command__search > :not(.bless-skew, .bless-chip, .bless-badge) {
  transform: skewX(var(--bless-skew-counter));
}
</style>
