<script setup lang="ts">
import { ref } from "vue";
import { BlessFileInput } from "blessing-ui";
const files = ref<File[]>([]);
</script>

<template>
  <div class="col" style="max-width: 480px">
    <BlessFileInput
      v-model="files"
      multiple
      accept="image/*,.pdf"
      hint="PNG, JPG or PDF · up to 10 MB"
    />
    <BlessFileInput label="Single, invalid" invalid />
    <BlessFileInput label="Disabled" disabled />
  </div>
</template>
