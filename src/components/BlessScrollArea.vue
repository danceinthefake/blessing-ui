<script setup lang="ts">
defineOptions({ name: "BlessScrollArea" });

withDefaults(
  defineProps<{
    axis?: "y" | "x" | "both";
    /** fade edges to hint overflow */
    fade?: boolean;
    height?: string;
    width?: string;
  }>(),
  { axis: "y", fade: true },
);
</script>

<template>
  <div
    class="bless-scroll"
    :class="[`bless-scroll--${axis}`, { 'bless-scroll--fade': fade }]"
    :style="{ height, width }"
    tabindex="0"
  >
    <slot />
  </div>
</template>

<style>
.bless-scroll {
  overflow: hidden;
  scrollbar-width: thin;
  scrollbar-color: var(--bless-color-text-muted) transparent;
  outline: 0;
}
.bless-scroll--y {
  overflow-y: auto;
}
.bless-scroll--x {
  overflow-x: auto;
}
.bless-scroll--both {
  overflow: auto;
}
.bless-scroll::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
.bless-scroll::-webkit-scrollbar-thumb {
  background: var(--bless-color-text-muted);
}
.bless-scroll::-webkit-scrollbar-thumb:hover {
  background: var(--bless-color-text);
}
.bless-scroll:focus-visible {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: 2px;
}
.bless-scroll--fade.bless-scroll--y {
  mask-image: linear-gradient(
    to bottom,
    transparent,
    #000 var(--bless-space-4),
    #000 calc(100% - var(--bless-space-4)),
    transparent
  );
}
.bless-scroll--fade.bless-scroll--x {
  mask-image: linear-gradient(
    to right,
    transparent,
    #000 var(--bless-space-4),
    #000 calc(100% - var(--bless-space-4)),
    transparent
  );
}
</style>
