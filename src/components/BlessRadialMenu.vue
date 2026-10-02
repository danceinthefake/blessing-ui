<script lang="ts">
export interface BlessRadialItem {
  id: string | number;
  label: string;
  /** a character or emoji for the button; `#item` replaces it */
  icon?: string;
  disabled?: boolean;
}
</script>

<script setup lang="ts" generic="T extends BlessRadialItem = BlessRadialItem">
import { computed, nextTick, onBeforeUnmount, ref, useId, watch } from "vue";
import { keepInside, polar, sectorAt } from "../composables/radial";
import { logicalKey } from "../composables/rtl";

defineOptions({ name: "BlessRadialMenu", inheritAttrs: false });

const props = withDefaults(
  defineProps<{
    items: T[];
    /** distance from the centre to the buttons, in px */
    radius?: number;
    /** how long a touch has to stay down to open it, in ms */
    holdMs?: number;
    disabled?: boolean;
    label?: string;
  }>(),
  { radius: 84, holdMs: 450, label: "Actions" },
);
const open = defineModel<boolean>("open", { default: false });
const emit = defineEmits<{ select: [item: T] }>();

const id = useId();
const area = ref<HTMLElement>();
const panel = ref<HTMLElement>();
const centre = ref({ x: 0, y: 0 });
const active = ref<number | null>(null);
/** the opening touch is still down: sliding to a button and letting go picks it */
let held = false;
let timer: ReturnType<typeof setTimeout> | undefined;
let down: { x: number; y: number } | null = null;

const BTN = 44;
const half = computed(() => props.radius + BTN / 2);
const spots = computed(() => props.items.map((_, i) => polar(i, props.items.length, props.radius)));
const enabled = computed(() =>
  props.items.map((it, i) => (it.disabled ? -1 : i)).filter((i) => i >= 0),
);

function openAt(x: number, y: number, fromHold = false) {
  if (props.disabled || !props.items.length) return;
  centre.value = keepInside(x, y, half.value, window.innerWidth, window.innerHeight);
  active.value = null;
  held = fromHold;
  open.value = true;
}
function close(refocus = true) {
  held = false;
  if (!open.value) return;
  open.value = false;
  if (refocus)
    (area.value?.querySelector<HTMLElement>("[tabindex],button,a,input") ?? area.value)?.focus?.();
}
function pick(i: number) {
  const it = props.items[i];
  if (!it || it.disabled) return;
  emit("select", it);
  close();
}

// --- opening: right-click, a long touch, or the keyboard's menu key ---
function onContext(e: MouseEvent) {
  if (props.disabled) return;
  e.preventDefault();
  clearTimeout(timer);
  if (!open.value) openAt(e.clientX, e.clientY);
}
function onDown(e: PointerEvent) {
  if (props.disabled || e.pointerType === "mouse") return;
  down = { x: e.clientX, y: e.clientY };
  clearTimeout(timer);
  timer = setTimeout(() => {
    if (down) openAt(down.x, down.y, true);
  }, props.holdMs);
}
function onMoveArea(e: PointerEvent) {
  if (down && !open.value && Math.hypot(e.clientX - down.x, e.clientY - down.y) > 8) {
    clearTimeout(timer);
    down = null;
  }
}
function onUpArea() {
  clearTimeout(timer);
  down = null;
}
function onKeyArea(e: KeyboardEvent) {
  if (e.key === "ContextMenu" || (e.shiftKey && e.key === "F10")) {
    e.preventDefault();
    const r = (e.target as HTMLElement).getBoundingClientRect();
    openAt(r.left + r.width / 2, r.top + r.height / 2);
  }
}

// --- while open: aim by angle (touch hold), arrows, Enter, Escape ---
function aim(e: PointerEvent) {
  if (!open.value) return;
  const s = sectorAt(e.clientX - centre.value.x, e.clientY - centre.value.y, props.items.length);
  if (held) active.value = s !== null && !props.items[s]?.disabled ? s : null;
}
function release() {
  if (!open.value || !held) return;
  held = false;
  down = null;
  if (active.value !== null) pick(active.value);
}
function onKey(e: KeyboardEvent) {
  const k = logicalKey(e);
  const list = enabled.value;
  if (!list.length) return;
  const at = active.value === null ? -1 : list.indexOf(active.value);
  if (k === "ArrowRight" || k === "ArrowDown") {
    e.preventDefault();
    go(list[(at + 1) % list.length]!);
  } else if (k === "ArrowLeft" || k === "ArrowUp") {
    e.preventDefault();
    go(list[(at - 1 + list.length) % list.length]!);
  } else if (e.key === "Home") (e.preventDefault(), go(list[0]!));
  else if (e.key === "End") (e.preventDefault(), go(list.at(-1)!));
  else if (e.key === "Escape") (e.preventDefault(), e.stopPropagation(), close());
  else if (e.key === "Tab") close(false);
}
function go(i: number) {
  active.value = i;
  nextTick(() => panel.value?.querySelectorAll<HTMLElement>('[role="menuitem"]')[i]?.focus());
}

