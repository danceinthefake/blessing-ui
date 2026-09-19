<script setup lang="ts">
import { nextTick, ref } from "vue";
import BlessKbd from "./BlessKbd.vue";
import type { BlessMenuItem } from "./menu";

defineOptions({ name: "BlessMenuList" });

const props = defineProps<{
  items: BlessMenuItem[];
  checked?: Record<string, boolean>;
  radios?: Record<string, string>;
}>();
const emit = defineEmits<{ select: [item: BlessMenuItem]; close: [] }>();

const root = ref<HTMLElement>();
const subOpen = ref<number | null>(null);
let typeahead = "";
let typeTimer: ReturnType<typeof setTimeout> | undefined;

const focusables = () =>
  Array.from(
    root.value?.querySelectorAll<HTMLElement>('[role^="menuitem"]:not([aria-disabled="true"])') ??
      [],
  );

function focusFirst() {
  nextTick(() => focusables()[0]?.focus());
}
function focusLast() {
  nextTick(() => focusables().at(-1)?.focus());
}

function onKey(e: KeyboardEvent) {
  // a nested BlessMenuList handles its own keys; don't double-step / close the whole tree
  if ((e.target as HTMLElement).closest('[role="menu"]') !== root.value) return;
  const list = focusables();
  const i = list.indexOf(document.activeElement as HTMLElement);
  const go = (n: number) => {
    e.preventDefault();
    list[(n + list.length) % list.length]?.focus();
  };
  switch (e.key) {
    case "ArrowDown":
      return go(i + 1);
    case "ArrowUp":
      return go(i - 1);
    case "Home":
      return go(0);
    case "End":
      return go(list.length - 1);
    case "Escape":
      e.preventDefault();
      return emit("close");
    case "ArrowRight": {
      const idx = Number((document.activeElement as HTMLElement)?.dataset.sub);
      if (!Number.isNaN(idx)) {
        e.preventDefault();
        subOpen.value = idx;
      }
      return;
    }
    case "ArrowLeft":
      if (subOpen.value !== null) {
        e.preventDefault();
        subOpen.value = null;
      }
      return;
    default:
      if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
        typeahead += e.key.toLowerCase();
        clearTimeout(typeTimer);
        typeTimer = setTimeout(() => (typeahead = ""), 500);
        const hit = list.find((el) => el.textContent?.trim().toLowerCase().startsWith(typeahead));
        hit?.focus();
      }
  }
}

function activate(item: BlessMenuItem) {
  if ("disabled" in item && item.disabled) return;
  if (item.type === "sub" || item.type === "separator" || item.type === "label") return;
  emit("select", item);
  if (item.type !== "checkbox" && item.type !== "radio") emit("close");
}

defineExpose({ focusFirst, focusLast });
</script>

