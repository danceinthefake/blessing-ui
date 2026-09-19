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

function onInput(v: string | number) {
  const masked = applyMask(props.mask, String(v));
  model.value = masked;
  emit("update:raw", unmask(props.mask, masked));
}
</script>

<template>
  <BlessInput
    v-bind="$attrs"
    :model-value="model"
    :placeholder="ph"
    :maxlength="mask.length"
    @update:model-value="onInput"
  />
</template>
