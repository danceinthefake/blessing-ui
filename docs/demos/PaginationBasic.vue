<script setup lang="ts">
import { ref } from "vue";
import { BlessPagination } from "blessing-ui";
const page = ref(7);
</script>

<template>
  <div class="col" style="max-width: none">
    <BlessPagination v-model="page" :total="20" />
    <BlessPagination :model-value="1" :total="5" />
    <BlessPagination
      :model-value="3"
      :total="12"
      :siblings="2"
      :href="(p: number) => `#page-${p}`"
    />
    <small>page: {{ page }}</small>
  </div>
</template>
