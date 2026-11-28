<template>
  <div
    class="bless-toaster"
    :class="`bless-toaster--${position}`"
    role="region"
    :aria-label="label"
    @pointerenter="pauseToasts"
    @pointerleave="resumeToasts"
    @focusin="pauseToasts"
    @focusout="resumeToasts"
  >
    <TransitionGroup
      name="bless-toast"
      tag="ol"
      class="bless-toaster__list"
      role="list"
      aria-live="polite"
      aria-relevant="additions"
    >
      <li
        v-for="t in toastState.items"
        :key="t.id"
        class="bless-toast"
        :class="`bless-toast--${t.color}`"
      >
        <!-- the alert role is inside the item: on the li it takes the item out of the list -->
        <div class="bless-toast__body" :role="t.color === 'danger' ? 'alert' : undefined">
          <strong v-if="t.title" class="bless-toast__title">{{ t.title }}</strong>
          <span v-if="t.description" class="bless-toast__desc">{{ t.description }}</span>
        </div>
        <button
          v-if="t.action"
          type="button"
          class="bless-toast__action"
          @click="
            t.action.onClick();
            dismiss(t.id);
          "
        >
          {{ t.action.label }}
        </button>
        <button
          type="button"
          class="bless-toast__close"
          :aria-label="text.close"
          @click="dismiss(t.id)"
        >
          <BlessIcon name="close" size="sm" />
        </button>
      </li>
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
import { useLabelPack } from "../composables/useLabels";
import { computed } from "vue";
import { pauseToasts, resumeToasts, toastState, useToast } from "../composables/useToast";
import BlessIcon from "./BlessIcon.vue";

defineOptions({ name: "BlessToaster" });

const props = withDefaults(
  defineProps<{
    position?:
      | "top-end"
      | "top-start"
      | "bottom-end"
      | "bottom-start"
      | "top-center"
      | "bottom-center";
    /** the region's name */
    label?: string;
    labels?: Partial<{ close: string }>;
  }>(),
  {
    position: "bottom-end",
    label: "Notifications",
  },
);
const pack = useLabelPack("BlessToaster");
const text = computed(() => ({
  close: "Dismiss",
  ...pack(),
  ...props.labels,
}));

const { dismiss } = useToast();
</script>

<style>
.bless-toaster {
  position: fixed;
  z-index: calc(var(--bless-z-modal) + 1);
  pointer-events: none;
  padding: var(--bless-space-4);
  max-width: 100%;
}
.bless-toaster--top-end {
  top: 0;
  inset-inline-end: 0;
}
.bless-toaster--top-start {
  top: 0;
  inset-inline-start: 0;
}
.bless-toaster--top-center {
  top: 0;
  left: 50%;
  transform: translateX(-50%);
}
.bless-toaster--bottom-end {
  bottom: 0;
  inset-inline-end: 0;
}
.bless-toaster--bottom-start {
  bottom: 0;
  inset-inline-start: 0;
}
.bless-toaster--bottom-center {
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
}
.bless-toaster__list {
  display: flex;
  flex-direction: column;
  gap: var(--bless-space-2);
  margin: 0;
  padding: 0;
  list-style: none;
  width: 340px;
  max-width: calc(100vw - 2 * var(--bless-space-4));
}
.bless-toaster--top-end .bless-toaster__list,
.bless-toaster--top-start .bless-toaster__list,
.bless-toaster--top-center .bless-toaster__list {
  flex-direction: column-reverse;
}
.bless-toast {
  border-radius: var(--bless-radius);
  --_c: var(--bless-color-text);
  --_on: var(--bless-color-on-text);
  position: relative;
  display: flex;
  align-items: center;
  gap: var(--bless-space-3);
  padding: var(--bless-space-3) var(--bless-space-4);
  border-left: 4px solid var(--_c);
  background: var(--bless-color-bg);
  color: var(--bless-color-text);
  box-shadow: var(--bless-shadow-plate);
  font-family: var(--bless-font-sans);
  font-size: var(--bless-text-sm);
  line-height: var(--bless-leading-tight);
  pointer-events: auto;
}
.bless-toast::before {
  content: "";
  position: absolute;
  left: -4px;
  top: 0;
  width: 4px;
  height: 100%;
  background: var(--_c);
  transform: skewX(var(--bless-skew));
}
.bless-toast--accent {
  --_c: var(--bless-color-accent);
  --_on: var(--bless-color-on-accent);
}
.bless-toast--danger {
  --_c: var(--bless-color-danger);
  --_on: var(--bless-color-on-accent);
}
.bless-toast--warning {
  --_c: var(--bless-color-warning);
  --_on: var(--bless-color-on-light);
}
.bless-toast--success {
  --_c: var(--bless-color-success);
  --_on: var(--bless-color-on-light);
}
.bless-toast--info {
  --_c: var(--bless-color-info);
  --_on: var(--bless-color-on-accent);
}
.bless-toast__body {
  flex: 1;
  min-width: 0;
  display: grid;
  gap: 2px;
}
.bless-toast__title {
  font-weight: var(--bless-font-weight-bold);
}
.bless-toast__desc {
  font-size: var(--bless-text-xs);
  color: var(--bless-color-text-muted);
}
.bless-toast__action {
  flex: none;
  padding: var(--bless-space-1) var(--bless-space-3);
  border: 0;
  background: var(--_c);
  color: var(--_on);
  font: inherit;
  font-size: var(--bless-text-xs);
  font-weight: var(--bless-font-weight-bold);
  letter-spacing: var(--bless-tracking-wide);
  text-transform: var(--bless-label-case);
  cursor: pointer;
  transform: skewX(var(--bless-skew));
  transition:
    opacity var(--bless-duration-slow) var(--bless-ease-in-out),
    var(--bless-lean-transition);
}
.bless-toast__action:hover {
  background: var(--bless-color-hover);
}
.bless-toast__close {
  flex: none;
  width: 24px;
  height: 24px;
  margin-inline-end: -8px;
  padding: 0;
  border: 0;
  background: transparent;
  color: inherit;
  font-size: var(--bless-text-lg);
  line-height: 1;
  cursor: pointer;
  transition:
    opacity var(--bless-duration-slow) var(--bless-ease-in-out),
    var(--bless-lean-transition);
}
.bless-toast__close:hover {
  background: var(--bless-color-hover);
  color: var(--bless-color-text);
}
.bless-toast__action:focus-visible,
.bless-toast__close:focus-visible {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: 2px;
}
.bless-toast-enter-active {
  animation: bless-voice var(--bless-duration-voice) var(--bless-ease-snap);
}
.bless-toast-leave-active {
  transition: all var(--bless-duration-slow) var(--bless-ease-out);
}
.bless-toast-leave-to {
  opacity: 0;
  transform: translateX(24px);
}
.bless-toast-move {
  transition: transform var(--bless-duration-slow) var(--bless-ease-in-out);
}
</style>
