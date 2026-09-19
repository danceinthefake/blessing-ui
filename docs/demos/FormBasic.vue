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
    <BlessField
      label="Handle"
      required
      description="3–12 chars"
      v-slot="{ id, error, describedby }"
    >
      <BlessInput
        :id
        name="handle"
        required
        minlength="3"
        maxlength="12"
        :invalid="!!error"
        :aria-describedby="describedby"
        placeholder="megumi"
      />
    </BlessField>
    <BlessField label="Email" required v-slot="{ id, error, describedby }">
      <BlessInput
        :id
        name="email"
        type="email"
        required
        :invalid="!!error"
        :aria-describedby="describedby"
        placeholder="you@example.com"
      />
    </BlessField>
    <BlessField label="Age" hint="optional" v-slot="{ id, error, describedby }">
      <BlessInput
        :id
        name="age"
        type="number"
        min="13"
        max="120"
        :invalid="!!error"
        :aria-describedby="describedby"
      />
    </BlessField>
    <BlessField label="Server says" error="Handle already taken" v-slot="{ id }">
      <BlessInput :id name="x" model-value="megumi" invalid />
    </BlessField>
    <div class="row">
      <BlessButton type="submit" color="accent">Submit</BlessButton>
      <BlessButton type="reset" variant="outline">Reset</BlessButton>
    </div>
    <small v-if="result">submitted: {{ result }}</small>
  </BlessForm>
</template>
