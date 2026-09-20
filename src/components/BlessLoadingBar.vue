<script setup lang="ts">
import { loadingBarState, useLoadingBar } from "../composables/useLoadingBar";

defineOptions({ name: "BlessLoadingBar" });
withDefaults(
  defineProps<{ height?: string; position?: "top" | "bottom"; color?: "accent" | "text" }>(),
  {
    height: "3px",
    position: "top",
    color: "accent",
  },
);
useLoadingBar(); // ensures the state exists
</script>

<template>
  <div
    class="bless-loadingbar"
    :class="[
      `bless-loadingbar--${position}`,
      `bless-loadingbar--${color}`,
      { 'bless-loadingbar--on': loadingBarState.active },
    ]"
    :style="{ '--_h': height, '--_p': `${loadingBarState.progress}%` }"
    role="progressbar"
    :aria-valuenow="loadingBarState.active ? Math.round(loadingBarState.progress) : undefined"
    aria-valuemin="0"
    aria-valuemax="100"
    aria-label="Loading"
  >
    <span class="bless-loadingbar__bar" />
  </div>
</template>

<style>
.bless-loadingbar {
  --_c: var(--bless-color-accent);
  position: fixed;
  left: 0;
  right: 0;
  z-index: calc(var(--bless-z-modal) + 10);
  height: var(--_h);
  pointer-events: none;
  opacity: 0;
  transition: opacity var(--bless-duration-slow) var(--bless-duration-base);
}
.bless-loadingbar--top {
  top: 0;
}
.bless-loadingbar--bottom {
  bottom: 0;
}
.bless-loadingbar--text {
  --_c: var(--bless-color-text);
}
.bless-loadingbar--on {
  opacity: 1;
  transition-delay: 0s;
}
.bless-loadingbar__bar {
  display: block;
  width: var(--_p);
  height: 100%;
  background: var(--_c);
  transition: width var(--bless-duration-base) var(--bless-ease-out);
}
</style>
