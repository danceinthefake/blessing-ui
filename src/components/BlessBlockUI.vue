<script setup lang="ts">
import { nextTick, ref, watch } from "vue";
import BlessSpinner from "./BlessSpinner.vue";

defineOptions({ name: "BlessBlockUI" });
const props = withDefaults(
  defineProps<{ blocked?: boolean; fullscreen?: boolean; label?: string }>(),
  { label: "Busy" },
);

const overlay = ref<HTMLElement>();
const content = ref<HTMLElement>();
let previous: HTMLElement | null = null;
// content goes inert; a focused control inside would silently lose focus to <body>, so park it on
// the overlay and hand it back when unblocked. Focus anywhere else is left alone.
watch(
  () => props.blocked,
  async (on) => {
    if (typeof document === "undefined") return;
    if (on) {
      const active = document.activeElement as HTMLElement | null;
      if (!active || !content.value?.contains(active)) return;
      previous = active;
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
    <div ref="content" class="bless-block__content" :inert="blocked || undefined"><slot /></div>
    <!-- always present, so the change is announced; a region inserted with its text often isn't -->
    <span class="bless-block__sr" role="status">{{ blocked ? label : "" }}</span>
    <div
      v-if="blocked"
      ref="overlay"
      class="bless-block__overlay"
      :aria-label="label"
      tabindex="-1"
    >
      <slot name="indicator"><BlessSpinner size="lg" label="" /></slot>
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
.bless-block__sr {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip-path: inset(50%);
}
.bless-block--on .bless-block__content {
  pointer-events: none;
  user-select: none;
}
</style>
