<script setup lang="ts">
import { computed } from "vue";

defineOptions({ name: "BlessIndicator" });

const props = withDefaults(
  defineProps<{
    /** number → count badge, true → dot, falsy → hidden */
    value?: number | boolean;
    max?: number;
    color?: "accent" | "danger" | "success" | "warning" | "info" | "text";
    position?: "top-right" | "top-left" | "bottom-right" | "bottom-left";
    /** wrapped element is inline (icon) vs block */
    inline?: boolean;
    label?: string;
  }>(),
  { max: 99, color: "accent", position: "top-right", inline: true },
);
const text = computed(() =>
  typeof props.value === "number"
    ? props.value > props.max
      ? `${props.max}+`
      : String(props.value)
    : "",
);
const show = computed(
  () => props.value === true || (typeof props.value === "number" && props.value > 0),
);
</script>

<template>
  <span class="bless-indicator" :class="{ 'bless-indicator--block': !inline }">
    <slot />
    <span
      v-if="show"
      class="bless-indicator__badge"
      :class="[
        `bless-indicator__badge--${color}`,
        `bless-indicator__badge--${position}`,
        { 'bless-indicator__badge--dot': !text },
      ]"
      :aria-label="label"
      :role="label ? 'status' : undefined"
      :aria-hidden="label ? undefined : 'true'"
      ><span class="bless-indicator__text">{{ text }}</span></span
    >
  </span>
</template>

<style>
.bless-indicator {
  position: relative;
  display: inline-flex;
}
.bless-indicator--block {
  display: block;
}
.bless-indicator__badge {
  border-radius: var(--bless-radius-petal);
  position: absolute;
  display: inline-grid;
  place-items: center;
  min-width: 18px;
  height: 18px;
  padding: 0 5px;
  background: var(--bless-color-accent);
  color: var(--bless-color-on-accent);
  font-family: var(--bless-font-sans);
  font-size: var(--bless-text-2xs);
  font-weight: var(--bless-font-weight-bold);
  line-height: 1;
  transform: skewX(var(--bless-skew));
  pointer-events: none;
}
.bless-indicator__text {
  display: inline-block;
  transform: skewX(var(--bless-skew-counter));
}
.bless-indicator__badge--dot {
  min-width: 10px;
  width: 10px;
  height: 10px;
  padding: 0;
}
.bless-indicator__badge--top-right {
  top: 0;
  right: 0;
  translate: 40% -40%;
}
.bless-indicator__badge--top-left {
  top: 0;
  left: 0;
  translate: -40% -40%;
}
.bless-indicator__badge--bottom-right {
  bottom: 0;
  right: 0;
  translate: 40% 40%;
}
.bless-indicator__badge--bottom-left {
  bottom: 0;
  left: 0;
  translate: -40% 40%;
}
.bless-indicator__badge--danger {
  background: var(--bless-color-danger);
}
.bless-indicator__badge--success {
  background: var(--bless-color-success);
  color: var(--bless-color-on-light);
}
.bless-indicator__badge--warning {
  background: var(--bless-color-warning);
  color: var(--bless-color-on-light);
}
.bless-indicator__badge--info {
  background: var(--bless-color-info);
}
.bless-indicator__badge--text {
  background: var(--bless-color-text);
  color: var(--bless-color-on-text);
}
</style>
