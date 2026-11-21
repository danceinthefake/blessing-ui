<template>
  <div style="display: grid; justify-items: center; gap: 12px">
    <BlessPinPad
      v-model="pin"
      :invalid="wrong"
      @finish="check"
      @update:model-value="wrong && pin && (wrong = false)"
    />
    <p aria-live="polite" style="min-height: 1.6em">
      {{ wrong ? "Wrong PIN. Try again." : pin.length === 4 ? "Unlocked." : "Enter 1984." }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { BlessPinPad } from "blessing-ui";

const pin = ref("");
const wrong = ref(false);
// the demo PIN is 1984; a real app checks the PIN on the server
function check(value: string) {
  wrong.value = value !== "1984";
  if (wrong.value) setTimeout(() => (pin.value = ""), 600);
}
</script>
