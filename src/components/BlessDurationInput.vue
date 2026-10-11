<script setup lang="ts">
import { computed, ref, watch } from "vue";
import BlessInput from "./BlessInput.vue";
import { formatDuration, parseDuration } from "./duration";

defineOptions({ name: "BlessDurationInput", inheritAttrs: false });

const props = withDefaults(
  defineProps<{
    /** show and read seconds (`h:mm:ss`). Off gives `h:mm`. */
    seconds?: boolean;
    /** the smallest value, in seconds */
    min?: number;
    /** the largest value, in seconds */
    max?: number;
    labels?: Partial<{ invalid: string }>;
  }>(),
  { seconds: true },
);
/** the duration in seconds, or `null` when the field is empty or unreadable */
const model = defineModel<number | null>({ default: null });

const text = computed(() => ({ invalid: "Enter a time such as 1:30 or 1h 30m", ...props.labels }));
const shown = ref(model.value == null ? "" : formatDuration(model.value, props.seconds));
const bad = ref(false);
// the box keeps what the person types. The model changes from outside: show it then.
watch(model, (v) => {
  if (v !== parseDuration(shown.value, props.seconds))
    shown.value = v == null ? "" : formatDuration(v, props.seconds);
});

function onInput(v: string | number) {
  shown.value = String(v);
  const s = parseDuration(shown.value, props.seconds);
  model.value = s == null ? null : Math.min(props.max ?? Infinity, Math.max(props.min ?? 0, s));
  bad.value = false;
}
// on blur, rewrite the text in one format. Text that is not a time is flagged and kept for fixing.
function onBlur() {
  if (!shown.value.trim()) return void (model.value = null);
  if (model.value == null) bad.value = true;
  else shown.value = formatDuration(model.value, props.seconds);
}
</script>

<template>
  <BlessInput
    v-bind="$attrs"
    :model-value="shown"
    type="text"
    autocomplete="off"
    :placeholder="seconds ? '0:00:00' : '0:00'"
    :invalid="bad"
    :error="bad ? text.invalid : undefined"
    @update:model-value="onInput"
    @blur="onBlur"
  />
</template>
