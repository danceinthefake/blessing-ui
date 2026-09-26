<script setup lang="ts">
import { useFieldId } from "../composables/useFieldId";

defineOptions({ name: "BlessSwap" });

const props = defineProps<{
  id?: string;
  label: string;
  disabled?: boolean;
  /** how the two faces exchange */
  effect?: "fade" | "rotate" | "flip";
}>();
const model = defineModel<boolean>({ default: false });
const id = useFieldId(props);
</script>

<template>
  <label
    :for="id()"
    class="bless-swap"
    :class="[
      `bless-swap--${effect ?? 'fade'}`,
      { 'bless-swap--on': model, 'bless-swap--disabled': disabled },
    ]"
  >
    <input
      :id="id()"
      v-model="model"
      type="checkbox"
      class="bless-swap__input"
      :disabled
      :aria-label="label"
    />
    <span class="bless-swap__face bless-swap__face--on" aria-hidden="true"
      ><slot name="on">●</slot></span
    >
    <span class="bless-swap__face bless-swap__face--off" aria-hidden="true"
      ><slot name="off">○</slot></span
    >
  </label>
</template>

<style>
.bless-swap {
  border-radius: var(--bless-radius);
  position: relative;
  display: inline-grid;
  place-items: center;
  cursor: pointer;
  font-family: var(--bless-font-sans);
  color: var(--bless-color-text);
  transition:
    opacity var(--bless-duration-slow) var(--bless-ease-in-out),
    var(--bless-lean-transition);
}
.bless-swap:hover:not(.bless-swap--disabled) {
  opacity: var(--bless-hover-opacity);
}
.bless-swap__input {
  position: absolute;
  width: 1px;
  height: 1px;
  margin: 0;
  opacity: 0;
  pointer-events: none;
}
.bless-swap__face {
  grid-area: 1 / 1;
  display: inline-flex;
  transition:
    opacity var(--bless-duration-base) var(--bless-ease-out),
    transform var(--bless-duration-base) var(--bless-ease-out);
}
.bless-swap__face--on {
  opacity: 0;
}
.bless-swap--on .bless-swap__face--on {
  opacity: 1;
}
.bless-swap--on .bless-swap__face--off {
  opacity: 0;
}
.bless-swap--rotate .bless-swap__face--on {
  transform: rotate(-45deg);
}
.bless-swap--rotate.bless-swap--on .bless-swap__face--on {
  transform: rotate(0);
}
.bless-swap--rotate.bless-swap--on .bless-swap__face--off {
  transform: rotate(45deg);
}
.bless-swap--flip .bless-swap__face--on {
  transform: rotateY(180deg);
}
.bless-swap--flip.bless-swap--on .bless-swap__face--on {
  transform: rotateY(0);
}
.bless-swap--flip.bless-swap--on .bless-swap__face--off {
  transform: rotateY(-180deg);
}
.bless-swap:has(.bless-swap__input:focus-visible) {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: 2px;
}
.bless-swap--disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
</style>
