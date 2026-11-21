<template>
  <BlessForm v-slot="{ errors }" :schema="schema" style="max-width: 420px" @submit="onSubmit">
    <BlessField label="Handle" required>
      <BlessInput name="handle" placeholder="megumi" />
    </BlessField>
    <BlessField label="Age" required>
      <BlessInput name="age" placeholder="17" />
    </BlessField>
    <p v-if="errors['']" role="alert">{{ errors[""] }}</p>
    <div class="row">
      <BlessButton type="submit">Submit</BlessButton>
    </div>
    <small v-if="result">submitted: {{ result }}</small>
  </BlessForm>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { BlessButton, BlessField, BlessForm, BlessInput, type BlessSchema } from "blessing-ui";

// A Standard Schema is any object with `~standard.validate`. Zod, Valibot, and ArkType all have it.
// This small one stands in for them, so the demo needs no library.
const schema: BlessSchema<{ handle: string; age: number }> = {
  "~standard": {
    validate(v) {
      const { handle = "", age = "" } = v as Record<string, string>;
      const issues = [];
      if (!/^[a-z0-9_]+$/.test(handle))
        issues.push({ message: "Use lowercase letters, digits, and _", path: ["handle"] });
      if (!(Number(age) >= 13)) issues.push({ message: "You must be 13 or older", path: ["age"] });
      return issues.length ? { issues } : { value: { handle, age: Number(age) } };
    },
  },
};

const result = ref("");
// `value` is what the schema returned, so `age` is a number here
const onSubmit = (_: FormData, __: SubmitEvent, value: unknown) =>
  (result.value = JSON.stringify(value));
</script>
