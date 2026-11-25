<template>
  <span
    class="bless-icon"
    :style="{ '--_s': tokens.includes(size) ? `var(--bless-text-${size})` : size }"
    :role="label ? 'img' : undefined"
    :aria-label="label"
    :aria-hidden="label ? undefined : 'true'"
  >
    <svg
      v-if="shape"
      viewBox="0 0 24 24"
      :fill="shape.fill ? 'currentColor' : 'none'"
      :stroke="shape.fill ? 'none' : 'currentColor'"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path v-for="d in shape.paths" :key="d" :d="d" />
    </svg>
    <slot v-else />
  </span>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { blessIcons, type BlessIconName, type BlessIconShape } from "./icons";

defineOptions({ name: "BlessIcon" });

const props = withDefaults(
  defineProps<{
    /** a built-in icon; without it, the slot holds your own SVG */
    name?: BlessIconName;
    /** token key (2xs…xl) or any CSS length */
    size?: "2xs" | "xs" | "sm" | "md" | "lg" | "xl" | (string & {});
    /** accessible name; omit for decorative */
    label?: string;
  }>(),
  { size: "md" },
);

const tokens = ["2xs", "xs", "sm", "md", "lg", "xl"];
const shape = computed<BlessIconShape | undefined>(() =>
  props.name ? blessIcons[props.name] : undefined,
);
</script>

<style>
.bless-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: var(--_s);
  height: var(--_s);
  flex: none;
  vertical-align: middle;
  color: inherit;
}
.bless-icon > svg {
  width: 100%;
  height: 100%;
}
/* a bare path SVG fills with the text colour; stroke icons (fill="none") keep their own */
.bless-icon > svg:not([fill]) {
  fill: currentColor;
}
</style>
