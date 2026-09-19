<script setup lang="ts">
import { ref } from "vue";
import { BlessCheckbox } from "blessing-ui";
const agree = ref(false);
</script>

<template>
  <div class="col">
    <BlessCheckbox v-model="agree" description="required to continue"
      >I agree to the terms</BlessCheckbox
    >
    <BlessCheckbox :model-value="true" indeterminate>Indeterminate</BlessCheckbox>
    <BlessCheckbox :model-value="true" disabled>Disabled checked</BlessCheckbox>
    <BlessCheckbox :model-value="false" invalid>Invalid</BlessCheckbox>
  </div>
</template>
