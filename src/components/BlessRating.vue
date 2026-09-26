<script setup lang="ts">
import { ref, useId } from "vue";

defineOptions({ name: "BlessRating" });

const props = withDefaults(
  defineProps<{
    max?: number;
    name?: string;
    label?: string;
    readonly?: boolean;
    disabled?: boolean;
    size?: "sm" | "md" | "lg";
    /** glyph for each step */
    icon?: string;
  }>(),
  { max: 5, label: "Rating", size: "md", icon: "★" },
);
const model = defineModel<number>({ default: 0 });
const uid = useId();
const name = () => props.name ?? uid;
const hover = ref(0);
// read-only renders one image with a name ("Score: 4 of 5"), not a disabled set of radios that
// screen readers call "dimmed" and can't reach
</script>

<template>
  <span
    v-if="readonly"
    class="bless-rating bless-rating--readonly"
    :class="`bless-rating--${size}`"
    role="img"
    :aria-label="`${label}: ${model} of ${max}`"
  >
    <span
      v-for="n in max"
      :key="n"
      class="bless-rating__star"
      :class="{ 'bless-rating__star--on': n <= model }"
      aria-hidden="true"
      >{{ icon }}</span
    >
  </span>
  <fieldset
    v-else
    class="bless-rating"
    :class="[`bless-rating--${size}`, { 'bless-rating--disabled': disabled }]"
    :disabled
    @mouseleave="hover = 0"
  >
    <legend class="bless-rating__legend">{{ label }}</legend>
    <label
      v-for="n in max"
      :key="n"
      class="bless-rating__star"
      :class="{ 'bless-rating__star--on': n <= (hover || model) }"
      @mouseenter="hover = n"
    >
      <input
        class="bless-rating__input"
        type="radio"
        :name="name()"
        :value="n"
        :checked="model === n"
        :aria-label="`${n} of ${max}`"
        @change="model = n"
        @click="model === n && (model = 0)"
      />
      <span aria-hidden="true">{{ icon }}</span>
    </label>
  </fieldset>
</template>

<style>
.bless-rating {
  --_s: 24px;
  display: inline-flex;
  gap: 2px;
  margin: 0;
  padding: 0;
  border: 0;
  font-family: var(--bless-font-sans);
}
.bless-rating--sm {
  --_s: 18px;
}
.bless-rating--lg {
  --_s: 32px;
}
.bless-rating__legend {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip-path: inset(50%);
}
.bless-rating__star {
  position: relative;
  display: inline-grid;
  place-items: center;
  width: var(--_s);
  height: var(--_s);
  font-size: var(--_s);
  line-height: 1;
  color: var(--bless-color-border);
  cursor: pointer;
  transform: skewX(var(--bless-skew));
  transition:
    color var(--bless-duration-fast),
    var(--bless-lean-transition);
}
.bless-rating__star > span {
  transform: skewX(var(--bless-skew-counter));
}
.bless-rating__star--on {
  color: var(--bless-color-accent-text);
}
.bless-rating__input {
  position: absolute;
  width: 1px;
  height: 1px;
  margin: 0;
  opacity: 0;
  pointer-events: none;
}
.bless-rating__input:focus-visible + span {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: 2px;
}
.bless-rating--readonly .bless-rating__star,
.bless-rating--disabled .bless-rating__star {
  cursor: default;
  pointer-events: none;
}
.bless-rating--disabled {
  opacity: 0.4;
}
</style>
