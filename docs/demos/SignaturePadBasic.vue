<script setup lang="ts">
import { ref } from "vue";
import { BlessField, BlessInput, BlessSignaturePad } from "blessing-ui";
const sig = ref("");
const typed = ref("");
</script>

<template>
  <div class="col" style="max-width: 480px">
    <BlessSignaturePad v-model="sig" :height="140" />
    <!-- a pointer-only control always has another way: the same consent, typed -->
    <BlessField label="Or type your full name" description="Counts the same as a signature">
      <BlessInput v-model="typed" autocomplete="name" />
    </BlessField>
    <div v-if="sig" class="row">
      <small>exported:</small>
      <img
        :src="sig"
        alt="signature preview"
        style="height: 48px; border: 1px solid var(--bless-color-border)"
      />
    </div>
  </div>
</template>
