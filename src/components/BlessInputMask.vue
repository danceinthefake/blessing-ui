<script setup lang="ts">
import { computed } from "vue";
import BlessInput from "./BlessInput.vue";
import { applyMask, unmask } from "./mask";

defineOptions({ name: "BlessInputMask", inheritAttrs: false });

const props = defineProps<{
  /** # digit · A letter · * letter or digit · anything else is a literal */
  mask: string;
  /** placeholder shown when empty; defaults to the mask with tokens as _ */
  placeholder?: string;
}>();
/** the formatted value, e.g. "090-1234-5678" */
const model = defineModel<string>({ default: "" });
const emit = defineEmits<{ /** value with literals stripped */ "update:raw": [raw: string] }>();

const ph = computed(() => props.placeholder ?? props.mask.replace(/[#A*]/g, "_"));
/** digits-only masks get the number keypad on phones */
const numeric = computed(() => !/[A*]/.test(props.mask));

function onInput(v: string | number) {
  const masked = applyMask(props.mask, String(v));
  model.value = masked;
  emit("update:raw", unmask(props.mask, masked));
}
// Runs in capture, before v-model reads the box. Rewrite the box itself: when the masked value equals the model, Vue has nothing to re-render
// and a rejected character would stay visible. Masking the text before the caret gives where
// the caret belongs in the result.
function fix(e: Event) {
  const el = e.target as HTMLInputElement;
  const masked = applyMask(props.mask, el.value);
  if (el.value === masked) return;
  const at = applyMask(props.mask, el.value.slice(0, el.selectionStart ?? el.value.length)).length;
  el.value = masked;
  el.setSelectionRange(at, at);
}
</script>

<template>
  <BlessInput
    :inputmode="numeric ? 'numeric' : undefined"
    v-bind="$attrs"
    :model-value="model"
    :placeholder="ph"
    @update:model-value="onInput"
    @input.capture="fix"
  />
</template>
