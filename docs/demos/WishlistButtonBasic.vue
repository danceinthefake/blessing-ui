<script setup lang="ts">
import { computed, ref } from "vue";
import { BlessWishlistButton } from "blessing-ui";

const saved = ref(false);
// the count from the server, plus this reader
const count = computed(() => 41 + (saved.value ? 1 : 0));
</script>

<template>
  <div style="display: flex; gap: 12px; align-items: center">
    <BlessWishlistButton v-model="saved" name="USB microphone" :count />
    <BlessWishlistButton :model-value="true" name="Foam panels" />
  </div>
</template>
