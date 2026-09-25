<script setup lang="ts">
import { useLink } from "../composables/useLink";
import { nextTick, ref, useId } from "vue";
import { logicalKey } from "../composables/rtl";
import { useFloating } from "../composables/useFloating";

defineOptions({ name: "BlessNavigationMenu" });
const link = useLink();

export interface BlessNavMenuItem {
  label: string;
  href?: string;
  /** items → renders a panel */
  items?: { label: string; href: string; description?: string }[];
  active?: boolean;
}

withDefaults(defineProps<{ items: BlessNavMenuItem[]; label?: string }>(), { label: "Main" });
const emit = defineEmits<{ select: [item: { label: string; href: string }, e: MouseEvent] }>();

const id = useId();
const openIdx = ref<number | null>(null);
const anchors = ref<HTMLElement[]>([]);
const panel = ref<HTMLElement>();
const anchor = ref<HTMLElement>();
const isOpen = ref(false);
const { x, y } = useFloating(anchor, panel, isOpen, { placement: "bottom-start", offset: 6 });
let closeTimer: ReturnType<typeof setTimeout> | undefined;

function setAnchor(i: number, el: unknown) {
  if (el) anchors.value[i] = ((el as { $el?: HTMLElement }).$el ?? el) as HTMLElement;
}
function open(i: number) {
  clearTimeout(closeTimer);
  anchor.value = anchors.value[i];
  openIdx.value = i;
  isOpen.value = true;
  nextTick(() => panel.value?.matches(":popover-open") || panel.value?.showPopover?.());
}
function hold() {
  clearTimeout(closeTimer);
}
function close(delay = 150) {
  clearTimeout(closeTimer);
  closeTimer = setTimeout(() => {
    openIdx.value = null;
    isOpen.value = false;
    panel.value?.matches(":popover-open") && panel.value?.hidePopover?.();
  }, delay);
}
// Esc from inside the panel: close and give focus back to the trigger that opened it
function escape(e?: KeyboardEvent) {
  const i = openIdx.value;
  if (i !== null) e?.preventDefault();
  close(0);
  if (i !== null) anchors.value[i]?.focus();
}
// the panel is a manual popover: close it when focus leaves both it and the triggers
function onFocusOut(e: FocusEvent) {
  const to = e.relatedTarget as Node | null;
  if (to && (panel.value?.contains(to) || anchors.value.some((a) => a?.contains(to)))) return;
  close(0);
}
function onKey(e: KeyboardEvent, i: number, item: BlessNavMenuItem) {
  if ((e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") && item.items) {
    e.preventDefault();
    open(i);
    nextTick(() => panel.value?.querySelector<HTMLElement>("a")?.focus());
  } else if (e.key === "Escape" && openIdx.value !== null) (e.preventDefault(), close(0));
  else if (logicalKey(e) === "ArrowRight") anchors.value[(i + 1) % anchors.value.length]?.focus();
  else if (logicalKey(e) === "ArrowLeft")
    anchors.value[(i - 1 + anchors.value.length) % anchors.value.length]?.focus();
}
</script>

<template>
  <nav class="bless-navmenu" :aria-label="label">
    <ul role="list" class="bless-navmenu__list">
      <li
        v-for="(item, i) in items"
        :key="item.label"
        class="bless-navmenu__item"
        @pointerenter="$event.pointerType === 'mouse' && (item.items ? open(i) : close(0))"
        @pointerleave="$event.pointerType === 'mouse' && close()"
      >
        <component
          :is="link(item.items ? undefined : item.href, undefined, 'button').is"
          v-bind="link(item.items ? undefined : item.href, undefined, 'button').attrs"
          :ref="(el: unknown) => setAnchor(i, el)"
          :type="item.items ? 'button' : undefined"
          class="bless-navmenu__trigger"
          :class="{
            'bless-navmenu__trigger--active': item.active,
            'bless-navmenu__trigger--open': openIdx === i,
          }"
          :aria-expanded="item.items ? openIdx === i : undefined"
          :aria-controls="item.items ? `${id}-panel` : undefined"
          :aria-current="item.active ? 'page' : undefined"
          @click="item.items ? (openIdx === i ? close(0) : open(i)) : undefined"
          @keydown="onKey($event, i, item)"
          @focusout="isOpen && onFocusOut($event)"
        >
          {{ item.label }}
          <span v-if="item.items" class="bless-navmenu__chevron" aria-hidden="true" />
        </component>
      </li>
    </ul>
    <div
      ref="panel"
      :id="`${id}-panel`"
      popover="manual"
      class="bless-navmenu__panel"
      :style="{ left: `${x}px`, top: `${y}px` }"
      @pointerenter="hold"
      @pointerleave="$event.pointerType === 'mouse' && close()"
      @keydown.esc="escape"
      @focusout="onFocusOut"
    >
      <template v-if="openIdx !== null && items[openIdx]?.items">
        <slot name="panel" :item="items[openIdx]">
          <ul role="list" class="bless-navmenu__grid">
            <li v-for="sub in items[openIdx].items" :key="sub.href">
              <component
                :is="link(sub.href).is"
                v-bind="link(sub.href).attrs"
                class="bless-navmenu__link"
                @click="
                  emit('select', sub, $event);
                  close(0);
                "
              >
                <span class="bless-navmenu__link-label">{{ sub.label }}</span>
                <span v-if="sub.description" class="bless-navmenu__link-desc">{{
                  sub.description
                }}</span>
              </component>
            </li>
          </ul>
        </slot>
      </template>
    </div>
  </nav>
