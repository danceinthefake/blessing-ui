<script setup lang="ts">
import { ref, useId } from "vue";

defineOptions({ name: "BlessSpeedDial" });

export interface BlessSpeedDialAction {
  label: string;
  value: string;
  icon?: string;
  color?: "text" | "accent" | "danger";
}

withDefaults(
  defineProps<{
    actions: BlessSpeedDialAction[];
    direction?: "up" | "down" | "left" | "right";
    label?: string;
    color?: "text" | "accent";
    /** render in place instead of fixed bottom-right */
    inline?: boolean;
  }>(),
  { direction: "up", label: "Actions", color: "accent" },
);
const open = defineModel<boolean>("open", { default: false });
const emit = defineEmits<{ select: [action: BlessSpeedDialAction] }>();
const id = useId();
const root = ref<HTMLElement>();
function pick(a: BlessSpeedDialAction) {
  emit("select", a);
  open.value = false;
}
function onBlur(e: FocusEvent) {
  if (!root.value?.contains(e.relatedTarget as Node)) open.value = false;
}
</script>

<template>
  <div
    ref="root"
    class="bless-speed-dial"
    :class="[
      `bless-speed-dial--${direction}`,
      { 'bless-speed-dial--open': open, 'bless-speed-dial--inline': inline },
    ]"
    @keydown.esc="open = false"
    @focusout="onBlur"
  >
    <button
      type="button"
      class="bless-speed-dial__fab"
      :class="`bless-speed-dial__fab--${color}`"
      :aria-label="label"
      :aria-expanded="open"
      :aria-controls="id"
      @click="open = !open"
    >
      <span class="bless-speed-dial__plus" aria-hidden="true"><slot name="icon">+</slot></span>
    </button>
    <div
      :id
      class="bless-speed-dial__list"
      role="group"
      :aria-label="label"
      :inert="!open || undefined"
    >
      <button
        v-for="(a, i) in actions"
        :key="a.value"
        type="button"
        class="bless-speed-dial__action"
        :class="`bless-speed-dial__action--${a.color ?? 'text'}`"
        :style="{ '--_i': i + 1 }"
        :aria-label="a.label"
        :title="a.label"
        @click="pick(a)"
      >
        <span aria-hidden="true"
          ><slot name="action" :action="a">{{ a.icon ?? a.label[0] }}</slot></span
        >
        <span class="bless-speed-dial__tip">{{ a.label }}</span>
      </button>
    </div>
  </div>
</template>

<style>
.bless-speed-dial {
  position: fixed;
  right: var(--bless-space-6);
  bottom: var(--bless-space-6);
  z-index: var(--bless-z-nav);
  display: inline-flex;
  flex-direction: column-reverse;
  align-items: center;
  gap: var(--bless-space-2);
  font-family: var(--bless-font-sans);
}
.bless-speed-dial--inline {
  position: relative;
  right: auto;
  bottom: auto;
}
.bless-speed-dial--down {
  flex-direction: column;
}
.bless-speed-dial--left {
  flex-direction: row-reverse;
}
.bless-speed-dial--right {
  flex-direction: row;
}
.bless-speed-dial__fab {
  display: inline-grid;
  place-items: center;
  width: 48px;
  height: 48px;
  border: 0;
  color: var(--bless-color-on-accent);
  font: inherit;
  font-size: var(--bless-text-lg);
  cursor: pointer;
  box-shadow: var(--bless-shadow-md);
  transform: skewX(var(--bless-skew));
  transition: opacity var(--bless-duration-slow);
}
.bless-speed-dial__fab--accent {
  background: var(--bless-color-accent);
}
.bless-speed-dial__fab--text {
  background: var(--bless-color-text);
  color: var(--bless-color-on-text);
}
.bless-speed-dial__fab:hover {
  opacity: var(--bless-hover-opacity);
}
.bless-speed-dial__fab:focus-visible,
.bless-speed-dial__action:focus-visible {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: 2px;
}
.bless-speed-dial__plus {
  display: inline-block;
  transform: skewX(var(--bless-skew-counter));
  transition: transform var(--bless-duration-base);
}
.bless-speed-dial--open .bless-speed-dial__plus {
  transform: skewX(var(--bless-skew-counter)) rotate(45deg);
}
.bless-speed-dial__list {
  display: flex;
  flex-direction: inherit;
  align-items: center;
  gap: var(--bless-space-2);
}
.bless-speed-dial__action {
  position: relative;
  display: inline-grid;
  place-items: center;
  width: 36px;
  height: 36px;
  border: var(--bless-border-width) solid var(--bless-color-border);
  background: var(--bless-color-bg);
  color: var(--bless-color-text);
  font: inherit;
  cursor: pointer;
  opacity: 0;
  transform: skewX(var(--bless-skew)) scale(0.6);
  transition:
    opacity var(--bless-duration-base) var(--bless-ease-out),
    transform var(--bless-duration-base) var(--bless-ease-out);
  transition-delay: calc(var(--_i) * 30ms);
}
.bless-speed-dial__action > span:first-child {
  transform: skewX(var(--bless-skew-counter));
}
.bless-speed-dial--open .bless-speed-dial__action {
  opacity: 1;
  transform: skewX(var(--bless-skew)) scale(1);
}
.bless-speed-dial__action--accent {
  color: var(--bless-color-accent-text);
}
.bless-speed-dial__action--danger {
  color: var(--bless-color-danger);
}
.bless-speed-dial__tip {
  position: absolute;
  right: calc(100% + var(--bless-space-2));
  padding: 2px var(--bless-space-2);
  background: var(--bless-color-text);
  color: var(--bless-color-on-text);
  font-size: var(--bless-text-2xs);
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: opacity var(--bless-duration-fast);
}
.bless-speed-dial--left .bless-speed-dial__tip,
.bless-speed-dial--right .bless-speed-dial__tip {
  right: auto;
  bottom: calc(100% + var(--bless-space-1));
}
.bless-speed-dial__action:hover .bless-speed-dial__tip,
.bless-speed-dial__action:focus-visible .bless-speed-dial__tip {
  opacity: 1;
}
@media (prefers-reduced-motion: reduce) {
  .bless-speed-dial__action {
    transition-delay: 0s;
  }
}
</style>
