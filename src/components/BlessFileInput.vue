<script setup lang="ts">
import { ref } from "vue";
import { useFieldId, useFieldState } from "../composables/useFieldId";

defineOptions({ name: "BlessFileInput", inheritAttrs: false });

const props = withDefaults(
  defineProps<{
    id?: string;
    accept?: string;
    multiple?: boolean;
    disabled?: boolean;
    invalid?: boolean;
    /** drop zone copy */
    label?: string;
    hint?: string;
    /** show the chosen files under the zone */
    list?: boolean;
  }>(),
  { label: "Drop files here or click to browse", list: true },
);
const model = defineModel<File[]>({ default: () => [] });
const id = useFieldId(props);
const fs = useFieldState();
const input = ref<HTMLInputElement>();
const over = ref(false);

/** does the file match the accept list: mime, `image/*`, or `.ext` */
function accepts(f: File) {
  if (!props.accept) return true;
  const ext = "." + f.name.split(".").pop()!.toLowerCase();
  return props.accept.split(",").some((a) => {
    a = a.trim().toLowerCase();
    if (!a) return false;
    if (a.startsWith(".")) return a === ext;
    if (a.endsWith("/*")) return f.type.startsWith(a.slice(0, -1));
    return f.type === a;
  });
}
function take(list: FileList | null) {
  const files = Array.from(list ?? []).filter(accepts);
  model.value = props.multiple ? [...model.value, ...files] : files.slice(0, 1);
}
function onDrop(e: DragEvent) {
  over.value = false;
  if (!props.disabled) take(e.dataTransfer?.files ?? null);
}
function remove(i: number) {
  model.value = model.value.filter((_, k) => k !== i);
  if (input.value) input.value.value = "";
}
const kb = (n: number) =>
  n < 1024
    ? `${n} B`
    : n < 1048576
      ? `${(n / 1024).toFixed(0)} KB`
      : `${(n / 1048576).toFixed(1)} MB`;
</script>

<template>
  <div
    class="bless-file"
    :class="{ 'bless-file--disabled': disabled, 'bless-file--invalid': invalid }"
  >
    <label
      :for="id()"
      class="bless-file__zone"
      :class="{ 'bless-file__zone--over': over }"
      @dragover.prevent="!disabled && (over = true)"
      @dragleave="over = false"
      @drop.prevent="onDrop"
    >
      <input
        v-bind="$attrs"
        :id="id()"
        ref="input"
        type="file"
        class="bless-file__input"
        :accept
        :multiple
        :disabled
        :aria-invalid="invalid || fs.invalid.value || undefined"
        :aria-describedby="($attrs['aria-describedby'] as string) ?? fs.describedby.value"
        @change="take(($event.target as HTMLInputElement).files)"
      />
      <span class="bless-file__icon" aria-hidden="true"><slot name="icon">⇪</slot></span>
      <span class="bless-file__label"
        ><slot>{{ label }}</slot></span
      >
      <span v-if="hint" class="bless-file__hint">{{ hint }}</span>
    </label>
    <ul role="list" v-if="list && model.length" class="bless-file__list">
      <li v-for="(f, i) in model" :key="f.name + i" class="bless-file__item">
        <span class="bless-file__name">{{ f.name }}</span>
        <span class="bless-file__size">{{ kb(f.size) }}</span>
        <button
          type="button"
          class="bless-file__remove"
          :aria-label="`Remove ${f.name}`"
          @click="remove(i)"
        >
          ×
        </button>
      </li>
    </ul>
  </div>
</template>

<style>
.bless-file {
  font-family: var(--bless-font-sans);
  color: var(--bless-color-text);
}
.bless-file__zone {
  border-radius: var(--bless-radius);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--bless-space-1);
  padding: var(--bless-space-6);
  border: var(--bless-border-width) dashed var(--bless-color-text-muted);
  background: var(--bless-color-surface);
  text-align: center;
  cursor: pointer;
  transition:
    border-color var(--bless-duration-base),
    background var(--bless-duration-base);
}
/* children don't fire dragleave as the cursor crosses them */
.bless-file__zone > * {
  pointer-events: none;
}
.bless-file__zone:hover,
.bless-file__zone--over {
  border-color: var(--bless-color-accent-text);
  border-style: solid;
}
.bless-file__zone:focus-within {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: 2px;
}
.bless-file__input {
  position: absolute;
  width: 1px;
  height: 1px;
  opacity: 0;
  pointer-events: none;
}
.bless-file__icon {
  font-size: var(--bless-text-lg);
  color: var(--bless-color-text-muted);
  transform: skewX(var(--bless-skew));
}
.bless-file__label {
  font-size: var(--bless-text-sm);
  font-weight: var(--bless-font-weight-bold);
  letter-spacing: var(--bless-tracking-wide);
}
.bless-file__hint {
  font-size: var(--bless-text-xs);
  color: var(--bless-color-text-muted);
}
.bless-file--invalid .bless-file__zone {
  border-color: var(--bless-color-danger);
}
.bless-file--disabled {
  opacity: 0.4;
  pointer-events: none;
}
.bless-file__list {
  margin: var(--bless-space-2) 0 0;
  padding: 0;
  list-style: none;
}
.bless-file__item {
  display: flex;
  align-items: center;
  gap: var(--bless-space-2);
  padding: var(--bless-space-1) 0;
  font-size: var(--bless-text-sm);
  border-bottom: var(--bless-border-width) solid var(--bless-color-border);
}
.bless-file__name {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.bless-file__size {
  font-size: var(--bless-text-xs);
  color: var(--bless-color-text-muted);
}
.bless-file__remove {
  min-inline-size: 24px;
  min-block-size: 24px;
  border: 0;
  background: none;
  color: var(--bless-color-text-muted);
  font: inherit;
  font-size: var(--bless-text-md);
  line-height: 1;
  cursor: pointer;
}
.bless-file__remove:hover {
  color: var(--bless-color-danger-text);
}
</style>
