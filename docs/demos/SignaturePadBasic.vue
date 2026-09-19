<script setup lang="ts">
import { ref } from "vue";
import { BlessSignaturePad } from "blessing-ui";
const sig = ref("");
</script>

<template>
  <div class="col" style="max-width: 480px">
    <BlessSignaturePad v-model="sig" :height="140" />
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