watch(open, async (o) => {
  await nextTick();
  const el = panel.value;
  if (!el || typeof el.showPopover !== "function") return;
  if (o) {
    if (!el.matches(":popover-open")) el.showPopover();
    window.addEventListener("pointermove", aim);
    window.addEventListener("pointerup", release);
    window.addEventListener("pointercancel", release);
    window.addEventListener("pointerdown", outside, true);
    if (!held) go(enabled.value[0] ?? 0);
  } else {
    if (el.matches(":popover-open")) el.hidePopover();
    window.removeEventListener("pointermove", aim);
    window.removeEventListener("pointerup", release);
    window.removeEventListener("pointercancel", release);
    window.removeEventListener("pointerdown", outside, true);
  }
});
function outside(e: PointerEvent) {
  if (!panel.value?.contains(e.target as Node) && !held) close(false);
}
onBeforeUnmount(() => {
  clearTimeout(timer);
  window.removeEventListener("pointermove", aim);
  window.removeEventListener("pointerup", release);
  window.removeEventListener("pointercancel", release);
  window.removeEventListener("pointerdown", outside, true);
});
</script>

<template>
  <div
    ref="area"
    class="bless-radial__area"
    v-bind="$attrs"
    @contextmenu="onContext"
    @pointerdown="onDown"
    @pointermove="onMoveArea"
    @pointerup="onUpArea"
    @pointercancel="onUpArea"
    @keydown="onKeyArea"
  >
    <slot />
  </div>
  <div
    :id
    ref="panel"
    popover="manual"
    class="bless-radial"
    role="menu"
    :aria-label="label"
    :style="{
      left: `${centre.x - half}px`,
      top: `${centre.y - half}px`,
      width: `${half * 2}px`,
      height: `${half * 2}px`,
    }"
    @keydown="onKey"
    @contextmenu.prevent
  >
    <span class="bless-radial__core" aria-hidden="true">{{
      active !== null ? items[active]?.label : ""
    }}</span>
    <button
      v-for="(it, i) in items"
      :key="it.id"
      type="button"
      role="menuitem"
      class="bless-radial__item"
      :class="{ 'bless-radial__item--on': active === i }"
      :style="{ left: `calc(50% + ${spots[i]!.x}px)`, top: `calc(50% + ${spots[i]!.y}px)` }"
      :aria-label="it.label"
      :aria-disabled="it.disabled || undefined"
      :tabindex="active === i ? 0 : -1"
      @click="pick(i)"
      @pointerenter="!it.disabled && !held && (active = i)"
    >
      <slot name="item" :item="it" :index="i">{{ it.icon ?? it.label.slice(0, 1) }}</slot>
    </button>
  </div>
</template>

<style>
.bless-radial__area {
  -webkit-touch-callout: none;
}
.bless-radial {
  position: fixed;
  inset: unset;
  margin: 0;
  padding: 0;
  border: 0;
  background: transparent;
  overflow: visible;
  font-family: var(--bless-font-sans);
  color: var(--bless-color-text);
  touch-action: none;
  user-select: none;
}
.bless-radial::backdrop {
  background: transparent;
}
.bless-radial__core {
  position: absolute;
  inset: 50% auto auto 50%;
  translate: -50% -50%;
  max-width: 64px;
  padding: var(--bless-space-1);
  text-align: center;
  font-size: var(--bless-text-xs);
  line-height: 1.2;
  pointer-events: none;
}
.bless-radial__item {
  position: absolute;
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  translate: -50% -50%;
  padding: 0;
  border: var(--bless-border-width) solid var(--bless-color-text);
  background: var(--bless-color-bg);
  color: inherit;
  font: inherit;
  font-size: var(--bless-text-md);
  box-shadow: var(--bless-shadow-plate);
  cursor: pointer;
}
.bless-radial__item--on {
  background: var(--bless-color-accent);
  border-color: var(--bless-color-accent);
  color: var(--bless-color-on-accent);
}
.bless-radial__item[aria-disabled="true"] {
  opacity: 0.4;
  cursor: not-allowed;
}
.bless-radial__item:focus-visible {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: 2px;
}
@media (prefers-reduced-motion: no-preference) {
  .bless-radial:popover-open .bless-radial__item {
    animation: bless-radial-in var(--bless-duration-base) var(--bless-ease-out);
  }
}
@keyframes bless-radial-in {
  from {
    opacity: 0;
    scale: 0.6;
  }
}
</style>