</template>

<style>
.bless-navmenu {
  font-family: var(--bless-font-sans);
}
.bless-navmenu__list {
  display: flex;
  gap: var(--bless-space-1);
  margin: 0;
  padding: 0;
  list-style: none;
}
.bless-navmenu__trigger {
  display: inline-flex;
  align-items: center;
  gap: var(--bless-space-1);
  padding: var(--bless-space-2) var(--bless-space-3);
  border: 0;
  background: transparent;
  color: var(--bless-color-text);
  font: inherit;
  font-size: var(--bless-text-sm);
  font-weight: var(--bless-font-weight-bold);
  letter-spacing: var(--bless-tracking-wide);
  text-transform: uppercase;
  text-decoration: none;
  cursor: pointer;
  transition: color var(--bless-duration-slow) var(--bless-ease-in-out);
}
.bless-navmenu__trigger:hover,
.bless-navmenu__trigger--open {
  color: var(--bless-color-accent-text);
}
.bless-navmenu__trigger--active {
  box-shadow: inset 0 -2px 0 var(--bless-color-accent);
}
.bless-navmenu__trigger:focus-visible {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: 2px;
}
.bless-navmenu__chevron {
  width: 6px;
  height: 6px;
  border-inline-end: 2px solid currentColor;
  border-bottom: 2px solid currentColor;
  transform: translateY(-2px) rotate(45deg);
  transition: transform var(--bless-duration-base);
}
.bless-navmenu__trigger--open .bless-navmenu__chevron {
  transform: translateY(1px) rotate(-135deg);
}
.bless-navmenu__panel {
  border-radius: var(--bless-radius);
  position: fixed;
  inset: unset;
  margin: 0;
  padding: var(--bless-space-3);
  border: var(--bless-border-width) solid var(--bless-color-border);
  background: var(--bless-color-bg);
  box-shadow: var(--bless-shadow-plate);
  min-width: 280px;
}
.bless-navmenu__panel:popover-open {
  animation: bless-pop-in var(--bless-duration-base) var(--bless-ease-out);
}
.bless-navmenu__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: var(--bless-space-1);
  margin: 0;
  padding: 0;
  list-style: none;
  max-width: 640px;
}
.bless-navmenu__link {
  display: grid;
  gap: 2px;
  padding: var(--bless-space-2) var(--bless-space-3);
  color: var(--bless-color-text);
  text-decoration: none;
  transition: background var(--bless-duration-fast);
}
.bless-navmenu__link:hover,
.bless-navmenu__link:focus-visible {
  background: var(--bless-color-surface);
  outline: 0;
}
.bless-navmenu__link:hover .bless-navmenu__link-label,
.bless-navmenu__link:focus-visible .bless-navmenu__link-label {
  color: var(--bless-color-accent-text);
}
.bless-navmenu__link-label {
  font-size: var(--bless-text-sm);
  font-weight: var(--bless-font-weight-bold);
}
.bless-navmenu__link-desc {
  font-size: var(--bless-text-xs);
  color: var(--bless-color-text-muted);
  line-height: var(--bless-leading-tight);
}
</style>
