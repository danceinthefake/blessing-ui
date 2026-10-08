<script lang="ts">
export interface BlessDockItem {
  id: string;
  label: string;
  /** a character, emoji or short text drawn big; use the `#item` slot for an image or icon */
  icon?: string;
  href?: string;
  badge?: string | number;
  disabled?: boolean;
}

/** Scale for an item whose centre is `distance` px from the pointer: `max` at 0, 1 beyond `radius`. */
export function magnify(distance: number, radius: number, max: number): number {
  const d = Math.abs(distance);
  return d >= radius ? 1 : 1 + (max - 1) * (0.5 + 0.5 * Math.cos((Math.PI * d) / radius));
}
</script>

<script setup lang="ts">
import { computed, ref } from "vue";
import { reducedMotion } from "../composables/useMedia";

defineOptions({ name: "BlessDock" });

const props = withDefaults(
  defineProps<{
    items: BlessDockItem[];
    /** the screen edge it sits on: sets the direction it lays out, grows and is navigated in */
    position?: "bottom" | "left" | "right";
    /** px, the resting size of an icon */
    size?: number;
    /** how much the icon under the pointer grows; 1 turns the effect off */
    magnification?: number;
    /** px of reach either side of the pointer */
    radius?: number;
    label?: string;
  }>(),
  { position: "bottom", size: 44, magnification: 1.6, radius: 110, label: "Dock" },
);
const emit = defineEmits<{ select: [item: BlessDockItem] }>();

const vertical = computed(() => props.position !== "bottom");
const root = ref<HTMLElement>();
const scales = ref<number[]>([]);
const active = ref(0);
const scaleOf = (i: number) => scales.value[i] ?? 1;
const live = () => props.magnification > 1 && !reducedMotion();

const centres = () =>
  Array.from(root.value?.querySelectorAll<HTMLElement>(".bless-dock__item") ?? [], (el) => {
    const r = el.getBoundingClientRect();
    return vertical.value ? r.top + r.height / 2 : r.left + r.width / 2;
  });
function grow(at: number) {
  scales.value = centres().map((c) => magnify(c - at, props.radius, props.magnification));
}
const calm = () => (scales.value = []);
function onMove(e: PointerEvent) {
  if (e.pointerType === "touch" || !live()) return;
  grow(vertical.value ? e.clientY : e.clientX);
}
function onFocusin(e: FocusEvent) {
  const el = e.target as HTMLElement;
  const i = Array.from(root.value?.querySelectorAll(".bless-dock__item") ?? []).indexOf(el);
  if (i < 0) return;
  active.value = i;
  if (live() && el.matches(":focus-visible")) {
    const r = el.getBoundingClientRect();
    grow(vertical.value ? r.top + r.height / 2 : r.left + r.width / 2);
  }
}
function onKey(e: KeyboardEvent) {
  // a native disabled button can't take focus, so it is skipped
  const els = Array.from(
    root.value?.querySelectorAll<HTMLElement>(".bless-dock__item:not(:disabled)") ?? [],
  );
  const i = els.indexOf(document.activeElement as HTMLElement);
  if (i < 0) return;
  const [prev, next] = vertical.value ? ["ArrowUp", "ArrowDown"] : ["ArrowLeft", "ArrowRight"];
  const dir = getComputedStyle(root.value!).direction === "rtl" && !vertical.value ? -1 : 1;
  const to =
    e.key === next
      ? i + dir
      : e.key === prev
        ? i - dir
        : e.key === "Home"
          ? 0
          : e.key === "End"
            ? els.length - 1
            : null;
  if (to === null) return;
  e.preventDefault();
  els[(to + els.length) % els.length]!.focus();
}
</script>

