<script setup lang="ts">
defineOptions({ name: "BlessButtonGroup" });

withDefaults(defineProps<{ orientation?: "horizontal" | "vertical"; label?: string }>(), {
  orientation: "horizontal",
});
</script>

<template>
  <div
    class="bless-button-group"
    :class="`bless-button-group--${orientation}`"
    role="group"
    :aria-label="label"
  >
    <slot />
  </div>
</template>

<style>
/* joined buttons: no gap, shared border, parallelogram edges overlap by the skew */
.bless-button-group {
  display: inline-flex;
  align-items: stretch;
}
/* vertical: the group is the plate; the buttons inside are upright so the stack isn't a staircase */
.bless-button-group--vertical {
  --_gskew: var(--bless-skew); /* captured before the children zero theirs */
  flex-direction: column;
  align-items: stretch;
  transform: skewX(var(--_gskew));
}
.bless-button-group--vertical > .bless-button {
  --bless-skew: 0deg;
  --bless-skew-counter: 0deg;
}
.bless-button-group--vertical > .bless-button .bless-skew__inner {
  transform: skewX(calc(-1 * var(--_gskew)));
}
.bless-button-group > .bless-button {
  margin: 0;
  border-radius: 0; /* joined: only the group's outer corners round */
}
.bless-button-group--horizontal > .bless-button:first-child {
  border-start-start-radius: var(--bless-radius);
  border-end-start-radius: var(--bless-radius);
}
.bless-button-group--horizontal > .bless-button:last-child {
  border-start-end-radius: var(--bless-radius);
  border-end-end-radius: var(--bless-radius);
}
.bless-button-group--vertical > .bless-button:first-child {
  border-start-start-radius: var(--bless-radius);
  border-start-end-radius: var(--bless-radius);
}
.bless-button-group--vertical > .bless-button:last-child {
  border-end-start-radius: var(--bless-radius);
  border-end-end-radius: var(--bless-radius);
}
.bless-button-group--horizontal > .bless-button + .bless-button {
  margin-inline-start: calc(-1 * var(--bless-border-width));
}
.bless-button-group--vertical > .bless-button + .bless-button {
  margin-top: calc(-1 * var(--bless-border-width));
}
.bless-button-group > .bless-button:focus-visible {
  position: relative;
  z-index: 1;
}
/* solid neighbours get a hairline so they don't fuse */
.bless-button-group--horizontal > .bless-button--solid + .bless-button--solid {
  border-inline-start-color: var(--bless-color-bg);
}
.bless-button-group--vertical > .bless-button--solid + .bless-button--solid {
  border-top-color: var(--bless-color-bg);
}
</style>
