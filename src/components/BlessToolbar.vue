<script setup lang="ts">
defineOptions({ name: "BlessToolbar" });
withDefaults(defineProps<{ label?: string; surface?: "surface" | "bg" | "none" }>(), {
  label: "Toolbar",
  surface: "surface",
});
</script>

<template>
  <div
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

<style>
.bless-toolbar {
  display: flex;
  align-items: center;
  gap: var(--bless-space-3);
  padding: var(--bless-space-2) var(--bless-space-3);
  font-family: var(--bless-font-sans);
  color: var(--bless-color-text);
}
.bless-toolbar--surface {
  border-radius: var(--bless-radius);
  background: var(--bless-color-surface);
}
.bless-toolbar--bg {
  background: var(--bless-color-bg);
  border: var(--bless-border-width) solid var(--bless-color-border);
}
.bless-toolbar__start,
.bless-toolbar__center,
.bless-toolbar__end {
  display: flex;
  align-items: center;
  gap: var(--bless-space-2);
}
.bless-toolbar__center {
  flex: 1;
  justify-content: center;
}
</style>
