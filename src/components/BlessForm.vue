<script setup lang="ts">
import { ref } from "vue";

defineOptions({ name: "BlessForm" });

const emit = defineEmits<{
  submit: [data: FormData, event: SubmitEvent];
  invalid: [form: HTMLFormElement];
}>();
const form = ref<HTMLFormElement>();
const submitted = ref(false);

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
