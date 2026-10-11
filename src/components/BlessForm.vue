<script lang="ts">
import type { InjectionKey, Ref } from "vue";
/** BlessField reads these: whether the form has been submitted, and a counter bumped on reset */
export const blessFormKey: InjectionKey<{
  submitted: Ref<boolean>;
  resets: Ref<number>;
  /** messages from `schema`, one per field `name`; `""` is the whole form */
  errors: Ref<Record<string, string>>;
  /** a field forgets its schema message when the person edits it */
  clear: (name: string) => void;
}> = Symbol("bless-form");
</script>

<script setup lang="ts">
import { nextTick, provide, ref } from "vue";
import { formValues, issuesToErrors } from "./schema";
import type { BlessSchema } from "./schema";

defineOptions({ name: "BlessForm" });

const props = defineProps<{
  /**
   * A Standard Schema (Zod, Valibot, ArkType…) checked after the browser checks pass. Its messages
   * show in the matching `BlessField`, by the `name` of the control. Form data is text, so use the
   * schema's own coercion for numbers and dates.
   */
  schema?: BlessSchema;
}>();
const emit = defineEmits<{
  /** `value` is what the schema returned (with its coercion), or the form data as an object */
  submit: [data: FormData, event: SubmitEvent, value: unknown];
  invalid: [form: HTMLFormElement];
}>();
const form = ref<HTMLFormElement>();
const submitted = ref(false);
const resets = ref(0);
const errors = ref<Record<string, string>>({});
const pending = ref(false);
const clear = (name: string) => {
  if (name in errors.value) {
    const { [name]: _gone, ...rest } = errors.value;
    errors.value = rest;
  }
};
provide(blessFormKey, { submitted, resets, errors, clear });

// A native reset rewrites the fields in the page, but v-model never hears about it: the app kept the
// old values while the boxes looked empty. The reset event fires before the fields change, so on the
// next task replay input/change on each control and every v-model reads what the reset left.
function onReset() {
  submitted.value = false;
  errors.value = {};
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
async function onSubmit(e: SubmitEvent) {
  submitted.value = true;
  e.preventDefault();
  const f = e.target as HTMLFormElement;
  if (!f.checkValidity()) {
    emit("invalid", f);
    // a fieldset around an invalid control matches :invalid too, and comes first — skip it
    f.querySelector<HTMLElement>(":invalid:not(fieldset)")?.focus();
    return;
  }
  const data = new FormData(f);
  let value: unknown = formValues(data);
  if (props.schema) {
    pending.value = true;
    try {
      const r = await props.schema["~standard"].validate(value);
      if (r.issues) {
        errors.value = issuesToErrors(r.issues);
        emit("invalid", f);
        // wait for the fields to mark themselves, then focus the first one that has a message
        await nextTick();
        f.querySelector<HTMLElement>("[aria-invalid='true']")?.focus();
        return;
      }
      errors.value = {};
      value = r.value;
    } finally {
      pending.value = false;
    }
  }
  emit("submit", data, e, value);
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
    <slot :submitted :errors :pending />
  </form>
</template>

<style>
.bless-form {
  display: grid;
  gap: var(--bless-space-6);
}
</style>
