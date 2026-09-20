<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, useId, watch } from "vue";
import BlessKbd from "./BlessKbd.vue";
import BlessModal from "./BlessModal.vue";

defineOptions({ name: "BlessCommand" });

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
    emptyText?: string;
    /** bind ⌘K / Ctrl+K to open */
    hotkey?: boolean;
    /** render inline instead of inside a modal */
    inline?: boolean;
    filter?: (item: BlessCommandItem, query: string) => boolean;
  }>(),
  { placeholder: "Type a command…", emptyText: "No results.", hotkey: true },
);

const open = defineModel<boolean>("open", { default: false });
const emit = defineEmits<{ select: [item: BlessCommandItem] }>();

const id = useId();
const query = ref("");
const active = ref(0);
const input = ref<HTMLInputElement>();

const defaultFilter = (it: BlessCommandItem, q: string) => {
  const hay = [it.label, ...(it.keywords ?? [])].join(" ").toLowerCase();
  return q.split(/\s+/).every((w) => hay.includes(w));
};
const results = computed(() => {
  const q = query.value.trim().toLowerCase();
  const f = props.filter ?? defaultFilter;
  return props.items.filter((it) => !q || f(it, q));
});
const groups = computed(() => {
  const m = new Map<string, BlessCommandItem[]>();
  for (const it of results.value) m.set(it.group ?? "", [...(m.get(it.group ?? "") ?? []), it]);
  return [...m.entries()];
});
const flat = computed(() => groups.value.flatMap(([, its]) => its));
const activeId = computed(() =>
  flat.value[active.value] ? `${id}-${flat.value[active.value].value}` : undefined,
);

watch(results, () => (active.value = 0));
watch(open, (o) => {
  if (o) {
    query.value = "";
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
function choose(it = flat.value[active.value]) {
  if (!it || it.disabled) return;
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
  } else if (e.key === "Home") {
    e.preventDefault();
    active.value = 0;
  } else if (e.key === "End") {
    e.preventDefault();
    active.value = flat.value.length - 1;
  }
}
function onHotkey(e: KeyboardEvent) {
  if (props.hotkey && !props.inline && (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
    e.preventDefault();
    open.value = !open.value;
  }
}
onMounted(() => addEventListener("keydown", onHotkey));
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
      <div class="bless-command__search">
        <span class="bless-command__icon" aria-hidden="true">⌕</span>
        <input
          ref="input"
          v-model="query"
          type="text"
          class="bless-command__input"
          :placeholder
          role="combobox"
          aria-autocomplete="list"
          :aria-expanded="true"
          :aria-controls="`${id}-list`"
          :aria-activedescendant="activeId"
          autocomplete="off"
          spellcheck="false"
          @keydown="onKey"
        />
        <BlessKbd v-if="!inline">Esc</BlessKbd>
      </div>
      <div :id="`${id}-list`" class="bless-command__list" role="listbox">
        <p v-if="!flat.length" class="bless-command__empty">{{ emptyText }}</p>
        <template v-for="[group, its] in groups" :key="group">
          <div v-if="group" class="bless-command__group" role="presentation">{{ group }}</div>
          <div
            v-for="it in its"
            :key="it.value"
            :id="`${id}-${it.value}`"
            class="bless-command__item"
            :class="{ 'bless-command__item--active': flat[active] === it }"
            role="option"
            :aria-selected="flat[active] === it"
            :aria-disabled="it.disabled || undefined"
            @mousemove="active = flat.indexOf(it)"
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
        </template>
      </div>
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
  display: flex;
  align-items: center;
  gap: var(--bless-space-3);
  padding: var(--bless-space-3) var(--bless-space-4);
  border-bottom: var(--bless-border-width) solid var(--bless-color-border);
}
.bless-command__icon {
  font-size: var(--bless-text-lg);
  color: var(--bless-color-text-muted);
  transform: rotate(-45deg);
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
.bless-command__empty {
  margin: 0;
  padding: var(--bless-space-6);
  text-align: center;
  font-size: var(--bless-text-sm);
  color: var(--bless-color-text-muted);
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
.bless-command__item--active {
  background: var(--bless-color-surface);
  color: var(--bless-color-accent-text);
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
</style>
