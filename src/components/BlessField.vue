<script setup lang="ts">
import { ref, useId } from "vue";
import { provideFieldId } from "../composables/useFieldId";
import BlessLabel from "./BlessLabel.vue";

defineOptions({ name: "BlessField" });

const props = defineProps<{
  label?: string;
  hint?: string;
  required?: boolean;
  description?: string;
  /** explicit error; otherwise read from the control's validity after submit/blur */
  error?: string;
  id?: string;
}>();

const uid = useId();
const id = props.id ?? uid;
provideFieldId(id); // the first control inside picks this up as its id — no v-slot wiring needed
const nativeError = ref("");

/** call on the control's blur/invalid to surface Constraint API messages */
function validate(e: Event) {
  const el = e.target as HTMLInputElement | null;
  nativeError.value = el?.validationMessage ?? "";
}
</script>

<template>
  <div
    class="bless-field"
    :class="{ 'bless-field--invalid': error || nativeError }"
    @blur.capture="validate"
    @invalid.capture="validate"
    @input="nativeError && validate($event)"
  >
    <BlessLabel v-if="label" :for="id" :required :hint class="bless-field__label">{{
      label
    }}</BlessLabel>
    <slot
      :id
      :error="error || nativeError"
      :describedby="error || nativeError ? `${id}-err` : description ? `${id}-desc` : undefined"
    />
    <p v-if="error || nativeError" :id="`${id}-err`" class="bless-field__error" role="alert">
      {{ error || nativeError }}
    </p>
    <p v-else-if="description" :id="`${id}-desc`" class="bless-field__description">
      {{ description }}
    </p>
  </div>
</template>

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
  color: var(--bless-color-danger);
  font-weight: var(--bless-font-weight-bold);
}
</style>
