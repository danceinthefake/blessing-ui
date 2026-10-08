<script setup lang="ts">
import { ref } from "vue";
import { BlessFormula } from "blessing-ui";

const formula = ref("price * qty + tax");
const result = ref<number | null>(null);
const variables = [
  { name: "price", label: "Price", value: 12.5 },
  { name: "qty", label: "Quantity", value: 4 },
  { name: "tax", label: "Tax", value: 2 },
];
</script>

<template>
  <div class="col">
    <BlessFormula
      v-model="formula"
      :variables
      :functions="{ vat: (x: number) => x * 0.11 }"
      label="Total formula"
      locale="en"
      @result="result = $event"
    />
    <p style="margin: 0">Result for the form: {{ result ?? "—" }}</p>
  </div>
</template>
