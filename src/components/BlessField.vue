<template>
  <div
    ref="root"
    class="bless-field"
    :class="{ 'bless-field--invalid': error || nativeError || schemaError }"
    @blur.capture="validate"
    @invalid.capture="validate"
    @input="onInput"
  >
    <BlessLabel
      v-if="label"
      :id="`${id}-label`"
      :for="id"
      :required
      :hint
      class="bless-field__label"
      >{{ label }}</BlessLabel
    >
    <slot :id :error="error || nativeError || schemaError" :describedby />
    <p v-if="description" :id="`${id}-desc`" class="bless-field__description">
      {{ description }}
    </p>
    <p v-if="shownError" :id="`${id}-err`" class="bless-field__error" role="alert">
      {{ shownError }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, useId, watch } from "vue";
import { computed, inject } from "vue";
import { provideField } from "../composables/useFieldId";
import { blessFormKey } from "./BlessForm.vue";
import BlessLabel from "./BlessLabel.vue";

defineOptions({ name: "BlessField" });

const props = defineProps<{
  label?: string;
  hint?: string;
  required?: boolean;
  description?: string;
  /** explicit error; otherwise read from the control's validity after submit/blur */
  error?: string;
  /** the id of the control; read once, when the field mounts. Default: a new id */
  id?: string;
  /** the `name` of the control, for the messages of a form `schema`. Default: the first named control inside. */
  name?: string;
}>();

const uid = useId();
const id = props.id ?? uid;
const nativeError = ref("");
const form = inject(blessFormKey, undefined);
const root = ref<HTMLElement>();
const found = ref("");
const fieldName = computed(() => props.name ?? found.value);
// a message from the form `schema`, matched by the `name` of the control
const schemaError = computed(() => (fieldName.value && form?.errors.value[fieldName.value]) || "");
const shownError = computed(() => props.error || nativeError.value || schemaError.value);
// the description stays while an error shows ("3–12 chars" is what fixes "too short"), so both are read
const describedby = computed(
  () =>
    [props.description && `${id}-desc`, shownError.value && `${id}-err`]
      .filter(Boolean)
      .join(" ") || undefined,
);
// the first control inside takes this id, the invalid flag and the describedby — no v-slot wiring
provideField(
  id,
  computed(() => !!shownError.value),
  describedby,
);

/** surface Constraint API messages — on blur only once the field has been typed in or the form submitted */
function validate(e: Event) {
  const el = e.target as HTMLInputElement | null;
  if (!el) return;
  if (e.type === "blur" && !el.value && !form?.submitted.value) return;
  nativeError.value = el.validationMessage ?? "";
}
watch(
  () => form?.resets.value,
  () => (nativeError.value = ""),
);
onMounted(() => {
  found.value = root.value?.querySelector<HTMLInputElement>("[name]")?.name ?? "";
});
function onInput(e: Event) {
  if (nativeError.value) validate(e);
  if (fieldName.value) form?.clear(fieldName.value);
}
</script>

<style>
.bless-field {
  display: grid;
  gap: var(--bless-space-2);
  font-family: var(--bless-font-sans);
}
.bless-field__description,
.bless-field__error {
  margin: 0;
  font-size: var(--bless-text-xs);
  line-height: var(--bless-leading-tight);
  color: var(--bless-color-text-muted);
}
.bless-field__error {
  color: var(--bless-color-danger-text);
  font-weight: var(--bless-font-weight-bold);
}
.bless-field__error {
  animation: bless-enter var(--bless-duration-voice) var(--bless-ease-snap);
}
</style>
