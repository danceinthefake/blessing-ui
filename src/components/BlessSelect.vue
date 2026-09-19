<script setup lang="ts" generic="T extends string | number">
import { useId } from "vue";
import type { BlessOption } from "./select";

defineOptions({ name: "BlessSelect", inheritAttrs: false });

const props = withDefaults(
  defineProps<{
    id?: string;
    options: Array<BlessOption<T> | { label: string; options: BlessOption<T>[] }>;
    placeholder?: string;
    size?: "sm" | "md" | "lg";
    disabled?: boolean;
    invalid?: boolean;
    description?: string;
    error?: string;
  }>(),
  { size: "md" },
);

const model = defineModel<T | undefined>();
const uid = useId();
const id = () => props.id ?? uid;
const isGroup = (o: unknown): o is { label: string; options: BlessOption<T>[] } =>
  !!o && typeof o === "object" && "options" in o;
</script>

<template>
  <div
    class="bless-select"
    :class="[
      `bless-select--${size}`,
      { 'bless-select--invalid': invalid || error, 'bless-select--disabled': disabled },
    ]"
  >
    <div class="bless-select__field">
      <select
        v-bind="$attrs"
        :id="id()"
        v-model="model"
        :disabled
        class="bless-select__control"
        :aria-invalid="invalid || error ? 'true' : undefined"
        :aria-describedby="error ? `${id()}-err` : description ? `${id()}-desc` : undefined"
      >
        <option v-if="placeholder" :value="undefined" disabled hidden>{{ placeholder }}</option>
        <template v-for="o in options" :key="isGroup(o) ? o.label : o.value">
          <optgroup v-if="isGroup(o)" :label="o.label">
            <option v-for="g in o.options" :key="g.value" :value="g.value" :disabled="g.disabled">
              {{ g.label }}
            </option>
          </optgroup>
          <option v-else :value="o.value" :disabled="o.disabled">{{ o.label }}</option>
        </template>
      </select>
      <span class="bless-select__chevron" aria-hidden="true" />
    </div>
    <p v-if="error" :id="`${id()}-err`" class="bless-select__error" role="alert">{{ error }}</p>
    <p v-else-if="description" :id="`${id()}-desc`" class="bless-select__description">
      {{ description }}
    </p>
  </div>
</template>

<style>
.bless-select {
  --_h: 40px;
  --_fs: var(--bless-text-md);
  display: block;
  font-family: var(--bless-font-sans);
  color: var(--bless-color-text);
}
.bless-select--sm {
  --_h: 32px;
  --_fs: var(--bless-text-sm);
}
.bless-select--lg {
  --_h: 48px;
  --_fs: var(--bless-text-lg);
}
.bless-select__field {
  position: relative;
  height: var(--_h);
  background: var(--bless-color-surface);
  border-bottom: calc(2 * var(--bless-border-width)) solid var(--bless-color-text-muted);
}
.bless-select__field::after {
  content: "";
  position: absolute;
  left: 0;
  bottom: calc(-2 * var(--bless-border-width));
  width: 100%;
  height: calc(2 * var(--bless-border-width));
  background: var(--bless-color-accent);
  transform: scaleX(0) skewX(var(--bless-skew));
  transform-origin: left;
  transition: transform var(--bless-duration-slow) var(--bless-ease-out);
}
.bless-select__field:focus-within::after {
  transform: scaleX(1) skewX(var(--bless-skew));
}
.bless-select__control {
  width: 100%;
  height: 100%;
  padding: 0 var(--bless-space-8) 0 var(--bless-space-3);
  border: 0;
  background: transparent;
  font: inherit;
  font-size: var(--_fs);
  color: inherit;
  appearance: none;
  cursor: pointer;
  outline: 0;
}
.bless-select__control:invalid {
  color: var(--bless-color-text-muted);
}
.bless-select__chevron {
  position: absolute;
  right: var(--bless-space-3);
  top: 50%;
  width: 8px;
  height: 8px;
  border-right: 2px solid currentColor;
  border-bottom: 2px solid currentColor;
  transform: translateY(-70%) rotate(45deg);
  pointer-events: none;
}
.bless-select--invalid .bless-select__field {
  border-bottom-color: var(--bless-color-danger);
}
.bless-select--invalid .bless-select__field::after {
  background: var(--bless-color-danger);
}
.bless-select--disabled {
  opacity: 0.4;
}
.bless-select--disabled .bless-select__control {
  cursor: not-allowed;
}

/* Customizable <select> (Chrome 135+): the picker becomes a styleable in-page element.
 * Other browsers keep their native popup — still functional, just system-styled. */
@supports (appearance: base-select) {
  .bless-select__control,
  .bless-select__control::picker(select) {
    appearance: base-select;
  }
  .bless-select__control {
    display: flex;
    align-items: center;
  }
  .bless-select__control::picker-icon {
    display: none;
  }
  .bless-select__control::picker(select) {
    min-width: anchor-size(self-inline);
    margin-top: var(--bless-space-1);
    padding: var(--bless-space-1) 0;
    border: var(--bless-border-width) solid var(--bless-color-border);
    background: var(--bless-color-bg);
    color: var(--bless-color-text);
    font-family: var(--bless-font-sans);
    font-size: var(--_fs);
    box-shadow: var(--bless-shadow-md);
  }
  .bless-select__control option {
    padding: var(--bless-space-1) var(--bless-space-3);
    line-height: var(--bless-leading-normal);
    font: inherit;
    font-size: var(--_fs);
    font-weight: var(--bless-font-weight-normal);
    letter-spacing: var(--bless-tracking-normal);
    text-transform: none;
    color: var(--bless-color-text);
    cursor: pointer;
  }
  .bless-select__control option::checkmark {
    display: none;
  }
  .bless-select__control option:hover,
  .bless-select__control option:focus-visible {
    background: var(--bless-color-surface);
    outline: 0;
  }
  .bless-select__control option:checked {
    color: var(--bless-color-accent);
    font-weight: var(--bless-font-weight-bold);
  }
  .bless-select__control option:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
  /* the UA-rendered group label inherits from optgroup; options reset above */
  .bless-select__control optgroup {
    padding: var(--bless-space-2) var(--bless-space-3) 0;
    font-size: var(--bless-text-2xs);
    font-weight: var(--bless-font-weight-bold);
    letter-spacing: var(--bless-tracking-wider);
    text-transform: uppercase;
    color: var(--bless-color-text-muted);
  }
  .bless-select__control optgroup option {
    margin: 0 calc(-1 * var(--bless-space-3));
  }
}
.bless-select__description,
.bless-select__error {
  margin: var(--bless-space-1) 0 0;
  font-size: var(--bless-text-xs);
  line-height: var(--bless-leading-tight);
  color: var(--bless-color-text-muted);
}
.bless-select__error {
  color: var(--bless-color-danger);
  font-weight: var(--bless-font-weight-bold);
}
</style>
