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

// A native reset rewrites the fields in the page, but v-model never hears about it: the app kept the
// old values while the boxes looked empty. The reset event fires before the fields change, so on the
// next task replay input/change on each control and every v-model reads what the reset left.
function onReset() {
  submitted.value = false;
  resets.value++;
  setTimeout(() => {
    for (const el of Array.from(form.value?.elements ?? []) as HTMLInputElement[]) {
      if (
        el.type === "hidden" ||
        el.type === "submit" ||
        el.type === "reset" ||
        el.type === "button"
      )
        continue;
      el.dispatchEvent(
        new Event(el.type === "checkbox" || el.type === "radio" ? "change" : "input", {
          bubbles: true,
        }),
      );
      if (el.tagName === "SELECT") el.dispatchEvent(new Event("change", { bubbles: true }));
    }
  });
}
function onSubmit(e: SubmitEvent) {
  submitted.value = true;
  const f = e.target as HTMLFormElement;
  if (!f.checkValidity()) {
    e.preventDefault();
    emit("invalid", f);
    // a fieldset around an invalid control matches :invalid too, and comes first — skip it
    f.querySelector<HTMLElement>(":invalid:not(fieldset)")?.focus();
    return;
  }
  e.preventDefault();
  emit("submit", new FormData(f), e);
}

defineExpose({
  reset: () => form.value?.reset(), // fires the reset event, which does the rest
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
    @reset="onReset"
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
