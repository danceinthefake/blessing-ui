<script setup lang="ts">
import { blessPalettes, useTheme, type BlessPalette } from "../composables/useTheme";

defineOptions({ name: "BlessPaletteToggle" });

withDefaults(
  defineProps<{
    label?: string;
    /** include a "default" swatch to clear the palette */ showDefault?: boolean;
  }>(),
  {
    label: "Palette",
    showDefault: true,
  },
);
const { palette, setPalette } = useTheme();
const cap = (s: string) => s[0].toUpperCase() + s.slice(1);
</script>

<template>
  <div class="bless-palette" role="group" :aria-label="label">
    <button
      v-for="p in blessPalettes"
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

<style>
/* five petals: each swatch is the system parallelogram in its member's colour */
.bless-palette {
  display: inline-flex;
  gap: var(--bless-space-1);
}
.bless-palette__swatch {
  width: 20px;
  height: 20px;
  padding: 0;
  border: 2px solid transparent;
  background: var(--_c);
  cursor: pointer;
  transform: skewX(var(--bless-skew));
  transition: border-color var(--bless-duration-fast);
}
.bless-palette__swatch[aria-pressed="true"] {
  border-color: var(--bless-color-text);
}
.bless-palette__swatch:hover {
  opacity: var(--bless-hover-opacity);
}
.bless-palette__swatch:focus-visible {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: 2px;
}
</style>