<template>
  <div ref="root" class="bless-menu" role="menu" tabindex="-1" @keydown="onKey">
    <template v-for="(item, i) in items" :key="i">
      <div v-if="item.type === 'separator'" class="bless-menu__sep" role="separator" />
      <div v-else-if="item.type === 'label'" class="bless-menu__label">{{ item.label }}</div>
      <div
        v-else-if="item.type === 'sub'"
        class="bless-menu__item bless-menu__item--sub"
        role="menuitem"
        tabindex="-1"
        :data-sub="i"
        :aria-haspopup="'menu'"
        :aria-expanded="subOpen === i"
        :aria-disabled="item.disabled || undefined"
        @mouseenter="!item.disabled && (subOpen = i)"
        @click="!item.disabled && (subOpen = subOpen === i ? null : i)"
      >
        <span class="bless-menu__text">{{ item.label }}</span>
        <span class="bless-menu__chevron" aria-hidden="true">›</span>
        <BlessMenuList
          v-if="subOpen === i"
          :items="item.items"
          :checked
          :radios
          class="bless-menu--sub"
          @select="emit('select', $event)"
          @close="
            subOpen = null;
            (($event) => {})();
          "
          @vue:mounted="($el: any) => $el.component?.exposed?.focusFirst()"
        />
      </div>
      <component
        v-else
        :is="'href' in item && item.href ? 'a' : 'div'"
        :href="'href' in item ? item.href : undefined"
        class="bless-menu__item"
        :class="{ 'bless-menu__item--danger': 'danger' in item && item.danger }"
        :role="
          item.type === 'checkbox'
            ? 'menuitemcheckbox'
            : item.type === 'radio'
              ? 'menuitemradio'
              : 'menuitem'
        "
        tabindex="-1"
        :aria-checked="
          item.type === 'checkbox'
            ? !!checked?.[item.value]
            : item.type === 'radio'
              ? radios?.[item.group] === item.value
              : undefined
        "
        :aria-disabled="item.disabled || undefined"
        @click="activate(item)"
        @keydown.enter.space.prevent="activate(item)"
        @mouseenter="
          subOpen = null;
          ($event.currentTarget as HTMLElement).focus();
        "
      >
        <span class="bless-menu__mark" aria-hidden="true">
          <template v-if="item.type === 'checkbox'">{{
            checked?.[item.value] ? "✓" : ""
          }}</template>
          <template v-else-if="item.type === 'radio'">{{
            radios?.[item.group] === item.value ? "●" : ""
          }}</template>
          <template v-else-if="'icon' in item && item.icon">{{ item.icon }}</template>
        </span>
        <span class="bless-menu__text">{{ item.label }}</span>
        <BlessKbd v-if="'shortcut' in item && item.shortcut" class="bless-menu__shortcut">{{
          item.shortcut
        }}</BlessKbd>
      </component>
    </template>
  </div>
</template>

<style>
.bless-menu {
  min-width: 180px;
  padding: var(--bless-space-1) 0;
  border: var(--bless-border-width) solid var(--bless-color-border);
  background: var(--bless-color-bg);
  color: var(--bless-color-text);
  box-shadow: var(--bless-shadow-md);
  font-family: var(--bless-font-sans);
  font-size: var(--bless-text-sm);
  outline: 0;
}
.bless-menu--sub {
  position: absolute;
  left: 100%;
  top: calc(-1 * var(--bless-space-1) - 1px);
}
.bless-menu__item {
  position: relative;
  display: flex;
  align-items: center;
  gap: var(--bless-space-2);
  padding: var(--bless-space-2) var(--bless-space-3);
  color: inherit;
  text-decoration: none;
  cursor: pointer;
  outline: 0;
  user-select: none;
}
.bless-menu__item:focus,
.bless-menu__item[aria-expanded="true"] {
  background: var(--bless-color-surface);
  color: var(--bless-color-accent);
}
.bless-menu__item--danger {
  color: var(--bless-color-danger);
}
.bless-menu__item--danger:focus {
  color: var(--bless-color-danger);
}
.bless-menu__item[aria-disabled="true"] {
  opacity: 0.4;
  cursor: not-allowed;
}
.bless-menu__mark {
  width: 1.2em;
  flex: none;
  text-align: center;
  font-size: var(--bless-text-xs);
}
.bless-menu__text {
  flex: 1;
}
.bless-menu__shortcut {
  margin-left: var(--bless-space-4);
  opacity: 0.7;
}
.bless-menu__chevron {
  color: var(--bless-color-text-muted);
}
.bless-menu__sep {
  height: var(--bless-border-width);
  margin: var(--bless-space-1) 0;
  background: var(--bless-color-border);
}
.bless-menu__label {
  padding: var(--bless-space-2) var(--bless-space-3) var(--bless-space-1);
  font-size: var(--bless-text-2xs);
  font-weight: var(--bless-font-weight-bold);
  letter-spacing: var(--bless-tracking-wider);
  text-transform: uppercase;
  color: var(--bless-color-text-muted);
}
</style>
