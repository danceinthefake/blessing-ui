<script setup lang="ts">
import { ref } from "vue";
import { useFieldId } from "../composables/useFieldId";
import BlessChip from "./BlessChip.vue";

defineOptions({ name: "BlessInputTags", inheritAttrs: false });

const props = withDefaults(
  defineProps<{
    id?: string;
    placeholder?: string;
    /** keys that commit the draft */
    separators?: string[];
    max?: number;
    disabled?: boolean;
    invalid?: boolean;
    label?: string;
    /** allow the same tag twice */
    duplicates?: boolean;
  }>(),
  { separators: () => ["Enter", ","], label: "Tags" },
);
const model = defineModel<string[]>({ default: () => [] });
const id = useFieldId(props);
const draft = ref("");

function add() {
  const v = draft.value.trim();
  if (!v || (props.max != null && model.value.length >= props.max)) return;
  if (!props.duplicates && model.value.includes(v)) return void (draft.value = "");
  model.value = [...model.value, v];
  draft.value = "";
}
const remove = (i: number) => (model.value = model.value.filter((_, k) => k !== i));
function onKey(e: KeyboardEvent) {
  if (props.separators.includes(e.key)) {
    e.preventDefault();
    add();
  } else if (e.key === "Backspace" && !draft.value && model.value.length)
    remove(model.value.length - 1);
}
</script>

<template>
  <div
    class="bless-tags"
    :class="{ 'bless-tags--disabled': disabled, 'bless-tags--invalid': invalid }"
    @click="($refs.input as HTMLInputElement)?.focus()"
  >
    <BlessChip
      v-for="(t, i) in model"
      :key="t + i"
      :label="t"
      size="sm"
      removable
      @remove="remove(i)"
    />
    <input
      v-bind="$attrs"
      :id="id()"
      ref="input"
      v-model="draft"
      type="text"
      class="bless-tags__input"
      :placeholder="model.length ? '' : placeholder"
      :disabled
      :aria-label="label"
      :aria-invalid="invalid || undefined"
      @keydown="onKey"
      @blur="add"
    />
  </div>
</template>

<style>
.bless-tags {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--bless-space-1);
  min-height: 40px;
  padding: var(--bless-space-1) var(--bless-space-2);
  background: var(--bless-color-surface);
  border-bottom: calc(2 * var(--bless-border-width)) solid var(--bless-color-text-muted);
  font-family: var(--bless-font-sans);
  color: var(--bless-color-text);
  cursor: text;
}
.bless-tags:focus-within {
  border-bottom-color: var(--bless-color-accent-text);
}
.bless-tags--invalid {
  border-bottom-color: var(--bless-color-danger);
}
.bless-tags__input {
  flex: 1;
  min-width: 80px;
  padding: var(--bless-space-1);
  border: 0;
  background: transparent;
  font: inherit;
  color: inherit;
  outline: 0;
}
.bless-tags__input::placeholder {
  color: var(--bless-color-text-muted);
}
.bless-tags--disabled {
  opacity: 0.4;
  pointer-events: none;
}
</style>
