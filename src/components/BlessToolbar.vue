<template>
  <div
    ref="root"
    class="bless-toolbar"
    :class="`bless-toolbar--${surface}`"
    role="toolbar"
    :aria-label="label"
  >
    <div class="bless-toolbar__start"><slot name="start" /></div>
    <div class="bless-toolbar__center"><slot name="center" /><slot /></div>
    <div class="bless-toolbar__end"><slot name="end" /></div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRovingFocus } from "../composables/useRovingFocus";
defineOptions({ name: "BlessToolbar" });
const root = ref<HTMLElement>();
useRovingFocus(root); // one tab stop; ← / → between the controls
withDefaults(defineProps<{ label?: string; surface?: "surface" | "bg" | "none" }>(), {
  label: "Toolbar",
  surface: "surface",
});
</script>

<style>
.bless-toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--bless-space-2) var(--bless-space-3);
  max-width: 100%;
  box-sizing: border-box;
  padding: var(--bless-space-2) var(--bless-space-3);
  font-family: var(--bless-font-sans);
  color: var(--bless-color-text);
}
.bless-toolbar--surface {
  border-radius: var(--bless-radius);
  background: var(--bless-color-surface);
}
.bless-toolbar--bg {
  border-radius: var(--bless-radius);
  background: var(--bless-color-bg);
  border: var(--bless-border-width) solid var(--bless-color-border);
}
.bless-toolbar__start,
.bless-toolbar__center,
.bless-toolbar__end {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--bless-space-2);
  min-width: 0;
  max-width: 100%;
}
.bless-toolbar__center {
  flex: 1 1 auto;
  justify-content: center;
}
</style>
