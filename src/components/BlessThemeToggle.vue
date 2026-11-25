<template>
  <BlessToggleGroup
    v-if="mode === 'group'"
    :model-value="theme"
    :label="label ?? text().theme"
    @update:model-value="set(($event ?? 'system') as BlessTheme)"
  >
    <BlessToggle value="light" size="sm" :label="text().light"><BlessIcon name="sun" size="sm" /></BlessToggle>
    <BlessToggle value="system" size="sm" :label="text().system"><BlessIcon name="system" size="sm" /></BlessToggle>
    <BlessToggle value="golden" size="sm" :label="text().golden"><BlessIcon name="sunset" size="sm" /></BlessToggle>
    <BlessToggle value="dark" size="sm" :label="text().dark"><BlessIcon name="moon" size="sm" /></BlessToggle>
  </BlessToggleGroup>
  <button
    v-else
    type="button"
    class="bless-theme-toggle"
    :aria-label="props.labels?.dark ?? text().darkTheme"
    :aria-pressed="mounted ? isDark : false"
    @click="toggle"
  >
    <BlessIcon :name="mounted && isDark ? 'moon' : 'sun'" size="sm" />
  </button>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useLabelPack } from "../composables/useLabels";
import { useTheme, type BlessTheme } from "../composables/useTheme";
import BlessIcon from "./BlessIcon.vue";
import BlessToggle from "./BlessToggle.vue";
import BlessToggleGroup from "./BlessToggleGroup.vue";

defineOptions({ name: "BlessThemeToggle" });
const pack = useLabelPack("BlessThemeToggle");

const props = withDefaults(
  defineProps<{
    /** a group of the moods (light/system/golden/dark) or a single light↔dark button */ mode?: "switch" | "group";
    /** the group's name; wins over `labels.theme` */
    label?: string;
    /** accessible names: the group reads `theme` and all three; the switch reads `darkTheme`
     * (or `dark`, if you set it) with pressed / not pressed */
    labels?: Partial<{
      theme: string;
      light: string;
      system: string;
      dark: string;
      golden: string;
      darkTheme: string;
    }>;
  }>(),
  { mode: "switch" },
);
const text = () => ({
  theme: "Theme",
  light: "Light",
  system: "System",
  dark: "Dark",
  golden: "Golden hour",
  darkTheme: "Dark theme",
  ...(pack() as Record<string, string>),
  ...props.labels,
});
const { theme, isDark, set, toggle } = useTheme();
// isDark depends on matchMedia, which the server can't know: render state only after mount so
// server HTML and the first client render agree
const mounted = ref(false);
onMounted(() => (mounted.value = true));
</script>

<style>
.bless-theme-toggle {
  display: inline-grid;
  place-items: center;
  border-radius: var(--bless-radius-pill);
  width: 36px;
  height: 36px;
  padding: 0;
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
