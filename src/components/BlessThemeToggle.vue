<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useTheme, type BlessTheme } from "../composables/useTheme";
import BlessToggle from "./BlessToggle.vue";
import BlessToggleGroup from "./BlessToggleGroup.vue";

defineOptions({ name: "BlessThemeToggle" });

withDefaults(
  defineProps<{
    /** three-way (light/system/dark) or a single light↔dark button */ mode?: "switch" | "group";
    /** the group's name */
    label?: string;
    /** accessible names: the switch reads `dark` with pressed / not pressed; the group reads all three */
    labels?: { light?: string; system?: string; dark?: string };
  }>(),
  { mode: "switch", label: "Theme", labels: () => ({}) },
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
    <BlessToggle value="light" size="sm" :label="labels.light ?? 'Light'">☀</BlessToggle>
    <BlessToggle value="system" size="sm" :label="labels.system ?? 'System'">◐</BlessToggle>
    <BlessToggle value="dark" size="sm" :label="labels.dark ?? 'Dark'">☾</BlessToggle>
  </BlessToggleGroup>
  <button
    v-else
    type="button"
    class="bless-theme-toggle"
    :aria-label="labels.dark ?? 'Dark theme'"
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
    color var(--bless-duration-slow),
    var(--bless-lean-transition);
}
.bless-theme-toggle > span {
  display: inline-block;
  transform: skewX(var(--bless-skew-counter));
}
/* hover is attention, not a choice: ink */
.bless-theme-toggle:hover {
  border-color: var(--bless-color-text);
  color: var(--bless-color-text);
}
.bless-theme-toggle:focus-visible {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: 2px;
}
</style>
