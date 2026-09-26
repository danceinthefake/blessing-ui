<script setup lang="ts">
import { ref } from "vue";
import { BlessPagination } from "blessing-ui";
const page = ref(7);
const short = ref(1);
const linked = ref(3);
</script>

<template>
  <div class="col" style="max-width: none">
    <BlessPagination v-model="page" :total="20" />
    <BlessPagination v-model="short" :total="5" />
    <BlessPagination
      v-model="linked"
      :total="12"
      :siblings="2"
      :href="(p: number) => `#page-${p}`"
    />
    <small>page: {{ page }}</small>
  </div>
</template>
