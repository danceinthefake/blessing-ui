<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useFieldId, useFieldState } from "../composables/useFieldId";
import BlessChip from "./BlessChip.vue";

defineOptions({ name: "BlessInputTags", inheritAttrs: false });

const props = withDefaults(
  defineProps<{
    id?: string;
    placeholder?: string;
    /** submitted with the form, one value per tag */
    name?: string;
    /** keys (Enter) or characters (,) that commit the draft; characters also split a paste */
    separators?: string[];
    max?: number;
    disabled?: boolean;
    invalid?: boolean;
    label?: string;
    /** allow the same tag twice */
    duplicates?: boolean;
  }>(),
  { separators: () => ["Enter", ","] },
);
const model = defineModel<string[]>({ default: () => [] });
const id = useFieldId(props);
const fs = useFieldState();
const draft = ref("");
const input = ref<HTMLInputElement>();
const said = ref(""); // live region: adds and removes are otherwise silent
const chars = computed(() => props.separators.filter((x) => x.length === 1));
const split = (v: string) =>
  chars.value.length
    ? v.split(new RegExp(`[${chars.value.join("").replace(/[\]\\^-]/g, "\\$&")}]`))
    : [v];

function add(text = draft.value) {
  const next = [...model.value];
  for (const raw of split(text)) {
    const v = raw.trim();
    if (!v || (props.max != null && next.length >= props.max)) continue;
    if (!props.duplicates && next.includes(v)) continue;
    next.push(v);
  }
  draft.value = "";
  if (next.length === model.value.length) return;
  said.value = `Added ${next.slice(model.value.length).join(", ")}`;
  model.value = next;
}
// phone keyboards send key "Unidentified", and a paste arrives whole: split on the characters
// as the text changes; the last piece stays as the draft
watch(draft, (v) => {
  const parts = split(v);
  if (parts.length < 2) return;
  const rest = parts.pop()!;
  add(parts.join(chars.value[0]));
  draft.value = rest.trimStart();
});
function remove(i: number, refocus = false) {
  said.value = `Removed ${model.value[i]}`;
  model.value = model.value.filter((_, k) => k !== i);
  if (refocus) input.value?.focus();
}
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
    :class="{
      'bless-tags--disabled': disabled,
      'bless-tags--invalid': invalid || fs.invalid.value,
    }"
    @click="input?.focus()"
  >
    <ul v-if="model.length" class="bless-tags__list" role="list">
      <li v-for="(t, i) in model" :key="t + i" class="bless-tags__item" role="listitem">
        <BlessChip :label="t" size="sm" :removable="!disabled" @remove="remove(i, true)" />
      </li>
    </ul>
    <input
      v-bind="$attrs"
      :id="id()"
      ref="input"
      v-model="draft"
      type="text"
      class="bless-tags__input"
      :placeholder="model.length ? '' : placeholder"
      :disabled
      :aria-label="label ?? (fs.inField ? undefined : 'Tags')"
      :aria-invalid="invalid || fs.invalid.value || undefined"
      :aria-describedby="($attrs['aria-describedby'] as string) ?? fs.describedby.value"
      @keydown="onKey"
      @blur="add()"
    />
    <template v-if="name">
      <input v-for="(t, i) in model" :key="i" type="hidden" :name :value="t" />
    </template>
    <span class="bless-tags__live" aria-live="polite">{{ said }}</span>
  </div>
</template>

<style>
.bless-tags {
  border-radius: var(--bless-radius-plate);
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
/* the list and its items don't box: chips wrap in the field's own flex row */
.bless-tags__list,
.bless-tags__item {
  display: contents;
}
/* the field already leans: a chip inside adds no lean of its own (its content still
   counter-skews, so the text stands upright), and takes the page colour to stand off the field fill */
.bless-tags .bless-chip {
  transform: none;
  background: var(--bless-color-bg);
}
.bless-tags__live {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip-path: inset(50%);
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
/* parallelogram field; content counter-skews so text stays upright */
.bless-tags {
  transform: skewX(var(--bless-skew));
}
.bless-tags > :not(.bless-skew, .bless-chip, .bless-badge, .bless-tags__list) {
  transform: skewX(var(--bless-skew-counter));
}
.bless-tags {
  padding-inline: calc(var(--bless-space-3) + 4px);
}
</style>
