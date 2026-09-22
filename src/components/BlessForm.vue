<script lang="ts">
import type { InjectionKey, Ref } from "vue";
/** BlessField reads these: whether the form has been submitted, and a counter bumped on reset */
export const blessFormKey: InjectionKey<{ submitted: Ref<boolean>; resets: Ref<number> }> =
  Symbol("bless-form");
</script>

<script setup lang="ts">
import { provide, ref } from "vue";

defineOptions({ name: "BlessForm" });

const emit = defineEmits<{
  submit: [data: FormData, event: SubmitEvent];
  invalid: [form: HTMLFormElement];
}>();
const form = ref<HTMLFormElement>();
const submitted = ref(false);
const resets = ref(0);
provide(blessFormKey, { submitted, resets });

function onSubmit(e: SubmitEvent) {
  submitted.value = true;
  const f = e.target as HTMLFormElement;
  if (!f.checkValidity()) {
    e.preventDefault();
    emit("invalid", f);
    f.querySelector<HTMLElement>(":invalid")?.focus();
    return;
  }
  e.preventDefault();
  emit("submit", new FormData(f), e);
}

defineExpose({
  reset: () => {
    form.value?.reset();
    submitted.value = false;
    resets.value++;
  },
  el: form,
});
</script>

<template>
  <form
    ref="form"
    class="bless-form"
    :class="{ 'bless-form--submitted': submitted }"
    novalidate
    @submit="onSubmit"
    @reset="
      submitted = false;
      resets++;
    "
  >
    <slot :submitted />
  </form>
</template>

<style>
.bless-form {
  display: grid;
  gap: var(--bless-space-6);
}
</style>
