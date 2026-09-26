<script setup lang="ts">
import { ref } from "vue";
import { BlessButton, BlessField, BlessForm, BlessInput } from "blessing-ui";
const result = ref("");
function onSubmit(d: FormData) {
  result.value = JSON.stringify(Object.fromEntries(d));
}
</script>

<template>
  <BlessForm style="max-width: 420px" @submit="onSubmit">
    <BlessField label="Handle" required description="3–12 chars">
      <BlessInput name="handle" required minlength="3" maxlength="12" placeholder="megumi" />
    </BlessField>
    <BlessField label="Email" required>
      <BlessInput name="email" type="email" required placeholder="you@example.com" />
    </BlessField>
    <BlessField label="Age" hint="optional">
      <BlessInput name="age" type="number" min="13" max="120" />
    </BlessField>
    <BlessField label="Server says" error="Handle already taken">
      <BlessInput name="x" model-value="megumi" />
    </BlessField>
    <div class="row">
      <BlessButton type="submit">Submit</BlessButton>
      <BlessButton type="reset" variant="outline">Reset</BlessButton>
    </div>
    <small v-if="result">submitted: {{ result }}</small>
  </BlessForm>
</template>
