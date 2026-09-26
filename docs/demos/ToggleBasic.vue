<script setup lang="ts">
import { ref } from "vue";
import { BlessToggle } from "blessing-ui";
const bold = ref(false);
const pinned = ref(true);
</script>

<template>
  <div class="row">
    <BlessToggle v-model:pressed="bold">Bold</BlessToggle>
    <BlessToggle v-model:pressed="pinned">Pinned</BlessToggle>
    <BlessToggle size="sm" disabled>Archived</BlessToggle>
  </div>
</template>