<template>
  <div
    ref="root"
    class="bless-dock"
    :class="`bless-dock--${position}`"
    role="toolbar"
    :aria-label="label"
    :aria-orientation="vertical ? 'vertical' : 'horizontal'"
    :style="{ '--_size': `${size}px` }"
    @pointermove="onMove"
    @pointerleave="calm"
    @focusin="onFocusin"
    @focusout="calm"
    @keydown="onKey"
  >
    <component
      :is="it.href ? 'a' : 'button'"
      v-for="(it, i) in items"
      :key="it.id"
      class="bless-dock__item"
      :href="it.href"
      :type="it.href ? undefined : 'button'"
      :disabled="it.href ? undefined : it.disabled"
      :aria-disabled="it.href && it.disabled ? true : undefined"
      :aria-label="it.label"
      :tabindex="active === i ? 0 : -1"
      :style="{ '--_s': scaleOf(i) }"
      @click="!it.disabled && emit('select', it)"
    >
      <span class="bless-dock__icon" aria-hidden="true">
        <slot name="item" :item="it">{{ it.icon }}</slot>
      </span>
      <span v-if="it.badge != null" class="bless-dock__badge" aria-hidden="true">{{
        it.badge
      }}</span>
      <span class="bless-dock__tip" aria-hidden="true">{{ it.label }}</span>
    </component>
  </div>
</template>

<style>
.bless-dock {
  display: inline-flex;
  align-items: flex-end;
  gap: var(--bless-space-2);
  padding: var(--bless-space-2);
  background: var(--bless-color-surface);
  border: var(--bless-border-width) solid var(--bless-color-border);
  font-family: var(--bless-font-sans);
  font-size: var(--bless-text-sm);
  color: var(--bless-color-text);
}
.bless-dock--left,
.bless-dock--right {
  flex-direction: column;
}
.bless-dock--left {
  align-items: flex-start;
}
.bless-dock--right {
  align-items: flex-end;
}
.bless-dock__item {
  position: relative;
  display: grid;
  place-items: center;
  width: var(--_size);
  height: var(--_size);
  padding: 0;
  border: 0;
  background: none;
  color: inherit;
  font: inherit;
  text-decoration: none;
  cursor: pointer;
}
.bless-dock__item:disabled,
.bless-dock__item[aria-disabled="true"] {
  opacity: 0.45;
  cursor: not-allowed;
}
.bless-dock__item:focus-visible {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: 2px;
}
.bless-dock__icon {
  display: grid;
  place-items: center;
  width: 100%;
  height: 100%;
  background: var(--bless-color-bg);
  border: var(--bless-border-width) solid var(--bless-color-border);
  font-size: calc(var(--_size) * 0.5);
  transform: scale(var(--_s, 1));
  transform-origin: 50% 100%;
  transition: transform var(--bless-duration-fast) var(--bless-ease-out);
}
.bless-dock--left .bless-dock__icon {
  transform-origin: 0 50%;
}
.bless-dock--right .bless-dock__icon {
  transform-origin: 100% 50%;
}
.bless-dock__item:hover .bless-dock__icon {
  border-color: var(--bless-color-accent);
}
.bless-dock__badge {
  position: absolute;
  top: -4px;
  inset-inline-end: -4px;
  min-width: 16px;
  padding: 0 4px;
  background: var(--bless-color-badge);
  color: var(--bless-color-on-accent);
  font-size: var(--bless-text-2xs);
  line-height: 16px;
  text-align: center;
}
.bless-dock__tip {
  position: absolute;
  inset-inline-start: 50%;
  bottom: calc(100% + 6px + (var(--_s, 1) - 1) * var(--_size));
  translate: -50% 0;
  padding: 2px var(--bless-space-2);
  background: var(--bless-color-text);
  color: var(--bless-color-bg);
  font-size: var(--bless-text-xs);
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
}
.bless-dock--left .bless-dock__tip,
.bless-dock--right .bless-dock__tip {
  bottom: auto;
  top: 50%;
  translate: 0 -50%;
}
.bless-dock--left .bless-dock__tip {
  inset-inline-start: calc(100% + 6px + (var(--_s, 1) - 1) * var(--_size));
}
.bless-dock--right .bless-dock__tip {
  inset-inline-start: auto;
  inset-inline-end: calc(100% + 6px + (var(--_s, 1) - 1) * var(--_size));
}
.bless-dock__item:hover .bless-dock__tip,
.bless-dock__item:focus-visible .bless-dock__tip {
  opacity: 1;
}
@media (prefers-reduced-motion: reduce) {
  .bless-dock__icon {
    transition: none;
  }
}
</style>
