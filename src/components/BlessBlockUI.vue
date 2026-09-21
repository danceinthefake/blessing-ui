<script setup lang="ts">
import { nextTick, ref, watch } from "vue";
import BlessSpinner from "./BlessSpinner.vue";

defineOptions({ name: "BlessBlockUI" });
const props = withDefaults(
  defineProps<{ blocked?: boolean; fullscreen?: boolean; label?: string }>(),
  { label: "Busy" },
);

const overlay = ref<HTMLElement>();
let previous: HTMLElement | null = null;
// content goes inert; a focused control inside would silently lose focus to <body>, so park it on
// the overlay and hand it back when unblocked
watch(
  () => props.blocked,
  async (on) => {
    if (typeof document === "undefined") return;
    if (on) {
      previous = document.activeElement as HTMLElement | null;
      await nextTick();
      overlay.value?.focus();
    } else if (previous?.isConnected) {
      previous.focus();
      previous = null;
    }
  },
);
</script>

<template>
  <div class="bless-block" :class="{ 'bless-block--on': blocked, 'bless-block--full': fullscreen }">
    <div class="bless-block__content" :inert="blocked || undefined"><slot /></div>
    <div
      v-if="blocked"
      ref="overlay"
      class="bless-block__overlay"
      role="status"
      :aria-label="label"
      tabindex="-1"
    >
      <slot name="indicator"><BlessSpinner size="lg" /></slot>
    </div>
  </div>
</template>

<style>
.bless-block {
  position: relative;
}
.bless-block__overlay {
  position: absolute;
  inset: 0;
  z-index: var(--bless-z-nav);
  display: grid;
  place-items: center;
  background: color-mix(in srgb, var(--bless-color-bg) 60%, transparent);
  color: var(--bless-color-text);
  outline: 0;
}
.bless-block--full .bless-block__overlay {
  position: fixed;
  z-index: var(--bless-z-modal);
}
.bless-block--on .bless-block__content {
  pointer-events: none;
  user-select: none;
}
</style>
