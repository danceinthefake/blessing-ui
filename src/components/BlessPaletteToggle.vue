<template>
  <div class="bless-palette" role="group" :aria-label="groupName()">
    <button
      v-for="p in shown"
      :key="p.name"
      type="button"
      class="bless-palette__swatch"
      :style="{ '--_c': p.color }"
      :aria-label="cap(p.name)"
      :title="cap(p.name)"
      :aria-pressed="palette === p.name"
      @click="setPalette(p.name as BlessPalette)"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useLabelPack } from "../composables/useLabels";
import { blessPalettes, useTheme, type BlessPalette } from "../composables/useTheme";

defineOptions({ name: "BlessPaletteToggle" });
const pack = useLabelPack("BlessPaletteToggle");

const props = withDefaults(
  defineProps<{
    /** the name of the group for screen readers; wins over `labels.palette` */
    label?: string;
    /** include the default palette's swatch (Megumi), which clears any other */
    showDefault?: boolean;
    labels?: Partial<{ palette: string }>;
  }>(),
  {
    showDefault: true,
  },
);
// the palette names stay as they are: they are names, not words
const groupName = () => props.label ?? props.labels?.palette ?? (pack().palette as string) ?? "Palette";
const { palette, setPalette } = useTheme();
const cap = (s: string) => s[0].toUpperCase() + s.slice(1);
const shown = computed(() => (props.showDefault ? blessPalettes : blessPalettes.slice(1)));
</script>

<style>
/* one swatch per palette in its member's colour: upright, leaning on attention */
.bless-palette {
  display: inline-flex;
  gap: var(--bless-space-1);
}
.bless-palette__swatch {
  border-radius: var(--bless-radius-plate);
  width: 20px;
  height: 20px;
  padding: 0;
  border: 2px solid transparent;
  background: var(--_c);
  cursor: pointer;
  transform: skewX(var(--bless-skew));
  transition:
    border-color var(--bless-duration-fast),
    opacity var(--bless-duration-slow) var(--bless-ease-in-out),
    var(--bless-lean-transition);
}
.bless-palette__swatch[aria-pressed="true"] {
  border-color: var(--bless-color-text);
}
.bless-palette__swatch:hover {
  transform: skewX(var(--bless-skew)) translateY(var(--bless-hover-lift));
  border-color: var(--bless-color-text);
}
.bless-palette__swatch:focus-visible {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: 2px;
}
</style>
