<script setup lang="ts" generic="T extends string | number">
import { provide, toRef } from "vue";
import { toggleGroupKey } from "./toggle";

defineOptions({ name: "BlessToggleGroup" });

const props = withDefaults(
  defineProps<{ type?: "single" | "multiple"; disabled?: boolean; label?: string }>(),
  { type: "single" },
);
const model = defineModel<T | T[] | undefined>();

const has = (v: string | number) =>
  Array.isArray(model.value) ? model.value.includes(v as T) : model.value === v;
function toggle(v: string | number) {
  const val = v as T;
  if (props.type === "multiple") {
    const arr = Array.isArray(model.value) ? model.value : [];
    model.value = arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val];
  } else model.value = model.value === val ? undefined : val;
}
provide(toggleGroupKey, { has, toggle, disabled: toRef(() => props.disabled) });
</script>

<template>
  <div class="bless-toggle-group" role="group" :aria-label="label"><slot /></div>
</template>

<style>
.bless-toggle-group {
  display: inline-flex;
  flex-wrap: wrap;
  gap: var(--bless-space-1);
}
</style>
