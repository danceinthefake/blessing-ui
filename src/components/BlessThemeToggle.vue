<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useTheme, type BlessTheme } from "../composables/useTheme";
import BlessToggle from "./BlessToggle.vue";
import BlessToggleGroup from "./BlessToggleGroup.vue";

defineOptions({ name: "BlessThemeToggle" });

withDefaults(
  defineProps<{
    /** three-way (light/system/dark) or a single light↔dark button */ mode?: "switch" | "group";
    label?: string;
  }>(),
  { mode: "switch", label: "Theme" },
);
const { theme, isDark, set, toggle } = useTheme();
// isDark depends on matchMedia, which the server can't know: render state only after mount so
// server HTML and the first client render agree
const mounted = ref(false);
onMounted(() => (mounted.value = true));
</script>

<template>
  <BlessToggleGroup
    v-if="mode === 'group'"
    :model-value="theme"
    :label
    @update:model-value="set(($event ?? 'system') as BlessTheme)"
  >
    <BlessToggle value="light" size="sm" label="Light">☀</BlessToggle>
    <BlessToggle value="system" size="sm" label="System">◐</BlessToggle>
    <BlessToggle value="dark" size="sm" label="Dark">☾</BlessToggle>
  </BlessToggleGroup>
  <button
    v-else
    type="button"
    class="bless-theme-toggle"
    aria-label="Dark theme"
    :aria-pressed="mounted ? isDark : false"
    @click="toggle"
  >
    <span aria-hidden="true">{{ mounted && isDark ? "☾" : "☀" }}</span>
  </button>
</template>

<style>
.bless-theme-toggle {
  border-radius: var(--bless-radius-plate);
  width: 36px;
  height: 36px;
  border: var(--bless-border-width) solid var(--bless-color-border);
  background: var(--bless-color-bg);
  color: var(--bless-color-text);
  font-size: var(--bless-text-md);
  cursor: pointer;
  transform: skewX(var(--bless-skew));
  transition:
    border-color var(--bless-duration-slow),
    color var(--bless-duration-slow);
}
.bless-theme-toggle > span {
  display: inline-block;
  transform: skewX(var(--bless-skew-counter));
}
.bless-theme-toggle:hover {
  border-color: var(--bless-color-accent-text);
  color: var(--bless-color-accent-text);
}
.bless-theme-toggle:focus-visible {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: 2px;
}
</style>
