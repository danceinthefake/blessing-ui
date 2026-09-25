<script setup lang="ts">
import { computed } from "vue";

defineOptions({ name: "BlessBackground" });

const props = withDefaults(
  defineProps<{
    /** tile image; omit for a built-in hairline pattern */
    src?: string;
    /** vertical tile offset (number = px). Source site used 0 / -300 / -600 per page */
    offset?: number | string;
    /** fixed = viewport (use at page level); absolute = fills positioned parent */
    mode?: "fixed" | "absolute";
    opacity?: number;
  }>(),
  { offset: 0, mode: "absolute", opacity: 1 },
);

const style = computed(() => ({
  backgroundImage: props.src ? `url(${JSON.stringify(props.src)})` : undefined, // quotes escaped
  backgroundPosition: `center ${typeof props.offset === "number" ? `${props.offset}px` : props.offset}`,
  opacity: props.opacity,
}));
</script>

<template>
  <div
    class="bless-background"
    :class="[`bless-background--${mode}`, { 'bless-background--pattern': !src }]"
    :style
    aria-hidden="true"
  />
</template>

<style>
.bless-background {
  inset: 0;
  z-index: var(--bless-z-bg);
  background-repeat: repeat;
  pointer-events: none;
}
.bless-background--fixed {
  position: fixed;
}
.bless-background--absolute {
  position: absolute;
}
.bless-background--pattern {
  background-image: repeating-linear-gradient(
    -45deg,
    transparent 0 11px,
    var(--bless-color-surface) 11px 12px
  );
}
</style>
